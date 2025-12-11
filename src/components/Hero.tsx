"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useDeferredInit } from "@/lib/useDeferredInit";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Defer video loading so it doesn't compete with the LCP text on mobile.
  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const schedule = () => {
      const run = () => {
        if (!cancelled) setShouldLoadVideo(true);
      };

      const idleCb = (
        window as unknown as {
          requestIdleCallback?: (
            callback: () => void,
            options?: { timeout: number }
          ) => number;
        }
      ).requestIdleCallback;
      const cancelIdleCb = (
        window as unknown as { cancelIdleCallback?: (handle: number) => void }
      ).cancelIdleCallback;

      if (typeof idleCb === "function") {
        const id = idleCb(run, { timeout: 500 });
        cancelIdle = () => cancelIdleCb?.(id);
      } else {
        const id = window.setTimeout(run, 0);
        cancelIdle = () => window.clearTimeout(id);
      }
    };

    schedule();

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current || prefersReducedMotion) return;
    const video = videoRef.current;

    // Kick off playback after the source is attached.
    video.load();
    video.play().catch(() => {
      // Ignore autoplay blocking; user interaction will start playback.
    });
  }, [shouldLoadVideo, prefersReducedMotion]);

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit || !heroRef.current) return;

      // Master timeline for staggered entry
      const tl = gsap.timeline({ delay: 0.2 });

      // Video fade in
      tl.fromTo(
        videoRef.current,
        { opacity: 0 },
        { opacity: 0.4, duration: 1.8, ease: "power2.out" },
        0
      );

      // Logo: Scale + fade from center
      tl.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.5)",
          force3D: true,
        },
        0.3
      );

      // Title: Slide up + fade with blur
      tl.fromTo(
        titleRef.current,
        { y: 80, opacity: 0, filter: "blur(15px)", rotation: -2 },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotation: 0,
          duration: 1.0,
          ease: "power2.out",
          force3D: true,
        },
        0.6
      );

      // Subtitle: Slide up + fade with blur
      tl.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0, filter: "blur(10px)", rotation: 1 },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotation: 0,
          duration: 1.0,
          ease: "power2.out",
          force3D: true,
        },
        0.9
      );

      // CTA: Pop in with enhanced bounce
      tl.fromTo(
        ctaRef.current,
        { scale: 0.8, opacity: 0, filter: "blur(8px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "back.out(2)",
          force3D: true,
        },
        1.2
      );

      // Scroll indicator: Bounce loop
      tl.fromTo(
        scrollIndicatorRef.current,
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
        ease: "power1.inOut",
      });
    },
    { scope: heroRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Video Background with deferred loading */}
      {!prefersReducedMotion ? (
        <video
          ref={videoRef}
          data-testid="hero-video"
          className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-500 ${
            videoReady ? "opacity-40" : "opacity-0"
          }`}
          style={{ willChange: "transform, opacity" }}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/images/logo-silver-metallic.webp"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          {shouldLoadVideo ? (
            <>
              <source src="/assets/videos/hero-video.webm" type="video/webm" />
              <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
            </>
          ) : null}
        </video>
      ) : (
        <div
          data-testid="hero-reduced-fallback"
          className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-60"
        />
      )}

      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div
          ref={logoRef}
          id="hero-logo"
          className="w-[120px] md:w-[220px] mb-4 md:mb-8"
        >
          <Image
            src="/assets/images/logo-silver-metallic.webp"
            alt="Keystone Notary Group LLC"
            width={220}
            height={220}
            className="w-full h-auto"
            priority
          />
        </div>

        <h1
          ref={titleRef}
          className="font-serif text-3xl md:text-6xl text-silver-metallic font-light tracking-tight leading-tight drop-shadow-lg"
        >
          Professional Notary Services
        </h1>

        <p
          ref={subtitleRef}
          className="font-sans text-lg md:text-2xl text-gray-300 font-light tracking-[0.2em] uppercase mb-8"
        >
          Trusted. Certified. Available.
        </p>

        <a
          ref={ctaRef}
          href="#booking"
          className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white uppercase tracking-widest text-xs md:text-sm font-medium rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Schedule Appointment
        </a>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="flex flex-col items-center gap-2 mt-12"
        >
          <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-silver-mid" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
