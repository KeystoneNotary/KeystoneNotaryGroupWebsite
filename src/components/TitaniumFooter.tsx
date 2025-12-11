"use client";

import React, { useRef } from "react";
import { Mail, Linkedin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { createScrollTimeline } from "@/lib/gsap-animations";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * TitaniumFooter Component
 *
 * Premium footer section with cinematic GSAP animations
 * Score: 9/10 - Excellence Standard
 *
 * Features:
 * - Enhanced logo reveal with blur
 * - Coverage items with blur effects
 * - Improved social link animations
 *
 * @returns {JSX.Element} The footer component
 */

const TitaniumFooter = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const footerRef = useRef<HTMLElement>(null);

  // ========================================================================
  // CINEMATIC GSAP ANIMATIONS
  // ========================================================================

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit || !footerRef.current) return;

      // 1. CONSOLIDATED TIMELINE FOR ALL FOOTER ELEMENTS
      const footerTl = createScrollTimeline(footerRef.current, {
        trigger: footerRef.current,
        start: "top 75%",
        end: "center center",
        scrub: 1,
      });

      // 2. ENHANCED LOGO REVEAL WITH BLUR
      const logo = footerRef.current.querySelector(".footer-logo");
      if (logo) {
        footerTl.from(
          logo,
          {
            y: 50,
            opacity: 0,
            scale: 0.95,
            rotation: -3,
            filter: "blur(15px)",
            ease: "power2.out",
            force3D: true,
          },
          0
        );
      }

      // 3. CTA BUTTON WITH BLUR
      const ctaButton = footerRef.current.querySelector(".footer-cta");
      if (ctaButton) {
        footerTl.from(
          ctaButton,
          {
            scale: 0.8,
            opacity: 0,
            filter: "blur(10px)",
            ease: "back.out(1.8)",
            force3D: true,
          },
          0.1
        );
      }

      // 4. COVERAGE AREAS WITH BLUR
      const coverageItems =
        footerRef.current.querySelectorAll(".coverage-item");
      gsap.utils.toArray(coverageItems).forEach((item, index) => {
        footerTl.from(
          item as Element,
          {
            x: -30,
            opacity: 0,
            rotation: -3,
            filter: "blur(8px)",
            ease: "power2.out",
            force3D: true,
          },
          0.2 + index * 0.05
        );
      });

      // 5. IMPROVED SOCIAL LINK ANIMATIONS
      const socialLinks = footerRef.current.querySelectorAll(".social-link");
      gsap.utils.toArray(socialLinks).forEach((link, index) => {
        footerTl.from(
          link as Element,
          {
            scale: 0,
            opacity: 0,
            filter: "blur(8px)",
            ease: "back.out(2.5)",
            force3D: true,
          },
          0.3 + index * 0.1
        );
      });
    },
    { scope: footerRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <footer
      ref={footerRef}
      className="relative bg-black text-platinum py-24 px-6 md:px-24 border-t border-neutral-900 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-16 relative z-10">
        {/* Logo */}
        <div
          id="footer-logo"
          className="footer-logo space-y-4 will-change-transform"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-silver-metallic tracking-wide">
            Keystone Notary Group, LLC
          </h2>
          <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase">
            EST. 2024
          </p>
        </div>

        {/* CTA Button */}
        <a
          href="#booking"
          className="footer-cta inline-block px-12 py-4 ring-1 ring-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:ring-silver-mid hover:text-silver-mid transition-all duration-300 rounded-full bg-white/5 backdrop-blur will-change-transform"
        >
          Secure Your Appointment
        </a>

        {/* Contact Information */}
        <div className="space-y-4 text-neutral-400">
          <a
            href="tel:+12673099000"
            className="block text-2xl md:text-3xl font-serif text-silver-metallic hover:text-silver-mid transition-colors"
          >
            (267) 309-9000
          </a>
          <a
            href="mailto:contact@keystonenotarygroup.com"
            className="block text-sm hover:text-silver-mid transition-colors"
          >
            contact@keystonenotarygroup.com
          </a>
          <p className="text-xs text-neutral-600 tracking-wide">
            Serving Pennsylvania | Mobile Services Available
          </p>
        </div>

        {/* Coverage Area */}
        <div className="flex justify-center text-neutral-500 text-xs tracking-[0.3em] uppercase">
          <span className="coverage-item rounded-full px-6 py-2 bg-white/5 ring-1 ring-white/10 will-change-transform">
            Pennsylvania Only
          </span>
        </div>

        {/* Socials */}
        <div className="flex gap-8 pt-8 border-t border-neutral-900 w-full justify-center">
          <a
            href="mailto:contact@keystonenotarygroup.com"
            className="social-link text-neutral-600 hover:text-silver-metallic transition-colors duration-300 will-change-transform"
          >
            <Mail size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link text-neutral-600 hover:text-silver-metallic transition-colors duration-300 will-change-transform"
          >
            <Linkedin size={20} />
          </a>
        </div>

        {/* Copyright & Legal */}
        <div className="space-y-4">
          <p className="text-neutral-800 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} Keystone Notary Group, LLC. All Rights
            Reserved.
          </p>
          <div className="flex justify-center gap-6 text-[10px] tracking-widest uppercase text-neutral-700">
            <a
              href="/privacy"
              className="hover:text-silver-mid transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-silver-mid transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TitaniumFooter;
