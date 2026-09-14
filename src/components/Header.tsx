import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  cart: CartItem[];
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenAiAdvisor?: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  cart,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onOpenAiAdvisor,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Monitor window scroll to shift from transparent/light-blur to solid elevated header
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', view: 'home' },
    { label: 'COLLECTION', view: 'shop' },
    { label: 'ABOUT', view: 'about' },
    { label: 'CONTACT', view: 'contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div id="promo-banner" className="bg-black text-white text-center text-[10px] tracking-[0.22em] py-2 px-4 font-medium select-none flex items-center justify-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span>FREE NATIONWIDE EXPRESS DELIVERY | CASH ON DELIVERY (COD) ACROSS PAKISTAN</span>
      </div>

      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-1'
            : 'bg-white/90 backdrop-blur-md border-b border-gray-100/60 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-black hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Left Brand Logo */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center md:items-start justify-center group focus:outline-none"
            >
              <span className="text-xl sm:text-2xl font-black tracking-[0.28em] text-black transition-all group-hover:tracking-[0.32em] font-sans">
                DNYL
              </span>
              <span className="text-[7.5px] tracking-[0.55em] font-semibold text-gray-500 mt-[-3px] ml-[0.3em]">
                EYEWEAR
              </span>
            </button>
          </div>

          {/* Desktop Core Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view)}
                  className="relative text-[11px] tracking-[0.22em] font-semibold transition-colors py-2 text-gray-600 hover:text-black focus:outline-none"
                >
                  <span className={isActive ? 'text-black font-bold' : ''}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div id="header-actions" className="flex items-center space-x-1 sm:space-x-3">
            {/* AI Style Advisor Trigger Button */}
            {onOpenAiAdvisor && (
              <button
                id="header-ai-advisor-btn"
                onClick={onOpenAiAdvisor}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-zinc-950 text-white hover:bg-black hover:scale-102 transition-all text-[9.5px] font-extrabold tracking-[0.16em] uppercase shadow-xs select-none"
                title="DNYL AI Style Advisor & Try-On"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>FIND MY FRAME</span>
              </button>
            )}

            {/* Search Button */}
            <button
              id="search-icon-btn"
              onClick={onOpenSearch}
              className="p-2 text-black hover:opacity-60 transition-opacity focus:outline-none rounded-full"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-icon-btn"
              onClick={onOpenWishlist}
              className="p-2 text-black hover:opacity-60 transition-opacity relative focus:outline-none rounded-full"
              aria-label="My Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              id="cart-icon-btn"
              onClick={onOpenCart}
              className="p-2 text-black hover:opacity-60 transition-opacity relative focus:outline-none rounded-full"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartItemCount > 0 && (
                <motion.span
                  key={cartItemCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1 right-1 bg-black text-white rounded-full text-[8px] w-4 h-4 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Slide Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark glass backdrop overlay */}
            <motion.div
              id="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
            />

            {/* Mobile Slide Panel */}
            <motion.div
              id="mobile-nav-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[84vw] max-w-[340px] bg-white text-black p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-[0.25em] font-sans">DNYL</span>
                    <span className="text-[7px] tracking-[0.55em] font-bold text-gray-500 mt-[-2px] ml-[0.3em]">EYEWEAR</span>
                  </div>
                  <button
                    id="mobile-nav-close"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-black hover:opacity-60 focus:outline-none"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>

                <div className="mt-4 py-2 text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">
                  SEE DIFFERENT.
                </div>

                <nav id="mobile-nav-links" className="mt-4 space-y-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate(link.view);
                      }}
                      className={`block w-full text-left text-xs tracking-[0.22em] font-bold py-2.5 transition-all ${
                        currentView === link.view
                          ? 'text-black border-l-2 border-black pl-3'
                          : 'text-gray-600 hover:text-black hover:pl-2'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    {onOpenAiAdvisor && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenAiAdvisor();
                        }}
                        className="flex items-center space-x-2 w-full text-left text-xs tracking-[0.22em] font-extrabold py-2.5 px-3 bg-zinc-950 text-white rounded-md uppercase"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>FIND MY FRAME (AI ADVISOR)</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('shop', { filter: 'NEW ARRIVALS' });
                      }}
                      className="block w-full text-left text-xs tracking-[0.22em] font-semibold py-2 text-gray-600 hover:text-black"
                    >
                      NEW ARRIVALS
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('shop', { filter: 'BEST SELLERS' });
                      }}
                      className="block w-full text-left text-xs tracking-[0.22em] font-semibold py-2 text-gray-600 hover:text-black"
                    >
                      BEST SELLERS
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('track-order');
                      }}
                      className="block w-full text-left text-xs tracking-[0.22em] font-semibold py-2 text-gray-600 hover:text-black"
                    >
                      TRACK ORDER
                    </button>
                  </div>
                </nav>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between text-[10px] tracking-wider text-gray-400 mb-2">
                  <span>REGION: PAKISTAN</span>
                  <span>PKR (Rs.)</span>
                </div>
                <a
                  href="mailto:support@dnyleyewear.com"
                  className="block text-xs font-semibold text-gray-800 hover:text-black tracking-wide"
                >
                  support@dnyleyewear.com
                </a>
                <p className="text-[9px] text-gray-400 mt-2">DNYL Eyewear &copy; 2026. All rights reserved.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
