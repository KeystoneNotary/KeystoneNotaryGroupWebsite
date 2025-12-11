"use client";

import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  startOfToday,
  isSunday,
} from "date-fns";
import { weekdayLabels } from "@/lib/utils/booking";
import type { CalendarViewProps } from "./types";

/**
 * CalendarView Component
 *
 * Displays a month calendar grid for date selection.
 * Disables past dates and Sundays.
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
}) => {
  const today = startOfToday();

  const monthDays = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onMonthChange("prev")}
          className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-[0.2em]"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <h3 className="font-serif text-4xl text-white">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => onMonthChange("next")}
          className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-[0.2em]"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl ring-1 ring-neutral-900 overflow-hidden">
        <div className="grid grid-cols-7 bg-neutral-900 text-xs uppercase tracking-wider text-gray-500">
          {weekdayLabels.map((day) => (
            <div key={day} className="py-3 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-neutral-900">
          {monthDays.map((date) => {
            const isDisabled = isBefore(date, today) || isSunday(date);
            const isSelected =
              selectedDate &&
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <button
                key={date.toString()}
                onClick={() => onDateSelect(date)}
                disabled={isDisabled}
                className={`bg-black aspect-square flex items-center justify-center text-sm transition-all ${
                  isDisabled
                    ? "text-gray-800 cursor-not-allowed opacity-30"
                    : isSelected
                    ? "bg-silver-mid text-black font-medium"
                    : "text-white hover:bg-white/5"
                }`}
                aria-label={`Select ${format(date, "MMMM d, yyyy")}`}
              >
                {format(date, "d")}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3 px-2">
          Sundays reserved for emergency appointments only.
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
