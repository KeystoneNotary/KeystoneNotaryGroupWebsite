/**
 * Tests for Distance Calculator Utility
 */

import { calculateDistance, isDistanceError } from "../distance-calculator";

// Mock fetch globally
global.fetch = jest.fn();

describe("calculateDistance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.GOOGLE_MAPS_API_KEY;
  });

  it("should return error when API key is not configured", async () => {
    const result = await calculateDistance("123 Main St", "Bethlehem", "Pennsylvania");

    expect(isDistanceError(result)).toBe(true);
    if (isDistanceError(result)) {
      expect(result.error).toBe("DISTANCE_API_UNAVAILABLE");
      expect(result.message).toContain("not configured");
    }
  });

  it("should calculate distance successfully with valid response", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    const mockResponse = {
      status: "OK",
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { value: 16093.4 }, // 10 miles in meters
              duration: { value: 1200 }, // 20 minutes in seconds
            },
          ],
        },
      ],
      destination_addresses: ["123 Main St, Bethlehem, PA, USA"],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await calculateDistance("123 Main St", "Bethlehem", "Pennsylvania");

    expect(isDistanceError(result)).toBe(false);
    if (!isDistanceError(result)) {
      expect(result.distanceInMiles).toBe(10);
      expect(result.durationMinutes).toBe(20);
      expect(result.origin).toBe("Hellertown, PA 18055");
      expect(result.destination).toBe("123 Main St, Bethlehem, PA, USA");
    }
  });

  it("should handle API error status", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    const mockResponse = {
      status: "REQUEST_DENIED",
      error_message: "Invalid API key",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await calculateDistance("123 Main St", "Bethlehem", "Pennsylvania");

    expect(isDistanceError(result)).toBe(true);
    if (isDistanceError(result)) {
      expect(result.error).toBe("DISTANCE_API_ERROR");
      expect(result.message).toContain("Invalid API key");
    }
  });

  it("should handle element-level errors", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    const mockResponse = {
      status: "OK",
      rows: [
        {
          elements: [
            {
              status: "NOT_FOUND",
            },
          ],
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await calculateDistance("Invalid Address", "Nowhere", "Pennsylvania");

    expect(isDistanceError(result)).toBe(true);
    if (isDistanceError(result)) {
      expect(result.error).toBe("DISTANCE_CALCULATION_FAILED");
      expect(result.message).toContain("Could not calculate distance");
    }
  });

  it("should handle network errors", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await calculateDistance("123 Main St", "Bethlehem", "Pennsylvania");

    expect(isDistanceError(result)).toBe(true);
    if (isDistanceError(result)) {
      expect(result.error).toBe("DISTANCE_API_ERROR");
      expect(result.message).toContain("Failed to connect");
    }
  });

  it("should round distance to 1 decimal place", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    const mockResponse = {
      status: "OK",
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { value: 24140.1 }, // 15 miles in meters
              duration: { value: 1800 },
            },
          ],
        },
      ],
      destination_addresses: ["456 Oak Ave, Allentown, PA, USA"],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await calculateDistance("456 Oak Ave", "Allentown", "Pennsylvania");

    expect(isDistanceError(result)).toBe(false);
    if (!isDistanceError(result)) {
      expect(result.distanceInMiles).toBe(15);
    }
  });

  it("should call Google Distance Matrix API with correct parameters", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-api-key";

    const mockResponse = {
      status: "OK",
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { value: 16093.4 },
              duration: { value: 1200 },
            },
          ],
        },
      ],
      destination_addresses: ["123 Main St, Bethlehem, PA, USA"],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await calculateDistance("123 Main St", "Bethlehem", "Pennsylvania");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://maps.googleapis.com/maps/api/distancematrix/json")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("origins=Hellertown%2C+PA+18055")
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("destinations=123+Main+St%2C+Bethlehem%2C+Pennsylvania")
    );
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("units=imperial"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("mode=driving"));
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("key=test-api-key"));
  });
});

describe("isDistanceError", () => {
  it("should return true for error objects", () => {
    const error = {
      error: "DISTANCE_API_ERROR",
      message: "Failed to connect",
    };

    expect(isDistanceError(error)).toBe(true);
  });

  it("should return false for success objects", () => {
    const success = {
      distanceInMiles: 10,
      durationMinutes: 20,
      origin: "Hellertown, PA 18055",
      destination: "123 Main St, Bethlehem, PA, USA",
    };

    expect(isDistanceError(success)).toBe(false);
  });
});
