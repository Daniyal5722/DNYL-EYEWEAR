import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import ProductQuickView from './components/ProductQuickView';
import LightingOverlay from './components/LightingOverlay';

// Import Views
import HomeView from './components/views/HomeView';
import ShopView from './components/views/ShopView';
import ProductDetailView from './components/views/ProductDetailView';
import {
  AboutView,
  ContactView,
  FAQView,
  ShippingView,
  ReturnsView,
  TrackOrderView,
  BlogView,
  BlogDetailView,
  AccountView,
} from './components/views/EditorialViews';

import { Product, CartItem } from './types';
import { FALLBACK_PRODUCTS } from './data';

export default function App() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Navigation Routing States
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<any>({});

  // Overlay Drawer States
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Fallback variables
  const whatsappNumber = '923001234567';

  // 1. Fetch live products from the server-side Shopify/local catalog API on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn('API error fetching products, using client-side high-fidelity fallback catalogs:', err);
      }
    }
    fetchProducts();
  }, []);

  // 2. Load Cart and Wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dnyl_eyewear_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from storage', e);
      }
    }

    const savedWishlist = localStorage.getItem('dnyl_eyewear_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error parsing wishlist from storage', e);
      }
    }
  }, []);

  // 3. Save Cart to localStorage whenever it updates
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('dnyl_eyewear_cart', JSON.stringify(updatedCart));
  };

  // 4. Save Wishlist to localStorage whenever it updates
  const saveWishlistToStorage = (updatedWishlist: Product[]) => {
    setWishlist(updatedWishlist);
    localStorage.setItem('dnyl_eyewear_wishlist', JSON.stringify(updatedWishlist));
  };

  // 5. Navigate to specific section and scroll viewport to top (Crucial SPA standard)
  const handleNavigate = (view: string, params: any = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Add/Update Item in Cart
  const handleAddToCart = (product: Product, variantId?: string) => {
    // Determine target variant (default to first variant if none selected)
    const targetVariant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    if (!targetVariant) return;

    const cartItemId = `${product.id}_${targetVariant.id}`;
    const existingIndex = cart.findIndex((item) => item.id === cartItemId);

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        id: cartItemId,
        product,
        variant: targetVariant,
        quantity: 1,
      });
    }

    saveCartToStorage(updatedCart);
    // Instant micro-interaction feedback: open cart slide-drawer
    setCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    const updatedCart = cart.map((item) => (item.id === cartItemId ? { ...item, quantity: qty } : item));
    saveCartToStorage(updatedCart);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== cartItemId);
    saveCartToStorage(updatedCart);
  };

  // 7. Wishlist Toggles
  const handleToggleWishlist = (product: Product) => {
    const isAlreadyWishlisted = wishlist.some((item) => item.id === product.id);
    let updatedWishlist = [];
    if (isAlreadyWishlisted) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    saveWishlistToStorage(updatedWishlist);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans antialiased selection:bg-black selection:text-white relative">
      {/* Cinematic Studio Lighting Overlay (radial gradient glow with mix-blend-mode: screen) */}
      <LightingOverlay intensity="medium" position="fixed" />
      
      {/* 1. Universal Responsive Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cart={cart}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      {/* 2. Main SPA View Render Router */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
            initialFilter={viewParams?.filter || null}
          />
        )}

        {currentView === 'product-detail' && viewParams?.product && (
          <ProductDetailView
            product={viewParams.product}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
            onNavigate={handleNavigate}
            products={products}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} whatsappNumber={whatsappNumber} />
        )}

        {currentView === 'contact' && (
          <ContactView onNavigate={handleNavigate} whatsappNumber={whatsappNumber} />
        )}

        {currentView === 'faq' && <FAQView />}

        {currentView === 'shipping' && <ShippingView />}

        {currentView === 'returns' && <ReturnsView />}

        {currentView === 'track-order' && <TrackOrderView />}

        {currentView === 'blog' && <BlogView onNavigate={handleNavigate} />}

        {currentView === 'blog-detail' && viewParams?.slug && (
          <BlogDetailView slug={viewParams.slug} onNavigate={handleNavigate} />
        )}

        {currentView === 'account' && (
          <AccountView onNavigate={handleNavigate} whatsappNumber={whatsappNumber} />
        )}

        {/* Catch-all to default to home if details are missing */}
        {currentView === 'product-detail' && !viewParams?.product && (
          <div className="py-24 text-center">
            <p className="text-sm text-gray-500 font-light uppercase tracking-widest">PRODUCT DETAILS UNAVAILABLE</p>
            <button
              onClick={() => handleNavigate('shop')}
              className="mt-4 bg-black text-white px-6 py-2.5 text-xs font-bold tracking-widest uppercase"
            >
              RETURN TO SHOP
            </button>
          </div>
        )}
      </main>

      {/* 3. Universal Footer with newsletter triggers */}
      <Footer onNavigate={handleNavigate} whatsappNumber={whatsappNumber} />

      {/* 4. Overlays, Triggers & Slide-Drawers */}
      
      {/* Search overlay modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
        onNavigate={handleNavigate}
      />

      {/* Slide-in Cart drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        products={products}
        onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
        whatsappNumber={whatsappNumber}
      />

      {/* Wishlist drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveItem={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
      />

      {/* Quick View overlay */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.some((item) => item.id === quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Floating AI Style Assistant (DNYL Chatbot) */}
      <Chatbot
        products={products}
        onSelectProduct={(p) => handleNavigate('product-detail', { product: p })}
        onAddToCart={handleAddToCart}
        whatsappNumber={whatsappNumber}
      />

    </div>
  );
}
