import React from 'react';

const Credentials = () => {
  return (
    <section id="credentials" className="min-h-screen bg-black text-platinum py-24 px-6 md:px-24 flex items-center">
      <div className="max-w-4xl mx-auto w-full text-center">
        {/* Logo/Title */}
        <h2 className="font-serif text-4xl md:text-5xl mb-4 bg-gradient-to-r from-silver-mid via-white to-silver-dark bg-clip-text text-transparent">
          Keystone Notary Group, LLC
        </h2>
        <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-16">
          Pennsylvania · New Jersey · Delaware
        </p>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="border border-neutral-800 p-8">
            <p className="text-5xl font-bold text-white mb-2">$100K</p>
            <p className="text-xs text-neutral-600 uppercase tracking-widest">Errors & Omissions</p>
          </div>
          <div className="border border-neutral-800 p-8">
            <p className="text-5xl font-bold text-white mb-2">NNA</p>
            <p className="text-xs text-neutral-600 uppercase tracking-widest">Certified Agent</p>
          </div>
          <div className="border border-neutral-800 p-8">
            <p className="text-5xl font-bold text-white mb-2">Annual</p>
            <p className="text-xs text-neutral-600 uppercase tracking-widest">Background Screen</p>
          </div>
        </div>

        {/* Main Statement */}
        <h3 className="text-2xl md:text-3xl text-white font-light mb-12 leading-relaxed">
          Pennsylvania State Commissioned<br />
          <span className="text-gray-500">Fidelity Approved · Mobile coverage across Lehigh Valley & 50-mile radius</span>
        </h3>

        {/* Details */}
        <div className="border-t border-neutral-900 pt-12 space-y-6 text-left max-w-2xl mx-auto">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 uppercase text-xs tracking-widest">Bonded & Insured</span>
            <span className="text-white text-sm text-right">$100,000 E&O Policy</span>
          </div>
          <div className="flex justify-between items-start border-t border-neutral-900 pt-6">
            <span className="text-gray-600 uppercase text-xs tracking-widest">Background</span>
            <span className="text-white text-sm text-right">Sterling Verified, Renewed Annually</span>
          </div>
          <div className="flex justify-between items-start border-t border-neutral-900 pt-6">
            <span className="text-gray-600 uppercase text-xs tracking-widest">Memberships</span>
            <span className="text-white text-sm text-right">NNA · American Society of Notaries</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <a 
            href="#contact" 
            className="inline-block px-12 py-4 border border-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:border-silver-mid hover:text-silver-mid transition-all duration-300"
          >
            Request Credential Packet
          </a>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
