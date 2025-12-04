import React from "react";
import { render, screen } from "@testing-library/react";
import HorizontalServices from "../HorizontalServices";

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
  })),
  matchMedia: jest.fn().mockReturnValue({
    add: jest.fn(),
    revert: jest.fn(),
  }),
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

describe("HorizontalServices (Kinetic Version)", () => {
  it("renders the upgraded section label", () => {
    render(<HorizontalServices />);
    expect(screen.getByText(/Signature Services/i)).toBeInTheDocument();
  });

  it("renders all service titles", () => {
    render(<HorizontalServices />);
    expect(screen.getByText(/ESTATE & REAL ESTATE/i)).toBeInTheDocument();
    expect(screen.getByText(/EXECUTIVE MOBILE/i)).toBeInTheDocument();
    expect(screen.getByText(/APOSTILLE & AUTHENTICATION/i)).toBeInTheDocument();
  });

  it("renders service numbers", () => {
    render(<HorizontalServices />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("shows the new service assurance chips", () => {
    render(<HorizontalServices />);
    expect(screen.getByText(/50-mile coverage/i)).toBeInTheDocument();
  });

  it("does not render boxy containers", () => {
    const { container } = render(<HorizontalServices />);
    // Check for absence of borders or white backgrounds which indicate "boxes"
    const boxes = container.querySelectorAll(".border, .bg-white");
    expect(boxes.length).toBe(0);
  });
});
