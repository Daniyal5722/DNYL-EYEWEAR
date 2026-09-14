import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Truck, Undo, ShieldAlert, Award, Plus, Minus, Check, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant } from '../../types';
import ProductCard from '../ProductCard';
import LightingOverlay from '../LightingOverlay';

interface ProductDetailViewProps {
  product: Product;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, params?: any) => void;
  products: Product[]; // For related products recommendation
}

export default function ProductDetailView({
  product,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  onNavigate,
  products,
}: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'warranty'>('details');
  const [isAdded, setIsAdded] = useState(false);
  const [isDirectBuying, setIsDirectBuying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  // Specifications metadata
  const metadata = product.metafields || [];

  // Reset states on product change
  useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setActiveImageIndex(0);
    setQuantity(1);
  }, [product]);

  const price = parseInt(selectedVariant.price.amount, 10);
  const comparePrice = selectedVariant.compareAtPrice ? parseInt(selectedVariant.compareAtPrice.amount, 10) : null;
  const discountPercent = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.image?.url) {
      const idx = product.images.findIndex((img) => img.url === v.image?.url);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  };

  const handleAddToCart = () => {
    // Add custom quantity support
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedVariant.id);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    setIsDirectBuying(true);
    onAddToCart(product, selectedVariant.id);
    // Directly simulate secure checkout trigger or open cart drawer
    setTimeout(() => {
      setIsDirectBuying(false);
      onNavigate('cart'); // Let's trigger a cart view route or let the cart drawer open
    }, 500);
  };

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Recommendations of similar shapes/styles
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.tags.some((t) => product.tags.includes(t)))
    .slice(0, 4);

  return (
    <div id="product-detail-stage" className="bg-white text-black py-12 transition-all duration-300 relative overflow-hidden">
      {/* Soft studio lighting overlay for premium product highlight */}
      <LightingOverlay intensity="subtle" position="absolute" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Breadcrumbs */}
        <nav className="flex text-[10px] tracking-widest text-gray-400 uppercase font-semibold mb-10 space-x-2">
          <button onClick={() => onNavigate('home')} className="hover:text-black">HOME</button>
          <span>/</span>
          <button onClick={() => onNavigate('shop')} className="hover:text-black">COLLECTION</button>
          <span>/</span>
          <span className="text-black font-extrabold">{product.title}</span>
        </nav>

        {/* Major Columns Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* Left Column: Multi-Image Showcase */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Frame with Interactive Precision Zoom */}
            <div 
              className="relative aspect-[1/1] bg-zinc-50 overflow-hidden border border-gray-100 rounded-sm cursor-crosshair group select-none"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[activeImageIndex]?.url}
                alt={product.title}
                referrerPolicy="no-referrer"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                }}
                className="w-full h-full object-cover object-center transition-transform duration-150 ease-out"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-black text-white text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-xs z-10 pointer-events-none">
                  {discountPercent}% OFF
                </span>
              )}
              {/* Inspection Magnifier Badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[8.5px] font-mono tracking-widest px-2.5 py-1 uppercase rounded-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {isZoomed ? '2.2X OPTICAL ZOOM' : 'HOVER TO INSPECT'}
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 bg-gray-50 overflow-hidden rounded border flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-black scale-[0.98]' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <img src={img.url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Style Specifications & Buy CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Product Header */}
              <div>
                <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase">{product.productType || 'EYEWEAR'}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-black uppercase mt-1 leading-tight font-display">
                  {product.title}
                </h1>
                
                {/* Price block */}
                <div className="flex items-baseline space-x-3 mt-4">
                  <span className="text-xl font-bold tracking-wider text-black">
                    Rs. {price.toLocaleString()}
                  </span>
                  {comparePrice && (
                    <span className="text-sm line-through text-gray-400 tracking-wider">
                      Rs. {comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Tagline short desc */}
              <p className="text-xs text-gray-500 font-light leading-relaxed border-t border-gray-100 pt-6">
                {product.description}
              </p>

              {/* Variant Selections */}
              {product.variants.length > 1 && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-[10px] tracking-widest font-extrabold uppercase text-gray-400 block mb-3">SELECT COLOR / LENS:</span>
                  <div className="space-y-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        className={`w-full text-left text-xs px-4 py-3 border rounded-md transition-all tracking-wide flex items-center justify-between focus:outline-none ${
                          selectedVariant.id === v.id
                            ? 'border-black bg-black text-white font-semibold shadow-sm'
                            : 'border-gray-200 hover:border-black hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {v.colorHex && (
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs inline-block shrink-0" 
                              style={{ backgroundColor: v.colorHex }} 
                            />
                          )}
                          <span>{v.title}</span>
                        </div>
                        {selectedVariant.id === v.id && <Check className="w-4 h-4 ml-2 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector and Wishlist Button row */}
              <div className="pt-4 flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-widest uppercase text-gray-400 font-bold mb-2">QTY:</span>
                  <div className="flex items-center border border-gray-200 rounded-md bg-gray-50/50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 px-3 text-gray-500 hover:text-black focus:outline-none"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs px-3 font-bold text-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 px-3 text-gray-500 hover:text-black focus:outline-none"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end h-full pt-6">
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className={`flex items-center justify-center space-x-2 border py-2.5 px-4 rounded-md text-xs tracking-wider font-semibold focus:outline-none transition-colors w-full ${
                      isWishlisted
                        ? 'border-red-500 text-red-500 hover:bg-red-50/50'
                        : 'border-gray-200 hover:border-black text-gray-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : ''}`} />
                    <span>{isWishlisted ? 'REMOVE WISHLIST' : 'ADD TO WISHLIST'}</span>
                  </button>
                </div>
              </div>

              {/* Master Actions Buttons Box */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                
                {/* Main Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.availableForSale}
                  className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] font-bold hover:bg-zinc-800 transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{selectedVariant.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                    </>
                  )}
                </button>

                {/* Buy Now direct path */}
                <button
                  onClick={handleBuyNow}
                  disabled={isDirectBuying || !selectedVariant.availableForSale}
                  className="w-full border border-black text-black py-4 text-xs tracking-[0.25em] font-bold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-50"
                >
                  {isDirectBuying ? (
                    <span className="animate-pulse">LOADING CHECKOUT BAG...</span>
                  ) : (
                    <span>BUY IT NOW</span>
                  )}
                </button>
              </div>

            </div>

            {/* Spec / Info Accordions Segment */}
            <div className="mt-12 border-t border-gray-100 pt-6">
              
              {/* Tab headers */}
              <div className="flex border-b border-gray-100 pb-3 space-x-6 text-[10px] tracking-widest font-extrabold text-gray-400">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 border-b-2 hover:text-black uppercase ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent'}`}
                >
                  SPECS
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 border-b-2 hover:text-black uppercase ${activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent'}`}
                >
                  SHIPPING
                </button>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className={`pb-1 border-b-2 hover:text-black uppercase ${activeTab === 'warranty' ? 'border-black text-black' : 'border-transparent'}`}
                >
                  WARRANTY
                </button>
              </div>

              {/* Tab Panels */}
              <div className="py-4 text-xs leading-relaxed font-light text-gray-600">
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                    {metadata.length > 0 ? (
                      metadata.map((meta, idx) => (
                        <div key={idx} className="border-b border-gray-50 pb-1.5">
                          <span className="text-[9px] tracking-wider text-gray-400 font-bold block uppercase">{meta.key.replace('_', ' ')}</span>
                          <span className="text-gray-800 font-medium">{meta.value}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="border-b border-gray-50 pb-1.5">
                          <span className="text-[9px] tracking-wider text-gray-400 font-bold block uppercase">Lens Type</span>
                          <span className="text-gray-800 font-medium">Polarized HD CR-39</span>
                        </div>
                        <div className="border-b border-gray-50 pb-1.5">
                          <span className="text-[9px] tracking-wider text-gray-400 font-bold block uppercase">UV Protection</span>
                          <span className="text-gray-800 font-medium">100% UV400 Protection</span>
                        </div>
                        <div className="border-b border-gray-50 pb-1.5">
                          <span className="text-[9px] tracking-wider text-gray-400 font-bold block uppercase">Material</span>
                          <span className="text-gray-800 font-medium">Premium Handcrafted Acetate</span>
                        </div>
                        <div className="border-b border-gray-50 pb-1.5">
                          <span className="text-[9px] tracking-wider text-gray-400 font-bold block uppercase">Accessories</span>
                          <span className="text-gray-800 font-medium">Leather Hardcase & Microfiber Cloth</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-black font-semibold">
                      <Truck className="w-4 h-4 text-gray-600" />
                      <span>FREE INSURED DELIVERY ACROSS PAKISTAN</span>
                    </div>
                    <p>Free nationwide shipping is automatically applied to all orders with zero minimum requirement.</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Karachi Delivery: 1-2 Business Days</li>
                      <li>Islamabad, Lahore & Other Cities: 3-5 Business Days</li>
                      <li>Full order tracking is sent via email and SMS immediately upon pickup.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-black font-semibold">
                      <Award className="w-4 h-4 text-gray-600" />
                      <span>1 YEAR DNYL CERTIFIED WARRANTY</span>
                    </div>
                    <p>Your DNYL Eyewear includes a 1-year limited manufacturer warranty. This covers any production defects in frame structure, solder points, or hinge integrity.</p>
                    <p>We also support a <span className="font-semibold text-black">7-Day Free Returns or Size Exchange Policy</span> if unworn and returned in original premium packaging box.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS RECOMMENDATION SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-100">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-gray-400 font-bold uppercase block mb-1">OPTICAL COMPATIBILITIES</span>
                <h2 className="text-2xl font-bold tracking-[0.15em] uppercase text-black font-display">YOU MAY ALSO LIKE</h2>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="text-xs tracking-wider font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-colors"
              >
                EXPLORE ALL
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
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
        )}

      </div>
    </div>
  );
}
