jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { priority: _priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

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
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn(),
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

jest.mock("../../lib/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: jest.fn(() => false),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

describe("Header", () => {
  it("renders the logo", () => {
    render(<Header />);
    expect(
      screen.getByAltText(/Keystone Notary Group LLC/i)
    ).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    // Use getAllByText because links appear in both desktop and mobile menus
    expect(screen.getAllByText(/About/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Services/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Coverage/i)[0]).toBeInTheDocument();
  });

  it("renders the Book Now CTA", () => {
    render(<Header />);
    expect(screen.getAllByText(/Book Now/i)[0]).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(<Header />);
    const menuButton = screen.getByLabelText(/Open menu/i);
    fireEvent.click(menuButton);
    expect(screen.getByLabelText(/Close menu/i)).toBeInTheDocument();
  });

  it("skips GSAP animations when user prefers reduced motion", () => {
    (usePrefersReducedMotion as jest.Mock).mockReturnValueOnce(true);
    render(<Header />);
    expect(gsap.to).not.toHaveBeenCalled();
  });
});
