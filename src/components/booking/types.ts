/**
 * Booking Component Types
 * Shared type definitions for booking sub-components
 */

export type AvailabilityState = "idle" | "loading" | "error" | "loaded";

export interface CalendarViewProps {
  currentMonth: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: "prev" | "next") => void;
}

export interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  availableSlots: string[];
  availabilityState: AvailabilityState;
  availabilityError: string | null;
  onTimeSelect: (time: string) => void;
  onReset: () => void;
}

export interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  isSubmitting: boolean;
  bookingError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onAddressChange?: (address: string, city: string, state: string) => void;
}
