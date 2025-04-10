import Navbar from "@/components/section/navbar";
import { getServerSession } from "next-auth";
import { cn } from "@/lib/utils";
import Hero from "@/components/section/Hero";
import { Features } from "@/components/section/features";
import HowItWorks from "@/components/section/howitworks";
import FAQSection from "@/components/section/faq";
import Footer from "@/components/section/footer";
import Chat from "@/components/socket-text";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div>

      <Navbar />
      <Chat />
      <Hero />
      <Features />
      <HowItWorks />
      <FAQSection />
      <Footer />
    </div>
  );
}
