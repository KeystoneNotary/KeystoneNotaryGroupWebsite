'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Calculator } from 'lucide-react';
import { calculatePriceBreakdown, ServiceType, UrgencyType, PRICING_CONFIG } from '@/lib/pricing';

const CompactCalculator = () => {
  const [distance, setDistance] = useState<string>('');
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [urgency, setUrgency] = useState<UrgencyType>('standard');
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate price using shared utility
  const breakdown = calculatePriceBreakdown({
    distance: parseFloat(distance) || 0,
    serviceType,
    urgency
  });

  const total = Math.round(breakdown.total);

  return (
    <div id="calculator-widget" className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl p-6 w-full max-w-sm shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-800 rounded-lg">
            <Calculator className="w-4 h-4 text-silver-mid" />
          </div>
          <h3 className="text-sm font-medium text-white uppercase tracking-widest">Estimate Cost</h3>
        </div>
        <div className="text-right">
          <span className="block text-xs text-gray-500 uppercase tracking-wider">Total</span>
          <span className="text-2xl font-serif text-white">${total}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="distance" className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            Distance (miles)
          </label>
          <input
            id="distance"
            aria-label="Distance in miles"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="0"
            min="0"
            step="0.1"
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:border-silver-mid focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-600 mt-1">First {PRICING_CONFIG.FREE_MILEAGE} miles included</p>
        </div>

        <div>
          <label htmlFor="service" className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            Service Type
          </label>
          <select
            id="service"
            aria-label="Service type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:border-silver-mid focus:outline-none transition-colors appearance-none"
          >
            <option value="standard">Standard Notarization</option>
            <option value="loan-signing">Loan Signing (+${PRICING_CONFIG.SERVICE_FEES['loan-signing']})</option>
            <option value="apostille">Apostille (+${PRICING_CONFIG.SERVICE_FEES.apostille})</option>
            <option value="estate">Estate Planning (+${PRICING_CONFIG.SERVICE_FEES.estate})</option>
          </select>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            Urgency
          </label>
          <select
            id="urgency"
            aria-label="Urgency level"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as UrgencyType)}
            className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:border-silver-mid focus:outline-none transition-colors appearance-none"
          >
            <option value="standard">Standard (24-48h)</option>
            <option value="same-day">Same Day (+${PRICING_CONFIG.URGENCY_FEES['same-day']})</option>
            <option value="after-hours">After Hours (+${PRICING_CONFIG.URGENCY_FEES['after-hours']})</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Hide price breakdown" : "Show price breakdown"}
        aria-expanded={isExpanded}
        className="w-full mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
      >
        {isExpanded ? 'Hide Breakdown' : 'View Breakdown'}
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Base Rate</span>
                <span className="text-gray-300">${breakdown.baseRate}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Mileage Fee</span>
                <span className="text-gray-300">${breakdown.mileageFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Service Fee</span>
                <span className="text-gray-300">${breakdown.serviceFee}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Urgency Fee</span>
                <span className="text-gray-300">${breakdown.urgencyFee}</span>
              </div>
              <div className="flex justify-between text-white font-medium pt-2 border-t border-neutral-800">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompactCalculator;
