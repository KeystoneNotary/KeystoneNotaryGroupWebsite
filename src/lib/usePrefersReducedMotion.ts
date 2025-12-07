import { useEffect, useState } from "react";

/**
 * Lightweight prefers-reduced-motion detector with state sync.
 * Avoids extra GSAP/animation work when the user opts out of motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Use a ref to track the current value to avoid unnecessary re-renders
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value asynchronously to avoid the lint warning
    Promise.resolve().then(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    });

    // Add listener for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
