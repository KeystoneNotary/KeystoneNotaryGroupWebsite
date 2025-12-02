// Pricing Configuration Constants
export const PRICING_CONFIG = {
  BASE_RATE: 15,
  FREE_MILEAGE: 10,
  MILEAGE_RATE: 2.5,
  SERVICE_FEES: {
    standard: 0,
    'loan-signing': 100,
    apostille: 50,
    estate: 30
  },
  URGENCY_FEES: {
    standard: 0,
    'same-day': 50,
    'after-hours': 75
  }
} as const;

// Type Definitions
export type ServiceType = keyof typeof PRICING_CONFIG.SERVICE_FEES;
export type UrgencyType = keyof typeof PRICING_CONFIG.URGENCY_FEES;

export interface NotaryPriceInput {
  distance: number;
  serviceType: ServiceType;
  urgency: UrgencyType;
}

export interface PriceBreakdown {
  baseRate: number;
  mileageFee: number;
  serviceFee: number;
  urgencyFee: number;
  total: number;
}

/**
 * Calculate the total price for a notary service
 * @param input - Pricing parameters
 * @returns Rounded total price in dollars
 */
export function calculateNotaryPrice(input: NotaryPriceInput): number {
  const breakdown = calculatePriceBreakdown(input);
  return Math.round(breakdown.total);
}

/**
 * Calculate detailed price breakdown for a notary service
 * @param input - Pricing parameters
 * @returns Detailed breakdown of all fees
 */
export function calculatePriceBreakdown(input: NotaryPriceInput): PriceBreakdown {
  const { distance, serviceType, urgency } = input;
  
  // Sanitize distance input
  const distanceNum = isNaN(distance) || distance < 0 ? 0 : distance;
  
  // Base rate
  const baseRate = PRICING_CONFIG.BASE_RATE;
  
  // Mileage fee (only for distance over free mileage)
  const mileageFee = Math.max(0, (distanceNum - PRICING_CONFIG.FREE_MILEAGE) * PRICING_CONFIG.MILEAGE_RATE);
  
  // Service type fee
  const serviceFee = PRICING_CONFIG.SERVICE_FEES[serviceType] || 0;
  
  // Urgency fee
  const urgencyFee = PRICING_CONFIG.URGENCY_FEES[urgency] || 0;
  
  // Total
  const total = baseRate + mileageFee + serviceFee + urgencyFee;
  
  return {
    baseRate,
    mileageFee,
    serviceFee,
    urgencyFee,
    total
  };
}
