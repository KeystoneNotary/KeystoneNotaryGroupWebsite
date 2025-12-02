'use client';

import React from 'react';

const services = [
  {
    title: 'Estate & Real Estate Closings',
    subtitle: 'Seamless execution for title companies and attorneys.'
  },
  {
    title: 'Executive Mobile Facilitation',
    subtitle: 'We travel to your office, residence, or transit location.'
  },
  {
    title: 'Apostille & Authentication',
    subtitle: 'Navigating international complexities so you don\'t have to.'
  },
  {
    title: 'Specialized Legal Signings',
    subtitle: 'Wills, Trusts, and Power of Attorney.'
  },
  {
    title: 'Corporate & Business Documents',
    subtitle: 'Operating agreements, compliance affidavits, and vendor contracts.'
  },
  {
    title: 'General Notarization',
    subtitle: 'Certified copies, travel consents, and employment verifications.'
  }
];

const Services = () => {
  return (
    <section id="services" className="min-h-screen bg-charcoal text-platinum py-24 px-6 md:px-24 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-16 border-b border-gray-800 pb-4">
          Concierge Offerings
        </h2>
        
        <ul className="space-y-4">
          {services.map((service, index) => (
            <li key={index} className="group cursor-pointer">
              <div className="flex flex-col transition-all duration-500 ease-out">
                <h3 className="font-serif text-4xl md:text-6xl text-gray-500 group-hover:text-white transition-colors duration-500 relative inline-block">
                  {service.title}
                  {/* Silver Glow effect */}
                  <span className="absolute inset-0 blur-lg bg-gradient-to-r from-silver-mid via-white to-silver-dark opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></span>
                </h3>
                
                <p className="font-sans text-lg text-silver-mid mt-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
                  {service.subtitle}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;
