import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Users, Shield, Zap, TrendingUp, ChevronRight, UserPlus, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'teams'), orderBy('totalPoints', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teams');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', logoUrl: '' });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'teams'), {
        ...newTeam,
        memberCount: 1,
        totalPoints: 0,
        createdAt: serverTimestamp(),
      });
      setShowCreate(false);
      setNewTeam({ name: '', description: '', logoUrl: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'teams');
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="Operative Squads" 
        subtitle="Advanced Collaborative Tactical Units" 
        actions={
          <CyberButton onClick={() => setShowCreate(true)} variant="ghost" className="uppercase tracking-[0.3em] text-[10px] py-4">
             Initialize New Squad
          </CyberButton>
        }
      />

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <ClippedContainer className="w-full max-w-lg p-12 space-y-8 bg-[#0d0d0d]">
               <div className="flex items-center justify-between">
                  <TechHeader title="Create Squad" subtitle="Registration Protocol" />
                  <button onClick={() => setShowCreate(false)} className="text-white/20 hover:text-white"><XCircle className="w-6 h-6" /></button>
               </div>
               <form onSubmit={handleCreateTeam} className="space-y-4">
                  <input 
                    placeholder="Squad Designation (Name)" 
                    value={newTeam.name}
                    onChange={e => setNewTeam({...newTeam, name: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-cyan-500/50 outline-none" 
                  />
                   <input 
                    placeholder="Squad Emblem URL (Optional)" 
                    value={newTeam.logoUrl}
                    onChange={e => setNewTeam({...newTeam, logoUrl: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-cyan-500/50 outline-none" 
                  />
                  <textarea 
                    placeholder="Mission Statement & Bio" 
                    value={newTeam.description}
                    onChange={e => setNewTeam({...newTeam, description: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-cyan-500/50 outline-none h-32" 
                  />
                  <CyberButton type="submit" className="w-full py-4 uppercase font-black tracking-[0.5em]">Confirm Deployment</CyberButton>
               </form>
            </ClippedContainer>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)
        ) : teams.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-mono text-xs uppercase tracking-widest">No active squads deployed in current sector</p>
          </div>
        ) : (
          teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ClippedContainer className="p-8 group hover:border-cyan-500/50 transition-all duration-500 shadow-2xl">
                <div className="flex gap-8 items-start">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0 group-hover:border-cyan-500/50 transition-all">
                        <div className="absolute inset-0 scanlines opacity-30" />
                        {team.logoUrl ? (
                            <img src={team.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <Shield className="w-10 h-10 text-cyan-400" />
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors leading-none mb-1">
                                    {team.name}
                                </h3>
                                <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mt-1">Status: Operational</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-2xl font-black italic text-white/10 font-mono group-hover:text-cyan-400/20 transition-colors">
                                    #{i + 1}
                                </span>
                            </div>
                        </div>

                        <p className="text-white/40 text-[10px] font-mono leading-relaxed line-clamp-2">
                            {team.description || 'No description available for this unit.'}
                        </p>

                        <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                            <div className="text-center">
                                <span className="block text-[8px] text-white/30 uppercase font-mono mb-1">Members</span>
                                <span className="text-sm font-bold text-white font-mono">{team.memberCount || 0}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[8px] text-white/30 uppercase font-mono mb-1">Squad XP</span>
                                <span className="text-sm font-bold text-cyan-400 font-mono">{(team.totalPoints || 0).toLocaleString()}</span>
                            </div>
                            <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                                View Intelligence
                                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
              </ClippedContainer>
            </motion.div>
          ))
        )}
      </div>


    </div>
  );
};
