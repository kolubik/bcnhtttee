import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, doc, getDoc, setDoc, updateDoc, serverTimestamp } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isStudent: false,
  loading: true,
  logout: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAIL = "hashmatrix.sec@gmail.com";
const ADMIN_UID = "MjQwE1O6XbhKc7jM7QtmKB5rXPn1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Migration for the user's name request
        const isTargetUser = firebaseUser.email === ADMIN_EMAIL || firebaseUser.email === 'cadetzero@collective.hub';
        const targetName = 'НАГОРНИЙ АРСЕНІЙ';
        const needsNameUpdate = isTargetUser && (data.fullName !== targetName || data.displayName !== targetName);
        
        if (isTargetUser && (!data.callsign || needsNameUpdate)) {
          const updated = {
            ...data,
            fullName: targetName,
            displayName: targetName,
            callsign: data.callsign || 'ARS-01'
          };
          const docRef = doc(db, 'users', firebaseUser.uid);
          await updateDoc(docRef, updated);
          setProfile(updated);
        } else {
          setProfile(data);
        }
      } else {
        // Create initial profile
        const isDefaultAdmin = firebaseUser.email === ADMIN_EMAIL || firebaseUser.uid === ADMIN_UID;
        const isVortex = firebaseUser.email === 'vortex32@collective.hub';
        const isCadetZero = firebaseUser.email === 'cadetzero@collective.hub' || firebaseUser.email === ADMIN_EMAIL;

        const newProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: isVortex ? 'Vortex32' : isCadetZero ? 'НАГОРНИЙ АРСЕНІЙ' : firebaseUser.displayName || 'Cadet',
          fullName: isVortex ? 'Vortex Commander' : isCadetZero ? 'НАГОРНИЙ АРСЕНІЙ' : firebaseUser.displayName || 'ННІ4-25-102Кб',
          callsign: isVortex ? 'VORTEX-01' : isCadetZero ? 'ARS-01' : 'CADET-' + firebaseUser.uid.slice(0, 4),
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          bannerURL: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
          courseGroup: isVortex ? 'ROOT-SEC' : isCadetZero ? 'ННІ4-25-102Кб' : 'ННІ4-25-102Кб',
          role: isDefaultAdmin || isVortex ? 'ADMIN' : 'USER',
          createdAt: serverTimestamp(),
          bio: isVortex ? 'System Administrator and Chief Technical Officer of the Collective.' : 'Collective Universal. Awaiting clearance.',
          socialLinks: {
            email: firebaseUser.email,
            telegram: isVortex ? '@vortex_admin' : '',
            github: isVortex ? 'github.com/vortex' : ''
          },
          achievements: isVortex ? ['System Architect', 'First Investigation', 'Secure Root'] : [],
          radarStats: {
            technical: isVortex ? 95 : 10,
            intelligence: isVortex ? 90 : 15,
            security: isVortex ? 98 : 5,
            tactical: isVortex ? 80 : 10,
            leadership: isVortex ? 85 : 5
          },
          learningPaths: [
            { name: 'OSINT Path', progress: isVortex ? 100 : 0 },
            { name: 'DFIR Path', progress: isVortex ? 85 : 0 },
            { name: 'SOC Path', progress: isVortex ? 90 : 0 }
          ],
          stats: { xp: isVortex ? 5000 : 0, level: isVortex ? 10 : 1, completedMissions: isVortex ? 42 : 0, completedLabs: isVortex ? 33 : 0 },
          ctfEnabled: isVortex
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching/creating profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email Login Error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email Signup Error:", error);
      throw error;
    }
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'admin';
  const isStudent = profile?.role === 'USER' || profile?.role === 'student';

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isAdmin, 
      isStudent, 
      loading, 
      logout,
      signInWithEmail,
      signUpWithEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};
