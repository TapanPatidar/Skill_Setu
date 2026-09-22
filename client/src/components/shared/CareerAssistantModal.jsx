import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { aiService } from '../../services/aiService.js';
import { getAllDomains } from '../../lib/domains.js';
import { Button } from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const CareerAssistantModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const domains = getAllDomains();

  const [domain, setDomain] = useState(user?.domain || 'Engineering & Technology');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am the **SkillSetu AI Career & Competency Advisor**. Ask me anything about in-demand skills, interview preparation, academic credit transfer (NPTEL/DigiLocker), or industry sabbaticals for **${user?.domain || 'your field'}**!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const promptChips = [
    'What skills are most in-demand right now?',
    'How do I bridge gaps for top recruiter internships?',
    'Which certifications are recognized for credits?',
    'What salary packages are offered in my discipline?',
  ];

  if (!isOpen) return null;

  const handleSend = async (userPrompt) => {
    const query = userPrompt || input;
    if (!query.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.getCareerGuidance(query, domain);
      const reply = res?.data?.reply || 'I am ready to help you benchmark your skills. Check your dashboard for open opportunities!';
      setMessages([...newMsgs, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Unable to reach career advisor at the moment. Please review the skill profile section of your portal!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0052FF] to-[#4D7CFF] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                SkillSetu AI Career Advisor
                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#0052FF] font-mono-label text-[10px]">
                  Multi-Discipline
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Domain-aware career intelligence & skill roadmaps</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="text-xs py-1 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none"
            >
              {domains.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  m.role === 'user' ? 'bg-[#0F172A] text-white' : 'bg-[#0052FF] text-white'
                }`}
              >
                {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#0052FF] text-white'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#0052FF]" />
              Synthesizing domain guidance...
            </div>
          )}
        </div>

        {/* Prompt Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {promptChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-white border border-[#CBD5E1] text-slate-700 hover:border-[#0052FF] hover:text-[#0052FF] whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E2E8F0]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AI about ${domain} internships, skills, or interviews...`}
              className="flex-1 py-2 px-3 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !input.trim()}
              className="text-xs py-2 px-4 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
