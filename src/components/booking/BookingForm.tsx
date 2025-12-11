"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import type { BookingFormProps } from "./types";

/**
 * BookingForm Component
 *
 * Customer information form for booking appointments.
 * Handles form submission with loading states and error display.
 */
const BookingForm: React.FC<BookingFormProps> = ({
  isSubmitting,
  bookingError,
  onSubmit,
  onAddressChange,
}) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced address change handler
  useEffect(() => {
    if (!onAddressChange || !address || !city) return;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer - wait 1 second after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      onAddressChange(address, city, "Pennsylvania");
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [address, city, onAddressChange]);
  return (
    <div className="space-y-6 border-t border-neutral-900 pt-10">
      {bookingError && (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <AlertCircle size={16} /> {bookingError}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-6" aria-label="Booking form">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="customerName"
            type="text"
            placeholder="Full Name *"
            required
            className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none"
          />
          <input
            name="customerPhone"
            type="tel"
            placeholder="Phone Number *"
            required
            className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none"
          />
          <input
            name="customerEmail"
            type="email"
            placeholder="Email Address *"
            required
            className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none"
          />
          <input
            name="city"
            type="text"
            placeholder="City *"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="address"
            type="text"
            placeholder="Street Address *"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none"
          />
          <div className="relative">
            <input
              name="state"
              type="text"
              value="Pennsylvania"
              readOnly
              className="bg-neutral-900/50 border-b border-neutral-800 py-3 text-gray-400 cursor-not-allowed w-full"
              title="Notary services available in Pennsylvania only"
            />
            <p className="text-xs text-gray-600 mt-1">Services available in PA only</p>
          </div>
        </div>
        <textarea
          name="notes"
          placeholder="Additional details (optional)"
          rows={3}
          className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none resize-none"
        />
        <label className="flex items-start gap-3 text-sm text-gray-500">
          <input type="checkbox" required className="mt-1" />
          <span>
            I will provide valid, government-issued identification for all
            signers.
          </span>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-12 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white uppercase tracking-widest text-sm font-medium rounded-full hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
