import { google } from 'googleapis';
import { addMinutes, parseISO } from 'date-fns';

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

export interface BookingDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM (24h)
  address: string;
  serviceType: string;
  price: number;
  notes?: string;
}

export async function createCalendarEvent(booking: BookingDetails) {
  try {
    const startDateTime = `${booking.appointmentDate}T${booking.appointmentTime}:00`;
    // Assuming 60 min duration for now
    const startDate = parseISO(startDateTime);
    const endDate = addMinutes(startDate, 60);

    const event = {
      summary: `Notary: ${booking.customerName} - ${booking.serviceType}`,
      description: `
        Customer: ${booking.customerName}
        Phone: ${booking.customerPhone}
        Email: ${booking.customerEmail}
        Service: ${booking.serviceType}
        Price: $${booking.price}
        Address: ${booking.address}
        Notes: ${booking.notes || 'None'}
      `,
      location: booking.address,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: booking.customerEmail },
        { email: process.env.NOTARY_EMAIL }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return response.data.id;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function getAvailableSlots(date: string) {
  try {
    const timeMin = `${date}T08:00:00-05:00`; // 8 AM EST
    const timeMax = `${date}T20:00:00-05:00`; // 8 PM EST

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Define all possible slots (9 AM - 5 PM)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Filter out slots that conflict with existing events
    const availableSlots = allSlots.filter(slot => {
      const slotStart = `${date}T${slot}:00`;
      const slotEnd = addMinutes(parseISO(slotStart), 60).toISOString();

      // Check if any event overlaps with this slot
      const hasConflict = events.some(event => {
        const eventStart = event.start?.dateTime || event.start?.date;
        const eventEnd = event.end?.dateTime || event.end?.date;

        if (!eventStart || !eventEnd) return false;

        return (
          (eventStart < slotEnd && eventEnd > slotStart) // Overlap logic
        );
      });

      return !hasConflict;
    });

    return availableSlots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return []; // Return empty if error, or handle gracefully
  }
}
