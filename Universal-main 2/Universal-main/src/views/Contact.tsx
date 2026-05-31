import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Terminal, Shield, Cpu, Network, 
  MessageSquare, User, Mail, ChevronRight, 
  AlertCircle, CheckCircle2, Loader2, Globe, Lock,
  ArrowLeft
} from 'lucide-react';
import { CyberButton, ClippedContainer } from '../components/UI';
import { useNavigate } from 'react-router-dom';

const TypewriterText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

const StatusLine = ({ text, status }: { text: string; status: 'loading' | 'success' | 'error' | 'idle' }) => {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
      <div className={`w-1 h-1 rounded-full ${
        status === 'loading' ? 'bg-cyan-400 animate-pulse' :
        status === 'success' ? 'bg-green-400' :
        status === 'error' ? 'bg-red-400' :
        'bg-white/20'
      }`} />
      <span className="text-white/40">{text}</span>
    </div>
  );
};

export const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addTerminalLine = (line: string) => {
    setTerminalLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${line}`].slice(-10));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    addTerminalLine("Universal Terminal Node v4.0.2 initialized.");
    addTerminalLine("Establishing secure encrypted handshake...");
    addTerminalLine("Channel connection: STABLE.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    addTerminalLine("Initiating packet transmission...");
    addTerminalLine(`Encoding payload: ${formData.subject.slice(0, 10)}...`);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        addTerminalLine("Transmission status: SUCCESS.");
        addTerminalLine("Connection terminated gracefully.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.error || "Uplink failure.");
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message);
      addTerminalLine(`ERROR: ${err.message}`);
      addTerminalLine("Retrying connection protocols recommended.");
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.03] scale-150 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors font-mono text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Abort and Return
        </button>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: UI Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center glow-blue">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="h-px w-12 bg-cyan-500/30" />
                <span className="font-mono text-xs uppercase tracking-[0.3em]">Neural Link Status</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white leading-none">
                <TypewriterText text="INITIALIZE" delay={100} /> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">CONNECTION</span>
              </h1>
              <p className="text-white/40 font-mono text-sm max-w-md leading-relaxed">
                Direct uplink to UNIVERSAL core intelligence. Current queue: LOW. Secure data transfer active.
              </p>
            </div>

            {/* Terminal Mockup */}
            <div className="bg-black/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Universal_Terminal.sys</span>
              </div>
              <div className="p-6 h-48 font-mono text-xs text-cyan-400/80 space-y-2 overflow-y-auto" ref={scrollRef}>
                {terminalLines.map((line, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {line}
                  </motion.div>
                ))}
                <div className="flex items-center gap-2">
                  <span>{">"}</span>
                  <div className="w-2 h-4 bg-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Social / Info Nodes */}
            <div className="grid grid-cols-2 gap-4">
              <ClippedContainer className="p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Main Node</div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">universal.cyber.p@gmail.com</div>
                  </div>
                </div>
              </ClippedContainer>
              <ClippedContainer className="p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Encryption</div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">AES-256 E2EE Enabled</div>
                  </div>
                </div>
              </ClippedContainer>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-2xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none rounded-3xl" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                      <User className="w-3 h-3" /> Operative Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10"
                      placeholder="Ident Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                      <Mail className="w-3 h-3" /> Secure Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10"
                      placeholder="Operative@link.sys"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                    <Shield className="w-3 h-3" /> Communication Subject
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10"
                    placeholder="Protocol Intent"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                    <MessageSquare className="w-3 h-3" /> Encrypted Payload
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10 resize-none"
                    placeholder="Input transmission details..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex flex-col gap-2">
                  <StatusLine 
                    text="Establishing secure connection..." 
                    status={status === 'submitting' ? 'loading' : status === 'success' ? 'success' : 'idle'} 
                  />
                  <StatusLine 
                    text="Encrypting transmission..." 
                    status={status === 'submitting' ? 'loading' : status === 'success' ? 'success' : 'idle'} 
                  />
                  {status === 'success' && <StatusLine text="Payload delivered." status="success" />}
                  {status === 'error' && <StatusLine text={errorMessage} status="error" />}
                </div>

                <CyberButton 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full py-5 text-xl font-black italic flex items-center justify-center gap-3"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-black" />
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      INITIALIZE CONNECTION
                    </>
                  )}
                </CyberButton>
              </div>
            </form>

            {/* Success Overlay */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-3xl z-50 flex flex-col items-center justify-center text-center p-8 space-y-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center glow-blue"
                  >
                    <CheckCircle2 className="w-10 h-10 text-black" />
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black italic text-white">CONNECTION ESTABLISHED</h2>
                    <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
                      Transmission successful. Digital operatives are reviewing your uplink.
                    </p>
                  </div>
                  <CyberButton 
                    variant="ghost" 
                    onClick={() => setStatus('idle')}
                    className="px-8 border-white/20"
                  >
                    RETURN TO TERMINAL
                  </CyberButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
