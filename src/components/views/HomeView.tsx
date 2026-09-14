import React, { useState, useEffect } from 'react';
import { Shield, Truck, CreditCard, Headphones, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
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
}

export default function HomeView({
  products,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigate,
}: HomeViewProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized coordinates (-0.5 to 0.5)
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const featuredProducts = products.filter((p) => p.tags.includes('BEST SELLERS')).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes('NEW ARRIVALS')).slice(0, 4);

  return (
    <div id="home-view-stage" className="overflow-x-hidden">
      
      {/* 1. Cinematic Full-Screen Editorial Hero */}
      <section id="hero-section" className="relative h-[calc(100vh-120px)] min-h-[500px] w-full overflow-hidden bg-[#0d0d0d] flex items-center justify-center">
        
        {/* Parallax Background Campaign Graphic */}
        <motion.div
          id="hero-bg-parallax"
          style={{
            x: mousePosition.x * 20,
            y: mousePosition.y * 20,
          }}
          className="absolute inset-0 z-0 scale-105"
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.5 }}
        >
          <AbstractBackground mousePosition={mousePosition} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />
        </motion.div>

        {/* Hero Branding Content Overlay */}
        <div className="relative z-10 text-center text-white max-w-4xl px-4 flex flex-col items-center justify-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="text-[10px] tracking-[0.5em] text-gray-300 font-bold uppercase mb-4">
              KARACHI, PAKISTAN
            </span>
            
            <h1 className="text-6xl sm:text-8xl font-black tracking-[0.25em] text-white select-none leading-none">
              DNYL
            </h1>
            
            <span className="text-xs sm:text-sm tracking-[0.8em] text-gray-400 font-bold uppercase mt-2 ml-[0.8em]">
              EYEWEAR
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-sm sm:text-base tracking-[0.35em] text-gray-300 font-light mt-8 uppercase font-display italic"
          >
            SEE DIFFERENT.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
          >
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto bg-white text-black text-xs tracking-[0.25em] font-bold uppercase py-4 px-8 hover:bg-zinc-200 transition-colors duration-300 flex items-center justify-center space-x-2 rounded-sm"
            >
              <span>SHOP SUNGLASSES</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('shop', { filter: 'PREMIUM' })}
              className="w-full sm:w-auto border border-white text-white text-xs tracking-[0.25em] font-bold uppercase py-4 px-8 hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              EXPLORE COLLECTION
            </button>
          </motion.div>
        </div>

        {/* Scroll down indicator prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-gray-500 animate-bounce">
          <span className="text-[8px] tracking-[0.3em] uppercase mb-1">SCROLL</span>
          <div className="w-0.5 h-6 bg-gray-500" />
        </div>
      </section>

      {/* 2. Trust Bar (Immediately below hero) */}
      <section id="trust-bar" className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          
          <div className="flex flex-col items-center space-y-1 group">
            <Shield className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900">PREMIUM QUALITY</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Medical Grade Materials</span>
          </div>

          <div className="flex flex-col items-center space-y-1 group">
            <CreditCard className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900">CASH ON DELIVERY</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">No Prepayment Required</span>
          </div>

          <div className="flex flex-col items-center space-y-1 group">
            <Truck className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900">NATIONWIDE DELIVERY</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Free Secure Shipping</span>
          </div>

          <div className="flex flex-col items-center space-y-1 group">
            <Shield className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900">SECURE CHECKOUT</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">100% Encrypted Transactions</span>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center space-y-1 group">
            <Headphones className="w-5 h-5 text-black group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[10px] tracking-wider font-bold text-gray-900">CUSTOMER SUPPORT</span>
            <span className="text-[8px] text-gray-400 uppercase tracking-widest font-light">Direct WhatsApp Hotline</span>
          </div>

        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section id="featured-products" className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase block mb-1">
                CURATED HIGHLIGHTS
              </span>
              <h2 className="text-2xl font-bold tracking-[0.15em] uppercase text-black font-display">
                FEATURED DESIGNS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs tracking-wider font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-colors"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* 4. Shop by Style Categories Grid (Bento style) */}
      <section id="shop-by-style" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">
              CHOOSE YOUR ANGLE
            </span>
            <h2 className="text-3xl font-extrabold tracking-[0.15em] uppercase text-black font-display">
              SHOP BY STYLE
            </h2>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <div
                key={cat.name}
                onClick={() => onNavigate('shop', { filter: cat.name })}
                className="group relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer rounded-sm border border-gray-50 transition-all duration-500 hover:shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent flex flex-col justify-end p-4 sm:p-6" />
                
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">{cat.name}</h3>
                    <p className="text-[8px] sm:text-[9px] text-gray-300 font-light uppercase tracking-wider mt-0.5">Explore Styles</p>
                  </div>
                  <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Brand Editorial Story ("See Different") */}
      <section id="brand-story" className="relative py-28 bg-[#090909] text-white overflow-hidden">
        {/* Soft radial glow for cinematic brand editorial */}
        <LightingOverlay intensity="medium" position="absolute" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-5 space-y-6 z-10">
            <span className="text-[10px] tracking-[0.4em] text-gray-500 font-bold uppercase block">
              DNYL IDENTITY
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[0.1em] text-white leading-tight font-display">
              SEE <br />DIFFERENT.
            </h2>
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
              DNYL is derived from the founder's name, Daniyal. Built on a foundation of absolute confidence, minimalism, and premium international style, we create eyewear that stands apart.
            </p>
            <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md">
              Our studio is rooted in Karachi, Pakistan, blending raw urban architecture with a modern, borderless vision. We believe sunglasses are not just an accessory—they are the optical structure of your confidence.
            </p>
            
            <button
              onClick={() => onNavigate('about')}
              className="mt-4 border-b-2 border-white pb-1.5 text-xs tracking-[0.2em] font-bold text-white hover:text-zinc-300 hover:border-zinc-300 transition-colors uppercase"
            >
              READ FULL STORY
            </button>
          </div>

          <div className="lg:col-span-7 relative flex justify-end">
            <div className="w-full max-w-lg aspect-[4/3] overflow-hidden rounded-md shadow-2xl relative border border-zinc-800">
              <img
                src={DNYL_ASSETS.hero}
                alt="Karachi street editorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-transparent to-transparent" />
            </div>
            
            {/* Overlay float brand tag */}
            <div className="absolute -bottom-6 -left-6 bg-white text-black p-6 hidden md:block max-w-[200px] border border-gray-100 shadow-xl">
              <p className="text-xs font-black tracking-widest font-display">"CONFIDENCE AND BOLD FREQUENCY."</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 font-bold">— Studio DNYL</p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Best Sellers Carousel/Grid */}
      <section id="best-sellers" className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase block mb-1">
                GLOBAL FAVORITES
              </span>
              <h2 className="text-2xl font-bold tracking-[0.15em] uppercase text-black font-display">
                BEST-SELLING STYLES
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'BEST SELLERS' })}
              className="text-xs tracking-wider font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-colors"
            >
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
