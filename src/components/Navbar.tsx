import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ThemeMode, LanguageCode } from '../types';
import { 
  Sparkles, 
  Globe, 
  Palette, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  ChevronDown,
  Check
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout, openAuthModal, openProfileModal } = useAuth();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const themeRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: ThemeMode; label: string; dotColor: string }[] = [
    { id: 'midnight-blue', label: 'Midnight Blue', dotColor: '#38bdf8' },
    { id: 'emerald', label: 'Emerald', dotColor: '#10b981' },
    { id: 'violet', label: 'Violet', dotColor: '#8b5cf6' },
    { id: 'dark-professional', label: 'Dark Professional', dotColor: '#6366f1' },
    { id: 'light-professional', label: 'Light Professional', dotColor: '#2563eb' },
  ];

  const languages: { id: LanguageCode; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी (Hindi)' },
    { id: 'es', label: 'Español' },
    { id: 'fr', label: 'Français' },
    { id: 'de', label: 'Deutsch' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Zone 1: Single Wordmark Brand */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Career Plate <span className="text-blue-400">AI</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'dashboard' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.dashboard}
          </button>
          <button
            onClick={() => onNavigate('resume-analyzer')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'resume-analyzer' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.resumeAnalyzer}
          </button>
          <button
            onClick={() => onNavigate('skill-gap')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'skill-gap' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.skillGapAnalyzer}
          </button>
          <button
            onClick={() => onNavigate('chat-assistant')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'chat-assistant' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.aiAssistant}
          </button>
          <button
            onClick={() => onNavigate('interview-prep')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'interview-prep' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.interviewPrep}
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'roadmap' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            {t.learningRoadmap}
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Theme, Language, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Selector */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              title={t.theme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline capitalize">{theme.replace('-', ' ')}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {themeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Color Themes
                </div>
                {themes.map(th => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      theme === th.id
                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: th.dotColor }}
                      />
                      <span>{th.label}</span>
                    </div>
                    {theme === th.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              title={t.language}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="uppercase text-xs">{language}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {t.language}
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      language === lang.id
                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Profile */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={user.avatarUrl || '/src/assets/images/avatar_career_user_1793351203372.jpg'}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/30"
                />
                <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[11px] text-blue-400 font-medium mt-0.5">{user.targetCareer}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openProfileModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.profile}</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 text-left transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
