import { ChatEventEnum } from "@/constants"
import { Server as NetServer } from "http";
import {Server as SocketIOServer } from 'socket.io'
import { NextApiRequest, NextApiResponse } from "next";
import { NextServer } from "next/dist/server/next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "@/lib/prisma";

// this will extend the NextApiResponse to support scoker io (web socket server) because the NextServer does not have the io property
// this will handle res and req as in real time
export type NextApiResponseWithSocket = NextApiResponse & {
    socket:{
        server:NextServer &{
            io?:SocketIOServer
        }
    }
}

// we are not using http so we need to disable bodyParse because web socker does not support json body because its a real time connection
export const sockerConfig = {
    api:{
        bodyParser:false
    }
}

let io : SocketIOServer | undefined;

// we are creating a new server
export default async function SocketHandler (
    req: NextApiRequest,
    res : NextApiResponseWithSocket
) {
    console.log(res)
    if (!res.socket?.server) {
        console.error("Server object is undefined in res.socket");
        return;
      }
    
      if (!io) {
        console.log('Initializing new Socket.IO server');
        io = new SocketIOServer(res.socket.server as any, {
          path: '/api/socket',
        });
        res.socket.server.io = io;
    
        io.on('connection', async (socket) => {
          console.log('A user connected:', socket.id);
    
          // Example event listeners
          socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
          });
    
          socket.on('message', (msg) => {
            console.log('Message received:', msg);
            io?.emit('message', msg); // Broadcast message to all connected clients
          });
        });
    
        console.log('Socket.IO server started');
      } else {
        console.log('Socket.IO server already running');
      }
    
      res.end();

    //authenticate user first
    io.use(async (Socket,next) =>{

        const session = await getServerSession(authOptions);
        if(session?.user?.email){
            const user = await prisma.user.findUnique({
                where:{ email : session.user.email}
            })
            if(user){
                Socket.data.user = user;
                return next();
            }
        }
        return next(new Error('Unauthorized'))
    });

    

}