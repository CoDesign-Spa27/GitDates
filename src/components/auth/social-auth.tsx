"use client"
import { Button } from "../ui/button";

interface GithubOauthButton {
  label: string,
  handleSignIn: (e: any) => void;
}

export const GithubOauthButton = ({ label, handleSignIn }: GithubOauthButton) => {
  return ( 
<button
  onClick={handleSignIn}
  className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden w-full max-w-64 h-10"
>
  <span className="absolute inset-0 rounded-full overflow-hidden">
    <span className="inset-0 absolute pointer-events-none select-none">
      <span
        className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
        style={{
          background: "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))"
        }}
      ></span>
    </span>
  </span>

  <span
    className="inset-0 absolute pointer-events-none select-none"
    style={{
      animation: "10s ease-in-out 0s infinite alternate none running border-glow-translate"
    }}
  >
    <span
      className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
      style={{
        animation: "10s ease-in-out 0s infinite alternate none running border-glow-scale",
        background: "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))"
      }}
    > </span>
  </span>

  <span
    className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full"
  >
    <span
      className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80 dark:opacity-100"
        style={{
          animation: "14s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s infinite alternate none running star-rotate"
        }}
      >
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
          fill="currentColor"
        />
      </svg>
      <span
        className="rounded-full size-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
        style={{
          animation: "14s ease-in-out 0s infinite alternate none running star-shine",
          background: "linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))"
        }}
      ></span>
    </span>
    <span
      className="bg-gradient-to-b ml-1.5 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-xs text-transparent group-hover:scale-105 transition transform-gpu font-riffic"
    >
{label}
    </span>
  </span>
</button>

  )
}