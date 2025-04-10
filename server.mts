import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || 'localhost';

// Create Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

console.log(handler, "handler")
app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer((req, res) => {
    // Handle Next.js requests
    handler(req, res);
  });

  console.log(httpServer, "httpServer")

  // Initialize Socket.IO on the same server
  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: dev ? '*' : 'your-production-domain.com',
      methods: ['GET', 'POST']
    }
  });

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('message', (msg) => {
      console.log('Message received:', msg);
      io.emit('message', msg);
    });
  });

  // Start the combined server
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO running on ws://${hostname}:${port}/api/socket`);
  });

}).catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
// // this will extend the NextApiResponse to support scoker io (web socket server) because the NextServer does not have the io property
// // this will handle res and req as in real time
// export type NextApiResponseWithSocket = NextApiResponse & {
//     socket:{
//         server:NextServer &{
//             io?:SocketIOServer
//         }
//     }
// }

// // we are not using http so we need to disable bodyParse because web socker does not support json body because its a real time connection
// export const sockerConfig = {
//     api:{
//         bodyParser:false
//     }
// }

 

// // we are creating a new server
// export default async function SocketHandler (
//     req: NextApiRequest,
//     res : NextApiResponseWithSocket
// ) {
//     console.log(res)
//     if (!res.socket?.server) {
//         console.error("Server object is undefined in res.socket");
//         return;
//       }
    
//       if (!io) {
//         console.log('Initializing new Socket.IO server');
//         io = new SocketIOServer(res.socket.server as any, {
//           path: '/api/socket',
//           cors :{
//             origin : '*'
//           }
//         });
//         res.socket.server.io = io;
    
//         io.on('connection', async (socket) => {
//           console.log('A user connected:', socket.id);
    
//           // Example event listeners
//           socket.on('disconnect', () => {
//             console.log('User disconnected:', socket.id);
//           });
    
//           socket.on('message', (msg) => {
//             console.log('Message received:', msg);
//             io?.emit('message', msg); // Broadcast message to all connected clients
//           });
//         });
    
//         console.log('Socket.IO server started');
//       } else {
//         console.log('Socket.IO server already running');
//       }
    
//       res.end();

//     // //authenticate user first
//     // io.use(async (Socket,next) =>{

//     //     const session = await getServerSession(authOptions);
//     //     if(session?.user?.email){
//     //         const user = await prisma.user.findUnique({
//     //             where:{ email : session.user.email}
//     //         })
//     //         if(user){
//     //             Socket.data.user = user;
//     //             return next();
//     //         }
//     //     }
//     //     return next(new Error('Unauthorized'))
//     // });

    

// }