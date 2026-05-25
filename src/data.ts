import { Product, SavedAddress } from './types';

export const MASCOT_IMAGE = "/src/assets/images/cockroach_mascot_1779449098936.png";

export const PRODUCTS: Product[] = [
  {
    id: "cjp-01",
    name: "CJP Official Rally Graphic Tee (Sliver White)",
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewCount: 342,
    category: "Graphic Tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Sliver White", value: "#FFFFFF" },
      { name: "Onyx Black", value: "#121212" }
    ],
    images: [
      "https://i.ibb.co/6cHKvQCg/image.png",
      "https://i.ibb.co/KjJPwGGL/75dc68c8-344b-417c-98a3-8e81523c2900.png"
    ],
    tag: "New Arrival",
    description: "The official CJP rally garment. Features the 'COCKROACH = JANTA PARTY! =' graphic on heavy 240 GSM organic combat cotton. Fight for unity, progress, power, and ultimate survival. Resilient and durable under extreme conditions.",
    specs: [
      "240 GSM organic pre-shrunk combed cotton",
      "High density plastisol front graphic print",
      "Saffron, white and green contrast campaign print details",
      "Relaxed vintage flow shoulder drop",
      "Fully wash-tested to survive up to 1500+ standard trials"
    ],
    material: "100% Organically Grown Premium Combat Cotton",
    fit: "Oversized relaxed streetwear fit",
    care: "Machine wash cold inside out, tumble dry gentle. Do not iron direct on print."
  },
  {
    id: "cjp-02",
    name: "Cockroach Janta Party Campaign Tee (Onyx Black)",
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 295,
    category: "Oversized",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Onyx Black", value: "#121212" },
      { name: "Sliver White", value: "#FFFFFF" }
    ],
    images: [
      "https://i.ibb.co/p6ttbHFp/1764c00a-8954-48db-b06c-d0d71246b7ea.png",
      "https://i.ibb.co/WWxTRs69/b2cda8b8-438d-44ca-bb96-42b7316d388f.png"
    ],
    tag: "Best Seller",
    description: "The heavy drape campaign block T-shirt representing Cockroach Janta Party. Stylized high-definition mascot print of our fearless commander standing behind the microphone in classic golden-accent shading. Speaks of style and stamina.",
    specs: [
      "260 GSM heavyweight French Terry drop",
      "Rich puff chest print featuring the official campaign mascot",
      "Tricolor stripe ribbed neck tape inside the neck",
      "Warp-resistant heavy gauge knitting fabric thread",
      "Apocalypse-tested comfort rating"
    ],
    material: "95% Combed Cotton, 5% Lycra Tech-Blend",
    fit: "Streetwear boxy oversized look",
    care: "Hand wash or gentle cool spin. Do not bleaching."
  },
  {
    id: "cjp-03",
    name: "Voice Unity Survival Slogan Tee (Forest Green)",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 187,
    category: "Graphic Tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Forest Green", value: "#0F5E2B" },
      { name: "Charcoal Black", value: "#1A1A1A" }
    ],
    images: [
      "https://i.ibb.co/Xxh9gCKd/bc616590-f556-48fd-9602-7dbc4f5dac6a.png",
      "https://i.ibb.co/JwQ8gPm0/2657a170-5131-43e9-b1df-6912560ad5db.png"
    ],
    tag: "New Arrival",
    description: "A loud bold declaration of resilience, styled on high-strength military-green streetwear fabric. Features 'VOICE. UNITY. SURVIVAL.' typography on front chest and full back illustration of the CJP rally swarm.",
    specs: [
      "240 GSM pre-shrunk combed cotton",
      "Premium discharge dye base for dynamic color retention",
      "Distressed crackle front typography design",
      "Raw hem tail with double-needle reinforcement",
      "Resists oil, dirt, extreme friction, and acidic environments"
    ],
    material: "100% Cotton Carapace Ring-Spun",
    fit: "Boxy standard street-drape",
    care: "Wash cold, air dry to maximize graphic life."
  },
  {
    id: "surv-01",
    name: "The Unstoppable Survivor Graphic Tee",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 148,
    category: "Graphic Tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal Black", value: "#121212" },
      { name: "Golden Amber", value: "#D4A853" },
      { name: "Survival Olive", value: "#424E3B" }
    ],
    images: [
      "https://i.ibb.co/HfQS5Nf1/13fd2ab3-0067-46a2-af3a-2e567fa600f2.png",
      "https://i.ibb.co/SXL0k8tg/d752855d-cb87-4dca-9ff4-162ce34ad3a1.png",
      "https://i.ibb.co/WWxTRs69/b2cda8b8-438d-44ca-bb96-42b7316d388f.png"
    ],
    tag: "Best Seller",
    description: "Styled with a heavy high-density screen print of the legendary Cockroach silhouette on premium 240 GSM organic combat cotton. Featuring the slogan '9.9% Post-Nuclear Survival Rate'. Built to persist, wash after wash.",
    specs: [
      "240 GSM pre-shrunk combed cotton",
      "Highly durable high-density plastisol graphic print",
      "Ribbed crewneck collar",
      "Unisex relaxed fit",
      "Reinforced double-needle stitching"
    ],
    material: "100% Organically Grown Premium Combat Cotton",
    fit: "Relaxed fit with a dropped shoulder drop",
    care: "Machine wash cold inside out, tumble dry low. Do not iron directly on the graphics."
  },
  {
    id: "gold-02",
    name: "Golden Carapace Minimalist Tee",
    price: 1299,
    originalPrice: 1599,
    rating: 4.9,
    reviewCount: 84,
    category: "Plain Tees",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Onyx Black", value: "#0A0A0A" },
      { name: "Carapace Bronze", value: "#8B6914" }
    ],
    images: [
      "https://i.ibb.co/jvtZbHdv/edb89bf8-73d8-4c3f-9d79-648897aad907.png",
      "https://i.ibb.co/p6ttbHFp/1764c00a-8954-48db-b06c-d0d71246b7ea.png"
    ],
    tag: "Limited Edition",
    description: "Our signature luxury line. Features a stunning, small embroidered Golden Cockroach Mascot on the left chest. Crafted via high-fidelity gold metallic thread embroidery. Stealth-wealth meeting indestructible street-style.",
    specs: [
      "Metallic golden thread chest embroidery",
      "Ultra-soft carbon-peach finish fabric",
      "Side seam slit details with amber contrast tape",
      "Premium branding label on lower hem",
      "Presented in an air-locked survive-proof slider bag"
    ],
    material: "95% Combed Cotton, 5% Survival Lycra for stretch resistance",
    fit: "Tailored luxury fit",
    care: "Gentle machine wash inside out. Hang dry to maintain metallic embroidery sheen."
  },
  {
    id: "over-03",
    name: "Radioactive Fallout Oversized Tee",
    price: 1499,
    originalPrice: 1999,
    rating: 4.7,
    reviewCount: 96,
    category: "Oversized",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Fallout Gray", value: "#3A3A3C" },
      { name: "Toxic Green", value: "#627D42" }
    ],
    images: [
      "https://i.ibb.co/rRzqTjS7/b8efe05b-b985-44b1-a318-300bebd28b73.png",
      "https://i.ibb.co/WWxTRs69/b2cda8b8-438d-44ca-bb96-42b7316d388f.png"
    ],
    tag: "Nuclear Proof",
    description: "Designed extra roomy to handle radioactive winds (or just visual breeze). Stylized glowing silhouette prints that illuminate under ultraviolet blacklight. Extra heavy drape that stays pristine under extreme wear.",
    specs: [
      "280 GSM heavyweight French Terry drop",
      "UV-reactive fluorescent neon layout accents",
      "Intense drop shoulder outline with snug collar",
      "Subtle cockroach leg emblem near cuff",
      "Heavy ribbing on neck prevents stretching out"
    ],
    material: "92% Ring-Spun Cotton, 8% Radiation-Resistant Tech Blend",
    fit: "Heavy oversized boxy fit",
    care: "Wash cold, air dry only. Avoid fabric softeners to prevent coating the UV finish."
  },
  {
    id: "vint-04",
    name: "1977 Urban Crawlers Vintage Tee",
    price: 749,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 112,
    category: "Vintage",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Acid Wash Charcoal", value: "#232323" },
      { name: "Rust Amber", value: "#70483C" }
    ],
    images: [
      "https://i.ibb.co/TBN97VKQ/89d8cb18-17ce-47a7-b334-12a4dd016dcd.png",
      "https://i.ibb.co/DHNGgjz8/ad4e9b52-b688-4d08-9ef4-a84f0069e3ce.png"
    ],
    tag: "20% OFF",
    description: "A nostalgic nod to the legendary sewers of old-school Metropolises. Distressed wash and raw edges create a perfect retro t-shirt. The front features a cracked, distressed vintage graphic of three scurrying buddies.",
    specs: [
      "Mineral-washed vintage aesthetic (each piece has unique shades)",
      "Raw hem details with lock-stitch accents",
      "Pre-shrunk vintage soft knit",
      "Distressed crackle print graphic",
      "Super breathable weave"
    ],
    material: "100% Regenerated Vintage Slub Cotton",
    fit: "Vintage standard fit",
    care: "Wash and dry inside-out. The print is designed to fade further over time for an authentic relic look."
  },
  {
    id: "spor-05",
    name: "Aerodynamic Carapace Sports Jersey",
    price: 999,
    originalPrice: 1299,
    rating: 4.5,
    reviewCount: 39,
    category: "Sports",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Nitrous Gold", value: "#D4A853" },
      { name: "Speed Onyx", value: "#1A1A1A" }
    ],
    images: [
      "https://i.ibb.co/DDJRf6nj/f8c477d6-330a-4580-b912-40db25d7f290.png",
      "https://i.ibb.co/SwH5VMJh/9d6edc38-53b8-4b32-85db-fea7c3b55b1b.png"
    ],
    tag: "New Arrival",
    description: "Engineered with anti-microbial quick-dry carapaced knit mesh. Light as air, tough as iron. Features strategic ventilation panels that resemble the overlapping plates of a cockroach shell.",
    specs: [
      "160 GSM ultra-wicking stretch synthetic weave",
      "Hexagonal ventilation patterns down the spine",
      "Reflective gold graphic safety tapes for night running",
      "Seamless side construction to avoid chafing",
      "Ultra-stretch dynamic flatlock seams"
    ],
    material: "85% Moisture-Wicking Recycled Polyester, 15% Elastane",
    fit: "Athletic compression fit",
    care: "Cool quick wash, drip dry. Do not tumble dry. Zero ironing needed."
  },
  {
    id: "lim-06",
    name: "Nuclear Winter Survival Vest / Tee Combo",
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviewCount: 57,
    category: "Limited Edition",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Hazmat Black", value: "#0B0C10" },
      { name: "Safety Orange", value: "#FF5722" }
    ],
    images: [
      "https://i.ibb.co/rKqDjJxj/bbb7a370-f93e-4a37-b613-786c7fa09edf.png",
      "https://i.ibb.co/r2LqsF6h/image.png"
    ],
    tag: "Limited Edition",
    description: "An ultimate double-layered piece containing a high-grade 300 GSM internal survival long sleeve, overlaid with a modular mesh panel with D-rings. Survival-wear optimized for extreme modern utility.",
    specs: [
      "Double layered integrated t-shirt system",
      "Polished high-density utility chest pocket with tactical zipper",
      "Survival whistle zipper slider puller",
      "Utility rings to hook gears, keys, or glowsticks",
      "Survivalist badge embroidered on the left arm sleeve"
    ],
    material: "Double combed thick cotton combined with tactical polyester mesh",
    fit: "Heavy tactical relaxed utility fit",
    care: "Remove tactical detachable mesh before washing. Hand-wash or delicate cold cycle."
  },
  {
    id: "ind-07",
    name: "The Indestructible High-Tensile Basic",
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 230,
    category: "Plain Tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cockroach Brown", value: "#5C401E" },
      { name: "Industrial Gray", value: "#4A4E5D" },
      { name: "Survival Olive", value: "#424E3B" }
    ],
    images: [
      "https://i.ibb.co/ycR82N4F/image.png",
      "https://i.ibb.co/6cHKvQCg/image.png"
    ],
    tag: "Best Seller",
    description: "A super soft, heavy-gauge basic tee heavily tested in temperature chambers. Resists extreme heat, machine-wrenching, stretching, and direct staining. Built to be your daily armor.",
    specs: [
      "Reinforced rib stitch neckline with high-grade elastane recovery",
      "Interlock weaving prevents fiber tearing",
      "Dual shadow tone colors with a soft-wash touch",
      "Zero irritating tags (printed neck specifications)",
      "Tested for over 150 rugged wash cycles"
    ],
    material: "100% Rugged Long-Staple Combed Cotton",
    fit: "Standard daily comfort fit",
    care: "Chuck it in any wash, up to 60°C. Virtually indestructible."
  },
  {
    id: "cjp-04",
    name: "Voice & Unity Premium Heavyweight Tee",
    price: 1199,
    originalPrice: 1699,
    rating: 4.9,
    reviewCount: 156,
    category: "Oversized",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Carbon Ash", value: "#1F2022" },
      { name: "Raw Slate", value: "#343A40" }
    ],
    images: [
      "https://i.ibb.co/GfdtN9SD/image.png",
      "https://i.ibb.co/Zpwb0MCS/image.png"
    ],
    tag: "New Arrival",
    description: "Represent the relentless voice of the Janta Party. Styled with heavy drop shoulders and engineered with a premium thick finish designed for structural rigidity and high performance under absolute stress.",
    specs: [
      "250 GSM heavy combat cotton slub finish",
      "Subtle left sleeve pocket with CJP metal seal rivet",
      "Thick premium crew neck collar rib",
      "Pre-laundered for supreme comfort and zero shrinkage"
    ],
    material: "100% Heavy Combed Ring-Spun Cotton",
    fit: "Oversized, modern structural drape",
    care: "Machine wash cold with like colors, tumble dry low weight."
  },
  {
    id: "cjp-05",
    name: "Indestructible Streetwear Carapace Tee",
    price: 1099,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 204,
    category: "Graphic Tees",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Warm Charcoal", value: "#2D3142" },
      { name: "Acid Forest", value: "#14213d" }
    ],
    images: [
      "https://i.ibb.co/23M0VJY5/image.png",
      "https://i.ibb.co/F4srPQbW/image.png"
    ],
    tag: "Best Seller",
    description: "Featuring standard-breaking overlapping visual back seams resembling armor segment panels of the indestructible carapace. Highly breathable vintage cotton designed to stand any wear and tear.",
    specs: [
      "Breathable high-tensile 220 GSM weave",
      "Subtle contrast flatlock neon seam stitches",
      "Embossed rear carapace logo patch in heat-activated leatherette",
      "Tested for dust, sweat, and acidic resistance"
    ],
    material: "90% Luxury Ring-spun Cotton, 10% Tensile Kev-fiber",
    fit: "Athletic loose box fit",
    care: "Wash inside-out, cold gentle cycle. Do not iron directly on the rear logo patch."
  },
  {
    id: "cjp-06",
    name: "Cockroach Janta Party Elite Club Tee",
    price: 1299,
    originalPrice: 1899,
    rating: 4.9,
    reviewCount: 118,
    category: "Limited Edition",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Amber Ochre", value: "#CA6702" },
      { name: "Rally Green", value: "#0A9396" }
    ],
    images: [
      "https://i.ibb.co/Qjn4XSjB/image.png",
      "https://i.ibb.co/Sw0tvxXG/image.png"
    ],
    tag: "Limited Edition",
    description: "Reserved for core party cadres. Premium double-combed tactical cotton with hand-printed insignia of the Golden Mascot on both sleeves. A beautiful statement of high survival and status.",
    specs: [
      "Premium soft peach finish",
      "Metallic CJP emblem hand-stitched on left chest with precision gold fibers",
      "Side ventilation slits featuring tactical logo tapeing",
      "Limited batch production with serialized label"
    ],
    material: "98% Combed Cotton, 2% Resilient Elastane",
    fit: "Streetwear tailored drop",
    care: "Dry-clean recommended or delicate cold machine wash. Cool iron reverse."
  },
  {
    id: "cjp-07",
    name: "Unstoppable Carapace Oversized Hoodless Tee",
    price: 1399,
    originalPrice: 1999,
    rating: 5.0,
    reviewCount: 94,
    category: "Oversized",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Shadow Obsidian", value: "#000814" },
      { name: "Survival Khaki", value: "#3D3A25" }
    ],
    images: [
      "https://i.ibb.co/dwK35Cvf/image.png",
      "https://i.ibb.co/Q7Phwf5k/image.png",
      "https://i.ibb.co/21S2f6fP/image.png"
    ],
    tag: "Nuclear Proof",
    description: "A gorgeous, heavy-gauge t-shirt style with integrated high-density graphic. The ultimate piece of technical gear for high aesthetics, absolute endurance, and pristine modern streetwear draping.",
    specs: [
      "260 GSM heavy French Terry weave",
      "Modular sleeve adjustment clip detail",
      "Embroidered signature line layout across the spine",
      "Vapor-wicking and heat-storing weave structure"
    ],
    material: "100% Deluxe Organic Combat Cotton",
    fit: "Extreme box drop-shoulder oversized silhouette",
    care: "Hand wash cool or gentle machine spin inside out. Hang dry."
  }
];

