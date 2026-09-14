import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface LightingOverlayProps {
  intensity?: 'subtle' | 'medium' | 'high';
  position?: 'fixed' | 'absolute';
}

export default function LightingOverlay({
  intensity = 'medium',
  position = 'fixed',
}: LightingOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  // Opacity adjustments based on intensity
  const opacityMultiplier = intensity === 'subtle' ? 0.6 : intensity === 'high' ? 1.3 : 1.0;

  return (
    <div
      className={`inset-0 pointer-events-none z-[1] overflow-hidden ${position}`}
      style={{
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    >
      {/* 1. Primary Warm Champagne / Gold Radial Studio Spotlight (Upper Center / Left) */}
      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                x: [-15, 20, -15],
                y: [-20, 15, -20],
                scale: [1, 1.08, 1],
              }
            : undefined
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] left-[10%] w-[65vw] max-w-[900px] h-[65vw] max-h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 45% 45%, rgba(212, 175, 55, 0.18) 0%, rgba(180, 130, 40, 0.08) 35%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          opacity: 0.85 * opacityMultiplier,
        }}
      />

      {/* 2. Polarized Cyan / Titanium Slate Radial Soft Glow (Lower Right Rim) */}
      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                x: [20, -25, 20],
                y: [15, -20, 15],
                scale: [1.05, 0.95, 1.05],
              }
            : undefined
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute top-[35%] -right-[10%] w-[55vw] max-w-[800px] h-[55vw] max-h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.12) 0%, rgba(56, 189, 248, 0.06) 40%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          opacity: 0.75 * opacityMultiplier,
        }}
      />

      {/* 3. Deep Obsidian Silver / Moonlight Center Core Accent (Directly Behind Products & Hero Content) */}
      <motion.div
        animate={
          !prefersReducedMotion
            ? {
                scale: [0.96, 1.04, 0.96],
                opacity: [0.35 * opacityMultiplier, 0.55 * opacityMultiplier, 0.35 * opacityMultiplier],
              }
            : undefined
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute top-[18%] left-[25%] w-[50vw] max-w-[700px] h-[50vw] max-h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(200, 210, 230, 0.04) 45%, rgba(0, 0, 0, 0) 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* 4. Subtle Studio Horizon Light Bar (Lower Central Section for Product Shelf Depth) */}
      <div
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[90vw] max-w-5xl h-64 rounded-[100%]"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(245, 240, 230, 0.08) 0%, rgba(180, 160, 130, 0.03) 50%, rgba(0, 0, 0, 0) 80%)',
          filter: 'blur(50px)',
          opacity: 0.9 * opacityMultiplier,
        }}
      />
    </div>
  );
}
