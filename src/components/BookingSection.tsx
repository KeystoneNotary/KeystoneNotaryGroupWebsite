"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  startOfToday,
  isSunday,
} from "date-fns";
import { CheckCircle2, AlertCircle } from "lucide-react";
import CompactCalculator from "./CompactCalculator";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

type AvailabilityState = "idle" | "loading" | "error" | "loaded";

const timeSlotsFallback = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatApiSlots = (slots: string[]) =>
  slots.map((slot) => {
    const [hour, min] = slot.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${min} ${ampm}`;
  });

const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  const [hours, minutes] = time.split(":");
  let hoursNum = hours;
  if (hoursNum === "12") {
    hoursNum = modifier === "AM" ? "00" : "12";
  } else {
    hoursNum =
      modifier === "PM" ? String(parseInt(hoursNum, 10) + 12) : hoursNum;
  }
  return `${hoursNum.padStart(2, "0")}:${minutes}`;
};

const BookingSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availabilityState, setAvailabilityState] =
    useState<AvailabilityState>("idle");
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const today = startOfToday();

  const handleDateSelect = async (date: Date) => {
    if (isBefore(date, today) || isSunday(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
    setAvailabilityError(null);
    setAvailabilityState("loading");

    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/bookings/check-availability?date=${dateStr}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load slots");

      const mapped = data?.availableSlots?.length
        ? formatApiSlots(data.availableSlots)
        : timeSlotsFallback;

      setAvailableSlots(mapped);
      setAvailabilityState("loaded");
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setAvailableSlots(timeSlotsFallback);
      setAvailabilityError("Could not verify availability. Showing default slots.");
      setAvailabilityState("error");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
    setBookingSuccess(false);
    setBookingError(null);
    setAvailabilityState("idle");
    setAvailabilityError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setBookingError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      address: formData.get("address"),
      appointmentDate: format(selectedDate, "yyyy-MM-dd"),
      appointmentTime: convertTo24Hour(selectedTime),
      serviceType: "General Notary Work",
      price: 75,
      notes: formData.get("notes"),
    };

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking failed");
      setBookingSuccess(true);
    } catch (error: any) {
      console.error("Booking error:", error);
      setBookingError("Failed to book appointment. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (bookingSuccess) {
    return (
      <section
        id="booking"
        className="relative min-h-[100dvh] bg-black text-platinum py-24 px-6 md:px-12 overflow-hidden flex items-center justify-center"
      >
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8 flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-silver-metallic" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
            Booking Confirmed
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Thank you! Your appointment has been scheduled.
            <br />A confirmation email has been sent to you.
          </p>
          <button
            onClick={resetBooking}
            className="mt-12 px-8 py-3 bg-silver-mid text-black uppercase tracking-widest text-sm font-medium rounded-full hover:bg-silver-metallic transition-colors"
          >
            Book Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="booking"
      className="relative min-h-[80vh] bg-black text-platinum py-16 md:py-20 px-4 md:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-80" />
        <div className="absolute left-[-10%] top-8 h-64 w-64 bg-silver-mid/10 blur-[100px]" />
        <div className="absolute right-[-5%] bottom-8 h-64 w-64 bg-silver-mid/8 blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        <div className="space-y-6 text-center">
          <span className="block text-silver-mid text-xs tracking-[0.35em] uppercase">
            Concierge Booking
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight">
            <span className="inline-block">Schedule</span>{" "}
            <span className="inline-block text-silver-metallic italic">
              Appointment
            </span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl mx-auto">
            Reserve mobile notarization, apostille handling, or executive witnessing with the same polish as our philosophy section.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-12 items-start">
          {/* Calendar + Slots */}
          <div className="space-y-10 rounded-3xl bg-neutral-950/50 ring-1 ring-white/10 p-6 md:p-10 backdrop-blur">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
                aria-label="Previous month"
              >
                ← Prev
              </button>
              <h3 className="font-serif text-4xl text-white">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
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
                {monthDays.map((date, idx) => {
                  const isDisabled = isBefore(date, today) || isSunday(date);
                  const isSelected =
                    selectedDate &&
                    format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
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
              <p className="text-xs text-gray-600 mt-3 px-2">
                Sundays reserved for emergency appointments only.
              </p>
            </div>

            {/* Slots */}
            {selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-xs uppercase tracking-widest text-gray-600">
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
                  {(availabilityState === "loading"
                    ? Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="animate-pulse bg-neutral-900 h-12 rounded ring-1 ring-neutral-800"
                        />
                      ))
                    : availableSlots
                  ).map((slot, idx) =>
                    typeof slot === "string" ? (
                      <button
                        key={slot}
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-3 text-sm transition-all ring-1 ${
                          selectedTime === slot
                            ? "bg-silver-mid text-black ring-silver-mid"
                            : "bg-transparent text-white ring-neutral-800 hover:ring-silver-mid"
                        }`}
                        aria-label={`Select ${slot}`}
                      >
                        {slot}
                      </button>
                    ) : (
                      slot
                    )
                  )}
                </div>
                <button
                  onClick={resetBooking}
                  className="text-sm text-gray-600 hover:text-white uppercase tracking-widest"
                >
                  Start over
                </button>
              </div>
            )}

            {/* Form */}
            {showForm && (
              <div className="space-y-6 border-t border-neutral-900 pt-10">
                {bookingError && (
                  <div className="flex items-center gap-2 text-sm text-amber-400">
                    <AlertCircle size={16} /> {bookingError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6" aria-label="Booking form">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      name="customerName"
                      type="text"
                      placeholder="Full Name *"
                      required
                      className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none"
                    />
                    <input
                      name="customerPhone"
                      type="tel"
                      placeholder="Phone Number *"
                      required
                      className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none"
                    />
                    <input
                      name="customerEmail"
                      type="email"
                      placeholder="Email Address *"
                      required
                      className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none"
                    />
                    <input
                      name="address"
                      type="text"
                      placeholder="Appointment Address *"
                      required
                      className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none"
                    />
                  </div>
                  <textarea
                    name="notes"
                    placeholder="Additional details (optional)"
                    rows={3}
                    className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none resize-none"
                  />
                  <label className="flex items-start gap-3 text-sm text-gray-500">
                    <input type="checkbox" required className="mt-1" />
                    <span>
                      I will provide valid, government-issued identification for all signers.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-12 py-4 ring-1 ring-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:ring-silver-mid hover:text-silver-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Appointment"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sticky top-16 space-y-8">
            <div className="bg-neutral-900/70 ring-1 ring-neutral-800 rounded-2xl p-6 backdrop-blur">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
                Appointment Summary
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">
                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "—"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-3">
                  <span className="text-gray-500">Time</span>
                  <span className="text-white">{selectedTime || "—"}</span>
                </div>
              </div>
            </div>

            <CompactCalculator />

            <div className="p-6 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                Need Assistance?
              </h4>
              <p className="text-sm text-gray-300 mb-4">
                Concierge team available for complex packages, hospital signings, and multi-signer coordination.
              </p>
              <a
                href="tel:+12673099000"
                className="text-white hover:text-silver-mid transition-colors text-lg font-serif"
              >
                (267) 309-9000
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
