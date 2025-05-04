import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

// Create Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io: SocketIOServer;
app
  .prepare()
  .then(() => {
    // Create HTTP server
    const httpServer = createServer((req, res) => {
      // Handle Next.js requests
      handler(req, res);
    });

    // Initialize Socket.IO on the same server with improved settings for real-time messaging
    io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: {
        origin: dev ? "*" : "your-production-domain.com",
        methods: ["GET", "POST"],
      },
      // Improved settings for real-time messaging
      transports: ['websocket', 'polling'],
      pingInterval: 10000, // ping every 10 seconds
      pingTimeout: 5000,   // consider disconnected after 5 seconds of no response
      // Disable cluster mode buffering for immediate message delivery
      allowEIO3: true,
      connectTimeout: 45000,
    });

    // Start the combined server
    httpServer.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO running on ws://${hostname}:${port}/api/socket`);
    });
  })
  .catch((err) => {
    console.error("Server startup error:", err);
    process.exit(1);
  });

export { io as socketServer };