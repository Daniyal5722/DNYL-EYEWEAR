import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, qty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  products,
  onSelectProduct,
  whatsappNumber,
}: CartDrawerProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = parseInt(item.variant.price.amount, 10);
    return sum + price * item.quantity;
  }, 0);

  // Free shipping cap in PKR (e.g. Rs. 5000)
  const shippingThreshold = 5000;
  const deliveryFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + deliveryFee;

  // Curated cross-sells based on items NOT already in cart
  const crossSells = products
    .filter((p) => !cart.some((item) => item.product.id === p.id))
    .slice(0, 2);

  const handleCheckout = async () => {
    if (!cart.length) return;
    setCheckoutLoading(true);

    try {
      // Map line items
      const lineItems = cart.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems }),
      });

      if (!res.ok) {
        throw new Error('Checkout API failed');
      }

      const data = await res.json();
      if (data.url) {
        // Redirect securely to checkout
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Failover directly to WhatsApp
      const msg = `*DNYL Order Checkout*:\n` + cart.map((item, idx) => `${idx + 1}. ${item.product.title} (${item.variant.title}) x ${item.quantity}`).join('\n');
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    } finally {
      setCheckoutLoading(false);
    }
  };

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
                <ShoppingBag className="w-5 h-5 text-black stroke-[1.5]" />
                <h2 className="text-sm font-bold tracking-[0.25em] uppercase text-gray-900">SHOPPING BAG</h2>
                <span className="text-xs text-gray-400 font-semibold">({cart.length})</span>
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
              
              {/* Delivery Promotion Gauge */}
              {subtotal > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                  {subtotal >= shippingThreshold ? (
                    <p className="text-[10px] tracking-wider text-emerald-600 font-semibold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1.5" /> YOU QUALIFY FOR FREE NATIONWIDE EXPRESS DELIVERY
                    </p>
                  ) : (
                    <p className="text-[10px] tracking-wider text-gray-500 font-light">
                      ADD <span className="font-bold text-black">Rs. {(shippingThreshold - subtotal).toLocaleString()}</span> MORE FOR <span className="font-bold text-black">FREE SHIPPING</span>
                    </p>
                  )}
                  {/* Visual threshold progress bar */}
                  <div className="h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {cart.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const price = parseInt(item.variant.price.amount, 10);
                      return (
                        <div key={item.id} className="flex space-x-4 pb-4 border-b border-gray-50">
                          <div className="w-20 h-20 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 rounded-sm">
                            <img
                              src={item.product.images[0]?.url}
                              alt={item.product.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase line-clamp-1">{item.product.title}</h3>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase line-clamp-1">{item.variant.title}</p>
                            </div>

                            <div className="flex items-center justify-between">
                              {/* Quantity Control block */}
                              <div className="flex items-center border border-gray-100 rounded-sm bg-gray-50">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 px-2 text-gray-500 hover:text-black focus:outline-none"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[10px] px-2 font-bold tracking-widest text-black">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 px-2 text-gray-500 hover:text-black focus:outline-none"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <div className="flex items-center space-x-3">
                                <span className="text-xs font-bold text-black">Rs. {(price * item.quantity).toLocaleString()}</span>
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-gray-300 hover:text-red-500 p-1 transition-colors"
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

                  {/* Curated Cross Sells */}
                  {crossSells.length > 0 && (
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-[10px] tracking-[0.2em] text-gray-400 font-semibold uppercase mb-4">YOU MAY ALSO LIKE</h4>
                      <div className="space-y-3">
                        {crossSells.map((crossProduct) => {
                          const crossPrice = parseInt(crossProduct.priceRange.minVariantPrice.amount, 10);
                          return (
                            <div
                              key={crossProduct.id}
                              onClick={() => {
                                onSelectProduct(crossProduct);
                                onClose();
                              }}
                              className="flex items-center justify-between border border-gray-50 p-2.5 bg-gray-50/50 hover:bg-gray-50 cursor-pointer rounded-sm"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={crossProduct.images[0]?.url}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover rounded-sm bg-gray-50"
                                />
                                <div>
                                  <h5 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{crossProduct.title}</h5>
                                  <p className="text-[9px] text-gray-500 font-semibold">Rs. {crossPrice.toLocaleString()}</p>
                                </div>
                              </div>
                              <span className="text-[9px] tracking-widest text-black underline font-bold group-hover:no-underline">VIEW</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 text-gray-400">
                  <ShoppingBag className="w-12 h-12 stroke-[1] mb-4 text-gray-300" />
                  <p className="text-sm font-light uppercase tracking-widest">YOUR BAG IS EMPTY</p>
                  <p className="text-xs text-gray-400 font-light mt-2 max-w-[200px] leading-relaxed">
                    Your cart is waiting for something stylish.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 border border-black hover:bg-black hover:text-white text-black text-[10px] tracking-widest uppercase font-semibold py-2.5 px-6 rounded-sm transition-all duration-300"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              )}
            </div>

            {/* Calculations and Actions Footer */}
            {cart.length > 0 && (
              <div className="px-4 py-6 sm:px-6 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>BAG SUBTOTAL</span>
                    <span className="font-semibold text-black">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>NATIONWIDE DELIVERY</span>
                    <span className="font-semibold text-black">
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-3 text-black">
                    <span>ESTIMATED TOTAL</span>
                    <span className="tracking-wider">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-[9px] text-gray-400 mt-3 font-light text-center uppercase">
                  Cash on Delivery and Free Insured Nationwide Shipping applied
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-black text-white py-4 mt-4 text-xs tracking-[0.25em] font-bold hover:bg-zinc-800 transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {checkoutLoading ? (
                    <span className="animate-pulse">REDIRECTING TO CHECKOUT...</span>
                  ) : (
                    <>
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
