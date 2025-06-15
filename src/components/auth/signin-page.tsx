"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { GithubOauthButton } from "./social-auth";

const Signin = () => {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

 
  const handleSignInWithGithub = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signIn('github', { redirect: true, callbackUrl } );
     
    } catch (error) {
      console.error(error);
      setError("An error occurred during Google sign-in");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
    className="max-w-xs w-full h-40 rounded-lg shadow-lg bg-neutral-800 border "
  > 
  <div className="flex flex-col space-y-4 py-4 justify-center items-center">
    <h1 className="text-white font-riffic text-center w-full">Get started with GitDate</h1>
      <div className="flex items-center w-full">
        <div className="flex-1 h-px bg-[#D1627B]"></div>
        <span className="px-4 text-sm text-gray-200 font-mono">Sign in with</span>
        <div className="flex-1 h-px bg-[#D1627B] "></div>
      </div>
   
            <GithubOauthButton
              handleSignIn={(e) => handleSignInWithGithub(e)}
              label="Github"
              />
              </div>
 
       </div>
    </div>
  );
};

export default Signin;