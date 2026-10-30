import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { QuizQuestion, InterviewEvaluation } from '../types';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  HelpCircle,
  RotateCcw,
  RefreshCw,
  Award,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export const InterviewPrepView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'mcq' | 'ai-evaluator'>('mcq');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedCategory, setSelectedCategory] = useState<'Technical' | 'HR' | 'System Design' | 'Frontend' | 'Backend'>('Technical');

  // MCQ Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // AI Answer Evaluator state
  const [evalQuestion, setEvalQuestion] = useState('Explain how you handle state management in a large-scale React application and what trade-offs you evaluate.');
  const [userAnswerText, setUserAnswerText] = useState('');
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<InterviewEvaluation | null>(null);

  const sampleInterviewQuestions = [
    'Explain how you handle state management in a large-scale React application and what trade-offs you evaluate.',
    'Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?',
    'How does database indexing work under the hood, and when might an index actually degrade query performance?',
    'Describe the lifecycle of an HTTP request from browser URL input to server response.',
    'Walk me through how you design an idempotent payment processing endpoint.',
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      category: 'Technical',
      difficulty: 'Intermediate',
      question: 'What is the primary difference between a B-Tree index and a Hash index in relational databases like PostgreSQL?',
      options: [
        'Hash indexes support range queries (<, >), while B-Trees only support exact equality (=).',
        'B-Trees keep data sorted and support range queries (BETWEEN, <, >), whereas Hash indexes only optimize exact equality checks.',
        'B-Trees are strictly stored in memory, while Hash indexes are always written to disk.',
        'There is no functional difference; they are just different naming conventions.',
      ],
      correctIndex: 1,
      explanation: 'B-Tree is a self-balancing search tree maintaining sorted order, enabling efficient O(log n) range searches. Hash indexes map keys directly via hash functions and only support O(1) equality lookups.',
    },
    {
      id: 'q2',
      category: 'Frontend',
      difficulty: 'Intermediate',
      question: 'In React 19, what happens when an asynchronous Action function throws an unhandled error inside useActionState?',
      options: [
        'The entire React root unmounts without error boundary triggering.',
        'The error is caught and passed to the nearest Error Boundary while state transition reverts cleanly.',
        'The browser automatically reloads the entire webpage.',
        'React ignores the error silently and executes the next render cycle.',
      ],
      correctIndex: 1,
      explanation: 'React 19 Actions integrate seamlessly with Error Boundaries and Suspense transitions, isolating failures without corrupting client state.',
    },
    {
      id: 'q3',
      category: 'System Design',
      difficulty: 'Intermediate',
      question: 'What caching strategy should you employ when the primary goal is high read concurrency with acceptable short-term eventual consistency?',
      options: [
        'Write-through caching with synchronous database locking.',
        'Cache-aside (Lazy Loading) paired with TTL (Time-To-Live) expiration.',
        'Direct file-system read with zero caching.',
        'Write-back caching without any persistence disk backup.',
      ],
      correctIndex: 1,
      explanation: 'Cache-Aside only loads data into cache on demand and handles high read throughput while TTL ensures stale items expire eventually.',
    },
    {
      id: 'q4',
      category: 'HR',
      difficulty: 'Intermediate',
      question: 'When answering a behavioral question using the STAR method, what percentage of your response time should typically be dedicated to the "Action" phase?',
      options: [
        'Roughly 10-15%, focusing primarily on describing how bad the company situation was.',
        'Roughly 50-60%, clearly specifying your individual decisions, reasoning, and execution.',
        '100%, skipping context entirely.',
        'Roughly 5%, leaving all time for the final praise received.',
      ],
      correctIndex: 1,
      explanation: 'Senior interviewers care most about YOUR personal agency, engineering trade-offs, and how you navigated complexity—which constitutes the Action phase.',
    },
    {
      id: 'q5',
      category: 'Backend',
      difficulty: 'Intermediate',
      question: 'Why is connection pooling essential for high-throughput relational databases (e.g., PostgreSQL)?',
      options: [
        'Creating a new TCP/TLS process and authenticating for every incoming query incurs heavy CPU and memory overhead.',
        'PostgreSQL cannot execute more than one query per IP address without a pool.',
        'It converts SQL queries into NoSQL JSON documents automatically.',
        'It encrypts passwords twice for PCI-DSS compliance.',
      ],
      correctIndex: 0,
      explanation: 'Process and SSL handshake initiation for each request is computationally expensive. Connection pools keep idle verified connections warm, slashing latency.',
    },
  ];

  const currentQuizItem = quizQuestions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuizItem.correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
      if (user) {
        updateProfile({
          totalQuizzesTaken: (user.totalQuizzesTaken || 0) + 1,
          careerScore: Math.min(98, (user.careerScore || 75) + 2),
        });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswerText.trim() || evalLoading) return;

    setEvalLoading(true);
    setEvalError(null);

    try {
      const response = await fetch('/api/ai/interview-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: evalQuestion,
          questionCategory: selectedCategory,
          userAnswer: userAnswerText,
          role: user?.targetCareer || 'Software Developer',
          difficulty: selectedDifficulty,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to evaluate answer.');
      }

      setEvaluationResult(data.data);
    } catch (err: any) {
      console.error(err);
      setEvalError(err.message || 'Error communicating with AI evaluator.');
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAANG & Startup Mock Interview Suite</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.interviewPrep}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Practice timed technical & behavioral drills, or have Gemini grade your spoken/written answers with hiring committee rubrics.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('mcq')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'mcq'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.mcqQuizzes}
          </button>
          <button
            onClick={() => setActiveTab('ai-evaluator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'ai-evaluator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.aiEvaluator}
          </button>
        </div>
      </div>

      {/* Difficulty & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{t.selectDifficulty}:</span>
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Domain Focus:</span>
          {(['Technical', 'HR', 'System Design', 'Frontend', 'Backend'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: MCQ Quiz Practice */}
      {activeTab === 'mcq' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-6">
          {!quizCompleted ? (
            <>
              {/* Quiz Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    Category: <strong className="text-white">{currentQuizItem.category}</strong> · Difficulty:{' '}
                    <strong className="text-blue-300">{currentQuizItem.difficulty}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timed Practice</span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuizItem.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuizItem.options.map((option, idx) => {
                  let optionClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
                  
                  if (selectedOption === idx) {
                    optionClass = 'bg-blue-600/15 border-blue-500 text-white font-medium';
                  }

                  if (isAnswerSubmitted) {
                    if (idx === currentQuizItem.correctIndex) {
                      optionClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (selectedOption === idx) {
                      optionClass = 'bg-red-500/20 border-red-500 text-red-300';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionClass}`}
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswerSubmitted && idx === currentQuizItem.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQuizItem.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation Box */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>Technical Explanation</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentQuizItem.explanation}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <span className="text-xs text-slate-500">
                  Current Score: <strong className="text-white font-mono">{quizScore}</strong> correct
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-500/20"
                  >
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question →' : 'View Results'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed View */
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-bold text-white">Drill Session Completed!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your performance has been logged to your Career Readiness index (+2% boost applied).
              </p>

              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto my-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Final Accuracy</span>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {Math.round((quizScore / quizQuestions.length) * 100)}%
                  </span>
                  <span className="text-xs text-slate-500">
                    ({quizScore}/{quizQuestions.length})
                  </span>
                </div>
              </div>

              <button
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Another Drill</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI Answer Evaluator */}
      {activeTab === 'ai-evaluator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  Interview Question
                </label>
                <span className="text-[11px] text-slate-500">Or pick a sample prompt below</span>
              </div>
              <textarea
                rows={2}
                value={evalQuestion}
                onChange={e => setEvalQuestion(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 resize-none font-medium"
              />
            </div>

            {/* Quick Pick Samples */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 text-[11px] shrink-0">Sample Questions:</span>
              {sampleInterviewQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setEvalQuestion(q)}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/80 transition-colors truncate max-w-[220px] shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                {t.yourAnswerLabel}
              </label>
              <textarea
                rows={6}
                value={userAnswerText}
                onChange={e => setUserAnswerText(e.target.value)}
                placeholder="Type your interview response here. Mention your reasoning, trade-offs, and concrete project experience..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            {evalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{evalError}</span>
              </div>
            )}

            <button
              onClick={handleEvaluateAnswer}
              disabled={evalLoading || !userAnswerText.trim()}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 disabled:opacity-40"
            >
              {evalLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{t.evaluating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.evaluateAnswer}</span>
                </>
              )}
            </button>
          </div>

          {/* Evaluation Results Card */}
          {evaluationResult && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* Top Verdict Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{t.verdict}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xl font-bold ${
                        evaluationResult.verdict === 'Strong Hire'
                          ? 'text-emerald-400'
                          : evaluationResult.verdict === 'Hire'
                          ? 'text-blue-400'
                          : evaluationResult.verdict === 'Borderline'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {evaluationResult.verdict}
                    </span>
                    <span className="text-xs text-slate-500">· Senior Hiring Committee Rating</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Score</span>
                    <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      {evaluationResult.overallScore}<span className="text-xs font-normal text-slate-500">/10</span>
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Technical Accuracy</span>
                    <p className="text-2xl font-extrabold text-blue-400 font-mono tabular-nums">
                      {evaluationResult.technicalAccuracy}<span className="text-xs font-normal text-slate-500">/10</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Candidate Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluationResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Missing Elements & Omissions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {evaluationResult.areasForImprovement.map((area, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">→</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Model Answer (10/10) */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Exemplary 10/10 Model Response</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  "{evaluationResult.modelAnswer}"
                </p>
              </div>

              {/* Actionable Tip */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Interview Tip:</span> {evaluationResult.actionableTip}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
