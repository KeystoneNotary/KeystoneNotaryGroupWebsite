"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

import { headerExplodedAssembly } from "@/lib/gsap-animations";

/**
 * HorizontalServices Component
 *
 * Premium vertical scrolling services showcase with kinetic typography
 * Score: 9/10 - Excellence Standard
 *
 * Features:
 * - Kinetic typography with blur effects
 * - Massive background numbers with rotation and blur
 * - Subtle scale effects on titles
 * - Smooth scroll-triggered animations
 *
 * @returns {JSX.Element} The horizontal services component
 */

const services = [
  {
    id: "estate",
    title: "Estate & Real Estate",
    description: "Where seven-figure transactions close without friction.",
    number: "01",
  },
  {
    id: "mobile",
    title: "Executive Mobile",
    description: "Silent precision. Your location. Your timeline.",
    number: "02",
  },
  {
    id: "apostille",
    title: "Apostille & Authentication",
    description: "Cutting through international red tape others avoid.",
    number: "03",
  },
  {
    id: "legal",
    title: "Specialized Legal",
    description: "Safeguarding legacy documents that outlive generations.",
    number: "04",
  },
  {
    id: "corporate",
    title: "Corporate Documents",
    description: "The paperwork that protects what you've built.",
    number: "05",
  },
];

const HorizontalServices = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleMainRef = useRef<HTMLSpanElement>(null);
  const titleAccentRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit) return;
      const track = trackRef.current;
      if (!track || !containerRef.current) return;

      // Intro headline lift-in
      // Header exploded assembly
      if (labelRef.current && titleMainRef.current && titleAccentRef.current) {
        // Set initial hidden state for header elements
        gsap.set(
          [
            labelRef.current,
            titleMainRef.current,
            titleAccentRef.current,
            subtitleRef.current,
          ].filter(Boolean),
          {
            opacity: 0,
            y: 50,
            filter: "blur(10px)",
          }
        );

        // Animate header elements in on scroll
        gsap.to(labelRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
        });

        gsap.to(titleMainRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 35%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
        });

        gsap.to(titleAccentRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
        });

        if (subtitleRef.current) {
          gsap.to(subtitleRef.current, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
              end: "top 25%",
              scrub: 1,
            },
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
          });
        }
      }

      // Kinetic Typography Animation
      const sections = gsap.utils.toArray(".service-section") as HTMLElement[];

      sections.forEach((section) => {
        const title = section.querySelector(".service-title");
        const number = section.querySelector(".service-number");
        const desc = section.querySelector(".service-desc");

        // Initial State with Enhanced Effects
        gsap.set(title, {
          y: 120,
          opacity: 0,
          scale: 0.9,
          x: -30,
          filter: "blur(12px)",
        });
        gsap.set(number, {
          x: -120,
          opacity: 0,
          rotation: -15,
          filter: "blur(15px)",
        });
        gsap.set(desc, {
          y: 30,
          opacity: 0,
          filter: "blur(12px)",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "center center",
            scrub: 1,
            toggleActions: "play reverse play reverse",
          },
        });

        // Number: Add rotation and blur
        tl.to(number, {
          x: 0,
          opacity: 0.2,
          rotation: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          force3D: true,
        })
          // Title: Add scale effect
          .to(
            title,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.8"
          )
          // Description: Keep as is
          .to(
            desc,
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.0,
              ease: "power2.out",
              force3D: true,
            },
            "-=0.6"
          );
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-black py-44 md:py-52 overflow-hidden"
    >
      {/* Atmosphere dialed to match About */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto space-y-20 px-6 md:px-12">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <span
            ref={labelRef}
            className="text-xs uppercase tracking-[0.4em] text-silver-mid will-change-transform"
          >
            Signature Services
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-white leading-tight">
            <span
              ref={titleMainRef}
              className="inline-block will-change-transform"
            >
              Precision
            </span>{" "}
            <span
              ref={titleAccentRef}
              className="inline-block text-silver-metallic italic will-change-transform"
            >
              in motion.
            </span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto will-change-transform"
          >
            The same discipline as our philosophy piece—applied to estate,
            executive mobility, apostille, and corporate work.
          </p>
        </div>

        <div ref={trackRef} className="flex flex-col gap-16 md:gap-24">
          {services.map((service) => (
            <div key={service.id} className="service-section relative group">
              {/* Massive Background Number */}
              <div className="service-number absolute -top-10 -left-4 md:-left-10 text-[12vw] md:text-[10vw] font-serif text-white/[0.15] leading-none select-none pointer-events-none opacity-0 z-0 will-change-transform">
                {service.number}
              </div>

              <div className="relative z-10 pl-6 md:pl-10">
                <h3 className="service-title font-serif text-3xl md:text-5xl font-light text-silver-metallic mb-3 leading-[1.1] tracking-tight will-change-transform">
                  {service.title}
                </h3>
                <p className="service-desc font-sans text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed will-change-transform">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalServices;
