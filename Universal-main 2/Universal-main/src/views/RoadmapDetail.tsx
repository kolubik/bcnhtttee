import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { 
  ChevronLeft, Target, Zap, Clock, ShieldCheck, 
  Lock, CheckCircle2, Circle, AlertCircle, Info,
  Trophy, GraduationCap, Code
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Milestone {
  id: string;
  title: string;
  type: 'MISSION' | 'LAB' | 'CERT' | 'SKILL';
  completed: boolean;
  xp: number;
}

interface Level {
  level: number;
  title: string;
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED';
  milestones: Milestone[];
}

const MOCK_ROADMAP: Record<string, any> = {
  'red-team': {
    title: 'Red Team Operations',
    description: 'Master the art of offensive security from initial access to objective completion.',
    levels: [
      {
        level: 1,
        title: 'Initial Access Vector',
        status: 'AVAILABLE',
        milestones: [
          { id: 'm1', title: 'Phishing Simulation Alpha', type: 'MISSION', completed: true, xp: 500 },
          { id: 'm2', title: 'Breach: SMB Ghost', type: 'LAB', completed: false, xp: 800 },
          { id: 'm3', title: 'Network Scoping', type: 'MISSION', completed: true, xp: 300 }
        ]
      },
      {
        level: 2,
        title: 'Persistence & Stability',
        status: 'LOCKED',
        milestones: [
          { id: 'm4', title: 'Kernel Hooking Lab', type: 'LAB', completed: false, xp: 1200 },
          { id: 'm5', title: 'Registry Hijacking', type: 'MISSION', completed: false, xp: 600 }
        ]
      }
    ]
  },
  'scientific-theses': {
    title: 'Scientific Theses',
    description: 'Academic research and peer-reviewed technical documentation for the Central Intelligence Collective.',
    isScientific: true,
    sections: [
      {
        title: 'Обычные',
        color: 'amber',
        items: [
          { id: 'st1', title: 'Neural Network Vulnerabilities in Audio Synthesis', status: 'Published', date: '2024', xp: 2000 },
          { id: 'st2', title: 'Advanced Malware Analysis in Linux Kernels', status: 'Peer Review', date: '2025', xp: 1500 }
        ]
      },
      {
        title: 'Международные',
        color: 'cyan',
        items: [
          { id: 'st3', title: 'Cross-Platform Memory Corruption Analysis', status: 'International', date: '2024', xp: 5000 },
          { id: 'st4', title: 'Quantum Cryptography in Edge Computing Nodes', status: 'Summit Case', date: '2023', xp: 4500 }
        ]
      }
    ]
  }
};

export const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const roadmap = MOCK_ROADMAP[id || ''] || MOCK_ROADMAP['red-team'];

  return (
    <div className="space-y-12 pb-32">
      <div className="flex items-center justify-between">
        <CyberButton onClick={() => navigate('/academy')} variant="ghost">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Academy
        </CyberButton>
        <div className="flex items-center gap-4 text-white/20 font-mono text-[10px] uppercase tracking-widest">
           <span className="flex items-center gap-2"><Trophy className="w-3 h-3" /> Master Certificate Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div className="space-y-4">
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{roadmap.title}</h1>
              <p className="text-sm text-white/40 font-mono leading-relaxed max-w-2xl">{roadmap.description}</p>
           </div>

           {roadmap.isScientific ? (
             <div className="space-y-16">
               {(roadmap.sections || []).map((section: any) => (
                 <div key={section.title} className="space-y-8">
                   <div className="flex items-center gap-4">
                      <div className={cn("w-2 h-2 rounded-full", section.color === 'cyan' ? 'bg-cyan-500' : 'bg-amber-500')} />
                      <h2 className="text-lg font-black italic text-white uppercase tracking-widest">{section.title}</h2>
                      <div className="flex-1 h-px bg-white/5" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(section.items || []).map((item: any) => (
                        <ClippedContainer key={item.id} className="p-8 group hover:scale-[1.02] cursor-pointer transition-all border-white/5 hover:border-white/20">
                          <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                              section.color === 'cyan' ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            )}>
                              <Target className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{item.date}</span>
                          </div>
                          <h3 className="text-sm font-black italic text-white uppercase tracking-tighter leading-snug mb-6 group-hover:text-white transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className={cn(
                              "text-[8px] font-mono uppercase tracking-[0.2em] font-black",
                              section.color === 'cyan' ? "text-cyan-500/60" : "text-amber-500/60"
                            )}>
                              {item.status}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">+{item.xp} XP</span>
                          </div>
                        </ClippedContainer>
                      ))}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="space-y-8 relative">
                {/* Vertical Progress Line */}
                <div className="absolute left-6 top-8 bottom-8 w-px bg-white/5" />
                
                {roadmap.levels.map((lvl: Level, idx: number) => (
                  <div key={lvl.level} className="relative pl-20 transition-all">
                    {/* Level Indicator Node */}
                    <div className={cn(
                      "absolute left-2 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                      lvl.status === 'COMPLETED' ? "bg-green-500/20 border-green-500 text-green-500" :
                      lvl.status === 'AVAILABLE' ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" :
                      "bg-[#0a0a0a] border-white/10 text-white/20"
                    )}>
                      {lvl.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-black">{lvl.level}</span>}
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div>
                            <h3 className={cn(
                              "text-xl font-black italic uppercase tracking-tighter",
                              lvl.status === 'LOCKED' ? "text-white/20" : "text-white"
                            )}>
                              Level {lvl.level}: {lvl.title}
                            </h3>
                         </div>
                         {lvl.status === 'LOCKED' && <Lock className="w-4 h-4 text-white/10" />}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {lvl.milestones.map(milestone => (
                           <ClippedContainer 
                             key={milestone.id} 
                             className={cn(
                               "p-6 group cursor-pointer transition-all",
                               lvl.status === 'LOCKED' ? "opacity-40 grayscale pointer-events-none" : "hover:border-cyan-500/30"
                             )}
                           >
                              <div className="flex items-start justify-between mb-4">
                                 <div className={cn(
                                   "w-10 h-10 rounded-xl flex items-center justify-center",
                                   milestone.completed ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"
                                 )}>
                                    {milestone.type === 'MISSION' ? <Target className="w-5 h-5" /> : 
                                     milestone.type === 'LAB' ? <Code className="w-5 h-5" /> : 
                                     <GraduationCap className="w-5 h-5" />}
                                 </div>
                                 {milestone.completed ? (
                                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                                 ) : (
                                   <Circle className="w-4 h-4 text-white/10 group-hover:text-cyan-500/30" />
                                 )}
                              </div>
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{milestone.title}</h4>
                              <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                                 <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{milestone.type} Node</span>
                                 <span className="text-[10px] font-mono text-cyan-400">+{milestone.xp} XP</span>
                              </div>
                           </ClippedContainer>
                         ))}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="space-y-8">
           <ClippedContainer className="p-8 border-cyan-500/20 bg-cyan-500/5">
              <TechHeader title="Operative Progress" subtitle="Mission Mastery" />
              <div className="mt-8 space-y-6">
                 <div>
                    <div className="flex justify-between text-[8px] font-mono uppercase tracking-[0.2em] mb-2">
                       <span className="text-white/30">Sync Status</span>
                       <span className="text-white">45%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[45%] h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/10">
                       <span className="text-[9px] font-mono text-white/40 uppercase">Missions Solved</span>
                       <span className="text-sm font-bold text-white">12/30</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/10">
                       <span className="text-[9px] font-mono text-white/40 uppercase">Labs Cleared</span>
                       <span className="text-sm font-bold text-white">4/12</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/10">
                       <span className="text-[9px] font-mono text-white/40 uppercase">Skill Nodes</span>
                       <span className="text-sm font-bold text-white">156/400</span>
                    </div>
                 </div>
              </div>
           </ClippedContainer>

           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                 <AlertCircle className="w-4 h-4 text-amber-500" />
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Intelligence Requirement</h4>
              </div>
              <p className="text-[10px] text-white/40 font-mono leading-relaxed uppercase tracking-widest">
                Level 2 operations require a minimum of 80% Synchronization at Level 1 and completion of the "Security Clearance Alpha" practical lab.
              </p>
              <CyberButton variant="ghost" className="w-full text-xs uppercase tracking-[0.2em] py-3">
                Verify Eligibility
              </CyberButton>
           </div>
        </div>
      </div>
    </div>
  );
};
