import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Target,
  Bot,
  GraduationCap,
  Milestone,
  Briefcase,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const { user, openProfileModal } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: 'Home',
    },
    {
      id: 'resume-analyzer',
      label: t.resumeAnalyzer,
      icon: FileText,
      badge: 'ATS AI',
    },
    {
      id: 'skill-gap',
      label: t.skillGapAnalyzer,
      icon: Target,
      badge: 'Radar',
    },
    {
      id: 'chat-assistant',
      label: t.aiAssistant,
      icon: Bot,
      badge: 'Gemini',
    },
    {
      id: 'interview-prep',
      label: t.interviewPrep,
      icon: GraduationCap,
      badge: 'Drills',
    },
    {
      id: 'roadmap',
      label: t.learningRoadmap,
      icon: Milestone,
      badge: '8 Wk',
    },
    {
      id: 'job-tracker',
      label: t.jobsTracker,
      icon: Briefcase,
      badge: 'Pipeline',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="p-4 space-y-6">
          {/* User mini status widget */}
          {user && (
            <div
              onClick={() => {
                openProfileModal();
                onCloseMobile();
              }}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl || '/src/assets/images/avatar_career_user_1793351203372.jpg'}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/30 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-blue-400 font-medium truncate">{user.targetCareer}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Readiness
                </span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {user.careerScore}%
                </span>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Career Workspace
            </p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-500 bg-slate-900 border border-slate-800/80 font-mono">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              Skills Verified
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {user?.skills?.length || 0}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
