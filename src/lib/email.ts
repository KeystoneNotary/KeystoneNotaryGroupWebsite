import { Resend } from "resend";
import { BookingDetails } from "./google-calendar";

const RESEND_PLACEHOLDER_PATTERNS = [
  /^re_123/i,
  /^re-test-key/i,
  /^your_resend/i,
  /^placeholder/i,
  /^test_key/i,
];

const escapeHtml = (text: string): string =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#x27;",
      }[char] || char)
  );

const escapeValue = (value: string | number | null | undefined): string =>
  escapeHtml(String(value ?? ""));

const formatPrice = (price: number): string => {
  if (!Number.isFinite(price)) {
    return "N/A";
  }

  return price.toFixed(2);
};

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
  const isBrowserRuntime = typeof window !== "undefined";
  const isTest = process.env.NODE_ENV === "test";

  if (isBrowserRuntime && !isTest) {
    throw new Error("createResendClient must only be used on the server.");
  }

  const apiKey = resolveResendApiKey();
  return new Resend(apiKey);
};

const NOTARY_EMAIL =
  process.env.NOTARY_EMAIL || "contact@keystonenotarygroup.com";

const buildBookingConfirmationHtml = (
  booking: BookingDetails,
  bookingId: string
): string => {
  const safeName = escapeValue(booking.customerName);
  const safeDate = escapeValue(booking.appointmentDate);
  const safeTime = escapeValue(booking.appointmentTime);
  const safeAddress = escapeValue(booking.address);
  const safeService = escapeValue(booking.serviceType);
  const safeBookingId = escapeValue(bookingId);
  const safePrice = escapeValue(formatPrice(booking.price));

  return `
    <h1>Appointment Confirmed</h1>
    <p>Dear ${safeName},</p>
    <p>Your appointment has been successfully scheduled.</p>
    
    <h3>Details:</h3>
    <ul>
      <li><strong>Date:</strong> ${safeDate}</li>
      <li><strong>Time:</strong> ${safeTime}</li>
      <li><strong>Location:</strong> ${safeAddress}</li>
      <li><strong>Service:</strong> ${safeService}</li>
      <li><strong>Estimated Price:</strong> $${safePrice}</li>
    </ul>
    
    <p><strong>Booking ID:</strong> ${safeBookingId}</p>
    
    <p>Please have your valid government-issued ID and documents ready (unsigned).</p>
    
    <p>If you need to reschedule, please contact us at (267) 309-9000.</p>
    
    <p>Best regards,<br/>Keystone Notary Group</p>
  `;
};

const buildNotaryNotificationHtml = (
  booking: BookingDetails,
  bookingId: string
): string => {
  const safeName = escapeValue(booking.customerName);
  const safeEmail = escapeValue(booking.customerEmail);
  const safePhone = escapeValue(booking.customerPhone);
  const safeDate = escapeValue(booking.appointmentDate);
  const safeTime = escapeValue(booking.appointmentTime);
  const safeAddress = escapeValue(booking.address);
  const safeService = escapeValue(booking.serviceType);
  const safePrice = escapeValue(formatPrice(booking.price));
  const safeNotes = escapeValue(booking.notes || "None");
  const safeBookingId = escapeValue(bookingId);

  return `
    <h1>New Booking Received</h1>
    
    <h3>Customer:</h3>
    <ul>
      <li><strong>Name:</strong> ${safeName}</li>
      <li><strong>Email:</strong> ${safeEmail}</li>
      <li><strong>Phone:</strong> ${safePhone}</li>
    </ul>
    
    <h3>Appointment:</h3>
    <ul>
      <li><strong>Date:</strong> ${safeDate}</li>
      <li><strong>Time:</strong> ${safeTime}</li>
      <li><strong>Location:</strong> ${safeAddress}</li>
      <li><strong>Service:</strong> ${safeService}</li>
      <li><strong>Price:</strong> $${safePrice}</li>
    </ul>
    
    <p><strong>Notes:</strong> ${safeNotes}</p>
    <p><strong>Booking ID:</strong> ${safeBookingId}</p>
  `;
};

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
      html: buildBookingConfirmationHtml(booking, bookingId),
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email.", error);
    throw new Error("Failed to send booking confirmation email.", {
      cause: error as unknown,
    });
  }
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
      subject: `NEW BOOKING: ${escapeValue(booking.customerName)} - ${escapeValue(
        booking.appointmentDate
      )}`,
      html: buildNotaryNotificationHtml(booking, bookingId),
    });
  } catch (error) {
    console.error("Failed to send notary notification email.", error);
    throw new Error("Failed to send notary notification email.", {
      cause: error as unknown,
    });
  }
}
