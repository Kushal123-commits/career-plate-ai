import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Shield, Info, Layers, Mail, Heart } from 'lucide-react';
import { LegalModals } from '../views/LegalModals';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<'about' | 'features' | 'privacy' | 'contact' | null>(null);

  return (
    <>
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Brand and Description */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">
                  Career Plate AI
                </span>
                <span className="text-xs text-blue-400">· Your AI-Powered Career Companion</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 max-w-md">
                Empowering students and tech job seekers with intelligent resume auditing, real-time skill gap analysis, and Gemini-driven interview coaching.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-400/90 font-medium">
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                <span>Hacktoberfest 2026 Special Release</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
              <button
                onClick={() => setActiveModal('about')}
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                {t.about}
              </button>
              <button
                onClick={() => setActiveModal('features')}
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                {t.features}
              </button>
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                {t.privacy}
              </button>
              <button
                onClick={() => setActiveModal('contact')}
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                {t.contact}
              </button>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
            <p>© 2026 Career Plate AI. {t.footerRights}</p>
            <p className="mt-2 sm:mt-0">Engineered with Google Gemini 3.8 Flash & Tailwind CSS</p>
          </div>
        </div>
      </footer>

      {/* Working Legal / Info Modals */}
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
};
