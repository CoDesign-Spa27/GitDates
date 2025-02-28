import Navbar from "@/components/section/navbar";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";
import Hero from "@/components/section/Hero";
import { Features } from "@/components/section/features";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div>
      <Navbar />

      <Hero />
      <Features />
    </div>
  );
}
