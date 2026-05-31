import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Award, Target, Zap, Clock, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const SCHOLARSHIPS = [
  {
    id: '1',
    title: 'Offensive Security Research Grant',
    provider: 'Collective HQ',
    description: 'Funding for advanced research into kernel-space exploit development for modern OS kernels.',
    reward: 'Ξ 2.5 + Hired Status',
    requirements: '85% Red Team Roadmap + 2 Published Articles',
    minProgress: 85,
    deadline: '2026-06-15'
  },
  {
    id: '2',
    title: 'Blue Team Operational Excellence Scholarship',
    provider: 'Defense Alliance',
    description: 'Full tuition coverage for Advanced Incident Response certification for top-performing defenders.',
    reward: 'Full Certification Coverage',
    requirements: '90% Blue Team Roadmap + 0.9 Engagement Score',
    minProgress: 90,
    deadline: '2026-07-01'
  }
];

export const Scholarships = () => {
  const { profile } = useAuth();
  
  const checkEligibility = (minProgress: number) => {
    // Mock check: assume progress is average of hard skills levels if exists
    const progress = profile?.hardSkills ? 45 : 0; // Static mock for now
    return progress >= minProgress;
  };

  return (
    <div className="space-y-12 pb-32">
      <TechHeader title="Grants & Scholarships" subtitle="Incentivizing Excellence in the Cyber Domain" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SCHOLARSHIPS.map((grant) => {
          const isEligible = checkEligibility(grant.minProgress);
          return (
            <motion.div key={grant.id} whileHover={{ y: -4 }}>
              <ClippedContainer className={cn(
                "p-8 h-full flex flex-col group transition-all",
                isEligible ? "hover:border-amber-500/50" : "opacity-60 grayscale"
              )}>
                <div className="flex items-center justify-between mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all",
                    isEligible ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-white/5 border-white/10 text-white/20"
                  )}>
                    {isEligible ? <Award className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-2 justify-end text-amber-500 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Ends: {new Date(grant.deadline).toLocaleDateString()}</span>
                     </div>
                     {!isEligible && (
                       <span className="text-[8px] font-mono text-red-500 uppercase tracking-widest">Ineligible Node</span>
                     )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className={cn(
                    "text-2xl font-black italic uppercase tracking-tighter transition-colors",
                    isEligible ? "text-white group-hover:text-amber-500" : "text-white/40"
                  )}>
                    {grant.title}
                  </h3>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{grant.provider}</p>
                  <p className="text-xs text-white/40 font-mono leading-relaxed mt-4">
                    {grant.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-2">Reward</span>
                        <span className={cn("text-sm font-bold uppercase tracking-wider", isEligible ? "text-amber-400" : "text-white/20")}>{grant.reward}</span>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-2">Requirement</span>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider leading-tight">{grant.requirements}</span>
                     </div>
                  </div>
                </div>

                <CyberButton 
                  disabled={!isEligible}
                  className={cn(
                    "w-full mt-8 py-4 border-none transition-colors font-black tracking-[0.2em] text-xs",
                    isEligible ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-white/5 text-white/20 cursor-not-allowed"
                  )}
                >
                  {isEligible ? 'Universal Application' : 'Requirements Not Met'}
                </CyberButton>
              </ClippedContainer>
            </motion.div>
          );
        })}
      </div>

      <div className="p-12 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] text-center space-y-6">
         <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
            <Zap className="w-8 h-8 text-white/10" />
         </div>
         <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Automatic Eligibility Verification</h3>
         <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest max-w-xl mx-auto">
            Our system continuously scans your roadmap progress, practical lab performance, and overall platform activity. When you hit a program requirement, you will receive a Tier-1 Signal.
         </p>
      </div>
    </div>
  );
};
