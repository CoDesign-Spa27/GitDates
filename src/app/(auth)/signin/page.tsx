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
    <div className="grid grid-cols-1 md:grid-cols-3 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 min-h-screen">
      <div className="flex items-center justify-center p-4 md:p-0">
        <Signin />
      </div>
      <div 
        style={{ backgroundImage: 'url("/sign-in-bg.png")', backgroundSize: 'cover', backgroundPosition: 'left' }}
        className="hidden md:flex items-center justify-center col-span-2">     
      </div>
    </div>
  );
}
