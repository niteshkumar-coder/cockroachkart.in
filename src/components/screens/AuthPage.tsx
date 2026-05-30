import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, User, Mail, Phone, Check, RefreshCw, Lock, ExternalLink } from 'lucide-react';
import { ScreenType } from '../../types';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../../firebase';

interface AuthPageProps {
  setScreen: (screen: ScreenType) => void;
  onLoginSuccess: (user: any) => void;
}

export default function AuthPage({ setScreen, onLoginSuccess }: AuthPageProps) {
  // Navigation State: 'entry' is core Auth, 'profile' is Step 2 (Google user needs displayName map)
  const [step, setStep] = useState<'entry' | 'profile'>('entry');
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');
  
  // Credentials and profile parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  
  // State variables for SSO verification mapping
  const [tempGoogleUser, setTempGoogleUser] = useState<any>(null);
  const [authError, setAuthError] = useState('');
  const [connecting, setConnecting] = useState(false);

  // Fallback / Guidance help toggles
  const [showPopupTips, setShowPopupTips] = useState(false);

  // 1. Google Auth Connection Handler (Custom Backend/Sandbox Redirect Protocol)
  const handleGoogleSignInByPopup = async () => {
    setAuthError('');
    setConnecting(true);
    setShowPopupTips(false);

    try {
      const origin = window.location.origin;
      const response = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(origin)}`);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "No extra error body");
        throw new Error(`Could not retrieve authorization credentials from the backend server. Status: ${response.status} (${response.statusText}). Error: ${errorText}`);
      }
      
      const data = await response.json();
      const authUrl = data.url;

      // Calculate perfect centering for popup window coords
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'google-oauth-popup',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popups are blocked by browser iframe constraints
        setShowPopupTips(true);
        setConnecting(false);
        setAuthError("Popup blocked by browser. Please look at your URL bar's right corner to 'Always allow', OR click 'Open in a new tab' at the top-right of your screen.");
        return;
      }

      // Secure event listener to listen to postMessage events from the opened popup
      const handleAuthMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.type === 'OAUTH_AUTH_SUCCESS') {
          window.removeEventListener('message', handleAuthMessage);
          
          const profile = event.data.user;
          const safeUid = 'sso_' + profile.email.replace(/[^a-zA-Z0-9]/g, '');

          // Check if profile exists in Firestore, otherwise write a new record
          try {
            const userDocRef = doc(db, 'users', safeUid);
            const userDocSnap = await getDoc(userDocRef);
            
            let completedProfile;
            if (userDocSnap && userDocSnap.exists()) {
              completedProfile = userDocSnap.data();
            } else {
              completedProfile = {
                uid: safeUid,
                name: profile.name.trim(),
                email: profile.email.trim().toLowerCase(),
                phone: profile.phone || "Google Verified",
                avatarUrl: profile.avatarUrl || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              await setDoc(userDocRef, completedProfile);
            }

            localStorage.setItem('cockroach_current_user', JSON.stringify(completedProfile));
            
            // Sync with backend session
            await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: completedProfile.uid,
                name: completedProfile.name,
                email: completedProfile.email,
                phone: completedProfile.phone,
                password: "SSO_USER_PASSWORD"
              })
            }).catch(err => console.warn("Backend auth sync warning:", err));

            onLoginSuccess(completedProfile);
          } catch (firestoreErr: any) {
            console.warn("Firestore error during Google auth login mapping. Falling back to local SSO:", firestoreErr);
            
            // Fallback: Local auth storage persistence in case Firestore is not fully configured
            const fallbackProfile = {
              uid: safeUid,
              name: profile.name.trim(),
              email: profile.email.trim().toLowerCase(),
              phone: "Google Verified Survivor",
              avatarUrl: profile.avatarUrl || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem('cockroach_current_user', JSON.stringify(fallbackProfile));

            // Sync with backend session
            await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: fallbackProfile.uid,
                name: fallbackProfile.name,
                email: fallbackProfile.email,
                phone: fallbackProfile.phone,
                password: "SSO_USER_PASSWORD"
              })
            }).catch(err => console.warn("Backend auth sync warning:", err));

            onLoginSuccess(fallbackProfile);
          }
        }
      };

      window.addEventListener('message', handleAuthMessage);

      // Periodically check if popup is closed to reset loading state
      const checker = setInterval(() => {
        if (popup.closed) {
          clearInterval(checker);
          setConnecting(false);
        }
      }, 800);

    } catch (err: any) {
      setConnecting(false);
      console.error("Custom Google Authentication Error:", err);
      setAuthError(err.message || "Failed to launch custom Google Handshake interface.");
    }
  };

  // 2. Email & Password Register Handler (Standard non-popup based)
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setShowPopupTips(false);

    if (!name.trim()) {
      setAuthError("Please disclose your survivor registration name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setAuthError("Please fill in email and password fields.");
      return;
    }
    if (password.length < 6) {
      setAuthError("For your safety, password must be at least 6 characters.");
      return;
    }
    if (!termsChecked) {
      setAuthError("Please agree to the ledger registry terms.");
      return;
    }

    setConnecting(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = result.user;

      const completedProfile = {
        uid: firebaseUser.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "Guest Handset",
        avatarUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', completedProfile.uid), completedProfile);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${completedProfile.uid}`);
      }

      // Sync session with full-stack backend
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: completedProfile.uid,
          name: completedProfile.name,
          email: completedProfile.email,
          phone: completedProfile.phone,
          password: password
        })
      }).catch(err => console.warn("Backend auth sync warning:", err));

      localStorage.setItem('cockroach_current_user', JSON.stringify(completedProfile));
      onLoginSuccess(completedProfile);
    } catch (err: any) {
      setConnecting(false);
      console.error("Email/Password registration failed:", err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError("This email is already registered in the registry. Try to Sign In.");
      } else if (err.code === 'auth/weak-password') {
        setAuthError("Selected password is too weak. Please use a stronger string.");
      } else if (err.code === 'auth/invalid-email') {
        setAuthError("The configured Email Address has an invalid format.");
      } else if (err.message && err.message.includes("CONFIGURATION_NOT_FOUND")) {
        setAuthError("Email/Password provider is not yet enabled in your Firebase console. Please go to your Firebase Console -> Authentication -> Sign-in Method, click 'Add new provider', choose 'Email/Password' and click 'Enable'.");
      } else {
        setAuthError(err.message || "Failed to create shopper account.");
      }
    }
  };

  // 3. Email & Password Sign-In Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setShowPopupTips(false);

    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }

    setConnecting(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = result.user;

      // Lookup profile in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      }

      if (userDocSnap && userDocSnap.exists()) {
        const existingProfile = userDocSnap.data();
        
        // Match/Sync session on backend
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: existingProfile.email,
            password: password
          })
        }).catch(async (err) => {
          // Fallback if password didn't sync or first time login on server
          await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: existingProfile.uid,
              name: existingProfile.name,
              email: existingProfile.email,
              phone: existingProfile.phone || "Guest Handset",
              password: password
            })
          }).catch(e => console.warn("Backend login/signup sync failed:", e));
        });

        localStorage.setItem('cockroach_current_user', JSON.stringify(existingProfile));
        onLoginSuccess(existingProfile);
      } else {
        const completedProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.email?.split('@')[0] || "Shopper Core",
          email: firebaseUser.email?.toLowerCase().trim() || '',
          phone: "Guest Handset",
          avatarUrl: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'users', completedProfile.uid), completedProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${completedProfile.uid}`);
        }

        // Sync with backend session
        await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: completedProfile.uid,
            name: completedProfile.name,
            email: completedProfile.email,
            phone: completedProfile.phone,
            password: password
          })
        }).catch(err => console.warn("Backend auth sync warning:", err));

        localStorage.setItem('cockroach_current_user', JSON.stringify(completedProfile));
        onLoginSuccess(completedProfile);
      }
    } catch (err: any) {
      setConnecting(false);
      console.error("Email/Password sign in failed:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setAuthError("No profile matched these credentials. Check details or sign up.");
      } else if (err.code === 'auth/invalid-email') {
        setAuthError("Please provide a valid email structure.");
      } else if (err.message && err.message.includes("CONFIGURATION_NOT_FOUND")) {
        setAuthError("Email/Password login is not enabled in Firebase Authentication yet. Please enable 'Email/Password' in your Firebase dashboard under Authentication -> Sign-in método.");
      } else {
        setAuthError(err.message || "Failed to log in with email.");
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
      <div className="w-full max-w-md bg-[#141414] border border-amber-500/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
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
            <motion.div
              key="auth-portal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {/* Dual-Tab Navigation State selectors */}
              <div className="flex border-b border-neutral-900 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => { setActiveMode('signin'); setAuthError(''); setShowPopupTips(false); }}
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
                  onClick={() => { setActiveMode('signup'); setAuthError(''); setShowPopupTips(false); }}
                  className={`flex-1 text-center pb-3 uppercase tracking-widest font-black transition-all border-b-2 cursor-pointer ${
                    activeMode === 'signup'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="text-center space-y-1.5 ">
                <h2 className="text-sm font-mono tracking-widest text-amber-500 uppercase font-black">
                  {activeMode === 'signin' ? 'CockroachKart Login' : 'Create Customer Profile'}
                </h2>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  {activeMode === 'signin' 
                    ? 'Log back into your registered profile instantly.'
                    : 'Any new survivor can register immediately to purchase premium inventory.'}
                </p>
              </div>

              {authError && (
                <div className="text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono rounded-xl p-3.5 text-center leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}

              {/* Troubleshooting Popup Guidance */}
              {showPopupTips && (
                <div className="bg-amber-500/5 border border-amber-500/25 rounded-xl p-3.5 text-[11px] font-mono text-zinc-300 space-y-2">
                  <div className="font-black text-amber-400 uppercase text-[10px]">💡 How to bypass browser popup limits:</div>
                  <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[10px]">
                    <li>Click <strong>"Open in a new tab"</strong> <ExternalLink className="inline h-3 w-3" /> on top right window.</li>
                    <li>Look at your URL bar's rightmost corner for a <strong>blocked popup icon</strong> and change to "Always allow".</li>
                    <li>Or, simply input your email and password below to log in directly!</li>
                  </ul>
                </div>
              )}

              {/* SECTION A: GOOGLE SSO (Popup based) */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={connecting}
                  onClick={handleGoogleSignInByPopup}
                  className="w-full flex items-center justify-center gap-3 border border-neutral-800 bg-[#1E1E20] hover:bg-[#252528] rounded-xl py-3 text-xs font-mono font-black text-white hover:border-amber-500/40 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99] shadow-lg hover:shadow-amber-500/5 uppercase tracking-widest"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                      Connecting...
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

              {/* OR DIVIDER */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-neutral-900"></div>
                <span className="flex-shrink mx-4 text-zinc-500 uppercase font-mono text-[9px] tracking-widest font-bold">OR USE EMAIL INLINE</span>
                <div className="flex-grow border-t border-neutral-900"></div>
              </div>

              {/* SECTION B: EMAIL/PASSWORD FORM (Perfect backup path!) */}
              <form 
                onSubmit={activeMode === 'signin' ? handleEmailSignIn : handleEmailSignUp} 
                className="space-y-4"
              >
                {activeMode === 'signup' && (
                  <div>
                    <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value); setAuthError(''); setShowPopupTips(false); }}
                        placeholder="Nitesh Kumar"
                        className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 focus:border-amber-500/50 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                      />
                      <User className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setAuthError(''); setShowPopupTips(false); }}
                      placeholder="shopper@survivor.com"
                      className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 focus:border-amber-500/50 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setAuthError(''); setShowPopupTips(false); }}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 focus:border-amber-500/50 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono tracking-widest"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                  </div>
                </div>

                {activeMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[9px] font-mono text-zinc-500 uppercase font-bold mb-1 tracking-wider">
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 91283XXXXX"
                          className="w-full rounded-xl bg-[#1C1C1E] border border-neutral-800 focus:border-amber-500/50 pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none font-mono tracking-wider"
                        />
                        <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-zinc-600" />
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 text-[10px] text-zinc-500 cursor-pointer select-none py-1 hover:text-zinc-400 font-mono">
                      <input
                        type="checkbox"
                        required
                        checked={termsChecked}
                        onChange={() => setTermsChecked(!termsChecked)}
                        className="accent-amber-500 rounded h-3.5 w-3.5 cursor-pointer mt-0.5"
                      />
                      <span className="leading-snug">
                        I agree to register this device secure keychain under <strong className="text-amber-400">Campaign Protocol</strong>.
                      </span>
                    </label>
                  </>
                )}

                <button
                  type="submit"
                  disabled={connecting}
                  className="w-full bg-amber-500 hover:bg-amber-600 font-mono py-3.5 text-xs font-black text-black tracking-widest rounded-xl hover:shadow-amber-500/10 shadow-lg cursor-pointer transition-all uppercase flex items-center justify-center gap-1 w-full disabled:opacity-50"
                >
                  {connecting ? (
                    <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-black stroke-[3]" />
                  ) : activeMode === 'signin' ? (
                    'SIGN IN WITH EMAIL'
                  ) : (
                    'CREATE EMAIL ACCOUNT'
                  )}
                </button>
              </form>

              <div className="flex flex-col gap-2 text-[10px] text-zinc-500 text-center font-mono pt-1">
                {activeMode === 'signin' ? (
                  <p>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveMode('signup'); setAuthError(''); }}
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
                      onClick={() => { setActiveMode('signin'); setAuthError(''); }}
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
            /* --- STEP 3: FINISH PROFILE REGISTRATION (FOR NEW GOOGLE AUTH ONLY WITH NO NAME SET) --- */
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