export const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-01",
    name: "xxxxxxxx",
    phone: "91283XXXXX",
    houseNo: "Block-4, Apartment 405",
    street: "Antigravity Heights, Golden Carapace Lane",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    landmark: "Behind Survival Dome",
    type: "Home",
    isDefault: true
  },
  {
    id: "addr-02",
    name: "xxxxxxxx (Office)",
    phone: "91283XXXXX",
    houseNo: "Floor 12, AI Innovators Tower",
    street: "Silicon Subway Boulevard",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    landmark: "Opposite Tech Hub",
    type: "Work",
    isDefault: false
  }
];

export const CATEGORIES = [
  { name: "Graphic Tees", icon: "Paintbrush", count: 2 },
  { name: "Plain Tees", icon: "Shirt", count: 2 },
  { name: "Oversized", icon: "Maximize", count: 1 },
  { name: "Vintage", icon: "History", count: 1 },
  { name: "Sports", icon: "Flame", count: 1 },
  { name: "Limited Edition", icon: "Sparkles", count: 1 }
];

export const FAQS = [
  {
    q: "Why is it named CockroachKart?",
    a: "Cockroaches are the ultimate survivors of our planet—unfazed by climate shifts or nuclear blasts. Similarly, CockroachKart makes high-tensile, ultra-durable premium t-shirts meant to survive extreme washes, rough travels, and intense daily run-around. It’s fashion that survives everything!"
  },
  {
    q: "How long is the delivery time?",
    a: "We ship from our climate-hardened warehouses in 24 hours. Normal delivery takes 3-5 business days across India, with free shipping on orders above ₹499."
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day 'No Scurry' Return Policy. If a t-shirt does not fit or please you, you can initiate a return or swap request from your dashboard within 7 days, and we will collect it for free."
  },
  {
    q: "How do I choose my size?",
    a: "Check our dynamic Size Guide in the footer. If you want a standard fit, buy your regular size. If you want our trendy heavy silhouette, search for our 'Oversized' categories or size up."
  },
  {
    q: "Is there COD (Cash on Delivery) available?",
    a: "Yes! COD is available for all pin codes across India on orders up to ₹10,000, with no hidden processing fees."
  }
];
