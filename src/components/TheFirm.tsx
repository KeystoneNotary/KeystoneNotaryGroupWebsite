"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";
import {
  createScrollTimeline,
  headerExplodedAssembly,
} from "@/lib/gsap-animations";

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
      const label = labelRef.current;
      const topLine = headlineTopRef.current;
      const bottomLine = headlineBottomRef.current;
      const leftPara = paraLeftRef.current;
      const rightPara = paraRightRef.current;
      const container = containerRef.current;

      if (
        prefersReducedMotion ||
        !shouldInit ||
        !container ||
        !label ||
        !topLine ||
        !bottomLine ||
        !leftPara ||
        !rightPara
      ) {
        gsap.set(
          [
            labelRef.current,
            headlineTopRef.current,
            headlineBottomRef.current,
            paraLeftRef.current,
            paraRightRef.current,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            filter: "none",
            letterSpacing: "0.35em",
          }
        );
        return;
      }

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
            trigger: container,
            start: "top 60%",
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
            trigger: container,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // 2. Exploded Assembly + Paragraphs via shared timeline helper
      const headerTl = createScrollTimeline(container, {
        trigger: container,
        start: "top 60%",
        end: "center center",
        scrub: 1,
      });

      headerTl.add(
        headerExplodedAssembly(label, topLine, bottomLine),
        0
      );

      headerTl
        .from(
          leftPara,
          {
            x: -60,
            y: 100,
            opacity: 0,
            rotation: -3,
            filter: "blur(15px)",
            ease: "power2.out",
            force3D: true,
          },
          0.6
        )
        .from(
          rightPara,
          {
            x: 60,
            y: 100,
            opacity: 0,
            rotation: 3,
            filter: "blur(15px)",
            ease: "power2.out",
            force3D: true,
          },
          0.8
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
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Parallax Typography Layer 1 (Background) */}
      <h2
        ref={textLayer1Ref}
        className="absolute top-1/4 left-0 w-full text-[18vw] md:text-[15vw] font-serif leading-none select-none z-0 pointer-events-none whitespace-nowrap"
        style={{
          color: "rgba(60, 60, 60, 1)",
          WebkitTextStroke: "0.5px rgba(120, 120, 120, 0.5)",
        }}
      >
        PRECISION
      </h2>

      {/* Parallax Typography Layer 2 (Foreground/Offset) */}
      <h2
        ref={textLayer2Ref}
        className="absolute bottom-1/4 right-0 w-full text-right text-[18vw] md:text-[15vw] font-serif leading-none select-none z-0 pointer-events-none whitespace-nowrap"
        style={{
          color: "rgba(50, 50, 50, 1)",
          WebkitTextStroke: "0.5px rgba(100, 100, 100, 0.5)",
        }}
      >
        NOTARIZED
      </h2>

      {/* Main Content (Floating) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-12">
          <span
            ref={labelRef}
            className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4 will-change-transform"
          >
            The Philosophy
          </span>
          <h3 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            <span
              ref={headlineTopRef}
              className="inline-block font-serif will-change-transform"
            >
              We don&apos;t just sign.
            </span>{" "}
            <br />
            <span
              ref={headlineBottomRef}
              className="inline-block font-serif text-silver-metallic italic will-change-transform"
            >
              We certify trust.
            </span>
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          <p
            ref={paraLeftRef}
            className="font-sans text-gray-400 text-lg leading-relaxed will-change-transform"
          >
            In a world of digital noise, the physical seal remains the ultimate
            anchor of truth. Keystone Notary Group represents the gold standard
            in mobile facilitation.
          </p>
          <p
            ref={paraRightRef}
            className="font-sans text-gray-400 text-lg leading-relaxed will-change-transform"
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
