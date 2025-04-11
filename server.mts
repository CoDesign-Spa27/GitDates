import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

// Create Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let io:SocketIOServer;
app
  .prepare()
  .then(() => {
    // Create HTTP server
    const httpServer = createServer((req, res) => {
      // Handle Next.js requests
      handler(req, res);
    });

    console.log(httpServer, "httpServer");

    // Initialize Socket.IO on the same server
     io = new SocketIOServer(httpServer, {
      path: "/api/socket",
      cors: {
        origin: dev ? "*" : "your-production-domain.com",
        methods: ["GET", "POST"],
      },
    });

    // Socket.IO connection handler
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      socket.on("message", (msg) => {
        console.log("Message received:", msg);
        io.emit("message", msg);
      });
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

  export {io as socketServer};