'use client';

import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, startOfToday, isSunday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const BookingCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const today = startOfToday();

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today) || isSunday(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', { date: selectedDate, time: selectedTime });
    alert('Appointment requested! We\'ll confirm via email shortly.');
    resetBooking();
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
  };

  return (
    <section id="booking" className="min-h-screen bg-charcoal text-platinum py-24 px-6 md:px-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-16 border-b border-neutral-900 pb-4">
          Schedule Appointment
        </h2>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-16">
          {/* Main Calendar Area */}
          <div className="space-y-12">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="text-gray-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
                >
                  ← Prev
                </button>
                <h3 className="font-serif text-3xl text-white">{format(currentMonth, 'MMMM yyyy')}</h3>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="text-gray-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
                >
                  Next →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-px bg-neutral-900">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-black text-center text-xs text-gray-600 uppercase tracking-wider py-4">
                    {day}
                  </div>
                ))}
                {daysInMonth.map((date, idx) => {
                  const isDisabled = isBefore(date, today) || isSunday(date);
                  const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      disabled={isDisabled}
                      className={`bg-black aspect-square flex items-center justify-center text-sm transition-all ${
                        isDisabled 
                          ? 'text-gray-800 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-white text-black font-medium'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-600 mt-4">Sundays reserved for emergency appointments only.</p>
            </div>

            {/* Time Slots */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-6">Select Time</h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-4 text-sm transition-all border ${
                          selectedTime === time
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-white border-neutral-800 hover:border-silver-mid'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button onClick={resetBooking} className="mt-6 text-sm text-gray-600 hover:text-white uppercase tracking-widest">
                    Start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Booking Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border-t border-neutral-900 pt-12"
                >
                  <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-8">Your Details</h4>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="text" placeholder="Full Name *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                      <input type="tel" placeholder="Phone Number *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                      <input type="email" placeholder="Email Address *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                      <input type="text" placeholder="Appointment Address *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                      <input type="text" placeholder="Document Type *" required className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                      <input type="text" placeholder="Service focus (e.g., refinance, POA)" className="bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none" />
                    </div>
                    <textarea placeholder="Additional details (optional)" rows={3} className="w-full bg-transparent border-b border-neutral-800 py-3 text-white placeholder:text-gray-700 focus:border-silver-mid focus:outline-none resize-none"></textarea>
                    
                    <label className="flex items-start gap-3 text-sm text-gray-500">
                      <input type="checkbox" required className="mt-1" />
                      <span>I will provide valid, government-issued identification for all signers.</span>
                    </label>

                    <button type="submit" className="w-full px-12 py-4 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all">
                      Confirm Appointment
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-gray-600 mb-6">Appointment Summary</h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-3 border-b border-neutral-900">
                  <span className="text-gray-600">Date</span>
                  <span className="text-white">{selectedDate ? format(selectedDate, 'MMM d, yyyy') : '—'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-900">
                  <span className="text-gray-600">Time</span>
                  <span className="text-white">{selectedTime || '—'}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-900 text-sm text-gray-500">
              <p>Need assistance? Call <a href="tel:+12673099000" className="text-white hover:text-silver-mid">(267) 309-9000</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendar;
