"use client";

import React, { useState, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  isBefore,
  startOfToday,
  isSunday,
} from "date-fns";
import { CheckCircle2 } from "lucide-react";
import CompactCalculator from "./CompactCalculator";
import {
  CalendarView,
  TimeSlotPicker,
  BookingForm,
  type AvailabilityState,
} from "./booking";
import {
  timeSlotsFallback,
  formatApiSlots,
  convertTo24Hour,
} from "@/lib/utils/booking";
import { PRICING_CONFIG } from "@/lib/pricing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createScrollTimeline,
  headerExplodedAssembly,
} from "@/lib/gsap-animations";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * BookingSection Component
 *
 * Main booking section that orchestrates the booking flow:
 * 1. Calendar date selection
 * 2. Time slot selection
 * 3. Customer information form
 * 4. Booking confirmation
 *
 * Uses extracted sub-components for better maintainability.
 */
const BookingSection = () => {
  // Booking state
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
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  // Animation refs
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleMainRef = useRef<HTMLSpanElement>(null);
  const titleAccentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Check reduced motion preference
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();

  useGSAP(
    () => {
      // Skip animation if user prefers reduced motion or not ready
      if (prefersReducedMotion || !shouldInit) {
        if (prefersReducedMotion) {
          gsap.set(
            [
              labelRef.current,
              titleMainRef.current,
              titleAccentRef.current,
              subtitleRef.current,
            ],
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotation: 0,
              filter: "none",
              letterSpacing: "0.35em",
            }
          );
        }
        return;
      }

      if (
        containerRef.current &&
        labelRef.current &&
        titleMainRef.current &&
        titleAccentRef.current
      ) {
        const headerTl = createScrollTimeline(containerRef.current, {
          trigger: containerRef.current,
          start: "top 75%",
          end: "center center",
          scrub: 1,
        });

        headerTl.add(
          headerExplodedAssembly(
            labelRef.current,
            titleMainRef.current,
            titleAccentRef.current,
            subtitleRef.current || undefined
          ),
          0
        );
      }
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  const today = startOfToday();

  // Event handlers
  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth(
      direction === "prev"
        ? subMonths(currentMonth, 1)
        : addMonths(currentMonth, 1)
    );
  };

  const handleDateSelect = async (date: Date) => {
    if (isBefore(date, today) || isSunday(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
    setAvailabilityError(null);
    setAvailabilityState("loading");

    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(
        `/api/bookings/check-availability?date=${dateStr}`
      );
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
      setAvailabilityError(
        "Could not verify availability. Showing default slots."
      );
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
    setCalculatedPrice(null);
    setDistanceInfo(null);
  };

  const calculateDistanceAndPrice = async (
    address: string,
    city: string,
    state: string
  ) => {
    if (!address || !city || !state) return;

    setIsCalculatingDistance(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/calculate-distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          city,
          state,
          serviceType: "standard",
          urgency: "standard",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.warn("Distance calculation failed:", data.message);
        // Fallback to estimated price
        setCalculatedPrice(null);
        setDistanceInfo(null);
        return;
      }

      if (data.success) {
        setCalculatedPrice(Math.round(data.breakdown.total));
        setDistanceInfo({
          distance: data.distance,
          duration: data.duration,
        });
      }
    } catch (error) {
      console.error("Distance calculation error:", error);
      // Silent fallback - don't block user
      setCalculatedPrice(null);
      setDistanceInfo(null);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setBookingError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = (formData.get("state") as string) || "Pennsylvania";

    // Use calculated price if available, otherwise use estimated price
    let finalPrice = calculatedPrice;

    // If distance calculation wasn't performed or failed, calculate it now
    if (!finalPrice) {
      try {
        const res = await fetch("/api/calculate-distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            city,
            state,
            serviceType: "standard",
            urgency: "standard",
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          finalPrice = Math.round(data.breakdown.total);
        } else {
          // Fallback to estimated price
          finalPrice = Math.round(
            PRICING_CONFIG.NOTARY_FEE +
              PRICING_CONFIG.FREE_MILEAGE * PRICING_CONFIG.MILEAGE_RATE +
              PRICING_CONFIG.SERVICE_FEES.standard
          );
        }
      } catch (error) {
        console.error("Distance calculation failed during submit:", error);
        // Fallback to estimated price
        finalPrice = Math.round(
          PRICING_CONFIG.NOTARY_FEE +
            PRICING_CONFIG.FREE_MILEAGE * PRICING_CONFIG.MILEAGE_RATE +
            PRICING_CONFIG.SERVICE_FEES.standard
        );
      }
    }

    const bookingData = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      address,
      city,
      state,
      appointmentDate: format(selectedDate, "yyyy-MM-dd"),
      appointmentTime: convertTo24Hour(selectedTime),
      serviceType: "General Notary Work",
      price: finalPrice,
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
    } catch (error: unknown) {
      console.error("Booking error:", error);
      setBookingError(
        "Failed to book appointment. Please try again or call us."
      );
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
            <CheckCircle2
              className="w-24 h-24 text-silver-metallic"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
            Booking Confirmed
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Thank you! Your appointment has been scheduled.
            <br />A confirmation email has been sent to you.
          </p>
          <div className="max-w-lg mx-auto p-4 bg-amber-900/20 border border-amber-900/40 rounded-lg">
            <p className="text-sm text-amber-400/90 leading-relaxed">
              <strong>Note:</strong> Final pricing will be confirmed after we
              calculate the actual driving distance from our Hellertown office
              (18055) to your service location. We{"'"}ll contact you with the
              final quote before your appointment.
            </p>
          </div>
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
      ref={containerRef}
      id="booking"
      className="relative min-h-[100dvh] bg-black text-platinum py-24 md:py-32 px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <span
            ref={labelRef}
            className="block text-silver-mid text-xs tracking-[0.35em] uppercase"
          >
            Concierge Booking
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-white leading-tight">
            <span ref={titleMainRef} className="inline-block">
              Schedule
            </span>{" "}
            <span
              ref={titleAccentRef}
              className="inline-block text-silver-metallic italic"
            >
              Appointment
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-neutral-400 text-lg leading-relaxed max-w-3xl mx-auto"
          >
            Secure your appointment. Mobile notarization, apostille services,
            and executive witnessing—executed flawlessly.
          </p>
        </div>

        {/* Appointment Summary Bar - Always visible */}
        {(selectedDate || selectedTime) && (
          <div className="bg-neutral-900/70 ring-1 ring-neutral-800 rounded-2xl p-6 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Date
                  </span>
                  <span className="text-white font-medium">
                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Time
                  </span>
                  <span className="text-white font-medium">
                    {selectedTime || "—"}
                  </span>
                </div>
                {distanceInfo && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">
                        Distance
                      </span>
                      <span className="text-white font-medium">
                        {distanceInfo.distance} mi
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">
                        Drive
                      </span>
                      <span className="text-white font-medium">
                        ~{distanceInfo.duration} min
                      </span>
                    </div>
                  </>
                )}
              </div>
              {calculatedPrice !== null && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs uppercase tracking-wider">
                    Estimated Total*
                  </span>
                  <span className="text-white font-serif text-2xl">
                    ${calculatedPrice}
                  </span>
                </div>
              )}
              {isCalculatingDistance && (
                <span className="text-xs text-gray-500 italic">
                  Calculating distance...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Main Booking Flow - Clean single column */}
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Calendar - Refined luxury sizing */}
          <div className="max-w-xl mx-auto rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-6 md:p-8 backdrop-blur">
            <CalendarView
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onMonthChange={handleMonthChange}
            />
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-10 md:p-12 backdrop-blur">
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={availableSlots}
                availabilityState={availabilityState}
                availabilityError={availabilityError}
                onTimeSelect={handleTimeSelect}
                onReset={resetBooking}
              />
            </div>
          )}

          {/* Booking Form */}
          {showForm && selectedDate && selectedTime && (
            <div className="rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-10 md:p-12 backdrop-blur">
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                isSubmitting={isSubmitting}
                bookingError={bookingError}
                onSubmit={handleSubmit}
                onAddressChange={calculateDistanceAndPrice}
              />
            </div>
          )}
        </div>

        {/* Bottom Section - Calculator & Contact */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Calculator Widget */}
          <div className="rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-8 backdrop-blur">
            <CompactCalculator embedded />
          </div>

          {/* Contact Card */}
          <div className="rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-8 backdrop-blur flex flex-col justify-center items-center text-center space-y-6">
            <h4 className="text-xs uppercase tracking-widest text-gray-500">
              Complex Arrangement?
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Our concierge handles hospital signings, multi-party closings, and
              arrangements others decline.
            </p>
            <a
              href="tel:+12673099000"
              className="text-white hover:text-silver-mid transition-colors text-2xl font-serif"
            >
              (267) 309-9000
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
