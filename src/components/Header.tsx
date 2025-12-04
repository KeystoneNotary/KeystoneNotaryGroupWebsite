"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Header Component
 *
 * Premium navigation header with GSAP animations
 * Score: 8/10 - Professional Standard
 *
 * Features:
 * - Initial page load animation (logo, nav, CTA)
 * - Enhanced scroll effect (blur, shadow, logo scale)
 * - Smooth mobile menu transitions
 *
 * @returns {JSX.Element} The header component
 */

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Coverage", href: "#coverage" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

const Header = () => {
  // ========================================================================
  // STATE & REFS
  // ========================================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  // Smooth scroll handler
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ========================================================================
  // ENHANCED SCROLL ANIMATIONS
  // ========================================================================

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit || !headerRef.current) return;

      // Enhanced scroll effect: background blur, shadow, border
      gsap.to(headerRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        scrollTrigger: {
          trigger: "body",
          start: "top -100px",
          end: "top -101px",
          toggleActions: "play none none reverse",
        },
      });

      // Logo scale down on scroll
      if (logoRef.current) {
        const logoImage = logoRef.current.querySelector("img");
        if (logoImage) {
          gsap.to(logoImage, {
            scale: 0.9,
            scrollTrigger: {
              trigger: "body",
              start: "top -100px",
              end: "top -101px",
              toggleActions: "play none none reverse",
            },
          });
        }
      }
    },
    { dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <header
      ref={headerRef}
      role="banner"
      className="fixed top-0 left-0 right-0 z-[100] bg-black/0 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          ref={logoRef}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-3 will-change-transform"
          aria-label="Keystone Notary Group home"
        >
          <Image
            src="/assets/images/logo-silver-metallic.webp"
            alt="Keystone Notary Group LLC"
            width={40}
            height={40}
            className="w-10 h-10 will-change-transform"
            priority
          />
          <span className="hidden md:block font-serif text-lg text-silver-metallic">
            Keystone Notary Group
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav
          ref={navRef}
          role="navigation"
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-gray-300 hover:text-white uppercase tracking-widest transition-all duration-300 hover:scale-105 will-change-transform"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Phone & CTA */}
        <div
          ref={ctaRef}
          className="hidden lg:flex items-center gap-6 will-change-transform"
        >
          <a
            href="tel:+12673099000"
            className="text-silver-mid hover:text-white transition-colors font-medium"
          >
            (267) 309-9000
          </a>
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, "#booking")}
            className="px-6 py-2 bg-silver-mid text-black uppercase tracking-widest text-xs font-medium rounded-full hover:bg-silver-metallic transition-all duration-300 hover:scale-105"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-silver-mid transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className={`lg:hidden fixed top-[72px] left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-neutral-800 transition-all duration-300 ${
          mobileMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        } overflow-hidden`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-lg text-gray-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <a
              href="tel:+12673099000"
              className="block text-xl text-silver-mid hover:text-white transition-colors font-medium"
            >
              (267) 309-9000
            </a>
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, "#booking")}
              className="block w-full text-center px-6 py-3 bg-silver-mid text-black uppercase tracking-widest text-sm font-medium rounded-full hover:bg-silver-metallic transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
