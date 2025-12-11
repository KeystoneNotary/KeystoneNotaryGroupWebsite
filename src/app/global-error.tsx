"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary for root layout errors
 * Must include its own <html> and <body> tags since it replaces the root layout
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error - in production, send to monitoring service
    console.error("Critical application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Critical Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
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
            <h1
              className="text-3xl font-semibold mb-3"
              style={{ color: "#E5E4E2" }}
            >
              Application Error
            </h1>

            {/* Description */}
            <p className="text-neutral-400 mb-6 text-lg">
              A critical error has occurred. We&apos;re working to fix this.
            </p>

            {/* Error digest for debugging */}
            {error.digest && (
              <p className="text-xs text-neutral-500 mb-6 font-mono bg-neutral-800 px-4 py-2 rounded-lg inline-block">
                Reference: {error.digest}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={reset}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-200 shadow-lg"
              >
                Reload Application
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error renders without root layout, Link won't work */}
              <a
                href="/"
                className="px-8 py-4 border border-neutral-600 text-neutral-300 font-medium rounded-lg hover:bg-neutral-800 transition-all duration-200"
              >
                Go to Homepage
              </a>
            </div>

            {/* Contact info */}
            <p className="mt-10 text-sm text-neutral-500">
              If this problem persists, please contact us at{" "}
              <a
                href="tel:+12673099000"
                className="text-amber-500 hover:underline"
              >
                (267) 309-9000
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
