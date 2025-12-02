import React from 'react';
import { Playfair_Display, Inter } from "next/font/google";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TheFirm from '@/components/TheFirm';
import HorizontalServices from '@/components/HorizontalServices';
import ServiceCoverage from '@/components/ServiceCoverage';
import BookingSection from '@/components/BookingSection';
import TitaniumFooter from '@/components/TitaniumFooter';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import HolographicCalculator from '@/components/HolographicCalculator';
import { metadata as metadataConfig, structuredData } from './metadata';

export const metadata = metadataConfig;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className={`${playfair.variable} ${inter.variable} bg-black min-h-screen relative overflow-x-hidden`}>
        <Header />
      <main className="relative z-10">
        <Hero />
        <About />
        <TheFirm />
        <HorizontalServices />
        <ServiceCoverage />
        
        {/* Standard Vertical Sections for Utility */}
        <div className="relative z-20 bg-black">
          <BookingSection />
          <FAQ />
          <Contact />
        </div>
      </main>
      
      <TitaniumFooter />
      
      {/* Floating UI */}
      <HolographicCalculator />
    </div>
    </>
  );
}
