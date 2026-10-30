import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CareerRole } from '../types';
import { X, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, signup, loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetCareer, setTargetCareer] = useState<CareerRole>('Full Stack Developer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!authModalOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await login(email, password);
        if (!res.success) setError(res.error || 'Failed to log in.');
      } else if (authModalMode === 'signup') {
        const res = await signup(name, email, password, targetCareer);
        if (!res.success) setError(res.error || 'Failed to sign up.');
      } else if (authModalMode === 'forgot') {
        if (!email) {
          setError('Please provide your account email.');
        } else {
          setResetSent(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authModalMode === 'login' && 'Welcome Back'}
            {authModalMode === 'signup' && 'Create Your Career Account'}
            {authModalMode === 'forgot' && 'Reset Account Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login' && 'Log in to sync your resume scores and career roadmaps'}
            {authModalMode === 'signup' && 'Join thousands of students accelerating tech careers'}
            {authModalMode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {authModalMode === 'forgot' && resetSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">Reset Link Dispatched</h4>
            <p className="text-xs text-slate-400">
              We have dispatched password recovery instructions to <span className="text-white font-mono">{email}</span>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                openAuthModal('login');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            {/* Google Fast Connect */}
            {authModalMode !== 'forgot' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-medium">
                    Or with email
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
              {authModalMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => openAuthModal('forgot')}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {authModalMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Career Pathway</label>
                  <select
                    value={targetCareer}
                    onChange={e => setTargetCareer(e.target.value as CareerRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {careers.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Processing...'
                    : authModalMode === 'login'
                    ? 'Sign In to Workspace'
                    : authModalMode === 'signup'
                    ? 'Create Free Account'
                    : 'Send Password Reset'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Toggle Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              {authModalMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="text-blue-400 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-blue-400 font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
