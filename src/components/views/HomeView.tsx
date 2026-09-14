import React, { useState, useEffect } from 'react';
import { Shield, Truck, CreditCard, Headphones, ArrowRight, Sparkles, Check, Compass, Layers } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import AbstractBackground from '../AbstractBackground';
import LightingOverlay from '../LightingOverlay';
import { DNYL_ASSETS, CATEGORIES } from '../../data';

interface HomeViewProps {
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, params?: any) => void;
  onOpenAiAdvisor?: () => void;
}

export default function HomeView({
  products,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigate,
  onOpenAiAdvisor,
}: HomeViewProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const featuredProducts = products.filter((p) => p.tags.includes('BEST SELLERS')).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes('NEW ARRIVALS')).slice(0, 4);

  return (
    <div id="home-view-stage" className="overflow-x-hidden bg-[#fafafa]">
      
      {/* 1. CINEMATIC EDITORIAL HERO SECTION */}
      <section 
        id="hero-section" 
        className="relative min-h-[90vh] lg:min-h-screen w-full overflow-hidden bg-[#060608] flex items-center justify-center py-16 px-4"
      >
        {/* Living Background Animation: Light beams, subtle dust particles, geometric calipers */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <AbstractBackground mousePosition={mousePosition} />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>

        {/* Hero Content Stage */}
        <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Micro Brand Origin Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-white/70 font-semibold uppercase">
              STUDIO EDITION // KARACHI, PAKISTAN
            </span>
          </motion.div>

          {/* Master Headline: DNYL EYEWEAR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.24em] text-white select-none leading-none font-sans drop-shadow-2xl">
              DNYL
            </h1>
            <span className="text-xs sm:text-sm md:text-base tracking-[0.7em] text-white/60 font-bold uppercase mt-2 ml-[0.7em]">
              EYEWEAR
            </span>
          </motion.div>

          {/* Centerpiece: Floating Hero Eyewear Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: 'easeOut' }}
            className="relative my-8 sm:my-10 w-full max-w-md sm:max-w-lg cursor-pointer"
            onClick={() => onNavigate('shop')}
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-radial-glow from-white/15 via-transparent to-transparent blur-3xl rounded-full scale-125 pointer-events-none" />

            {/* Smooth Floating Motion Container */}
            <motion.div
              animate={!prefersReducedMotion ? {
                y: [-8, 8, -8],
                rotateZ: [-1.5, 1.5, -1.5],
              } : undefined}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * -12}deg)`,
              }}
              className="relative flex flex-col items-center transition-transform duration-300 ease-out"
            >
              {/* Product Frame Showcase */}
              <div className="relative w-72 sm:w-84 md:w-96 aspect-[16/10] flex items-center justify-center">
                <img
                  src={DNYL_ASSETS.aviator}
                  alt="DNYL Signature Maverick Aviator"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_24px_38px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              {/* Realistic Ground Shadow */}
              <div 
                className="w-60 sm:w-72 h-4 rounded-full blur-md opacity-70 pointer-events-none mt-2"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 75%)',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Tagline: SEE DIFFERENT. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="space-y-3"
          >
            <p className="text-xl sm:text-2xl md:text-3xl tracking-[0.3em] text-white font-light uppercase font-display italic">
              SEE DIFFERENT.
            </p>
            
            {/* Supporting Statement */}
            <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed tracking-wide px-4">
              Engineered with aerospace-grade titanium and hand-finished Italian acetate. Sculpted for absolute optical clarity and uncompromising modern individuality.
            </p>
          </motion.div>

          {/* Strong Dual CTAs + Virtual Try-On Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-xl px-4"
          >
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto min-w-[180px] bg-white text-black text-xs tracking-[0.25em] font-bold uppercase py-4 px-7 hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center space-x-2 rounded-xs group shadow-xl"
            >
              <span>SHOP EYEWEAR</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            {onOpenAiAdvisor && (
              <button
                onClick={onOpenAiAdvisor}
                className="w-full sm:w-auto min-w-[200px] bg-linear-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700 text-white text-xs tracking-[0.22em] font-bold uppercase py-4 px-6 hover:border-zinc-500 hover:scale-102 transition-all duration-300 rounded-xs flex items-center justify-center space-x-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>TRY ON IN 3D STUDIO</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('shop', { filter: 'PREMIUM' })}
              className="w-full sm:w-auto min-w-[160px] border border-white/30 bg-white/[0.03] backdrop-blur-sm text-white text-xs tracking-[0.22em] font-bold uppercase py-4 px-6 hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-xs"
            >
              COLLECTION
            </button>
          </motion.div>

          {/* Bottom Hero Specifications Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 pt-6 border-t border-white/[0.08] w-full max-w-3xl flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase"
          >
            <span>• 100% UV400 POLARIZED</span>
            <span>• AEROSPACE TITANIUM</span>
            <span>• HAND-CUT ACETATE</span>
            <span>• CASH ON DELIVERY (COD)</span>
          </motion.div>

        </div>
      </section>

      {/* 2. TRUST / CAPABILITIES BAR */}
      <section id="trust-bar" className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="flex flex-col items-center space-y-1">
            <Shield className="w-4 h-4 text-black" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900 uppercase">100% UV400 & POLARIZED</span>
            <span className="text-[8.5px] text-gray-400 uppercase tracking-widest font-light">Japanese Glare-Free Lenses</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <CreditCard className="w-4 h-4 text-black" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900 uppercase">CASH ON DELIVERY (COD)</span>
            <span className="text-[8.5px] text-gray-400 uppercase tracking-widest font-light">Inspect at Your Doorstep</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <Truck className="w-4 h-4 text-black" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900 uppercase">FREE NATIONWIDE DELIVERY</span>
            <span className="text-[8.5px] text-gray-400 uppercase tracking-widest font-light">Karachi • Lahore • Islamabad</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <Headphones className="w-4 h-4 text-black" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900 uppercase">DIRECT CONCIERGE</span>
            <span className="text-[8.5px] text-gray-400 uppercase tracking-widest font-light">Fast WhatsApp Support</span>
          </div>

        </div>
      </section>

      {/* 3. FEATURED DESIGNS COLLECTION GRID */}
      <section id="featured-products" className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase block mb-1">
                CURATED HIGHLIGHTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[0.18em] uppercase text-black font-sans">
                FEATURED DESIGNS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs tracking-wider font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-colors uppercase"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={wishlist.some((item) => item.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 DNYL AI STYLE ADVISOR & VIRTUAL TRY-ON SHOWCASE */}
      <section id="ai-advisor-showcase" className="py-20 sm:py-24 bg-zinc-950 text-white relative border-y border-zinc-800/80 overflow-hidden">
        <LightingOverlay intensity="subtle" position="absolute" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Vision & Feature Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] tracking-[0.35em] text-emerald-400 font-extrabold uppercase font-sans">
                  PROPRIETARY OPTICAL INTELLIGENCE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
                FIND YOUR FRAME.<br />
                <span className="text-zinc-400 font-light italic font-display">POWERED BY DNYL AI.</span>
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                Discover the architectural silhouette crafted for your exact facial proportions. Our DNYL AI Style Advisor analyzes temple width, jawline balance, and symmetry to curate your 3 best matches—and projects them onto your face in our authentic Virtual Try-On Studio.
              </p>

              {/* 3 Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="border border-zinc-800 bg-zinc-900/50 p-3.5 rounded-xl">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-400 block mb-1">01 // GEOMETRY</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Facial Analysis</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Identifies your face shape &amp; optical balance points.</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/50 p-3.5 rounded-xl">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-400 block mb-1">02 // VIRTUAL TRY-ON</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">True Identity</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">100% authentic identity preservation with polarized reflections.</p>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/50 p-3.5 rounded-xl">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-400 block mb-1">03 // DNYL PICKS</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top 3 Matches</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Curated from actual DNYL catalog with styling justifications.</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenAiAdvisor && (
                  <button
                    onClick={onOpenAiAdvisor}
                    className="px-6 py-3.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>LAUNCH AI STYLE ADVISOR</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 rounded-lg text-xs font-bold uppercase tracking-[0.2em] transition-all"
                >
                  BROWSE ALL FRAMES
                </button>
              </div>

              <p className="text-[10px] text-zinc-500 tracking-wide">
                * Privacy first: Real-time ephemeral analysis. No permanent storage or biometric data sharing.
              </p>
            </div>

            {/* Right Column: High-End Optical Frame Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl bg-linear-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-zinc-400 uppercase border-b border-zinc-800/80 pb-3">
                  <span>DNYL // VIRTUAL STUDIO</span>
                  <span className="text-emerald-400">READY</span>
                </div>

                <div className="relative my-auto flex items-center justify-center py-4">
                  <div className="absolute inset-0 bg-radial-glow from-emerald-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />
                  <img
                    src={DNYL_ASSETS.aviator}
                    alt="DNYL Virtual Try-On Frame"
                    referrerPolicy="no-referrer"
                    className="w-full max-h-48 object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-white">
                      MAVERICK AVIATOR
                    </h5>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Aerospace Titanium // Polarized
                    </span>
                  </div>
                  {onOpenAiAdvisor && (
                    <button
                      onClick={onOpenAiAdvisor}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Try On
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BRAND STATEMENT SECTION ("SEE DIFFERENT.") */}
      <section id="brand-statement" className="relative py-24 sm:py-32 bg-[#09090b] text-white overflow-hidden">
        <LightingOverlay intensity="medium" position="absolute" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] tracking-[0.4em] text-white/50 font-bold uppercase block">
                PHILOSOPHY & VISION
              </span>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[0.1em] text-white leading-tight font-display">
                SEE <br />DIFFERENT.
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
                Eyewear is not merely an accessory. It is the geometric structure through which you perceive the horizon—and the statement through which the world recognizes you.
              </p>

              <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
                Founded by Daniyal in Karachi, Pakistan, DNYL strips away the noise of fast-fashion trends. We construct architectural frames from aerospace-grade titanium and dense cellulose acetate, designed for leaders who demand uncompromising clarity and modern confidence.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center space-x-2 border-b-2 border-white pb-1.5 text-xs tracking-[0.25em] font-bold text-white hover:text-zinc-300 hover:border-zinc-300 transition-colors uppercase"
                >
                  <span>EXPLORE OUR ARCHITECTURE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clean Studio Product Showcase (Strictly No Human Models) */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 flex items-center justify-center group shadow-2xl">
                <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />
                
                <img
                  src={DNYL_ASSETS.square}
                  alt="DNYL Architectural Eyewear Geometry"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-mono tracking-widest text-white/50 uppercase">
                  <span>FRAME // STEALTH SQUARE</span>
                  <span>ITALIAN ACETATE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. QUALITY & ENGINEERING SECTION */}
      <section id="engineering-quality" className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-2">
              PRECISION CRAFTSMANSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[0.16em] uppercase text-black font-sans">
              HONEST ENGINEERING
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light mt-3 leading-relaxed">
              Every DNYL frame is drafted, cut, and assembled with architectural tolerances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Spec 1 */}
            <div className="p-8 bg-[#fbfbfb] border border-gray-100 rounded-sm flex flex-col justify-between hover:border-black/20 transition-colors">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">01 // MATERIAL</span>
                <h3 className="text-base font-bold tracking-wider uppercase text-black mt-3 mb-2">
                  Aerospace Titanium & Hand-Cut Acetate
                </h3>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  We balance featherweight 18-gram titanium wireframes with dense, hand-polished Italian cellulose acetate. Built for lifelong tensile durability without ear fatigue.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-[10px] font-mono tracking-wider text-gray-500">
                <Check className="w-3.5 h-3.5 text-black mr-2 shrink-0" />
                <span>Zero warping or greening</span>
              </div>
            </div>

            {/* Spec 2 */}
            <div className="p-8 bg-[#fbfbfb] border border-gray-100 rounded-sm flex flex-col justify-between hover:border-black/20 transition-colors">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">02 // OPTICS</span>
                <h3 className="text-base font-bold tracking-wider uppercase text-black mt-3 mb-2">
                  100% UV400 Polarized Triacetate
                </h3>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Advanced polarization blocks 99.9% of horizontal surface glare from asphalt, water, and desert reflection. Crisp chromatic contrast with total eye protection.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-[10px] font-mono tracking-wider text-gray-500">
                <Check className="w-3.5 h-3.5 text-black mr-2 shrink-0" />
                <span>True color fidelity & zero glare</span>
              </div>
            </div>

            {/* Spec 3 */}
            <div className="p-8 bg-[#fbfbfb] border border-gray-100 rounded-sm flex flex-col justify-between hover:border-black/20 transition-colors">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">03 // HARDWARE</span>
                <h3 className="text-base font-bold tracking-wider uppercase text-black mt-3 mb-2">
                  Reinforced 7-Barrel Hinges
                </h3>
                <p className="text-xs text-gray-600 font-light leading-relaxed">
                  Heavy-duty stainless steel hinge assemblies anchored directly into the internal metal temple cores. Calibrated to hold firm resistance through over 50,000 cycles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-[10px] font-mono tracking-wider text-gray-500">
                <Check className="w-3.5 h-3.5 text-black mr-2 shrink-0" />
                <span>Lifetime snug temple tension</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SHOP BY STYLE CATEGORIES */}
      <section id="shop-by-style" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">
              CURATED GEOMETRY
            </span>
            <h2 className="text-3xl font-black tracking-[0.16em] uppercase text-black font-sans">
              SHOP BY STYLE
            </h2>
          </div>

          {/* Categories Grid - Clean Product Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <div
                key={cat.name}
                onClick={() => onNavigate('shop', { filter: cat.name })}
                className="group relative aspect-[3/4] overflow-hidden bg-zinc-100 cursor-pointer rounded-sm border border-gray-100 transition-all duration-500 hover:shadow-xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-6" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">{cat.name}</h3>
                    <p className="text-[8.5px] text-gray-300 font-light uppercase tracking-wider mt-0.5">Explore Styles</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BEST-SELLING DESIGNS */}
      <section id="best-sellers" className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase block mb-1">
                TIMELESS CLASSICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[0.18em] uppercase text-black font-sans">
                BEST SELLERS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'BEST SELLERS' })}
              className="text-xs tracking-wider font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-colors uppercase"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {newArrivals.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={wishlist.some((item) => item.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
