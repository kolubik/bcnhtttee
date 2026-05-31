import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, doc, getDoc, collection, onSnapshot, query, where, orderBy, limit, handleFirestoreError, OperationType, updateDoc, addDoc, serverTimestamp } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, User, Camera, Mail, Send, Github, 
  Download, ExternalLink, Award, Zap, 
  CheckCircle2, Layout, Settings, LogOut,
  ChevronRight, BarChart3, Activity as ActivityIcon, Target,
  Cpu, Terminal, History, Briefcase, Bell, MessageSquare,
  Lock, Key, Globe, FileText, Database, Radio
} from 'lucide-react';
import { GlassContainer, TechHeader, CyberButton, ClippedContainer, StatBox } from '../components/UI';
import { MatrixBackground } from '../components/MatrixBackground';
import { RadarChart } from '../components/RadarChart';
import { cn } from '../lib/utils';

export const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, profile: currentProfile, isAdmin: isCurrentUserAdmin, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        // Instant UI update
        setProfile((prev: any) => ({ ...prev, photoURL: optimizedDataUrl }));
        // Background save
        updateProfile({ photoURL: optimizedDataUrl });
      };
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!id) return;

    // Fetch Profile
    const unsubProfile = onSnapshot(doc(db, 'users', id), (doc) => {
      if (doc.exists()) {
        setProfile({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });

    // Fetch Skills
    const unsubSkills = onSnapshot(
      collection(db, `users/${id}/skills`),
      (snapshot) => {
        setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    // Fetch Activities
    const qActivities = query(
      collection(db, `users/${id}/activities`),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubProfile();
      unsubSkills();
      unsubActivities();
    };
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="relative">
        <div className="w-20 h-20 border border-cyan-500/10 rounded-full" />
        <div className="absolute inset-0 w-20 h-20 border-t-2 border-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-cyan-500/50 animate-pulse">INIT_NODE</div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#050505]">
      <Shield className="w-16 h-16 text-red-500/20" />
      <h2 className="text-xl font-mono text-white/20 uppercase tracking-[0.5em]">Personnel Record Corrupted</h2>
      <CyberButton onClick={() => navigate('/dashboard')}>Re-uplink Station</CyberButton>
    </div>
  );

  const isOwnProfile = currentUser?.uid === id;
  const isAdmin = isCurrentUserAdmin;

  const updateProfile = async (data: any) => {
    if (!isOwnProfile && !isAdmin) return;
    try {
      await updateDoc(doc(db, 'users', id), data);
      
      // Log activity
      const keys = Object.keys(data).join(', ');
      await addDoc(collection(db, `users/${id}/activities`), {
        userId: id,
        type: 'PROFILE_UPDATE',
        description: `Personnel dossier updated: ${keys}`,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
    }
  };

  const downloadStats = () => {
    const data = {
      user: profile,
      skills: skills,
      activities: activities
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INTELLIGENCE_REPORT_${profile.callsign}.json`;
    link.click();
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <MatrixBackground />
      
      {/* 1. Header Profile Block */}
      <section id="header" className="relative pt-4 md:pt-8 pb-8 w-full space-y-8">
        {/* Localized Page Header */}
        <TechHeader 
          title="Personal Profile" 
          subtitle="v4.2.0-STABLE | SECURE Uplink Established"
        />

        <ClippedContainer className="p-4 sm:p-8 md:p-10 border-white/10 bg-[#0a0a0a]/80 backdrop-blur-3xl relative overflow-hidden group">
          {/* Subtle background tech lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar Section */}
            <div className="relative shrink-0 group/avatar">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-white/10 bg-[#050505] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover/avatar:border-cyan-500/30 transition-all duration-700 relative">
                 <img 
                  src={profile.photoURL} 
                  className="w-full h-full object-cover transition-all duration-700"
                  alt="Avatar"
                />
              </div>
              {(isOwnProfile || isAdmin) && (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full flex items-center justify-center z-20 cursor-pointer overflow-hidden border border-transparent hover:border-cyan-500/20 transition-all"
                    title="Change Avatar"
                  >
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <Camera className="w-8 h-8 text-cyan-400 mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                      <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.3em] font-black">Link_New_ID</span>
                    </div>
                  </button>
                </>
              )}
            </div>
  
            {/* Info Section */}
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {isEditing && (isOwnProfile || isAdmin) ? (
                      <div className="space-y-4">
                        <input 
                          value={profile.fullName} 
                          onChange={e => updateProfile({ fullName: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-3xl font-black uppercase text-white w-full md:w-auto font-mono focus:border-cyan-500/50 outline-none transition-all"
                          placeholder="FULL_NAME"
                        />
                        <input 
                          value={profile.callsign} 
                          onChange={e => updateProfile({ callsign: e.target.value })}
                          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xl font-bold uppercase text-cyan-400 w-full md:w-auto font-mono focus:border-cyan-500/30 outline-none transition-all"
                          placeholder="CALLSIGN"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white font-mono leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                        {profile.fullName || profile.displayName || 'AGENT'}
                      </h1>
                    )}
                  </div>
                  
                  {isEditing && (isOwnProfile || isAdmin) ? (
                    <div className="pt-2">
                       <input 
                        value={profile.courseGroup} 
                        onChange={e => updateProfile({ courseGroup: e.target.value })}
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white opacity-80 w-full md:w-80 font-mono text-xs focus:border-cyan-500/30 outline-none transition-all"
                        placeholder="GROUP_IDENT"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center md:justify-start gap-3">
                      <p className="text-white/40 font-mono text-[9px] uppercase tracking-[0.4em] font-medium py-0.5">
                        {profile.courseGroup || 'ННІ4-25-102Кб'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4 border-t border-white/5">
                 {['Cadet', 'SSL', 'Cyber Centre'].map((tag) => (
                   <div key={tag} className="px-4 py-2 bg-white/[0.02] border border-white/10 rounded-md flex items-center gap-2.5 hover:bg-white/[0.05] transition-all cursor-crosshair">
                     <div className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full" />
                     <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">{tag}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </ClippedContainer>
      </section>

      <main className="w-full mt-4 md:mt-8 relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 pb-20 px-1 sm:px-0">
        
        {/* LEFT COLUMN: INTEL & SKILLS */}
        <div className="xl:col-span-8 space-y-8 md:space-y-6 pb-12 md:pb-20">
          
          {/* Topology Matrix Section */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-4">
              <TechHeader title="Topology" subtitle="Aptitude Matrix Analysis" />
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <ClippedContainer className="p-4 md:p-6 border-cyan-500/10 bg-cyan-500/[0.02] flex flex-col items-center justify-center space-y-1 md:space-y-2 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="text-xs md:text-sm font-black italic uppercase text-cyan-400 tracking-[0.3em]">Matrix Topology</h3>
              </div>
              <div className="scale-75 sm:scale-100">
                <RadarChart stats={profile.radarStats || { technical: 50, intelligence: 50, security: 50, tactical: 50, leadership: 50 }} />
              </div>
            </ClippedContainer>
          </section>

          {/* Skills Section */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-4">
              <TechHeader title="Skills" subtitle="Operational Assets" />
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <SkillNavCard 
                category="HARD" 
                icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />} 
                onClick={() => navigate(`/profile/${id}/hard-skills`)}
              />
              <SkillNavCard 
                category="SOFT" 
                icon={<Layout className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />} 
                onClick={() => navigate(`/profile/${id}/soft-skills`)}
              />
            </div>
          </section>

          {/* Scientific Contributions Section */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-4">
              <TechHeader title="Research" subtitle="Academic" color="amber" />
              <div className="h-px flex-1 bg-gradient-to-r from-amber-500/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
               <SkillNavCard 
                category="Standard" 
                icon={<FileText className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />} 
                onClick={() => navigate(`/roadmap/scientific-theses`)}
                color="amber"
              />
              <SkillNavCard 
                category="International" 
                icon={<Globe className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />} 
                onClick={() => navigate(`/roadmap/scientific-theses`)}
                color="cyan"
              />
            </div>
          </section>

          {/* Achievements Section */}
          <section className="space-y-1.5">
             <div className="flex items-center gap-4">
              <TechHeader title="Achievements" subtitle="Awards" />
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 px-1">
              {(profile.achievements || ['First Investigation', 'Active Member', 'Top Performer']).map((ach: string, i: number) => (
                <motion.div
                  key={ach}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <ClippedContainer className="p-3 text-center border-white/5 bg-[#0a0a0a] group-hover:border-cyan-500/20 transition-all">
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                        <Award className="w-5 h-5 text-white/20 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <span className="block text-[7px] font-mono text-white/20 group-hover:text-cyan-400 uppercase tracking-widest leading-tight">
                        {ach}
                      </span>
                    </div>
                  </ClippedContainer>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Media Control Section */}
        <aside className="xl:col-span-4 space-y-6 md:space-y-4 pb-20">
          
          {/* Status & ID Card */}
          <ClippedContainer className="p-4 sm:p-6 border-white/10 bg-white/[0.01] space-y-4 sm:space-y-6">
             <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
               <div className="flex items-center gap-3">
                 <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-500" />
                 <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">Status</h3>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[7px] font-mono text-cyan-500/60 uppercase">Operational</span>
                 <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2 sm:gap-3">
               <StatBox 
                 label="SOFT SKILLS" 
                 value={skills.filter((s: any) => s.category === 'SOFT').length} 
                 icon={<Layout className="text-purple-400" />} 
                 onClick={() => navigate(`/profile/${id}/soft-skills`)}
               />
               <StatBox 
                 label="HARD SKILLS" 
                 value={skills.filter((s: any) => s.category === 'HARD').length} 
                 icon={<Zap className="text-cyan-400" />} 
                 onClick={() => navigate(`/profile/${id}/hard-skills`)}
               />
               <StatBox label="MISSIONS" value={profile.stats?.completedMissions || 0} icon={<Target />} />
               <StatBox label="LAB LOGS" value={profile.stats?.completedLabs || 0} icon={<Cpu />} />
               <StatBox label="THESES" value={profile.stats?.thesesCount || 0} icon={<FileText className="text-amber-400" />} />
               <StatBox label="RANK POS" value={`#${profile.rank || 42}`} icon={<BarChart3 />} />
             </div>
             
             <div className="pt-2">
               <CyberButton 
                onClick={downloadStats}
                className="w-full py-4 text-[9px] tracking-[0.4em] font-black"
               >
                <Download className="w-4 h-4 mr-3" />
                EXTRACT DATA
               </CyberButton>
             </div>
          </ClippedContainer>

          {/* Activities Feed */}
          {isAdmin && (
            <section className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <History className="w-4 h-4 text-white/20" />
                <h3 className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">Matrix_Logs</h3>
              </div>
              
              <div className="space-y-3 relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />
                {activities.length > 0 ? activities.map((act, i) => (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative pl-10 group"
                  >
                    <div className="absolute left-[21px] top-4 w-2 h-2 rounded-full bg-[#050505] border border-white/20 group-hover:border-cyan-500 group-hover:bg-cyan-500 transition-all z-10" />
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[9px] font-mono font-black text-white/60 uppercase tracking-tight">{act.type}</span>
                         <span className="text-[8px] font-mono text-white/20">{new Date(act.timestamp?.toDate?.() || act.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[9px] font-mono text-white/30 leading-relaxed truncate">{act.description}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-10 text-center text-[9px] font-mono text-white/10 uppercase tracking-widest border border-dashed border-white/5 rounded-xl">No active logs found.</div>
                )}
              </div>
            </section>
          )}

          {/* Neural Uplinks */}
          <section className="space-y-3">
             <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                 <Globe className="w-4 h-4 text-white/20" />
                 <h3 className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">External_Links</h3>
               </div>
               {(isOwnProfile || isAdmin) && (
                 <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[8px] font-mono font-bold uppercase text-cyan-500 hover:text-cyan-400 transition-colors tracking-[0.2em]"
                 >
                   {isEditing ? '[ COMMIT_INTEL ]' : '[ MODIFY_INTEL ]'}
                 </button>
               )}
            </div>
            <div className="space-y-2">
                <ContactField icon={<Mail />} label="Email" value={profile.socialLinks?.email} isEditing={isEditing} onChange={(val: string) => updateProfile({ socialLinks: { ...(profile.socialLinks || {}), email: val } })} />
                <ContactField icon={<Send />} label="Telegram" value={profile.socialLinks?.telegram} isEditing={isEditing} onChange={(val: string) => updateProfile({ socialLinks: { ...(profile.socialLinks || {}), telegram: val } })} />
                <ContactField icon={<Github />} label="GitHub" value={profile.socialLinks?.github} isEditing={isEditing} onChange={(val: string) => updateProfile({ socialLinks: { ...(profile.socialLinks || {}), github: val } })} />
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

const SkillNavCard = ({ category, icon, onClick, color = 'cyan' }: any) => (
  <ClippedContainer 
    onClick={onClick}
    className={cn(
      "p-5 border-white/5 bg-[#0a0a0a]/80 hover:bg-[#111] transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]",
      color === 'cyan' ? "hover:border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0)] hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]" : 
      color === 'amber' ? "hover:border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0)] hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]" : 
      "hover:border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0)] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
    )}
  >
    <div className={cn(
      "absolute -right-4 -bottom-4 w-32 h-32 opacity-5 scale-150 transition-transform duration-1000 group-hover:scale-[2] group-hover:opacity-10 pointer-events-none",
      color === 'cyan' ? "text-cyan-500" : color === 'amber' ? "text-amber-500" : "text-purple-500"
    )}>
      {icon}
    </div>
    <div className="flex items-center gap-4 sm:gap-6">
      <div className={cn(
        "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all shadow-2xl relative z-10",
        color === 'cyan' ? "bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-500/50" : 
        color === 'amber' ? "bg-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/50" :
        "bg-purple-500/10 border border-purple-500/20 group-hover:border-purple-500/50"
      )}>
        {React.cloneElement(icon, { className: "w-5 h-5 sm:w-8 sm:h-8" })}
      </div>
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-black italic text-white uppercase tracking-tighter">{category}</h3>
        <p className="text-[8px] sm:text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] font-medium mt-1">Access Operations</p>
      </div>
      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/10 ml-auto group-hover:text-white group-hover:translate-x-2 transition-all" />
    </div>
  </ClippedContainer>
);

const AdminAction = ({ icon, label, onClick, danger = false }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 p-4 rounded-lg border transition-all text-left group",
      danger 
        ? "bg-red-500/[0.02] border-red-500/10 hover:border-red-500/30 text-red-500/40 hover:text-red-500" 
        : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/30 hover:text-white"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded flex items-center justify-center transition-transform",
      danger ? "bg-red-500/10" : "bg-white/10"
    )}>
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold">{label}</span>
  </button>
);

const ContactField = ({ icon, label, value, isEditing, onChange }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 group hover:border-white/10 transition-all">
    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/10 group-hover:text-cyan-500 group-hover:bg-cyan-500/5 transition-all">
      {React.cloneElement(icon, { size: 14 })}
    </div>
    <div className="flex-1">
      <span className="block text-[7px] font-mono text-white/20 uppercase tracking-[0.3em] font-black mb-1">{label}</span>
      {isEditing ? (
        <input 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/[0.05] border border-white/10 rounded px-3 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-cyan-500/30"
        />
      ) : (
        <span className="text-[10px] font-mono text-white/40 tracking-wider truncate block">{value || 'NOT_FOUND'}</span>
      )}
    </div>
  </div>
);

const ThesisListItem = ({ title, status, date, xp, color = 'amber' }: any) => (
  <div className={cn(
    "group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all cursor-crosshair",
    color === 'cyan' ? "hover:border-cyan-500/20" : "hover:border-amber-500/20"
  )}>
    <div className="flex items-center gap-4 overflow-hidden">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
        color === 'cyan' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20" : "bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20"
      )}>
        <FileText className="w-4 h-4" />
      </div>
      <div className="overflow-hidden min-w-0">
        <h4 className="text-[10px] font-black italic uppercase text-white tracking-widest truncate group-hover:text-cyan-400 transition-colors">
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-[7px] font-mono uppercase tracking-[0.2em] font-black",
            color === 'cyan' ? "text-cyan-500/60" : "text-amber-500/60"
          )}>
            {status}
          </span>
          <span className="text-white/10 text-[6px]">•</span>
          <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{date}</span>
        </div>
      </div>
    </div>
    <div className="text-right shrink-0 ml-4">
      <span className="block text-[8px] font-mono text-cyan-500/50 group-hover:text-cyan-400">+{xp} XP</span>
      <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/40 ml-auto mt-1" />
    </div>
  </div>
);

const ThesisCard = ({ title, status, date, color = 'amber' }: any) => (
  <div className={cn(
    "group relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl transition-all duration-300 hover:bg-white/[0.05]",
    color === 'cyan' ? "hover:border-cyan-500/30" : "hover:border-amber-500/30"
  )}>
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center border",
        color === 'cyan' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
      )}>
        <FileText className="w-5 h-5" />
      </div>
      <span className="text-[8px] font-mono text-white/20 group-hover:text-white/40">{date}</span>
    </div>
    <h5 className="text-[11px] font-black italic uppercase text-white tracking-widest leading-relaxed mb-3">
      {title}
    </h5>
    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
      <span className={cn(
        "text-[8px] font-mono uppercase tracking-widest font-black",
        color === 'cyan' ? "text-cyan-500/60" : "text-amber-500/60"
      )}>
        {status}
      </span>
      <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/40 transition-colors" />
    </div>
  </div>
);
