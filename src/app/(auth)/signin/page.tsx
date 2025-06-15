'use client'
import { useEffect } from "react";
import Signin from "@/components/auth/signin-page";

export default function AuthPage() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="grid grid-cols-3 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900">
   <div className="">
          <Signin />
   
   </div>
      <div 
      style={{ backgroundImage: 'url("/sign-in-bg.png")', backgroundSize: 'cover', backgroundPosition: 'left' }}
      className="hidden md:flex items-center justify-center col-span-2">     
      </div>
    </div>
  );
}
