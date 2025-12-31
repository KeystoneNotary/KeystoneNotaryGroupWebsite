import { google } from "googleapis";
import { addMinutes, parseISO } from "date-fns";
import { BookingDetails, CalendarEvent } from "@/types";
import { sanitizeText, formatPrice } from "./sanitize";

// Initialize Google Auth Lazily
const getCalendar = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
};

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";

const getEventDateRange = (
  event: CalendarEvent
): { start: Date; end: Date } | null => {
  const eventStartDateTime = event.start?.dateTime;
  const eventEndDateTime = event.end?.dateTime;

  if (eventStartDateTime && eventEndDateTime) {
    const start = parseISO(eventStartDateTime);
    const end = parseISO(eventEndDateTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return null;
    }

    return { start, end };
  }

  const eventStartDate = event.start?.date;
  const eventEndDate = event.end?.date || eventStartDate;

  if (!eventStartDate || !eventEndDate) {
    return null;
  }

  const start = parseISO(eventStartDate);
  start.setHours(0, 0, 0, 0);

  const end = parseISO(eventEndDate);
  if (eventEndDate !== eventStartDate) {
    end.setDate(end.getDate() - 1);
  }
  end.setHours(23, 59, 59, 999);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return { start, end };
};

export async function createCalendarEvent(
  booking: BookingDetails
): Promise<string | null> {
  try {
    const startDateTime = `${booking.appointmentDate}T${booking.appointmentTime}:00`;
    // Assuming 60 min duration for now
    const startDate = parseISO(startDateTime);
    const endDate = addMinutes(startDate, 60);

    // Sanitize all user-provided content
    const customerName = sanitizeText(booking.customerName);
    const customerPhone = sanitizeText(booking.customerPhone);
    const customerEmail = sanitizeText(booking.customerEmail);
    const serviceType = sanitizeText(booking.serviceType);
    const address = sanitizeText(booking.address);
    const notes = sanitizeText(booking.notes) || "None";
    const price = formatPrice(booking.price);

    const event: CalendarEvent = {
      summary: `Notary: ${customerName} - ${serviceType}`,
      description: `
Customer: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail}
Service: ${serviceType}
Price: $${price}
Address: ${address}
Notes: ${notes}
      `.trim(),
      location: address,
      start: {
        dateTime: startDateTime,
        timeZone: "America/New_York",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/New_York",
      },
      // Note: Service accounts cannot add attendees without Domain-Wide Delegation
      // All customer info is included in the description above
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    const calendar = getCalendar();
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return response.data.id || null;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

/**
 * Gets available time slots for a given date
 * @param date - Date string in YYYY-MM-DD format
 * @returns Array of available time slots (HH:MM format), empty array on error
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  try {
    const timeMin = `${date}T08:00:00-05:00`; // 8 AM EST
    const timeMax = `${date}T20:00:00-05:00`; // 8 PM EST
    const slotOffset = "-05:00";

    const calendar = getCalendar();
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];

    // Define all possible slots (9 AM - 5 PM)
    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    // Filter out slots that conflict with existing events
    const availableSlots = allSlots.filter((slot) => {
      const slotStartDate = parseISO(`${date}T${slot}:00${slotOffset}`);
      const slotEndDate = addMinutes(slotStartDate, 60);
      const slotStartTime = slotStartDate.getTime();
      const slotEndTime = slotEndDate.getTime();

      // Check if any event overlaps with this slot
      const hasConflict = events.some((event) => {
        const eventRange = getEventDateRange(event);

        if (!eventRange) return false;

        return (
          eventRange.start.getTime() < slotEndTime &&
          eventRange.end.getTime() > slotStartTime
        );
      });

      return !hasConflict;
    });

    return availableSlots;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return []; // Return empty if error, or handle gracefully
  }
}
