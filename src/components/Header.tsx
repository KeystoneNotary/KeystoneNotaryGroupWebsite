'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Coverage', href: '#coverage' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // GSAP scroll animation for header background
  useGSAP(() => {
    if (!headerRef.current) return;

    gsap.to(headerRef.current, {
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      scrollTrigger: {
        trigger: 'body',
        start: 'top -100px',
        end: 'top -101px',
        toggleActions: 'play none none reverse',
      },
    });
  });

  return (
    <header
      ref={headerRef}
      role="banner"
      className="fixed top-0 left-0 right-0 z-[100] bg-black/0 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3"
          aria-label="Keystone Notary Group home"
        >
          <Image
            src="/assets/images/logo-silver-metallic.png"
            alt="Keystone Notary Group LLC"
            width={40}
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="hidden md:block font-serif text-lg text-silver-metallic">
            Keystone Notary Group
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm text-gray-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Phone & CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <a
            href="tel:+12673099000"
            className="text-silver-mid hover:text-white transition-colors font-medium"
          >
            (267) 309-9000
          </a>
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="px-6 py-2 bg-silver-mid text-black uppercase tracking-widest text-xs font-medium rounded-full hover:bg-silver-metallic transition-colors"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-silver-mid transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        role="navigation"
        aria-label="Mobile navigation"
        className={`lg:hidden fixed top-[72px] left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-neutral-800 transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-lg text-gray-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="pt-6 border-t border-neutral-800 space-y-4">
            <a
              href="tel:+12673099000"
              className="block text-xl text-silver-mid hover:text-white transition-colors font-medium"
            >
              (267) 309-9000
            </a>
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="block w-full text-center px-6 py-3 bg-silver-mid text-black uppercase tracking-widest text-sm font-medium rounded-full hover:bg-silver-metallic transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
