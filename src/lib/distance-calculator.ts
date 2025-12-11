/**
 * Distance Calculator Utility
 *
 * Calculates driving distance from Hellertown, PA office (18055) to customer location
 * using Google Maps Distance Matrix API.
 */

const HELLERTOWN_OFFICE = "Hellertown, PA 18055";

export interface DistanceResult {
  distanceInMiles: number;
  durationMinutes: number;
  origin: string;
  destination: string;
}

export interface DistanceError {
  error: string;
  message: string;
}

/**
 * Calculate driving distance from Hellertown office to customer address
 * Uses Google Maps Distance Matrix API
 *
 * @param address - Customer street address
 * @param city - Customer city
 * @param state - Customer state (should be "Pennsylvania")
 * @returns Promise with distance in miles and duration, or error
 */
export async function calculateDistance(
  address: string,
  city: string,
  state: string
): Promise<DistanceResult | DistanceError> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_MAPS_API_KEY not configured - distance calculation unavailable");
    return {
      error: "DISTANCE_API_UNAVAILABLE",
      message: "Distance calculation service is not configured",
    };
  }

  // Construct full destination address
  const destination = `${address}, ${city}, ${state}`;

  try {
    // Call Google Distance Matrix API
    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.append("origins", HELLERTOWN_OFFICE);
    url.searchParams.append("destinations", destination);
    url.searchParams.append("units", "imperial"); // Get results in miles
    url.searchParams.append("mode", "driving");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    // Check for API errors
    if (data.status !== "OK") {
      console.error("Distance Matrix API error:", data.status, data.error_message);
      return {
        error: "DISTANCE_API_ERROR",
        message: data.error_message || "Failed to calculate distance",
      };
    }

    // Extract distance data
    const element = data.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
      console.error("Distance calculation failed:", element?.status);
      return {
        error: "DISTANCE_CALCULATION_FAILED",
        message: "Could not calculate distance to this address",
      };
    }

    // Convert meters to miles and seconds to minutes
    const distanceInMeters = element.distance.value;
    const distanceInMiles = distanceInMeters / 1609.34; // 1 mile = 1609.34 meters
    const durationInSeconds = element.duration.value;
    const durationMinutes = Math.round(durationInSeconds / 60);

    return {
      distanceInMiles: Math.round(distanceInMiles * 10) / 10, // Round to 1 decimal
      durationMinutes,
      origin: HELLERTOWN_OFFICE,
      destination: data.destination_addresses[0] || destination,
    };
  } catch (error) {
    console.error("Distance calculation error:", error);
    return {
      error: "DISTANCE_API_ERROR",
      message: "Failed to connect to distance calculation service",
    };
  }
}

/**
 * Type guard to check if result is an error
 */
export function isDistanceError(
  result: DistanceResult | DistanceError
): result is DistanceError {
  return "error" in result;
}
