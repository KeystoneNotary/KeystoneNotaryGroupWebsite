'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    // Master timeline for staggered entry
    const tl = gsap.timeline({ delay: 0.2 });

    // Video fade in
    tl.fromTo(videoRef.current,
      { opacity: 0 },
      { opacity: 0.4, duration: 1.5, ease: "power2.out" },
      0
    );

    // Logo: Scale + fade from center
    tl.fromTo(logoRef.current,
      { scale: 0.8, opacity: 0, filter: "blur(20px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1, ease: "back.out(1.5)", force3D: true },
      0.3
    );

    // Title: Slide up + fade
    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", force3D: true },
      0.6
    );

    // Subtitle: Slide up + fade
    tl.fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", force3D: true },
      0.9
    );

    // CTA: Pop in
    tl.fromTo(ctaRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)", force3D: true },
      1.2
    );

    // Scroll indicator: Bounce loop
    tl.fromTo(scrollIndicatorRef.current,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      1.5
    );

    // Continuous bounce animation for scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

  }, { scope: heroRef });

  return (
    <section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Video Background (UNCHANGED) */}
      <video 
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 z-0 opacity-40 brightness-100 contrast-125 saturate-125"
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
      >
        <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div ref={logoRef} id="hero-logo" className="w-[120px] md:w-[220px] mb-4 md:mb-8 will-change-transform">
          <Image 
            src="/assets/images/logo-silver-metallic.png" 
            alt="Keystone Notary Group LLC" 
            width={220} 
            height={220}
            className="w-full h-auto"
            priority
          />
        </div>
        
        <h1 ref={titleRef} className="font-serif text-3xl md:text-6xl text-silver-metallic font-light tracking-tight leading-tight drop-shadow-lg will-change-transform">
          Professional Notary Services
        </h1>
        
        <p ref={subtitleRef} className="font-sans text-lg md:text-2xl text-gray-300 font-light tracking-[0.2em] uppercase mb-8 will-change-transform">
          Trusted. Certified. Available.
        </p>
        
        <a 
          ref={ctaRef}
          href="#booking" 
          className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white uppercase tracking-widest text-xs md:text-sm font-medium rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg will-change-transform"
        >
          Schedule Appointment
        </a>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 will-change-transform">
          <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-silver-mid" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
