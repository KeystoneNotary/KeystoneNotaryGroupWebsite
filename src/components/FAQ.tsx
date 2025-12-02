'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const faqs = [
  {
    number: '01',
    question: 'What documents do I need to bring?',
    answer: 'You\'ll need a government-issued photo ID (driver\'s license, passport, or state ID), the original documents requiring notarization, and any specific instructions from your attorney or title company. We verify identity for every signature we witness.'
  },
  {
    number: '02',
    question: 'How much does notarization cost?',
    answer: 'In-office notarizations start at $15 per signature. Mobile services begin at $75, with additional fees for distance, after-hours service, or complex document packages. Use our calculator above for an instant estimate tailored to your needs.'
  },
  {
    number: '03',
    question: 'Do you offer mobile notary services?',
    answer: 'Absolutely. We travel to your office, home, hospital, or any convenient location throughout the tri-state area. Our mobile service ensures your documents are handled with discretion and professionalism, exactly when and where you need us.'
  },
  {
    number: '04',
    question: 'How far in advance should I book?',
    answer: 'For standard appointments, we recommend booking 24-48 hours in advance to ensure availability. However, we do offer same-day service based on our schedule. For urgent matters, call us directly at (267) 309-9000.'
  },
  {
    number: '05',
    question: 'What is your cancellation policy?',
    answer: 'We require 24-hour notice for cancellations. Appointments cancelled with less than 24 hours notice may incur a cancellation fee. We understand emergencies happen—contact us if you need to reschedule.'
  },
  {
    number: '06',
    question: 'Do you notarize on weekends?',
    answer: 'Yes, we offer weekend appointments for your convenience. Weekend service may include an additional fee. Sunday appointments are typically reserved for emergencies but can be arranged upon request.'
  },
  {
    number: '07',
    question: 'Can you notarize for someone in a hospital or nursing home?',
    answer: 'Yes, we regularly provide notary services at hospitals, nursing homes, and assisted living facilities. We understand the sensitivity of these situations and handle them with extra care and compassion.'
  },
  {
    number: '08',
    question: 'Do you offer Remote Online Notarization (RON)?',
    answer: 'At this time, we specialize in traditional in-person notarizations. This ensures the highest level of security and allows us to verify identity in person, which is especially important for high-value transactions.'
  },
  {
    number: '09',
    question: 'What forms of payment do you accept?',
    answer: 'We accept cash, check, Venmo, Zelle, and all major credit cards. Payment is due at the time of service. For corporate accounts, we can arrange invoicing with NET-30 terms.'
  },
  {
    number: '10',
    question: 'Is a Pennsylvania notarization valid in other states?',
    answer: 'Yes, notarizations performed by a Pennsylvania notary are legally recognized in all 50 states. For documents being used internationally, you may need an apostille—we can assist with that process as well.'
  },
  {
    number: '11',
    question: 'How long does a typical appointment take?',
    answer: 'Most notarizations take 15-30 minutes. Complex closings or multi-signer transactions may require 45-60 minutes. We always allow ample time to ensure accuracy and answer any questions.'
  },
  {
    number: '12',
    question: 'What is the difference between an acknowledgment and a jurat?',
    answer: 'An acknowledgment confirms you signed voluntarily and understand the document. A jurat requires you to sign in our presence while under oath, swearing the contents are true. We\'ll guide you to the correct notarial act for your situation.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const backgroundQRef = useRef<HTMLDivElement>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Background "?" - toggleActions instead of scrub
    gsap.fromTo(backgroundQRef.current,
      { x: 200, opacity: 0, rotation: 15 },
      {
        x: 0,
        opacity: 0.03,
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

    // Staggered entry for each FAQ item (consolidated into single timeline)
    const faqItems = containerRef.current.querySelectorAll('.faq-item');
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "center center",
        scrub: 1
      }
    });

    faqItems.forEach((item, index) => {
      const number = item.querySelector('.faq-number');
      const question = item.querySelector('.faq-question');
      const chevron = item.querySelector('.faq-chevron');

      // Number flies in from left
      masterTl.fromTo(number,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, ease: "power2.out", force3D: true },
        index * 0.05
      );

      // Question flies in from bottom
      masterTl.fromTo(question,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out", force3D: true },
        index * 0.05 + 0.05
      );

      // Chevron fades in
      masterTl.fromTo(chevron,
        { opacity: 0, rotation: -90 },
        { opacity: 1, rotation: 0, ease: "power2.out", force3D: true },
        index * 0.05 + 0.1
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="faq" className="relative min-h-screen bg-black py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden">
      {/* Background Depth Layer - Giant Question Mark */}
      <div className="absolute right-0 top-1/4 pointer-events-none z-0 overflow-hidden">
        <div 
          ref={backgroundQRef}
          className="font-serif text-[40vw] text-white opacity-5 leading-none select-none will-change-transform"
        >
          ?
        </div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4">Common Questions</span>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            Answers <span className="text-silver-metallic italic">You Need</span>
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="faq-item border-b border-neutral-800">
                <button
                  onClick={() => handleToggle(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleToggle(index)}
                  aria-expanded={isOpen}
                  className="w-full py-6 flex items-start gap-6 text-left group"
                >
                  {/* Number */}
                  <span className="faq-number font-serif text-3xl text-neutral-700 group-hover:text-neutral-600 transition-colors select-none flex-shrink-0 will-change-transform">
                    {faq.number}
                  </span>

                  {/* Question */}
                  <h3 className="faq-question font-serif text-2xl md:text-3xl text-white flex-1 leading-tight will-change-transform">
                    {faq.question}
                  </h3>

                  {/* Chevron */}
                  <ChevronDown 
                    className={`faq-chevron flex-shrink-0 transition-transform duration-300 text-silver-mid will-change-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    size={24}
                  />
                </button>

                {/* Answer - Animated with CSS */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    isOpen ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="font-sans text-lg text-gray-400 leading-relaxed pl-20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
