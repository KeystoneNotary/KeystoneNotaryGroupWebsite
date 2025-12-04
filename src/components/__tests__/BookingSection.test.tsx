import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingSection from "../BookingSection";

describe("BookingSection", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2024-12-02T12:00:00Z"));
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ availableSlots: ["09:00", "10:00"] }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = originalFetch;
  });

  it("renders header and weekday labels", () => {
    render(<BookingSection />);
    expect(screen.getByText(/Reserve Your Time/i)).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
  });

  it("loads availability after selecting a valid date", async () => {
    render(<BookingSection />);
    const dayButton = screen.getAllByRole("button", { name: /Select .*2024/ })
      .find((btn) => !btn.hasAttribute("disabled"));
    expect(dayButton).toBeTruthy();
    if (!dayButton) return;
    fireEvent.click(dayButton);

    expect(screen.getByText(/Checking availability/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("9:00 AM")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });
  });

  it("reveals the form after picking a slot", async () => {
    render(<BookingSection />);
    const dayButton = screen.getAllByRole("button", { name: /Select .*2024/ })
      .find((btn) => !btn.hasAttribute("disabled"));
    if (!dayButton) return;
    fireEvent.click(dayButton);

    await waitFor(() => screen.getByText("9:00 AM"));
    fireEvent.click(screen.getByText("9:00 AM"));

    expect(screen.getByLabelText(/Booking form/i)).toBeInTheDocument();
  });
});
