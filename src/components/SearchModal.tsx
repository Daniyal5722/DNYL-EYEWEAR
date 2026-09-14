import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, params?: any) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onNavigate,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('dnyl_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Run instant search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.productType.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
    setResults(filtered);
  }, [query, products]);

  const handleSelectProduct = (product: Product) => {
    // Add query to recent searches
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter((s) => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('dnyl_recent_searches', JSON.stringify(updated));
    }
    onSelectProduct(product);
    onClose();
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('dnyl_recent_searches');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1 max-w-2xl relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400 stroke-[1.5]" />
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH DNYL COLLECTION (E.G. AVIATOR, POLARIZED...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-md text-sm text-black tracking-widest placeholder-gray-400 uppercase font-light focus:outline-none focus:ring-1 focus:ring-black"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 text-gray-400 hover:text-black focus:outline-none"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="ml-6 p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors focus:outline-none flex items-center space-x-2"
            >
              <span className="text-[10px] tracking-widest uppercase font-medium hidden sm:inline">CLOSE</span>
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left panel: Recommendations & Recent terms */}
          <div className="md:col-span-4 space-y-8 border-r border-gray-100 pr-4">
            {/* Popular styles */}
            <div>
              <h3 className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase mb-4">POPULAR SEARCHES</h3>
              <div className="flex flex-wrap gap-2">
                {['AVIATOR', 'WAYFARER', 'SQUARE', 'ROUND', 'POLARIZED', 'BEST SELLERS'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="text-xs bg-gray-50 hover:bg-black hover:text-white text-gray-700 px-3.5 py-2 rounded-sm transition-colors duration-300 tracking-wider focus:outline-none"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent search items */}
            {recentSearches.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase">RECENT SEARCHES</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[9px] tracking-wider text-gray-400 hover:text-black uppercase focus:outline-none"
                  >
                    CLEAR
                  </button>
                </div>
                <div className="space-y-3">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(term)}
                      className="flex items-center text-xs text-gray-600 hover:text-black transition-colors w-full text-left font-light focus:outline-none py-1"
                    >
                      <History className="w-3.5 h-3.5 mr-2 text-gray-300" />
                      <span className="uppercase tracking-wider">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Search Results Stage */}
          <div className="md:col-span-8">
            <h3 className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase mb-6">
              {query ? `SEARCH RESULTS (${results.length})` : 'EXPLORE COLLECTION'}
            </h3>

            {query ? (
              results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {results.map((product) => {
                    const price = parseInt(product.priceRange.minVariantPrice.amount, 10);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="flex space-x-4 border border-gray-100 p-3 hover:border-black cursor-pointer bg-white transition-colors duration-300 rounded-sm"
                      >
                        <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                          <img
                            src={product.images[0]?.url}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <p className="text-[9px] tracking-widest text-gray-400 font-medium uppercase">{product.productType}</p>
                            <h4 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mt-1 line-clamp-1">{product.title}</h4>
                          </div>
                          <span className="text-xs font-bold text-black">Rs. {price.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm font-light">NO STYLES MATCHED "{query.toUpperCase()}"</p>
                  <p className="text-xs mt-2 font-light">Try searching for generic styles like 'Aviator', 'Wayfarer' or 'Polarized'.</p>
                </div>
              )
            ) : (
              // Empty search visual explorer: list top 3 featured products
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {products.slice(0, 3).map((p) => {
                  const price = parseInt(p.priceRange.minVariantPrice.amount, 10);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="group cursor-pointer border border-gray-50 hover:border-black p-3 text-center transition-all duration-300 bg-white"
                    >
                      <div className="aspect-[1/1] overflow-hidden bg-gray-50 mb-3 rounded-sm">
                        <img
                          src={p.images[0]?.url}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest line-clamp-1">{p.title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-1">Rs. {price.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </AnimatePresence>
  );
}
