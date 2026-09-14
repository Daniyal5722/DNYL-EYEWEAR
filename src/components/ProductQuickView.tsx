import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant } from '../types';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
}

export default function ProductQuickView({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductQuickViewProps) {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

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
    onAddToCart(product, selectedVariant.id);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl flex flex-col md:flex-row z-10 text-black border border-gray-100"
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-20 focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Dynamic Gallery */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between border-r border-gray-100">
            <div className="relative aspect-[1/1] overflow-hidden bg-gray-50 rounded-md">
              <img
                src={product.images[activeImageIndex]?.url || 'https://picsum.photos/seed/test/600/600'}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold tracking-widest px-2 py-1 uppercase rounded-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Controls */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded border flex-shrink-0 overflow-hidden bg-gray-50 focus:outline-none ${
                      activeImageIndex === idx ? 'border-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <img src={img.url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Eyewear Styling Config */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div className="pr-4">
              <span className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase">{product.productType || 'EYEWEAR'}</span>
              <h2 className="text-xl font-bold tracking-wider text-gray-900 mt-1 uppercase leading-tight">{product.title}</h2>

              {/* Price Row */}
              <div className="flex items-baseline space-x-3 mt-3">
                <span className="text-lg font-bold text-black tracking-wider">Rs. {price.toLocaleString()}</span>
                {comparePrice && (
                  <span className="text-xs line-through text-gray-400 tracking-wider">Rs. {comparePrice.toLocaleString()}</span>
                )}
              </div>

              {/* Tagline/Short Description */}
              <p className="text-xs text-gray-500 font-light leading-relaxed mt-4 border-t border-gray-100 pt-4">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants.length > 1 && (
                <div className="mt-6">
                  <span className="text-[10px] tracking-widest font-semibold uppercase text-gray-400 block mb-3">SELECT FRAME STYLE:</span>
                  <div className="flex flex-col space-y-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        className={`text-left text-xs px-3 py-2.5 border rounded-md transition-all tracking-wide flex items-center justify-between focus:outline-none ${
                          selectedVariant.id === v.id
                            ? 'border-black bg-black text-white font-semibold'
                            : 'border-gray-200 hover:border-black hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {v.colorHex && (
                            <span 
                              className="w-3 h-3 rounded-full border border-white/40 shadow-xs inline-block shrink-0" 
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
            </div>

            {/* Checkout & Wishlist Actions */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex space-x-3">
                {/* Main add CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant.availableForSale}
                  className="flex-1 bg-black text-white py-3.5 px-4 text-xs tracking-[0.2em] font-semibold hover:bg-zinc-800 transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{selectedVariant.availableForSale ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
                    </>
                  )}
                </button>

                {/* Heart wishlist */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="p-3.5 border border-gray-200 hover:border-black rounded-md focus:outline-none transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'text-gray-700'}`} />
                </button>
              </div>

              {/* Short Trust banner */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4 px-1">
                <span>Free Insured Shipping</span>
                <span>•</span>
                <span>Cash on Delivery</span>
                <span>•</span>
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
