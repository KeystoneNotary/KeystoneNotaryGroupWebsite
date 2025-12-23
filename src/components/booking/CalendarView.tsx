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
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onMonthChange("prev")}
          className="text-gray-500 hover:text-white transition-colors text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em] flex-shrink-0"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-white text-center flex-1 min-w-0">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => onMonthChange("next")}
          className="text-gray-500 hover:text-white transition-colors text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.2em] flex-shrink-0"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl ring-1 ring-neutral-900 overflow-hidden w-full">
        <div className="grid grid-cols-7 bg-neutral-900 text-[10px] md:text-xs uppercase tracking-wider text-gray-500">
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
                className={`bg-black aspect-square flex items-center justify-center text-base md:text-lg font-medium transition-all ${
                  isDisabled
                    ? "text-gray-700 cursor-not-allowed opacity-40"
                    : isSelected
                    ? "bg-silver-mid text-black font-semibold"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
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
