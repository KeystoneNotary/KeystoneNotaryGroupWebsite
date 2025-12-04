'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: string;
  price: number;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      <nav className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-serif text-white">Keystone Admin</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-white">Logout</button>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl text-white mb-8 font-serif">Recent Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-widest text-gray-500">
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Time</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors">
                  <td className="py-4 px-4 text-white">{format(new Date(booking.appointment_date), 'MMM d, yyyy')}</td>
                  <td className="py-4 px-4">{booking.appointment_time}</td>
                  <td className="py-4 px-4">
                    <div className="text-white">{booking.customer_name}</div>
                    <div className="text-xs text-gray-600">{booking.customer_email}</div>
                  </td>
                  <td className="py-4 px-4">{booking.service_type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">${booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
