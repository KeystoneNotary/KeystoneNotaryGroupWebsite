import { calculateNotaryPrice, NotaryPriceInput } from '@/lib/pricing';

describe('calculateNotaryPrice', () => {
  describe('Base Rate', () => {
    it('returns base rate of $15 for standard service with no distance', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'standard',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(15);
    });

    it('returns base rate for distance under 10 miles', () => {
      const input: NotaryPriceInput = {
        distance: 5,
        serviceType: 'standard',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(15);
    });
  });

  describe('Mileage Fee', () => {
    it('applies $2.50 per mile over 10 miles', () => {
      const input: NotaryPriceInput = {
        distance: 15,
        serviceType: 'standard',
        urgency: 'standard'
      };
      // Base 15 + (5 miles × 2.50) = 15 + 12.50 = 27.50 → 28
      expect(calculateNotaryPrice(input)).toBe(28);
    });

    it('handles fractional miles correctly', () => {
      const input: NotaryPriceInput = {
        distance: 12.5,
        serviceType: 'standard',
        urgency: 'standard'
      };
      // Base 15 + (2.5 miles × 2.50) = 15 + 6.25 = 21.25 → 21
      expect(calculateNotaryPrice(input)).toBe(21);
    });
  });

  describe('Service Type Fees', () => {
    it('adds $100 for loan signing', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'loan-signing',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(115); // 15 + 100
    });

    it('adds $50 for apostille', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'apostille',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(65); // 15 + 50
    });

    it('adds $30 for estate planning', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'estate',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(45); // 15 + 30
    });
  });

  describe('Urgency Fees', () => {
    it('adds $50 for same-day service', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'standard',
        urgency: 'same-day'
      };
      expect(calculateNotaryPrice(input)).toBe(65); // 15 + 50
    });

    it('adds $75 for after-hours service', () => {
      const input: NotaryPriceInput = {
        distance: 0,
        serviceType: 'standard',
        urgency: 'after-hours'
      };
      expect(calculateNotaryPrice(input)).toBe(90); // 15 + 75
    });
  });

  describe('Combined Fees', () => {
    it('correctly calculates all fees combined', () => {
      const input: NotaryPriceInput = {
        distance: 25,
        serviceType: 'loan-signing',
        urgency: 'same-day'
      };
      // Base: 15
      // Mileage: (25-10) × 2.50 = 37.50
      // Service: 100
      // Urgency: 50
      // Total: 202.50 → 203
      expect(calculateNotaryPrice(input)).toBe(203);
    });
  });

  describe('Edge Cases', () => {
    it('handles negative distance as 0', () => {
      const input: NotaryPriceInput = {
        distance: -5,
        serviceType: 'standard',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(15);
    });

    it('handles undefined/null distance as 0', () => {
      const input: NotaryPriceInput = {
        distance: NaN,
        serviceType: 'standard',
        urgency: 'standard'
      };
      expect(calculateNotaryPrice(input)).toBe(15);
    });
  });
});
