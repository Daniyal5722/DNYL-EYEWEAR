import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DNYL_ASSETS } from '../data';

interface AbstractBackgroundProps {
  mousePosition?: { x: number; y: number };
}

interface ShowcaseProduct {
  id: string;
  name: string;
  spec: string;
  image: string;
  badge: string;
  depth: 'foreground' | 'midground' | 'background';
  desktopPosition: { left?: string; right?: string; top?: string; bottom?: string };
  tabletPosition: { left?: string; right?: string; top?: string; bottom?: string };
  mobileVisible: boolean;
  baseRotate: number;
  floatDuration: number;
  floatDelay: number;
  floatYDistance: number;
  floatXDistance: number;
  rotateRange: number;
  scale: number;
  opacity: number;
  blur: string;
  parallaxFactor: number;
}

const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'aviator',
    name: 'MAVERICK AVIATOR',
    spec: 'TITANIUM GOLD // POLARIZED',
    badge: '01',
    image: DNYL_ASSETS.aviator,
    depth: 'foreground',
    desktopPosition: { left: '4%', top: '14%' },
    tabletPosition: { left: '3%', top: '16%' },
    mobileVisible: true,
    baseRotate: -8,
    floatDuration: 9,
    floatDelay: 0,
    floatYDistance: 16,
    floatXDistance: 8,
    rotateRange: 4,
    scale: 1.05,
    opacity: 0.85,
    blur: 'none',
    parallaxFactor: 30,
  },
  {
    id: 'square',
    name: 'STEALTH SQUARE',
    spec: 'OBSIDIAN ACETATE // UV400',
    badge: '02',
    image: DNYL_ASSETS.square,
    depth: 'foreground',
    desktopPosition: { right: '4%', bottom: '12%' },
    tabletPosition: { right: '3%', bottom: '14%' },
    mobileVisible: true,
    baseRotate: 7,
    floatDuration: 11,
    floatDelay: 1.5,
    floatYDistance: 18,
    floatXDistance: -10,
    rotateRange: 5,
    scale: 1.02,
    opacity: 0.82,
    blur: 'none',
    parallaxFactor: 32,
  },
  {
    id: 'round',
    name: 'AURA ROUND',
    spec: 'BETA TITANIUM // EMERALD',
    badge: '03',
    image: DNYL_ASSETS.round,
    depth: 'midground',
    desktopPosition: { right: '6%', top: '12%' },
    tabletPosition: { right: '5%', top: '12%' },
    mobileVisible: false,
    baseRotate: 12,
    floatDuration: 13,
    floatDelay: 2.5,
    floatYDistance: 14,
    floatXDistance: 6,
    rotateRange: 3,
    scale: 0.9,
    opacity: 0.65,
    blur: 'blur-[0.5px]',
    parallaxFactor: 18,
  },
  {
    id: 'wayfarer',
    name: 'NOMAD WAYFARER',
    spec: 'MATTE CHARCOAL // POLARIZED',
    badge: '04',
    image: DNYL_ASSETS.wayfarer,
    depth: 'background',
    desktopPosition: { left: '6%', bottom: '14%' },
    tabletPosition: { left: '4%', bottom: '15%' },
    mobileVisible: false,
    baseRotate: -10,
    floatDuration: 15,
    floatDelay: 3.5,
    floatYDistance: 12,
    floatXDistance: -6,
    rotateRange: 3,
    scale: 0.82,
    opacity: 0.5,
    blur: 'blur-[1.2px]',
    parallaxFactor: 12,
  },
];

