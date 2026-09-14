import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveItem: (product: Product) => void;
  onAddToCart: (product: Product, variantId?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveItem,
  onAddToCart,
  onSelectProduct,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden text-black">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Sliding Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-screen max-w-md bg-white flex flex-col justify-between shadow-2xl border-l border-gray-100"
          >
            {/* Header */}
            <div className="px-4 py-6 sm:px-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-black stroke-[1.5] fill-black" />
                <h2 className="text-sm font-bold tracking-[0.25em] uppercase text-gray-900">MY WISHLIST</h2>
                <span className="text-xs text-gray-400 font-semibold">({wishlist.length})</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full focus:outline-none transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Stage */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {wishlist.length > 0 ? (
                <div className="space-y-4">
                  {wishlist.map((product) => {
                    const price = parseInt(product.priceRange.minVariantPrice.amount, 10);
                    return (
                      <div key={product.id} className="flex space-x-4 pb-4 border-b border-gray-50">
                        <div
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 rounded-sm cursor-pointer"
                        >
                          <img
                            src={product.images[0]?.url}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase line-clamp-1">{product.title}</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase">{product.productType}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-black">Rs. {price.toLocaleString()}</span>
                            
                            <div className="flex items-center space-x-2">
                              {/* Quick add defaults to first variant */}
                              <button
                                onClick={() => {
                                  onAddToCart(product, product.variants[0]?.id);
                                  onClose();
                                }}
                                className="p-1.5 border border-black hover:bg-black hover:text-white rounded text-[10px] tracking-widest font-extrabold uppercase transition-all duration-300 flex items-center space-x-1"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">ADD</span>
                              </button>
                              
                              <button
                                onClick={() => onRemoveItem(product)}
                                className="text-gray-300 hover:text-red-500 p-1.5 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 text-gray-400">
                  <Heart className="w-12 h-12 stroke-[1] mb-4 text-gray-300" />
                  <p className="text-sm font-light uppercase tracking-widest">WISHLIST IS EMPTY</p>
                  <p className="text-xs text-gray-400 font-light mt-2 max-w-[200px] leading-relaxed">
                    Tap the heart icon on any design to curate your personal style wishlist.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 border border-black hover:bg-black hover:text-white text-black text-[10px] tracking-widest uppercase font-semibold py-2.5 px-6 rounded-sm transition-all duration-300"
                  >
                    EXPLORE DESIGNS
                  </button>
                </div>
              )}
            </div>

            {/* Bottom panel */}
            {wishlist.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => {
                    // Quick add all items to cart
                    wishlist.forEach((item) => onAddToCart(item, item.variants[0]?.id));
                    onClose();
                  }}
                  className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] font-bold hover:bg-zinc-800 transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD ALL TO BAG</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
