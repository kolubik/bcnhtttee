import React, { useState } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import { 
  User, Search, ShieldCheck, LogOut, Terminal, 
  Newspaper, Target, Trophy, Users, Zap, Menu, X,
  Activity, GraduationCap, Bell, Cpu, Shield, MessageSquare,
  FlaskConical, Award, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const NavItem = ({ to, icon, label, badge }: { to: string; icon: React.ReactNode; label: string; badge?: string | number }) => (
    <NavLink
      to={to}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center justify-between group px-4 py-3 rounded-lg transition-all duration-200",
        isActive ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      {badge && (
        <span className={cn(
          "text-[9px] font-bold px-2 py-0.5 rounded flex items-center justify-center min-w-[20px]",
          "bg-blue-500/20 text-blue-400"
        )}>
          {badge}
        </span>
      )}
    </NavLink>
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isProfileActive = location.pathname === '/profile' || 
                          location.pathname === '/dashboard' ||
                          location.pathname === `/profile/${user.uid}`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#050505] border-b border-white/5 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tighter uppercase italic">Universal</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white/60 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.nav 
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={cn(
              "fixed top-0 left-0 h-screen w-72 z-50 p-6 flex flex-col shadow-2xl",
              "bg-[#0a0a0a] border-r border-white/5",
              "lg:translate-x-0 pt-24 lg:pt-8"
            )}
          >
            {/* Logo area */}
            <div className="hidden lg:flex items-center gap-3 mb-12 px-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tighter text-white leading-none">ACADEMY</h1>
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/20 uppercase mt-1">Management System</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2">
              <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 mt-2 px-4">Navigation</div>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between group px-4 py-3 rounded-lg transition-all duration-200",
                  isProfileActive ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    isProfileActive ? "text-black" : ""
                  )}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest">Personal Profile</span>
                </div>
              </Link>
              <NavItem to="/news" icon={<Newspaper className="w-4 h-4" />} label="Intel" />
              <NavItem to="/notifications" icon={<Bell className="w-4 h-4" />} label="Signals" badge={2} />
              
              <div className="pt-6 pb-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] px-4">Education</div>
              <NavItem to="/academy" icon={<GraduationCap className="w-4 h-4" />} label="Academy" />
              <NavItem to="/missions" icon={<Target className="w-4 h-4" />} label="Missions" />
              <NavItem to="/hard-skills" icon={<Cpu className="w-4 h-4" />} label="Skills" />
              <NavItem to="/cyber-range" icon={<Activity className="w-4 h-4" />} label="Range" />
              <NavItem to="/research" icon={<FlaskConical className="w-4 h-4" />} label="Research" />
              <NavItem to="/scholarships" icon={<Award className="w-4 h-4" />} label="Grants" />
              
              <div className="pt-6 pb-2 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] px-4">Network</div>
              <NavItem to="/discovery" icon={<Search className="w-4 h-4" />} label="Directory" />
              <NavItem to="/leaderboard" icon={<Trophy className="w-4 h-4" />} label="Rankings" />
              <NavItem to="/teams" icon={<Users className="w-4 h-4" />} label="Units" />
              <NavItem to="/ctf" icon={<Globe className="w-4 h-4" />} label="CTF" />

              {(isAdmin) && (
                <>
                  <div className="pt-6 pb-2 text-[9px] font-bold text-amber-500/40 uppercase tracking-[0.2em] px-4">Administration</div>
                  <NavItem to="/moderation" icon={<ShieldCheck className="w-4 h-4" />} label="HQ Control" />
                  <NavItem to="/admin/users" icon={<Users className="w-4 h-4" />} label="Node Registry" />
                </>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 mx-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5 group"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Logout Session</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

