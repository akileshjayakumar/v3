"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#171717] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f2f1ec] mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-[#f2f1ec]/70">
            An unexpected error occurred. Please try again or return to the home page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="default"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go home
            </a>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-gray-400 dark:text-[#f2f1ec]/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
