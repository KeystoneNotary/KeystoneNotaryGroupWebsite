import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "../Hero";
import TheFirm from "../TheFirm";
import BookingSection from "../BookingSection";
import HorizontalServices from "../HorizontalServices";
import Contact from "../Contact";
import FAQ from "../FAQ";

jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    add: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
  })),
  utils: {
    toArray: jest.fn((arr) => arr),
  },
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

describe("Cinematic section typography and animations", () => {
  it("keeps the hero heading in the serif family and animation-ready", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", {
      name: /Professional Notary Services/i,
    });

    expect(heading).toHaveClass("font-serif");
    expect(heading.className).toMatch(/will-change-transform/);
  });

  it("preserves the philosophy headline pairing and animation hooks", () => {
    render(<TheFirm />);

    expect(screen.getByText(/The Philosophy/i).className).toMatch(
      /will-change-transform/
    );

    const topLine = screen.getByText(/We don't just sign./i);
    const accentLine = screen.getByText(/We certify trust./i);

    expect(topLine).toHaveClass("font-serif");
    expect(topLine.className).toMatch(/will-change-transform/);
    expect(accentLine).toHaveClass("italic");
    expect(accentLine.className).toMatch(/will-change-transform/);
  });

  it("keeps booking and services headers wired for the cinematic timeline", () => {
    render(<BookingSection />);
    render(<HorizontalServices />);

    const bookingLabel = screen.getByText(/Concierge Booking/i);
    const bookingHeading = screen.getByRole("heading", {
      name: /Schedule Appointment/i,
    });
    const servicesLabel = screen.getByText(/Signature Services/i);
    const servicesHeading = screen.getByRole("heading", {
      name: /Precision in motion/i,
    });

    expect(bookingLabel.className).toMatch(/will-change-transform/);
    expect(bookingHeading.className).toMatch(/font-serif/);
    expect(bookingHeading.className).toMatch(/will-change-transform/);
    expect(servicesLabel.className).toMatch(/will-change-transform/);
    expect(servicesHeading.className).toMatch(/will-change-transform/);
  });

  it("restores cinematic header styling for contact and FAQ sections", () => {
    render(<Contact />);
    render(<FAQ />);

    const contactHeading = screen.getByRole("heading", { name: /Get in/i });
    const faqHeading = screen.getByRole("heading", { name: /Answers You Need/i });

    expect(contactHeading.className).toMatch(/will-change-transform/);
    expect(contactHeading.className).toMatch(/font-serif/);
    expect(faqHeading.className).toMatch(/will-change-transform/);
    expect(faqHeading.className).toMatch(/font-serif/);
  });
});
