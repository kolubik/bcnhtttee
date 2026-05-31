import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { BookOpen, GraduationCap, Code, Shield, Terminal, Search, ChevronRight, Brain, Lock, Cpu, Fingerprint, Database, Target, Globe, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 'red-team',
    title: 'Red Team Operations',
    subtitle: 'Offensive Security & Penetration Testing',
    icon: <Target className="w-6 h-6" />,
    courses: 24,
    students: 5400,
    progress: 0,
    color: 'red'
  },
  {
    id: 'blue-team',
    title: 'Blue Team Defense',
    subtitle: 'Security Operations & Incident Response',
    icon: <Shield className="w-6 h-6" />,
    courses: 22,
    students: 4800,
    progress: 0,
    color: 'blue'
  },
  {
    id: 'crypto',
    title: 'Cryptography',
    subtitle: 'Post-Quantum Logic & Data Privacy',
    icon: <Lock className="w-6 h-6" />,
    courses: 12,
    students: 1200,
    progress: 0,
    color: 'indigo'
  },
  {
    id: 'forensics',
    title: 'Digital Forensics',
    subtitle: 'Evidence Recovery & Logic Analysis',
    icon: <Search className="w-6 h-6" />,
    courses: 18,
    students: 900,
    progress: 0,
    color: 'cyan'
  },
  {
    id: 'malware',
    title: 'Malware Analysis',
    subtitle: 'Reverse Engineering & Dissection',
    icon: <Cpu className="w-6 h-6" />,
    courses: 15,
    students: 750,
    progress: 0,
    color: 'rose'
  },
  {
    id: 'osint',
    title: 'OSINT Protocol',
    subtitle: 'Open Source Intelligence Gathering',
    icon: <Globe className="w-6 h-6" />,
    courses: 10,
    students: 3100,
    progress: 0,
    color: 'emerald'
  },
  {
    id: 'ai-ops',
    title: 'AI Operators',
    subtitle: 'Adversarial ML & LLM Hardening',
    icon: <Brain className="w-6 h-6" />,
    courses: 8,
    students: 1560,
    progress: 0,
    color: 'purple'
  },
  {
    id: 'purple-team',
    title: 'Purple Team',
    subtitle: 'Collaborative Adversarial Simulation',
    icon: <Zap className="w-6 h-6" />,
    courses: 14,
    students: 820,
    progress: 0,
    color: 'fuchsia'
  },
  {
    id: 'soc-intel',
    title: 'SOC / Threat Intel',
    subtitle: 'Strategic Monitoring & Data Analysis',
    icon: <Activity className="w-6 h-6" />,
    courses: 20,
    students: 2100,
    progress: 0,
    color: 'orange'
  },
  {
    id: 'scientific-theses',
    title: 'Наукові тези',
    subtitle: 'Academic Research & Data Synthesis',
    icon: <BookOpen className="w-6 h-6" />,
    courses: 8,
    students: 450,
    progress: 0,
    color: 'amber'
  }
];

export const Academy = () => {
  const navigate = useNavigate();
  
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 'blue': return 'text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
      case 'purple': return 'text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
      case 'indigo': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]';
      case 'orange': return 'text-orange-400 bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
      case 'green': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'cyan': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]';
      case 'rose': return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'fuchsia': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15_rgba(6,182,212,0.2)]';
    }
  };

  const getProgressClasses = (color: string) => {
    switch(color) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'indigo': return 'bg-indigo-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-emerald-500';
      case 'cyan': return 'bg-cyan-500';
      case 'rose': return 'bg-rose-500';
      case 'emerald': return 'bg-emerald-500';
      case 'fuchsia': return 'bg-fuchsia-500';
      default: return 'bg-cyan-500';
    }
  };

  const getHoverClasses = (color: string) => {
    switch(color) {
      case 'red': return 'group-hover:text-red-400';
      case 'blue': return 'group-hover:text-blue-400';
      case 'purple': return 'group-hover:text-purple-400';
      case 'indigo': return 'group-hover:text-indigo-400';
      case 'orange': return 'group-hover:text-orange-400';
      case 'yellow': return 'group-hover:text-yellow-400';
      case 'green': return 'group-hover:text-emerald-400';
      case 'cyan': return 'group-hover:text-cyan-400';
      case 'rose': return 'group-hover:text-rose-400';
      case 'emerald': return 'group-hover:text-emerald-400';
      case 'fuchsia': return 'group-hover:text-fuchsia-400';
      default: return 'group-hover:text-cyan-400';
    }
  };
  return (
    <div className="space-y-16 pb-32">
      <TechHeader 
        title="Operative Academy" 
        subtitle="Knowledge Synthesis Core" 
        actions={
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              placeholder="Search curricula nodes..." 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-[10px] placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all font-bold"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TRACKS.map((track) => (
          <motion.div 
            key={track.id} 
            whileHover={{ scale: 1.02 }} 
            className="group cursor-pointer"
            onClick={() => navigate(`/roadmap/${track.id}`)}
          >
            <ClippedContainer className="p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all", getColorClasses(track.color))}>
                  {track.icon}
                </div>
                <div className="text-right">
                   <span className="block text-2xl font-black italic text-white italic leading-none">{track.courses}</span>
                   <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Curricula</span>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className={cn("text-xl font-black text-white italic uppercase tracking-tighter transition-colors", getHoverClasses(track.color))}>{track.title}</h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{track.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${track.progress}%` }}
                    className={cn("h-full transition-all duration-1000", getProgressClasses(track.color))} 
                  />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em]">
                  <span className="text-white/30">Synchronization</span>
                  <span className={cn("transition-colors", getHoverClasses(track.color).replace('group-hover:', ''))}>{track.progress}%</span>
                </div>
              </div>

              <CyberButton className="w-full mt-8 py-4 text-[10px] uppercase font-black tracking-widest">
                Access Curriculm
              </CyberButton>
            </ClippedContainer>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <TechHeader title="Upcoming Seminars" subtitle="Live Educational Synapse" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="text-center py-2 px-4 border-r border-white/10">
                    <span className="block text-xl font-black text-white italic font-mono leading-none">2{i}</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest">MAY</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Advanced Malware Obfuscation</h4>
                    <p className="text-[10px] text-white/40 font-mono">Lead Instructor: <span className="text-cyan-400">V.X.0</span></p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-cyan-400 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <ClippedContainer className="p-12 border-white/5 flex flex-col justify-center items-center text-center space-y-8">
           <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-black">
              <GraduationCap className="w-10 h-10" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Certification Portal</h3>
              <p className="text-[10px] text-white/40 font-mono tracking-widest max-w-sm">
                Validate your hard-skills and receive cryptographically signed certificates recognized by the Central Intelligence Collective.
              </p>
           </div>
           <CyberButton variant="ghost" className="uppercase tracking-[0.4em] font-black py-4">
              Review Requirements
           </CyberButton>
        </ClippedContainer>
      </div>
    </div>
  );
};
