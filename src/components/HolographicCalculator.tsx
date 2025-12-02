'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { calculatePriceBreakdown, ServiceType, UrgencyType, PRICING_CONFIG } from '@/lib/pricing';

const HolographicCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [distance, setDistance] = useState<string>('');
  const [serviceType, setServiceType] = useState<ServiceType>('standard');
  const [urgency, setUrgency] = useState<UrgencyType>('standard');

  // Calculate price using shared utility
  const breakdown = calculatePriceBreakdown({
    distance: parseFloat(distance) || 0,
    serviceType,
    urgency
  });

  const total = Math.round(breakdown.total);

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-silver-mid/20 backdrop-blur-md border border-silver-mid/40 text-white rounded-full shadow-2xl hover:bg-silver-mid/30 transition-all duration-300 uppercase tracking-widest text-sm font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open price calculator"
      >
        Quick Estimate
      </motion.button>

      {/* Holographic Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              aria-hidden="true"
            />

            {/* Calculator Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90vw] max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="calculator-title"
            >
              <div className="bg-neutral-900/95 backdrop-blur-xl border border-silver-mid/30 rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 id="calculator-title" className="text-2xl font-serif text-silver-metallic">Price Estimate</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close calculator"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Total Display */}
                <div className="mb-8 p-6 bg-black/40 rounded-xl border border-silver-mid/20">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Estimated Total</p>
                  <p className="text-5xl font-serif text-white">${total}</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="holo-distance" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Distance (miles)
                    </label>
                    <input
                      id="holo-distance"
                      aria-label="Distance in miles"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-silver-mid focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1">First {PRICING_CONFIG.FREE_MILEAGE} miles included</p>
                  </div>

                  <div>
                    <label htmlFor="holo-service" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Service Type
                    </label>
                    <select
                      id="holo-service"
                      aria-label="Service type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                      className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-silver-mid focus:outline-none transition-colors appearance-none"
                    >
                      <option value="standard">Standard Notarization</option>
                      <option value="loan-signing">Loan Signing (+${PRICING_CONFIG.SERVICE_FEES['loan-signing']})</option>
                      <option value="apostille">Apostille (+${PRICING_CONFIG.SERVICE_FEES.apostille})</option>
                      <option value="estate">Estate Planning (+${PRICING_CONFIG.SERVICE_FEES.estate})</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="holo-urgency" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Urgency
                    </label>
                    <select
                      id="holo-urgency"
                      aria-label="Urgency level"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as UrgencyType)}
                      className="w-full bg-black/60 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-silver-mid focus:outline-none transition-colors appearance-none"
                    >
                      <option value="standard">Standard (24-48h)</option>
                      <option value="same-day">Same Day (+${PRICING_CONFIG.URGENCY_FEES['same-day']})</option>
                      <option value="after-hours">After Hours (+${PRICING_CONFIG.URGENCY_FEES['after-hours']})</option>
                    </select>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="pt-4 border-t border-neutral-800 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Base Rate</span>
                    <span className="text-white">${breakdown.baseRate}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Mileage Fee</span>
                    <span className="text-white">${breakdown.mileageFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Service Fee</span>
                    <span className="text-white">${breakdown.serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Urgency Fee</span>
                    <span className="text-white">${breakdown.urgencyFee}</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#booking"
                  onClick={() => setIsOpen(false)}
                  className="block w-full mt-6 px-6 py-3 bg-silver-mid text-black text-center uppercase tracking-widest text-sm font-medium rounded-lg hover:bg-silver-metallic transition-colors"
                >
                  Book Appointment
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HolographicCalculator;
