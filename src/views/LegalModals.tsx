import React from 'react';
import { X, CheckCircle, Mail, Send, Award, Sparkles, Shield, Cpu } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'about' | 'features' | 'privacy' | 'contact' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [contactSent, setContactSent] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal: About */}
        {activeModal === 'about' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">About Career Plate AI</h3>
                <p className="text-xs text-blue-400">Your AI-Powered Career Companion · Hacktoberfest 2026</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Career Plate AI was created to bridge the critical gap between academic curriculum and high-velocity tech industry expectations. 
              Built for students, recent graduates, and ambitious engineers, our platform leverages Google's cutting-edge Gemini 3.8 Flash model 
              to provide unbiased, actionable career guidance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Mission
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Democratize access to elite tech career coaching, recruiter-grade ATS resume audits, and realistic technical mock interviews.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  Architecture
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Full-stack TypeScript application powered by Express, React 19, Tailwind CSS v4, and secure server-side Google GenAI SDK.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal: Features */}
        {activeModal === 'features' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Platform Capabilities</h3>
                <p className="text-xs text-emerald-400">Comprehensive Career Acceleration Suite</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <p className="font-semibold text-white text-xs">1. AI Resume ATS Analyzer</p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload PDF, DOCX, or TXT resumes to receive quantifiable ATS scores, category breakdowns, STAR-method bullet rewrites, and downloadable reports.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <p className="font-semibold text-white text-xs">2. Competency & Skill Gap Radar</p>
                <p className="text-xs text-slate-400 mt-1">
                  Compare your skillset against 9 modern tech careers (Full Stack, AI/ML, Cloud, Cyber, DevOps) with prioritized missing skills and estimated learning hours.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <p className="font-semibold text-white text-xs">3. Gemini AI Career Copilot</p>
                <p className="text-xs text-slate-400 mt-1">
                  Context-aware mentor answering complex programming inquiries, system design puzzles, code reviews, and compensation benchmarks.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <p className="font-semibold text-white text-xs">4. Technical & HR Interview Simulator</p>
                <p className="text-xs text-slate-400 mt-1">
                  Topic-wise timed MCQ drills and AI Answer Evaluation with actionable verdicts (Strong Hire, Hire, Borderline, Needs Improvement).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                <p className="font-semibold text-white text-xs">5. Personalized 8-Week Roadmaps & Application Kanban</p>
                <p className="text-xs text-slate-400 mt-1">
                  Curated study sprints tailored to your daily available study time with an integrated job/internship application pipeline tracker.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* Modal: Privacy Policy */}
        {activeModal === 'privacy' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Privacy & Security Commitment</h3>
                <p className="text-xs text-violet-400">Protecting Candidate & Academic Data</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                At <strong>Career Plate AI</strong>, we respect your confidentiality. We adhere strictly to zero-retention principles regarding uploaded resumes and personal identity markers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Uploaded resumes are parsed directly in-memory and evaluated securely via server-side API calls.</li>
                <li>Your raw resume files are never stored in public buckets, shared with advertisers, or sold to third-party recruiters.</li>
                <li>All profile preferences, quiz progress, and tracked applications are preserved locally within your browser's persistent sandbox.</li>
                <li>API keys and backend calls are maintained strictly server-side with zero browser exposure.</li>
              </ul>
              <p className="pt-2 text-[11px] text-slate-500">
                Last updated: October 2026 for Hacktoberfest Open-Source Initiative.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Modal: Contact */}
        {activeModal === 'contact' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Get in Touch</h3>
                <p className="text-xs text-blue-400">Feedback, College Hackathons & Partnerships</p>
              </div>
            </div>

            {contactSent ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-semibold text-white">Message Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for connecting. Our career engineering team will review your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setContactSent(false);
                    onClose();
                  }}
                  className="mt-3 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (formData.name && formData.email && formData.message) {
                    setContactSent(true);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jordan Smith"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@university.edu"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Message or Hackathon Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you are building or ask for career guidance..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-md shadow-blue-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
