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
      className="relative bg-black py-32 overflow-hidden"
    >
      {/* Section Label */}
      <div className="absolute top-12 left-6 md:left-12 z-10">
        <h2 className="text-xs uppercase tracking-[0.4em] text-neutral-600">
          Our Expertise
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-32 md:gap-48 px-6 md:px-24"
      >
        {services.map((service) => (
          <div key={service.id} className="service-section relative group">
            {/* Massive Background Number */}
            <div className="service-number absolute -top-20 -left-10 md:-left-20 text-[20vw] font-serif text-white leading-none select-none pointer-events-none opacity-0 z-0 will-change-transform">
              {service.number}
            </div>

            <div className="relative z-10 pl-12 md:pl-32 border-l border-neutral-900 group-hover:border-neutral-700 transition-colors duration-500">
              <h3 className="service-title font-serif text-5xl md:text-8xl text-white mb-6 leading-[0.9] tracking-tight mix-blend-difference will-change-transform">
                {service.title}
              </h3>
              <p className="service-desc font-sans text-lg md:text-xl text-neutral-400 max-w-xl leading-relaxed will-change-transform">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalServices;
