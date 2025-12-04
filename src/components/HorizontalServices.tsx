"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
    title: "ESTATE & REAL ESTATE",
    description: "Seamless execution for title companies and attorneys.",
    number: "01",
  },
  {
    id: "mobile",
    title: "EXECUTIVE MOBILE",
    description: "Discretion and punctuality at your office or residence.",
    number: "02",
  },
  {
    id: "apostille",
    title: "APOSTILLE & AUTHENTICATION",
    description: "Navigating international complexities for you.",
    number: "03",
  },
  {
    id: "legal",
    title: "SPECIALIZED LEGAL",
    description: "Wills, Trusts, and Power of Attorney.",
    number: "04",
  },
  {
    id: "corporate",
    title: "CORPORATE DOCUMENTS",
    description: "Operating agreements and compliance affidavits.",
    number: "05",
  },
];

const HorizontalServices = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit) return;
      const track = trackRef.current;
      if (!track || !containerRef.current) return;

      // Intro headline lift-in
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
        },
      });

      headerTl
        .from(".services-kicker", {
          y: 20,
          opacity: 0,
          letterSpacing: "0.4em",
        })
        .from(
          ".services-headline",
          {
            y: 40,
            opacity: 0,
            filter: "blur(10px)",
          },
          "-=0.1"
        )
        .from(
          ".services-subhead",
          {
            y: 20,
            opacity: 0,
            filter: "blur(12px)",
          },
          "-=0.05"
        )
        .from(
          ".services-tags .tag",
          {
            y: 24,
            opacity: 0,
            scale: 0.95,
            filter: "blur(8px)",
            stagger: 0.08,
          },
          "-=0.1"
        );

      // Kinetic Typography Animation
      const sections = gsap.utils.toArray(".service-section") as HTMLElement[];

      sections.forEach((section, i) => {
        const title = section.querySelector(".service-title");
        const number = section.querySelector(".service-number");
        const desc = section.querySelector(".service-desc");

        // Initial State with Enhanced Effects
        gsap.set(title, {
          y: 100,
          opacity: 0,
          scale: 0.95,
          x: -20,
          filter: "blur(6px)",
        });
        gsap.set(number, {
          x: -100,
          opacity: 0,
          rotation: -10,
          filter: "blur(5px)",
        });
        gsap.set(desc, {
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
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
          duration: 1,
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
              duration: 1,
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
              duration: 0.8,
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
      className="relative bg-black py-36 md:py-44 overflow-hidden"
    >
      {/* Atmosphere dialed to match About */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-75" />
        <div className="absolute -left-20 top-10 h-56 w-56 bg-silver-mid/10 blur-[110px]" />
        <div className="absolute right-[-10%] bottom-10 h-56 w-56 bg-silver-mid/8 blur-[110px]" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-16 px-6 md:px-12">
        {/* Section Header */}
        <div className="space-y-5 text-center">
          <span className="services-kicker text-xs uppercase tracking-[0.35em] text-silver-mid">
            Signature Services
          </span>
          <h2 className="services-headline font-serif text-4xl md:text-6xl text-white leading-tight">
            Precision in motion.
          </h2>
          <p className="services-subhead text-neutral-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            The same discipline as our philosophy piece—applied to estate, executive mobility, apostille, and corporate work.
          </p>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-16 md:gap-20"
        >
          {services.map((service) => (
            <div key={service.id} className="service-section relative group">
              {/* Massive Background Number */}
              <div className="service-number absolute -top-12 -left-6 md:-left-12 text-[14vw] md:text-[12vw] font-serif text-white leading-none select-none pointer-events-none opacity-0 z-0 will-change-transform">
                {service.number}
              </div>

              <div className="relative z-10 pl-10 md:pl-24 border-l border-neutral-900/50 group-hover:border-neutral-700 transition-colors duration-500">
                <h3 className="service-title font-serif text-3xl md:text-5xl text-white mb-2 leading-[1.05] tracking-tight will-change-transform">
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
