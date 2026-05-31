import React, { useState } from 'react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Terminal, Shield, Zap, Target, Cpu, Database, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const LABS = [
  {
    id: 'l1',
    title: 'Neural Breach #01',
    category: 'System Exploitation',
    difficulty: 'Basic',
    status: 'Ready',
    points: 150,
    description: 'Intercept and decrypt traffic between node A and B to discover the root password.',
    tech: ['Wireshark', 'Metasploit', 'Python']
  },
  {
    id: 'l2',
    title: 'Cortex Injection',
    category: 'Web Security',
    difficulty: 'Intermediate',
    status: 'Locked',
    points: 450,
    description: 'Execute a multi-stage SQL injection to extract the administrative biometric hash.',
    tech: ['SQLMap', 'Burp Suite', 'Postgres']
  },
  {
    id: 'l3',
    title: 'Shadow Protocol',
    category: 'Cryptography',
    difficulty: 'Advanced',
    status: 'Active',
    points: 900,
    description: 'Reconstruct a fractured RSA key scattered across the decentralized ledger.',
    tech: ['Hashcat', 'Custom Scripts', 'Blockchain']
  }
];

export const CyberRange = () => {
  const [activeLab, setActiveLab] = useState<string | null>(null);

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Cyber Range" subtitle="Hostile Environment Simulation" />
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="font-mono text-xs">
            <span className="text-white/30 block tracking-widest uppercase">Range Load</span>
            <span className="text-cyan-400 font-bold">24% CAPACITY</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {LABS.map((lab) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
          >
            <ClippedContainer className={cn(
              "p-8 h-full flex flex-col justify-between border-white/5",
              lab.status === 'Locked' && "opacity-50 grayscale pointer-events-none"
            )}>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border",
                    lab.difficulty === 'Basic' ? "bg-green-500/10 border-green-500/30 text-green-400" :
                    lab.difficulty === 'Intermediate' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                    "bg-red-500/10 border-red-500/30 text-red-400"
                  )}>
                    {lab.difficulty === 'Basic' ? <Shield className="w-6 h-6" /> : 
                     lab.difficulty === 'Intermediate' ? <Zap className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-400/10 px-3 py-1 rounded-full">{lab.points} XP</span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{lab.title}</h3>
                  <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase">{lab.category}</span>
                </div>

                <p className="text-[10px] text-white/50 leading-relaxed font-mono min-h-[40px]">
                  {lab.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {lab.tech.map((t) => (
                    <span key={t} className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white/40 uppercase font-mono tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className={cn(
                  "text-[8px] font-mono font-bold tracking-[0.3em] uppercase",
                  lab.status === 'Ready' ? "text-green-500" : "text-cyan-400"
                )}>
                  {lab.status}
                </span>
                <CyberButton className="py-2 px-6 text-[10px] uppercase font-black tracking-widest">
                  Deploy
                </CyberButton>
              </div>
            </ClippedContainer>
          </motion.div>
        ))}
      </div>

      <ClippedContainer className="p-12 border-white/5" color="amber">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <TechHeader title="Range Rules" subtitle="Operational Guidelines" color="amber" />
            <ul className="space-y-4 font-mono text-xs text-white/50">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
                No physical extraction of simulation hardware.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
                Network flooding beyond 500Gbps results in node lockout.
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
                All biometric logs are recorded for academic review.
              </li>
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-transparent blur-2xl opacity-50" />
            <div className="relative bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
               <div className="flex items-center gap-4 mb-4">
                  <Database className="w-8 h-8 text-amber-500" />
                  <span className="text-xl font-black italic uppercase text-white tracking-tighter">Instance: OMEGA-4</span>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-[10px] uppercase font-mono">
                    <span className="text-white/30">Latency</span>
                    <span className="text-amber-500">12ms</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500" 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </ClippedContainer>
    </div>
  );
};
