import { ScreenType, StaticPageType } from '../types';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Shield } from 'lucide-react';

interface FooterProps {
  setScreen: (screen: ScreenType) => void;
  setStaticTab: (tab: StaticPageType) => void;
}

export default function Footer({ setScreen, setStaticTab }: FooterProps) {
  const handleStaticNavigation = (tab: StaticPageType) => {
    setStaticTab(tab);
    setScreen('static');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] border-t border-amber-500/10 text-gray-400 text-sm">
      
      {/* Top Value Banner */}
      <div className="border-b border-amber-500/5 py-10 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/10 text-lg">🚚</div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Free Global Scurry</h4>
              <p className="text-xs text-gray-500 mt-1">Complimentary shipping across India on orders exceeding ₹499. Dispatched in pristine bio-hazard containers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/10 text-lg">🛡️</div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Nuclear-Grade Quality</h4>
              <p className="text-xs text-gray-500 mt-1">240-300 GSM interlocked weave fabrics tested to survive high tensions, staining, and daily street crawling.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/10 text-lg">🔄</div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">Zero-M hassle Returns</h4>
              <p className="text-xs text-gray-500 mt-1">Change your mind? Send back items inside 7 days via our super quick reverse courier service.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/10 text-lg">💬</div>
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">24/7 Hive Support</h4>
              <p className="text-xs text-gray-500 mt-1">Our customer support swarm is ready around the clock to address size or order concerns.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
                alt="🪳" 
                className="h-8 w-8 object-contain" 
                referrerPolicy="no-referrer"
              />
              <span className="font-['Bebas_Neue'] text-xl font-bold tracking-widest text-white">
                COCKROACH<span className="text-amber-400">KART</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              CockroachKart designs premium, survival-inspired streetwear. Much like the resilient Blattodea, our garments are built with exceptional structural materials, perfect fit drapes, and bulletproof printing layers designed to weather anything in the concrete jungle.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">Quick Navigation</h3>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button onClick={() => { setScreen('home'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors text-left">Home Base</button></li>
              <li><button onClick={() => { setScreen('shop'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors text-left">The Catalog (Shop)</button></li>
              <li><button onClick={() => handleStaticNavigation('about')} className="hover:text-amber-400 transition-colors text-left font-semibold text-gray-400">Survival Brand Story</button></li>
              <li><button onClick={() => handleStaticNavigation('contact')} className="hover:text-amber-400 transition-colors text-left">Get in Touch</button></li>
              <li><button onClick={() => handleStaticNavigation('faq')} className="hover:text-amber-400 transition-colors text-left">Troubleshooting FAQs</button></li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">Survival Support</h3>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li><button onClick={() => handleStaticNavigation('size-guide')} className="hover:text-amber-400 transition-colors text-left">Fitting & Size Charts</button></li>
              <li><button onClick={() => handleStaticNavigation('returns')} className="hover:text-amber-400 transition-colors text-left">7-Day Swap Policies</button></li>
              <li><button onClick={() => setScreen('dashboard')} className="hover:text-amber-400 transition-colors text-left">Track Active Dispatches</button></li>
              <li><button onClick={() => handleStaticNavigation('faq')} className="hover:text-amber-400 transition-colors text-left">Secure Gateway Disclaimers</button></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="text-white font-mono font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2">Central Swarm Office</h3>
            <ul className="space-y-3 text-xs text-gray-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Indestructible Complex, Underground Level 3, Wing B, Bandra Kurla Complex, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400" />
                <span className="flex items-center gap-2">
                  <span>+91 9472028969</span>
                  <a 
                    href="https://wa.me/919472028969" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-black px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider transition-colors uppercase"
                  >
                    WhatsApp
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>cockroachkarthelp@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower copyright bar with payment logos */}
        <div className="border-t border-amber-500/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left text-xs text-gray-600">
            <p>© {new Date().getFullYear()} CockroachKart Inc. All designs are registered trademarked carapaces. Built to withstand everything.</p>
            <p className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1 text-[10px]">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-500/60" /> 100% Secure Encrypted SSL Tunnel Checkout</span>
              <span className="text-zinc-800">|</span>
              <button onClick={() => { setScreen('admin' as any); window.scrollTo(0, 0); }} className="text-zinc-600 hover:text-amber-500 transition-colors uppercase font-mono tracking-wider cursor-pointer font-bold">🔒 Root Operator Admin Panel</button>
            </p>
          </div>
          
          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 opacity-60">
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">UPI</span>
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">COD</span>
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">VISA</span>
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">MC</span>
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">PAYPAL</span>
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-neutral-800 rounded px-1.5 py-0.5 bg-neutral-900">PAYTM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
