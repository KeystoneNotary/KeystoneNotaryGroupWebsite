'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SilverFrameProps {
  children: React.ReactNode;
  className?: string;
}

const SilverFrame: React.FC<SilverFrameProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRightRef = useRef<SVGPathElement>(null);
  const pathLeftRef = useRef<SVGPathElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure dimensions to draw accurate paths
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: containerRef.current?.offsetWidth || 0,
        height: containerRef.current?.offsetHeight || 0
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Small timeout to allow content to settle
    const timer = setTimeout(updateDimensions, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  useGSAP(() => {
    if (!pathRightRef.current || !pathLeftRef.current || dimensions.width === 0) return;

    const pathRight = pathRightRef.current;
    const pathLeft = pathLeftRef.current;
    
    const lengthRight = pathRight.getTotalLength();
    const lengthLeft = pathLeft.getTotalLength();

    // Set initial state: hidden (undrawn)
    gsap.set([pathRight, pathLeft], {
      strokeDasharray: lengthRight, // Assuming roughly equal
      strokeDashoffset: lengthRight,
      opacity: 1
    });

    // Animate drawing linked to scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center", // Start drawing when top hits center of viewport (or earlier)
        end: "bottom center", // Finish when bottom hits center
        scrub: 0.1, // Smooth scrubbing
      }
    });

    tl.to([pathRight, pathLeft], {
      strokeDashoffset: 0,
      ease: "none"
    });

  }, { scope: containerRef, dependencies: [dimensions] });

  // Calculate paths
  // Right Path: Top-Center -> Top-Right -> Bottom-Right -> Bottom-Center
  const rightPath = `
    M ${dimensions.width / 2} 0 
    L ${dimensions.width} 0 
    L ${dimensions.width} ${dimensions.height} 
    L ${dimensions.width / 2} ${dimensions.height}
  `;

  // Left Path: Top-Center -> Top-Left -> Bottom-Left -> Bottom-Center
  const leftPath = `
    M ${dimensions.width / 2} 0 
    L 0 0 
    L 0 ${dimensions.height} 
    L ${dimensions.width / 2} ${dimensions.height}
  `;

  return (
    <div ref={containerRef} className={`relative p-8 md:p-12 -mt-4 z-10 ${className}`}>
      {/* The Silver Border (SVG) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <svg 
          className="w-full h-full overflow-visible" 
          width={dimensions.width} 
          height={dimensions.height}
        >
          <defs>
            <linearGradient id="silver-gradient-frame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5E4E2" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#E5E4E2" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow-frame">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Right Path */}
          <path
            ref={pathRightRef}
            d={rightPath}
            fill="none"
            stroke="url(#silver-gradient-frame)"
            strokeWidth="2"
            filter="url(#glow-frame)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Left Path */}
          <path
            ref={pathLeftRef}
            d={leftPath}
            fill="none"
            stroke="url(#silver-gradient-frame)"
            strokeWidth="2"
            filter="url(#glow-frame)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SilverFrame;
