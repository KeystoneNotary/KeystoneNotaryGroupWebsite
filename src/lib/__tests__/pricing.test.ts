/**
 * Tests for Pricing Calculator
 *
 * Ensures accurate pricing calculations for all service types and scenarios
 */

import {
  calculateNotaryPrice,
  calculatePriceBreakdown,
  PRICING_CONFIG,
} from "../pricing";

describe("Pricing Calculator", () => {
  describe("calculateNotaryPrice", () => {
    it("should return base rate for 0 distance with standard service", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE);
    });

    it("should not charge mileage for distances under free mileage limit", () => {
      const price = calculateNotaryPrice({
        distance: 5,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE);
    });

    it("should not charge mileage at exactly the free mileage limit", () => {
      const price = calculateNotaryPrice({
        distance: PRICING_CONFIG.FREE_MILEAGE,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE);
    });

    it("should charge mileage for distances over the free limit", () => {
      const distance = 20; // 10 miles over free limit
      const expectedMileage = (distance - PRICING_CONFIG.FREE_MILEAGE) * PRICING_CONFIG.MILEAGE_RATE;
      const price = calculateNotaryPrice({
        distance,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(Math.round(PRICING_CONFIG.BASE_RATE + expectedMileage));
    });

    it("should add loan-signing service fee", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "loan-signing",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE + PRICING_CONFIG.SERVICE_FEES["loan-signing"]);
    });

    it("should add apostille service fee", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "apostille",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE + PRICING_CONFIG.SERVICE_FEES.apostille);
    });

    it("should add estate service fee", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "estate",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE + PRICING_CONFIG.SERVICE_FEES.estate);
    });

    it("should add same-day urgency fee", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "standard",
        urgency: "same-day",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE + PRICING_CONFIG.URGENCY_FEES["same-day"]);
    });

    it("should add after-hours urgency fee", () => {
      const price = calculateNotaryPrice({
        distance: 0,
        serviceType: "standard",
        urgency: "after-hours",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE + PRICING_CONFIG.URGENCY_FEES["after-hours"]);
    });

    it("should combine all fees correctly", () => {
      const distance = 25; // 15 miles over free limit
      const expectedMileage = (distance - PRICING_CONFIG.FREE_MILEAGE) * PRICING_CONFIG.MILEAGE_RATE;
      const price = calculateNotaryPrice({
        distance,
        serviceType: "loan-signing",
        urgency: "same-day",
      });
      const expected =
        PRICING_CONFIG.BASE_RATE +
        expectedMileage +
        PRICING_CONFIG.SERVICE_FEES["loan-signing"] +
        PRICING_CONFIG.URGENCY_FEES["same-day"];
      expect(price).toBe(Math.round(expected));
    });

    it("should handle negative distance as 0", () => {
      const price = calculateNotaryPrice({
        distance: -10,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE);
    });

    it("should handle NaN distance as 0", () => {
      const price = calculateNotaryPrice({
        distance: NaN,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(price).toBe(PRICING_CONFIG.BASE_RATE);
    });

    it("should return rounded values", () => {
      // Distance that would produce a fractional result
      const distance = 11.5; // 1.5 miles over free limit
      const price = calculateNotaryPrice({
        distance,
        serviceType: "standard",
        urgency: "standard",
      });
      expect(Number.isInteger(price)).toBe(true);
    });
  });

  describe("calculatePriceBreakdown", () => {
    it("should return correct breakdown structure", () => {
      const breakdown = calculatePriceBreakdown({
        distance: 0,
        serviceType: "standard",
        urgency: "standard",
      });

      expect(breakdown).toHaveProperty("baseRate");
      expect(breakdown).toHaveProperty("mileageFee");
      expect(breakdown).toHaveProperty("serviceFee");
      expect(breakdown).toHaveProperty("urgencyFee");
      expect(breakdown).toHaveProperty("total");
    });

    it("should calculate breakdown correctly for complex scenario", () => {
      const distance = 30;
      const breakdown = calculatePriceBreakdown({
        distance,
        serviceType: "loan-signing",
        urgency: "after-hours",
      });

      expect(breakdown.baseRate).toBe(PRICING_CONFIG.BASE_RATE);
      expect(breakdown.mileageFee).toBe(
        (distance - PRICING_CONFIG.FREE_MILEAGE) * PRICING_CONFIG.MILEAGE_RATE
      );
      expect(breakdown.serviceFee).toBe(PRICING_CONFIG.SERVICE_FEES["loan-signing"]);
      expect(breakdown.urgencyFee).toBe(PRICING_CONFIG.URGENCY_FEES["after-hours"]);
      expect(breakdown.total).toBe(
        breakdown.baseRate +
          breakdown.mileageFee +
          breakdown.serviceFee +
          breakdown.urgencyFee
      );
    });

    it("should have zero mileage fee for distance under limit", () => {
      const breakdown = calculatePriceBreakdown({
        distance: 5,
        serviceType: "standard",
        urgency: "standard",
      });

      expect(breakdown.mileageFee).toBe(0);
    });

    it("should have zero service fee for standard service", () => {
      const breakdown = calculatePriceBreakdown({
        distance: 0,
        serviceType: "standard",
        urgency: "standard",
      });

      expect(breakdown.serviceFee).toBe(0);
    });

    it("should have zero urgency fee for standard urgency", () => {
      const breakdown = calculatePriceBreakdown({
        distance: 0,
        serviceType: "standard",
        urgency: "standard",
      });

      expect(breakdown.urgencyFee).toBe(0);
    });
  });

  describe("PRICING_CONFIG", () => {
    it("should have correct base rate", () => {
      expect(PRICING_CONFIG.BASE_RATE).toBe(15);
    });

    it("should have correct free mileage", () => {
      expect(PRICING_CONFIG.FREE_MILEAGE).toBe(10);
    });

    it("should have correct mileage rate", () => {
      expect(PRICING_CONFIG.MILEAGE_RATE).toBe(2.5);
    });

    it("should have all required service types", () => {
      expect(PRICING_CONFIG.SERVICE_FEES).toHaveProperty("standard");
      expect(PRICING_CONFIG.SERVICE_FEES).toHaveProperty("loan-signing");
      expect(PRICING_CONFIG.SERVICE_FEES).toHaveProperty("apostille");
      expect(PRICING_CONFIG.SERVICE_FEES).toHaveProperty("estate");
    });

    it("should have all required urgency types", () => {
      expect(PRICING_CONFIG.URGENCY_FEES).toHaveProperty("standard");
      expect(PRICING_CONFIG.URGENCY_FEES).toHaveProperty("same-day");
      expect(PRICING_CONFIG.URGENCY_FEES).toHaveProperty("after-hours");
    });
  });
});
