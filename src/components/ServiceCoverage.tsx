'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Shield, Award, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const serviceAreas = [
  { state: 'Pennsylvania', status: 'Primary Service Area', response: '2-4 hours' },
  { state: 'New Jersey', status: 'Available', response: '4-6 hours' },
  { state: 'Delaware', status: 'Available', response: '4-6 hours' },
];

const credentials = [
  { icon: Shield, title: 'Licensed & Bonded', detail: 'PA Notary Commission #123456' },
  { icon: Award, title: 'Professional Member', detail: 'National Notary Association' },
  { icon: Shield, title: 'Fully Insured', detail: '$100,000 E&O Insurance' },
  { icon: Clock, title: 'Background Checked', detail: 'Enhanced security clearance' },
];

const ServiceCoverage = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Stagger area cards
    const areaCards = containerRef.current.querySelectorAll('.area-card');
    gsap.fromTo(areaCards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stagger credential cards
    const credCards = containerRef.current.querySelectorAll('.credential-card');
    gsap.fromTo(credCards,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        ease: "back.out(1.5)",
        force3D: true,
        scrollTrigger: {
          trigger: credCards[0],
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="coverage" className="relative min-h-screen bg-neutral-950 py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4">Service Coverage</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight">
            Where We <span className="text-silver-metallic italic">Serve</span>
          </h2>
          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
            Serving the Lehigh Valley and surrounding areas with a 50-mile service radius
          </p>
        </div>

        {/* Service Areas */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {serviceAreas.map((area, index) => (
            <div key={index} className="area-card bg-black border border-neutral-800 rounded-xl p-8 will-change-transform">
              <MapPin className="w-8 h-8 text-silver-mid mb-4" />
              <h3 className="font-serif text-2xl text-white mb-2">{area.state}</h3>
              <p className="text-sm text-silver-mid mb-3">{area.status}</p>
              <p className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                Avg. Response: {area.response}
              </p>
            </div>
          ))}
        </div>

        {/* Credentials */}
        <div>
          <h3 className="font-serif text-3xl text-white text-center mb-12">
            Trusted & <span className="text-silver-metallic italic">Certified</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {credentials.map((cred, index) => {
              const Icon = cred.icon;
              return (
                <div key={index} className="credential-card bg-black border border-neutral-800 rounded-xl p-6 text-center will-change-transform">
                  <Icon className="w-10 h-10 text-silver-metallic mx-auto mb-4" />
                  <h4 className="text-white font-medium mb-2">{cred.title}</h4>
                  <p className="text-xs text-gray-500">{cred.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Radius Info */}
        <div className="mt-16 p-8 bg-neutral-900/50 border border-neutral-800 rounded-xl text-center">
          <p className="text-gray-400">
            <strong className="text-white">50-Mile Service Radius</strong> from Lehigh Valley, PA
            <br />
            <span className="text-sm">Covering Allentown, Bethlehem, Easton, and surrounding communities</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverage;
