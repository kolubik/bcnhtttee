import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { Discovery } from './views/Discovery';
import { Moderation } from './views/Moderation';
import { Profile } from './views/Profile';
import { ProfileSkills } from './views/ProfileSkills';
import { UserManagement } from './views/UserManagement';
import { Landing } from './views/Landing';
import { News } from './views/News';
import { Missions } from './views/Missions';
import { Leaderboard } from './views/Leaderboard';
import { Teams } from './views/Teams';
import { HardSkills } from './views/HardSkills';
import { Notifications } from './views/Notifications';
import { CyberRange } from './views/CyberRange';
import { Academy } from './views/Academy';
import { RoadmapDetail } from './views/RoadmapDetail';
import { Research } from './views/Research';
import { Scholarships } from './views/Scholarships';
import { CTF } from './views/CTF';
import { Contact } from './views/Contact';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Shield, Zap, Terminal } from 'lucide-react';
import { cn } from './lib/utils';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Establishing secure link</span>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Verifying clearance</span>
    </div>
  );
  return user && isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
};

const ProfileRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to={`/profile/${user.uid}`} /> : <Navigate to="/auth" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] selection:bg-white/10 selection:text-white">
      <div className="fixed inset-0 bg-grid-white bg-grid-mask opacity-[0.05] pointer-events-none" />
      
      {user && <Navigation />}
      
      <div className={cn(
        "relative transition-all duration-200",
        user ? "lg:pl-72" : ""
      )}>
        <main className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12",
          user ? "pt-24 lg:pt-8" : "py-8 md:py-16"
        )}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/profile" /> : <Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/profile" /> : <Auth />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
            <Route path="/missions" element={<PrivateRoute><Missions /></PrivateRoute>} />
            <Route path="/discovery" element={<PrivateRoute><Discovery /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/cyber-range" element={<PrivateRoute><CyberRange /></PrivateRoute>} />
            <Route path="/academy" element={<PrivateRoute><Academy /></PrivateRoute>} />
            <Route path="/roadmap/:id" element={<PrivateRoute><RoadmapDetail /></PrivateRoute>} />
            <Route path="/research" element={<PrivateRoute><Research /></PrivateRoute>} />
            <Route path="/scholarships" element={<PrivateRoute><Scholarships /></PrivateRoute>} />
            <Route path="/ctf" element={<PrivateRoute><CTF /></PrivateRoute>} />
            <Route path="/hard-skills" element={<PrivateRoute><HardSkills /></PrivateRoute>} />
            <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
            <Route path="/moderation" element={<AdminRoute><Moderation /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/:id/hard-skills" element={<PrivateRoute><ProfileSkills category="HARD" /></PrivateRoute>} />
            <Route path="/profile/:id/soft-skills" element={<PrivateRoute><ProfileSkills category="SOFT" /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfileRedirect /></PrivateRoute>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
