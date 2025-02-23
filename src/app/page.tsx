import Landing from "@/components/landing";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";
export default async function Home() {
 const session = await getServerSession();

  return (
    <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
           <Navbar />
      <Landing />
    
    </div>
  );
}
