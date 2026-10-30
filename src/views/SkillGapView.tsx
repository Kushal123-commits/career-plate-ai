import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CareerRole, ExperienceLevel, SkillGapData } from '../types';
import { safePostJson, generateClientSkillGap } from '../utils/apiClient';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Milestone,
  RefreshCw,
  Plus,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const SkillGapView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [targetRole, setTargetRole] = useState<CareerRole>(user?.targetCareer || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(user?.experienceLevel || 'Student');
  const [currentSkills, setCurrentSkills] = useState<string[]>(user?.skills || ['React', 'TypeScript', 'Node.js', 'Git']);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gapData, setGapData] = useState<SkillGapData | null>(null);

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

  const levels: ExperienceLevel[] = ['Student', 'Junior', 'Mid-Level', 'Senior'];

  const popularSkillsPool = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'PostgreSQL',
    'Kubernetes', 'AWS', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Redis',
    'Git', 'System Design', 'CI/CD', 'Linux', 'Java', 'C++', 'SQL', 'PyTorch'
  ];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setCurrentSkills([...currentSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(s => s !== skillToRemove));
  };

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const [skillAnalysisStep, setSkillAnalysisStep] = useState<string>('');

  const handleAnalyzeSkills = async () => {
    let skillsToAnalyze = [...currentSkills];
    if (skillsToAnalyze.length === 0) {
      skillsToAnalyze = ['JavaScript', 'Git', 'Problem Solving'];
      setCurrentSkills(skillsToAnalyze);
    }

    setLoading(true);
    setError(null);
    setSkillAnalysisStep('1/2: Comparing skillset against ' + targetRole + ' requirements...');

    const stepTimer = setTimeout(() => {
      setSkillAnalysisStep('2/2: Mapping missing competencies & study timeline...');
    }, 1500);

    try {
      const result = await safePostJson<SkillGapData>(
        '/api/ai/skill-gap',
        {
          targetRole,
          currentSkills: skillsToAnalyze,
          experienceLevel,
        },
        () => generateClientSkillGap(targetRole, skillsToAnalyze, experienceLevel)
      );

      setGapData(result.data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while analyzing skills.');
    } finally {
      clearTimeout(stepTimer);
      setLoading(false);
      setSkillAnalysisStep('');
    }
  };

  const totalEstimatedHours = gapData
    ? gapData.missingSkills.reduce((acc, curr) => acc + (curr.estimatedHours || 15), 0)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Competency Gap Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.skillGapAnalyzer}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare your stack against 2026 hiring standards to pinpoint missing libraries, estimated study hours, and capstone projects.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Configuration & Skills Picker Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Career & Skills Picker */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.targetRoleLabel}
              </label>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.experienceLevelLabel}
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Skills Added */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                {t.yourSkillsLabel} ({currentSkills.length})
              </label>
              <span className="text-[11px] text-slate-500">Press enter to add custom skill</span>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type a skill (e.g. Next.js, Redis, AWS Lambda)..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 min-h-[64px]">
              {currentSkills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No skills selected yet.</span>
              ) : (
                currentSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20 font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick Click Add from Popular Pool */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
              Popular Quick-Add Skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularSkillsPool
                .filter(s => !currentSkills.includes(s))
                .slice(0, 12)
                .map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/80 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary & Trigger */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Analysis Configuration
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Target Role:</span>
                <span className="font-semibold text-white">{targetRole}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Experience Tier:</span>
                <span className="font-semibold text-blue-400">{experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Verified Skills Count:</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {currentSkills.length}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {skillAnalysisStep && (
              <p className="text-[11px] text-emerald-400 font-medium animate-pulse text-center">
                {skillAnalysisStep}
              </p>
            )}
            <button
              onClick={handleAnalyzeSkills}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{skillAnalysisStep || t.analyzingSkills}</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>{t.analyzeSkillsButton}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Analysis Results Display */}
      {gapData && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Top Banner Metric */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Competency Radar Mapped for {gapData.targetRole}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Skill Match Rate: <span className="text-emerald-400 font-mono">{gapData.matchPercentage}%</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {gapData.careerAdvice}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[150px]">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Est. Study Sprints
                </span>
                <p className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">
                  ~{totalEstimatedHours}h
                </p>
                <span className="text-[10px] text-slate-500">to close critical gaps</span>
              </div>
            </div>
          </div>

          {/* Missing Skills Detailed Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.criticalMissing}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by hiring manager priority and interview screening frequency
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                {gapData.missingSkills.length} Skills Identified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gapData.missingSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          skill.priority === 'Critical'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : skill.priority === 'Recommended'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {skill.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {skill.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {skill.estimatedHours} hrs study
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddSkill(skill.name)}
                      className="text-blue-400 hover:text-blue-300 text-[11px] font-medium"
                    >
                      + Add to Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Phase Structured Learning Roadmap */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.priorityLearning}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sequential progression from core fundamentals to capstone production systems
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                3-Phase Progression
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gapData.learningRoadmap.map((phase, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                      {phase.phase}
                    </h4>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-normal">
                    {phase.goal}
                  </p>
                  <ul className="space-y-1.5 pt-2 border-t border-slate-900 text-xs text-slate-400">
                    {phase.keyTopics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400">·</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Capstone Projects */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-white">{t.suggestedProjects}</h3>
            <div className="space-y-4">
              {gapData.recommendedProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 w-fit">
                      {proj.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 mr-1">Recommended Stack:</span>
                    {proj.techStack.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-800 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-blue-400 pt-2 border-t border-slate-900">
                    <strong>Resume Impact:</strong> {proj.resumeImpact}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
