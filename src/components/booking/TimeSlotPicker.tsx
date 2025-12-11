"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import type { TimeSlotPickerProps } from "./types";

/**
 * TimeSlotPicker Component
 *
 * Displays available time slots for a selected date.
 * Shows loading skeletons while fetching availability.
 */
const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTime,
  availableSlots,
  availabilityState,
  availabilityError,
  onTimeSelect,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h4 className="text-xs uppercase tracking-widest text-gray-500">
          Select Time
        </h4>
        {availabilityState === "loading" && (
          <span className="text-xs text-gray-500">Checking availability…</span>
        )}
        {availabilityError && (
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <AlertCircle size={14} /> {availabilityError}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {availabilityState === "loading"
          ? Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-neutral-900 h-12 rounded ring-1 ring-neutral-800"
              />
            ))
          : availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => onTimeSelect(slot)}
                className={`py-3 text-sm transition-all ring-1 ${
                  selectedTime === slot
                    ? "bg-silver-mid text-black ring-silver-mid"
                    : "bg-transparent text-white ring-neutral-800 hover:ring-silver-mid"
                }`}
                aria-label={`Select ${slot}`}
              >
                {slot}
              </button>
            ))}
      </div>

      <button
        onClick={onReset}
        className="text-sm text-gray-500 hover:text-white uppercase tracking-widest"
      >
        Start over
      </button>
    </div>
  );
};

export default TimeSlotPicker;
