'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    id: '01',
    title: 'Initiation',
    description: 'Submit your request via our secure portal. Our intake team reviews the specifics of your transaction immediately.'
  },
  {
    id: '02',
    title: 'Coordination',
    description: 'We interface directly with legal teams and signers to align schedules. Documents are prepared, printed, and vetted for accuracy.'
  },
  {
    id: '03',
    title: 'Execution',
    description: 'Our agent arrives—punctual, professional, and prepared. The signing is conducted with white-glove attention to detail.'
  },
  {
    id: '04',
    title: 'Completion',
    description: 'Documents are expedited for return. You receive instant confirmation of the completed transaction.'
  }
];

const SilverTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section ref={containerRef} className="min-h-screen bg-obsidian text-platinum py-24 px-6 md:px-24 relative overflow-hidden" data-testid="timeline-container">
      <div className="max-w-4xl mx-auto relative">
        {/* The Silver Line */}
        <div className="absolute left-[19px] md:left-[50%] top-0 bottom-0 w-[2px] bg-neutral-800 -translate-x-1/2">
          <motion.div 
            className="w-full bg-gradient-to-b from-silver-mid via-white to-silver-dark"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-24 relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Step Content */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 md:text-right">
                 <div className={index % 2 === 0 ? "md:text-left" : "md:text-right"}>
                    <span className="text-silver-metallic text-sm tracking-widest uppercase mb-2 block">Step {step.id}</span>
                    <h3 className="font-serif text-3xl text-white mb-4">{step.title}</h3>
                    <p className="font-sans text-gray-400 leading-relaxed">{step.description}</p>
                 </div>
              </div>

              {/* Center Dot */}
              <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center bg-obsidian border-2 border-neutral-800 rounded-full z-10">
                <motion.div 
                  className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SilverTimeline;
