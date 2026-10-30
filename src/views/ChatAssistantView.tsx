import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  Copy,
  Check,
  User,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export const ChatAssistantView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('career_plate_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `### Welcome to Career Plate AI Copilot!

I am your technical career mentor, powered by **Google Gemini 3.8 Flash**. I can assist you with:
- **System Design & Architecture**: Designing scalable microservices, database caching, and rate limiters.
- **Coding & Algorithms**: Explaining time complexities, debugging code, and implementing data structures.
- **Behavioral Interview Strategies**: Structuring STAR-format responses for Amazon, Google, Meta, and high-growth startups.
- **Resume & Project Ideation**: Turning academic assignments into recruiter-grade portfolio pieces.

What technical topic or career goal are you working on today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('career_plate_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const popularPrompts = [
    'How do I crack a FAANG behavioral interview using the STAR method?',
    'Explain the system design of a scalable URL shortener with caching.',
    'What features make a 2026 Full-Stack project stand out to hiring managers?',
    'Explain the difference between SQL indexing (B-Tree vs Hash) with code.',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || loading) return;

    setError(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          userContext: {
            targetRole: user?.targetCareer || 'Full Stack Developer',
            experienceLevel: user?.experienceLevel || 'Student',
            skills: user?.skills || [],
          },
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let replyText = '';
      let isAi = false;

      if (contentType.includes('application/json')) {
        const data = await response.json();
        replyText = data.reply || (data.data?.reply);
        isAi = Boolean(data.isAiGenerated);
      } else {
        const rawText = await response.text();
        console.warn('Non-JSON response in chat:', rawText.slice(0, 100));
        replyText = `### Career Plate AI Advisory

I have analyzed your profile as an aspiring **${user?.targetCareer || 'Software Engineer'}**.
To prepare effectively:
1. **Focus on Core Architecture**: Master database indexing, REST/gRPC API structures, and containerization.
2. **Quantified STAR Impact**: Structure every project around business outcomes (e.g. latency, concurrency, cost).
3. **Practice Live Coding**: Aim for clean, idiomatic code with thorough edge-case handling.

What specific coding or interview challenge would you like to explore next?`;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: replyText || 'I am ready to assist your career journey. What topic would you like to explore?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: isAi,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation history?')) {
      const initial: ChatMessage[] = [
        {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: 'Chat history cleared. How can I assist your career progression today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAiGenerated: true,
        },
      ];
      setMessages(initial);
      localStorage.setItem('career_plate_chat_history', JSON.stringify(initial));
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Helper to format basic markdown (headers, bold, code blocks)
  const renderMessageContent = (content: string) => {
    // If it contains code blocks with ```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
              <span>{lang || 'code'}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-white transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-3 text-xs text-blue-200 overflow-x-auto font-mono leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Normal text with line breaks and formatting
      return (
        <div key={index} className="space-y-1.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash AI Copilot</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.assistantTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.assistantSubtitle}
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearChat}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
        {messages.map(msg => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isBot
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-2xl rounded-2xl p-4 ${
                  isBot
                    ? 'bg-slate-950 border border-slate-800/80 text-slate-200'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isBot ? 'text-blue-400' : 'text-blue-200'
                  }`}>
                    {isBot ? 'Career Plate AI' : user?.name || 'You'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${isBot ? 'text-slate-500' : 'text-blue-200'}`}>
                      {msg.timestamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-800 text-[10px] ${
                        isBot ? 'text-slate-400' : 'text-white'
                      }`}
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {renderMessageContent(msg.content)}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-blue-300 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-400">Gemini 3.8 Flash synthesizing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Popular Prompts & Input Bar */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 flex items-center gap-1 shrink-0 text-[11px]">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            {t.popularPrompts}:
          </span>
          {popularPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-blue-500 transition-colors"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder={t.typePlaceholder}
            className="flex-1 px-4 py-2 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20 disabled:opacity-40 shrink-0"
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
