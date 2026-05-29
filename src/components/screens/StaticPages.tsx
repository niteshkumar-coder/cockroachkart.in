import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { StaticPageType } from '../../types';
import { FAQS } from '../../data';
import { Mail, Phone, MapPin, Send, HelpCircle, Shield, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface StaticPagesProps {
  currentTab: StaticPageType;
  setTab: (tab: StaticPageType) => void;
}

export default function StaticPages({ currentTab, setTab }: StaticPagesProps) {
  // Contact state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Size calculator state
  const [heightInCm, setHeightInCm] = useState(175);
  const [weightInKg, setWeightInKg] = useState(70);
  const [calculatedSize, setCalculatedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');

  const handleCalculateSize = () => {
    // Basic standard size rule
    if (heightInCm > 185 || weightInKg > 85) {
      setCalculatedSize('XXL');
    } else if (heightInCm > 178 || weightInKg > 76) {
      setCalculatedSize('XL');
    } else if (heightInCm > 170 || weightInKg > 65) {
      setCalculatedSize('L');
    } else if (heightInCm > 162 || weightInKg > 54) {
      setCalculatedSize('M');
    } else {
      setCalculatedSize('S');
    }
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Navigation Tabs Bar inside Static Views */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-neutral-900 pb-5">
          {(['about', 'contact', 'faq', 'size-guide', 'returns'] as StaticPageType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setTab(tab);
                setFormSubmitted(false);
              }}
              className={`rounded-lg px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                currentTab === tab
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
                  : 'bg-[#141414] text-neutral-400 border border-neutral-900 hover:border-neutral-800 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Content Renderers */}
        <div className="bg-[#141414] border border-amber-500/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 select-none opacity-[0.03] pointer-events-none h-48 w-48">
            <img 
              src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
              alt="" 
              className="h-full w-full object-contain filter invert opacity-50" 
              referrerPolicy="no-referrer"
            />
          </div>

          {currentTab === 'about' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-400/5 px-2.5 py-1 rounded border border-amber-500/10">Survival Story</span>
                <h1 className="text-3xl font-bold tracking-tight font-sans">THE BIOGRAPHY OF THE UNSTOPPABLE</h1>
              </div>

              <div className="space-y-6 text-sm text-neutral-400 leading-relaxed">
                <p>
                  In a world of fast-fading fashion trends and shirts that shrink to oblivion on their third spin, we asked ourselves: <em className="text-amber-400 not-italic font-semibold">What is the most resilient entity on Earth?</em>
                </p>
                <p>
                  Enter the humble <strong>Blattodea (Cockroach)</strong>. Having survived the extinction of the dinosaurs, massive ice ages, and continental breakups with an anatomical structure designed to absorb over <strong className="text-white font-mono">15x human radiation capacities</strong>, it is the ultimate masterpiece of nature's defense design.
                </p>
                <p>
                  At <strong className="text-white">CockroachKart</strong>, we treat apparel manufacturing similarly. We do not construct disposable fast-fashion. We build t-shirts using high-density comb braids, extreme-strength double stitching, and robust prints. Our shirts do not fade, crack, or give up. They are armored comfort built to exist, survive, and dominate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-[#1C1C1E] p-5 rounded-xl border border-neutral-900">
                  <h3 className="text-amber-400 font-mono text-xs font-bold uppercase mb-2">Our Mission</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">To arm global explorers, night crawlers, and street skaters in clothing so structurally honest that it lasts decades. Ultimate fabric survival.</p>
                </div>
                <div className="bg-[#1C1C1E] p-5 rounded-xl border border-neutral-900">
                  <h3 className="text-amber-400 font-mono text-xs font-bold uppercase mb-2">Resilient Sizing</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">Whether boxy streetwear drops, drop shoulder sports meshes, or wash vintage relics, you find comfort calibrated with millimeter accuracy.</p>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'contact' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-400/5 px-2.5 py-1 rounded border border-amber-500/10">Swarm Hotline</span>
                <h1 className="text-3xl font-bold tracking-tight font-sans">CONNECT WITH COCKROACH INTEL</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
                
                {/* Form */}
                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Send a Message</h3>
                  
                  {formSubmitted ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-amber-400/10 border border-amber-400/20 text-amber-400 p-6 rounded-xl text-center space-y-2"
                    >
                      <Check className="h-8 w-8 mx-auto text-amber-400 stroke-[3]" />
                      <h4 className="font-bold font-mono text-sm uppercase">STATION RECEIPT POSITIVE</h4>
                      <p className="text-xs text-neutral-400">Message successfully registered into the central hive tracker. We swarm back in under 4 hours.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Commander Crawler"
                          className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="crawler@survivalist.com"
                          className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-500 uppercase font-bold mb-1">Detailed Message</label>
                        <textarea
                          rows={4}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Query regarding survivor fabric, size recommendations, bulk requests..."
                          className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full cursor-pointer bg-amber-500 hover:bg-amber-600 transition-colors rounded-lg py-2 text-xs font-mono uppercase font-black text-black flex items-center justify-center gap-2"
                      >
                        <Send className="h-3 w-3" /> Broadcast Message
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct info card */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-semibold uppercase font-mono tracking-wider text-amber-400 border-b border-neutral-900 pb-2">Direct Hub</h3>
                  <div className="space-y-3 font-sans text-xs text-neutral-400">
                    <div className="flex gap-2.5">
                      <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Level 3 Consolidated Bunker, BKC, Mumbai 400051</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Phone className="h-4 w-4 text-amber-500" />
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
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-amber-500" />
                      <span>cockroachkarthelp@gmail.com</span>
                    </div>
                    <div className="p-3 border border-amber-500/10 rounded-lg bg-amber-500/5 mt-4">
                      <h4 className="text-white font-mono font-bold text-[10px] uppercase">HIVE STATS</h4>
                      <p className="text-[10px] text-gray-500 mt-1">Average Response Rate: 1.2 Minutes</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">● Ops Status: FULLY ACTIVE</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {currentTab === 'faq' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-400/5 px-2.5 py-1 rounded border border-amber-500/10">Troubleshooter</span>
                <h1 className="text-3xl font-bold tracking-tight font-sans">FREQUENTLY ENCOUNTERED QUERIES</h1>
              </div>

              <div className="space-y-4 pt-4">
                {FAQS.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="border border-neutral-800 rounded-xl overflow-hidden bg-[#18181B] transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-sm hover:text-amber-400 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-amber-400 stroke-[2.5]" />
                          {faq.q}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs leading-relaxed text-neutral-400 border-t border-neutral-900/50 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentTab === 'size-guide' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-400/5 px-2.5 py-1 rounded border border-amber-500/10">Calibrator</span>
                <h1 className="text-3xl font-bold tracking-tight font-sans">DYNAMIC CALIPER SIZE CHART</h1>
              </div>

              {/* Dynamic Size Calculator */}
              <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-xl space-y-6">
                <h3 className="text-sm font-mono uppercase text-amber-400 text-center font-black">🧬 Interactive Carapace Fit Calculator</h3>
                <p className="text-xs text-neutral-500 text-center -mt-4">Drag the sliders below representing your parameters to compute your ideal size.</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-1">
                      <span>HEIGHT IN CENTIMETERS</span>
                      <span className="text-white">{heightInCm} cm</span>
                    </div>
                    <input
                      type="range"
                      min={150}
                      max={205}
                      value={heightInCm}
                      onChange={(e) => setHeightInCm(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono font-bold text-gray-400 mb-1">
                      <span>BODY WEIGHT IN KILOGRAMS</span>
                      <span className="text-white">{weightInKg} kg</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={110}
                      value={weightInKg}
                      onChange={(e) => setWeightInKg(Number(e.target.value))}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-amber-500/20 bg-amber-500/[0.02] rounded-lg">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">YOUR OPTIMAL FIT</span>
                  <span className="text-4xl font-extrabold text-amber-400 font-mono my-1 tracking-widest">{calculatedSize}</span>
                  <button
                    onClick={handleCalculateSize}
                    className="mt-2 text-[10px] uppercase font-mono font-bold text-black bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded cursor-pointer transition-colors"
                  >
                    Compute Recommendation
                  </button>
                </div>
              </div>

              {/* Sizing Table */}
              <div className="overflow-x-auto border border-neutral-800 rounded-xl">
                <table className="w-full text-xs text-left text-neutral-400 font-mono">
                  <thead className="bg-[#1C1C1E] text-white uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="px-4 py-3">Size label</th>
                      <th className="px-4 py-3">Chest (Inches)</th>
                      <th className="px-4 py-3">Front Length (Inches)</th>
                      <th className="px-4 py-3">Shoulder length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">S (Small)</td>
                      <td className="px-4 py-3">38"</td>
                      <td className="px-4 py-3">27.5"</td>
                      <td className="px-4 py-3">17.5"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white text-amber-400">M (Medium)</td>
                      <td className="px-4 py-3">40"</td>
                      <td className="px-4 py-3">28"</td>
                      <td className="px-4 py-3">18"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">L (Large)</td>
                      <td className="px-4 py-3">42"</td>
                      <td className="px-4 py-3">29"</td>
                      <td className="px-4 py-3">19"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">XL (Extra Large)</td>
                      <td className="px-4 py-3">44"</td>
                      <td className="px-4 py-3">30"</td>
                      <td className="px-4 py-3">19.5"</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-white">XXL (Super Large)</td>
                      <td className="px-4 py-3">48"</td>
                      <td className="px-4 py-3">31"</td>
                      <td className="px-4 py-3">20"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentTab === 'returns' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs text-amber-400 font-mono tracking-widest uppercase bg-amber-400/5 px-2.5 py-1 rounded border border-amber-500/10">Worry Free</span>
                <h1 className="text-3xl font-bold tracking-tight font-sans">NO SECRETS RETURN & SWAP CHANNELS</h1>
              </div>

              <div className="space-y-6 text-sm text-neutral-400 leading-relaxed">
                <p>
                  Did the t-shirt drape too tight? Did you select the wrong tint? Do not fear. We follow a strict <strong className="text-white uppercase font-mono">"Zero Scurry" policy</strong> containing:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="border border-neutral-800 p-4 rounded-xl space-y-2">
                    <span className="text-lg">📦</span>
                    <h4 className="text-white font-bold font-mono text-xs uppercase">1. Reverse Pickup</h4>
                    <p className="text-[11px] text-gray-500">We initiate courier pickups right at your doorstep. Zero charges applied.</p>
                  </div>
                  <div className="border border-neutral-800 p-4 rounded-xl space-y-2">
                    <span className="text-lg">⏱️</span>
                    <h4 className="text-white font-bold font-mono text-xs uppercase">2. 7-Day Window</h4>
                    <p className="text-[11px] text-gray-500">Take your sweet time checking thread drapes. Returns accepted up to 7 full days.</p>
                  </div>
                  <div className="border border-neutral-800 p-4 rounded-xl space-y-2">
                    <span className="text-lg">💳</span>
                    <h4 className="text-white font-bold font-mono text-xs uppercase">3. Full Refunds</h4>
                    <p className="text-[11px] text-gray-500">Amount refunded directly to base source card or GPay wallet upon inspection match.</p>
                  </div>
                </div>

                <div className="p-4 border border-amber-500/10 rounded-lg bg-[#111] space-y-1 mt-6">
                  <h4 className="text-white font-mono text-xs font-bold uppercase">👉 Simple Replacement Process:</h4>
                  <ol className="list-decimal pl-4 text-xs text-neutral-500 space-y-1 font-mono pt-1">
                    <li>Go to <strong className="text-amber-400 text-[10px]">MY OBDERS</strong> in your Account dashboard</li>
                    <li>Click <strong className="text-amber-400 text-[10px]">SWAP SEED</strong> next to the respective item</li>
                    <li>Pack the shirt in its original survival sliding pouch</li>
                    <li>The swarm dispatcher arrives to swap keys!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
