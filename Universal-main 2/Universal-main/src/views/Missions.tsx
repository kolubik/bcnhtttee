import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Target, Zap, Clock, ShieldCheck, ChevronRight, PenTool, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Missions = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [writeup, setWriteup] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'OPERATIONAL' | 'SOFT_SKILL' | 'SCIENTIFIC'>('ALL');
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user) return;

    const qTasks = query(collection(db, 'tasks'), orderBy('deadline', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tasks'));

    // Secure query for submissions: filtered for residents, global for admins
    const isAdmin = profile?.role === 'admin' || profile?.role === 'CURATOR' || profile?.role === 'ADMIN';
    const qSubs = isAdmin 
      ? query(collection(db, 'submissions'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'submissions'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubSubs = onSnapshot(qSubs, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'submissions');
      setLoading(false);
    });

    return () => { unsubTasks(); unsubSubs(); };
  }, [user, profile?.role]);

  const handleSubmit = async () => {
    if (!selectedTask || !writeup || !user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'submissions'), {
        taskId: selectedTask.id,
        taskTitle: selectedTask.title,
        userId: user.uid,
        userName: profile?.displayName || 'Anonymous',
        content: writeup,
        status: 'PENDING',
        createdAt: serverTimestamp()
      });
      setWriteup('');
      setSelectedTask(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'submissions');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskStatus = (taskId: string) => {
    const userSub = submissions.find(s => s.taskId === taskId && s.userId === user?.uid);
    return userSub ? userSub.status : 'NOT_STARTED';
  };

  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="Operational Missions" 
        subtitle="Active Assignments & Weekly Challenges" 
        actions={
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {[
              { id: 'ALL', label: 'All Clusters' },
              { id: 'OPERATIONAL', label: 'Offensive / Defensive' },
              { id: 'SOFT_SKILL', label: 'Soft Skills' },
              { id: 'SCIENTIFIC', label: 'Наукові тези' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all",
                  filter === f.id ? "bg-cyan-500 text-black font-black" : "text-white/40 hover:text-white"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)
          ) : tasks.filter(t => filter === 'ALL' || t.category === filter).length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
              <ShieldCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/20 font-mono text-xs uppercase tracking-widest">No active missions matching current filter</p>
            </div>
          ) : (
            tasks.filter(t => filter === 'ALL' || t.category === filter).map((task) => {
              const status = getTaskStatus(task.id);
              return (
                <motion.div key={task.id} layout>
                  <ClippedContainer 
                    className={cn(
                      "p-8 transition-all duration-300 group cursor-pointer",
                      selectedTask?.id === task.id ? "border-cyan-500 bg-cyan-500/5 shadow-2xl" : "hover:border-white/20"
                    )}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border",
                        status === 'APPROVED' ? "bg-green-500/10 border-green-500/30 text-green-400" : 
                        status === 'PENDING' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                        "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      )}>
                        <Target className="w-8 h-8" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-1 group-hover:text-cyan-400 transition-colors">
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-widest">
                                <span className={cn(
                                    "font-bold",
                                    task.difficulty === 'INSANE' ? "text-red-500" :
                                    task.difficulty === 'HARD' ? "text-amber-500" :
                                    "text-cyan-400"
                                )}>
                                    {task.difficulty} LVL
                                </span>
                                <span className="text-white/30">/</span>
                                <span className="text-white/50">{task.category}</span>
                            </div>
                          </div>

                          <div className={cn(
                            "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                            status === 'APPROVED' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                            status === 'PENDING' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                            "bg-white/5 border-white/10 text-white/30"
                          )}>
                            {status === 'APPROVED' ? <CheckCircle2 className="w-3 h-3" /> : 
                             status === 'PENDING' ? <Clock className="w-3 h-3" /> : 
                             <AlertCircle className="w-3 h-3" />}
                            {status.replace('_', ' ')}
                          </div>
                        </div>

                        <p className="text-white/40 text-xs font-mono leading-relaxed line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-bold text-white font-mono">{task.rewardXP} XP</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/20">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] font-mono uppercase tracking-widest">Expires: {new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </ClippedContainer>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div
                key={selectedTask.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ClippedContainer className="p-8 sticky top-32 border-cyan-500/50 bg-cyan-500/5 backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <TechHeader title="Submission" subtitle="Intelligence Report" />
                        <button onClick={() => setSelectedTask(null)} className="text-white/20 hover:text-white transition-colors">
                            <Zap className="w-4 h-4 rotate-45" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-2xl">
                            <h4 className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-2">Target Task</h4>
                            <p className="text-white font-black italic uppercase tracking-tighter">{selectedTask.title}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-mono uppercase text-white/30 tracking-widest ml-1">Write-up / Solution Body</label>
                            <textarea 
                                value={writeup}
                                onChange={(e) => setWriteup(e.target.value)}
                                placeholder="Detail your findings, methodologies, and evidence here..."
                                className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-xs font-mono focus:outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner"
                            />
                        </div>

                        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-4">
                            <PenTool className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-[10px] text-amber-500/70 font-mono leading-relaxed">
                                Submissions are reviewed by curators manually. Ensure your findings are clear and well-documented for maximum XP reward.
                            </p>
                        </div>

                        <CyberButton 
                            onClick={handleSubmit} 
                            disabled={!writeup || submitting}
                            className="w-full py-4 uppercase font-black tracking-widest text-sm"
                        >
                            {submitting ? 'Transmitting Data...' : 'Transmit Report'}
                            <Send className="w-4 h-4 ml-2" />
                        </CyberButton>
                    </div>
                </ClippedContainer>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center p-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-xl font-black text-white/40 italic uppercase tracking-tighter mb-4">No Mission Selected</h3>
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest leading-relaxed">
                    Select an active directive from the operational queue to begin the submission protocol and earn credits.
                </p>
                <ChevronRight className="w-6 h-6 text-white/10 mt-8 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
