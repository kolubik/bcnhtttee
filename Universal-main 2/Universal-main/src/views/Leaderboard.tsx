import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader } from '../components/UI';
import { Trophy, Medal, Target, TrendingUp, Zap, Crown, ShieldCheck, Flame, Star, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const StatBox = ({ label, value, icon, color = 'cyan' }: { label: string, value: string, icon: React.ReactNode, color?: string }) => (
  <div className="relative group overflow-hidden">
    <ClippedContainer className="px-6 py-4 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border",
          color === 'cyan' ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" : 
          color === 'purple' ? "text-purple-400 bg-purple-500/10 border-purple-500/20" :
          "text-amber-400 bg-amber-500/10 border-amber-500/20"
        )}>
          {icon}
        </div>
        <div>
          <span className="block text-[8px] text-white/30 uppercase tracking-[0.3em] font-mono">{label}</span>
          <span className="text-xl font-black text-white font-mono tracking-tighter">{value}</span>
        </div>
      </div>
    </ClippedContainer>
    <div className={cn(
      "absolute bottom-0 left-0 h-[2px] transition-all duration-500 w-0 group-hover:w-full",
      color === 'cyan' ? "bg-cyan-500 shadow-[0_0_10px_#06b6d4]" :
      color === 'purple' ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" :
      "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
    )} />
  </div>
);

export const Leaderboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('global');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="Operative Rankings" 
        subtitle="Neural Network Hierarchy" 
        actions={
          <div className="flex gap-2">
             {['Global', 'Local', 'Regional'].map((f) => (
               <button 
                key={f}
                onClick={() => setFilter(f.toLowerCase())}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-[0.2em] border transition-all",
                  filter === f.toLowerCase() 
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold" 
                    : "border-white/5 text-white/40 hover:border-white/20"
                )}
               >
                 {f}
               </button>
             ))}
          </div>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox label="Active Operatives" value="1,248" icon={<Activity className="w-5 h-5" />} />
        <StatBox label="System Uptime" value="99.99%" icon={<Zap className="w-5 h-5" />} color="purple" />
        <StatBox label="Neural Mass" value="4.2M" icon={<TrendingUp className="w-5 h-5" />} color="amber" />
      </div>

      {/* Top 3 Podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12 pb-8">
          {/* Rank 2 */}
          <PodiumItem user={users[1]} rank={2} color="slate" />
          {/* Rank 1 */}
          <PodiumItem user={users[0]} rank={1} color="cyan" large />
          {/* Rank 3 */}
          <PodiumItem user={users[2]} rank={3} color="amber" />
        </div>
      )}

      {/* Full List */}
      <div className="space-y-3 relative">
        <div className="flex items-center gap-4 px-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">
          <div className="w-12 text-center">Rank</div>
          <div className="flex-1">Operative Identity</div>
          <div className="w-24 text-center">Clearance</div>
          <div className="w-24 text-right">Neural Weight</div>
        </div>

        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {users.slice(3).map((user, i) => (
              <motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className="cursor-pointer group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all pointer-events-none" />
                
                <ClippedContainer className="p-4 flex items-center gap-6 border-white/5 bg-white/[0.01] group-hover:border-white/10 group-hover:bg-white/[0.03] transition-all">
                  <div className="w-12 text-center font-mono font-black italic text-white/10 group-hover:text-cyan-400 transition-colors text-lg">
                    #{(i + 4).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 relative z-10">
                      <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    {user.level > 10 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center z-20">
                        <Flame className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-black uppercase italic tracking-wider group-hover:text-cyan-400 transition-colors">
                        {user.displayName}
                      </h3>
                      {user.role === 'admin' && <ShieldCheck className="w-3 h-3 text-cyan-500" />}
                    </div>
                    <p className="text-[8px] text-white/30 font-mono uppercase tracking-[0.2em]">
                      {user.title || 'Infiltrator'}
                    </p>
                  </div>

                  <div className="flex items-center gap-8 pr-4">
                      <div className="text-center w-24">
                          <div className="text-sm font-bold text-white font-mono flex items-center justify-center gap-1">
                            <span className="text-white/20 text-[10px]">LVL</span> {user.level || 1}
                          </div>
                          <div className="w-full h-1 bg-white/5 mt-1 rounded-full overflow-hidden">
                            <div className="h-full bg-white/20 w-3/4" />
                          </div>
                      </div>
                      <div className="text-right w-24">
                          <span className="text-base font-black text-cyan-400 font-mono tracking-tighter">
                            {(user.points || 0).toLocaleString()}
                          </span>
                      </div>
                  </div>
                </ClippedContainer>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const PodiumItem = ({ user, rank, large }: any) => {
  const navigate = useNavigate();
  
  const getRankConfig = (r: number) => {
    switch (r) {
      case 1: return { icon: <Crown className="w-12 h-12" />, color: 'text-amber-400', glow: 'shadow-amber-500/20', accent: 'border-amber-500/50' };
      case 2: return { icon: <Medal className="w-10 h-10" />, color: 'text-slate-300', glow: 'shadow-slate-500/10', accent: 'border-slate-500/30' };
      default: return { icon: <Medal className="w-10 h-10" />, color: 'text-amber-700', glow: 'shadow-amber-900/10', accent: 'border-amber-900/30' };
    }
  };

  const config = getRankConfig(rank);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/profile/${user.id}`)}
      className={cn(
        "relative group cursor-pointer",
        rank === 1 ? "order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3"
      )}
    >
      <ClippedContainer className={cn(
        "pt-24 pb-10 text-center flex flex-col items-center gap-4 transition-all duration-700 relative",
        rank === 1 ? "bg-gradient-to-b from-amber-500/[0.04] to-transparent border-amber-500/40" : "bg-white/[0.01] border-white/5",
        large ? "scale-110 z-10 shadow-2xl" : "opacity-75 hover:opacity-100"
      )}>
        {/* Animated Background Ring for Rank 1 */}
        {rank === 1 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-amber-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-dashed border-amber-500/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
          </div>
        )}

        <div className={cn(
          "absolute -top-14 left-1/2 -translate-x-1/2 w-32 h-32 rounded-[2.5rem] border-4 border-[#0a0a0a] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-110 z-20",
          config.accent
        )}>
          <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          <div className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[12px] font-black font-mono border bg-[#0a0a0a]/90 backdrop-blur-xl",
            config.color,
            config.accent
          )}>
            #{rank}
          </div>
        </div>

        <div className={cn("mb-2 flex items-center justify-center gap-2", config.color)}>
          {config.icon}
        </div>

        <div className="px-4">
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:scale-105 transition-transform duration-300">
            {user.displayName}
          </h3>
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.25em] mt-1", rank === 1 ? "text-amber-400" : "text-white/40")}>
            {user.title || 'Neural Operative'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-4 pt-6 border-t border-white/5 w-full px-8">
            <div>
              <span className="block text-[8px] text-white/30 uppercase font-mono mb-1 tracking-widest">Level</span>
              <span className="text-xl font-black text-white font-mono leading-none">{user.level || 1}</span>
            </div>
            <div>
              <span className="block text-[8px] text-white/30 uppercase font-mono mb-1 tracking-widest">Points</span>
              <span className={cn("text-xl font-black font-mono leading-none", rank === 1 ? "text-amber-400" : "text-cyan-400")}>
                {(user.points || 0).toLocaleString()}
              </span>
            </div>
        </div>
        
        {rank === 1 && (
          <div className="absolute -inset-1 bg-amber-500/10 blur-3xl opacity-50 pointer-events-none -z-10" />
        )}
      </ClippedContainer>
    </motion.div>
  );
};
