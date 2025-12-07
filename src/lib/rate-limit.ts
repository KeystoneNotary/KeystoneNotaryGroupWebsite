import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Creates a rate limiter instance using Upstash Redis
 * @returns Ratelimit instance
 */
export function createRateLimiter(): Ratelimit | null {
  // Check if environment variables are configured
  const redisUrl = process.env.UPSTASH_REDIS_URL;
  const redisToken = process.env.UPSTASH_REDIS_TOKEN;

  if (!redisUrl || !redisToken) {
    console.warn("Upstash Redis credentials not configured. Rate limiting disabled.");
    return null;
  }

  try {
    // Initialize Redis connection
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // Create rate limiter with 10 requests per 10 seconds
    return new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    });
  } catch (error) {
    console.error("Failed to initialize rate limiter:", error);
    return null;
  }
}

/**
 * Checks if a request is within rate limits
 * @param identifier Unique identifier for the client (IP address, user ID, etc.)
 * @param rateLimiter Rate limiter instance
 * @returns Object with success status and rate limit info
 */
export async function checkRateLimit(
  identifier: string,
  rateLimiter: Ratelimit | null
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  // If rate limiter is not configured, allow request
  if (!rateLimiter) {
    return { success: true };
  }

  try {
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Allow request if rate limit check fails
    return { success: true };
  }
}