export default function AbstractBackground({ mousePosition = { x: 0, y: 0 } }: AbstractBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [internalMouse, setInternalMouse] = useState({ x: 0, y: 0 });
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setInternalMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use passed mousePosition if active, otherwise fallback to internal listener
  const activeMouse = mousePosition.x !== 0 || mousePosition.y !== 0 ? mousePosition : internalMouse;

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#060608]" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#060608] select-none z-0">
      {/* 1. Cinematic Studio Lighting Environment */}
      
      {/* Deep Obsidian Radial Background Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-[#09090c] to-[#040406]" />

      {/* Atmospheric Volumetric Spotlight 1: Champagne Warm Rim Light (Top Left) */}
      <motion.div
        animate={!prefersReducedMotion ? {
          opacity: [0.25, 0.4, 0.25],
          scale: [1, 1.08, 1],
        } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/10 via-amber-700/5 to-transparent blur-[140px] pointer-events-none"
      />

      {/* Atmospheric Volumetric Spotlight 2: Polarized Titanium Cyan-Slate Glow (Bottom Right) */}
      <motion.div
        animate={!prefersReducedMotion ? {
          opacity: [0.2, 0.35, 0.2],
          scale: [1.05, 0.95, 1.05],
        } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tl from-slate-600/10 via-teal-900/5 to-transparent blur-[150px] pointer-events-none"
      />

      {/* Subtle Studio Cone Overhead Light */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 80%)',
        }}
      />

      {/* 2. Abstract Geometric Architectural Accents (Optical Geometry / Titanium Calipers) */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        {/* Fine Optical Lens Concentric Ring Guide - Left */}
        <div 
          className="absolute top-1/3 left-10 w-96 h-96 rounded-full border border-white/[0.04]"
          style={{ transform: `translate3d(${activeMouse.x * -8}px, ${activeMouse.y * -8}px, 0)` }}
        />
        <div 
          className="absolute top-1/3 left-10 w-96 h-96 rounded-full border border-dashed border-white/[0.03] scale-110"
          style={{ transform: `translate3d(${activeMouse.x * -6}px, ${activeMouse.y * -6}px, 0)` }}
        />

        {/* Fine Optical Lens Concentric Ring Guide - Right */}
        <div 
          className="absolute bottom-1/4 right-10 w-[480px] h-[480px] rounded-full border border-white/[0.04]"
          style={{ transform: `translate3d(${activeMouse.x * -10}px, ${activeMouse.y * -10}px, 0)` }}
        />

        {/* Precision Crosshair Markers */}
        <span className="absolute top-20 left-1/4 text-white/[0.12] text-[10px] font-mono tracking-widest">+</span>
        <span className="absolute top-24 right-1/3 text-white/[0.12] text-[10px] font-mono tracking-widest">+</span>
        <span className="absolute bottom-28 left-1/3 text-white/[0.12] text-[10px] font-mono tracking-widest">+</span>
        <span className="absolute bottom-24 right-1/4 text-white/[0.12] text-[10px] font-mono tracking-widest">+</span>
      </div>

      {/* 3. Subtle Floating Stardust & Atmospheric Micro-Light Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(14)].map((_, i) => {
            const xPercent = (i * 7.3) % 95;
            const yPercent = (i * 9.1 + 10) % 85;
            const duration = 14 + (i % 6) * 3;
            const delay = (i * 1.3) % 7;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0.1 }}
                animate={{
                  opacity: [0.1, 0.55, 0.1],
                  y: [0, -25, 0],
                  x: [0, (i % 2 === 0 ? 12 : -12), 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: 'easeInOut',
                }}
                className="absolute w-1 h-1 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. The Product Showcase: Cinematic Floating Eyewear with Realistic Lighting, Shadows & Depth */}
      <div className="absolute inset-0 overflow-hidden">
        {SHOWCASE_PRODUCTS.map((prod) => {
          const isHovered = hoveredProduct === prod.id;
          
          // Parallax calculation per product depth
          const parallaxX = activeMouse.x * prod.parallaxFactor;
          const parallaxY = activeMouse.y * prod.parallaxFactor;

          return (
            <div
              key={prod.id}
              className={`absolute transition-all duration-700 pointer-events-auto ${
                prod.mobileVisible ? 'block' : 'hidden md:block'
              }`}
              style={{
                ...prod.desktopPosition,
                zIndex: prod.depth === 'foreground' ? 12 : prod.depth === 'midground' ? 8 : 4,
              }}
              onMouseEnter={() => setHoveredProduct(prod.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Motion Rig (Entrance + Parallax + Continuous Float & Rotation) */}
              <motion.div
                initial={{ opacity: 0, scale: prod.scale * 0.85, y: 30 }}
                animate={{
                  opacity: isHovered ? Math.min(prod.opacity + 0.25, 1) : prod.opacity,
                  scale: isHovered ? prod.scale * 1.08 : prod.scale,
                  x: parallaxX,
                  y: parallaxY,
                }}
                transition={{
                  opacity: { duration: 0.6 },
                  scale: { duration: 0.5, ease: 'easeOut' },
                  x: { type: 'spring', stiffness: 45, damping: 25 },
                  y: { type: 'spring', stiffness: 45, damping: 25 },
                }}
                className={`relative group cursor-pointer ${prod.blur}`}
              >
                {/* Continuous Organic Floating & Tilting Loop */}
                <motion.div
                  animate={!prefersReducedMotion ? {
                    y: [-prod.floatYDistance, prod.floatYDistance, -prod.floatYDistance],
                    x: [-prod.floatXDistance, prod.floatXDistance, -prod.floatXDistance],
                    rotateZ: [
                      prod.baseRotate - prod.rotateRange,
                      prod.baseRotate + prod.rotateRange,
                      prod.baseRotate - prod.rotateRange,
                    ],
                  } : {
                    rotateZ: prod.baseRotate,
                  }}
                  transition={!prefersReducedMotion ? {
                    duration: prod.floatDuration,
                    repeat: Infinity,
                    delay: prod.floatDelay,
                    ease: 'easeInOut',
                  } : undefined}
                  className="relative flex flex-col items-center"
                >
                  {/* Studio Specular Rim Highlight Behind Frame */}
                  <div
                    className={`absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none ${
                      prod.id === 'aviator' ? 'bg-amber-400/20' : 'bg-white/15'
                    }`}
                  />

                  {/* Luxury Floating Showcase Capsule */}
                  <div
                    className="relative w-56 sm:w-64 md:w-72 lg:w-80 rounded-[28px] p-3 sm:p-4 transition-luxury overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(15, 15, 20, 0.55) 50%, rgba(5, 5, 8, 0.85) 100%)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: isHovered
                        ? '1px solid rgba(255, 255, 255, 0.35)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isHovered
                        ? '0 30px 60px -15px rgba(0, 0, 0, 0.9), inset 0 1px 2px rgba(255, 255, 255, 0.35)'
                        : '0 20px 45px -12px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)',
                    }}
                  >
                    {/* Dynamic Moving Glass Sheen / Lens Reflection Sweep */}
                    {!prefersReducedMotion && (
                      <motion.div
                        animate={{
                          x: ['-150%', '250%'],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          repeatDelay: 5 + Math.random() * 4,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 pointer-events-none z-20"
                      />
                    )}

                    {/* Capsule Header Badge */}
                    <div className="flex items-center justify-between px-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                          DNYL • {prod.badge}
                        </span>
                      </div>
                      <span className="text-[8px] font-semibold tracking-wider text-white/40 uppercase">
                        EXHIBIT
                      </span>
                    </div>

                    {/* Product High-Resolution Photographic Display Container */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-black/40 to-black/80 flex items-center justify-center p-2 border border-white/[0.06]">
                      {/* Studio Horizon Soft Glow behind the frame */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/[0.06] to-transparent pointer-events-none" />

                      {/* Actual Eyewear Product Image */}
                      <img
                        src={prod.image}
                        alt={`DNYL ${prod.name}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="eager"
                      />
                    </div>

                    {/* Capsule Footer Caption / Typography */}
                    <div className="mt-3 px-2 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-white/90 uppercase font-sans">
                          {prod.name}
                        </span>
                        <span className="text-[9px] font-mono tracking-wider text-white/60">
                          PKR
                        </span>
                      </div>
                      <span className="text-[8px] tracking-[0.25em] text-white/40 uppercase font-mono mt-0.5">
                        {prod.spec}
                      </span>
                    </div>
                  </div>

                  {/* Realistic Diffused Cast Shadow Underneath Floating Portal */}
                  <div
                    className="w-44 sm:w-52 h-4 rounded-full mt-4 blur-md transition-all duration-700 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0) 75%)',
                      transform: isHovered ? 'scale(1.2) translateY(4px)' : 'scale(1) translateY(0)',
                      opacity: isHovered ? 0.9 : 0.65,
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* 5. Center Radial Vignette (Ensures hero heading, tagline, and CTA buttons remain 100% readable) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(6, 6, 8, 0.6) 0%, rgba(6, 6, 8, 0.88) 65%, rgba(4, 4, 6, 0.98) 100%)',
        }}
      />

      {/* 6. Subtle Edge Vignette Shadowing */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none z-10" />
    </div>
  );
}
