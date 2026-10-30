import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ResumeAnalysisData, CareerRole } from '../types';
import { safePostJson, generateClientResumeAnalysis } from '../utils/apiClient';
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  TrendingUp,
  Award,
  Layers,
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

export const ResumeAnalyzerView: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [targetRole, setTargetRole] = useState<CareerRole>(user?.targetCareer || 'Full Stack Developer');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisData | null>(null);

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

  // Sample Resumes for instant testing
  const sampleResumes = {
    junior: `Alex Rivera
Email: alex.rivera@email.com | Portfolio: alexrivera.dev | GitHub: github.com/alexrivera
Objective: Ambitious Junior Full Stack Developer seeking a high-growth engineering role.

EDUCATION
University of California, Irvine — B.S. in Computer Science (GPA: 3.7/4.0), Graduated June 2025

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Redux
Databases & Tools: PostgreSQL, MongoDB, Git, Postman, Jest, Vite

PROJECTS
Collaborative Code Editor (React, TypeScript, WebSocket, Node.js)
• Built a real-time collaborative code editor supporting multi-user synchronization.
• Handled operational transformations on the backend with Node.js and WebSockets.
• Worked on the frontend interface using React and Tailwind CSS.

E-Commerce Microservice (Node.js, Express, PostgreSQL, Docker)
• Created RESTful API backend handling cart and checkout logic.
• Used PostgreSQL for data storage and wrote basic queries.
• Containerized the application using Docker and ran tests with Jest.

EXPERIENCE
Software Engineering Intern — TechFlow Solutions (June 2024 – September 2024)
• Assisted engineering team with bug fixes across React frontend components.
• Wrote unit tests for REST API endpoints improving test coverage.
• Participated in daily standups and sprint planning.`,

    student: `Jordan Smith
Email: jordan.smith@university.edu | Phone: (555) 349-2018 | GitHub: github.com/jordansmith
Status: Final Year Computer Science Undergraduate

EDUCATION
State University — Bachelor of Technology in Computer Engineering (Expected May 2026)
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems.

TECHNICAL COMPETENCIES
Programming: C++, Java, Python, SQL, JavaScript
Web: HTML, CSS, React basics
Developer Tools: Git, GitHub, VS Code, Linux CLI

ACADEMIC PROJECTS
Campus Event Portal (React, Firebase, Tailwind CSS)
• Designed a web portal for university clubs to post upcoming hackathons and workshops.
• Integrated Firebase Authentication for student login and real-time announcements.
• Added search and filter capability for tags and dates.

Algorithm Visualizer (JavaScript, HTML5 Canvas)
• Implemented sorting algorithms (Merge Sort, Quick Sort, Bubble Sort) with interactive step-by-step visual animation.
• Allowed users to customize array speed and size.

LEADERSHIP & ACTIVITIES
• Vice President, Association for Computing Machinery (ACM) Student Chapter
• Organized 36-hour collegiate hackathon with over 300 participants.`,

    devops: `Samira Patel
Email: samira.patel@devops.io | LinkedIn: linkedin.com/in/samirapatel
Focus: Cloud Infrastructure, Automation & SRE Practices

EDUCATION
Purdue University — B.S. in Information Technology & Systems (2024)

TECHNICAL STACK
Cloud & Infra: AWS (EC2, S3, RDS, IAM, VPC), Terraform, Docker, Kubernetes basics
Automation & CI/CD: GitHub Actions, Jenkins, Bash Scripting, Python
Monitoring: Prometheus, Grafana, CloudWatch
Databases & OS: Linux (Ubuntu/Debian), PostgreSQL, Redis

EXPERIENCE
Cloud Operations Intern — Nexus Cloud Labs (Jan 2024 – Present)
• Helped team manage AWS cloud resources and monitored server alerts.
• Wrote Bash and Python scripts to automate daily database backups to Amazon S3.
• Maintained Docker containers for staging environments.
• Configured basic Grafana dashboards to display server CPU and memory metrics.

PROJECTS
Automated CI/CD Pipeline for Microservices
• Set up GitHub Actions workflow that automatically runs linting, tests, and builds Docker images upon push.
• Deployed containers to AWS ECS with blue-green deployment strategy.`,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    // Read file content
    const reader = new FileReader();

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.onload = event => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    } else {
      // For PDF/DOCX or binary files, extract plain text strings using ArrayBuffer parsing
      reader.onload = event => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const uint8 = new Uint8Array(buffer);
          // Extract printable ASCII/UTF8 character sequences from raw buffer
          let extracted = '';
          let chunk = '';
          for (let i = 0; i < uint8.length; i++) {
            const byte = uint8[i];
            if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
              chunk += String.fromCharCode(byte);
            } else {
              if (chunk.length > 3) {
                extracted += chunk + ' ';
              }
              chunk = '';
            }
          }
          if (chunk.length > 3) extracted += chunk;

          // Clean up repetitive binary tokens
          const cleanText = extracted
            .replace(/[^\w\s.,;:()\-+/@#]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();

          if (cleanText.length > 50) {
            setResumeText(cleanText);
          } else {
            // Fallback to sample text if binary file could not be read cleanly
            setResumeText(sampleResumes.junior);
          }
        } catch {
          setResumeText(sampleResumes.junior);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const resultsRef = React.useRef<HTMLDivElement>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const handleRunAnalysis = async () => {
    let textToAnalyze = resumeText.trim();
    if (!textToAnalyze || textToAnalyze.length < 20) {
      // Auto-load default candidate resume if empty so user is never blocked
      textToAnalyze = sampleResumes.junior;
      setResumeText(sampleResumes.junior);
      setFileName('Junior_FullStack_Sample.txt');
    }

    setLoading(true);
    setError(null);
    setAnalysisStep('1/3: Parsing document content & extracting skills...');

    const stepTimer1 = setTimeout(() => {
      setAnalysisStep('2/3: Calculating ATS score & keyword match against ' + targetRole + '...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setAnalysisStep('3/3: Synthesizing STAR bullet rewrites & improvement report...');
    }, 2800);

    try {
      const result = await safePostJson<ResumeAnalysisData>(
        '/api/ai/resume-analyze',
        {
          resumeText: textToAnalyze,
          targetRole,
        },
        () => generateClientResumeAnalysis(textToAnalyze, targetRole)
      );

      setAnalysisResult({
        ...result.data,
        fileName: fileName || `${targetRole.replace(/\s+/g, '_')}_Resume.txt`,
        analyzedAt: new Date().toLocaleDateString(),
      });

      // Smoothly scroll down to the results section so the user instantly sees what happened
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while analyzing resume.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setAnalysisStep('');
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;

    const reportContent = `# Career Plate AI - Resume Improvement Report
Generated on: ${analysisResult.analyzedAt || new Date().toLocaleDateString()}
Target Role: ${targetRole}
Applicant: ${analysisResult.candidateName}

============================================================
OVERALL ATS SCORE: ${analysisResult.atsScore} / 100
============================================================

EXECUTIVE SUMMARY:
${analysisResult.summary}

SCORE BREAKDOWN:
- Impact & Quantification: ${analysisResult.scoreBreakdown.impactAndMetrics}/100
- Skills Alignment: ${analysisResult.scoreBreakdown.skillsMatch}/100
- Format & ATS Readability: ${analysisResult.scoreBreakdown.brevityAndFormat}/100
- Experience Relevance: ${analysisResult.scoreBreakdown.experienceRelevance}/100

TOP DETECTED SKILLS:
${analysisResult.detectedSkills.join(', ')}

HIGH PRIORITY MISSING SKILLS FOR ${targetRole.toUpperCase()}:
${analysisResult.missingSkills.join(', ')}

CORE STRENGTHS:
${analysisResult.topStrengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${analysisResult.areasForImprovement.map(a => `• ${a}`).join('\n')}

STAR-METHOD BULLET POINT REWRITES:
${analysisResult.bulletImprovements
  .map(
    (b, i) => `
[Bullet ${i + 1}]
BEFORE: "${b.original}"
AFTER:  "${b.improved}"
WHY IT MATTERS: ${b.rationale}
`
  )
  .join('\n')}

RECOMMENDED CERTIFICATIONS:
${analysisResult.recommendedCertifications.map(c => `• ${c}`).join('\n')}

------------------------------------------------------------
Career Plate AI — Your AI-Powered Career Companion
Hacktoberfest 2026 Special Release
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Career_Plate_Resume_Audit_${targetRole.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = analysisResult
    ? [
        { name: 'Impact', score: analysisResult.scoreBreakdown.impactAndMetrics, fill: '#3b82f6' },
        { name: 'Skills Match', score: analysisResult.scoreBreakdown.skillsMatch, fill: '#10b981' },
        { name: 'Format & ATS', score: analysisResult.scoreBreakdown.brevityAndFormat, fill: '#8b5cf6' },
        { name: 'Relevance', score: analysisResult.scoreBreakdown.experienceRelevance, fill: '#f59e0b' },
      ]
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter-Grade ATS Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.resumeAnalyzer}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload your resume to extract skills, calculate ATS match score, and generate quantified STAR bullet rewrites.
          </p>
        </div>

        {/* Target Career Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Target Role:</label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value as CareerRole)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {careers.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload & Sample Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Box */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
          <div className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/60 rounded-xl p-8 text-center transition-colors relative bg-slate-950/40">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              {fileName ? fileName : t.uploadResume}
            </p>
            <p className="text-xs text-slate-400 mt-1">{t.uploadDesc}</p>
            <span className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700 font-medium">
              {t.browseFiles}
            </span>
          </div>

          {/* Quick Sample Resumes Loader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
            <span className="text-slate-400">{t.loadSample}</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setResumeText(sampleResumes.junior);
                  setFileName('Junior_FullStack_Resume.txt');
                  setTargetRole('Full Stack Developer');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {t.sampleJunior}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeText(sampleResumes.student);
                  setFileName('CS_Student_Resume.txt');
                  setTargetRole('Software Developer');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {t.sampleStudent}
              </button>
              <button
                type="button"
                onClick={() => {
                  setResumeText(sampleResumes.devops);
                  setFileName('Cloud_DevOps_Resume.txt');
                  setTargetRole('DevOps Engineer');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {t.sampleDevOps}
              </button>
            </div>
          </div>
        </div>

        {/* Text Preview & Action Trigger */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Extracted Resume Content
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {resumeText.length > 0 ? `${resumeText.length} chars` : 'Empty'}
              </span>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Resume text will appear here automatically after upload, or you can paste directly..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            {analysisStep && (
              <p className="text-[11px] text-blue-400 font-medium animate-pulse text-center">
                {analysisStep}
              </p>
            )}
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{analysisStep || t.analyzingText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.analyzeButton}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header Score Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audit Complete for {targetRole}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Candidate: {analysisResult.candidateName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
              {/* ATS Score Circle Gauge */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[170px]">
                <span className="text-xs text-slate-400 uppercase tracking-wider">{t.atsScoreTitle}</span>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {analysisResult.atsScore}
                  </span>
                  <span className="text-xs text-slate-500">/100</span>
                </div>
                <span className={`text-[11px] font-semibold mt-1 inline-block ${
                  analysisResult.atsScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {analysisResult.atsScore >= 80 ? 'Strong ATS Readiness' : 'Needs Optimization'}
                </span>
              </div>

              {/* Download Report Button */}
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>{t.downloadReport}</span>
              </button>
            </div>
          </div>

          {/* Breakdown Chart & Detected Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Breakdown Chart */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
              <h3 className="text-sm font-bold text-white mb-1">{t.scoreBreakdown}</h3>
              <p className="text-xs text-slate-400 mb-4">Evaluated against FAANG-grade recruiting rubrics</p>
              
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detected Skills vs Missing Skills */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.detectedSkills} ({analysisResult.detectedSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  {analysisResult.detectedSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t.missingSkills} for {targetRole} ({analysisResult.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  {analysisResult.missingSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 text-xs border border-red-500/20 font-medium"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* STAR-Method Bullet Upgrades */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.bulletUpgrades}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transform passive phrases into quantified impact statements using the Situation-Task-Action-Result formula.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                STAR Optimization
              </span>
            </div>

            <div className="space-y-4">
              {analysisResult.bulletImprovements.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider shrink-0 mt-0.5">
                      Before:
                    </span>
                    <p className="text-xs text-slate-400 italic line-through decoration-red-400/50">
                      "{bullet.original}"
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider shrink-0 mt-0.5">
                      Upgraded:
                    </span>
                    <p className="text-xs font-medium text-white leading-relaxed">
                      "{bullet.improved}"
                    </p>
                  </div>

                  <p className="text-[11px] text-blue-400/90 pt-1 border-t border-slate-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span><strong>Rationale:</strong> {bullet.rationale}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Actionable Directives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {t.strengths}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysisResult.topStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {t.weaknesses}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysisResult.areasForImprovement.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400">→</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
