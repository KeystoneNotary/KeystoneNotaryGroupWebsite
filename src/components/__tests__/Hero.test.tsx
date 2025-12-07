import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import Hero from "../Hero";

describe("Hero video loading", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("defers video source loading until idle", () => {
    render(<Hero />);

    const video = screen.getByTestId("hero-video");
    expect(video.querySelector("source")).toBeNull();

    act(() => {
      jest.runAllTimers();
    });

    expect(video.querySelector("source")).not.toBeNull();
  });

  it("respects prefers-reduced-motion and uses a static fallback", async () => {
    const originalMatchMedia = window.matchMedia;
    (
      window as unknown as { matchMedia: (query: string) => MediaQueryList }
    ).matchMedia = (query: string) =>
      ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as unknown as MediaQueryList);

    render(<Hero />);

    await waitFor(() => {
      expect(screen.queryByTestId("hero-video")).toBeNull();
    });
    expect(screen.getByTestId("hero-reduced-fallback")).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
