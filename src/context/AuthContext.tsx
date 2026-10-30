import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CareerRole, ExperienceLevel } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, career: CareerRole) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const defaultDemoUser: UserProfile = {
  id: 'usr_demo_8829',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatarUrl: '/src/assets/images/avatar_career_user_1793351203372.jpg',
  targetCareer: 'Full Stack Developer',
  experienceLevel: 'Student',
  bio: 'CS Senior passionate about full-stack web engineering, distributed systems, and real-time AI tools.',
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'JavaScript',
    'Tailwind CSS',
    'HTML/CSS',
    'Git',
    'PostgreSQL',
    'REST APIs',
    'Docker',
    'Python',
    'Express'
  ],
  careerScore: 78,
  totalQuizzesTaken: 4,
  resumesAnalyzedCount: 2,
  roadmapsCompletedCount: 1,
  applicationsCount: 5,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('career_plate_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultDemoUser;
      }
    }
    return defaultDemoUser; // Preloaded default demo session
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('career_plate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('career_plate_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    // Simulate verification
    const newUser: UserProfile = {
      ...defaultDemoUser,
      email,
      name: email.split('@')[0].replace('.', ' ') || 'Tech Applicant',
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    pass: string,
    career: CareerRole
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name || !email || !pass) {
      return { success: false, error: 'All fields are required.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatarUrl: '/src/assets/images/avatar_career_user_1793351203372.jpg',
      targetCareer: career,
      experienceLevel: 'Student',
      bio: `Aspiring ${career} preparing for technical interviews and career opportunities.`,
      skills: ['Git', 'JavaScript', 'Problem Solving'],
      careerScore: 65,
      totalQuizzesTaken: 0,
      resumesAnalyzedCount: 0,
      roadmapsCompletedCount: 0,
      applicationsCount: 0,
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const loginWithGoogle = async () => {
    // Instant seamless 1-click Google account connection
    const googleUser: UserProfile = {
      id: 'usr_google_1029',
      name: 'Alex Chen',
      email: 'alex.chen.dev@gmail.com',
      avatarUrl: '/src/assets/images/avatar_career_user_1793351203372.jpg',
      targetCareer: 'Full Stack Developer',
      experienceLevel: 'Student',
      bio: 'Full Stack Developer and CS student exploring AI-assisted workflows.',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
      careerScore: 82,
      totalQuizzesTaken: 5,
      resumesAnalyzedCount: 3,
      roadmapsCompletedCount: 2,
      applicationsCount: 6,
    };
    setUser(googleUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        profileModalOpen,
        openProfileModal,
        closeProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
