import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, ShieldCheck, Flame, ChevronRight, Check, AlertCircle, Sparkles, Star, UserCheck, User } from 'lucide-react';
import { Product, ScreenType, CartItem } from '../../types';
import { PRODUCTS } from '../../data';
import ProductCard from '../ProductCard';

interface ProductDetailPageProps {
  product: Product;
  products: Product[];
  setScreen: (screen: ScreenType) => void;
  setSelectedProduct: (prod: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, qty?: number) => void;
  onWishlistToggle: (id: string) => void;
  wishlist: string[];
}

export default function ProductDetailPage({
  product,
  products,
  setScreen,
  setSelectedProduct,
  onAddToCart,
  onWishlistToggle,
  wishlist
}: ProductDetailPageProps) {
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [pincode, setPincode] = useState('');
  const [pincodeState, setPincodeState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [deliveryDateMsg, setDeliveryDateMsg] = useState('');
  const [buyingNow, setBuyingNow] = useState(false);

  // Update selected states on product transition
  useEffect(() => {
    setSelectedImgIdx(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setQuantity(1);
    setPincodeState('idle');
    setPincode('');
    setDeliveryDateMsg('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product]);

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isWishlisted = wishlist.includes(product.id);

  // Pincode calculation simulator
  const handlePincodeCheck = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeState('invalid');
      setDeliveryDateMsg('Specify a valid 6-digit Indian PIN code (e.g. 400001).');
      return;
    }
    setPincodeState('checking');
    setTimeout(() => {
      setPincodeState('valid');
      const mockDays = 3 + (Number(pincode[0]) % 3);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + mockDays);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
      setDeliveryDateMsg(`Fast delivery scheduled by ${formattedDate} via Hive Courier Express.`);
    }, 1000);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    setBuyingNow(true);
    // Add item to cart first
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setTimeout(() => {
      setScreen('cart');
      setBuyingNow(false);
    }, 500);
  };

  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  // Mock static custom review logs matching the cockroach/survival theme
  const mockReviews = [
    {
      author: "xxxxxxxx",
      date: "May 18, 2026",
      rating: 5,
      title: "Literally outlived an automobile grease accident!",
      body: "Fell off my bike directly into road grime. Put this survivor shirt in a standard warm wash with basic detergent, and political graphics are still absolutely pristine. Golden Carapace is amazing."
    },
    {
      author: "Aditi S.",
      date: "May 10, 2026",
      rating: 4.8,
      title: "Extremely heavy drape & luxury feel",
      body: "I got the Radioactive Fallout Oversized. It's incredibly heavy and fits cleanly. It has a high-end streetwear feel. Recommended!"
    },
    {
      author: "Vikram R.",
      date: "May 02, 2026",
      rating: 5,
      title: "Tested under 100 washes - No shrinkage!",
      body: "Normally basics stretch at the collar after washing, but this high-tensile material maintains original fit perfectly."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono uppercase tracking-widest mb-10 select-none">
          <button onClick={() => setScreen('home')} className="hover:text-amber-400">Home Base</button>
          <ChevronRight className="h-3 w-3" />
          <button onClick={() => setScreen('shop')} className="hover:text-amber-400">Catalog</button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-amber-400 font-bold truncate">{product.name}</span>
        </div>

        {/* Core Detail Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pb-16">
          
          {/* Left Block - Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl bg-[#141414] border border-neutral-800 overflow-hidden group shadow-2xl">
              <img
                src={product.images[selectedImgIdx] || product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded px-2 py-0.5 text-[8.5px] font-mono tracking-wider uppercase text-gray-400 font-medium">
                Zoom lens standard
              </span>
            </div>

            {/* Thumbnail collection list */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-xl border transition-all ${
                    selectedImgIdx === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/10'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img src={img} alt="Thumbnail preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
            
            {/* 360° Sandbox interactive disclaimer banner */}
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#8B6914] font-bold">🛠️ BIO-ACCURATE WEAVE SPECIFICATION</span>
              <span className="text-[10px] text-gray-500">240 GSM ORG-COTTON</span>
            </div>
          </div>

          {/* Right Block - Product specifications info & controllers */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Headers, categories, stars */}
            <div className="space-y-2">
              <span className="inline-flex rounded bg-[#1A1A1A] px-2.5 py-0.5 text-[10px] font-bold font-mono tracking-widest uppercase text-amber-500 border border-neutral-800">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white">{product.rating}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">({product.reviewCount} customer reviews)</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  ● SEWERS DEPOT SECURED STOCK
                </span>
              </div>
            </div>

            {/* Pricing block */}
            <div className="flex items-baseline gap-4 bg-neutral-900/40 p-4 rounded-xl border border-neutral-900">
              <span className="text-3xl font-black font-mono text-amber-400">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-neutral-500 line-through font-mono">₹{product.originalPrice}</span>
                  <span className="rounded bg-rose-500/10 text-rose-500 px-2 py-0.5 text-[10px] font-bold font-mono">
                    SAVE ₹{product.originalPrice - product.price} ({discountPercentage}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Short descriptions */}
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans border-l-2 border-[#D4A853] pl-3">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Select Carapace Tint</span>
              <div className="flex gap-2">
                {product.colors.map((color) => {
                  const active = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all text-xs font-semibold cursor-pointer ${
                        active
                          ? 'border-amber-400 bg-amber-400/5 text-amber-400 font-bold'
                          : 'border-neutral-800 hover:border-neutral-700 bg-[#141414] text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-neutral-950 shadow" style={{ backgroundColor: color.value }} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Options selectors with custom fit recommendation reminder */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span className="font-bold uppercase tracking-widest">Select Survival fit size</span>
                <button 
                  onClick={() => { setScreen('static'); window.scrollTo(0, 0); }}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Size Guide & Caliper
                </button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((sz) => {
                  const active = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-10 w-12 flex items-center justify-center rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-400 border-amber-400 text-black shadow-lg shadow-amber-400/10'
                          : 'bg-[#141414] border-neutral-800 hover:border-neutral-750 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity selector controller */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Quantities Box</span>
              <div className="flex items-center gap-1 bg-[#141414] border border-neutral-800 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="h-9 w-9 text-xs font-mono hover:text-white text-gray-500 cursor-pointer text-center"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="h-9 w-9 text-xs font-mono hover:text-white text-gray-500 cursor-pointer text-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Pincode checker module */}
            <div className="bg-[#141414] border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">📍 Pincode Delivery Estimator</span>
                <span className="text-[9px] font-mono text-emerald-400">COD Available</span>
              </div>
              
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter pincode (e.g. 400001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="bg-[#1C1C1E] rounded-md border border-neutral-800 text-xs px-3 py-1.5 focus:border-amber-400 focus:outline-none flex-1 font-mono placeholder-neutral-600 focus:ring-1 focus:ring-amber-400/20"
                />
                <button
                  type="submit"
                  className="rounded-md bg-amber-500 hover:bg-amber-600 transition-colors text-black text-[10px] font-mono uppercase font-bold px-4 py-1.5 cursor-pointer"
                >
                  {pincodeState === 'checking' ? 'Testing...' : 'Compute'}
                </button>
              </form>

              {deliveryDateMsg && (
                <div className={`text-[10px] font-mono mt-1 ${
                  pincodeState === 'invalid' ? 'text-rose-500' : 'text-amber-400'
                }`}>
                  {deliveryDateMsg}
                </div>
              )}
            </div>

            {/* Core Action Call buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full cursor-pointer rounded-xl border border-amber-500 hover:border-amber-600 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 transition-colors py-3 text-xs font-mono uppercase font-black tracking-widest flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" /> Save To Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 text-black transition-colors py-3 text-xs font-mono uppercase font-black tracking-widest flex items-center justify-center gap-2"
              >
                Assemble Buy Now
              </button>
            </div>

            {/* Wishlist toggle secondary link */}
            <button
              onClick={() => onWishlistToggle(product.id)}
              className={`w-full cursor-pointer rounded-lg border border-neutral-800/80 bg-[#141414]/30 py-2.5 text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.99] ${
                isWishlisted ? 'text-amber-400 border-amber-500/20' : ''
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-amber-400 text-amber-400 stroke-none' : ''}`} />
              {isWishlisted ? 'REMOVE SPECIMEN FROM FAVIDS' : 'ADD SPECIMEN TO WISHLIST'}
            </button>

          </div>

        </div>

        {/* Tab specifications reviews details */}
        <div className="border-t border-neutral-900 pt-10">
          <div className="flex gap-4 border-b border-neutral-900 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`text-xs font-mono uppercase font-extrabold tracking-wider transition-colors cursor-pointer ${
                activeTab === 'desc' ? 'text-amber-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              Material Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`text-xs font-mono uppercase font-extrabold tracking-wider transition-colors cursor-pointer ${
                activeTab === 'specs' ? 'text-amber-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              Technical specs
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-mono uppercase font-extrabold tracking-wider transition-colors cursor-pointer ${
                activeTab === 'reviews' ? 'text-amber-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              Customer Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="bg-[#141414]/40 border border-neutral-900 p-6 rounded-2xl">
            {activeTab === 'desc' && (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 font-mono text-xs">
                  <div className="p-3 border border-neutral-900 rounded bg-neutral-950/20">
                    <span className="block text-amber-500/60 font-bold uppercase tracking-wider text-[10px]">Material specifications</span>
                    <p className="text-white font-medium mt-1">{product.material}</p>
                  </div>
                  <div className="p-3 border border-neutral-900 rounded bg-neutral-950/20">
                    <span className="block text-amber-500/60 font-bold uppercase tracking-wider text-[10px]">Fit type recommendation</span>
                    <p className="text-white font-medium mt-1">{product.fit}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-400 font-mono list-disc pl-5">
                {product.specs.map((item, idx) => (
                  <li key={idx}><span className="text-white">{item}</span></li>
                ))}
                <li>Weave Pattern: <span className="text-white">Carapaces Interlock Weave</span></li>
                <li>Washes Capability: <span className="text-rose-400">Survival Verified under 1500 intensive standard washes</span></li>
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 pb-4 gap-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase font-mono text-amber-400">Tested in sewers & streets</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Average score {product.rating} over {product.reviewCount} total logs</p>
                  </div>
                  <div className="flex gap-1.5 items-center font-mono text-xs text-white">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>Rating breakdown statistics valid</span>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-neutral-900">
                  {mockReviews.map((review, idx) => (
                    <div key={idx} className="space-y-2 pt-4 first:pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-7 w-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-amber-500">
                            <User className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <span className="block text-xs font-bold text-white leading-none">{review.author}</span>
                            <span className="text-[9px] text-gray-500 font-mono">{review.date}</span>
                          </div>
                        </div>

                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-xs font-semibold text-white uppercase font-mono tracking-wide">{review.title}</h4>
                      <p className="text-xs font-sans text-neutral-400 leading-relaxed">{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like related layout */}
        {related.length > 0 && (
          <div className="mt-16 space-y-6 border-t border-neutral-900 pt-10">
            <h3 className="text-xl font-bold uppercase font-mono tracking-tight text-white pl-2 border-l-2 border-amber-400">
              RELATED CARAPACES (YOU MAY ALSO LIKE)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={onAddToCart}
                  onWishlistToggle={onWishlistToggle}
                  isWishlisted={wishlist.includes(prod.id)}
                  onViewDetails={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
