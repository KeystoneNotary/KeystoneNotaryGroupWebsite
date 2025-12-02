'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const differentiators = [
  'Mobile service - we come to you',
  'Licensed, bonded, and insured',
  'Same-day and after-hours availability',
  'Serving PA, NJ, and DE tri-state area',
];

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Image slides in from left
    gsap.fromTo(imageRef.current,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Content slides in from right
    gsap.fromTo(contentRef.current,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stagger differentiator bullets
    const bullets = containerRef.current.querySelectorAll('.differentiator');
    gsap.fromTo(bullets,
      { x: 20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="relative min-h-screen bg-black py-24 px-6 md:px-12 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 will-change-transform">
            <Image
              src="/assets/images/logo-silver-metallic.png"
              alt="Professional notary services"
              fill
              className="object-contain p-12"
            />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8 will-change-transform">
            <div>
              <span className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4">About Us</span>
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-6">
                Professional <span className="text-silver-metallic italic">Notary Services</span>
              </h2>
            </div>

            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p>
                Keystone Notary Group was founded in 2024 to bring professional, mobile notary services to the Lehigh Valley region and beyond. We understand that your time is valuable—that's why we come to you.
              </p>
              <p>
                Whether you're closing on a home, executing estate planning documents, or finalizing business agreements, our certified notaries ensure your documents are handled with precision and professionalism.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-white font-medium text-lg mb-4">Why Choose Us</h3>
              {differentiators.map((item, index) => (
                <div key={index} className="differentiator flex items-start gap-3 will-change-transform">
                  <CheckCircle className="w-5 h-5 text-silver-mid flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <a
                href="#booking"
                className="inline-block px-8 py-3 border border-silver-mid text-silver-mid hover:bg-silver-mid hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Schedule Appointment
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
