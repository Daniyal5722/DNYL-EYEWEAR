import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];

  // Price formatting variables
  const price = parseInt(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount, 10);
  const comparePriceStr = selectedVariant?.compareAtPrice?.amount || product.compareAtPriceRange?.minVariantPrice?.amount;
  const comparePrice = comparePriceStr ? parseInt(comparePriceStr, 10) : null;
  const discountPercent = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const defaultMainImage = product.images[0]?.url || 'https://picsum.photos/seed/dnyl/600/600';
  const secondaryImage = product.images[1]?.url || defaultMainImage; // Swap to secondary on hover if first variant

  // Selected variant image or hover image
  const displayImage = selectedVariant?.image?.url 
    ? (hovered && product.variants.length === 1 ? secondaryImage : selectedVariant.image.url)
    : (hovered ? secondaryImage : defaultMainImage);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product, selectedVariant?.id);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white border border-gray-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelectProduct(product);
      }}
    >
      
      {/* Product Image Stage */}
      <div className="relative aspect-[1/1] overflow-hidden bg-gray-50">
        <motion.img
          key={displayImage}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          src={displayImage}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-black text-white text-[8px] font-semibold tracking-widest px-2 py-1 uppercase rounded-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Overlay Action Buttons (visible on hover on desktop) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          {/* Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 rounded-full shadow-md focus:outline-none"
            aria-label="Quick View details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Quick Add To Cart */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="p-3 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 rounded-full shadow-md focus:outline-none disabled:opacity-50"
            aria-label="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-black hover:bg-white hover:scale-110 transition-all shadow-sm focus:outline-none z-10"
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] transition-all ${
              isWishlisted ? 'fill-red-500 stroke-red-500 scale-110' : 'text-gray-700'
            }`}
          />
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="mb-2">
          <p className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase">{product.productType || 'EYEWEAR'}</p>
          <h3 className="text-xs font-semibold tracking-wider text-gray-900 mt-1 uppercase group-hover:text-black line-clamp-1">
            {product.title}
          </h3>

          {/* Color Swatches if multiple variants exist */}
          {product.variants.length > 1 && (
            <div className="flex items-center space-x-1.5 mt-2">
              {product.variants.map((v, vIdx) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariantIndex(vIdx);
                  }}
                  onMouseEnter={() => setSelectedVariantIndex(vIdx)}
                  title={v.title}
                  className={`w-3.5 h-3.5 rounded-full p-0.5 border transition-all ${
                    selectedVariantIndex === vIdx 
                      ? 'border-black scale-110' 
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  aria-label={`Select ${v.title}`}
                >
                  <span 
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: v.colorHex || '#000000' }}
                  />
                </button>
              ))}
              <span className="text-[9px] text-gray-400 tracking-wider font-light uppercase pl-1">
                {product.variants.length} colours
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          {/* Price Container */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-black tracking-wider">
              Rs. {price.toLocaleString()}
            </span>
            {comparePrice && (
              <span className="text-[10px] line-through text-gray-400 tracking-wider">
                Rs. {comparePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile visible action (Quick Add on bottom) */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="md:hidden p-1.5 text-black hover:bg-gray-100 rounded-md focus:outline-none"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
