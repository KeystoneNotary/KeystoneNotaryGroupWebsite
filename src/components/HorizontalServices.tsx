'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    id: 'estate',
    title: 'Estate & Real Estate Closings',
    description: 'Seamless execution for title companies and attorneys. We handle the final mile of your most critical transactions.',
    number: '01'
  },
  {
    id: 'mobile',
    title: 'Executive Mobile Facilitation',
    description: 'We travel to your office, residence, or transit location. Discretion and punctuality are our hallmarks.',
    number: '02'
  },
  {
    id: 'apostille',
    title: 'Apostille & Authentication',
    description: 'Navigating international complexities so you don\'t have to. Full service processing for foreign use documents.',
    number: '03'
  },
  {
    id: 'legal',
    title: 'Specialized Legal Signings',
    description: 'Wills, Trusts, and Power of Attorney. Compassionate service for sensitive family matters.',
    number: '04'
  },
  {
    id: 'corporate',
    title: 'Corporate & Business Documents',
    description: 'Operating agreements, compliance affidavits, and vendor contracts. Keeping your business moving forward.',
    number: '05'
  }
];

const HorizontalServices = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const backgroundNumberRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track || !containerRef.current) return;

    const mm = gsap.matchMedia();

    // Desktop: Horizontal Scroll
    mm.add("(min-width: 768px)", () => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;

      const scrollTl = gsap.to(track, {
        x: -(totalWidth - viewportWidth),
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${totalWidth}`,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.to(progressBarRef.current, {
                scaleX: self.progress,
                duration: 0.1,
                ease: "none",
                force3D: true
              });
            }
            if (backgroundNumberRef.current) {
              const currentService = Math.min(Math.floor(self.progress * services.length), services.length - 1);
              backgroundNumberRef.current.textContent = services[currentService].number;
            }
          }
        }
      });

      // Desktop Card Animations
      const cards = track.querySelectorAll('.service-card');
      cards.forEach((card) => {
        const number = card.querySelector('.service-number');
        const title = card.querySelector('.service-title');
        const description = card.querySelector('.service-description');
        const line = card.querySelector('.service-line');

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTl,
            start: "left center",
            end: "center center",
            scrub: 1,
          }
        });

        cardTl.fromTo(number, { y: 100, opacity: 0, rotation: -5 }, { y: 0, opacity: 1, rotation: 0, ease: "power2.out" }, 0)
              .fromTo(title, { x: -50, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" }, 0.15)
              .fromTo(description, { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out" }, 0.3)
              .fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "power2.out" }, 0.45);
      });
    });

    // Mobile: Vertical Stack Animations
    mm.add("(max-width: 767px)", () => {
      const cards = track.querySelectorAll('.service-card');
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    });

    return () => mm.revert();

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative md:h-screen bg-black overflow-hidden flex flex-col justify-center py-24 md:py-0">
      {/* Background Depth Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div 
          ref={backgroundNumberRef}
          className="font-serif text-[40vw] text-white opacity-5 leading-none select-none will-change-transform fixed md:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          01
        </div>
      </div>

      {/* Section Label */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 z-10">
        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 border-b border-gray-800 pb-2 inline-block">
          Our Expertise
        </h2>
      </div>

      {/* Track */}
      <div ref={trackRef} className="horizontal-track flex flex-col md:flex-row gap-16 md:gap-32 px-6 md:px-24 items-start md:items-center h-auto md:h-full w-full md:w-max relative z-10">
        {services.map((service) => (
          <div key={service.id} className="service-card w-full md:w-[600px] flex flex-col gap-6 md:gap-8">
            <span className="service-number font-serif text-6xl md:text-9xl text-neutral-800 select-none">
              {service.number}
            </span>
            
            <div className="relative">
              <h3 className="service-title font-serif text-3xl md:text-6xl text-white mb-4 md:mb-6 leading-tight">
                {service.title}
              </h3>
              <p className="service-description font-sans text-base md:text-lg text-gray-400 max-w-md leading-relaxed">
                {service.description}
              </p>
              
              <div className="service-line w-16 md:w-24 h-[1px] bg-silver-mid mt-6 md:mt-8" />
            </div>
          </div>
        ))}
        
        {/* End Spacer (Desktop only) */}
        <div className="hidden md:block w-[20vw]" />
      </div>
      
      {/* Progress Indicator (Desktop only) */}
      <div className="hidden md:block absolute bottom-12 left-12 right-12 h-[1px] bg-neutral-900 z-20">
        <div 
          ref={progressBarRef}
          className="h-full bg-silver-mid origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
};

export default HorizontalServices;
