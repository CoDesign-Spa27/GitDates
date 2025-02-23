import Landing from "@/components/landing";
import { getServerSession } from "next-auth";

export default async function Home() {
 const session = await getServerSession();

  return (
    <div className="">
      <Landing />
      <div className="flex flex-col items-center justify-center"> 
        <h1>Welcome to the best AI code editor</h1>
      </div>
    </div>
  );
}
