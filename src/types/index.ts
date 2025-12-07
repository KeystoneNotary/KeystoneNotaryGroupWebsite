// Type definitions for the Keystone Notary Group LLC Website

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

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  expiresAt: Date;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}
