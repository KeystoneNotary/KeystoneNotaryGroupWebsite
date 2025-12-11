import { NextRequest, NextResponse } from "next/server";
import { calculateDistance, isDistanceError } from "@/lib/distance-calculator";
import { calculatePriceBreakdown, ServiceType, UrgencyType } from "@/lib/pricing";
import { rateLimitMiddleware } from "@/middleware/rate-limit";
import { z } from "zod";

/**
 * POST /api/calculate-distance
 *
 * Calculates driving distance from Hellertown office to customer address
 * and returns accurate price breakdown.
 *
 * Request body:
 * {
 *   address: string;
 *   city: string;
 *   state: string;
 *   serviceType?: ServiceType;
 *   urgency?: UrgencyType;
 * }
 *
 * Response:
 * {
 *   success: true;
 *   distance: number;
 *   duration: number;
 *   origin: string;
 *   destination: string;
 *   breakdown: PriceBreakdown;
 * }
 */

const requestSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().refine((val) => val === "Pennsylvania", {
    message: "Services only available in Pennsylvania",
  }),
  serviceType: z.enum(["standard", "loan-signing", "apostille", "estate"]).optional(),
  urgency: z.enum(["standard", "same-day", "after-hours"]).optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitMiddleware(request as NextRequest);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: validation.error.issues[0]?.message || "Invalid request data",
        },
        { status: 400 }
      );
    }

    const { address, city, state, serviceType = "standard", urgency = "standard" } = validation.data;

    // Calculate distance
    const distanceResult = await calculateDistance(address, city, state);

    // Handle distance calculation errors
    if (isDistanceError(distanceResult)) {
      return NextResponse.json(
        {
          success: false,
          error: distanceResult.error,
          message: distanceResult.message,
        },
        { status: 500 }
      );
    }

    // Calculate price breakdown with actual distance
    const breakdown = calculatePriceBreakdown({
      distance: distanceResult.distanceInMiles,
      serviceType: serviceType as ServiceType,
      urgency: urgency as UrgencyType,
    });

    return NextResponse.json({
      success: true,
      distance: distanceResult.distanceInMiles,
      duration: distanceResult.durationMinutes,
      origin: distanceResult.origin,
      destination: distanceResult.destination,
      breakdown,
    });
  } catch (error) {
    console.error("Distance calculation API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to calculate distance",
      },
      { status: 500 }
    );
  }
}
