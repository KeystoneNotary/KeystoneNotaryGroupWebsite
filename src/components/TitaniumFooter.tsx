'use client';

import React, { useRef } from 'react';
import { Mail, Linkedin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TitaniumFooter = () => {
  const footerRef = useRef<HTMLElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!footerRef.current) return;

    // Background "KNG" text - toggleActions
    gsap.fromTo(backgroundTextRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 0.03,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Consolidated timeline for all footer elements
    const footerTl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 75%",
        end: "center center",
        scrub: 1
      }
    });

    // Logo
    const logo = footerRef.current.querySelector('.footer-logo');
    footerTl.fromTo(logo,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, ease: "power2.out", force3D: true },
      0
    );

    // CTA Button
    const ctaButton = footerRef.current.querySelector('.footer-cta');
    footerTl.fromTo(ctaButton,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, ease: "back.out(1.5)", force3D: true },
      0.1
    );

    // Coverage areas
    const coverageItems = footerRef.current.querySelectorAll('.coverage-item');
    coverageItems.forEach((item, index) => {
      footerTl.fromTo(item,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, ease: "power2.out", force3D: true },
        0.2 + (index * 0.05)
      );
    });

    // Social links
    const socialLinks = footerRef.current.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
      footerTl.fromTo(link,
        { scale: 0, opacity: 0, rotation: -45 },
        { scale: 1, opacity: 1, rotation: 0, ease: "back.out(2)", force3D: true },
        0.3 + (index * 0.1)
      );
    });

  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative bg-black text-platinum py-24 px-6 md:px-24 border-t border-neutral-900 overflow-hidden">
      {/* Background Depth Layer - "KNG" */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div 
          ref={backgroundTextRef}
          className="font-serif text-[25vw] text-white opacity-5 leading-none select-none will-change-transform"
        >
          KNG
        </div>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-16 relative z-10">
        
        {/* Logo */}
        <div id="footer-logo" className="footer-logo space-y-4 will-change-transform">
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
          className="footer-cta inline-block px-12 py-4 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all duration-300 will-change-transform"
        >
          Secure Your Appointment
        </a>

        {/* Coverage Area */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-neutral-500 text-xs tracking-[0.3em] uppercase">
          <span className="coverage-item will-change-transform">Pennsylvania</span>
          <span className="hidden md:inline text-neutral-800">•</span>
          <span className="coverage-item will-change-transform">New Jersey</span>
          <span className="hidden md:inline text-neutral-800">•</span>
          <span className="coverage-item will-change-transform">Delaware</span>
        </div>

        {/* Socials */}
        <div className="flex gap-8 pt-8 border-t border-neutral-900 w-full justify-center">
          <a href="mailto:contact@keystonenotarygroup.com" className="social-link text-neutral-600 hover:text-silver-metallic transition-colors duration-300 will-change-transform">
            <Mail size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link text-neutral-600 hover:text-silver-metallic transition-colors duration-300 will-change-transform">
            <Linkedin size={20} />
          </a>
        </div>

        {/* Copyright & Legal */}
        <div className="space-y-4">
          <p className="text-neutral-800 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} Keystone Notary Group, LLC. All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 text-[10px] tracking-widest uppercase text-neutral-700">
            <a href="/privacy" className="hover:text-silver-mid transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-silver-mid transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TitaniumFooter;
