import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Grid, List, Search, X, Check, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';
import LightingOverlay from '../LightingOverlay';

interface ShopViewProps {
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
  initialFilter?: string | null;
}

export default function ShopView({
  products,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  initialFilter,
}: ShopViewProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilter ? [initialFilter] : []);
  const [priceRange, setPriceRange] = useState<string>('All');
  const [polarizedOnly, setPolarizedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Category list tags
  const shapeTags = ['AVIATOR', 'WAYFARER', 'SQUARE', 'ROUND', 'BEST SELLERS', 'NEW ARRIVALS', 'PREMIUM'];

  useEffect(() => {
    if (initialFilter) {
      setActiveFilters([initialFilter]);
    }
  }, [initialFilter]);

  // Unified Filter logic
  useEffect(() => {
    let result = [...products];

    // 1. Tag/Category filter
    if (activeFilters.length > 0) {
      result = result.filter((p) =>
        activeFilters.some((filter) => p.tags.includes(filter) || p.productType.toUpperCase() === filter)
      );
    }

    // 2. Price filter
    if (priceRange !== 'All') {
      result = result.filter((p) => {
        const price = parseInt(p.priceRange.minVariantPrice.amount, 10);
        if (priceRange === 'Under4k') return price < 4000;
        if (priceRange === '4kTo6k') return price >= 4000 && price <= 6000;
        if (priceRange === 'Over6k') return price > 6000;
        return true;
      });
    }

    // 3. Polarization filter
    if (polarizedOnly) {
      result = result.filter((p) => p.tags.includes('POLARIZED'));
    }

    // 4. Live text search queries
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // 5. Sorting
    if (sortBy === 'PriceLowHigh') {
      result.sort((a, b) => parseInt(a.priceRange.minVariantPrice.amount, 10) - parseInt(b.priceRange.minVariantPrice.amount, 10));
    } else if (sortBy === 'PriceHighLow') {
      result.sort((a, b) => parseInt(b.priceRange.minVariantPrice.amount, 10) - parseInt(a.priceRange.minVariantPrice.amount, 10));
    } else if (sortBy === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredProducts(result);
  }, [products, activeFilters, priceRange, polarizedOnly, searchQuery, sortBy]);

  const toggleTagFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter((f) => f !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setPriceRange('All');
    setPolarizedOnly(false);
    setSearchQuery('');
    setSortBy('Featured');
  };

  return (
    <div id="shop-view-stage" className="bg-white min-h-screen text-black py-12 transition-all duration-300 relative overflow-hidden">
      {/* Studio Lighting Overlay for clean, ambient product shelf illumination */}
      <LightingOverlay intensity="subtle" position="absolute" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Heading */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] text-gray-400 font-bold uppercase block mb-1">
            DNYL STUDIO COLLECTION
          </span>
          <h1 className="text-3xl font-extrabold tracking-[0.15em] uppercase text-black font-display">
            ALL EYEWEAR
          </h1>
          <p className="text-xs text-gray-500 font-light max-w-md mx-auto mt-2 leading-relaxed uppercase">
            Polarized HD lens technology encased in handcrafted Italian materials. Engineered to stand apart.
          </p>
        </div>

        {/* Toolbar segment */}
        <div className="border-y border-gray-100 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Inner Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="SEARCH COLLECTION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded text-xs tracking-wider placeholder-gray-400 uppercase font-light focus:outline-none focus:ring-1 focus:ring-black"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center space-x-2 border border-gray-200 hover:border-black px-4 py-2 rounded text-xs tracking-widest font-semibold focus:outline-none"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>FILTERS</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer pr-4 py-1"
              >
                <option value="Featured">Sort: Featured</option>
                <option value="PriceLowHigh">Price: Low to High</option>
                <option value="PriceHighLow">Price: High to Low</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Total Results */}
            <span className="text-[10px] tracking-widest text-gray-400 font-bold uppercase hidden sm:inline">
              {filteredProducts.length} STYLES MATCHED
            </span>
          </div>

        </div>

        {/* Core Layout Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Sidebar Filters (Desktop only) */}
          <div className="hidden md:block md:col-span-3 space-y-8 pr-6 border-r border-gray-50">
            
            {/* Tag Categories */}
            <div>
              <h3 className="text-[10px] tracking-[0.25em] text-gray-400 font-extrabold uppercase mb-4">FRAME SHAPE</h3>
              <div className="space-y-2.5">
                {shapeTags.map((tag) => {
                  const isChecked = activeFilters.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`flex items-center justify-between text-xs w-full text-left transition-all py-1 font-light tracking-wide focus:outline-none ${
                        isChecked ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      <span className="uppercase">{tag.replace('-', ' ')}</span>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Categories */}
            <div className="pt-6 border-t border-gray-50">
              <h3 className="text-[10px] tracking-[0.25em] text-gray-400 font-extrabold uppercase mb-4">PRICE TIER</h3>
              <div className="space-y-2.5">
                {[
                  { value: 'All', label: 'All prices' },
                  { value: 'Under4k', label: 'Under Rs. 4,000' },
                  { value: '4kTo6k', label: 'Rs. 4,000 - Rs. 6,000' },
                  { value: 'Over6k', label: 'Over Rs. 6,000' },
                ].map((tier) => (
                  <button
                    key={tier.value}
                    onClick={() => setPriceRange(tier.value)}
                    className={`flex items-center justify-between text-xs w-full text-left transition-all py-1 font-light tracking-wide focus:outline-none ${
                      priceRange === tier.value ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    <span>{tier.label}</span>
                    {priceRange === tier.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Polarization Filter */}
            <div className="pt-6 border-t border-gray-50">
              <h3 className="text-[10px] tracking-[0.25em] text-gray-400 font-extrabold uppercase mb-4">LENS CONFIG</h3>
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className={`text-xs tracking-wide font-light ${polarizedOnly ? 'text-black font-semibold' : 'text-gray-500'}`}>
                  POLARIZED ONLY
                </span>
                <input
                  type="checkbox"
                  checked={polarizedOnly}
                  onChange={(e) => setPolarizedOnly(e.target.checked)}
                  className="rounded border-gray-200 text-black focus:ring-black h-4 w-4"
                />
              </label>
            </div>

            {/* Clear Filters Call */}
            {(activeFilters.length > 0 || priceRange !== 'All' || polarizedOnly || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="w-full text-center py-2.5 border border-black hover:bg-black hover:text-white text-xs tracking-widest font-bold uppercase transition-colors"
              >
                RESET FILTERS
              </button>
            )}
          </div>

          {/* Grid Panel (Right Column) */}
          <div className="col-span-1 md:col-span-9">
            
            {/* Active filters chips preview */}
            {(activeFilters.length > 0 || priceRange !== 'All' || polarizedOnly) && (
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                <span className="text-[9px] tracking-wider text-gray-400 font-semibold uppercase mr-2">Filters active:</span>
                
                {activeFilters.map((f) => (
                  <span key={f} className="inline-flex items-center bg-gray-100 text-black px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                    {f}
                    <button onClick={() => toggleTagFilter(f)} className="ml-1.5 hover:text-red-500 focus:outline-none">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}

                {priceRange !== 'All' && (
                  <span className="inline-flex items-center bg-gray-100 text-black px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                    {priceRange === 'Under4k' ? 'Under 4K' : priceRange === '4kTo6k' ? '4K to 6K' : 'Over 6K'}
                    <button onClick={() => setPriceRange('All')} className="ml-1.5 hover:text-red-500 focus:outline-none">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}

                {polarizedOnly && (
                  <span className="inline-flex items-center bg-gray-100 text-black px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase">
                    POLARIZED
                    <button onClick={() => setPolarizedOnly(false)} className="ml-1.5 hover:text-red-500 focus:outline-none">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-[9px] tracking-wider text-gray-400 hover:text-black font-bold uppercase underline"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
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
            ) : (
              <div className="py-24 text-center text-gray-400">
                <SlidersHorizontal className="w-12 h-12 stroke-[1] mb-4 text-gray-300 mx-auto" />
                <p className="text-sm font-light uppercase tracking-widest">NO EYEWEAR MATCHES THE SELECTION</p>
                <p className="text-xs text-gray-400 font-light mt-2">Try relaxing some filters or clear all filter constraints to explore.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 border border-black hover:bg-black hover:text-white text-black text-[10px] tracking-widest uppercase font-semibold py-2.5 px-6 rounded-sm transition-all duration-300"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Drawer Slide-Up Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white p-6 max-h-[80vh] overflow-y-auto rounded-t-xl text-black border-t border-gray-100"
            >
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase">CONSTRAIN STYLES</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tag Categories */}
              <div className="mb-6">
                <h4 className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-3">FRAME SHAPE</h4>
                <div className="flex flex-wrap gap-2">
                  {shapeTags.map((tag) => {
                    const isChecked = activeFilters.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`text-xs px-3.5 py-2 rounded border transition-colors ${
                          isChecked
                            ? 'bg-black text-white border-black font-semibold'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price bands */}
              <div className="mb-6">
                <h4 className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-3">PRICE BAND</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'All', label: 'All prices' },
                    { value: 'Under4k', label: 'Under Rs. 4,000' },
                    { value: '4kTo6k', label: 'Rs. 4,000 - Rs. 6,000' },
                    { value: 'Over6k', label: 'Over Rs. 6,000' },
                  ].map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setPriceRange(tier.value)}
                      className={`text-xs py-2 px-3 border rounded text-center transition-colors ${
                        priceRange === tier.value
                          ? 'bg-black text-white border-black font-semibold'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Polarization switch */}
              <div className="mb-8">
                <h4 className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-3">LENS POLARIZATION</h4>
                <button
                  onClick={() => setPolarizedOnly(!polarizedOnly)}
                  className={`w-full py-2.5 px-4 text-xs border rounded transition-colors text-center font-bold tracking-widest ${
                    polarizedOnly
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-black'
                  }`}
                >
                  {polarizedOnly ? 'POLARIZED FILTER ACTIVE' : 'FILTER FOR POLARIZED ONLY'}
                </button>
              </div>

              {/* Apply action button */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-black text-white py-3.5 text-xs tracking-widest font-bold uppercase hover:bg-zinc-800 transition-colors"
              >
                APPLY FILTERS ({filteredProducts.length} DESIGNS)
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
