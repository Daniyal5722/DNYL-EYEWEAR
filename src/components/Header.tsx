import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
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
}

export default function Header({
  currentView,
  onNavigate,
  cart,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'SHOP', view: 'shop' },
    { label: 'NEW ARRIVALS', view: 'shop', params: { filter: 'NEW ARRIVALS' } },
    { label: 'BEST SELLERS', view: 'shop', params: { filter: 'BEST SELLERS' } },
    { label: 'ABOUT', view: 'about' },
    { label: 'CONTACT', view: 'contact' },
  ];

  return (
    <>
      {/* Top Banner */}
      <div id="promo-banner" className="bg-black text-white text-center text-[10px] tracking-[0.2em] py-2 font-medium">
        FREE PREMIUM NATIONWIDE DELIVERY | CASH ON DELIVERY ACROSS PAKISTAN
      </div>

      <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-black hover:opacity-70 focus:outline-none focus:ring-1 focus:ring-black"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Brand Logo */}
          <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex flex-col items-center justify-center group focus:outline-none"
            >
              <span className="text-2xl font-bold tracking-[0.25em] text-black transition-all group-hover:tracking-[0.3em]">
                DNYL
              </span>
              <span className="text-[8px] tracking-[0.55em] font-medium text-gray-500 mt-[-2px] ml-[0.3em]">
                EYEWEAR
              </span>
            </button>
          </div>

          {/* Desktop Core Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate(link.view, link.params);
                }}
                className={`text-xs tracking-[0.2em] font-medium transition-all py-2 border-b-2 hover:border-black ${
                  currentView === link.view && (!link.params || JSON.stringify(link.params) === JSON.stringify(window.location.hash)) // Simple match indicator
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div id="header-actions" className="flex items-center space-x-1 sm:space-x-3">
            {/* Search Button */}
            <button
              id="search-icon-btn"
              onClick={onOpenSearch}
              className="p-2 text-black hover:opacity-60 transition-opacity focus:outline-none"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account Button */}
            <button
              id="account-icon-btn"
              onClick={() => onNavigate('account')}
              className="hidden sm:inline-flex p-2 text-black hover:opacity-60 transition-opacity focus:outline-none"
              aria-label="My Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-icon-btn"
              onClick={onOpenWishlist}
              className="p-2 text-black hover:opacity-60 transition-opacity relative focus:outline-none"
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
              className="p-2 text-black hover:opacity-60 transition-opacity relative focus:outline-none"
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
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Mobile Slide Panel */}
            <motion.div
              id="mobile-nav-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[80vw] max-w-[360px] bg-white text-black p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-[0.2em]">DNYL</span>
                    <span className="text-[7px] tracking-[0.5em] text-gray-500 mt-[-2px] ml-[0.3em]">EYEWEAR</span>
                  </div>
                  <button
                    id="mobile-nav-close"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-black focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                <nav id="mobile-nav-links" className="mt-8 space-y-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate(link.view, link.params);
                      }}
                      className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2 text-gray-800 hover:text-black hover:pl-2 transition-all duration-300 border-l border-transparent hover:border-black"
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('account');
                    }}
                    className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2 text-gray-800 hover:text-black hover:pl-2 transition-all duration-300 border-l border-transparent hover:border-black"
                  >
                    MY ACCOUNT
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('track-order');
                    }}
                    className="block w-full text-left text-sm tracking-[0.2em] font-medium py-2 text-gray-800 hover:text-black hover:pl-2 transition-all duration-300 border-l border-transparent hover:border-black"
                  >
                    TRACK ORDER
                  </button>
                </nav>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-[10px] tracking-[0.1em] text-gray-400 font-semibold uppercase">SUPPORT</p>
                <a
                  href="mailto:support@dnyleyewear.com"
                  className="block text-xs text-gray-600 mt-2 hover:text-black"
                >
                  support@dnyleyewear.com
                </a>
                <p className="text-[10px] text-gray-400 mt-4">DNYL Eyewear — SEE DIFFERENT.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
