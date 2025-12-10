"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
  google_event_id: string | null;
  address?: string;
  notes?: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSyncToCalendar = async (bookingId: string) => {
    setSyncing(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/sync-calendar`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update the booking in state to reflect sync
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, google_event_id: data.google_event_id } : b
          )
        );
        alert("Successfully synced to Google Calendar!");
      } else {
        alert(data.message || data.error || "Failed to sync to calendar");
      }
    } catch (error) {
      console.error("Error syncing to calendar:", error);
      alert("Failed to sync to calendar. Check console for details.");
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      <nav className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-serif text-white">Keystone Admin</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-white"
        >
          Logout
        </button>
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
                <th className="py-4 px-4">Calendar</th>
                <th className="py-4 px-4">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="py-4 px-4 text-white">
                    {format(new Date(booking.appointment_date), "MMM d, yyyy")}
                  </td>
                  <td className="py-4 px-4">{booking.appointment_time}</td>
                  <td className="py-4 px-4">
                    <div className="text-white">{booking.customer_name}</div>
                    <div className="text-xs text-gray-600">
                      {booking.customer_email}
                    </div>
                  </td>
                  <td className="py-4 px-4">{booking.service_type}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${
                        booking.status === "confirmed"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {booking.google_event_id ? (
                      <span className="text-green-400 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Synced
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Not Synced
                        </span>
                        <button
                          onClick={() => handleSyncToCalendar(booking.id)}
                          disabled={syncing === booking.id}
                          className="text-[10px] px-2 py-1 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {syncing === booking.id ? "Syncing..." : "Sync"}
                        </button>
                      </div>
                    )}
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
