import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, Mail, Phone, Check, RefreshCw } from 'lucide-react';
import { ScreenType } from '../../types';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../../firebase';

interface AuthPageProps {
  setScreen: (screen: ScreenType) => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthPage({ setScreen, onLoginSuccess }: AuthPageProps) {
  // Authentication status view state: 'entry' (SSO Trigger) | 'profile' (Step 2 configuration for new accounts only)
  const [step, setStep] = useState<'entry' | 'profile'>('entry');
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');
  
  // Custom states for newly registering accounts
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [tempGoogleUser, setTempGoogleUser] = useState<any>(null);

  const [authError, setAuthError] = useState('');
  const [connecting, setConnecting] = useState(false);

  // Firebase Google SSO Initiator with Firestore registration / check
  const handleGoogleSignInByPopup = async () => {
    setAuthError('');
    setConnecting(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser || !firebaseUser.email) {
        throw new Error("Could not retrieve a valid email from your Google account.");
      }

      // Check if user profile already exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      }

      if (userDocSnap && userDocSnap.exists()) {
        // Welcome back registered user instantly!
        const existingProfile = userDocSnap.data();
        
        // Sync local storage for SPA compatibility
        localStorage.setItem('cockroach_current_user', JSON.stringify(existingProfile));
        onLoginSuccess(existingProfile);
      } else {
        // Brand New User in Firestore!
        const registrationData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || '',
          phone: firebaseUser.phoneNumber || ''
        };

        // If the Google profile already contains a displayName, register and save instantly!
        if (registrationData.name.trim()) {
          const completedProfile = {
            uid: registrationData.uid,
            name: registrationData.name.trim(),
            email: registrationData.email.trim().toLowerCase(),
            phone: registrationData.phone || "Google Verified",
            avatarUrl: registrationData.avatarUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          try {
            await setDoc(doc(db, 'users', completedProfile.uid), completedProfile);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `users/${completedProfile.uid}`);
          }

          localStorage.setItem('cockroach_current_user', JSON.stringify(completedProfile));
          onLoginSuccess(completedProfile);
        } else {
          // No user name: transition to Step 2 profile setup screen
          setTempGoogleUser(registrationData);
          setName('');
          setStep('profile');
        }
      }
    } catch (err: any) {
      setConnecting(false);
      console.error("Firebase Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setAuthError("Popup blocked by browser. Please enable popups/redirects to sign in.");
      } else if (err.code === 'auth/closed-by-user') {
        setAuthError("Sign-in popup closed by user before completing authentication.");
      } else {
        setAuthError(err.message || "Failed to authenticate your Google profile via Firebase.");
      }
    }
  };

  // Profile setup handler (Step 2, asked after successful SSO validation but missing displayName)
  const handleSignUpComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!name.trim()) {
      setAuthError("Please disclose your survivor registration name.");
      return;
    }

    if (!termsChecked) {
      setAuthError("Please agree to the ledger registry terms.");
      return;
    }

    if (!tempGoogleUser?.uid) {
      setAuthError("Google user credentials expired. Please reload and log in again.");
      return;
    }

    const completedProfile = {
      uid: tempGoogleUser.uid,
      name: name.trim(),
      email: tempGoogleUser.email.trim().toLowerCase(),
      phone: phone.trim() || tempGoogleUser.phone || "Guest Handset",
      avatarUrl: tempGoogleUser.avatarUrl || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      setConnecting(true);
      await setDoc(doc(db, 'users', completedProfile.uid), completedProfile);
    } catch (err) {
      setConnecting(false);
      handleFirestoreError(err, OperationType.WRITE, `users/${completedProfile.uid}`);
    }

    localStorage.setItem('cockroach_current_user', JSON.stringify(completedProfile));
    onLoginSuccess(completedProfile);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#141414] border border-amber-500/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Decorative Watermark bg */}
        <div className="absolute -top-10 -right-10 select-none opacity-[0.03] h-36 w-36 pointer-events-none">
          <img 
            src="https://i.ibb.co/LhkQwD3z/Gemini-Generated-Image-noyty8noyty8noyt-1-removebg-preview.png" 
            alt="" 
            className="h-full w-full object-contain filter invert opacity-50" 
            referrerPolicy="no-referrer"
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 'entry' && (
            /* --- STEP 1: GOOGLE HANDSHAKE PORTAL --- */
            <motion.div
              key="sso-portal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {/* Dual-Tab Navigation State selectors */}
              <div className="flex border-b border-neutral-900 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className={`flex-1 text-center pb-3 uppercase tracking-widest font-black transition-all border-b-2 cursor-pointer ${
                    activeMode === 'signin'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('signup')}
                  className={`flex-1 text-center pb-3 uppercase tracking-widest font-black transition-all border-b-2 cursor-pointer ${
                    activeMode === 'signup'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center space-y-1.5 pb-2">
                <h2 className="text-sm font-mono tracking-widest text-amber-500 uppercase font-black">
                  {activeMode === 'signin' ? 'CockroachKart Login' : 'Create Google SSO Account'}
                </h2>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  {activeMode === 'signin' 
                    ? 'Log back into your registered profile instantly.'
                    : 'Any new user can register immediately using their Google Workspace profile.'}
                </p>
              </div>

              {/* Informative credentials status panel */}
              <div className="bg-[#1C1D20] border border-neutral-800 rounded-xl p-4 text-[11px] font-mono text-gray-400 space-y-1">
                <span className="text-amber-500 font-bold uppercase block text-[10px] tracking-wide mb-1">
                  🛡️ Secure Google Identity Integration
                </span>
                <p className="leading-relaxed">
                  Your transactions, loyalty points, and survival shipping coordinates map automatically to your verified Google profile.
                </p>
              </div>

              {authError && (
                <div className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono rounded-lg p-3 text-center leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={connecting}
                  onClick={handleGoogleSignInByPopup}
                  className="w-full flex items-center justify-center gap-3 border border-neutral-800 bg-[#1E1E20] hover:bg-[#252528] rounded-xl py-3.5 text-xs font-mono font-black text-white hover:border-amber-500/40 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] shadow-lg hover:shadow-amber-500/5 uppercase tracking-widest"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                      Connecting with Google...
                    </>
                  ) : (
                    <>
                      <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      {activeMode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2 text-[10px] text-zinc-500 text-center font-mono pt-1">
                <p>Clicking above launches standard Google OAuth 2.0 account selectors in a secure popup sheet.</p>
                {activeMode === 'signin' ? (
                  <p>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveMode('signup')}
                      className="text-amber-500 hover:text-amber-400 underline cursor-pointer font-bold uppercase tracking-wider"
                    >
                      Create Account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveMode('signin')}
                      className="text-amber-500 hover:text-amber-400 underline cursor-pointer font-bold uppercase tracking-wider"
                    >
                      Sign In Instantly
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 'profile' && (
            /* --- STEP 2: FINISH PROFILE REGISTRATION (NEW USERS) --- */
            <motion.form
              key="profile-setup"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onSubmit={handleSignUpComplete}
              className="space-y-4 font-sans text-left"
            >
              <div className="text-center space-y-1 pb-2 border-b border-neutral-900">
                <span className="text-3xl select-none">🌱</span>
                <h2 className="text-sm font-mono tracking-widest text-amber-500 uppercase font-black">
                  Step 2: Profile Register
                </h2>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  Verification successful! Setup your survivor parameters below.
                </p>
              </div>

              {/* Full name coordinate */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1.5">
                  Survivor Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nitesh Kumar"
                    className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 pl-10 pr-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                </div>
              </div>

              {/* optional Handset number */}
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase font-bold mb-1.5">
                  Handset Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 91283XXXXX"
                    className="w-full rounded-lg bg-[#1C1C1E] border border-neutral-800 pl-10 pr-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono tracking-wider"
                  />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                </div>
              </div>

              {/* Verified details view */}
              <div className="bg-[#1C1D20] border border-neutral-800 rounded-lg p-3 space-y-2 text-[10px] font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase text-[9px]">Verified Google SSO Email:</span>
                  <span className="text-white break-all text-right max-w-[180px] font-bold">{tempGoogleUser?.email || ''}</span>
                </div>
              </div>

              {authError && (
                <div className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-center leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}

              <label className="flex items-start gap-2.5 text-[10px] text-zinc-500 cursor-pointer select-none py-1.5 hover:text-zinc-400 font-mono">
                <input
                  type="checkbox"
                  required
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                  className="accent-amber-500 rounded h-3.5 w-3.5 cursor-pointer mt-0.5"
                />
                <span className="leading-snug">
                  Agree to the terms of <strong className="text-amber-400">CJP Campaign Protocol</strong>. Verification maps your transactions securely to your devices.
                </span>
              </label>

              <button
                type="submit"
                className="w-full mt-2 cursor-pointer rounded-xl bg-amber-500 hover:bg-amber-600 transition-all py-3.5 text-xs font-mono uppercase font-black text-black tracking-widest shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <Check className="h-4 w-4 stroke-[3]" />
                CREATE SHIELD ACCOUNT
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* SECURE DEPLOYMENT FOOTER */}
        <div className="border-t border-neutral-900 text-[10px] text-zinc-500 text-center font-mono flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
          SSL AES-256 Google authentication handshake active
        </div>

      </div>
    </div>
  );
}
