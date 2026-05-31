import React, { useState } from 'react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Globe, Shield, Zap, Target, ExternalLink, RefreshCw, Star, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const EVENTS = [
  {
    id: '1',
    title: 'UA-Cyber Challenge 2026',
    date: '2026-05-20',
    type: 'JEOPARDY',
    location: 'Kyiv / Hybrid',
    local: true,
    url: 'https://ctftime.org'
  },
  {
    id: '2',
    title: 'Google CTF 2026',
    date: '2026-06-12',
    type: 'GLOBAL',
    location: 'Online',
    local: false,
    url: 'https://ctftime.org'
  }
];

export const CTF = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="CTF Tactical Center" 
        subtitle="Competitive Intelligence & Operations" 
        actions={
          <div className="flex gap-4">
             <CyberButton variant="ghost" className="flex items-center gap-2 py-4 px-6 border-white/10">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                <span className="text-[10px] uppercase font-black tracking-widest">Sync CTFtime</span>
             </CyberButton>
             <CyberButton className="flex items-center gap-2 py-4 px-6">
                <PlusIcon className="w-4 h-4" />
                <span className="text-[10px] uppercase font-black tracking-widest">Add Local Event</span>
             </CyberButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Upcoming Operations</h3>
             <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-3 h-3 rounded-full border border-white/20"></div>
                   <span className="text-[8px] font-mono text-white/40 uppercase">All Events</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className="w-3 h-3 rounded-full bg-cyan-500 border border-cyan-500/50"></div>
                   <span className="text-[8px] font-mono text-cyan-400 uppercase">Local Only</span>
                </label>
             </div>
          </div>

          <div className="space-y-4">
            {EVENTS.map((event) => (
              <ClippedContainer key={event.id} className="p-6 group hover:border-cyan-500/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center w-16 py-2 bg-white/5 rounded-xl border border-white/10">
                      <span className="block text-lg font-black text-white italic font-mono leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">
                        {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                          {event.title}
                        </h4>
                        {event.local && (
                          <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-widest">
                            LOCAL
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[9px] font-mono text-white/30 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {event.location}</span>
                        <span className="w-px h-2 bg-white/10"></span>
                        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> {event.type}</span>
                      </div>
                    </div>
                  </div>
                  <CyberButton variant="ghost" className="md:w-32 py-3 border-white/5 hover:border-cyan-500/30">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    <span className="text-[8px]">Intelligence</span>
                  </CyberButton>
                </div>
              </ClippedContainer>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <ClippedContainer className="p-8 bg-cyan-500/5 border-cyan-500/20">
              <div className="flex items-center gap-3 mb-8">
                 <Star className="w-6 h-6 text-cyan-400" />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">CTF Stats</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[8px] font-mono uppercase tracking-[0.2em] mb-2">
                       <span className="text-white/30">Global Ranking</span>
                       <span className="text-white">#1,402</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[15%] h-full bg-cyan-500"></div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                       <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Solved</span>
                       <span className="text-xl font-black text-white">42</span>
                    </div>
                    <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                       <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Impact</span>
                       <span className="text-xl font-black text-white">2.4k</span>
                    </div>
                 </div>
              </div>
           </ClippedContainer>

           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-amber-500">
                 <Info className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Activation Required</span>
              </div>
              <p className="text-[10px] text-white/40 font-mono leading-relaxed uppercase tracking-widest">
                Capture the Flag module is currently ACTIVE. You can toggle this setting in your operational profile to hide CTF telemetry.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
