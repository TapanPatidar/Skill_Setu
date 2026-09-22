import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Award,
  Briefcase,
  Users,
  Building2,
  CalendarCheck,
  FolderGit2,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  Bell,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const navigationCommands = [
    // General
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { name: 'Notifications & Alerts', path: '/notifications', icon: Bell, category: 'General' },
    { name: 'Account Settings', path: '/settings', icon: Settings, category: 'General' },

    // Student
    { name: 'Diagnostic Skill Assessment', path: '/dashboard/assessment', icon: Award, category: 'Student' },
    { name: 'Competency Matrix & Badges', path: '/dashboard/skill-profile', icon: BarChart3, category: 'Student' },
    { name: 'Internships & Job Opportunities', path: '/dashboard/opportunities', icon: Briefcase, category: 'Student' },
    { name: 'AI Career Guidance', path: '/dashboard/career-guidance', icon: Sparkles, category: 'Student' },
    { name: 'Digital Portfolio', path: '/dashboard/portfolio', icon: FolderGit2, category: 'Student' },

    // Academician
    { name: 'Faculty Sabbaticals & FDPs', path: '/dashboard/faculty-opps', icon: GraduationCap, category: 'Faculty' },
    { name: 'Collaboration Hub & Events', path: '/dashboard/collaboration', icon: CalendarCheck, category: 'Faculty' },
    { name: 'Mentee Roster & Endorsements', path: '/dashboard/faculty-students', icon: Users, category: 'Faculty' },

    // Industry
    { name: 'Manage Job Postings', path: '/dashboard/manage-jobs', icon: Briefcase, category: 'Industry' },
    { name: 'Candidate Pipeline', path: '/dashboard/pipeline', icon: Users, category: 'Industry' },
    { name: 'Corporate Profile & MoUs', path: '/dashboard/company-profile', icon: Building2, category: 'Industry' },

    // Institution
    { name: 'Placement Analytics Matrix', path: '/dashboard/placements', icon: BarChart3, category: 'Institution' },
    { name: 'Student Competency Registry', path: '/dashboard/students', icon: Users, category: 'Institution' },
    { name: 'Verification Queue (Claims)', path: '/dashboard/verifications', icon: ShieldCheck, category: 'Institution' },
    { name: 'Accredited Industry Partners', path: '/dashboard/partners', icon: Building2, category: 'Institution' },
    { name: 'Departments & CSV Import', path: '/dashboard/departments', icon: FileSpreadsheet, category: 'Institution' },
    { name: 'National Integrations (NPTEL / ABC)', path: '/dashboard/integrations', icon: ShieldCheck, category: 'Institution' },
    { name: 'Policymaker NIRF Benchmark', path: '/dashboard/policymaker', icon: BarChart3, category: 'Institution' },
  ];

  const filtered = navigationCommands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or prop
        }
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].path);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#CBD5E1] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search modules, or jump to page..."
            className="w-full text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-label font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching modules or commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.name}
                  onClick={() => handleSelect(item.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#0052FF] text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono-label uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-slate-400 font-mono-label">
          <span>Use ↑↓ keys to navigate</span>
          <span>Press ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
