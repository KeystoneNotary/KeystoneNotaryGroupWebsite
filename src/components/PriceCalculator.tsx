'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceBreakdown {
  base: number;
  mileage: number;
  service: number;
  urgency: number;
  total: number;
}

const PriceCalculator: React.FC = () => {
  const [distance, setDistance] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('standard');
  const [urgency, setUrgency] = useState<string>('standard');
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);

  const calculatePrice = () => {
    const baseRate = 15;
    const mileageRate = 2.5;
    const distanceNum = parseFloat(distance) || 0;
    
    let mileageFee = 0;
    if (distanceNum > 10) {
      mileageFee = (distanceNum - 10) * mileageRate;
    }
    
    let serviceFee = 0;
    if (serviceType === 'loan-signing') serviceFee = 100;
    else if (serviceType === 'apostille') serviceFee = 50;
    else if (serviceType === 'estate') serviceFee = 30;
    
    let urgencyFee = 0;
    if (urgency === 'same-day') urgencyFee = 50;
    else if (urgency === 'after-hours') urgencyFee = 75;
    
    const total = baseRate + mileageFee + serviceFee + urgencyFee;
    
    setBreakdown({
      base: baseRate,
      mileage: mileageFee,
      service: serviceFee,
      urgency: urgencyFee,
      total: Math.round(total)
    });
  };

  return (
    <section id="price-calculator" className="min-h-screen bg-black text-platinum py-24 px-6 md:px-24 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-16 border-b border-neutral-900 pb-4">
          Price Estimate
        </h2>

        <div className="space-y-12">
          {/* Distance Input */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-600 mb-4">
              Distance from Hellertown, PA (miles)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent border-b border-neutral-800 py-4 text-4xl font-light text-white placeholder:text-gray-800 focus:border-silver-mid focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-600 mt-2">First 10 miles included in base rate</p>
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-600 mb-4">
              Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-800 py-4 text-xl text-white focus:border-silver-mid focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="standard" className="bg-black">Standard Notarization</option>
              <option value="loan-signing" className="bg-black">Loan Signing Package</option>
              <option value="apostille" className="bg-black">Apostille Preparation</option>
              <option value="estate" className="bg-black">Estate Planning Documents</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-600 mb-4">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-800 py-4 text-xl text-white focus:border-silver-mid focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="standard" className="bg-black">Standard (24-48 hours)</option>
              <option value="same-day" className="bg-black">Same Day</option>
              <option value="after-hours" className="bg-black">After Hours/Weekend</option>
            </select>
          </div>

          <button
            onClick={calculatePrice}
            className="w-full px-12 py-6 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all duration-300"
          >
            Calculate Estimate
          </button>

          <AnimatePresence>
            {breakdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border-t border-neutral-900 pt-12"
              >
                <div className="text-center mb-12">
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">Estimated Total</p>
                  <p className="text-7xl md:text-8xl font-light bg-gradient-to-r from-silver-mid via-white to-silver-dark bg-clip-text text-transparent">
                    ${breakdown.total}
                  </p>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-neutral-900">
                    <span className="text-gray-600 uppercase tracking-widest text-xs">Base Rate</span>
                    <span className="text-white">${breakdown.base}</span>
                  </div>
                  
                  {breakdown.mileage > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-neutral-900">
                      <span className="text-gray-600 uppercase tracking-widest text-xs">Mileage</span>
                      <span className="text-white">${breakdown.mileage.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {breakdown.service > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-neutral-900">
                      <span className="text-gray-600 uppercase tracking-widest text-xs">Service Type</span>
                      <span className="text-white">${breakdown.service}</span>
                    </div>
                  )}
                  
                  {breakdown.urgency > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-neutral-900">
                      <span className="text-gray-600 uppercase tracking-widest text-xs">Urgency</span>
                      <span className="text-white">${breakdown.urgency}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 mt-8 text-center">
                  *This is an estimate. Final pricing will be confirmed during booking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {breakdown && (
            <div className="text-center">
              <a href="#booking" className="text-silver-mid hover:text-white transition-colors text-sm uppercase tracking-widest">
                Ready to book? Schedule your appointment →
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
