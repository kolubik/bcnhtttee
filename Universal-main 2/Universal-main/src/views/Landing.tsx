import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Shield, Zap, Terminal, Cpu, Users, GraduationCap, 
  Target, Activity, Globe, Code, Box, Database, 
  MessageSquare, Github as GithubIcon, Disc as DiscordIcon, 
  BookOpen, Rocket, Award, Network, ChevronRight,
  Search, Eye, Lock, FileCode, Bug, Bot, Send
} from 'lucide-react';
import { CyberButton, ClippedContainer, TechHeader } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative bg-[#050505]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">v4.0 Security Protocol</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.9]">
            ACADEMY
          </h1>
          
          <p className="text-white/40 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            The next generation of cybersecurity training. Minimalist by design, 
            powerful by nature. Master offensive and defensive operations in a 
            controlled environment.
          </p>

          <div className="flex items-center justify-center pt-8">
            <CyberButton 
              onClick={() => user ? navigate('/dashboard') : navigate('/auth')} 
              className="px-12 py-5 text-lg tracking-widest"
            >
              INITIALIZE
            </CyberButton>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container-responsive py-24 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <TechHeader title="Protocol Vision" subtitle="The Academy Mission" />
            <div className="space-y-6 text-white/50 text-base md:text-lg leading-relaxed font-medium">
              <p>
                ACADEMY is a cutting-edge ecosystem designed to bridge the gap between theoretical knowledge 
                and high-stakes tactical execution. We provide the infrastructure for the next generation 
                of digital operatives.
              </p>
              <div className="pl-6 border-l-2 border-white/10 italic text-white/30 text-sm">
                "In the digital domain, proficiency is the only true firewall."
              </div>
            </div>
          </div>
          <div className="relative aspect-video bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
             <Shield className="w-24 h-24 text-white/5" />
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="container-responsive py-24 mb-12">
        <div className="mb-16 text-center">
           <TechHeader title="Core Directions" subtitle="Operational Specializations" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DirectionCard 
            icon={<Target className="w-6 h-6" />}
            title="Red Team"
            desc="Offensive operations and penetration testing methodologies."
          />
          <DirectionCard 
            icon={<Shield className="w-6 h-6" />}
            title="Blue Team"
            desc="Defensive hardening and real-time incident response protocols."
          />
          <DirectionCard 
            icon={<Search className="w-6 h-6" />}
            title="OSINT"
            desc="Intelligence gathering and social engineering research."
          />
          <DirectionCard 
            icon={<Lock className="w-6 h-6" />}
            title="Cryptography"
            desc="Advanced encryption standards and mathematical defense."
          />
          <DirectionCard 
            icon={<Cpu className="w-6 h-6" />}
            title="Forensics"
            desc="Evidence extraction and digital footprint analysis."
          />
          <DirectionCard 
            icon={<Bug className="w-6 h-6" />}
            title="Malware"
            desc="Deconstruction and analysis of persistent threats."
          />
        </div>
      </section>

      {/* Combat Operations */}
      <section className="bg-white/[0.01] border-y border-white/5">
        <div className="container-responsive py-24">
          <TechHeader title="Operational Training" subtitle="Field Exercises" />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <OperationItem label="Jeopardy CTF" desc="Weekly signal capture competitions" />
            <OperationItem label="Live Range" desc="Simulated enterprise infrastructure" />
            <OperationItem label="Threat Int" desc="Real-world case study analysis" />
            <OperationItem label="Sandbox" desc="Isolated exploit development labs" />
          </div>
        </div>
      </section>

      {/* Progression */}
      <section className="container-responsive py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <TechHeader title="Progression Path" subtitle="Operative Lifecycle" />
          </div>
          <div className="space-y-4">
            <ProgressStep level="01" title="Cadet" desc="Core fundamentals of Unix systems and networking." />
            <ProgressStep level="02" title="Operative" desc="Active engagement in simulated range environments." />
            <ProgressStep level="03" title="Specialist" desc="Domain-specific expertise and research leadership." />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="container-responsive py-16 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatItem value="25k+" label="OPERATIVES" />
            <StatItem value="142" label="NODES ACTIVE" />
            <StatItem value="0.4ms" label="LATENCY" />
            <StatItem value="99.9%" label="UPTIME" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-responsive py-12 md:py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold tracking-tight text-white uppercase text-sm">Academy Systems</span>
          </div>
          <div className="flex gap-8 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Github</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <p className="text-[10px] text-white/20 font-mono">© 2026 ACADEMY.SYS | ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

const DirectionCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
    <div className="mb-4 text-white/20 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{title}</h3>
    <p className="text-white/40 text-xs leading-relaxed font-medium">{desc}</p>
  </div>
);

const OperationItem = ({ label, desc }: { label: string, desc: string }) => (
  <div className="p-6 border border-white/5 rounded-xl bg-white/[0.02] flex items-center justify-between group hover:border-white/10 transition-colors">
    <div>
      <h4 className="text-sm font-bold text-white mb-0.5 uppercase tracking-wider">{label}</h4>
      <p className="text-[11px] text-white/30 font-medium">{desc}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all group-hover:translate-x-1" />
  </div>
);

const ProgressStep = ({ level, title, desc }: { level: string, title: string, desc: string }) => (
  <div className="p-6 md:p-8 border border-white/5 rounded-2xl bg-white/[0.02] flex items-center gap-8 group hover:bg-white/[0.03] transition-colors">
    <span className="text-4xl md:text-5xl font-bold text-white/5 group-hover:text-white/10 transition-colors">{level}</span>
    <div>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-xs text-white/30 font-medium">{desc}</p>
    </div>
  </div>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center space-y-1">
    <div className="text-3xl md:text-5xl font-bold text-white tracking-tighter">{value}</div>
    <div className="text-[10px] font-mono tracking-widest text-white/20 uppercase font-bold">{label}</div>
  </div>
);

