'use client';

import React, { useState, FormEvent, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const containerRef = useRef<HTMLElement>(null);
  const backgroundTextRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // TODO: Integrate with backend
    console.log('Contact form submitted:', formData);
    
    // Simulate success
    setFormStatus('success');
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    
    // Clear success message after 5 seconds
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Background "CONNECT" text - toggleActions
    gsap.fromTo(backgroundTextRef.current,
      { x: -300, opacity: 0, rotation: -5 },
      {
        x: 0,
        opacity: 0.02,
        rotation: 0,
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

    // Consolidated timeline for form and contact cards
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "center center",
        scrub: 1
      }
    });

    // Form fields
    const formFields = containerRef.current.querySelectorAll('.contact-field');
    formFields.forEach((field, index) => {
      masterTl.fromTo(field,
        { x: -50, y: 30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: "power2.out", force3D: true },
        index * 0.05
      );
    });

    // Contact info cards
    const infoCards = containerRef.current.querySelectorAll('.contact-card');
    infoCards.forEach((card, index) => {
      masterTl.fromTo(card,
        { x: 50, y: 30, opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: "power2.out", force3D: true },
        index * 0.05 + 0.1
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="contact" className="relative min-h-screen bg-black text-platinum overflow-hidden">
      {/* Background Depth Layer - "CONNECT" */}
      <div className="absolute left-0 top-1/3 pointer-events-none z-0 overflow-hidden">
        <div 
          ref={backgroundTextRef}
          className="font-serif text-[20vw] text-white opacity-5 leading-none select-none whitespace-nowrap will-change-transform"
        >
          CONNECT
        </div>
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen relative z-10">
        {/* Left Side: Form */}
        <div className="flex flex-col justify-center p-12 md:p-24">
          <span className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-8">Contact</span>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Get in <span className="text-silver-metallic italic">Touch</span>
          </h2>
          <p className="text-gray-400 mb-12 max-w-md">
            Send the details, we'll confirm logistics and arrive prepared.
          </p>

          {formStatus === 'success' && (
            <div className="mb-6 p-4 border border-silver-mid/20 bg-silver-mid/5 animate-fade-in">
              <p className="text-silver-mid">Message sent successfully! We'll be in touch soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" role="form">
            <div className="contact-field will-change-transform">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name *"
                required
                className="w-full bg-transparent border-b border-neutral-800 py-4 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none transition-colors"
              />
            </div>

            <div className="contact-field will-change-transform">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
                required
                className="w-full bg-transparent border-b border-neutral-800 py-4 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none transition-colors"
              />
            </div>

            <div className="contact-field will-change-transform">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help? *"
                required
                rows={4}
                className="w-full bg-transparent border-b border-neutral-800 py-4 text-white placeholder:text-gray-600 focus:border-silver-mid focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="contact-field px-12 py-4 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all duration-300 will-change-transform"
            >
              Send Message
            </button>

            <p className="text-xs text-gray-600 mt-4">
              By submitting, you agree to receive scheduling communications from Keystone Notary Group LLC.
            </p>
          </form>
        </div>

        {/* Right Side: Concierge Info */}
        <div className="flex flex-col justify-center p-12 md:p-24 bg-neutral-950 border-l border-neutral-900">
          <h3 className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-12">
            Concierge Scheduling
          </h3>

          <div className="space-y-12">
            <div className="contact-card will-change-transform">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Phone</p>
              <a
                href="tel:+12673099000"
                className="text-3xl font-light text-white hover:text-silver-mid transition-colors"
              >
                (267) 309-9000
              </a>
              <p className="text-sm text-gray-500 mt-2">Daily 7am – 9pm</p>
            </div>

            <div className="contact-card will-change-transform">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Email</p>
              <a
                href="mailto:contact@keystonenotarygroup.com"
                className="text-lg text-white hover:text-silver-mid transition-colors break-all"
              >
                contact@keystonenotarygroup.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Responses within 12 hours</p>
            </div>

            <div className="contact-card will-change-transform">
              <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">Service Area</p>
              <p className="text-lg text-white">Lehigh Valley, PA & 50-mile radius</p>
            </div>
          </div>

          <div className="contact-card mt-16 pt-16 border-t border-neutral-900 will-change-transform">
            <p className="text-gray-400 leading-relaxed">
              All appointments include document prep guidance and ID verification checklist.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Prefer video consultations? Request a secure virtual session in your message.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
