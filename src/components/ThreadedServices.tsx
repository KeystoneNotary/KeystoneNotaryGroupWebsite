'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    id: 'estate',
    title: 'Estate & Real Estate Closings',
    description: 'Seamless execution for title companies and attorneys. We handle the final mile of your most critical transactions.'
  },
  {
    id: 'mobile',
    title: 'Executive Mobile Facilitation',
    description: 'We travel to your office, residence, or transit location. Discretion and punctuality are our hallmarks.'
  },
  {
    id: 'apostille',
    title: 'Apostille & Authentication',
    description: 'Navigating international complexities so you don\'t have to. Full service processing for foreign use documents.'
  },
  {
    id: 'legal',
    title: 'Specialized Legal Signings',
    description: 'Wills, Trusts, and Power of Attorney. Compassionate service for sensitive family matters.'
  },
  {
    id: 'corporate',
    title: 'Corporate & Business Documents',
    description: 'Operating agreements, compliance affidavits, and vendor contracts. Keeping your business moving forward.'
  }
];

const ThreadedServices = () => {
  return (
    <section id="services" className="min-h-screen bg-charcoal text-platinum py-24 px-6 md:px-24 flex flex-col justify-center relative">
      <div className="max-w-5xl mx-auto w-full relative z-10">
        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-24 border-b border-gray-800 pb-4">
          Our Expertise
        </h2>
        
        <ul className="space-y-16">
          {services.map((service, index) => (
            <li key={service.id} className="group relative pl-8 md:pl-16">
              {/* Node for Thread Connection */}
              <div className="service-node absolute left-0 top-3 w-3 h-3 rounded-full bg-neutral-800 border border-neutral-600 group-hover:bg-silver-mid group-hover:border-white transition-colors duration-500 z-20" />
              
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-8 transition-all duration-500 ease-out">
                <h3 className="font-serif text-3xl md:text-5xl text-gray-500 group-hover:text-white transition-colors duration-500 cursor-default">
                  {service.title}
                </h3>
                
                <p className="font-sans text-sm md:text-base text-silver-mid mt-2 md:mt-0 opacity-0 max-h-0 md:max-h-none md:opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-md">
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ThreadedServices;
