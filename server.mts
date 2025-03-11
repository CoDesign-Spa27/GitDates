import { createServer } from "node:http";
import { Server as NetServer } from "http";
import {Server as SocketIOServer } from 'socket.io'
import { NextApiRequest, NextApiResponse } from "next";
import { NextServer } from "next/dist/server/next";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import next from "next";
// import prisma from "@/lib/prisma";

console.log('Starting server...');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({dev , hostname, port});

const handle = app.getRequestHandler();

let io : SocketIOServer | undefined;
app.prepare().then(() => {
  const httpServer = createServer(handle);
 
  io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors :{ origin : '*'},
    
  });
   io.on('connection', async (socket) => { 
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
    socket.on('message', (msg) => {
      console.log('Message received:', msg);
      io?.emit('message', msg); // Broadcast message to all connected clients
    });
   })

   httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    });
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