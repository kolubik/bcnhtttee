import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'amber' | 'ghost' | 'red';
  glow?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'cyan', 
  glow = false, 
  className, 
  ...props 
}) => {
  const variants = {
    cyan: 'bg-white text-black hover:bg-white/90 active:scale-[0.98]',
    amber: 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]',
    red: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
    ghost: 'bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-[0.98]'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const GlassContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(
    "bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl md:rounded-[2rem] p-6 md:p-10 relative overflow-hidden",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    {children}
  </div>
);

export const ClippedContainer: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  color?: 'cyan' | 'red' | 'amber';
  onClick?: () => void;
}> = ({ children, className, color = 'cyan', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-[#0a0a0a] border border-white/5 rounded-xl relative overflow-hidden",
        onClick ? "cursor-pointer active:scale-[0.99] transition-transform" : "",
        className
      )}
    >
      {children}
    </div>
  );
};

export const TechHeader: React.FC<{ 
  title: string; 
  subtitle?: string; 
  color?: 'cyan' | 'amber' | 'red';
  actions?: React.ReactNode;
}> = ({ title, subtitle, color = 'cyan', actions }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2 md:px-0">
      <div className="space-y-1">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className={cn(
            "text-[10px] font-mono tracking-[0.3em] uppercase font-bold",
            color === 'cyan' ? 'text-cyan-400/60' : color === 'amber' ? 'text-amber-400/60' : 'text-red-400/60'
          )}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
        {actions}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number; label?: string; color?: string }> = ({ progress, label, color = 'cyan' }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-white/40">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    )}
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full relative overflow-hidden",
          color === 'cyan' ? 'bg-cyan-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
      </motion.div>
    </div>
  </div>
);

export const SkillHex: React.FC<{ label: string; xp: number; level: number; color?: 'cyan' | 'amber' }> = ({ label, xp, level, color = 'cyan' }) => (
  <div className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-500">
     <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black uppercase text-white/70 group-hover:text-white">{label}</h4>
        <span className={cn("text-[10px] font-bold font-mono", color === 'cyan' ? "text-cyan-400" : "text-amber-400")}>LV. {level}</span>
     </div>
     <ProgressBar progress={Math.min(100, (xp % 1000) / 10)} color={color} />
     <div className="mt-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">
       XP: {xp.toLocaleString()}
     </div>
  </div>
);

export const StatBox: React.FC<{ 
  label: string; 
  value: string | number; 
  icon: React.ReactNode; 
  onClick?: () => void;
  color?: 'cyan' | 'amber' | 'purple';
}> = ({ label, value, icon, onClick, color = 'cyan' }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white/[0.02] border border-white/5 p-2.5 sm:p-3 rounded-lg group transition-all flex items-center justify-between gap-2 h-14 sm:h-16 overflow-hidden",
      onClick ? "cursor-pointer hover:bg-white/[0.05] hover:border-cyan-500/30 active:scale-[0.97]" : ""
    )}
  >
    <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
      <span className="text-[7px] font-mono text-white/30 uppercase tracking-[0.1em] block leading-none">{label}</span>
      <span className="text-[10px] sm:text-xs font-mono font-black text-white group-hover:text-cyan-400 transition-colors truncate block leading-none">{value}</span>
    </div>
    <div className={cn(
      "shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all text-white/20 group-hover:text-cyan-400 scale-100 group-hover:scale-110",
      onClick ? "text-cyan-400/50" : ""
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: 14, className: "w-3 h-3 sm:w-3.5 sm:h-3.5" })}
    </div>
  </div>
);
