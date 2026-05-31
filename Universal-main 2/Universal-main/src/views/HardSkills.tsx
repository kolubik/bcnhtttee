import React, { useState, useMemo, useEffect } from 'react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { 
  Shield, Target, Code, Cpu, Search, 
  ExternalLink, ChevronRight, Zap, Filter,
  Layers, Lock, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

// --- DATA TYPES ---
interface SkillNode {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Professional' | 'Expert';
  resourceLink: string;
  progress?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

// --- CATALOG DATA ---
const SKILLS_CATALOG: SkillNode[] = [
  // Fundamentals
  { id: 'f1', title: 'Introduction to Cybersecurity', description: 'The starting point for every operative. Core security terminology.', category: 'Fundamentals', difficulty: 'Basic', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'f2', title: 'Cyber Security Tutorial', description: 'Foundational walkthrough of modern cyber environments.', category: 'Fundamentals', difficulty: 'Basic', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'f3', title: 'Concepts of Cybersecurity', description: 'CIA Triad, Risk Management, and Security Frameworks.', category: 'Fundamentals', difficulty: 'Basic', resourceLink: 'https://t.me/universal_cyber' },
  
  // TryHackMe
  { id: 'thm1', title: 'Security Analyst', description: 'Pre-Security and SOC Level 1 pathways.', category: 'THM Roadmap', difficulty: 'Intermediate', resourceLink: 'https://tryhackme.com' },
  { id: 'thm2', title: 'Penetration Tester', description: 'Offensive security fundamentals and junior pentesting.', category: 'THM Roadmap', difficulty: 'Intermediate', resourceLink: 'https://tryhackme.com' },
  { id: 'thm3', title: 'Security Engineer', description: 'Network security and defensive engineering.', category: 'THM Roadmap', difficulty: 'Professional', resourceLink: 'https://tryhackme.com' },

  // Programming
  { id: 'p1', title: 'Python', description: 'Scripting, exploit dev, and automation.', category: 'Programming', difficulty: 'Intermediate', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'p2', title: 'Golang', description: 'Cloud security and concurrent tool development.', category: 'Programming', difficulty: 'Professional', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'p3', title: 'Java', description: 'Enterprise application security and vulnerability analysis.', category: 'Programming', difficulty: 'Professional', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'p4', title: 'JavaScript', description: 'Client-side security and web app exploitation.', category: 'Programming', difficulty: 'Intermediate', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'p5', title: 'C#', description: 'Windows environment exploration and .NET security.', category: 'Programming', difficulty: 'Professional', resourceLink: 'https://t.me/universal_cyber' },
  { id: 'p6', title: 'C++', description: 'Advanced exploit dev and memory corruption research.', category: 'Programming', difficulty: 'Expert', resourceLink: 'https://t.me/universal_cyber' },

  // HTB
  { id: 'htb1', title: 'Junior Cybersecurity Analyst', description: 'Comprehensive entry analyst path.', category: 'HTB Path', difficulty: 'Basic', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'htb2', title: 'Penetration Tester', description: 'Practical offensive security certification path.', category: 'HTB Path', difficulty: 'Intermediate', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'htb3', title: 'Web Penetration Tester', description: 'Advanced web-focused exploitation.', category: 'HTB Path', difficulty: 'Professional', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'htb4', title: 'SOC Analyst', description: 'Enterprise-grade defensive operations.', category: 'HTB Path', difficulty: 'Intermediate', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'htb5', title: 'AI Red Teamer', description: 'Vulnerability research in AI and LLM models.', category: 'HTB Path', difficulty: 'Expert', resourceLink: 'https://academy.hackthebox.com' },

  // Certifications - Red Team
  { id: 'c1', title: 'eJPT', description: 'eLearnSecurity Junior Penetration Tester.', category: 'Cert: Red Team', difficulty: 'Basic', resourceLink: 'https://ine.com' },
  { id: 'c2', title: 'CPTS', description: 'HTB Certified Penetration Testing Specialist.', category: 'Cert: Red Team', difficulty: 'Professional', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'c3', title: 'OSCP', description: 'Offensive Security Certified Professional.', category: 'Cert: Red Team', difficulty: 'Professional', resourceLink: 'https://offsec.com' },
  { id: 'c4', title: 'CRTP', description: 'Certified Red Team Professional.', category: 'Cert: Red Team', difficulty: 'Intermediate', resourceLink: 'https://alteredsecurity.com' },
  { id: 'c5', title: 'OSWE', description: 'Offensive Security Web Expert.', category: 'Cert: Red Team', difficulty: 'Expert', resourceLink: 'https://offsec.com' },
  
  // Certifications - Blue Team
  { id: 'c10', title: 'BTL1', description: 'Blue Team Level 1.', category: 'Cert: Blue Team', difficulty: 'Basic', resourceLink: 'https://securityblue.team' },
  { id: 'c11', title: 'CDSA', description: 'HTB Certified Defensive Security Analyst.', category: 'Cert: Blue Team', difficulty: 'Intermediate', resourceLink: 'https://academy.hackthebox.com' },
  { id: 'c12', title: 'OSDA', description: 'Offensive Security Defense Analyst.', category: 'Cert: Blue Team', difficulty: 'Professional', resourceLink: 'https://offsec.com' },
  
  // Forensics
  { id: 'cf1', title: 'eCDFP', description: 'eLearnSecurity Certified Digital Forensics Professional.', category: 'Cert: Forensics', difficulty: 'Professional', resourceLink: 'https://ine.com' },
  { id: 'cf2', title: 'CSFA', description: 'CyberSecurity Forensic Analyst.', category: 'Cert: Forensics', difficulty: 'Expert', resourceLink: 'https://cybersecurityforensicanalyst.com' },

  // Cloud / SysOps
  { id: 'cs1', title: 'ICCA', description: 'INE Certified Cloud Associate.', category: 'Cert: Cloud', difficulty: 'Basic', resourceLink: 'https://ine.com' },
  { id: 'cs2', title: 'AWS CP', description: 'AWS Certified Cloud Practitioner.', category: 'Cert: Cloud', difficulty: 'Basic', resourceLink: 'https://aws.amazon.com' },
  { id: 'cs3', title: 'Cloud+', description: 'CompTIA Cloud+ Certification.', category: 'Cert: Cloud', difficulty: 'Intermediate', resourceLink: 'https://comptia.org' },
];

const CATEGORIES = [
  'All', 'Fundamentals', 'THM Roadmap', 'HTB Path', 'Programming', 'Cert: Red Team', 'Cert: Blue Team', 'Cert: Forensics', 'Cert: Cloud'
];

export const HardSkills = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userProgress, setUserProgress] = useState<Record<string, string>>({});
  const [dynamicCatalog, setDynamicCatalog] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skills catalog is public knowledge but we check auth for reliability
    const unsub = onSnapshot(
      collection(db, 'skills_catalog'), 
      (snapshot) => {
        if (!snapshot.empty) {
          setDynamicCatalog(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SkillNode)));
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'skills_catalog');
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const currentCatalog = dynamicCatalog.length > 0 ? dynamicCatalog : SKILLS_CATALOG;

  const filteredSkills = useMemo(() => {
    return currentCatalog.filter(skill => {
      const matchesSearch = skill.title.toLowerCase().includes(search.toLowerCase()) || 
                          skill.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, currentCatalog]);

  const toggleProgress = (id: string) => {
    setUserProgress(prev => {
      const current = prev[id] || 'NOT_STARTED';
      const next = current === 'NOT_STARTED' ? 'IN_PROGRESS' : 
                   current === 'IN_PROGRESS' ? 'COMPLETED' : 'NOT_STARTED';
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Hard Skills" subtitle="Neural Competency Roadmap" />
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              placeholder="Search knowledge nodes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 bg-[#0a0a0a]/80 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-mono text-[10px] placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-md"
            />
          </div>
          
          {/* Filter Trigger (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Active Filters</span>
          </div>
        </div>
      </div>

      {/* Category Scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all",
              activeCategory === cat 
                ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" 
                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Knowledge Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              layout
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ClippedContainer className="h-full p-8 border-white/5 bg-[#0d0d0d]/40 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors">
                <div className="flex flex-col h-full space-y-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      skill.difficulty === 'Basic' ? "bg-green-500/10 border-green-500/30 text-green-400" :
                      skill.difficulty === 'Intermediate' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                      skill.difficulty === 'Professional' ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400" :
                      "bg-red-500/10 border-red-500/30 text-red-500"
                    )}>
                      {skill.category.includes('Programming') ? <Code className="w-6 h-6" /> : 
                       skill.category.includes('Cert') ? <Shield className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                    </div>
                    
                    <button 
                      onClick={() => toggleProgress(skill.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[8px] uppercase tracking-widest transition-all",
                        userProgress[skill.id] === 'COMPLETED' ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" :
                        userProgress[skill.id] === 'IN_PROGRESS' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                        "bg-white/5 border-white/10 text-white/20 hover:text-white/40"
                      )}
                    >
                      {userProgress[skill.id] === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {userProgress[skill.id]?.replace('_', ' ') || 'NOT STARTED'}
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.2em]">{skill.category}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className={cn(
                          "text-[8px] font-mono uppercase tracking-[0.2em]",
                          skill.difficulty === 'Intermediate' ? "text-amber-500" : 
                          skill.difficulty === 'Expert' ? "text-red-500" : "text-white/30"
                        )}>{skill.difficulty}</span>
                      </div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                        {skill.title}
                      </h3>
                    </div>
                    
                    <p className="text-[10px] text-white/40 font-mono leading-relaxed min-h-[40px]">
                      {skill.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-2 pt-2">
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: userProgress[skill.id] === 'COMPLETED' ? '100%' : userProgress[skill.id] === 'IN_PROGRESS' ? '45%' : '0%' }}
                            className={cn(
                              "h-full transition-colors duration-500",
                              userProgress[skill.id] === 'COMPLETED' ? "bg-cyan-400" : "bg-amber-500"
                            )}
                          />
                       </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                    <CyberButton 
                      onClick={() => window.open(skill.resourceLink, '_blank')}
                      variant="ghost" 
                      className="py-3 text-[9px] uppercase font-black tracking-widest border-white/10"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Resource
                    </CyberButton>
                    <CyberButton 
                      onClick={() => toggleProgress(skill.id)}
                      className={cn(
                        "py-3 text-[9px] uppercase font-black tracking-widest",
                        userProgress[skill.id] === 'COMPLETED' ? "bg-green-500/20 text-green-400 border-green-400/30" : ""
                      )}
                    >
                      {userProgress[skill.id] === 'COMPLETED' ? 'Review' : 'Deploy'}
                    </CyberButton>
                  </div>
                </div>
              </ClippedContainer>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-32 text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
               <Lock className="w-8 h-8 text-white/10" />
            </div>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">No Knowledge Nodes Found in Current Sector</p>
          </div>
        )}
      </div>
    </div>
  );
};
