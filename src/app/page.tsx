import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TheFirm from "@/components/TheFirm";
import HorizontalServices from "@/components/HorizontalServices";
import BookingSection from "@/components/BookingSection";
import TitaniumFooter from "@/components/TitaniumFooter";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import LazyHolographicCalculator from "@/components/LazyHolographicCalculator";
import AnimationSpeedController from "@/components/AnimationSpeedController";
import { metadata as metadataConfig, structuredData } from "./metadata";

export const metadata = metadataConfig;

export default function Home() {
  return (
    <>
      <AnimationSpeedController />
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div
        className="bg-black min-h-screen relative overflow-x-hidden"
      >
        <Header />
        <main className="relative z-10">
          <Hero />
          <TheFirm />
          <HorizontalServices />

          {/* Standard Vertical Sections for Utility */}
          <div className="relative z-20 bg-black">
            <BookingSection />
            <FAQ />
            <Contact />
          </div>
        </main>

        <TitaniumFooter />

        {/* Floating UI */}
        <LazyHolographicCalculator />
      </div>
    </>
  );
}
