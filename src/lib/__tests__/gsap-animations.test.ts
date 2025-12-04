/**
 * Tests for GSAP Animation Utilities
 *
 * Following TDD best practices to ensure animation quality and consistency
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  parallaxBackgroundText,
  backgroundTextReveal,
  explosionReveal,
  headerExplodedAssembly,
  staggerReveal,
  staggerRevealAdvanced,
  iconSpinReveal,
  bounceIn,
  mediaReveal,
  radialExplosion,
  createScrollTimeline,
  createToggleTimeline,
  completeSectionReveal,
  killAllScrollTriggers,
  refreshScrollTriggers,
} from "../gsap-animations";

// Mock GSAP
jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    fromTo: jest.fn(() => ({ kill: jest.fn() })),
    from: jest.fn(() => ({ kill: jest.fn() })),
    to: jest.fn(() => ({ kill: jest.fn() })),
    timeline: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      fromTo: jest.fn().mockReturnThis(),
      to: jest.fn().mockReturnThis(),
      add: jest.fn().mockReturnThis(),
      kill: jest.fn(),
    })),
    utils: {
      toArray: jest.fn((elements) =>
        Array.isArray(elements) ? elements : [elements]
      ),
    },
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    getAll: jest.fn(() => [{ kill: jest.fn() }]),
    refresh: jest.fn(),
  },
}));

describe("GSAP Animation Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================================
  // BACKGROUND TYPOGRAPHY ANIMATIONS
  // ========================================================================

  describe("parallaxBackgroundText", () => {
    it("should create parallax animation with default config", () => {
      const element = document.createElement("div");
      const trigger = document.createElement("div");

      parallaxBackgroundText(element, trigger);

      expect(gsap.fromTo).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          y: 100,
          opacity: 0,
          rotation: 0,
          scale: 0.95,
          filter: "blur(30px)",
        }),
        expect.objectContaining({
          y: -50,
          opacity: 0.03,
          rotation: 0,
          scale: 1,
          filter: "blur(0px)",
          force3D: true,
          scrollTrigger: expect.objectContaining({
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          }),
        })
      );
    });

    it("should accept custom config", () => {
      const element = document.createElement("div");
      const trigger = document.createElement("div");

      parallaxBackgroundText(element, trigger, {
        startY: 200,
        endY: -100,
        startOpacity: 0.1,
        endOpacity: 0.05,
        startBlur: 40,
        endBlur: 5,
      });

      expect(gsap.fromTo).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          y: 200,
          opacity: 0.1,
          filter: "blur(40px)",
        }),
        expect.objectContaining({
          y: -100,
          opacity: 0.05,
          filter: "blur(5px)",
        })
      );
    });
  });

  describe("backgroundTextReveal", () => {
    it("should create toggle-action reveal", () => {
      const element = document.createElement("div");
      const trigger = document.createElement("div");

      backgroundTextReveal(element, trigger);

      expect(gsap.fromTo).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          y: 50,
          opacity: 0,
          rotation: 5,
          filter: "blur(25px)",
        }),
        expect.objectContaining({
          y: 0,
          opacity: 0.03,
          rotation: 0,
          filter: "blur(0px)",
          force3D: true,
          scrollTrigger: expect.objectContaining({
            trigger,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }),
        })
      );
    });
  });

  // ========================================================================
  // EXPLODED ASSEMBLY ANIMATIONS
  // ========================================================================

  describe("explosionReveal", () => {
    it("should create radial explosion for multiple elements", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
      ];

      const timeline = explosionReveal(elements);

      expect(gsap.timeline).toHaveBeenCalled();
      expect(timeline.from).toHaveBeenCalledTimes(3);
    });

    it("should apply correct radial pattern", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      explosionReveal(elements, { distance: 80, stagger: 0.1 });

      // Check first element (angle -30°)
      expect(mockTimeline.from).toHaveBeenCalledWith(
        elements[0],
        expect.objectContaining({
          opacity: 0,
          filter: "blur(12px)",
          force3D: true,
        }),
        0
      );

      // Check stagger timing
      expect(mockTimeline.from).toHaveBeenCalledWith(
        elements[2],
        expect.anything(),
        0.2 // Third element: index 2 * stagger 0.1
      );
    });
  });

  describe("headerExplodedAssembly", () => {
    it("should create multi-direction header reveal", () => {
      const label = document.createElement("span");
      const titleMain = document.createElement("h2");
      const titleAccent = document.createElement("span");

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      headerExplodedAssembly(label, titleMain, titleAccent);

      // Label, titleMain, titleAccent = 3 calls
      expect(mockTimeline.from).toHaveBeenCalledTimes(3);

      // Check label has letter-spacing animation
      expect(mockTimeline.from).toHaveBeenCalledWith(
        label,
        expect.objectContaining({
          letterSpacing: "1em",
        }),
        0
      );

      // Check titleMain flies from left
      expect(mockTimeline.from).toHaveBeenCalledWith(
        titleMain,
        expect.objectContaining({
          x: -80,
          filter: "blur(15px)",
          rotation: -3,
        }),
        0.1
      );

      // Check titleAccent flies from right
      expect(mockTimeline.from).toHaveBeenCalledWith(
        titleAccent,
        expect.objectContaining({
          x: 80,
          filter: "blur(15px)",
          rotation: 3,
        }),
        0.2
      );
    });

    it("should include subtitle if provided", () => {
      const label = document.createElement("span");
      const titleMain = document.createElement("h2");
      const titleAccent = document.createElement("span");
      const subtitle = document.createElement("p");

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      headerExplodedAssembly(label, titleMain, titleAccent, subtitle);

      // Should have 4 calls now (including subtitle)
      expect(mockTimeline.from).toHaveBeenCalledTimes(4);
    });
  });

  // ========================================================================
  // STAGGERED REVEALS
  // ========================================================================

  describe("staggerReveal", () => {
    it("should create simple staggered animation", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      staggerReveal(elements);

      expect(mockTimeline.from).toHaveBeenCalledWith(
        elements,
        expect.objectContaining({
          y: 30,
          opacity: 0,
          stagger: 0.05,
          ease: "power2.out",
          force3D: true,
        })
      );
    });
  });

  describe("staggerRevealAdvanced", () => {
    it("should create advanced staggered animation with blur and rotation", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      staggerRevealAdvanced(elements, {
        fromX: -50,
        fromY: 30,
        rotation: -2,
        blur: 10,
      });

      expect(mockTimeline.from).toHaveBeenCalledWith(
        elements,
        expect.objectContaining({
          x: -50,
          y: 30,
          opacity: 0,
          rotation: -2,
          filter: "blur(10px)",
          force3D: true,
        })
      );
    });
  });

  // ========================================================================
  // SPECIALIZED EFFECTS
  // ========================================================================

  describe("iconSpinReveal", () => {
    it("should create spinning icon entrance", () => {
      const icons = [
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      iconSpinReveal(icons);

      expect(mockTimeline.from).toHaveBeenCalledWith(
        icons,
        expect.objectContaining({
          scale: 0,
          rotation: -180,
          ease: "back.out(2)",
          force3D: true,
        })
      );
    });
  });

  describe("bounceIn", () => {
    it("should create bounce-in effect", () => {
      const element = document.createElement("button");

      bounceIn(element);

      expect(gsap.from).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          scale: 0.8,
          opacity: 0,
          ease: "back.out(2)",
          force3D: true,
        })
      );
    });
  });

  describe("mediaReveal", () => {
    it("should create media reveal with blur", () => {
      const element = document.createElement("img");

      mediaReveal(element);

      expect(gsap.from).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          scale: 0.95,
          opacity: 0,
          filter: "blur(20px)",
          force3D: true,
        })
      );
    });
  });

  describe("radialExplosion", () => {
    it("should create radial pattern for grid elements", () => {
      const elements = Array.from({ length: 14 }, () =>
        document.createElement("div")
      ); // 2 rows of 7

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      radialExplosion(elements, { columns: 7 });

      // Should animate all 14 elements
      expect(mockTimeline.from).toHaveBeenCalledTimes(14);
    });
  });

  // ========================================================================
  // TIMELINE HELPERS
  // ========================================================================

  describe("createScrollTimeline", () => {
    it("should create timeline with scroll trigger and scrub", () => {
      const trigger = document.createElement("div");

      createScrollTimeline(trigger);

      expect(gsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: {
          trigger,
          start: "top 70%",
          end: "center center",
          scrub: 1,
        },
      });
    });

    it("should accept custom scroll config", () => {
      const trigger = document.createElement("div");

      createScrollTimeline(trigger, {
        trigger,
        start: "top 50%",
        end: "bottom top",
        scrub: 2,
      });

      expect(gsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: {
          trigger,
          start: "top 50%",
          end: "bottom top",
          scrub: 2,
        },
      });
    });
  });

  describe("createToggleTimeline", () => {
    it("should create timeline with toggle actions", () => {
      const trigger = document.createElement("div");

      createToggleTimeline(trigger);

      expect(gsap.timeline).toHaveBeenCalledWith({
        scrollTrigger: {
          trigger,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    });
  });

  // ========================================================================
  // PERFORMANCE UTILITIES
  // ========================================================================

  describe("killAllScrollTriggers", () => {
    it("should kill all active ScrollTriggers", () => {
      const mockTrigger = { kill: jest.fn() };
      (ScrollTrigger.getAll as jest.Mock).mockReturnValue([
        mockTrigger,
        mockTrigger,
      ]);

      killAllScrollTriggers();

      expect(ScrollTrigger.getAll).toHaveBeenCalled();
      expect(mockTrigger.kill).toHaveBeenCalledTimes(2);
    });
  });

  describe("refreshScrollTriggers", () => {
    it("should refresh all ScrollTriggers", () => {
      refreshScrollTriggers();

      expect(ScrollTrigger.refresh).toHaveBeenCalled();
    });
  });

  // ========================================================================
  // PRESET COMBINATIONS
  // ========================================================================

  describe("completeSectionReveal", () => {
    it("should orchestrate full section reveal", () => {
      const container = document.createElement("section");
      const backgroundText = document.createElement("div");
      const label = document.createElement("span");
      const titleMain = document.createElement("h2");
      const titleAccent = document.createElement("span");
      const content = [
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        add: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        fromTo: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      completeSectionReveal({
        container,
        backgroundText,
        label,
        titleMain,
        titleAccent,
        content,
      });

      // Should add header timeline and content timeline
      expect(mockTimeline.add).toHaveBeenCalledTimes(2);
    });

    it("should work with partial config", () => {
      const container = document.createElement("section");

      expect(() => {
        completeSectionReveal({ container });
      }).not.toThrow();
    });
  });

  // ========================================================================
  // INTEGRATION TESTS
  // ========================================================================

  describe("Animation Integration", () => {
    it("should handle multiple animations without conflicts", () => {
      const element1 = document.createElement("div");
      const element2 = document.createElement("div");
      const trigger = document.createElement("div");

      parallaxBackgroundText(element1, trigger);
      bounceIn(element2);

      expect(gsap.fromTo).toHaveBeenCalled();
      expect(gsap.from).toHaveBeenCalled();
    });

    it("should properly chain timeline animations", () => {
      const elements = [
        document.createElement("div"),
        document.createElement("div"),
      ];

      const mockTimeline = {
        from: jest.fn().mockReturnThis(),
        to: jest.fn().mockReturnThis(),
        add: jest.fn().mockReturnThis(),
      };
      (gsap.timeline as jest.Mock).mockReturnValue(mockTimeline);

      const tl = explosionReveal(elements);
      tl.to(elements[0], { opacity: 1 });

      expect(mockTimeline.to).toHaveBeenCalled();
    });
  });

  // ========================================================================
  // ACCESSIBILITY TESTS
  // ========================================================================

  describe("Accessibility Considerations", () => {
    it("should always include force3D for performance", () => {
      const element = document.createElement("div");

      bounceIn(element);

      expect(gsap.from).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          force3D: true,
        })
      );
    });

    it("should use appropriate easing for natural motion", () => {
      const element = document.createElement("div");

      bounceIn(element, { ease: "back.out(2)" });

      expect(gsap.from).toHaveBeenCalledWith(
        element,
        expect.objectContaining({
          ease: "back.out(2)",
        })
      );
    });
  });
});
