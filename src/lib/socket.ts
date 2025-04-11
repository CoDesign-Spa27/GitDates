import { getServerSession } from "next-auth";
import { socketServer } from "../../server.mjs";
import { Server as SocketIOServer } from "socket.io";
import { authOptions } from "./auth";
import prisma from "./prisma";
if(!socketServer){
  throw new Error("Socket server is not initialized");
}

socketServer.use(async (socket, next) => {
  try{

    const session = await getServerSession(authOptions)
    if(session?.user?.email){
      const user = await prisma.user.findUnique({ 
        where: {
          email: session.user.email
        }
      })
      if(user){
        socket.data.user = user
        return next()
      }
    }
  }catch (err){
    console.error("Error in socket middleware:", err)
  }
 })

 const userConnections = new Map();
 
 socketServer.on("connection", async (socket)=>{
   console.log(socket, "socket.id")
   const user = socket.data.user;
    if (!user) {
      socket.disconnect();
      return;
    }

    userConnections.set(user.id,socket.id);

    socket.join(user.id);

    
 })
 
