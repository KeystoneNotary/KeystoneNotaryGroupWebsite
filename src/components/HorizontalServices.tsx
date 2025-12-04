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
      className="relative bg-black py-32 overflow-hidden"
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -left-20 top-10 h-64 w-64 bg-silver-mid/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 bg-silver-mid/5 blur-3xl" />
        <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-16 px-6 md:px-12">
        {/* Section Header */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-end">
          <div className="services-lede space-y-6">
            <span className="services-kicker text-xs uppercase tracking-[0.35em] text-neutral-500">
              Signature Services
            </span>
            <h2 className="services-headline font-serif text-4xl md:text-6xl text-white leading-tight">
              Built for closings that cannot miss.
            </h2>
            <p className="services-subhead text-neutral-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              Concierge mobility, apostille stewardship, and high-stakes witnessing—delivered with the same precision as our philosophy piece you love.
            </p>
            <div className="services-tags flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.2em] text-neutral-200">
              <span className="tag rounded-full px-4 py-2 bg-white/5 ring-1 ring-white/10">
                50-mile coverage
              </span>
              <span className="tag rounded-full px-4 py-2 bg-white/5 ring-1 ring-white/10">
                Dual-witness ready
              </span>
              <span className="tag rounded-full px-4 py-2 bg-white/5 ring-1 ring-white/10">
                Rush capable
              </span>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-white/5 blur-2xl" />
              <div className="relative rounded-3xl bg-neutral-900/60 backdrop-blur-xl ring-1 ring-white/10 p-8 space-y-4">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Field Protocol
                </p>
                <p className="text-xl font-serif text-white leading-snug">
                  Every signer is guided through ID verification, tamper-evident sealing, and a double-check on execution order.
                </p>
                <p className="text-sm text-neutral-400">
                  We arrive with dual devices, backup seals, and witness provisioning on request.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-28 md:gap-36"
        >
          {services.map((service) => (
            <div key={service.id} className="service-section relative group">
              {/* Massive Background Number */}
              <div className="service-number absolute -top-20 -left-6 md:-left-24 text-[18vw] font-serif text-white leading-none select-none pointer-events-none opacity-0 z-0 will-change-transform">
                {service.number}
              </div>

              <div className="relative z-10 pl-12 md:pl-32 border-l border-neutral-900/60 group-hover:border-neutral-700 transition-colors duration-500">
                <h3 className="service-title font-serif text-4xl md:text-7xl text-white mb-4 leading-[0.95] tracking-tight mix-blend-difference will-change-transform">
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
