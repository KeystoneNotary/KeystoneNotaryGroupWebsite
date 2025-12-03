import React from "react";
import { render, screen } from "@testing-library/react";
import ServiceCoverage from "../ServiceCoverage";

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

describe("ServiceCoverage (Fluid Version)", () => {
  it("renders the section header", () => {
    render(<ServiceCoverage />);
    expect(screen.getAllByText(/Service Coverage/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Where We/i)[0]).toBeInTheDocument();
  });

  it("renders service areas", () => {
    render(<ServiceCoverage />);
    expect(screen.getAllByText("Pennsylvania")[0]).toBeInTheDocument();
    expect(screen.getAllByText("New Jersey")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Delaware")[0]).toBeInTheDocument();
  });

  it("renders credentials", () => {
    render(<ServiceCoverage />);
    expect(screen.getAllByText("Licensed & Bonded")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Fully Insured")[0]).toBeInTheDocument();
  });

  it("renders service radius info", () => {
    render(<ServiceCoverage />);
    expect(
      screen.getAllByText(/50-Mile Service Radius/i)[0]
    ).toBeInTheDocument();
  });
});
