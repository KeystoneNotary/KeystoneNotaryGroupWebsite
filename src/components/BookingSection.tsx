'use client';

import React, { useState, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday, isSunday } from 'date-fns';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CompactCalculator from './CompactCalculator';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const BookingSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = startOfToday();

  const handleDateSelect = async (date: Date) => {
    if (isBefore(date, today) || isSunday(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
    
    // Fetch availability
    setIsLoadingSlots(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await fetch(`/api/bookings/check-availability?date=${dateStr}`);
      const data = await res.json();
      
      if (data.availableSlots) {
        // Convert 24h to 12h format for comparison if needed, or just use the returned slots
        // The API returns "09:00", "10:00" etc.
        // Our UI uses "9:00 AM", "10:00 AM" etc.
        // Simple mapping:
        const mappedSlots = data.availableSlots.map((slot: string) => {
          const [hour, min] = slot.split(':');
          const h = parseInt(hour, 10);
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 || 12;
          return `${h12}:${min} ${ampm}`;
        });
        setAvailableSlots(mappedSlots);
      } else {
        // Fallback if API fails or no creds (show all)
        setAvailableSlots(timeSlots);
      }
    } catch (err) {
      console.error('Failed to fetch slots', err);
      setAvailableSlots(timeSlots); // Fallback
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      customerPhone: formData.get('customerPhone'),
      address: formData.get('address'),
      appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
      appointmentTime: convertTo24Hour(selectedTime),
      serviceType: 'General Notary Work', // Default for now
      price: 75, // Base price estimate
      notes: formData.get('notes'),
    };

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Booking failed');

      setBookingSuccess(true);
      // Reset after delay or keep success state?
      // For now, keep success state
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? String(parseInt(hours, 10) + 12) : hours;
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
    setBookingSuccess(false);
  };

  // ... GSAP code ...

  // Render Success State
  if (bookingSuccess) {
    return (
      <section ref={containerRef} id="booking" className="relative min-h-[100dvh] bg-black text-platinum py-24 px-6 md:px-12 overflow-hidden flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto z-10">
          <h2 className="font-serif text-5xl text-white mb-6">Booking Confirmed</h2>
          <p className="text-gray-400 text-lg mb-8">
            Thank you! Your appointment has been scheduled. A confirmation email has been sent to you.
          </p>
          <button onClick={resetBooking} className="px-8 py-3 bg-silver-mid text-black uppercase tracking-widest text-sm font-medium rounded-full hover:bg-silver-metallic transition-colors">
            Book Another
          </button>
        </div>
      </section>
    );
  }

  // ... Rest of render ...
  // Update Time Slots rendering to use availableSlots and isLoadingSlots


  useGSAP(() => {
    if (!containerRef.current) return;

    // Background "BOOK" text - toggleActions
    gsap.fromTo(backgroundTextRef.current,
      { y: 100, opacity: 0, rotation: -10 },
      {
        y: 0,
        opacity: 0.02,
        rotation: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Month title
    const monthTitle = containerRef.current.querySelector('.month-title');
    gsap.fromTo(monthTitle,
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: monthTitle,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Calendar grid - BATCHED (CSS animation instead of 35 individual GSAP animations)
    const calendarGrid = containerRef.current.querySelector('.calendar-grid');
    gsap.fromTo(calendarGrid,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: calendarGrid,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Calculator
    const calculator = containerRef.current.querySelector('.booking-calculator');
    gsap.fromTo(calculator,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: calculator,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="booking" className="relative min-h-[100dvh] bg-black text-platinum py-16 md:py-24 px-4 md:px-12 overflow-hidden">
      {/* Background Depth Layer - "BOOK" */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 pointer-events-none z-0 overflow-hidden">
        <div 
          ref={backgroundTextRef}
          className="font-serif text-[30vw] text-white opacity-5 leading-none select-none will-change-transform"
        >
          BOOK
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <span className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4">Reserve Your Time</span>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            Schedule <span className="text-silver-metallic italic">Appointment</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-16 items-start">
          {/* Left: Calendar */}
          <div className="space-y-12">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="text-gray-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                ← Prev
              </button>
              <h3 className="month-title font-serif text-4xl text-white will-change-transform">{format(currentMonth, 'MMMM yyyy')}</h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="text-gray-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid will-change-transform">
              <div className="grid grid-cols-7 gap-px bg-neutral-900 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-black text-center text-xs text-gray-600 uppercase tracking-wider py-4">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-neutral-900">
                {daysInMonth.map((date, idx) => {
                  const isDisabled = isBefore(date, today) || isSunday(date);
                  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={`calendar-day bg-black aspect-square flex items-center justify-center text-sm transition-all ${
                        isDisabled 
                          ? 'text-gray-800 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-silver-mid text-black font-medium'
                          : 'text-white hover:bg-white/5'
                      }`}
                      style={{
                        animation: isDisabled ? 'none' : `fadeInUp 0.3s ease-out ${idx * 0.02}s both`
                      }}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 mt-4">Sundays reserved for emergency appointments only.</p>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="border-t border-neutral-900 pt-12">
                <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-6">Select Time</h4>
                
                {isLoadingSlots ? (
                  <div className="text-gray-500 text-sm animate-pulse">Checking availability...</div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {timeSlots.map(time => {
                      const isAvailable = availableSlots.includes(time);
                      return (
                        <button
                          key={time}
                          onClick={() => isAvailable && handleTimeSelect(time)}
                          disabled={!isAvailable}
                          className={`py-4 text-sm transition-all border ${
                            selectedTime === time
                              ? 'bg-silver-mid text-black border-silver-mid'
                              : isAvailable
                                ? 'bg-transparent text-white border-neutral-800 hover:border-silver-mid'
                                : 'bg-neutral-900 text-neutral-600 border-transparent cursor-not-allowed'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                <button onClick={resetBooking} className="mt-6 text-sm text-gray-600 hover:text-white uppercase tracking-widest">
                  Start over
                </button>
              </div>
            )}

            {/* Booking Form */}
            {showForm && (
              <div className="border-t border-neutral-900 pt-12">
                <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-8">Your Details</h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input name="customerName" type="text" placeholder="Full Name *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                    <input name="customerPhone" type="tel" placeholder="Phone Number *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                    <input name="customerEmail" type="email" placeholder="Email Address *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                    <input name="address" type="text" placeholder="Appointment Address *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                  </div>
                  <textarea name="notes" placeholder="Additional details (optional)" rows={3} className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none resize-none"></textarea>
                  
                  <label className="flex items-start gap-3 text-sm text-gray-500">
                    <input type="checkbox" required className="mt-1" />
                    <span>I will provide valid, government-issued identification for all signers.</span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full px-12 py-4 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right: Calculator */}
          <div className="booking-calculator sticky top-24 will-change-transform">
            <CompactCalculator />
            
            <div className="mt-12 p-6 border-l border-neutral-800">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Need Assistance?</h4>
              <p className="text-sm text-gray-400 mb-4">
                Our concierge team is available to handle complex requests or multi-signer coordination.
              </p>
              <a href="tel:+12673099000" className="text-white hover:text-silver-mid transition-colors text-lg font-serif">
                (267) 309-9000
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animation for Calendar Days */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default BookingSection;
