import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, BadgeCheck, ShieldAlert, Terminal, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SkillNode {
  id: string;
  label: string;
  verified?: boolean;
  children?: SkillNode[];
  logs?: any[];
  xp?: number;
  level?: number;
}

interface SkillTreeProps {
  skills: any; // Can be string[] or { [key: string]: { xp: number; level: number } }
  experience: any[];
  isVerified?: boolean;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skills, experience, isVerified }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [hoveredNode, pHoveredNode] = useState<SkillNode | null>(null);

  // Group skills into a hierarchy for visualization
  const buildTree = (): SkillNode => {
    const root: SkillNode = {
      id: 'root',
      label: 'Neuro Core',
      children: []
    };

    const categories: Record<string, SkillNode> = {};

    const skillList = Array.isArray(skills) ? skills : Object.keys(skills || {});

    skillList.forEach((skillName) => {
      let category = 'Uncategorized';
      let label = skillName;

      if (skillName.includes('/')) {
        [category, label] = skillName.split('/').map(s => s.trim());
      } else if (skillName.includes(':')) {
        [category, label] = skillName.split(':').map(s => s.trim());
      }

      if (!categories[category]) {
        categories[category] = {
          id: category,
          label: category,
          children: []
        };
        root.children?.push(categories[category]);
      }

      // Link logs to skills by simple keyword matching
      const relatedLogs = experience.filter(exp => 
        exp.description.toLowerCase().includes(label.toLowerCase()) ||
        exp.role.toLowerCase().includes(label.toLowerCase())
      );

      const skillData = !Array.isArray(skills) ? skills[skillName] : null;

      categories[category].children?.push({
        id: skillName,
        label,
        verified: isVerified || (skillData?.level > 1),
        logs: relatedLogs,
        xp: skillData?.xp,
        level: skillData?.level
      });
    });

    return root;
  };

  const treeData = buildTree();

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedNodes(next);
  };

  const renderNode = (node: SkillNode & { xp?: number; level?: number }, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="space-y-2">
        <div 
          className={cn(
            "group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
            depth === 0 ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]" :
            hasChildren ? "bg-white/5 border-white/10 hover:border-cyan-500/30" :
            "bg-white/[0.02] border-transparent hover:bg-white/5"
          )}
          onClick={() => hasChildren && toggleNode(node.id)}
          onMouseEnter={() => !hasChildren && pHoveredNode(node)}
          onMouseLeave={() => pHoveredNode(null)}
        >
          {depth === 0 ? (
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          ) : hasChildren ? (
            <div className="w-5 h-5 flex items-center justify-center">
              {isExpanded ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
            </div>
          ) : (
             <div className="w-1 h-1 rounded-full bg-cyan-500/50 ml-2" />
          )}

          <span className={cn(
            "font-bold uppercase tracking-tighter",
            depth === 0 ? "text-lg text-white" : "text-xs text-white/70"
          )}>
            {node.label}
          </span>

          {node.level && (
              <span className="ml-2 text-[8px] font-mono font-bold text-cyan-400/50">LV.{node.level}</span>
          )}

          {node.verified && !hasChildren && (
            <BadgeCheck className="w-4 h-4 text-cyan-400 ml-auto glow-blue" />
          )}
          
          {hasChildren && (
            <span className="ml-auto text-[8px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
              {node.children?.length} SIBLINGS
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-6 space-y-2 pl-4 border-l border-white/5"
          >
            {node.children?.map(child => renderNode(child, depth + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        {renderNode(treeData)}
      </div>

      {/* Hover Info Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed z-[100] w-64 pointer-events-none"
            style={{ 
              left: '50%', 
              top: '50%',
              transform: 'translate(-50%, -150%)'
            }}
          >
            <div className="bg-[#0a0a0a] border border-cyan-500/50 p-6 rounded-[2rem] shadow-2xl backdrop-blur-3xl overflow-hidden relative">
              <div className="absolute inset-0 scanlines opacity-50" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-black italic uppercase tracking-tighter">{hoveredNode.label}</h4>
                  {hoveredNode.verified ? (
                    <BadgeCheck className="w-5 h-5 text-cyan-400 glow-blue" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest block">Status</span>
                  <span className={cn("text-[10px] font-bold uppercase font-mono", hoveredNode.verified ? "text-cyan-400" : "text-amber-500")}>
                    {hoveredNode.verified ? "Verified Component" : "Verification Pending"}
                  </span>
                </div>

                {hoveredNode.logs && hoveredNode.logs.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[8px] text-white/20 uppercase font-mono tracking-widest block">Linked Logs</span>
                    {hoveredNode.logs.map((log, i) => (
                      <div key={i} className="flex gap-2 p-2 bg-white/5 rounded-lg border border-white/5">
                        <Terminal className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-white font-bold leading-none">{log.role}</p>
                          <p className="text-[8px] text-white/40 line-clamp-2">{log.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
