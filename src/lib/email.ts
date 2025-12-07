import { Resend } from "resend";
import { BookingDetails } from "./google-calendar";

const RESEND_PLACEHOLDER_PATTERNS = [
  /^re_123/i,
  /^re-test-key/i,
  /^your_resend/i,
  /^placeholder/i,
  /^test_key/i,
];

const escapeHtml = (text: string): string => text.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' })[char] || char);

const resolveResendApiKey = (): string => {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is required to send transactional emails.");
  }

  const usesPlaceholder = RESEND_PLACEHOLDER_PATTERNS.some((pattern) =>
    pattern.test(apiKey)
  );

  if (usesPlaceholder) {
    throw new Error(
      "RESEND_API_KEY is using a placeholder value. Provide a real API key via environment configuration."
    );
  }

  return apiKey;
};

export const createResendClient = (): Resend => {
  const apiKey = resolveResendApiKey();
  if (typeof window !== "undefined") {
    throw new Error("createResendClient must only be used on the server.");
  }
  return new Resend(apiKey);
};

const NOTARY_EMAIL =
  process.env.NOTARY_EMAIL || "contact@keystonenotarygroup.com";

export async function sendBookingConfirmation(
  booking: BookingDetails,
  bookingId: string
) {
  try {
    const resend = createResendClient();
    await resend.emails.send({
      from: "Keystone Notary Group <bookings@keystonenotarygroup.com>",
      to: booking.customerEmail,
      subject: "Booking Confirmed - Keystone Notary Group",
      html: `
        <h1>Appointment Confirmed</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Dear ${escapeHtml(booking.customerName)},</p>
        
        <h3>Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${booking.appointmentDate}</li>
          <li><strong>Time:</strong> ${booking.appointmentTime}</li>
          <li><strong>Location:</strong> ${booking.address}</li>
          <li><strong>Service:</strong> ${booking.serviceType}</li>
          <li><strong>Service:</strong> ${escapeHtml(booking.serviceType)}</li>
        </ul>
        
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        
        <p>Please have your valid government-issued ID and documents ready (unsigned).</p>
        
        <p>If you need to reschedule, please contact us at (267) 309-9000.</p>
        
        <p>Best regards,<br/>Keystone Notary Group</p>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    console.error("Failed to send booking confirmation email.");
    throw new Error("Failed to send booking confirmation email.", { cause: error as unknown });
}

export async function sendNotaryNotification(
  booking: BookingDetails,
  bookingId: string
) {
  try {
    const resend = createResendClient();
    await resend.emails.send({
      from: "Keystone System <system@keystonenotarygroup.com>",
      to: NOTARY_EMAIL,
      subject: `NEW BOOKING: ${escapeHtml(booking.customerName)} - ${booking.appointmentDate}`,
      html: `
        <h1>New Booking Received</h1>
        
        <h3>Customer:</h3>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(booking.customerName)}</li>
          <li><strong>Email:</strong> ${escapeHtml(booking.customerEmail)}</li>
          <li><strong>Phone:</strong> ${booking.customerPhone}</li>
        </ul>
        
        <h3>Appointment:</h3>
        <ul>
          <li><strong>Date:</strong> ${booking.appointmentDate}</li>
          <li><strong>Time:</strong> ${booking.appointmentTime}</li>
          <li><strong>Location:</strong> ${booking.address}</li>
          <li><strong>Service:</strong> ${escapeHtml(booking.serviceType)}</li>
          <li><strong>Price:</strong> $${booking.price}</li>
        </ul>
        
        <p><strong>Notes:</strong> ${escapeHtml(booking.notes || "None")}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send notary notification email.");
    throw new Error("Failed to send notary notification email.", { cause: error as unknown });
  }
}
