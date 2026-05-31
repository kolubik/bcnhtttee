import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, collection, onSnapshot, query, where, doc, getDoc } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, Shield, ExternalLink, ChevronLeft, 
  Search, Filter, Lock, CheckCircle2, 
  Target, Zap, Layout
} from 'lucide-react';
import { GlassContainer, TechHeader, CyberButton, ClippedContainer } from '../components/UI';
import { MatrixBackground } from '../components/MatrixBackground';
import { cn } from '../lib/utils';

interface ProfileSkillsProps {
  category: 'HARD' | 'SOFT';
}

export const ProfileSkills: React.FC<ProfileSkillsProps> = ({ category }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!id) return;

    // Fetch Profile for breadcrumb
    getDoc(doc(db, 'users', id)).then(snap => {
      if (snap.exists()) setProfile(snap.data());
    });

    // Fetch Skills filtered by category
    const q = query(
      collection(db, `users/${id}/skills`),
      where('category', '==', category)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [id, category]);

  const filteredSkills = skills.filter(s => 
    s.skillName.toLowerCase().includes(search.toLowerCase()) ||
    s.certificateTitle.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen space-y-12 pb-32">
      <MatrixBackground />
      
      {/* Header */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate(`/profile/${id}`)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Back to Personnel Profile</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <TechHeader 
            title={`${category} SKILLS`} 
            subtitle={`${profile?.callsign || 'IDENT'} // SECURE NODE :: ${category}_CATALOG`} 
          />
          
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0a0a]/80 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-mono text-[10px] focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <ClippedContainer className="h-full border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group p-1">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
                  <img 
                    src={skill.certificateUrl || 'https://images.unsplash.com/photo-1544391496-1ca7c976573c?auto=format&fit=crop&q=80'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={skill.certificateTitle}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 rounded-full p-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                      {skill.skillName}
                    </h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
                      {skill.certificateTitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        category === 'HARD' ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      )} />
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Validated Entry</span>
                    </div>
                    {skill.verificationDate && (
                      <span className="text-[8px] font-mono text-white/20 uppercase">
                        {new Date(skill.attainedAt?.toDate?.() || skill.attainedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </ClippedContainer>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/10">
              <Award className="w-10 h-10 text-white/10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-mono text-white/20 uppercase tracking-widest">No Competencies Logged</h3>
              <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em]">Sector scanning complete // zero matches</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
