import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CareerRole, ExperienceLevel, PersonalizedRoadmap } from '../types';
import {
  Milestone,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Award,
  RefreshCw,
  Calendar,
  AlertCircle,
  Layers,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [targetRole, setTargetRole] = useState<CareerRole>(user?.targetCareer || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user?.experienceLevel || 'Student');
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap>(() => {
    const saved = localStorage.getItem('career_plate_roadmap');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      title: `8-Week Career Sprint: Full Stack Developer`,
      estimatedWeeklyHours: 14,
      weeks: [
        {
          weekNumber: 1,
          focus: 'Advanced TypeScript & Modern React 19 Paradigms',
          milestones: [
            'Master generics, conditional types, and strict null checks in TypeScript',
            'Adopt React 19 Actions, useActionState, and Server Actions architecture',
            'Build 3 custom high-performance utility hooks with full typing',
          ],
          recommendedResources: ['TypeScript Handbook v5', 'React.dev Official Documentation'],
          deliverable: 'A clean component library with strict type-safety and unit tests',
          completed: true,
        },
        {
          weekNumber: 2,
          focus: 'Normalized Relational Database Modeling & Indexing',
          milestones: [
            'Model multi-tenant database schemas with foreign keys and cascading deletes',
            'Implement B-Tree vs Composite indexes in PostgreSQL',
            'Analyze EXPLAIN ANALYZE query plans to eliminate sequential scans',
          ],
          recommendedResources: ['Use The Index, Luke (SQL Indexing Guide)', 'PostgreSQL Tutorial'],
          deliverable: 'Benchmark suite proving a 4x query acceleration with composite indexing',
          completed: true,
        },
        {
          weekNumber: 3,
          focus: 'RESTful API Architecture, JWT & Security Policies',
          milestones: [
            'Design clean REST endpoints with Zod schema validation middleware',
            'Implement secure HTTP-only cookies, refresh tokens, and rate limiting',
            'Handle CORS headers, OWASP Top 10 vulnerabilities, and sanitized inputs',
          ],
          recommendedResources: ['OWASP Secure Coding Practices', 'MDN HTTP Headers Guide'],
          deliverable: 'Fully secured auth microservice with automated test assertions',
          completed: false,
        },
        {
          weekNumber: 4,
          focus: 'Caching Strategies with Redis & Concurrency Management',
          milestones: [
            'Implement Cache-Aside and Write-Through caching patterns',
            'Configure Redis TTL expiration and LRU memory management',
            'Prevent cache stampedes using distributed locks or mutexes',
          ],
          recommendedResources: ['Redis University Course', 'System Design Primer (Caching)'],
          deliverable: 'Redis-cached API endpoint sustaining 2,000 req/sec under load',
          completed: false,
        },
        {
          weekNumber: 5,
          focus: 'Docker Containerization & Multi-Stage Builds',
          milestones: [
            'Write multi-stage Dockerfile slashing production image size under 80MB',
            'Set up docker-compose for multi-container orchestration (App, Postgres, Redis)',
            'Configure non-root user execution inside container for defense-in-depth',
          ],
          recommendedResources: ['Docker Official Best Practices', 'Dive (Docker Image Analyzer)'],
          deliverable: 'Working docker-compose environment running app, database, and cache',
          completed: false,
        },
        {
          weekNumber: 6,
          focus: 'CI/CD Pipelines & Cloud Deployment',
          milestones: [
            'Build GitHub Actions workflow for linting, testing, and Docker image publishing',
            'Deploy stateless containers to Cloud Run / AWS ECS',
            'Configure environment variables and secrets via cloud secrets manager',
          ],
          recommendedResources: ['GitHub Actions Documentation', 'Cloud Run Deployment Guide'],
          deliverable: 'Automated continuous deployment triggering on main branch merge',
          completed: false,
        },
        {
          weekNumber: 7,
          focus: 'End-to-End Testing & Performance Benchmarking',
          milestones: [
            'Author integration tests covering critical checkout and authentication flows',
            'Run stress and load testing with k6 or artillery',
            'Measure Core Web Vitals and optimize bundle split chunking',
          ],
          recommendedResources: ['k6 Load Testing Guide', 'web.dev Core Web Vitals'],
          deliverable: 'Performance audit report verifying <100ms API latency and 0 test failures',
          completed: false,
        },
        {
          weekNumber: 8,
          focus: 'Portfolio Showcase, Documentation & Interview Defense',
          milestones: [
            'Write comprehensive architectural README with system diagrams',
            'Record 2-minute walkthrough demo video demonstrating system edge cases',
            'Practice defending design choices in simulated hiring committee interviews',
          ],
          recommendedResources: ['Google Engineering Practices', 'Career Plate AI Copilot'],
          deliverable: 'Live production URL ready for recruiter submission and LinkedIn spotlight',
          completed: false,
        },
      ],
    };
  });

  const careers: CareerRole[] = [
    'Software Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Data Scientist',
    'AI/ML Engineer',
    'Cybersecurity Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
  ];

  useEffect(() => {
    localStorage.setItem('career_plate_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  const completedWeeksCount = roadmap.weeks.filter(w => w.completed).length;
  const progressPercentage = Math.round((completedWeeksCount / roadmap.weeks.length) * 100);

  const toggleWeekCompletion = (weekNumber: number) => {
    setRoadmap(prev => {
      const updated = prev.weeks.map(w =>
        w.weekNumber === weekNumber ? { ...w, completed: !w.completed } : w
      );
      return { ...prev, weeks: updated };
    });

    if (user) {
      updateProfile({
        careerScore: Math.min(99, Math.max(60, 70 + completedWeeksCount * 3)),
      });
    }
  };

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills: user?.skills || [],
          experienceLevel,
          dailyHours,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate roadmap.');
      }

      setRoadmap(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error contacting roadmap generation engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Sprint Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.learningRoadmap}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Personalized week-by-week curriculum tailored to your daily study time, career ambitions, and technical prerequisites.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Configuration Strip */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.targetRoleLabel}</label>
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value as CareerRole)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {careers.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.experienceLevelLabel}</label>
            <select
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Student">Student / Entry-Level</option>
              <option value="Junior">Junior Engineer</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior Transition</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.dailyHoursLabel}</label>
            <select
              value={dailyHours}
              onChange={e => setDailyHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1}>1 hour / day (Casual)</option>
              <option value={2}>2 hours / day (Focused)</option>
              <option value={4}>4 hours / day (Bootcamp Intensity)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateRoadmap}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sprint Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Active Study Plan
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">{roadmap.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Total pace: <span className="text-white font-mono">{roadmap.estimatedWeeklyHours} hrs/week</span> ({dailyHours} hrs/day commitment)
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Progress</span>
            <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {progressPercentage}%
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              {completedWeeksCount} of {roadmap.weeks.length} Weeks
            </span>
          </div>

          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden shrink-0">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week by Week Interactive Accordion / Timeline */}
      <div className="space-y-4">
        {roadmap.weeks.map(week => {
          return (
            <div
              key={week.weekNumber}
              className={`p-6 rounded-2xl border transition-all ${
                week.completed
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-80'
                  : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Week Header */}
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleWeekCompletion(week.weekNumber)}
                    className="mt-0.5 text-slate-500 hover:text-cyan-400 transition-colors shrink-0"
                    title={week.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {week.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        Week {week.weekNumber}
                      </span>
                      <h4 className={`text-sm sm:text-base font-bold ${
                        week.completed ? 'text-slate-400 line-through' : 'text-white'
                      }`}>
                        {week.focus}
                      </h4>
                    </div>

                    {/* Milestones list */}
                    <ul className="mt-3 space-y-1.5 text-xs text-slate-300 pl-1">
                      {week.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 shrink-0">·</span>
                          <span className={week.completed ? 'text-slate-500' : 'text-slate-300'}>
                            {milestone}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Week Completion Button */}
                <button
                  type="button"
                  onClick={() => toggleWeekCompletion(week.weekNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    week.completed
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {week.completed ? 'Completed ✓' : t.markComplete}
                </button>

              </div>

              {/* Bottom Deliverable & Resources */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Deliverable:</strong> {week.deliverable}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Resources:</span>
                  {week.recommendedResources.map((res, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[11px] whitespace-nowrap"
                    >
                      {res}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
