/**
 * Shared GSAP Animation Utilities
 *
 * Professional-grade animation library for consistent, performant animations
 * across the Keystone Notary Group website.
 *
 * @module gsap-animations
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  force3D?: boolean;
}

export interface ParallaxConfig extends AnimationConfig {
  startY?: number;
  endY?: number;
  startOpacity?: number;
  endOpacity?: number;
  startRotation?: number;
  endRotation?: number;
  startBlur?: number;
  endBlur?: number;
  startScale?: number;
  endScale?: number;
}

export interface ScrollConfig {
  trigger: gsap.DOMTarget;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
}

export interface ExplosionConfig extends AnimationConfig {
  distance?: number;
  rotationRange?: number;
  blur?: number;
  scale?: number;
}

// ============================================================================
// BACKGROUND TYPOGRAPHY ANIMATIONS
// ============================================================================

/**
 * Creates a parallax effect for large background typography
 * Best for: Large decorative text that scrolls at different speed
 *
 * @example
 * parallaxBackgroundText(backgroundRef.current, containerRef.current, {
 *   startY: 100,
 *   endY: -50,
 *   startBlur: 30,
 *   endBlur: 0
 * });
 */
export const parallaxBackgroundText = (
  element: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  config: ParallaxConfig = {}
): GSAPTween => {
  const {
    startY = 100,
    endY = -50,
    startOpacity = 0,
    endOpacity = 0.03,
    startRotation = 0,
    endRotation = 0,
    startBlur = 30,
    endBlur = 0,
    startScale = 0.95,
    endScale = 1,
  } = config;

  return gsap.fromTo(
    element,
    {
      y: startY,
      opacity: startOpacity,
      rotation: startRotation,
      scale: startScale,
    },
    {
      y: endY,
      opacity: endOpacity,
      rotation: endRotation,
      scale: endScale,
      filter: `blur(${endBlur}px)`,
      force3D: true,
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
};

/**
 * Simpler background text reveal for non-parallax effects
 * Best for: Background text that just fades in
 */
export const backgroundTextReveal = (
  element: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  config: ParallaxConfig = {}
): GSAPTween => {
  const {
    startY = 50,
    startOpacity = 0,
    startRotation = 5,
    startBlur = 25,
    endOpacity = 0.03,
    duration = 0.8,
    ease = "power2.out",
  } = config;

  return gsap.fromTo(
    element,
    {
      y: startY,
      opacity: startOpacity,
      rotation: startRotation,
      scale: 0.9,
      filter: `blur(${startBlur}px)`,
    },
    {
      y: 0,
      opacity: endOpacity,
      rotation: 0,
      scale: 1,
      filter: "blur(0px)",
      duration,
      ease,
      force3D: true,
      scrollTrigger: {
        trigger,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

// ============================================================================
// EXPLODED ASSEMBLY ANIMATIONS
// ============================================================================

/**
 * Creates an "exploded assembly" effect where elements fly in from different directions
 * Best for: Section headers, card grids, any multi-element group
 *
 * @example
 * explosionReveal(cardElements, {
 *   distance: 80,
 *   rotationRange: 10,
 *   blur: 15,
 *   stagger: 0.08
 * });
 */
export const explosionReveal = (
  elements: gsap.DOMTarget,
  config: ExplosionConfig = {}
): gsap.core.Timeline => {
  const {
    distance = 60,
    rotationRange = 5,
    blur = 12,
    scale = 0.9,
    stagger = 0.08,
    ease = "back.out(1.5)",
    duration = 0.8,
  } = config;

  const tl = gsap.timeline();
  const elementsArray = gsap.utils.toArray(elements);

  elementsArray.forEach((el, i) => {
    // Calculate angle for radial explosion pattern
    const angle = ((i % 3) - 1) * 30; // Creates pattern: -30°, 0°, 30°, -30°, ...
    const xOffset = Math.sin((angle * Math.PI) / 180) * distance;
    const yOffset = distance;
    const rotation = (angle / 3) * (rotationRange / 10);

    tl.from(
      el as Element,
      {
        x: xOffset,
        y: yOffset,
        opacity: 0,
        scale,
        rotation,
        filter: `blur(${blur}px)`,
        ease,
        duration,
        force3D: true,
      },
      i * stagger
    );
  });

  return tl;
};

/**
 * Multi-direction reveal for section headers (title + subtitle)
 * Best for: Page section titles with main heading and accent text
 */
export const headerExplodedAssembly = (
  label: gsap.DOMTarget,
  titleMain: gsap.DOMTarget,
  titleAccent: gsap.DOMTarget,
  subtitle?: gsap.DOMTarget
): gsap.core.Timeline => {
  const tl = gsap.timeline();

  // Label: Compressed letter-spacing expansion
  tl.from(
    label,
    {
      y: -30,
      opacity: 0,
      letterSpacing: "1em",
      ease: "power2.out",
      duration: 0.6,
      force3D: true,
    },
    0
  );

  // Main title: Flies from left with blur and rotation
  tl.from(
    titleMain,
    {
      x: -80,
      y: -30,
      opacity: 0,
      filter: "blur(15px)",
      rotation: -3,
      ease: "power2.out",
      duration: 0.8,
      force3D: true,
    },
    0.1
  );

  // Accent title: Flies from right with blur and rotation
  tl.from(
    titleAccent,
    {
      x: 80,
      y: 30,
      opacity: 0,
      filter: "blur(15px)",
      rotation: 3,
      ease: "power2.out",
      duration: 0.8,
      force3D: true,
    },
    0.2
  );

  // Subtitle: Fades up if provided
  if (subtitle) {
    tl.from(
      subtitle,
      {
        y: 30,
        opacity: 0,
        ease: "power2.out",
        duration: 0.6,
        force3D: true,
      },
      0.3
    );
  }

  return tl;
};

// ============================================================================
// STAGGERED REVEALS
// ============================================================================

/**
 * Simple staggered reveal for lists or grids
 * Best for: FAQ items, list items, simple card grids
 */
export const staggerReveal = (
  elements: gsap.DOMTarget,
  config: AnimationConfig & { from?: gsap.TweenVars } = {}
): gsap.core.Timeline => {
  const {
    stagger = 0.05,
    ease = "power2.out",
    duration = 0.6,
    from = { y: 30, opacity: 0 },
  } = config;

  const tl = gsap.timeline();

  tl.from(elements, {
    ...from,
    stagger,
    ease,
    duration,
    force3D: true,
  });

  return tl;
};

/**
 * Advanced staggered reveal with blur and rotation
 * Best for: Cards, form fields, any elements that deserve extra polish
 */
export const staggerRevealAdvanced = (
  elements: gsap.DOMTarget,
  config: AnimationConfig & {
    fromX?: number;
    fromY?: number;
    rotation?: number;
    blur?: number;
    scale?: number;
  } = {}
): gsap.core.Timeline => {
  const {
    fromX = 0,
    fromY = 30,
    rotation = -2,
    blur = 10,
    scale = 0.95,
    stagger = 0.05,
    ease = "back.out(1.3)",
    duration = 0.6,
  } = config;

  const tl = gsap.timeline();

  tl.from(elements, {
    x: fromX,
    y: fromY,
    opacity: 0,
    scale,
    rotation,
    filter: `blur(${blur}px)`,
    stagger,
    ease,
    duration,
    force3D: true,
  });

  return tl;
};

// ============================================================================
// SPECIALIZED EFFECTS
// ============================================================================

/**
 * Icon spin entrance (for icons within cards)
 * Best for: Icons, badges, checkmarks
 */
export const iconSpinReveal = (
  icons: gsap.DOMTarget,
  config: AnimationConfig = {}
): gsap.core.Timeline => {
  const {
    stagger = 0.1,
    ease = "back.out(2)",
    duration = 0.6,
    delay = 0,
  } = config;

  const tl = gsap.timeline({ delay });

  tl.from(icons, {
    scale: 0,
    rotation: -180,
    opacity: 0,
    stagger,
    ease,
    duration,
    force3D: true,
  });

  return tl;
};

/**
 * Bounce-in effect for CTAs and important buttons
 * Best for: Primary CTAs, submit buttons, important actions
 */
export const bounceIn = (
  element: gsap.DOMTarget,
  config: AnimationConfig = {}
): GSAPTween => {
  const { ease = "back.out(2)", duration = 0.6, delay = 0 } = config;

  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    ease,
    duration,
    delay,
    force3D: true,
  });
};

/**
 * Scale and blur entrance for images or media
 * Best for: Images, videos, media content
 */
export const mediaReveal = (
  element: gsap.DOMTarget,
  config: AnimationConfig & { startScale?: number; blur?: number } = {}
): GSAPTween => {
  const {
    startScale = 0.95,
    blur = 20,
    ease = "power2.out",
    duration = 1,
    delay = 0,
  } = config;

  return gsap.from(element, {
    scale: startScale,
    opacity: 0,
    filter: `blur(${blur}px)`,
    ease,
    duration,
    delay,
    force3D: true,
  });
};

/**
 * Radial explosion for calendars or grid layouts
 * Best for: Calendar grids, date pickers, numerical grids
 */
export const radialExplosion = (
  elements: gsap.DOMTarget,
  config: ExplosionConfig & { columns?: number } = {}
): gsap.core.Timeline => {
  const {
    columns = 7,
    distance = 50,
    blur = 10,
    scale = 0.5,
    stagger = 0.01,
    ease = "back.out(1.5)",
    duration = 0.6,
  } = config;

  const tl = gsap.timeline();
  const elementsArray = gsap.utils.toArray(elements);

  elementsArray.forEach((el, i) => {
    // Calculate radial pattern based on grid position
    const angle = (i % columns) * 30 - 90; // Spread across columns
    const row = Math.floor(i / columns);
    const dist = distance + row * 30;

    const xOffset = Math.cos((angle * Math.PI) / 180) * dist;
    const yOffset = Math.sin((angle * Math.PI) / 180) * dist;

    tl.from(
      el as Element,
      {
        x: xOffset,
        y: yOffset,
        opacity: 0,
        scale,
        rotation: angle / 4,
        filter: `blur(${blur}px)`,
        ease,
        duration,
        force3D: true,
      },
      i * stagger
    );
  });

  return tl;
};

// ============================================================================
// SCROLL-TRIGGERED TIMELINE HELPERS
// ============================================================================

/**
 * Creates a scroll-triggered timeline with scrub
 * Best for: Complex scroll-based animations
 */
export const createScrollTimeline = (
  trigger: gsap.DOMTarget,
  config: Partial<ScrollConfig> = {}
): gsap.core.Timeline => {
  const { start = "top 70%", end = "center center", scrub = 1 } = config;

  return gsap.timeline({
    scrollTrigger: {
      trigger: config.trigger || trigger,
      start,
      end,
      scrub,
    },
  });
};

/**
 * Creates a toggle-action timeline (no scrub, just trigger)
 * Best for: Simple reveal animations that don't need scroll-sync
 */
export const createToggleTimeline = (
  trigger: gsap.DOMTarget,
  config: Partial<ScrollConfig> = {}
): gsap.core.Timeline => {
  const { start = "top 70%", toggleActions = "play none none reverse" } =
    config;

  return gsap.timeline({
    scrollTrigger: {
      trigger: config.trigger || trigger,
      start,
      toggleActions,
    },
  });
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Kills all ScrollTriggers for cleanup
 * Call this in component unmount
 */
export const killAllScrollTriggers = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export const refreshScrollTriggers = (): void => {
  ScrollTrigger.refresh();
};

/**
 * Sets up intersection observer for performance
 * Only animates elements when they're near viewport
 */
export const lazyScrollTrigger = (
  element: HTMLElement,
  animationFn: () => void
): IntersectionObserver => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animationFn();
          observer.disconnect();
        }
      });
    },
    { rootMargin: "100px" }
  );

  observer.observe(element);
  return observer;
};

