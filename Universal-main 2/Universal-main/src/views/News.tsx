import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from '../lib/firebase';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader } from '../components/UI';
import { Newspaper, Calendar, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const News = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-12 pb-32">
      <TechHeader title="Intel Feed" subtitle="Global Cybersecurity Intelligence & Academy Updates" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 rounded-[2rem] animate-pulse" />)
        ) : posts.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
            <Newspaper className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-mono text-xs uppercase tracking-widest">No active intel reports found</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <ClippedContainer className="group h-full flex flex-col p-0 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/10">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={post.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md",
                      post.type === 'CTF_EVENT' ? "bg-amber-500/20 border-amber-500/50 text-amber-400" :
                      post.type === 'CYBER_NEWS' ? "bg-red-500/20 border-red-500/50 text-red-400" :
                      "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    )}>
                      {post.type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-white/40 text-xs font-mono leading-relaxed line-clamp-3 mb-6">
                    {post.content}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[8px] text-white/30 uppercase tracking-widest font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button className="text-cyan-400 p-2 hover:bg-cyan-400/10 rounded-lg transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
