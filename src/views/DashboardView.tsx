import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Target,
  Bot,
  GraduationCap,
  Milestone,
  Briefcase,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user, openProfileModal } = useAuth();
  const { t } = useLanguage();

  const chartData = [
    { week: 'W1', score: 58, skillsLearned: 3 },
    { week: 'W2', score: 64, skillsLearned: 5 },
    { week: 'W3', score: 69, skillsLearned: 7 },
    { week: 'W4', score: 72, skillsLearned: 9 },
    { week: 'W5', score: 75, skillsLearned: 11 },
    { week: 'W6', score: 78, skillsLearned: 12 },
  ];

  const radarData = [
    { subject: 'System Design', score: 70, fullMark: 100 },
    { subject: 'Algorithms', score: 85, fullMark: 100 },
    { subject: 'Frontend & UI', score: 90, fullMark: 100 },
    { subject: 'Backend & APIs', score: 82, fullMark: 100 },
    { subject: 'Cloud & DevOps', score: 65, fullMark: 100 },
    { subject: 'Behavioral STAR', score: 75, fullMark: 100 },
  ];

  const careerRecommendations = [
    {
      role: 'Full Stack Engineer',
      match: 88,
      demand: 'High Demand',
      topSkill: 'React + Node.js + PostgreSQL',
      salary: '$95,000 - $135,000',
    },
    {
      role: 'Frontend Architect',
      match: 84,
      demand: 'Very High',
      topSkill: 'TypeScript + Next.js + Performance',
      salary: '$100,000 - $140,000',
    },
    {
      role: 'DevOps & Cloud Engineer',
      match: 68,
      demand: 'Surging',
      topSkill: 'Docker + Kubernetes + CI/CD',
      salary: '$110,000 - $150,000',
    },
  ];

  const recentActivities = [
    {
      id: 'act_1',
      title: 'Resume Analyzed with Gemini AI',
      desc: 'ATS score calculated at 82/100 · 3 STAR bullets upgraded',
      date: '2 hours ago',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/10',
      action: () => onNavigate('resume-analyzer'),
    },
    {
      id: 'act_2',
      title: 'Technical MCQ Practice: System Design',
      desc: 'Scored 4/5 on Microservices & Caching Strategies',
      date: 'Yesterday',
      icon: GraduationCap,
      color: 'text-emerald-400 bg-emerald-500/10',
      action: () => onNavigate('interview-prep'),
    },
    {
      id: 'act_3',
      title: 'Skill Gap Matrix Updated',
      desc: 'Added Docker and PostgreSQL to verified stack',
      date: '3 days ago',
      icon: Target,
      color: 'text-violet-400 bg-violet-500/10',
      action: () => onNavigate('skill-gap'),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Copilot · Ready for Action</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t.welcomeBack}, <span className="text-blue-400">{user?.name || 'Engineer'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your target career pathway is <span className="text-white font-medium">{user?.targetCareer || 'Full Stack Developer'}</span>. 
              You are currently pacing in the top quartile of student applicants this hiring season.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('resume-analyzer')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md shadow-blue-500/20"
              >
                <FileText className="w-4 h-4" />
                <span>Audit Resume with AI</span>
              </button>
              <button
                onClick={() => onNavigate('chat-assistant')}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Ask Career Copilot</span>
              </button>
            </div>
          </div>

          {/* Quick metric pill badge replacement - clean editorial metric */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[200px]">
            <span className="text-xs text-slate-400">Total Career Readiness</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {user?.careerScore || 78}%
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this month
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${user?.careerScore || 78}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Readiness */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.careerReadiness}</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-mono tabular-nums">
            {user?.careerScore || 78}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Based on skills, resume & quiz drills
          </p>
        </div>

        {/* Metric 2: Skills Added */}
        <div 
          onClick={openProfileModal}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.verifiedSkills}</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-mono tabular-nums">
            {user?.skills?.length || 12}
          </p>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Click to manage skills</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Metric 3: Resume Score */}
        <div 
          onClick={() => onNavigate('resume-analyzer')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.resumeScore}</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-mono tabular-nums">
            82<span className="text-sm font-normal text-slate-400">/100</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>ATS Parser Verified</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Metric 4: Quizzes */}
        <div 
          onClick={() => onNavigate('interview-prep')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.quizzesCompleted}</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-white font-mono tabular-nums">
            {user?.totalQuizzesTaken || 4}
          </p>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Drill practice ready</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

      </div>

      {/* Dual Charts Row: Growth Area + Competency Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Growth Timeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">{t.learningProgress}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Composite readiness index tracking skills, drills & ATS score
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              6-Week Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white">Competency Radar</h3>
              <span className="text-[11px] text-slate-400">Target: {user?.targetCareer}</span>
            </div>
            <p className="text-xs text-slate-400">Multi-axis interview readiness matrix</p>
          </div>

          <div className="h-60 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar
                  name="Alex Chen"
                  dataKey="score"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Growth Area:</span>
            <span className="text-amber-400 font-medium">Cloud & DevOps</span>
          </div>
        </div>

      </div>

      {/* 6 Quick-Access Feature Cards */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">{t.quickActions}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <button
            onClick={() => onNavigate('resume-analyzer')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              {t.auditResume}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Upload PDF/DOCX to compute ATS match score, extract missing keywords, and download an improvement report.
            </p>
          </button>

          <button
            onClick={() => onNavigate('skill-gap')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              {t.analyzeGaps}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Analyze your current skillset against 9 high-growth tech careers to map missing tools and estimated study hours.
            </p>
          </button>

          <button
            onClick={() => onNavigate('chat-assistant')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-violet-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
              {t.askAssistant}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Real-time conversational mentor powered by Gemini 3.8 Flash for code debugging, architecture reviews, and advice.
            </p>
          </button>

          <button
            onClick={() => onNavigate('interview-prep')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              {t.practiceInterview}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Timed MCQ quizzes and AI Answer Evaluation with hiring committee verdicts and sample 10/10 answers.
            </p>
          </button>

          <button
            onClick={() => onNavigate('roadmap')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Milestone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {t.viewRoadmap}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Personalized 8-week structured roadmap with milestone deliverables and interactive progress persistence.
            </p>
          </button>

          <button
            onClick={() => onNavigate('job-tracker')}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-pink-500/40 text-left transition-all hover:translate-y-[-2px] group"
          >
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
              {t.jobsTracker}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Track active applications (Wishlist, Applied, Interviewing, Offer), pre-interview checklist & demo listings.
            </p>
          </button>

        </div>
      </div>

      {/* Two Column Section: Recommended Career Paths & Recent Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended Career Paths */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">{t.recommendedCareers}</h3>
            <span className="text-xs text-slate-400">Based on your {user?.skills?.length || 12} skills</span>
          </div>

          <div className="space-y-3">
            {careerRecommendations.map(c => (
              <div
                key={c.role}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{c.role}</span>
                    <span className="text-[11px] text-blue-400 font-mono font-medium">
                      {c.match}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Key requirement: <span className="text-slate-300">{c.topSkill}</span>
                  </p>
                  <p className="text-[11px] text-emerald-400/90 font-mono mt-0.5">
                    Est. Compensation: {c.salary}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('skill-gap')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">{t.recentActivity}</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>

          <div className="space-y-4">
            {recentActivities.map(act => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={act.action}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">{act.title}</p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Active Streak: 4 days
            </span>
            <button
              onClick={() => onNavigate('interview-prep')}
              className="text-blue-400 hover:underline font-medium"
            >
              Start New Drill →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
