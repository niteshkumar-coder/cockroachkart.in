import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Flame, ShieldAlert, Award, Truck, RefreshCw, Layers, Bell, Star, Users, Lock, Headphones, ChevronRight, Check } from 'lucide-react';
import { Product, ScreenType } from '../../types';
import ProductCard from '../ProductCard';
import { MASCOT_IMAGE } from '../../data';

interface HomepageProps {
  products: Product[];
  setScreen: (screen: ScreenType) => void;
  setSelectedProduct: (prod: Product) => void;
  onWishlistToggle: (id: string) => void;
  wishlist: string[];
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export default function Homepage({
  products,
  setScreen,
  setSelectedProduct,
  onWishlistToggle,
  wishlist,
  onAddToCart
}: HomepageProps) {
  // Flash sale timer countdown
  const [timeLeft, setTimeLeft] = useState({ hr: 8, min: 45, sec: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { hr: prev.hr, min: prev.min - 1, sec: 59 };
        if (prev.hr > 0) return { hr: prev.hr - 1, min: 59, sec: 59 };
        return { hr: 0, min: 0, sec: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const featured = products.filter(p => p.tag === 'Best Seller' || p.tag === 'Limited Edition').slice(0, 3);
  const trending = products.slice(0, 4);

  return (
    <div className="bg-[#0D0D0D] text-white">
      
       {/* Immersive Hero Section - Cockroach Janta Party Campaign */}
      <section className="relative overflow-hidden bg-black border-b border-amber-500/10 min-h-[620px] sm:min-h-[720px] lg:min-h-[850px] flex flex-col justify-between pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        
        {/* Cinematic Background Image Overlay of the campaign scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center select-none pointer-events-none opacity-100" 
          style={{ backgroundImage: `url('https://i.ibb.co/0LGHNBQ/939b68fa-ae2a-4ff2-9bfc-ad98f3a6a9b4.png')` }} 
        />
        
        {/* Premium Vignette Gradients for maximum text readability and immersion */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/25 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/45 pointer-events-none hidden lg:block" />

        {/* Floating Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[15%] w-2.5 h-6 bg-amber-500 rotate-12 opacity-40 animate-pulse" />
          <div className="absolute top-24 right-[20%] w-3 h-3 bg-emerald-600 rounded-full opacity-35 animate-bounce" />
          <div className="absolute top-48 left-[5%] w-4 h-2 bg-amber-600 -rotate-45 opacity-30" />
          <div className="absolute top-12 right-[8%] w-2.5 h-5 bg-emerald-500 rotate-45 opacity-40" />
          <div className="absolute bottom-24 left-[25%] w-3 h-3 bg-amber-400 rotate-12 opacity-30 animate-pulse" />
          <div className="absolute bottom-32 right-[12%] w-2 h-6 bg-emerald-600 -rotate-12 opacity-35" />
        </div>

        {/* Top central brand campaign header */}
        <div className="relative z-10 text-center max-w-4xl mx-auto pt-4 pb-4">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[40px] leading-tight min-[400px]:text-5xl sm:text-7xl lg:text-8.5xl font-black tracking-wider text-white font-sans uppercase"
            style={{ textShadow: "4px 4px 0px #000, -2px -2px 0px #000" }}
          >
            COCKROACH
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 mt-1 sm:mt-2"
          >
            {/* Left Tricolor lines */}
            <div className="hidden min-[450px]:flex flex-col gap-1 w-8 sm:w-16 shrink-0">
              <div className="h-1 bg-[#FF7A00] rounded-sm" />
              <div className="h-1 bg-white rounded-sm" />
              <div className="h-1 bg-[#0F5E2B] rounded-sm" />
            </div>

            <span className="text-lg min-[360px]:text-xl sm:text-3.5xl lg:text-4.5xl font-black text-[#0D9F3F] font-mono tracking-widest uppercase" style={{ textShadow: "2px 2px 0px #000" }}>
              JANTA PARTY!
            </span>

            {/* Right Tricolor lines */}
            <div className="hidden min-[450px]:flex flex-col gap-1 w-8 sm:w-16 shrink-0">
              <div className="h-1 bg-[#FF7A00] rounded-sm" />
              <div className="h-1 bg-white rounded-sm" />
              <div className="h-1 bg-[#0F5E2B] rounded-sm" />
            </div>
          </motion.div>

          {/* Brand slogan subtitle spacing */}
          <div className="h-4" />
        </div>

        {/* Main hero grid */}
        <div className="relative z-10 mx-auto max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 pt-4 pb-12 px-6">
          
          {/* Central actions and CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 py-4 lg:py-0 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setScreen('shop')}
              className="w-full sm:w-auto cursor-pointer rounded-full bg-[#FF7A00] hover:bg-[#e06c00] transition-all text-black font-mono font-black text-xs uppercase tracking-widest py-4 px-10 flex items-center justify-center gap-2 group shadow-[0_4px_30px_rgba(255,122,0,0.6)]"
            >
              SHOP NOW
              <ChevronRight className="h-4 w-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => {
                const specItem = products.find(p => p.id === 'cjp-01') || products[0];
                setSelectedProduct(specItem);
                setScreen('detail');
              }}
              className="w-full sm:w-auto cursor-pointer rounded-full border border-neutral-700 hover:border-white transition-all bg-black/60 backdrop-blur-md text-white font-mono font-bold text-xs uppercase tracking-widest py-4 px-10 flex items-center justify-center gap-2 group"
            >
              EXPLORE COLLECTION
              <ChevronRight className="h-4 w-4 text-[#D6C7A1] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right panel: Showcase of the 3 majestic T-shirts directly matching the products list */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 w-full lg:w-auto justify-items-center flex-wrap md:flex-nowrap">
            
            {/* T-Shirt 1 (Black Mascot) */}
            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              onClick={() => {
                const prod = products.find(p => p.id === 'cjp-02') || products[0];
                setSelectedProduct(prod);
                setScreen('detail');
              }}
              className="group cursor-pointer w-[28%] min-w-[92px] sm:w-36 md:w-44 lg:w-48 relative border border-neutral-800 bg-[#161618]/95 hover:bg-[#1c1c1e] p-2 sm:p-4 rounded-3xl shadow-2xl hover:border-[#FF7A00]/50 transition-all text-center"
            >
              <div className="absolute -top-1.5 -right-1 sm:-top-2 sm:-right-1.5 z-20 bg-[#FF7A00] text-black text-[7px] sm:text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                BEST
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 mb-3 relative border border-neutral-800">
                <img
                  src={products.find(p => p.id === 'cjp-02')?.images[0] || "https://i.ibb.co/GfdtN9SD/image.png"}
                  alt="Black CJP campaign tee"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-opacity" />
              </div>
              <span className="block text-[8px] sm:text-[11px] lg:text-xs font-mono font-bold tracking-tight text-neutral-300 capitalize truncate mt-1">
                CJP Black Tee
              </span>
              <span className="block text-[9px] sm:text-[13px] lg:text-sm font-mono font-black text-[#FF7A00] mt-1">
                ₹999
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#FF7A00] h-0.5 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
 
            {/* T-Shirt 2 (White CJP) */}
            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              onClick={() => {
                const prod = products.find(p => p.id === 'cjp-01') || products[0];
                setSelectedProduct(prod);
                setScreen('detail');
              }}
              className="group cursor-pointer w-[28%] min-w-[92px] sm:w-36 md:w-44 lg:w-48 relative border border-neutral-800 bg-[#161618]/95 hover:bg-[#1c1c1e] p-2 sm:p-4 rounded-3xl shadow-2xl hover:border-white/50 transition-all text-center"
            >
              <div className="absolute -top-1.5 -right-1 sm:-top-2 sm:-right-1.5 z-20 bg-neutral-100 text-black text-[7px] sm:text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                RALLY
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-950 mb-3 relative border border-neutral-800">
                <img
                  src={products.find(p => p.id === 'cjp-01')?.images[0] || "https://i.ibb.co/6cHKvQCg/image.png"}
                  alt="Silver White Rally Tee"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-transparent transition-opacity" />
              </div>
              <span className="block text-[8px] sm:text-[11px] lg:text-xs font-mono font-bold tracking-tight text-neutral-300 capitalize truncate mt-1">
                CJP White Rally
              </span>
              <span className="block text-[9px] sm:text-[13px] lg:text-sm font-mono font-black text-white mt-1">
                ₹999
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white h-0.5 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
 
            {/* T-Shirt 3 (Green Voice Unity Survival) */}
            <motion.div
              whileHover={{ y: -15, scale: 1.05 }}
              onClick={() => {
                const prod = products.find(p => p.id === 'cjp-03') || products[0];
                setSelectedProduct(prod);
                setScreen('detail');
              }}
              className="group cursor-pointer w-[28%] min-w-[92px] sm:w-36 md:w-44 lg:w-48 relative border border-neutral-800 bg-[#161618]/95 hover:bg-[#1c1c1e] p-2 sm:p-4 rounded-3xl shadow-2xl hover:border-[#10b981]/50 transition-all text-center"
            >
              <div className="absolute -top-1.5 -right-1 sm:-top-2 sm:-right-1.5 z-20 bg-[#0F5E2B] text-white text-[7px] sm:text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                SLOGAN
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 mb-3 relative border border-neutral-800">
                <img
                  src={products.find(p => p.id === 'cjp-03')?.images[0] || "https://i.ibb.co/Xxh9gCKd/bc616590-f556-48fd-9602-7dbc4f5dac6a.png"}
                  alt="Forest Green Slogan Tee"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0F5E2B]/10 group-hover:bg-transparent transition-opacity" />
              </div>
              <span className="block text-[8px] sm:text-[11px] lg:text-xs font-mono font-bold tracking-tight text-neutral-300 capitalize truncate mt-1">
                Survival Forest
              </span>
              <span className="block text-[9px] sm:text-[13px] lg:text-sm font-mono font-black text-[#0D9F3F] mt-1">
                ₹899
              </span>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#0F5E2B] h-0.5 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

          </div>

        </div>

        {/* Extreme Bottom Trust Metrics Bar */}
        <div className="relative z-10 w-full mt-4 border-t border-neutral-900/60 pt-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-center md:border-r border-neutral-900/40 py-1">
              <Star className="h-3.5 w-3.5 text-[#FF7A00] fill-[#FF7A00]" />
              <span className="text-[10px] sm:text-xs font-black font-mono tracking-wide text-neutral-300">
                4.8 <span className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] ml-1">RATING</span>
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-center md:border-r border-neutral-900/40 py-1">
              <Users className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] sm:text-xs font-black font-mono tracking-wide text-neutral-300">
                10,000+ <span className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] ml-1">HAPPY CUSTOMERS</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-center md:border-r border-neutral-900/40 py-1">
              <Lock className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] sm:text-xs font-black font-mono tracking-wide text-neutral-300">
                SECURE <span className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] ml-1">PAYMENT</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-center py-1">
              <Headphones className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[10px] sm:text-xs font-black font-mono tracking-wide text-neutral-300">
                24/7 <span className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] ml-1">SUPPORT</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner section with timer */}
      <section className="bg-[#1A1105] border-y border-amber-500/20 py-4 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="animate-ping rounded-full h-2 w-2 bg-rose-500" />
            <span className="text-amber-400 font-bold uppercase tracking-wider">HURRY! DUST FLURRY SALES CLOSING IN</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 uppercase">Flash sale ends in:</span>
            <div className="flex gap-1.5 font-bold text-sm">
              <span className="bg-neutral-950 text-amber-400 px-2.5 py-1 rounded border border-amber-500/10">0{timeLeft.hr}</span>
              <span>:</span>
              <span className="bg-neutral-950 text-amber-400 px-2.5 py-1 rounded border border-amber-500/10">{timeLeft.min}</span>
              <span>:</span>
              <span className="bg-neutral-950 text-amber-400 px-2.5 py-1 rounded border border-amber-500/10">{timeLeft.sec}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setScreen('shop')}
            className="rounded bg-amber-500 hover:bg-amber-600 transition-colors text-black px-3.5 py-1 font-bold uppercase text-[10px] tracking-widest cursor-pointer"
          >
            Claim 20% Discount
          </button>
        </div>
      </section>

      {/* Featured collection cards */}
      <section className="py-16 px-4 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-500 tracking-widest">Survivals Finest</span>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold tracking-tight">TRENDING SPECIMENS</h2>
          <div className="h-0.5 w-12 bg-amber-500 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((prod) => (
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
      </section>

      {/* Featured collection highlight */}
      <section className="bg-[#141414] border-y border-neutral-900 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl">
            <img
              src="https://i.ibb.co/Qjv0wNX4/image.png"
              alt="Golden collection display"
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase bg-amber-500/5 px-2.5 py-1 rounded">EST. 1970 COCKROACH STRENGTH</span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4.5xl leading-tight">THE CARBON SHIELD VINTAGE</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Constructed using our heavy slub knit fabrics and ancient mineral dyes, our premium vintage designs feature raw trims designed to tear into unique distressed patterns the more you pull and stretch them. Heavy armor look that adapts perfectly to you.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setScreen('shop')}
                className="rounded-xl px-6 py-2.5 text-xs font-mono font-bold bg-amber-500 text-black hover:bg-amber-600 uppercase tracking-wider cursor-pointer"
              >
                Browse Vintage Collections
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Signup Panel */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 border border-amber-500/10 rounded-3xl bg-gradient-to-b from-[#141414] to-neutral-950/10 relative overflow-hidden space-y-6 shadow-2xl">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.03] pointer-events-none h-64 w-64">
            <img 
              src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
              alt="🪳" 
              className="h-full w-full object-contain" 
              referrerPolicy="no-referrer"
            />
          </div>
          
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/5 text-amber-400">
            <Bell className="h-5 w-5 stroke-[2]" />
          </span>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">JOIN THE HIVE DISPATCH</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">Subscribe for private alert drops, survivalist collections announcements, and get a <strong className="text-amber-400">10% OFF Discount Voucher</strong> immediately.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Hive discount coupon SURVIVAL10 sent to inbox!"); }} className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              required
              placeholder="crawler@apocalypse.com"
              className="flex-1 rounded-lg bg-[#111111] border border-neutral-800 text-xs px-4 py-2.5 focus:border-amber-400 focus:outline-none placeholder-neutral-600"
            />
            <button
              type="submit"
              className="rounded-lg bg-amber-500 hover:bg-amber-600 cursor-pointer text-black font-mono font-bold text-xs uppercase px-6 py-2.5 transition-colors shrink-0"
            >
              Sign Up Swarm
            </button>
          </form>
          
          <p className="text-[10px] text-gray-600 font-mono font-medium uppercase tracking-wider">Zero spam guarantees. We only crawl out when dropping heat.</p>
        </div>
      </section>

      {/* Admin system gate trigger */}
      <section className="pb-12 pt-2 text-center">
        <button
          onClick={() => {
            setScreen('admin');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="inline-flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-amber-500 transition-colors cursor-pointer border border-neutral-900 hover:border-neutral-850 bg-[#121212]/30 px-4 py-2.5 rounded-xl"
        >
          <span>🔒 SYSTEM SECURITY: SECURE TERMINAL LINK (AUTHORIZED PERSONNEL ONLY)</span>
        </button>
      </section>

    </div>
  );
}
