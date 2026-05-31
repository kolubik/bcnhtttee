import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClippedContainer, TechHeader, CyberButton, ProgressBar, SkillHex, StatBox } from '../components/UI';
import { Terminal, Cpu, Users, User, GraduationCap, Plus, Trash2, Edit3, Save, CheckCircle2, ShieldCheck, Clock, XCircle, BadgeCheck, Zap, Trophy, Target, Award, Layout, FileText, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType, doc, updateDoc, collection, addDoc, serverTimestamp } from '../lib/firebase';
import { SkillTree } from '../components/SkillTree';
import { cn } from '../lib/utils';

export const Dashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [newSkill, setNewSkill] = useState('');
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [certName, setCertName] = useState('');

  if (!profile) return null;

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, editedProfile);
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${profile.uid}`);
    }
  };

  const addSkill = (type: 'hard' | 'soft') => {
    if (!newSkill) return;
    const key = type === 'hard' ? 'hardSkills' : 'softSkills';
    const current = editedProfile[key] || {};
    setEditedProfile({
      ...editedProfile,
      [key]: { ...current, [newSkill]: { xp: 0, level: 1 } }
    });
    setNewSkill('');
  };

  const removeSkill = (type: 'hard' | 'soft', skillName: string) => {
    const key = type === 'hard' ? 'hardSkills' : 'softSkills';
    const updated = { ...editedProfile[key] };
    delete updated[skillName];
    setEditedProfile({ ...editedProfile, [key]: updated });
  };

  const submitVerification = async () => {
    if (!certName) return;
    setIsSubmittingVerification(true);
    try {
      await addDoc(collection(db, 'verifications'), {
        userId: profile.uid,
        userName: profile.displayName,
        userEmail: user?.email,
        certificateName: certName,
        status: 'PENDING',
        createdAt: serverTimestamp(),
      });
      setCertName('');
      alert('Verification protocol initiated. Security review in progress.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'verifications');
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  const levelProgress = ((profile.points || 0) % 1000) / 10;

  return (
    <div className="space-y-6 pb-24">
      <TechHeader 
        title="Command Dashboard" 
        subtitle="Nexus Control & Operational Overview"
      />
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClippedContainer className="p-8 flex items-center justify-between border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white/40" />
                  </div>
                  <div>
                      <span className="block text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1 font-mono font-bold">Current Rank</span>
                      <h3 className="text-base font-bold text-white tracking-[0.2em] leading-none uppercase">{profile.role || 'CADET'}</h3>
                  </div>
              </div>
              <div className="text-right">
                  <span className="block text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1 font-mono font-bold">Total Credits</span>
                  <span className="text-3xl font-bold text-blue-400 tracking-tighter leading-none">{(profile.points || 0).toLocaleString()}</span>
              </div>
          </ClippedContainer>

          <ClippedContainer className="p-8 min-w-[300px] border-white/10 bg-white/[0.02]">
              <div className="flex justify-between items-end mb-4">
                  <div>
                      <span className="block text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1 font-mono font-bold">Node Level</span>
                      <span className="text-3xl font-bold text-white tracking-tight leading-none">LVL {profile.level || 1}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-[0.1em] mb-1">{levelProgress.toFixed(0)}% TO NEXT</span>
              </div>
              <ProgressBar progress={levelProgress} />
          </ClippedContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <ClippedContainer className="p-0 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 relative">
              <div className="absolute inset-0 bg-grid-white/[0.05] scanlines" />
            </div>
            <div className="px-8 pb-8 -mt-16 relative">
              <div className="w-32 h-32 rounded-3xl border-4 border-[#0a0a0a] shadow-2xl overflow-hidden mb-6 bg-[#0a0a0a] relative group">
                <img 
                  src={profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.uid}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Terminal className="text-white" />
                </div>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={editedProfile.displayName} 
                    onChange={e => setEditedProfile({...editedProfile, displayName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                  />
                  <input 
                    type="text" 
                    value={editedProfile.title} 
                    onChange={e => setEditedProfile({...editedProfile, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                  />
                  <textarea 
                    value={editedProfile.bio} 
                    onChange={e => setEditedProfile({...editedProfile, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white h-24 font-mono text-sm"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">{profile.displayName}</h2>
                  <p className="text-cyan-400 font-mono mb-4 uppercase tracking-[0.2em] text-[10px] font-bold">{profile.title}</p>
                  <div className="space-y-4 mb-8">
                      <p className="text-white/40 text-xs leading-relaxed font-mono bg-white/5 p-4 rounded-xl border border-white/5">
                          {profile.bio}
                      </p>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-4">
                <CyberButton onClick={() => navigate(`/profile/${profile.uid}`)} className="flex-1 text-[10px] py-4 tracking-[0.2em] font-black uppercase">
                  <User className="w-4 h-4 mr-2" />
                  Access Full Profile
                </CyberButton>
                
                <div className="flex gap-4">
                  {isEditing ? (
                    <CyberButton onClick={handleSave} className="flex-1 text-[10px] py-3 tracking-widest uppercase">
                      <Save className="w-4 h-4 mr-2" />
                      Commit Node
                    </CyberButton>
                  ) : (
                    <CyberButton onClick={handleEdit} variant="ghost" className="flex-1 text-[10px] py-3 tracking-widest uppercase">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modify Node
                    </CyberButton>
                  )}
                </div>
              </div>
            </div>
          </ClippedContainer>

          {/* Achievements */}
          <ClippedContainer color="amber" className="p-8">
            <TechHeader title="Achievements" subtitle="Hall of Valor" color="amber" />
            <div className="grid grid-cols-4 gap-4 mt-8">
                {profile.achievements?.length > 0 ? profile.achievements.map((ach: string, i: number) => (
                    <div key={i} className="aspect-square bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center group relative cursor-pointer hover:bg-amber-500/20 transition-all">
                        <Award className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black/90 border border-amber-500/50 px-2 py-1 rounded text-[8px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {ach}
                        </div>
                    </div>
                )) : (
                    [1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-white/[0.02] border border-dashed border-white/10 rounded-xl" />
                    ))
                )}
            </div>
          </ClippedContainer>

          <ClippedContainer className="p-8">
            <TechHeader title="Certifications" subtitle="Verification Protocols" />
            <div className="space-y-4 mb-6 mt-6">
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  placeholder="Certificate ID / Name"
                  value={certName}
                  onChange={e => setCertName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs font-mono"
                />
                <CyberButton onClick={submitVerification} disabled={isSubmittingVerification} className="w-full py-2 uppercase text-[10px] tracking-widest">
                  Init Verification
                </CyberButton>
              </div>
            </div>
          </ClippedContainer>
        </div>

        {/* Main Content: Skills & Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-8">
            {/* Neural Core: Hard Skills */}
            <ClippedContainer>
              <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <TechHeader title="Neural Core" subtitle="Hard Skills Progression" />
                    <div className="flex gap-2">
                        {!isEditing && (
                            <CyberButton 
                                onClick={() => navigate(`/profile/${profile.uid}/hard-skills`)}
                                variant="ghost" 
                                className="text-[9px] py-1 px-3 tracking-widest uppercase h-8 border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
                            >
                                <Zap className="w-3 h-3 mr-2" />
                                Core Detail
                            </CyberButton>
                        )}
                        {isEditing && (
                            <>
                                <input 
                                    type="text" 
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    placeholder="New Hard Skill..."
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-mono text-white focus:border-cyan-500/50 focus:outline-none"
                                />
                                <button onClick={() => addSkill('hard')} className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries((isEditing ? editedProfile : profile).hardSkills || {}).map(([name, data]: any, i) => (
                       <div key={i} className="relative group">
                          <SkillHex label={name} xp={data.xp || 0} level={data.level || 1} />
                          {isEditing && (
                              <button onClick={() => removeSkill('hard', name)} className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-3 h-3" />
                              </button>
                          )}
                       </div>
                    ))}
                  </div>

                  {!isEditing && (
                      <div className="pt-8 border-t border-white/5">
                        <SkillTree 
                            skills={Object.keys(profile.hardSkills || {})} 
                            experience={profile.experience || []}
                            isVerified={profile.isVerified}
                        />
                      </div>
                  )}
              </div>
            </ClippedContainer>

            {/* Human Interface: Soft Skills */}
            <ClippedContainer color="amber">
              <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <TechHeader title="Human Interface" subtitle="Social & Integration Skills" color="amber" />
                    <div className="flex gap-2">
                        {!isEditing && (
                            <CyberButton 
                                onClick={() => navigate(`/profile/${profile.uid}/soft-skills`)}
                                variant="ghost" 
                                className="text-[9px] py-1 px-3 tracking-widest uppercase h-8 border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                            >
                                <Layout className="w-3 h-3 mr-2" />
                                Interface Detail
                            </CyberButton>
                        )}
                        {isEditing && (
                            <>
                                <input 
                                    type="text" 
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    placeholder="New Soft Skill..."
                                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] font-mono text-white focus:border-amber-500/50 focus:outline-none"
                                />
                                <button onClick={() => addSkill('soft')} className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries((isEditing ? editedProfile : profile).softSkills || {}).map(([name, data]: any, i) => (
                       <div key={i} className="relative group">
                           <SkillHex label={name} xp={data.xp || 0} level={data.level || 1} color="amber" />
                           {isEditing && (
                              <button onClick={() => removeSkill('soft', name)} className="absolute -top-2 -right-2 p-1.5 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-3 h-3" />
                              </button>
                          )}
                       </div>
                    ))}
                  </div>
              </div>
            </ClippedContainer>
          </div>

          {/* System Logs: Experience */}
          <ClippedContainer>
            <div className="p-6">
              <TechHeader title="Action Logs" subtitle="Historical Operations" />
              <div className="mt-8 relative pl-8 border-l border-white/10 space-y-8">
                  {(profile.experience?.length > 0 ? profile.experience : [
                  { company: 'Academy Entry', role: 'Access Granted', date: 'INITIAL', description: 'Subject has joined the UNIVERSAL network.' }
                  ]).map((exp: any, i: number) => (
                  <div key={i} className="relative group">
                      <div className="absolute -left-[41px] top-0 w-4 h-4 rounded border-2 border-cyan-500 bg-[#0a0a0a] group-hover:scale-125 transition-transform" />
                      <div className="space-y-2">
                      <div className="flex items-center justify-between">
                          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">{exp.role}</h4>
                          <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{exp.date}</span>
                      </div>
                      <p className="text-amber-400/80 font-bold text-[10px] uppercase tracking-[0.3em]">{exp.company}</p>
                      <p className="text-white/40 text-xs leading-relaxed font-mono border-l border-white/5 pl-4">{exp.description}</p>
                      </div>
                  </div>
                  ))}
              </div>
            </div>
          </ClippedContainer>
        </div>
      </div>
    </div>
  );
};
