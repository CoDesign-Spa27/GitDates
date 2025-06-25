import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";
import prisma from "./src/lib/prisma";
import { verifySocketToken } from "./src/lib/socket-auth";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io: SocketIOServer;

// Store online users and their connections
const onlineUsers = new Map<string, Set<string>>();
const userSockets = new Map<string, string>();
const lastSeen = new Map<string, string>();

async function startServer() {
  await app.prepare();

  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    cors: {
      origin: dev ? "*" : "https://your-production-domain.com",
      methods: ["GET", "POST"],
    }
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error("Authentication token required"));
      }
      
      const decodedToken = verifySocketToken(token);
      if (!decodedToken) {
        return next(new Error("Invalid token"));
      }
      
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId }
      });
      
      if (!user) {
        return next(new Error("User not found"));
      }
      
      socket.data.user = user;
      return next();
    } catch (err) {
      console.error("Socket middleware error:", err);
      return next(new Error("Authentication failed"));
    }
  });

  // Socket connection handling
  io.on("connection", async (socket) => {
    const user = socket.data.user;
    if (!user) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${user.name} (${user.id})`);
    
    // Store user connection info
    if(!onlineUsers.has(user.id)){
      onlineUsers.set(user.id,new Set())
    }
    onlineUsers.get(user.id)!.add(socket.id)
    userSockets.set(socket.id, user.id);
    
    // Join user's private room
    socket.join(user.id);
    
    // Broadcast online status
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    
 
    // Join conversation rooms
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" },
        ],
      },
      include: { conversation: true },
    });
    
    matches.forEach(match => {
      if (match.conversation) {
        socket.join(`conversation:${match.conversation.id}`);
      }
    });

    // Message handling
    socket.on("sendMessage", async ({ conversationId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: user.id,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: message.id,
            updatedAt: new Date(),
          },
        });
        
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { match: true },
        });
   
        if (conversation) {
          const match = conversation.match;
          const recipientId = match.senderId === user.id ? match.receiverId : match.senderId;
         
          io.to(`conversation:${conversationId}`).emit("newMessage", message);
          io.to(recipientId).emit("notification", {
            type: "newMessage",
            conversationId,
            matchId: match.id,
            senderId: user.id,
            message,
          });
        }
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit("userTyping", {
        userId: user.id,
        isTyping,
      });
    });

    // Read receipts
    socket.on("markAsRead", async ({ conversationId }) => {
      try {
        await prisma.message.updateMany({
          where: {
            conversationId,
            senderId: { not: user.id },
            read: false,
          },
          data: { read: true },
        });
        
        socket.to(`conversation:${conversationId}`).emit("messagesRead", {
          conversationId,
          readBy: user.id,
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Disconnect handling
    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(user.id)
      if(sockets){
        sockets.delete(socket.id)
      }
      if(sockets?.size === 0){
        lastSeen.set(user.id, new Date().toLocaleString());
        onlineUsers.delete(user.id);
        userSockets.delete(socket.id);
      }
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      io.emit("userLastSeen", { [user.id]: lastSeen.get(user.id) });
    });
  });

  httpServer.listen(port, () => {
    console.log(`> ✅ Ready on http://${hostname}:${port}`);
    console.log(`> 📡 Socket.IO running on ws://${hostname}:${port}/api/socket`);
  });
}

// Initialize on import
startServer().catch((err) => {
  console.error("❌ Server startup error:", err);
  process.exit(1);
});

// Socket utility functions
export function getUserSocketId(userId: string) {
  return onlineUsers.get(userId);
}

export function emitToUser(userId: string, event: string, data: any) {
  const socketIds = onlineUsers.get(userId);
  if (socketIds && socketIds.size > 0) {
    io.to(Array.from(socketIds)).emit(event, data);
    return true;
  }
  return false;
}

export function getOnlineStatus(userId: string) {
  return onlineUsers.has(userId);
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server not initialized yet");
  }
  return io;
}