// ============================================================================
// PRESET COMBINATIONS
// ============================================================================

/**
 * Complete section reveal (background + header + content)
 * The full package for a perfect section entrance
 */
export const completeSectionReveal = (config: {
  container: HTMLElement;
  backgroundText?: HTMLElement;
  label?: HTMLElement;
  titleMain?: HTMLElement;
  titleAccent?: HTMLElement;
  subtitle?: HTMLElement;
  content?: HTMLElement[];
}): gsap.core.Timeline => {
  const masterTl = gsap.timeline();

  // Background typography (if provided)
  if (config.backgroundText && config.container) {
    parallaxBackgroundText(config.backgroundText, config.container);
  }

  // Header exploded assembly (if provided)
  if (config.label && config.titleMain && config.titleAccent) {
    const headerTl = headerExplodedAssembly(
      config.label,
      config.titleMain,
      config.titleAccent,
      config.subtitle
    );

    masterTl.add(headerTl, 0);
  }

  // Content reveal (if provided)
  if (config.content && config.content.length > 0) {
    const contentTl = staggerRevealAdvanced(config.content, {
      stagger: 0.08,
    });

    masterTl.add(contentTl, 0.3);
  }

  return masterTl;
};

export default {
  // Background effects
  parallaxBackgroundText,
  backgroundTextReveal,

  // Explosions and assemblies
  explosionReveal,
  headerExplodedAssembly,
  radialExplosion,

  // Staggered reveals
  staggerReveal,
  staggerRevealAdvanced,

  // Specialized effects
  iconSpinReveal,
  bounceIn,
  mediaReveal,

  // Timeline helpers
  createScrollTimeline,
  createToggleTimeline,

  // Performance
  killAllScrollTriggers,
  refreshScrollTriggers,
  lazyScrollTrigger,

  // Presets
  completeSectionReveal,
};
