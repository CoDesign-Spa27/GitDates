import { cn } from "../../lib/utils";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        {/* Spinner */}
        <div
          className={cn(
            "w-16 h-16 rounded-full border-4 border-t-transparent animate-spin",
            "border-primary" // Uses your theme's primary color
          )}
        ></div>

        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-primary scale-75"></div>
      </div>

      {/* Optional loading text */}
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
