import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { JobApplication } from '../types';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Search,
  ExternalLink,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
  Building,
  MapPin,
} from 'lucide-react';

export const JobTrackerView: React.FC = () => {
  const { t } = useLanguage();

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('career_plate_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'app_1',
        company: 'Stripe',
        role: 'Software Engineer Intern (Summer 2027)',
        location: 'San Francisco, CA (Hybrid)',
        type: 'Internship',
        status: 'Interviewing',
        appliedDate: '2026-10-14',
        salaryRange: '$52/hr',
        notes: 'Completed technical screen. Next round is System Design with Staff Engineer.',
      },
      {
        id: 'app_2',
        company: 'Cloudflare',
        role: 'Junior Full Stack Developer',
        location: 'Austin, TX / Remote',
        type: 'Full-time',
        status: 'Applied',
        appliedDate: '2026-10-22',
        salaryRange: '$115,000/yr',
        notes: 'Submitted resume tailored with TypeScript & Cloudflare Workers keywords.',
      },
      {
        id: 'app_3',
        company: 'Vercel',
        role: 'Frontend Engineering Intern',
        location: 'Remote',
        type: 'Internship',
        status: 'Wishlist',
        appliedDate: '2026-10-28',
        salaryRange: '$48/hr',
        notes: 'Need to finish open-source contribution to Next.js repository before applying.',
      },
      {
        id: 'app_4',
        company: 'Datadog',
        role: 'Associate SRE / DevOps Engineer',
        location: 'New York, NY',
        type: 'Full-time',
        status: 'Offer',
        appliedDate: '2026-09-18',
        salaryRange: '$120,000/yr',
        notes: 'Received written offer letter! Reviewing compensation package.',
      },
    ];
  });

  const [activeFilter, setActiveFilter] = useState<'All' | 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New application form
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newType, setNewType] = useState<'Full-time' | 'Internship' | 'Remote'>('Internship');
  const [newStatus, setNewStatus] = useState<'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'>('Applied');
  const [newSalary, setNewSalary] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Pre-interview checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('career_plate_interview_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      c1: true,
      c2: true,
      c3: false,
      c4: false,
      c5: true,
      c6: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('career_plate_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('career_plate_interview_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    { id: 'c1', label: 'Resume ATS score exceeds 80% on Career Plate AI' },
    { id: 'c2', label: 'GitHub portfolio pinned with top 2 production applications & clean READMEs' },
    { id: 'c3', label: 'Recorded 90-second elevator pitch explaining technical origin story' },
    { id: 'c4', label: 'Practiced 3 timed MCQ technical drills with >80% accuracy' },
    { id: 'c5', label: 'Structured 5 behavioral stories using the STAR method' },
    { id: 'c6', label: 'Reviewed company engineering blog and recent public product architecture' },
  ];

  // Clearly labelled demo opportunities
  const demoOpportunities = [
    {
      id: 'demo_1',
      company: 'Amazon Web Services',
      role: 'Software Development Engineer Intern (2027)',
      location: 'Seattle, WA / Arlington, VA',
      skills: ['Java', 'Python', 'Distributed Systems', 'Git'],
      stipend: '$58/hr + Relocation',
      deadline: 'Rolling Basis',
    },
    {
      id: 'demo_2',
      company: 'GitHub',
      role: 'Junior Open Source Platform Engineer',
      location: 'Remote (Global)',
      skills: ['Ruby', 'TypeScript', 'Docker', 'GraphQL'],
      stipend: '$110,000 - $130,000',
      deadline: 'Nov 15, 2026',
    },
    {
      id: 'demo_3',
      company: 'Postman',
      role: 'Developer Relations / API Intern',
      location: 'San Francisco, CA / Hybrid',
      skills: ['Node.js', 'REST APIs', 'Technical Writing'],
      stipend: '$45/hr',
      deadline: 'Dec 01, 2026',
    },
  ];

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      company: newCompany,
      role: newRole,
      location: newLocation,
      type: newType,
      status: newStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      salaryRange: newSalary || undefined,
      notes: newNotes,
    };

    setApplications([newApp, ...applications]);
    setShowAddModal(false);
    setNewCompany('');
    setNewRole('');
    setNewNotes('');
    setNewSalary('');
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(a => a.id !== id));
  };

  const handleStatusChange = (id: string, newStat: JobApplication['status']) => {
    setApplications(applications.map(a => (a.id === id ? { ...a, status: newStat } : a)));
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Internship & Career Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.jobsTracker}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your job hunt pipeline, complete pre-interview readiness checklists, and explore verified sample opportunities.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addApplication}</span>
        </button>
      </div>

      {/* Pre-Interview Flight Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Pre-Interview Readiness Checklist</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify these foundational criteria before walking into technical screening rounds.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            {Object.values(checklist).filter(Boolean).length} of {checklistItems.length} Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {checklistItems.map(item => {
            const checked = Boolean(checklist[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-start gap-3 ${
                  checked
                    ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                    : 'bg-slate-950/30 border-slate-800/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                )}
                <span className={checked ? 'line-through text-slate-500' : 'text-slate-200'}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Application Tracker Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">{t.applicationTracker}</h3>
            <span className="text-xs font-mono text-slate-400">({applications.length} Total)</span>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search company or role..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {(['All', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const).map(stat => (
                <button
                  key={stat}
                  onClick={() => setActiveFilter(stat)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    activeFilter === stat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 italic">
              No applications match your active filter.
            </div>
          ) : (
            filteredApplications.map(app => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{app.company}</h4>
                    <span className="text-xs text-slate-400 font-normal">· {app.role}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {app.location}
                    </span>
                    <span>·</span>
                    <span className="font-mono">{app.type}</span>
                    {app.salaryRange && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-400/90 font-mono">{app.salaryRange}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="text-[11px] text-slate-500">Applied: {app.appliedDate}</span>
                  </div>
                  {app.notes && (
                    <p className="text-xs text-slate-400 pt-1 italic">
                      Note: "{app.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value as JobApplication['status'])}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none ${
                      app.status === 'Offer'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : app.status === 'Interviewing'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : app.status === 'Applied'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : app.status === 'Wishlist'
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <button
                    onClick={() => handleDeleteApplication(app.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Verified Demo Opportunities (Clearly Labelled) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{t.allOpportunities}</h3>
              <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Verified Sample Dataset
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated mock job postings illustrating compensation, requirements, and target deadlines for tech candidates.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {demoOpportunities.map(opp => (
            <div
              key={opp.id}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Building className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{opp.company}</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 mt-1">{opp.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{opp.location}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {opp.skills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Compensation</span>
                  <span className="text-emerald-400 font-mono font-medium">{opp.stipend}</span>
                </div>
                <button
                  onClick={() => {
                    setNewCompany(opp.company);
                    setNewRole(opp.role);
                    setNewLocation(opp.location);
                    setNewSalary(opp.stipend);
                    setShowAddModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium transition-colors"
                >
                  Track Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-4">Log New Application</h3>

            <form onSubmit={handleAddApplication} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Google, Datadog..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Compensation (Optional)</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={e => setNewSalary(e.target.value)}
                  placeholder="e.g. $45/hr or $110,000/yr"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes & Follow-up Dates</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Recruiter email, technical interview date..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md shadow-blue-500/20"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
