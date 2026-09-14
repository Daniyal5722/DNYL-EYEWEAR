export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  image?: ProductImage;
  colorHex?: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Metafield {
  key: string;
  value: string;
  namespace?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
  } | null;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  availableForSale: boolean;
  productType: string;
  tags: string[];
  metafields?: Metafield[];
}

export interface CartItem {
  id: string; // Unique key for item in cart (usually variantId)
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrderTrackResult {
  orderId: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusLabel: string;
  createdAt: string;
  estimatedDelivery: string;
  courier?: string;
  trackingNumber?: string;
  items: {
    title: string;
    quantity: number;
    price: string;
  }[];
  subtotal: string;
  total: string;
}

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Rectangle' | 'Heart' | 'Diamond' | 'Oblong';

export interface FacialLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  noseBridge: { x: number; y: number };
  faceWidthPct: number;
  tiltAngleDeg: number;
}

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  faceProportions: string;
  jawline: string;
  cheekForeheadRatio: string;
  recommendedFrameShapes: string[];
  recommendedFrameProportions: string;
  styleTip: string;
  landmarks: FacialLandmarks;
  isClearFace: boolean;
  angleFeedback: string;
  disclaimer: string;
}

export interface AdvisorRecommendation {
  product: Product;
  suitability: 'STRONG MATCH' | 'STYLE ALIGNED';
  explanation: string;
}

export interface TryOnAdjustment {
  scale: number;
  xOffset: number;
  yOffset: number;
  rotation: number;
}
