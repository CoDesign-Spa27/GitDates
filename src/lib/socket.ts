import { getServerSession } from "next-auth";
import { socketServer } from "../../server.mjs";
import { Server as SocketIOServer } from "socket.io";
import { authOptions } from "./auth";
import prisma from "./prisma";
import { verifySocketToken } from "./socket-auth";

if(!socketServer) {
  throw new Error("Socket server is not initialized");
}

// Store user connections
const userConnections = new Map();

socketServer.use(async (socket, next) => {
  try {
    // Get auth token from socket handshake auth
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication token is required"));
    }
    
    // Verify token
    const decodedToken = verifySocketToken(token);
    if (!decodedToken) {
      return next(new Error("Invalid authentication token"));
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId }
    });
    
    if (!user) {
      return next(new Error("User not found"));
    }
    
    // Set user data on socket
    socket.data.user = user;
    return next();
  } catch (err) {
    console.error("Error in socket middleware:", err);
    return next(new Error("Internal server error"));
  }
});

socketServer.on("connection", async (socket) => {
  const user = socket.data.user;
  if (!user) {
    socket.disconnect();
    return;
  }

  console.log(`User connected: ${user.name} (${user.id})`);
  
  // Store user connection
  userConnections.set(user.id, socket.id);
  
  // Join personal room
  socket.join(user.id);
  
  // Join all conversation rooms the user is part of
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { senderId: user.id, status: "ACCEPTED" },
        { receiverId: user.id, status: "ACCEPTED" },
      ],
    },
    include: {
      conversation: true,
    },
  });
  
  matches.forEach(match => {
    if (match.conversation) {
      socket.join(`conversation:${match.conversation.id}`);
    }
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ conversationId, content }) => {
    try {
      // Create message in database
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
      
      // Update last message in conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageId: message.id,
          updatedAt: new Date(),
        },
      });
      
      // Get conversation to find the recipient
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { match: true },
      });
      
      if (conversation) {
        const match = conversation.match;
        const recipientId = match.senderId === user.id ? match.receiverId : match.senderId;
        
        // Emit to conversation room and recipient's personal room
        socketServer.to(`conversation:${conversationId}`).emit("newMessage", message);
        socketServer.to(recipientId).emit("notification", {
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

  // Handle typing events

socket.on("typing", ({ conversationId, isTyping }) => {
  socket.to(`conversation:${conversationId}`).emit("userTyping", {
    userId: user.id,
    isTyping,
  });
});

  // Handle read receipts
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

  socket.on("disconnect", () => {
    userConnections.delete(user.id);
  });
});

export function getUserSocketId(userId: string) {
  return userConnections.get(userId);
}

export function emitToUser(userId: string, event: string, data: any) {
  const socketId = userConnections.get(userId);
  if (socketId) {
    socketServer.to(socketId).emit(event, data);
    return true;
  }
  return false;
}

export function getOnlineStatus(userId: string) {
  return userConnections.has(userId);
}

export { socketServer };