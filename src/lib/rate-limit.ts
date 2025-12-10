import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Singleton Redis instance to avoid multiple connections
let redisInstance: Redis | null = null;

function getRedis(): Redis | null {
  if (redisInstance) return redisInstance;

  const redisUrl = process.env.UPSTASH_REDIS_URL;
  const redisToken = process.env.UPSTASH_REDIS_TOKEN;

  if (!redisUrl || !redisToken) {
    return null;
  }

  redisInstance = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  return redisInstance;
}

/**
 * Creates a rate limiter instance using Upstash Redis
 * Default: 10 requests per 10 seconds (general API)
 * @returns Ratelimit instance
 */
export function createRateLimiter(): Ratelimit | null {
  const redis = getRedis();

  if (!redis) {
    console.warn("Upstash Redis credentials not configured. Rate limiting disabled.");
    return null;
  }

  try {
    // Create rate limiter with 10 requests per 10 seconds
    return new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "ratelimit_general",
    });
  } catch (error) {
    console.error("Failed to initialize rate limiter:", error);
    return null;
  }
}

/**
 * Creates a stricter rate limiter for authentication endpoints
 * 5 attempts per 60 seconds to prevent brute force attacks
 * @returns Ratelimit instance
 */
export function createAuthRateLimiter(): Ratelimit | null {
  const redis = getRedis();

  if (!redis) {
    console.warn("Upstash Redis credentials not configured. Auth rate limiting disabled.");
    return null;
  }

  try {
    // Stricter limits: 5 attempts per minute
    return new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "ratelimit_auth",
    });
  } catch (error) {
    console.error("Failed to initialize auth rate limiter:", error);
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
