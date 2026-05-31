import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ClippedContainer, TechHeader } from '../components/UI';
import { Bell, Info, ShieldAlert, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Simulation of system notifications if none exist in DB
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      // If table doesn't exist yet or permission denied, we'll show mock data for the demo
      handleFirestoreError(error, OperationType.LIST, 'notifications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const mockNotifications = [
    {
      id: 'm1',
      title: 'Security Clearance Updated',
      body: 'Your operative level has been elevated to LEVEL 5 after successful mission completion.',
      type: 'SECURITY',
      createdAt: new Date()
    },
    {
      id: 'm2',
      title: 'New Mission Available',
      body: 'Sector 7 report indicates neural drift. Mission "Ghost in the Machine" is now active.',
      type: 'INTEL',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'm3',
      title: 'Squad Invite',
      body: 'Operative X-Ray has invited you to join "Shadow Collective".',
      type: 'SOCIAL',
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  const displayList = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <div className="space-y-12 pb-32">
      <TechHeader title="Signal Decryption" subtitle="Active Pulse Notifications" />

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {displayList.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ClippedContainer className="p-6 flex items-start gap-6 border-white/10 hover:border-cyan-500/30 transition-all group">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border shrink-0",
                  n.type === 'SECURITY' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                  n.type === 'INTEL' ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" :
                  "bg-white/5 border-white/10 text-white/40"
                )}>
                  {n.type === 'SECURITY' ? <ShieldAlert className="w-6 h-6" /> : 
                   n.type === 'INTEL' ? <Zap className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                      {n.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt?.seconds * 1000 || n.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-[10px] text-white/50 font-mono leading-relaxed line-clamp-2">
                    {n.body}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 self-center text-[8px] font-black text-white/20 uppercase tracking-widest border-l border-white/5 pl-6 h-12">
                   Protocol: {n.type}
                </div>
              </ClippedContainer>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-3xl" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
