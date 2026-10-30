import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DashboardView } from './views/DashboardView';
import { ResumeAnalyzerView } from './views/ResumeAnalyzerView';
import { SkillGapView } from './views/SkillGapView';
import { ChatAssistantView } from './views/ChatAssistantView';
import { InterviewPrepView } from './views/InterviewPrepView';
import { RoadmapView } from './views/RoadmapView';
import { JobTrackerView } from './views/JobTrackerView';
import { AuthModal } from './views/AuthModal';
import { ProfileModal } from './views/ProfileModal';
import { Menu } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentView} />;
      case 'resume-analyzer':
        return <ResumeAnalyzerView />;
      case 'skill-gap':
        return <SkillGapView />;
      case 'chat-assistant':
        return <ChatAssistantView />;
      case 'interview-prep':
        return <InterviewPrepView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'job-tracker':
        return <JobTrackerView />;
      default:
        return <DashboardView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        
        {/* Responsive Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
        />

        {/* Central Viewport */}
        <main className="flex-1 w-full lg:pl-64 flex flex-col min-h-[calc(100vh-64px)]">
          
          {/* Mobile Workspace Toggle Bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <button
              onClick={() => setSidebarOpenMobile(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200"
            >
              <Menu className="w-4 h-4 text-blue-400" />
              <span>Menu & Modules</span>
            </button>
            <span className="text-xs font-bold text-white capitalize">
              {currentView.replace('-', ' ')}
            </span>
          </div>

          {/* Dynamic Module Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </div>

          {/* Footer Component */}
          <Footer />
        </main>
      </div>

      {/* Persistent Modals */}
      <AuthModal />
      <ProfileModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
