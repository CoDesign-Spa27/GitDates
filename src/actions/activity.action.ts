import { authOptions } from "@/lib/auth"
import { ErrorHandler } from "@/lib/error";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"

export const getActivitySummary = async() =>{
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.email) {
            throw new ErrorHandler('Not Authenticated','UNAUTHORIZED');
        }
        const user = await prisma.user.findUnique({
            where:{
                email: session.user.email
            },
        });
        if(!user){
            throw new ErrorHandler("User not found", 'NOT_FOUND');
        }
 // will be implemented after getting activity in action
    }catch(err){

    }
}