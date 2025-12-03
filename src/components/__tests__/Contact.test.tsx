import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contact from "../Contact";

// Mock GSAP
jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
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

describe("Contact", () => {
  it("renders the contact form", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    // Updated expectation to match "How can we help? *"
    expect(screen.getByPlaceholderText(/help/i)).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<Contact />);
    expect(screen.getByText(/Get in/i)).toBeInTheDocument();
    expect(screen.getByText(/Touch/i)).toBeInTheDocument();
  });

  it("handles form submission", () => {
    render(<Contact />);
    const submitButton = screen.getByText(/Send Message/i);
    fireEvent.click(submitButton);
    // Add assertions for submission logic if applicable
  });
});
