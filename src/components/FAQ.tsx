'use client';

import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  headerExplodedAssembly,
  createScrollTimeline,
} from '@/lib/gsap-animations';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import { useDeferredInit } from '@/lib/useDeferredInit';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * FAQ Component
 *
 * Premium FAQ section with cinematic GSAP animations
 * Score: 9/10 - Excellence Standard
 *
 * Features:
 * - Exploded assembly section header
 * - Enhanced FAQ item reveals with blur + rotation
 * - GSAP-driven answer content animations
 *
 * @returns {JSX.Element} The FAQ component
 */

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
  // ========================================================================
  // STATE & REFS
  // ========================================================================

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldInit = useDeferredInit();
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleMainRef = useRef<HTMLSpanElement>(null);
  const titleAccentRef = useRef<HTMLSpanElement>(null);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleToggle = (index: number) => {
    const newIndex = openIndex === index ? null : index;
    setOpenIndex(newIndex);

    // Animate answer content on expand
    if (newIndex !== null) {
      setTimeout(() => {
        const answer = document.querySelector(`#faq-answer-${index}`);
        if (answer) {
          gsap.fromTo(
            answer,
            {
              opacity: 0,
              y: -10,
              filter: 'blur(5px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.4,
              ease: 'power2.out',
              force3D: true,
            }
          );
        }
      }, 50);
    }
  };

  // ========================================================================
  // CINEMATIC GSAP ANIMATIONS
  // ========================================================================

  useGSAP(
    () => {
      if (prefersReducedMotion || !shouldInit || !containerRef.current) return;

      // 1. SECTION HEADER EXPLODED ASSEMBLY
      if (labelRef.current && titleMainRef.current && titleAccentRef.current) {
        const headerTl = createScrollTimeline(containerRef.current, {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'center center',
          scrub: 1,
        });

        headerTl.add(
          headerExplodedAssembly(
            labelRef.current,
            titleMainRef.current,
            titleAccentRef.current
          ),
          0
        );
      }

      // 2. ENHANCED FAQ ITEMS WITH BLUR + ROTATION
      const faqItems = containerRef.current.querySelectorAll('.faq-item');
      if (faqItems.length > 0) {
        const faqTl = createScrollTimeline(faqItems[0], {
          trigger: faqItems[0],
          start: 'top 75%',
          end: 'center center',
          scrub: 1,
        });

        faqItems.forEach((item, index) => {
          const number = item.querySelector('.faq-number');
          const question = item.querySelector('.faq-question');
          const chevron = item.querySelector('.faq-chevron');

          // Number: Scale + rotation + blur entrance
          if (number) {
            faqTl.from(
              number,
              {
                x: -50,
                opacity: 0,
                scale: 0.8,
                rotation: -20,
                filter: 'blur(8px)',
                ease: 'power2.out',
                force3D: true,
              },
              index * 0.05
            );
          }

          // Question: Multi-axis reveal with blur
          if (question) {
            faqTl.from(
              question,
              {
                y: 40,
                opacity: 0,
                scale: 0.95,
                rotation: -2,
                filter: 'blur(10px)',
                ease: 'power2.out',
                force3D: true,
              },
              index * 0.05 + 0.05
            );
          }

          // Chevron: Full spin entrance
          if (chevron) {
            faqTl.from(
              chevron,
              {
                opacity: 0,
                scale: 0,
                rotation: -180,
                filter: 'blur(5px)',
                ease: 'back.out(2)',
                force3D: true,
              },
              index * 0.05 + 0.1
            );
          }
        });
      }
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, shouldInit] }
  );

  return (
    <section ref={containerRef} id="faq" className="relative min-h-screen bg-black py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900 to-neutral-850 opacity-90" />
      </div>

      <div className="max-w-5xl w-full relative z-10 space-y-12">
        {/* SECTION HEADER - EXPLODED ASSEMBLY */}
        <div className="mb-10 text-center space-y-4">
          <span
            ref={labelRef}
            className="block text-silver-mid text-xs tracking-[0.4em] uppercase will-change-transform"
          >
            Common Questions
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-tight">
            <span ref={titleMainRef} className="inline-block will-change-transform">
              Answers
            </span>{' '}
            <span
              ref={titleAccentRef}
              className="inline-block text-silver-metallic italic will-change-transform"
            >
              You Need
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="faq-item border-b border-neutral-800/70">
                <button
                  onClick={() => handleToggle(index)}
                  onKeyDown={(e) => e.key === 'Enter' && handleToggle(index)}
                  aria-expanded={isOpen}
                  className="w-full py-6 flex items-start gap-6 text-left group"
                >
                  {/* Number */}
                  <span className="faq-number font-serif text-3xl text-neutral-700 group-hover:text-neutral-500 transition-colors select-none flex-shrink-0 will-change-transform">
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

                {/* Answer - Animated with GSAP */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    isOpen ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p
                    id={`faq-answer-${index}`}
                    className="font-sans text-lg text-gray-400 leading-relaxed pl-20"
                  >
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
