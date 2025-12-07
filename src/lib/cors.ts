import Cors from "cors";

/**
 * Configures CORS middleware with sensible defaults for the API
 * @returns CORS middleware instance
 */
export function configureCORS(): ReturnType<typeof Cors> {
  return Cors({
    // Allow requests from the same origin
    origin: process.env.NODE_ENV === "production" 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : "*",
    // Allow common HTTP methods
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // Allow common headers
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    // Expose headers that clients can access
    exposedHeaders: [
      "Content-Length",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
    ],
    // Allow credentials (cookies, authorization headers)
    credentials: true,
    // Set max age for preflight requests
    maxAge: 86400, // 24 hours
  });
}

// Default export for compatibility
export default configureCORS;
