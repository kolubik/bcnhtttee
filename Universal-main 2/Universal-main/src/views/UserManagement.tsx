import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth, collection, query, getDocs, doc, deleteDoc, updateDoc, onSnapshot, orderBy, limit } from '../lib/firebase';
import { 
  Users, UserPlus, Shield, Trash2, Edit3, 
  Search, ShieldAlert, CheckCircle2, XCircle, 
  Loader2, Key, Mail, Terminal, Activity
} from 'lucide-react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';

export const UserManagement = () => {
  const { user, profile, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create User Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'student',
    displayName: ''
  });
  const [creationStatus, setCreationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubLogs = onSnapshot(
      query(collection(db, 'auth_logs'), orderBy('timestamp', 'desc'), limit(50)), 
      (snap) => {
        setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, [isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreationStatus('submitting');
    setError('');

    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      const result = await response.json();
      if (response.ok) {
        setCreationStatus('success');
        setNewUser({ username: '', password: '', role: 'student', displayName: '' });
        setTimeout(() => {
          setCreationStatus('idle');
          setIsCreating(false);
        }, 2000);
      } else {
        throw new Error(result.error || "Uplink failure.");
      }
    } catch (err: any) {
      setCreationStatus('error');
      setError(err.message);
    }
  };

  const setUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: userId, role: newRole })
      });
      if (!response.ok) throw new Error("Role update failed.");
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Role update failed.");
    }
  };

  const toggleUserStatus = async (userId: string, currentDisabled: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        disabled: !currentDisabled,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("ARE YOU SURE? THIS OPERATION IS IRREVERSIBLE.")) return;
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Delete failed.");
      alert("Operative purged from system.");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Delete failed.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <ShieldAlert className="w-20 h-20 text-red-500 animate-pulse" />
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Access Denied</h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Administrative Privileges Required.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-32">
      <TechHeader 
        title="Operative Management" 
        subtitle="System Administration" 
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-white/20 font-mono text-[9px] uppercase tracking-widest leading-none mb-1">Active Nodes</p>
              <p className="text-white font-mono text-xl font-black leading-none">{users.length}</p>
            </div>
            <CyberButton onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-6 py-4">
              <UserPlus className="w-5 h-5" />
              GENERATE ACCESS KEY
            </CyberButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User List */}
        <ClippedContainer className="lg:col-span-2 p-8">
          <div className="space-y-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH OPERATIVES..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 font-mono text-xs"
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center py-20 animate-pulse text-white/20">
                  <Activity className="w-12 h-12 mb-4" />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Scanning Network...</span>
                </div>
              ) : filteredUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${u.disabled ? 'bg-red-500/10 text-red-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                      {u.role === 'admin' ? <Shield className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase italic">{u.displayName}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                          u.role === 'admin' ? 'border-amber-500/50 text-amber-400' : 'border-cyan-500/50 text-cyan-400'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-white/40">@{u.username} | {u.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setUserRole(u.id, u.role)}
                      className="p-2 rounded-lg border border-amber-500/20 text-amber-500/40 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                      title="Toggle Role"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleUserStatus(u.id, u.disabled)}
                      className={`p-2 rounded-lg border transition-colors ${
                        u.disabled ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                      }`}
                      title={u.disabled ? "Enable" : "Disable"}
                    >
                      {u.disabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => deleteUser(u.id)}
                      className="p-2 rounded-lg border border-red-500/20 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ClippedContainer>

        {/* Auth Logs Sidebar */}
        <ClippedContainer color="amber" className="p-8">
          <TechHeader title="Security Audit" subtitle="Activity Logs" color="amber" />
          <div className="mt-8 space-y-4 font-mono text-[9px] overflow-y-auto max-h-[600px] pr-2 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="p-3 border-l-2 border-amber-500/30 bg-white/[0.02] space-y-1">
                <div className="flex justify-between items-center text-white/40">
                  <span>{log.timestamp?.toDate().toLocaleTimeString()}</span>
                  <span className={log.event === 'LOGIN_SUCCESS' ? 'text-green-400' : 'text-red-400'}>
                    {log.event}
                  </span>
                </div>
                <div className="text-white">USER: @{log.username}</div>
              </div>
            ))}
          </div>
        </ClippedContainer>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <ClippedContainer className="w-full max-w-lg p-12 relative overflow-hidden">
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Initialize New Node</h2>
                  <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mt-1">Generating Access Protocol</p>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-2">Username</label>
                          <input 
                            required
                            placeholder="OPERATIVE_ID"
                            value={newUser.username}
                            onChange={e => setNewUser({...newUser, username: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500/50 outline-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-2">Password</label>
                          <input 
                            required
                            type="text" // Shown for convenience in admin dash
                            placeholder="ACCESS_KEY"
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500/50 outline-none"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-2">Full Display Name</label>
                      <input 
                        placeholder="IDENT_NAME"
                        value={newUser.displayName}
                        onChange={e => setNewUser({...newUser, displayName: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-cyan-500/50 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-2">Classification</label>
                      <div className="flex gap-4">
                        {['student', 'admin'].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setNewUser({...newUser, role: r})}
                            className={`flex-1 py-3 font-mono text-[10px] uppercase tracking-widest rounded-xl border transition-all ${
                              newUser.role === r ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-white/20'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="min-h-[40px] flex items-center justify-center">
                    {creationStatus === 'submitting' && <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />}
                    {creationStatus === 'success' && <div className="text-green-400 font-mono text-[10px] uppercase tracking-widest">Protocol Success. Node Online.</div>}
                    {creationStatus === 'error' && <div className="text-red-500 font-mono text-[10px] uppercase tracking-widest">ERROR: {error}</div>}
                  </div>

                  <CyberButton 
                    type="submit" 
                    disabled={creationStatus === 'submitting'}
                    className="w-full py-4 text-lg font-black italic uppercase tracking-widest"
                  >
                    DEPLOY NODE
                  </CyberButton>
                </form>
              </div>
            </ClippedContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
