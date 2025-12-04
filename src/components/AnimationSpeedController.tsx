"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * Global GSAP speed controller to soften/sn slow all animations.
 * Applies a timeScale to the global timeline for a calmer pace.
 */
export default function AnimationSpeedController() {
  useEffect(() => {
    const timeline = gsap.globalTimeline;
    const previous = timeline.timeScale();
    // Slow down animations globally (0.7x pace)
    timeline.timeScale(0.7);

    return () => {
      timeline.timeScale(previous);
    };
  }, []);

  return null;
}
