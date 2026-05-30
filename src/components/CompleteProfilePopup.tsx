import React, { useState } from 'react';
import { User, Phone, Check, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';

interface CompleteProfilePopupProps {
  currentUser: any;
  onSubmit: (name: string, phone: string) => Promise<void>;
  onLogout: () => void;
}

export default function CompleteProfilePopup({ currentUser, onSubmit, onLogout }: CompleteProfilePopupProps) {
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please disclose your survivor full name.');
      return;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setError('A valid primary mobile phone number is required.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Handset number must contain at least 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(name.trim(), cleanPhone);
    } catch (err: any) {
      setError(err?.message || 'Error updating profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="profile-popup-overlay" className="fixed inset-0 z-50 backdrop-blur-xl bg-[#080808]/85 flex items-center justify-center p-4">
      <div 
        id="profile-popup-card"
        className="w-full max-w-md bg-[#141414] border border-amber-500/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.12)] relative overflow-hidden space-y-6"
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xl font-bold select-none">
            🌱
          </div>
          <h2 className="text-base font-mono tracking-widest text-[#D4A853] uppercase font-black">
            ACCOUNT REGISTRATION
          </h2>
          <p className="text-[11px] text-zinc-400 font-mono leading-relaxed max-w-xs mx-auto">
            You have successfully connected with Google! Please complete your shopper parameters below to enable secure order syncing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* USER NAME */}
          <div>
            <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5 tracking-wider">
              Survivor Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="e.g. Nitesh Kumar"
                className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 pl-10 pr-3 py-2.5 text-xs text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 font-mono"
              />
              <User className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-neutral-600" />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div>
            <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1.5 tracking-wider">
              Handset Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
                placeholder="e.g. 91283XXXXX"
                className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 pl-10 pr-3 py-2.5 text-xs text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 font-mono tracking-wider"
              />
              <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-neutral-600" />
            </div>
          </div>

          {error && (
            <div className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-all py-3.5 text-xs font-mono uppercase font-black text-black tracking-widest shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50"
          >
            {submitting ? (
              <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-black stroke-[3]" />
            ) : (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                INITIALIZE ACCOUNT LEDGER
              </>
            )}
          </button>
        </form>

        {/* LOGOUT SECURE ACTION */}
        <div className="border-t border-neutral-900 pt-4 flex flex-col gap-2.5">
          <div className="text-[9px] text-[#A67C37]/80 font-mono text-center flex items-center justify-center gap-1 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            SSL AES-256 secure transactional handshake
          </div>
          
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-center text-[10px] font-mono text-zinc-500 hover:text-rose-400 transition-colors uppercase font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out of Swarm
          </button>
        </div>
      </div>
    </div>
  );
}
