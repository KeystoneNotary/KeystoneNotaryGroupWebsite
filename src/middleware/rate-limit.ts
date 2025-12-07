import { NextRequest } from "next/server";
import { createRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { APIResponse } from "@/types";

/**
 * Rate limiting middleware for API routes
 * @param request Next.js request object
 * @returns Response if rate limited, undefined otherwise
 */
export async function rateLimitMiddleware(
  request: NextRequest
): Promise<Response | undefined> {
  // Create rate limiter instance
  const rateLimiter = createRateLimiter();
  
  // If rate limiter is not configured, skip rate limiting
  if (!rateLimiter) {
    return undefined;
  }

  // Get client IP address
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  
  // Check rate limit
  const { success, limit, remaining, reset } = await checkRateLimit(ip, rateLimiter);
  
  // Set rate limit headers
  const headers = {
    "X-RateLimit-Limit": limit?.toString() || "0",
    "X-RateLimit-Remaining": remaining?.toString() || "0",
    "X-RateLimit-Reset": reset?.toString() || "0",
  };

  // If rate limit exceeded, return error response
  if (!success) {
    const response: APIResponse<null> = {
      success: false,
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
    };

    return new Response(JSON.stringify(response), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
  }

  // Add headers to request for downstream use
  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value);
  });

  return undefined;
}
