import { Product, BlogPost, FAQItem } from './types';

// High-resolution clean studio product-only asset paths
export const DNYL_ASSETS = {
  hero: '/src/assets/images/square_sunglasses_1789315866048.jpg',
  // Product 1: Maverick Aviator
  aviator: '/src/assets/images/aviator_sunglasses_1789315829245.jpg',
  aviatorSide: '/src/assets/images/aviator_product_side_1789351251873.jpg',
  aviatorSilverBlue: '/src/assets/images/aviator_silver_blue_1789351670910.jpg',
  // Product 2: Nomad Wayfarer
  wayfarer: '/src/assets/images/wayfarer_sunglasses_1789315849540.jpg',
  wayfarerSide: '/src/assets/images/wayfarer_product_side_1789351271290.jpg',
  wayfarerTortoise: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg',
  // Product 3: Stealth Square
  square: '/src/assets/images/square_sunglasses_1789315866048.jpg',
  squareSide: '/src/assets/images/square_product_side_1789351283644.jpg',
  squareCrystalSlate: '/src/assets/images/square_crystal_slate_1789351706658.jpg',
  // Product 4: Aura Round
  round: '/src/assets/images/round_sunglasses_1789315879719.jpg',
  roundSide: '/src/assets/images/round_product_side_1789351297341.jpg',
  roundGoldRose: '/src/assets/images/round_gold_rose_1789351720058.jpg',
  // Product 5: Karachi Club
  karachiTortoise: '/src/assets/images/wayfarer_tortoise_bronze_1789351689505.jpg',
  karachiJetBlack: '/src/assets/images/karachi_jet_black_1789351737286.jpg',
  // Product 6: Legacy Limitless
  legacyObsidianGold: '/src/assets/images/square_sunglasses_1789315866048.jpg',
  legacyPlatinumSilver: '/src/assets/images/legacy_platinum_silver_1789351756918.jpg'
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'DNYL Maverick Aviator',
    handle: 'dnyl-maverick-aviator',
    description: 'The ultimate modern classic. The Maverick Aviator elevates the classic teardrop frame with micro-engineered titanium wire and ultra-polarized high-definition lenses. Tailored for those who see the horizon differently.',
    priceRange: { minVariantPrice: { amount: '4999', currencyCode: 'PKR' } },
    compareAtPriceRange: { minVariantPrice: { amount: '6999', currencyCode: 'PKR' } },
    images: [
      { url: DNYL_ASSETS.aviator, altText: 'DNYL Maverick Aviator Titanium Gold - Studio Front' },
      { url: DNYL_ASSETS.aviatorSide, altText: 'DNYL Maverick Aviator Titanium Gold - Studio Angle' },
      { url: DNYL_ASSETS.aviatorSilverBlue, altText: 'DNYL Maverick Aviator Matte Silver / Cobalt Blue - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_1_gold', 
        title: 'Titanium Gold / Dark Gray Polarized', 
        availableForSale: true, 
        price: { amount: '4999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6999', currencyCode: 'PKR' },
        colorHex: '#D4AF37',
        image: { url: DNYL_ASSETS.aviator, altText: 'Titanium Gold Edition' }
      },
      { 
        id: 'var_1_silver_blue', 
        title: 'Matte Silver / Cobalt Blue Polarized', 
        availableForSale: true, 
        price: { amount: '4999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6999', currencyCode: 'PKR' },
        colorHex: '#2563EB',
        image: { url: DNYL_ASSETS.aviatorSilverBlue, altText: 'Matte Silver / Cobalt Blue Edition' }
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
      { url: DNYL_ASSETS.wayfarer, altText: 'DNYL Nomad Wayfarer Gloss Black - Studio Front' },
      { url: DNYL_ASSETS.wayfarerSide, altText: 'DNYL Nomad Wayfarer Gloss Black - Studio Angle' },
      { url: DNYL_ASSETS.wayfarerTortoise, altText: 'DNYL Nomad Wayfarer Havana Tortoise - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_2_black', 
        title: 'Gloss Black / Classic G-15 Polarized', 
        availableForSale: true, 
        price: { amount: '3999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#111827',
        image: { url: DNYL_ASSETS.wayfarer, altText: 'Gloss Black Edition' }
      },
      { 
        id: 'var_2_tortoise', 
        title: 'Havana Tortoise / Warm Bronze Polarized', 
        availableForSale: true, 
        price: { amount: '4299', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5799', currencyCode: 'PKR' },
        colorHex: '#854D0E',
        image: { url: DNYL_ASSETS.wayfarerTortoise, altText: 'Havana Tortoise Edition' }
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
      { url: DNYL_ASSETS.square, altText: 'DNYL Stealth Square Obsidian Black - Studio Front' },
      { url: DNYL_ASSETS.squareSide, altText: 'DNYL Stealth Square Obsidian Black - Studio Angle' },
      { url: DNYL_ASSETS.squareCrystalSlate, altText: 'DNYL Stealth Square Smoky Crystal / Slate - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_3_obsidian', 
        title: 'Obsidian Black / Deep Black Polarized', 
        availableForSale: true, 
        price: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#09090B',
        image: { url: DNYL_ASSETS.square, altText: 'Obsidian Black Edition' }
      },
      { 
        id: 'var_3_crystal', 
        title: 'Smoky Crystal / Slate Gray Polarized', 
        availableForSale: true, 
        price: { amount: '5499', currencyCode: 'PKR' },
        colorHex: '#64748B',
        image: { url: DNYL_ASSETS.squareCrystalSlate, altText: 'Smoky Crystal Edition' }
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
      { url: DNYL_ASSETS.round, altText: 'DNYL Aura Round Gunmetal Silver - Studio Front' },
      { url: DNYL_ASSETS.roundSide, altText: 'DNYL Aura Round Gunmetal Silver - Studio Angle' },
      { url: DNYL_ASSETS.roundGoldRose, altText: 'DNYL Aura Round Champagne Gold / Rose - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_4_silver', 
        title: 'Gunmetal Silver / Emerald Polarized', 
        availableForSale: true, 
        price: { amount: '4499', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '5999', currencyCode: 'PKR' },
        colorHex: '#94A3B8',
        image: { url: DNYL_ASSETS.round, altText: 'Gunmetal Silver Edition' }
      },
      { 
        id: 'var_4_gold_rose', 
        title: 'Champagne Gold / Rose Polarized', 
        availableForSale: true, 
        price: { amount: '4699', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '6199', currencyCode: 'PKR' },
        colorHex: '#E2B170',
        image: { url: DNYL_ASSETS.roundGoldRose, altText: 'Champagne Gold Rose Edition' }
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
      { url: DNYL_ASSETS.karachiTortoise, altText: 'DNYL Karachi Club Clifton Tortoise - Studio Front' },
      { url: DNYL_ASSETS.karachiJetBlack, altText: 'DNYL Karachi Club Jet Black / Sapphire - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_5_tort', 
        title: 'Clifton Tortoise / Tobacco Gradient Polarized', 
        availableForSale: true, 
        price: { amount: '5999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#78350F',
        image: { url: DNYL_ASSETS.karachiTortoise, altText: 'Clifton Tortoise Edition' }
      },
      { 
        id: 'var_5_black_sapphire', 
        title: 'Karachi Jet Black / Deep Sapphire Polarized', 
        availableForSale: true, 
        price: { amount: '5999', currencyCode: 'PKR' }, 
        compareAtPrice: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#1E3A8A',
        image: { url: DNYL_ASSETS.karachiJetBlack, altText: 'Karachi Jet Black Edition' }
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
      { url: DNYL_ASSETS.legacyObsidianGold, altText: 'DNYL Legacy Premium Obsidian Gold - Studio Front' },
      { url: DNYL_ASSETS.legacyPlatinumSilver, altText: 'DNYL Legacy Premium Platinum Silver - Second Colourway' }
    ],
    variants: [
      { 
        id: 'var_6_gold', 
        title: 'Obsidian Black / Gold Trim / Midnight Black Polarized', 
        availableForSale: true, 
        price: { amount: '7999', currencyCode: 'PKR' },
        colorHex: '#D4AF37',
        image: { url: DNYL_ASSETS.legacyObsidianGold, altText: 'Obsidian Black Gold Edition' }
      },
      { 
        id: 'var_6_silver', 
        title: 'Platinum Chrome / Glacier Silver Mirror Polarized', 
        availableForSale: true, 
        price: { amount: '8499', currencyCode: 'PKR' },
        colorHex: '#E2E8F0',
        image: { url: DNYL_ASSETS.legacyPlatinumSilver, altText: 'Platinum Silver Edition' }
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

export const CATEGORIES = [
  { name: 'AVIATOR', image: DNYL_ASSETS.aviator, slug: 'aviator' },
  { name: 'WAYFARER', image: DNYL_ASSETS.wayfarer, slug: 'wayfarer' },
  { name: 'ROUND', image: DNYL_ASSETS.round, slug: 'round' },
  { name: 'SQUARE', image: DNYL_ASSETS.square, slug: 'square' },
  { name: 'CLASSIC', image: DNYL_ASSETS.wayfarer, slug: 'classic' },
  { name: 'PREMIUM', image: DNYL_ASSETS.square, slug: 'premium' },
  { name: 'NEW ARRIVALS', image: DNYL_ASSETS.hero, slug: 'new-arrivals' }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-sunglasses-face-shape',
    title: 'The Architecture of Style: How to Choose Sunglasses for Your Face Shape',
    excerpt: 'Finding the perfect frame is an exercise in symmetry and balance. Discover how to identify your face shape and choose frames that accentuate your features.',
    content: `Choosing the right sunglasses is more than a styling choice—it is a study of geometry and proportion. The fundamental rule is contrast: your frames should balance the natural angles of your face.

## 1. Square Face Shape
A strong jawline and wide forehead benefit from rounded, softer frame contours. 
* **The Frame Choice:** Round or oval glasses, such as the **DNYL Aura Round**, soften prominent angles and create an elegant equilibrium.
* **Avoid:** Highly structured geometric, sharp square frames which over-emphasize angularity.

## 2. Round Face Shape
With soft features and equal width and length, a round face benefits from added structure and definition.
* **The Frame Choice:** Strong, thick, angular rectangular or square shapes such as the **DNYL Stealth Square** or **DNYL Legacy Premium Limitless** provide perfect structure.
* **Avoid:** Round wire frames that blend into the face's natural soft curves.

## 3. Oval Face Shape
Universally balanced, the oval face shape is the most versatile canvas, and can support almost any design.
* **The Frame Choice:** Take advantage of your symmetry with bold wayfarers, like the **DNYL Nomad Wayfarer**, or structural aviators, like the **DNYL Maverick Aviator**.

## 4. Heart Face Shape
Broad temples tapering down to a narrow chin require frames that draw the focus slightly downward or offer balanced widths.
* **The Frame Choice:** Classic aviators, or round-wire frames with slightly wider bottom contours, look phenomenal.

At DNYL, we design our collection with these architectural rules in mind. Every frame is sculpted to provide balance, giving you the confidence to see the world differently.`,
    image: DNYL_ASSETS.square,
    date: 'September 10, 2026',
    author: 'Daniyal Hayyat'
  },
  {
    slug: 'polarized-vs-non-polarized-sunglasses',
    title: 'Clarifying the Vision: Polarized vs Non-Polarized Eyewear',
    excerpt: 'Do you really need polarized lenses? We break down the physics of glare, optical performance, and why DNYL defaults to premium polarization.',
    content: `When searching for high-end eyewear, "polarized" is a term frequently used but rarely explained. At DNYL, we believe absolute clarity is a key pillar of premium eyewear. Here is the science behind polarization and why it matters for everyday life in sunny Pakistan.

## The Physics of Glare
Natural sunlight travels in all directions. When it strikes a flat, horizontal surface—like a wet Clifton beach road, a car's hood, or the Arabian Sea—it becomes concentrated horizontally. This horizontally reflected light is what we experience as blinding white "glare".

Standard dark tinted sunglasses merely reduce the overall amount of light entering the eye. They dim the glare, but they do not eliminate it.

Polarized lenses, however, are treated with a microscopic chemical filter applied in vertical rows. This vertical filter acts like a window blind, allowing only useful vertical light to pass through while completely absorbing and blocking horizontal glare waves.

## Key Benefits of DNYL Premium Polarized Lenses

1. **Elimination of Glare:** Perfect for driving down Shahrah-e-Faisal or strolling on the Clifton boardwalk. 
2. **Enhanced Contrast and Detail:** Colors appear rich, vivid, and highly defined.
3. **Reduced Eye Fatigue:** No more squinting or headaches from reflecting glare.
4. **UV400 Shield:** All DNYL polarized lenses provide total protection against harmful UVA and UVB radiation.

Whether you're hitting the golf course, driving on a bright afternoon, or shooting a fashion campaign, premium polarized eyewear allows you to see different, with absolute comfort and perfect precision.`,
    image: DNYL_ASSETS.aviator,
    date: 'August 28, 2026',
    author: 'DNYL Optical Labs'
  },
  {
    slug: 'essential-sunglasses-trends-pakistan',
    title: 'Modern Monolithic: Premium Eyewear Trends Shaping Pakistani Street Fashion',
    excerpt: 'From architectural acetate to minimalist titanium wires, we explore the rise of contemporary editorial design in Karachi, Lahore, and Islamabad.',
    content: `Pakistani street fashion is undergoing an architectural evolution. As younger generations mix heritage fabrics with sleek international street wear, premium sunglasses have moved from functional protection to the literal centerpiece of the outfit.

Here are the key design movements defining premium eyewear in Karachi, Lahore, and Islamabad this season.

## 1. Thick, Monolithic Acetate
Bold, blocky profiles are dominating urban centers. Our **DNYL Stealth Square** frames celebrate this thick, luxurious aesthetic. They project immense confidence, working beautifully with relaxed fits, crisp linen shirts, and custom streetwear.

## 2. Titanium Minimalism
On the other end of the spectrum is the return of structural wire frames. High-grade titanium is incredibly lightweight yet robust. Models like our **DNYL Aura Round** offer an artistic, intellectual look that elevates casual tailoring and minimal aesthetics.

## 3. Warm Retro Tones
While black remains the eternal core of modern wardrobes, warm ambers, tortoise shell, and deep brown gradients are having a massive moment. The **DNYL Karachi Club Classic** captures this perfectly, invoking nostalgic luxury with a modern, confidence-forward fit.

Eyewear is the most expressive accessory because it sits at the absolute center of human interaction. When you choose a frame, you're choosing how the world sees you—and how you see the world. Choose to see different.`,
    image: DNYL_ASSETS.hero,
    date: 'August 15, 2026',
    author: 'Daniyal Hayyat'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, we offer Cash on Delivery (COD) as our primary payment method across Pakistan, allowing you to pay at your doorstep with complete peace of mind.'
  },
  {
    question: 'Do you deliver across Pakistan?',
    answer: 'Absolutely. We provide premium, insured nationwide shipping to Karachi, Lahore, Islamabad, Faisalabad, Peshawar, and all cities across Pakistan.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Karachi deliveries take 1 to 2 business days. For the rest of Pakistan (Lahore, Islamabad, etc.), delivery typically takes 3 to 5 business days.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a hassle-free 7-day return and exchange policy. Sunglasses must be unworn, in their original condition, with the protective film, microfiber cloth, leather case, and packaging intact.'
  },
  {
    question: 'Can I exchange my sunglasses if they do not suit my face?',
    answer: 'Yes, we want you to see different and feel completely confident. You can easily initiate an exchange for another style or lens color within 7 days of receiving your order.'
  },
  {
    question: 'Are DNYL sunglasses UV protected?',
    answer: 'Yes, every single pair of DNYL sunglasses provides 100% UV400 protection, shielding your eyes from harmful ultraviolet UVA and UVB solar rays.'
  },
  {
    question: 'Are DNYL lenses polarized?',
    answer: 'Yes, all products in our current collection feature premium high-definition polarized lenses that filter horizontal glare, perfect for driving, outdoor sports, and beach walks.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive an SMS and Email with your tracking link. You can also use our Track Order page on the website with your Order ID.'
  }
];
