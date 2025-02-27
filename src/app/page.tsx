import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";
import Hero from "@/components/Hero";

export default async function Home() {
 const session = await getServerSession();

  return (
    <div >
           <Navbar /> 
           
      <Hero />
    
    </div>
  );
}
