import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassContainer, CyberButton } from '../components/UI';
import { CyberParticles } from '../components/CyberParticles';
import { Shield, Lock, User, Terminal as TerminalIcon, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const { loading, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'denied'>('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setStatus('granted');
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('authenticating');
    setError('');
    
    // Normalize Vortex32 to email if applicable
    const normalizedEmail = email.toLowerCase() === 'vortex32' ? 'vortex32@collective.hub' : 
                           (email.includes('@') ? email : `${email.toLowerCase()}@collective.hub`);

    try {
      if (isSignUp) {
        await signUpWithEmail(normalizedEmail, password);
      } else {
        try {
          await signInWithEmail(normalizedEmail, password);
        } catch (err: any) {
          // Auto-provision demo accounts if they don't exist
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            const isDemo = (email === 'Vortex32' && password === '526728') || 
                           (email === 'CadetZero' && password === 'cadet123');
            if (isDemo) {
              await signUpWithEmail(normalizedEmail, password);
              return;
            }
          }
          throw err;
        }
      }
    } catch (err: any) {
      setStatus('denied');
      let msg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = 'IDENTITY_NOT_FOUND';
      if (err.code === 'auth/wrong-password') msg = 'KEY_INVALID';
      if (err.code === 'auth/email-already-in-use') msg = 'UP_LINK_EXISTS';
      if (err.code === 'auth/weak-password') msg = 'KEY_WEAK';
      setError(msg.toUpperCase());
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-grid-white bg-grid-mask pointer-events-none opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-white transition-colors group z-20"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Return</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">Security Node Alpha</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
            PROTOCOL
          </h1>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">Institutional Access Point</p>
        </div>

        <GlassContainer className="rounded-2xl md:rounded-3xl border border-white/10 p-8 md:p-10 bg-black/60 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">{isSignUp ? 'Initialize Node' : 'Secure Uplink'}</h2>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">{isSignUp ? 'New User Registration' : 'Authentication Required'}</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{isSignUp ? 'Identity (Email)' : 'Identity / Login'}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      required
                      type="text"
                      disabled={status === 'authenticating' || status === 'granted'}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/30 transition-all font-mono text-xs"
                      placeholder={isSignUp ? "cadet@collective.hub" : "Vortex32"}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Neural Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      required
                      type="password"
                      disabled={status === 'authenticating' || status === 'granted'}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/30 transition-all font-mono text-xs"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'authenticating' && (
                  <motion.div 
                    key="auth-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-blue-400 text-[10px] font-mono"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    VERIFYING PROTOCOLS...
                  </motion.div>
                )}
                {status === 'denied' && (
                  <motion.div 
                    key="auth-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-500 text-[10px] font-mono font-bold"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <CyberButton 
                type="submit"
                disabled={status === 'authenticating' || status === 'granted'}
                className="w-full py-4 text-xs tracking-[0.3em] font-black"
              >
                {status === 'granted' ? 'UPLINK_STABLE' : isSignUp ? 'CREATE_NODE' : 'AUTHORIZE_NODE'}
              </CyberButton>

              {!isSignUp && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('Vortex32');
                      setPassword('526728');
                    }}
                    className="py-3 px-2 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <Shield className="w-3 h-3 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-mono text-blue-500/80 uppercase tracking-widest font-black">Command Access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('CadetZero');
                      setPassword('cadet123');
                    }}
                    className="py-3 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
                  >
                    <User className="w-3 h-3 text-white/40 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-black">Cadet Access</span>
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full py-2 text-[10px] font-mono text-white/40 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
                >
                  {isSignUp ? 'Already registered? Login' : 'New identity? Register here'}
                </button>
              </div>
            </div>
            
            <p className="text-[8px] font-mono text-white/10 uppercase tracking-widest text-center">
              Tier 1 Encryption Active / Secure Environment
            </p>
          </form>
        </GlassContainer>

        <div className="mt-8 text-center opacity-20 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] font-mono text-white tracking-[0.2em]">© 2026 ACADEMY DEFENSE SYSTEMS</p>
        </div>
      </motion.div>
    </div>
  );
};
