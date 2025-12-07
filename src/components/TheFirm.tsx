"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TheFirm = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const containerRef = useRef<HTMLDivElement>(null);
  const textLayer1Ref = useRef<HTMLHeadingElement>(null);
  const textLayer2Ref = useRef<HTMLHeadingElement>(null);

  // Content Refs for Exploded View
  const headlineTopRef = useRef<HTMLHeadingElement>(null);
  const headlineBottomRef = useRef<HTMLSpanElement>(null);
  const paraLeftRef = useRef<HTMLParagraphElement>(null);
  const paraRightRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit) return;

      // 1. Background Parallax & Slide In
      gsap.fromTo(
        textLayer1Ref.current,
        { x: -500, opacity: 0 },
        {
          x: 0,
          y: -100,
          opacity: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        textLayer2Ref.current,
        { x: 500, opacity: 0 },
        {
          x: 0,
          y: -200,
          opacity: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // 2. Exploded Assembly Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "center center",
          scrub: 1,
        },
      });

      tl.from(
        labelRef.current,
        { y: -50, opacity: 0, letterSpacing: "1em" },
        0
      );

      tl.from(
        headlineTopRef.current,
        {
          x: -100,
          y: -50,
          opacity: 0,
          filter: "blur(20px)",
          rotation: -5,
        },
        0.15
      );

      tl.from(
        headlineBottomRef.current,
        {
          x: 100,
          y: 50,
          opacity: 0,
          filter: "blur(20px)",
          rotation: 5,
        },
        0.3
      );

      tl.from(
        paraLeftRef.current,
        {
          x: -50,
          y: 100,
          opacity: 0,
          rotation: -2,
          filter: "blur(10px)",
        },
        0.45
      );

      tl.from(
        paraRightRef.current,
        {
          x: 50,
          y: 100,
          opacity: 0,
          rotation: 2,
          filter: "blur(10px)",
        },
        0.6
      );
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] bg-obsidian overflow-hidden flex items-center justify-center py-24 md:py-0"
    >
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-obsidian to-black opacity-80 z-0" />

      {/* Parallax Typography Layer 1 (Background) */}
      <h2
        ref={textLayer1Ref}
        className="absolute top-1/4 left-0 w-full text-[18vw] md:text-[15vw] font-serif text-neutral-900 leading-none opacity-50 select-none z-0 pointer-events-none whitespace-nowrap"
      >
        PRECISION
      </h2>

      {/* Parallax Typography Layer 2 (Foreground/Offset) */}
      <h2
        ref={textLayer2Ref}
        className="absolute bottom-1/4 right-0 w-full text-right text-[18vw] md:text-[15vw] font-serif text-neutral-800 leading-none opacity-30 select-none z-0 pointer-events-none whitespace-nowrap"
      >
        NOTARIZED
      </h2>

      {/* Main Content (Floating) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <span
            ref={labelRef}
            className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4"
          >
            The Philosophy
          </span>
          <h3 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            <span ref={headlineTopRef} className="inline-block">
              We don&apos;t just sign.
            </span>{" "}
            <br />
            <span
              ref={headlineBottomRef}
              className="inline-block text-silver-metallic italic"
            >
              We certify trust.
            </span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          <p
            ref={paraLeftRef}
            className="font-sans text-gray-400 text-lg leading-relaxed"
          >
            In a world of digital noise, the physical seal remains the ultimate
            anchor of truth. Keystone Notary Group represents the gold standard
            in mobile facilitation.
          </p>
          <p
            ref={paraRightRef}
            className="font-sans text-gray-400 text-lg leading-relaxed"
          >
            From multi-million dollar real estate closings to sensitive estate
            planning, our presence ensures your transaction is unassailable.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TheFirm;
