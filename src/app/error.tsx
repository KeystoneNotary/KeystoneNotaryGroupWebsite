"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for route segments
 * Catches errors in child components and displays a recovery UI
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development, could send to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-platinum mb-2">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-neutral-400 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {/* Error digest for debugging (if available) */}
        {error.digest && (
          <p className="text-xs text-neutral-500 mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-neutral-600 text-neutral-300 font-medium rounded-lg hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-200"
          >
            Return Home
          </Link>
        </div>

        {/* Contact info */}
        <p className="mt-8 text-sm text-neutral-500">
          Need help?{" "}
          <a
            href="tel:+12673099000"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Call (267) 309-9000
          </a>
        </p>
      </div>
    </div>
  );
}
