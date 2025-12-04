'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FullPageSilverLine: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed left-8 md:left-16 top-0 bottom-0 w-[2px] z-50 pointer-events-none">
      <motion.div 
        className="w-full bg-gradient-to-b from-silver-mid via-white to-silver-dark"
        style={{ 
          height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          boxShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}
      />
    </div>
  );
};

export default FullPageSilverLine;
