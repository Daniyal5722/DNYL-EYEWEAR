import React, { useState } from 'react';
import { Mail, ArrowRight, Instagram, Facebook, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  whatsappNumber: string;
}

export default function Footer({ onNavigate, whatsappNumber }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      // Since there is no dedicated backend list endpoint, we simulate successful collection cleanly
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[#0e0e0e] text-white border-t border-zinc-800 pt-16 pb-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Newsletter and Logo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-800">
          <div className="lg:col-span-5 flex flex-col justify-start">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-start justify-center group focus:outline-none mb-4"
            >
              <span className="text-3xl sm:text-4xl font-semibold tracking-[0.25em] text-white font-display">DNYL</span>
              <span className="text-[9px] tracking-[0.6em] font-medium text-zinc-400 mt-[-2px] ml-[0.3em] font-sans">EYEWEAR</span>
            </button>
            <p className="text-sm text-zinc-400 max-w-sm font-light mt-2 leading-relaxed">
              DNYL is derived from Daniyal. Based in Karachi, Pakistan, DNYL is about confidence, individuality, and seeing the world differently.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7">
            <h3 className="text-xs tracking-[0.25em] font-medium uppercase text-zinc-300 mb-2">JOIN THE DNYL CIRCLE</h3>
            <p className="text-xs text-zinc-500 mb-4">Be the first to receive collection drops, private sales, and styling guides.</p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-md">
              <div className="flex border-b border-zinc-700 focus-within:border-white transition-colors py-1">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  className="bg-transparent border-none text-white w-full py-2 px-1 text-xs tracking-wider focus:outline-none placeholder-zinc-600 font-light"
                  disabled={status === 'loading'}
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="p-2 text-white hover:opacity-75 focus:outline-none disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Newsletter feedback */}
              {status === 'loading' && (
                <p className="absolute text-[10px] text-zinc-400 mt-2 tracking-wider animate-pulse">ADDING TO DNYL CIRCLE...</p>
              )}
              {status === 'success' && (
                <p className="absolute text-[10px] text-emerald-400 mt-2 tracking-wider">WELCOME TO THE CIRCLE. SUBSCRIPTION ACTIVE.</p>
              )}
              {status === 'error' && (
                <p className="absolute text-[10px] text-red-400 mt-2 tracking-wider">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 py-12 text-xs">
          
          {/* Shop */}
          <div>
            <h4 className="tracking-[0.2em] font-semibold text-zinc-300 uppercase mb-4">SHOP</h4>
            <ul className="space-y-3 font-light text-zinc-400">
              <li>
                <button onClick={() => onNavigate('shop', { filter: 'NEW ARRIVALS' })} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filter: 'BEST SELLERS' })} className="hover:text-white transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  All Sunglasses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { filter: 'PREMIUM' })} className="hover:text-white transition-colors">
                  Premium Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="tracking-[0.2em] font-semibold text-zinc-300 uppercase mb-4">HELP</h4>
            <ul className="space-y-3 font-light text-zinc-400">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shipping')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('returns')} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-white transition-colors">
                  Track Order Status
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="tracking-[0.2em] font-semibold text-zinc-300 uppercase mb-4">COMPANY</h4>
            <ul className="space-y-3 font-light text-zinc-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Identity (About)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">
                  Editorial Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Offices
                </button>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="tracking-[0.2em] font-semibold text-zinc-300 uppercase mb-4">FOLLOW</h4>
            <ul className="space-y-3 font-light text-zinc-400">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <span className="font-bold mr-2 text-[10px]">T</span> TikTok
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 mr-2" /> WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="border-t border-zinc-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-widest text-zinc-600">
          <p>© {currentYear} DNYL EYEWEAR. ALL RIGHTS RESERVED. KARACHI, PAKISTAN.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0 font-light">
            <button onClick={() => onNavigate('shipping')} className="hover:text-zinc-400">SHIPPING</button>
            <button onClick={() => onNavigate('returns')} className="hover:text-zinc-400">RETURNS & PRIVACY</button>
            <span>CURRENCY: PKR (Rs.)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
