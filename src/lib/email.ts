import { Resend } from "resend";
import { BookingDetails } from "./google-calendar";

const getResend = () => new Resend(process.env.RESEND_API_KEY || "re_123");
const NOTARY_EMAIL =
  process.env.NOTARY_EMAIL || "contact@keystonenotarygroup.com";

export async function sendBookingConfirmation(
  booking: BookingDetails,
  bookingId: string
) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Keystone Notary Group <bookings@keystonenotarygroup.com>",
      to: booking.customerEmail,
      subject: "Booking Confirmed - Keystone Notary Group",
      html: `
        <h1>Appointment Confirmed</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Your appointment has been successfully scheduled.</p>
        
        <h3>Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${booking.appointmentDate}</li>
          <li><strong>Time:</strong> ${booking.appointmentTime}</li>
          <li><strong>Location:</strong> ${booking.address}</li>
          <li><strong>Service:</strong> ${booking.serviceType}</li>
          <li><strong>Estimated Price:</strong> $${booking.price}</li>
        </ul>
        
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        
        <p>Please have your valid government-issued ID and documents ready (unsigned).</p>
        
        <p>If you need to reschedule, please contact us at (267) 309-9000.</p>
        
        <p>Best regards,<br/>Keystone Notary Group</p>
      `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

export async function sendNotaryNotification(
  booking: BookingDetails,
  bookingId: string
) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Keystone System <system@keystonenotarygroup.com>",
      to: NOTARY_EMAIL,
      subject: `NEW BOOKING: ${booking.customerName} - ${booking.appointmentDate}`,
      html: `
        <h1>New Booking Received</h1>
        
        <h3>Customer:</h3>
        <ul>
          <li><strong>Name:</strong> ${booking.customerName}</li>
          <li><strong>Email:</strong> ${booking.customerEmail}</li>
          <li><strong>Phone:</strong> ${booking.customerPhone}</li>
        </ul>
        
        <h3>Appointment:</h3>
        <ul>
          <li><strong>Date:</strong> ${booking.appointmentDate}</li>
          <li><strong>Time:</strong> ${booking.appointmentTime}</li>
          <li><strong>Location:</strong> ${booking.address}</li>
          <li><strong>Service:</strong> ${booking.serviceType}</li>
          <li><strong>Price:</strong> $${booking.price}</li>
        </ul>
        
        <p><strong>Notes:</strong> ${booking.notes || "None"}</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending notary notification:", error);
  }
}
