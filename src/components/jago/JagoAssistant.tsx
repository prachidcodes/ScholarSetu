import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  HelpCircle, 
  RefreshCw,
  FileSearch,
  MessageSquareQuote
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { jagoService } from '../../services/jagoService';
import { JagoChatMessage } from '../../types';
import { Badge } from '../ui/Badge';

export const JagoAssistant: React.FC = () => {
  const { user, role } = useAuth();
  const { 
    isJagoOpen, 
    setIsJagoOpen, 
    applications, 
    activeDemoApplication,
    pendingJagoPrompt,
    setPendingJagoPrompt
  } = useApp();

  const [messages, setMessages] = useState<JagoChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Initialize greeting with context
  useEffect(() => {
    if (messages.length === 0) {
      const initial = jagoService.getInitialGreeting(user, activeDemoApplication);
      setMessages(initial);
    }
  }, [user, activeDemoApplication, messages.length]);

  // Handle pending external prompt trigger
  useEffect(() => {
    if (isJagoOpen && pendingJagoPrompt) {
      handleSendMessage(pendingJagoPrompt);
      setPendingJagoPrompt(null);
    }
  }, [isJagoOpen, pendingJagoPrompt]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isJagoOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isJagoOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isJagoOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isJagoOpen]);

  // Only show JAGO on student view or if requested
  if (role === 'admin') return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: JagoChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await jagoService.processUserMessage(query, {
        user,
        applications,
        activeApp: activeDemoApplication
      });
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'jago',
          text: 'I encountered an issue processing that query. Please ask me about your scholarship status, eligibility, or income verification query.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'why_flagged':
        handleSendMessage('Why is my application flagged?');
        break;
      case 'disbursement_status':
        handleSendMessage('Check my disbursement status');
        break;
      case 'manual_review_info':
        handleSendMessage('How does Manual Review work?');
        break;
      case 'one_scholarship_rule':
        handleSendMessage('What is the One-Scholarship rule?');
        break;
      case 'open_app':
        if (activeDemoApplication) {
          navigate(`/student/applications/${activeDemoApplication.id}`);
          setIsJagoOpen(false);
        }
        break;
      case 'go_to_documents':
        navigate('/student/documents');
        setIsJagoOpen(false);
        break;
      case 'browse_scholarships':
        navigate('/student/scholarships');
        setIsJagoOpen(false);
        break;
      default:
        handleSendMessage(action);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isJagoOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Attention Pill if application has mismatch */}
          {activeDemoApplication?.readinessReport?.hasMismatch && (
            <div 
              onClick={() => setIsJagoOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer border border-amber-400 hover:scale-105 transition-transform"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Income flag query? Ask JAGO</span>
            </div>
          )}

          <button
            onClick={() => setIsJagoOpen(true)}
            className="w-14 h-14 rounded-full bg-teal-800 text-white shadow-xl hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-700/30 flex items-center justify-center transition-all hover:scale-105 group relative border-2 border-amber-400"
            aria-label="Open JAGO Assistant"
          >
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
              J
            </span>
          </button>
        </div>
      )}

      {/* JAGO Chat Modal / Drawer */}
      {isJagoOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700/80 border border-teal-500/40 flex items-center justify-center text-amber-300 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-tight">JAGO</h3>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
                    ST Virtual Assistant
                  </span>
                </div>
                <p className="text-[11px] text-teal-200/90">Ministry of Tribal Affairs</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const initial = jagoService.getInitialGreeting(user, activeDemoApplication);
                  setMessages(initial);
                }}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsJagoOpen(false)}
                title="Close Assistant"
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {activeDemoApplication && (
            <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[200px]">
                Active: <strong className="text-slate-800">{activeDemoApplication.schemeName}</strong>
              </span>
              <Badge 
                variant={activeDemoApplication.status === 'Disbursed' ? 'success' : activeDemoApplication.readinessReport?.hasMismatch ? 'warning' : 'info'}
                size="sm"
              >
                {activeDemoApplication.status}
              </Badge>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'jago' && (
                  <div className="w-7 h-7 rounded-full bg-teal-800 text-amber-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 shadow-xs">
                    J
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-teal-800 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>

                  {/* Context Card (if attached to response) */}
                  {msg.contextCard && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{msg.contextCard.title}</span>
                        {msg.contextCard.statusBadge && (
                          <Badge variant="warning" size="sm">
                            {msg.contextCard.statusBadge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mb-2">{msg.contextCard.description}</p>
                      {msg.contextCard.route && (
                        <button
                          onClick={() => {
                            navigate(msg.contextCard!.route!);
                            setIsJagoOpen(false);
                          }}
                          className="w-full py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] flex items-center justify-center gap-1"
                        >
                          <span>Review in Application</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quick Actions Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(qa.action)}
                          className="px-2.5 py-1 rounded-full bg-white text-teal-800 border border-teal-700/30 hover:bg-teal-50 text-[11px] font-medium transition-colors shadow-2xs text-left"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <div className="w-6 h-6 rounded-full bg-teal-800 text-amber-300 flex items-center justify-center text-xs font-bold animate-pulse">
                  J
                </div>
                <span>JAGO is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about application flags, DBT, eligibility..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-teal-800 text-white hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by ScholarSetu Rules Engine • Ministry of Tribal Affairs
            </p>
          </div>
        </div>
      )}
    </>
  );
};
