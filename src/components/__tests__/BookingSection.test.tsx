import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingSection from "../BookingSection";

// Mock GSAP
jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    add: jest.fn().mockReturnThis(),
  })),
  utils: {
    toArray: jest.fn(() => []),
  },
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

// Mock API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({ availableSlots: ["09:00", "10:00", "11:00"] }),
    ok: true,
  })
) as jest.Mock;

describe("BookingSection (Ethereal Version)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the section header", () => {
    render(<BookingSection />);
    expect(screen.getByText(/Reserve Your Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule/i)).toBeInTheDocument();
  });

  it("renders the calendar grid", () => {
    render(<BookingSection />);
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
  });

  it("allows selecting a date", async () => {
    render(<BookingSection />);
    // Find a date button that is not disabled (e.g., 15th of current month)
    // Note: This relies on the current date mocking or logic.
    // For simplicity, we just look for a button with text "15"
    const dayButton = screen.getByText("15");
    fireEvent.click(dayButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Time/i)).toBeInTheDocument();
    });
  });

  it("shows time slots after date selection", async () => {
    render(<BookingSection />);
    const dayButton = screen.getByText("15");
    fireEvent.click(dayButton);

    await waitFor(() => {
      expect(screen.getByText("9:00 AM")).toBeInTheDocument();
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });
  });

  it("renders the calculator sidebar", () => {
    render(<BookingSection />);
    expect(screen.getByText(/Need Assistance/i)).toBeInTheDocument();
    expect(screen.getByText(/\(267\) 309-9000/i)).toBeInTheDocument();
  });
});
