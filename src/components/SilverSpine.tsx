'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SilverSpine = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current || !containerRef.current) return;

    // Animate the line growing from top to bottom
    gsap.fromTo(lineRef.current, 
      { 
        scaleY: 0,
        opacity: 1 
      },
      {
        scaleY: 1,
        opacity: 1,
        ease: "none", // Linear growth for "drawing" feel
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%", // Start growing when top of spine is near center
          end: "bottom 60%", // Finish growing when bottom is near center
          scrub: 0, // Instant response
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex justify-center h-24 md:h-32 relative overflow-hidden z-0">
      <div 
        ref={lineRef} 
        className="w-[2px] h-full bg-gradient-to-b from-silver-mid via-white to-silver-mid shadow-[0_0_8px_rgba(255,255,255,0.8)] origin-top"
      />
    </div>
  );
};

export default SilverSpine;
