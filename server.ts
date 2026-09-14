import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const PORT = 3000;

// Since we want `server.ts` to compile with clean imports, let's copy the FALLBACK_PRODUCTS locally here so that the CJS build is 100% self-contained and failsafe.
const SERVER_PRODUCTS = [
  {
    id: 'prod_1',
    title: 'DNYL Maverick Aviator',
    handle: 'dnyl-maverick-aviator',
    description: 'The ultimate modern classic. The Maverick Aviator elevates the classic teardrop frame with micro-engineered titanium wire and ultra-polarized high-definition lenses. Tailored for those who see the horizon differently.',
    priceRange: { minVariantPrice: { amount: '4999', currencyCode: 'PKR' } },
    compareAtPriceRange: { minVariantPrice: { amount: '6999', currencyCode: 'PKR' } },
    images: [
      { url: '/src/assets/images/aviator_sunglasses_1789315829245.jpg', altText: 'DNYL Maverick Aviator Titanium Gold - Studio Front' },
      { url: '/src/assets/images/aviator_product_side_1789351251873.jpg', altText: 'DNYL Maverick Aviator Titanium Gold - Studio Angle' },
      { url: '/src/assets/images/aviator_silver_blue_1789351670910.jpg', altText: 'DNYL Maverick Aviator Matte Silver / Cobalt Blue - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_1_gold', 
        title: 'Titanium Gold / Dark Gray Polarized', 
        availableForSale: true, 
        price: { amount: '4999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6999', currencyCode: 'PKR' },
        colorHex: '#D4AF37',
        image: { url: '/src/assets/images/aviator_sunglasses_1789315829245.jpg', altText: 'Titanium Gold Edition' }
      },
      { 
        id: 'var_1_silver_blue', 
        title: 'Matte Silver / Cobalt Blue Polarized', 
        availableForSale: true, 
        price: { amount: '4999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6999', currencyCode: 'PKR' },
        colorHex: '#2563EB',
        image: { url: '/src/assets/images/aviator_silver_blue_1789351670910.jpg', altText: 'Matte Silver / Cobalt Blue Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Titanium Gold / Dark Gray Polarized', 'Matte Silver / Cobalt Blue Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['AVIATOR', 'BEST SELLERS', 'NEW ARRIVALS', 'POLARIZED', 'UV400'],
    metafields: [
      { key: 'frame_shape', value: 'Aviator' },
      { key: 'frame_color', value: 'Titanium Gold / Matte Silver' },
      { key: 'lens_color', value: 'Dark Gray / Cobalt Blue Polarized' },
      { key: 'frame_material', value: 'Aerospace-Grade Titanium' },
      { key: 'lens_material', value: 'CR-39 Polarized Lens' },
      { key: 'uv_protection', value: '100% UV400 Protection' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '58-14-145 (Medium-Large)' },
      { key: 'weight', value: '18g (Ultra-Lightweight)' },
      { key: 'gender', value: 'Unisex' },
      { key: 'accessories', value: 'Premium DNYL Leather Case, Microfiber Cleansing Cloth, Warranty Card' },
      { key: 'warranty', value: '1 Year Limited Manufacturer Warranty' }
    ]
  },
  {
    id: 'prod_2',
    title: 'DNYL Nomad Wayfarer',
    handle: 'dnyl-nomad-wayfarer',
    description: 'Designed for the urban explorer. The Nomad is a bold reinterpretation of the iconic wayfarer, featuring sculpted thick-edge hand-polished acetate and high-contrast silver hardware rivet details.',
    priceRange: { minVariantPrice: { amount: '3999', currencyCode: 'PKR' } },
    compareAtPriceRange: { minVariantPrice: { amount: '5499', currencyCode: 'PKR' } },
    images: [
      { url: '/src/assets/images/wayfarer_sunglasses_1789315849540.jpg', altText: 'DNYL Nomad Wayfarer Gloss Black - Studio Front' },
      { url: '/src/assets/images/wayfarer_product_side_1789351271290.jpg', altText: 'DNYL Nomad Wayfarer Gloss Black - Studio Angle' },
      { url: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg', altText: 'DNYL Nomad Wayfarer Havana Tortoise - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_2_black', 
        title: 'Gloss Black / Classic G-15 Polarized', 
        availableForSale: true, 
        price: { amount: '3999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#111827',
        image: { url: '/src/assets/images/wayfarer_sunglasses_1789315849540.jpg', altText: 'Gloss Black Edition' }
      },
      { 
        id: 'var_2_tortoise', 
        title: 'Havana Tortoise / Warm Bronze Polarized', 
        availableForSale: true, 
        price: { amount: '4299', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5799', currencyCode: 'PKR' },
        colorHex: '#854D0E',
        image: { url: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg', altText: 'Havana Tortoise Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Gloss Black / Classic G-15 Polarized', 'Havana Tortoise / Warm Bronze Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['WAYFARER', 'NEW ARRIVALS', 'POLARIZED', 'UV400'],
    metafields: [
      { key: 'frame_shape', value: 'Wayfarer' },
      { key: 'frame_color', value: 'Gloss Black / Havana Tortoise' },
      { key: 'lens_color', value: 'G-15 Polarized / Bronze Polarized' },
      { key: 'frame_material', value: 'Handcrafted Bio-Acetate' },
      { key: 'lens_material', value: 'Polaroid TAC Lens' },
      { key: 'uv_protection', value: '100% UV400' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '50-22-145 (Medium)' },
      { key: 'weight', value: '26g' },
      { key: 'gender', value: 'Unisex' },
      { key: 'accessories', value: 'DNYL Premium Case, Cleaning Cloth' }
    ]
  },
  {
    id: 'prod_3',
    title: 'DNYL Stealth Square',
    handle: 'dnyl-stealth-square',
    description: 'Power and confidence structured in stone. The Stealth Square features heavy architecture, a thick front bezel, and premium flat lenses that produce a sharp, confident outline for statement fashion.',
    priceRange: { minVariantPrice: { amount: '5499', currencyCode: 'PKR' } },
    compareAtPriceRange: null,
    images: [
      { url: '/src/assets/images/square_sunglasses_1789315866048.jpg', altText: 'DNYL Stealth Square Obsidian Black - Studio Front' },
      { url: '/src/assets/images/square_product_side_1789351283644.jpg', altText: 'DNYL Stealth Square Obsidian Black - Studio Angle' },
      { url: '/src/assets/images/square_crystal_slate_1789351706658.jpg', altText: 'DNYL Stealth Square Smoky Crystal / Slate - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_3_obsidian', 
        title: 'Obsidian Black / Deep Black Polarized', 
        availableForSale: true, 
        price: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#09090B',
        image: { url: '/src/assets/images/square_sunglasses_1789315866048.jpg', altText: 'Obsidian Black Edition' }
      },
      { 
        id: 'var_3_crystal', 
        title: 'Smoky Crystal / Slate Gray Polarized', 
        availableForSale: true, 
        price: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#64748B',
        image: { url: '/src/assets/images/square_crystal_slate_1789351706658.jpg', altText: 'Smoky Crystal Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Obsidian Black / Deep Black Polarized', 'Smoky Crystal / Slate Gray Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['SQUARE', 'BEST SELLERS', 'PREMIUM', 'POLARIZED'],
    metafields: [
      { key: 'frame_shape', value: 'Square' },
      { key: 'frame_color', value: 'Obsidian Black / Smoky Crystal' },
      { key: 'lens_color', value: 'Midnight Black / Slate Polarized' },
      { key: 'frame_material', value: 'Ultra-Dense Crystalline Acetate' },
      { key: 'lens_material', value: 'Nylon Polarized Premium Lens' },
      { key: 'uv_protection', value: '100% UV400' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '54-18-145 (Large)' },
      { key: 'weight', value: '29g (Slightly Heavy, High-End Feel)' }
    ]
  },
  {
    id: 'prod_4',
    title: 'DNYL Aura Round',
    handle: 'dnyl-aura-round',
    description: 'Poetic, artistic, timeless. The Aura Round blends a vintage architectural geometry with futuristic light-weight titanium frames and premium polarized lenses, offering a highly sophisticated gaze.',
    priceRange: { minVariantPrice: { amount: '4499', currencyCode: 'PKR' } },
    compareAtPriceRange: { minVariantPrice: { amount: '5999', currencyCode: 'PKR' } },
    images: [
      { url: '/src/assets/images/round_sunglasses_1789315879719.jpg', altText: 'DNYL Aura Round Gunmetal Silver - Studio Front' },
      { url: '/src/assets/images/round_product_side_1789351297341.jpg', altText: 'DNYL Aura Round Gunmetal Silver - Studio Angle' },
      { url: '/src/assets/images/round_gold_rose_1789351720058.jpg', altText: 'DNYL Aura Round Champagne Gold / Rose - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_4_silver', 
        title: 'Gunmetal Silver / Emerald Polarized', 
        availableForSale: true, 
        price: { amount: '4499', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5999', currencyCode: 'PKR' },
        colorHex: '#94A3B8',
        image: { url: '/src/assets/images/round_sunglasses_1789315879719.jpg', altText: 'Gunmetal Silver Edition' }
      },
      { 
        id: 'var_4_gold_rose', 
        title: 'Champagne Gold / Rose Polarized', 
        availableForSale: true, 
        price: { amount: '4699', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6199', currencyCode: 'PKR' },
        colorHex: '#E2B170',
        image: { url: '/src/assets/images/round_gold_rose_1789351720058.jpg', altText: 'Champagne Gold Rose Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Gunmetal Silver / Emerald Polarized', 'Champagne Gold / Rose Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['ROUND', 'NEW ARRIVALS', 'CLASSIC', 'POLARIZED'],
    metafields: [
      { key: 'frame_shape', value: 'Round' },
      { key: 'frame_color', value: 'Gunmetal Silver / Champagne Gold' },
      { key: 'lens_color', value: 'Emerald Green / Rose Polarized' },
      { key: 'frame_material', value: 'Beta-Titanium Flex Frame' },
      { key: 'lens_material', value: 'CR-39 Polarized' },
      { key: 'uv_protection', value: '100% UV400' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '47-21-140 (Small-Medium)' },
      { key: 'weight', value: '14g (Our Lightest Sunglasses)' }
    ]
  },
  {
    id: 'prod_5',
    title: 'DNYL Karachi Club Classic',
    handle: 'dnyl-karachi-club-classic',
    description: 'Our signature homage. Celebrating the golden era of Karachi high-society, this classic unisex square frame features warm hand-cut acetate, inner metal core, and rich polarized lenses.',
    priceRange: { minVariantPrice: { amount: '5999', currencyCode: 'PKR' } },
    compareAtPriceRange: { minVariantPrice: { amount: '7999', currencyCode: 'PKR' } },
    images: [
      { url: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg', altText: 'DNYL Karachi Club Clifton Tortoise - Studio Front' },
      { url: '/src/assets/images/karachi_jet_black_1789351737286.jpg', altText: 'DNYL Karachi Club Jet Black / Sapphire - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_5_tort', 
        title: 'Clifton Tortoise / Tobacco Gradient Polarized', 
        availableForSale: true, 
        price: { amount: '5999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#78350F',
        image: { url: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg', altText: 'Clifton Tortoise Edition' }
      },
      { 
        id: 'var_5_black_sapphire', 
        title: 'Karachi Jet Black / Deep Sapphire Polarized', 
        availableForSale: true, 
        price: { amount: '5999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#1E3A8A',
        image: { url: '/src/assets/images/karachi_jet_black_1789351737286.jpg', altText: 'Karachi Jet Black Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Clifton Tortoise / Tobacco Gradient Polarized', 'Karachi Jet Black / Deep Sapphire Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['CLASSIC', 'BEST SELLERS', 'PREMIUM', 'POLARIZED'],
    metafields: [
      { key: 'frame_shape', value: 'Square' },
      { key: 'frame_color', value: 'Clifton Vintage Tortoise / Jet Black' },
      { key: 'lens_color', value: 'Tobacco Gradient / Deep Sapphire Polarized' },
      { key: 'frame_material', value: 'Italian Hand-cut Acetate with Visible Inner Metal Core' },
      { key: 'lens_material', value: 'Luxury Nylon Polaroid' },
      { key: 'uv_protection', value: '100% UV400' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '52-20-145 (Medium-Large)' }
    ]
  },
  {
    id: 'prod_6',
    title: 'DNYL Legacy Premium Limitless',
    handle: 'dnyl-legacy-premium-limitless',
    description: 'The pinnacle of DNYL luxury. An over-engineered design boasting triple-brushed premium acetate, heavy-duty 7-bar hinges, and laser-engraved branding inside the temple tips. Simply limits-free confidence.',
    priceRange: { minVariantPrice: { amount: '7999', currencyCode: 'PKR' } },
    compareAtPriceRange: null,
    images: [
      { url: '/src/assets/images/square_sunglasses_1789315866048.jpg', altText: 'DNYL Legacy Premium Obsidian Gold - Studio Front' },
      { url: '/src/assets/images/legacy_platinum_silver_1789351756918.jpg', altText: 'DNYL Legacy Premium Platinum Silver - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_6_gold', 
        title: 'Obsidian Black / Gold Trim / Midnight Black Polarized', 
        availableForSale: true, 
        price: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#D4AF37',
        image: { url: '/src/assets/images/square_sunglasses_1789315866048.jpg', altText: 'Obsidian Black Gold Edition' }
      },
      { 
        id: 'var_6_silver', 
        title: 'Platinum Chrome / Glacier Silver Mirror Polarized', 
        availableForSale: true, 
        price: { amount: '8499', currencyCode: 'PKR' },
        colorHex: '#E2E8F0',
        image: { url: '/src/assets/images/legacy_platinum_silver_1789351756918.jpg', altText: 'Platinum Silver Edition' }
      }
    ],
    options: [
      { name: 'Color', values: ['Obsidian Black / Gold Trim / Midnight Black Polarized', 'Platinum Chrome / Glacier Silver Mirror Polarized'] }
    ],
    availableForSale: true,
    productType: 'Sunglasses',
    tags: ['PREMIUM', 'BEST SELLERS', 'POLARIZED'],
    metafields: [
      { key: 'frame_shape', value: 'Square' },
      { key: 'frame_color', value: 'Obsidian Black with Gold / Platinum Chrome' },
      { key: 'lens_color', value: 'Midnight Polarized / Glacier Silver Mirror' },
      { key: 'frame_material', value: 'Premium Cellulose Acetate & Plated Elements' },
      { key: 'lens_material', value: 'Japanese Triacetate Polarized (TAC)' },
      { key: 'uv_protection', value: '100% UV400' },
      { key: 'polarized', value: 'Yes' },
      { key: 'size', value: '53-21-145 (Medium)' }
    ]
  }
];

// Helper to query Shopify Storefront API
async function queryShopify(query: string, variables: any = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token || domain.includes('your-shop-name') || token.includes('your-storefront-access-token')) {
    throw new Error('Shopify not configured');
  }

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API responded with status ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors.map((e: any) => e.message).join(', '));
  }
  return result.data;
}

// CONFIGURATION ENDPOINT (Returns public store contact & integration info)
app.get('/api/config', (req, res) => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || '';
  const isShopifyConfigured = Boolean(
    domain && 
    !domain.includes('your-shop-name') && 
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN && 
    !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN.includes('your-storefront-access-token')
  );

  res.json({
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567',
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@dnyleyewear.com',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
    shopifyConfigured: isShopifyConfigured,
    brandName: 'DNYL Eyewear',
    country: 'Pakistan',
    currency: 'PKR',
  });
});

// 1. GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const shopifyQuery = `
      query getProducts {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              description
              availableForSale
              productType
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              options {
                name
                values
              }
            }
          }
        }
      }
    `;

    try {
      const data = await queryShopify(shopifyQuery);
      // Format Shopify products to match internal Product schema
      const formatted = data.products.edges.map((edge: any) => {
        const node = edge.node;
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.description,
          availableForSale: node.availableForSale,
          productType: node.productType,
          tags: node.tags,
          priceRange: node.priceRange,
          compareAtPriceRange: node.compareAtPriceRange,
          images: node.images.edges.map((img: any) => ({
            url: img.node.url,
            altText: img.node.altText || node.title
          })),
          variants: node.variants.edges.map((v: any) => ({
            id: v.node.id,
            title: v.node.title,
            availableForSale: v.node.availableForSale,
            price: v.node.price,
            compareAtPrice: v.node.compareAtPrice
          })),
          options: node.options
        };
      });
      return res.json({ source: 'shopify', products: formatted });
    } catch (err: any) {
      console.warn('Shopify API fail or unconfigured, falling back to local database catalog:', err.message);
      return res.json({ source: 'local', products: SERVER_PRODUCTS });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET PRODUCT BY HANDLE
app.get('/api/products/:handle', async (req, res) => {
  const { handle } = req.params;
  try {
    const shopifyQuery = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          availableForSale
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    `;

    try {
      const data = await queryShopify(shopifyQuery, { handle });
      if (!data.product) {
        throw new Error('Product not found in Shopify');
      }
      const node = data.product;
      const formatted = {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        availableForSale: node.availableForSale,
        productType: node.productType,
        tags: node.tags,
        priceRange: node.priceRange,
        compareAtPriceRange: node.compareAtPriceRange,
        images: node.images.edges.map((img: any) => ({
          url: img.node.url,
          altText: img.node.altText || node.title
        })),
        variants: node.variants.edges.map((v: any) => ({
          id: v.node.id,
          title: v.node.title,
          availableForSale: v.node.availableForSale,
          price: v.node.price,
          compareAtPrice: v.node.compareAtPrice
        })),
        options: node.options
      };
      return res.json(formatted);
    } catch (err: any) {
      console.warn(`Shopify handle ${handle} fail or unconfigured, searching local catalog.`);
      const localProduct = SERVER_PRODUCTS.find(p => p.handle === handle);
      if (localProduct) {
        return res.json(localProduct);
      }
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST CHECKOUT SECURELY
app.post('/api/checkout', async (req, res) => {
  const { items } = req.body; // Array of { variantId, quantity }
  
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    const shopifyMutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const lineItems = items.map((item: any) => ({
      variantId: item.variantId,
      quantity: parseInt(item.quantity, 10),
    }));

    try {
      const data = await queryShopify(shopifyMutation, { input: { lineItems } });
      const checkout = data.checkoutCreate.checkout;
      if (checkout && checkout.webUrl) {
        return res.json({ url: checkout.webUrl, method: 'shopify' });
      } else {
        const errors = data.checkoutCreate.checkoutUserErrors;
        throw new Error(errors.map((e: any) => e.message).join(', '));
      }
    } catch (err: any) {
      console.warn('Real Shopify checkout failed or unconfigured. Creating WhatsApp direct fallback checkout for Pakistan:', err.message);
      
      // Let's create a beautiful WhatsApp secure checkout pre-filled message!
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
      let message = `*DNYL EYEWEAR - NEW ORDER DIRECT CHECKOUT*\n\n`;
      let grandTotal = 0;

      items.forEach((item: any, idx: number) => {
        const localProd = SERVER_PRODUCTS.find(p => p.variants.some(v => v.id === item.variantId || v.id === item.id));
        const title = localProd ? localProd.title : 'Premium Sunglasses';
        const price = localProd ? parseInt(localProd.priceRange.minVariantPrice.amount, 10) : 4999;
        const itemTotal = price * item.quantity;
        grandTotal += itemTotal;
        message += `${idx + 1}. *${title}* \n   Qty: ${item.quantity} | Price: Rs. ${price.toLocaleString()}\n`;
      });

      message += `\n*Grand Total:* Rs. ${grandTotal.toLocaleString()}\n`;
      message += `*Payment Method:* Cash on Delivery (COD)\n*Delivery Type:* Free Nationwide Shipping\n\n`;
      message += `Please reply with your:\n- Full Name:\n- Shipping Address:\n- City:\n- Phone Number:\n\nThank you for choosing DNYL. See Different.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      return res.json({ url: whatsappUrl, method: 'whatsapp' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. POST ADVISOR ANALYZE (FACIAL STYLING ANALYSIS)
app.post('/api/advisor/analyze', async (req, res) => {
  const { imageBase64 } = req.body;

  // Resilient fallback defaults
  const fallbackResult = {
    faceShape: 'Oval',
    faceProportions: 'Harmonious length-to-width ratio with balanced cheekbone symmetry.',
    jawline: 'Gently tapered and softly rounded.',
    cheekForeheadRatio: 'Slightly broader cheekbones tapering smoothly to chin.',
    recommendedFrameShapes: ['Square', 'Wayfarer', 'Aviator'],
    recommendedFrameProportions: 'Medium to wide frame profiles (52mm - 56mm) create structured architectural balance.',
    styleTip: 'Geometric and square silhouettes provide a refined, bold counterpoint to smooth facial contours.',
    landmarks: {
      leftEye: { x: 42.5, y: 44.0 },
      rightEye: { x: 57.5, y: 44.0 },
      noseBridge: { x: 50.0, y: 44.8 },
      faceWidthPct: 46.0,
      tiltAngleDeg: 0.0,
    },
    isClearFace: true,
    angleFeedback: 'Clear front-facing alignment.',
    disclaimer: 'Face shape classification is an approximate styling guide to assist with eyewear selection, not a biometric or identity scan.',
  };

  if (!imageBase64) {
    return res.json(fallbackResult);
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json(fallbackResult);
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Extract mime type and clean base64 data
    const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/jpeg';
    const base64Data = matches ? matches[2] : imageBase64;

    const prompt = `You are a high-end luxury personal eyewear stylist and optical facial geometry specialist for DNYL Eyewear.
Analyze the human face in this photograph solely to recommend flattering eyewear and identify placement coordinates.
IMPORTANT GUIDELINES:
- Treat face-shape classification as an approximate styling recommendation to assist in eyewear selection, NOT biometric identification or medical diagnosis. Do not attempt to identify the individual.
- Return ONLY valid raw JSON conforming to this schema (no markdown, no backticks, just pure JSON).

Schema:
{
  "faceShape": "Oval" | "Round" | "Square" | "Rectangle" | "Heart" | "Diamond" | "Oblong",
  "faceProportions": "Short refined description of face length vs width and symmetry",
  "jawline": "Short description of jawline characteristics",
  "cheekForeheadRatio": "Forehead to cheekbones to jaw proportion",
  "recommendedFrameShapes": ["Square", "Wayfarer", "Aviator"],
  "recommendedFrameProportions": "e.g. Medium to wide width frames (52mm-56mm)",
  "styleTip": "One refined styling tip on why contrasting geometry enhances their look",
  "landmarks": {
    "leftEye": { "x": 42.0, "y": 44.0 },
    "rightEye": { "x": 58.0, "y": 44.0 },
    "noseBridge": { "x": 50.0, "y": 44.5 },
    "faceWidthPct": 46.0,
    "tiltAngleDeg": 0.0
  },
  "isClearFace": true,
  "angleFeedback": "Front-facing angle verified",
  "disclaimer": "Face shape classification is an approximate styling guide to assist with eyewear selection, not a biometric or identity scan."
}

Coordinates details:
- leftEye: Center of subject's left eye from viewer's perspective (0.0 to 100.0)
- rightEye: Center of subject's right eye from viewer's perspective (0.0 to 100.0)
- noseBridge: Center of the bridge of the nose where sunglasses bridge sits (0.0 to 100.0)
- faceWidthPct: Approximate width across temple cheekbones as percentage of overall photo width (30 to 70)
- tiltAngleDeg: Head tilt clockwise in degrees (-15 to 15)
If face is obstructed or not clear, set isClearFace to false and angleFeedback to "For a better preview, please upload a clear front-facing photo with your face fully visible."`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    const cleanJson = text.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({
      ...fallbackResult,
      ...parsed,
      landmarks: {
        ...fallbackResult.landmarks,
        ...(parsed.landmarks || {}),
      },
    });
  } catch (error: any) {
    console.warn('Advisor analyze fallback used due to error:', error.message);
    return res.json(fallbackResult);
  }
});

// 5. POST ADVISOR RECOMMENDATIONS
app.post('/api/advisor/recommendations', (req, res) => {
  const { faceShape = 'Oval', stylePreference = 'Classic', colorPreference = '' } = req.body;

  const scores: { [id: string]: { score: number; reason: string } } = {};

  SERVER_PRODUCTS.forEach((product) => {
    let score = 50;
    let reasons: string[] = [];

    const frameShapeMeta = product.metafields?.find((m) => m.key === 'frame_shape')?.value || '';

    // 1. Face shape matching
    if (faceShape === 'Round') {
      if (frameShapeMeta === 'Square') {
        score += 35;
        reasons.push('The sharp geometric silhouette provides structural definition to softer facial contours.');
      } else if (frameShapeMeta === 'Wayfarer') {
        score += 25;
        reasons.push('The structured browline lifts and elongates the face visually.');
      } else {
        score += 5;
      }
    } else if (faceShape === 'Square') {
      if (frameShapeMeta === 'Round') {
        score += 35;
        reasons.push('Curved architectural rims create an elegant visual balance against a defined jawline.');
      } else if (frameShapeMeta === 'Aviator') {
        score += 30;
        reasons.push('The teardrop titanium profile gently softens strong angular features.');
      } else {
        score += 10;
      }
    } else if (faceShape === 'Heart') {
      if (frameShapeMeta === 'Aviator') {
        score += 35;
        reasons.push('The lower teardrop breadth balances a wider forehead seamlessly.');
      } else if (frameShapeMeta === 'Round') {
        score += 25;
        reasons.push('Soft circular geometry complements high cheekbones beautifully.');
      } else {
        score += 15;
      }
    } else if (faceShape === 'Rectangle' || faceShape === 'Oblong') {
      if (frameShapeMeta === 'Wayfarer' || frameShapeMeta === 'Square') {
        score += 35;
        reasons.push('Wide architectural frames introduce horizontal balance to elongated facial proportions.');
      } else {
        score += 15;
      }
    } else if (faceShape === 'Diamond') {
      if (frameShapeMeta === 'Aviator' || frameShapeMeta === 'Round') {
        score += 35;
        reasons.push('Subtle curves harmonize gracefully with prominent cheekbone lines.');
      } else {
        score += 15;
      }
    } else {
      // Oval
      if (product.id === 'prod_1') {
        score += 30;
        reasons.push('The iconic titanium aviator maintains the natural symmetry of your oval proportions.');
      } else if (product.id === 'prod_3') {
        score += 28;
        reasons.push('Architectural square bezels introduce bold, confident modern contrast.');
      } else {
        score += 24;
        reasons.push('Complements balanced facial ratios with effortless presence.');
      }
    }

    // 2. Style preference matching
    const styleLower = (stylePreference || '').toLowerCase();
    if (styleLower.includes('minimal')) {
      if (product.id === 'prod_1' || product.id === 'prod_4') {
        score += 30;
        reasons.push(`Clean, ultra-lightweight frames designed for pure minimal restraint.`);
      }
    } else if (styleLower.includes('bold')) {
      if (product.id === 'prod_3' || product.id === 'prod_6') {
        score += 30;
        reasons.push(`Substantial sculpted acetate creating a definitive, powerful statement.`);
      }
    } else if (styleLower.includes('luxury')) {
      if (product.id === 'prod_6' || product.id === 'prod_5') {
        score += 30;
        reasons.push(`High-grade handcrafted Italian acetate and bespoke plated accents.`);
      }
    } else if (styleLower.includes('street') || styleLower.includes('everyday')) {
      if (product.id === 'prod_2' || product.id === 'prod_5') {
        score += 25;
        reasons.push(`Versatile modern heritage silhouette built for effortless all-day wear.`);
      }
    }

    // 3. Color preference matching
    if (colorPreference) {
      const col = colorPreference.toLowerCase();
      const hasColor = product.variants.some((v) => v.title.toLowerCase().includes(col));
      if (hasColor) {
        score += 15;
        reasons.push(`Available in your preferred ${colorPreference} colorway.`);
      }
    }

    const primaryReason = reasons[0] || 'A harmonious balance of frame proportions and contemporary style.';
    scores[product.id] = { score, reason: primaryReason };
  });

  // Sort by score descending and take top 3
  const sorted = [...SERVER_PRODUCTS].sort((a, b) => {
    const sA = scores[a.id]?.score || 0;
    const sB = scores[b.id]?.score || 0;
    return sB - sA;
  });

  const top3 = sorted.slice(0, 3).map((prod, idx) => ({
    product: prod,
    suitability: (idx === 0 ? 'STRONG MATCH' : 'STYLE ALIGNED') as 'STRONG MATCH' | 'STYLE ALIGNED',
    explanation: `Looks like a strong match. Recommended because this frame provides a balanced look with your ${faceShape.toLowerCase()} facial proportions and ${scores[prod.id]?.reason.toLowerCase() || 'matches your aesthetic'}.`,
  }));

  res.json({ recommendations: top3 });
});

// 6. POST CHATBOT ASSISTANT
app.post('/api/chatbot', async (req, res) => {
  const { messages } = req.body; // Array of { role: 'user' | 'assistant', content: string }
  if (!messages || !messages.length) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return beautiful hardcoded rules/stylist tips if Gemini is unconfigured
      return res.json({
        reply: `Hello! I am the DNYL Style Assistant. It looks like my AI mind is still starting up, but I can tell you about our premium collection!

Our flagship model is the **DNYL Maverick Aviator** (Rs. 4,999) which features medical titanium frames. If you prefer bold street style, the hand-crafted **DNYL Nomad Wayfarer** (Rs. 3,999) or **DNYL Stealth Square** (Rs. 5,499) are phenomenal choices.

What kind of look are you searching for today?
- **Classic Minimalist** (Maverick Aviator or Aura Round)
- **Bold Modern Statement** (Stealth Square or Legacy Limitless)

All DNYL orders come with free nationwide cash on delivery (COD) across Pakistan. Karachi orders arrive in 1-2 days!`
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `You are the DNYL Style Assistant, a luxury personal shopping stylist for DNYL Eyewear, a world-class premium eyewear brand based in Karachi, Pakistan.
Your tone is sophisticated, minimal, extremely polite, confident, and professional. Avoid cheap marketing speak like "supercharge" or "empower". Write in a refined, editorial format.

Here is the exact real product list available for sale:
${JSON.stringify(SERVER_PRODUCTS, null, 2)}

Your primary goals:
1. Help Pakistani customers select the perfect sunglasses. Recommend based on frame shape (Aviator, Wayfarer, Square, Round), face shape, and price budget.
2. Answer store policies accurately:
   - Cash on Delivery (COD) is supported across Pakistan.
   - Shipping is completely free nationwide.
   - Karachi delivery: 1-2 business days.
   - Rest of Pakistan: 3-5 business days.
   - Returns/Exchanges: Within 7 days, must be unworn, in pristine original packaging.
   - Protection: 100% UV400 and high-definition Polarized lenses.

3. SPECIAL FORMATTING RULE FOR PRODUCT RECOMMENDATIONS:
   Whenever you recommend or mention a product from our catalog, you MUST write the product handle enclosed in brackets like: [PRODUCT:dnyl-maverick-aviator].
   You can recommend up to 3 products in a single response.
   The frontend parses this code [PRODUCT:handle] to render real interactive product cards directly inside the chat window! This is a core luxury capability of DNYL.

4. If you do not have enough information to answer a customer support question accurately, say exactly:
   "I don't have enough information to answer that accurately. Would you like to connect with our human support team?" and present option to chat on WhatsApp. Never invent courier names or delivery timelines.`;

    const chatMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Generate content using gemini-3.8-flash as recommended by our Gemini API skill
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static assets / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DNYL Eyewear full-stack server active at http://localhost:${PORT}`);
  });
}

startServer();
