import { Resend } from "resend";

import {
  createResendClient,
  sendBookingConfirmation,
  sendNotaryNotification,
} from "./email";
import type { BookingDetails } from "./google-calendar";

const sendEmailMock = jest.fn();

jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation((key: string) => ({
      key,
      emails: { send: sendEmailMock },
    })),
  };
});

const ORIGINAL_ENV = process.env;
const ORIGINAL_WINDOW = global.window;

const buildUnsafeBooking = (): BookingDetails => ({
  customerName: '<script>alert("xss")</script>',
  customerEmail: 'user@example.com"><img src=x onerror=alert(1)>',
  customerPhone: '555-5555"><script>alert("phone")</script>',
  appointmentDate: '2025-01-01"><script>alert("date")</script>',
  appointmentTime: '10:00"><script>alert("time")</script>',
  address: '123 Fake St <script>alert("address")</script>',
  serviceType: 'Notary <img src=x onerror=alert("service")>',
  price: 125,
  notes: '<b onmouseover=alert("notes")>rush</b>',
});

describe("email utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendEmailMock.mockReset();
    sendEmailMock.mockResolvedValue({ id: "mocked" });
    process.env = { ...ORIGINAL_ENV };
    delete process.env.RESEND_API_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    (global as typeof globalThis & { window?: unknown }).window = ORIGINAL_WINDOW;
  });

  it("throws when RESEND_API_KEY is missing", () => {
    expect(() => createResendClient()).toThrow(
      /RESEND_API_KEY is required/i
    );
  });

  it.each([
    "re_123456789",
    "re_123",
    "re-test-key-abc",
    "your_resend_api_key",
    "placeholder_key",
    "test_key_123",
  ])("rejects known placeholder Resend key: %s", (placeholderKey) => {
    process.env.RESEND_API_KEY = placeholderKey;

    expect(() => createResendClient()).toThrow(/placeholder/i);
  });

  it("initializes Resend with the provided key when valid", () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";

    const client = createResendClient();

    expect(Resend).toHaveBeenCalledWith("re_test_live_key_abc");
    expect(client).toEqual({
      key: "re_test_live_key_abc",
      emails: { send: sendEmailMock },
    });
  });

  it("prevents createResendClient from running in the browser", () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";
    process.env.NODE_ENV = "production";
    (global as typeof globalThis & { window?: unknown }).window = {} as Window;

    expect(() => createResendClient()).toThrow(/server/i);
  });

  it("escapes user input when sending the booking confirmation email", async () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";
    const booking = buildUnsafeBooking();

    await sendBookingConfirmation(booking, '<script>alert("id")</script>');

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const payload = sendEmailMock.mock.calls[0][0];

    expect(payload.to).toBe(booking.customerEmail);
    expect(payload.html).toContain("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    expect(payload.html).not.toContain(booking.customerName);
    expect(payload.html).not.toContain(booking.address);
    expect(payload.html).not.toContain("alert(\"id\")");
  });

  it("escapes user input when notifying the notary", async () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";
    const booking = buildUnsafeBooking();

    await sendNotaryNotification(booking, '<img src=x onerror=alert("id")>');

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const payload = sendEmailMock.mock.calls[0][0];

    expect(payload.to).toBeDefined();
    expect(payload.subject).not.toContain(booking.customerName);
    expect(payload.html).not.toContain(booking.customerEmail);
    expect(payload.html).toContain("&lt;script&gt;alert(&quot;address&quot;)&lt;/script&gt;");
  });

  it("attaches the root cause when email sending fails", async () => {
    process.env.RESEND_API_KEY = "re_test_live_key_abc";
    const booking = buildUnsafeBooking();
    const failure = new Error("resend unavailable");
    sendEmailMock.mockRejectedValueOnce(failure);

    try {
      await sendBookingConfirmation(booking, "safe-id");
      fail("Expected booking confirmation to throw");
    } catch (error) {
      const typedError = error as Error & { cause?: unknown };
      expect(typedError.message).toBe(
        "Failed to send booking confirmation email."
      );
      expect(typedError.cause).toBe(failure);
    }
  });
});
