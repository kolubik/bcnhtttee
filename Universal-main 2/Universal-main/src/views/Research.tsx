import React, { useState } from 'react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { FlaskConical, FileText, Search, Plus, ExternalLink, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const PUBLICATIONS = [
  {
    id: '1',
    title: 'Adversarial Attacks on Neural Audio Synthesis',
    author: 'Ghost_Zero',
    date: '2026-05-10',
    type: 'ARTICLE',
    tags: ['AI', 'Audio', 'Attacks'],
    summary: 'An exploration of latent space perturbations in diffusion models for audio hijacking.'
  },
  {
    id: '2',
    title: 'Formal Verification of Smart Contract Logic',
    author: 'Logic_Flow',
    date: '2026-05-08',
    type: 'THESIS',
    tags: ['Solidity', 'Blockchain', 'Math'],
    summary: 'A mathematical approach to identifying edge-case vulnerabilities in complex DeFi protocols.'
  }
];

export const Research = () => {
  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="Research & Development" 
        subtitle="Cybersecurity Scientific Intelligence" 
        actions={
          <CyberButton className="flex items-center gap-2 py-4 px-8">
            <Plus className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest">Publish Work</span>
          </CyberButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 border-b-2 border-cyan-400 pb-4 -mb-4.5">Latest Publications</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors pb-4">Peer Review Feed</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors pb-4">Archives</button>
          </div>

          <div className="space-y-6">
            {PUBLICATIONS.map((pub) => (
              <motion.div key={pub.id} whileHover={{ x: 4 }}>
                <ClippedContainer className="p-8 group hover:border-cyan-500/30 transition-all cursor-pointer bg-white/[0.01]">
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
                          {pub.type}
                        </span>
                        <div className="flex items-center gap-2 text-[8px] font-mono text-white/30 uppercase tracking-widest">
                          <Calendar className="w-3 h-3" />
                          {new Date(pub.date).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-xs text-white/40 font-mono leading-relaxed max-w-2xl">
                        {pub.summary}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                              <User className="w-2 h-2 text-white/40" />
                           </div>
                           <span className="text-[10px] font-mono text-cyan-400">{pub.author}</span>
                        </div>
                        <div className="flex gap-2">
                           {pub.tags.map(tag => (
                             <span key={tag} className="text-[8px] text-white/20 font-mono">#{tag}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                    <FileText className="w-12 h-12 text-white/5 group-hover:text-cyan-500/20 transition-colors" />
                  </div>
                </ClippedContainer>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <ClippedContainer className="p-8 border-cyan-500/20 bg-cyan-500/5">
             <TechHeader title="Academic Core" subtitle="Statistics & Impact" />
             <div className="mt-8 space-y-6">
                <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                   <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Total Citations</span>
                   <span className="text-2xl font-black text-white italic">4,281</span>
                </div>
                <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                   <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Publications</span>
                   <span className="text-2xl font-black text-white italic">156</span>
                </div>
                <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                   <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Active Researchers</span>
                   <span className="text-2xl font-black text-white italic">892</span>
                </div>
             </div>
             <CyberButton variant="ghost" className="w-full mt-8 uppercase tracking-widest py-3">
                View Faculty
             </CyberButton>
          </ClippedContainer>

          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
             <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-400" />
                Research Topics
             </h4>
             <div className="flex flex-wrap gap-2">
                {['Exploit Dev', 'Quantum Crypto', 'AI Safety', 'Bio-Hacking', 'Satellite Sec', 'IoT Hardening'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono text-white/40 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-pointer">
                    {tag}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
