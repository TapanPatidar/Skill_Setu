import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  Building2,
  Check,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleSidebar } from './RoleSidebar.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { CommandPalette } from '../shared/CommandPalette.jsx';
import { CareerAssistantModal } from '../shared/CareerAssistantModal.jsx';

export const AppShell = ({ children }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [careerAssistantOpen, setCareerAssistantOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const roleLabels = {
    student: 'Student / Scholar',
    academician: 'Faculty / Academician',
    industry: 'Corporate Recruiter / Industry',
    institution: 'Placement Cell / Institution',
  };

  const rolesList = [
    { key: 'student', label: 'Student', icon: GraduationCap },
    { key: 'academician', label: 'Academician', icon: User },
    { key: 'industry', label: 'Industry', icon: Briefcase },
    { key: 'institution', label: 'Institution', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Top Bar */}
      <header
        id="app-topbar"
        className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between shadow-xs"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#0F172A] hidden sm:inline-block">
              Skill<span className="gradient-text">Setu</span>
            </span>
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Search & Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full h-10 px-3.5 flex items-center justify-between text-xs sm:text-sm bg-[#F1F5F9] hover:bg-[#E2E8F0]/80 rounded-xl border border-transparent transition-all text-[#64748B] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#64748B]" />
              <span>Search modules, domains, opportunities...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono-label font-bold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Career Advisor Trigger */}
          <button
            onClick={() => setCareerAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#0052FF]/10 to-indigo-100 text-[#0052FF] hover:from-[#0052FF]/20 hover:to-indigo-200 transition-all border border-[#0052FF]/20"
            title="Open AI Career & Skill Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Quick Role Switcher Pill for Phase 1 testing */}
          <div className="hidden sm:flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            {rolesList.map((r) => (
              <button
                key={r.key}
                onClick={() => switchDemoRole(r.key)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  role === r.key
                    ? 'bg-white text-[#0052FF] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={`Switch console to ${r.label}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0052FF]" />
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span className="text-xs font-bold font-mono-label uppercase text-[#0F172A]">
                    Notifications
                  </span>
                  <Badge variant="accent" className="text-[10px]">2 New</Badge>
                </div>
                <div className="py-2 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0052FF]/5 border border-[#0052FF]/10">
                    <p className="font-medium text-[#0F172A]">Skill Mapping Verified</p>
                    <p className="text-[#64748B] text-[11px] mt-0.5">Your discipline assessment is verified.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F1F5F9]">
                    <p className="font-medium text-[#0F172A]">New Internship Match</p>
                    <p className="text-[#64748B] text-[11px] mt-0.5">Top recruiter opened student openings.</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate('/notifications');
                    }}
                    className="w-full text-center text-xs text-[#0052FF] font-semibold hover:underline py-1"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F1F5F9] transition-colors focus:outline-none"
            >
              <Avatar src={user?.avatar} alt={user?.name || 'User'} size="sm" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#0F172A] leading-tight truncate max-w-[120px]">
                  {user?.name || 'Demo User'}
                </span>
                <span className="text-[10px] text-[#0052FF] font-medium leading-tight">
                  {role}
                </span>
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#E2E8F0] mb-2">
                  <p className="text-xs font-bold text-[#0F172A] truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                  <div className="mt-1.5">
                    <Badge variant="accent" className="text-[10px] uppercase">
                      {roleLabels[role] || role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Account & Settings</span>
                  </button>

                  <div className="px-3 pt-2 pb-1 text-[11px] font-mono-label text-[#64748B] uppercase">
                    Switch Active Role
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchDemoRole(r.key);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        role === r.key ? 'bg-[#0052FF]/10 text-[#0052FF] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <r.icon className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </div>
                      {role === r.key && <Check className="w-3.5 h-3.5 text-[#0052FF]" />}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          id="app-sidebar"
          className={`hidden lg:block bg-white border-r border-[#E2E8F0] transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <RoleSidebar role={role} isCollapsed={collapsed} />
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-base text-[#0F172A]">SkillSetu</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <RoleSidebar role={role} isCollapsed={false} onSelectNav={() => setMobileDrawerOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Command Palette & Career Assistant Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <CareerAssistantModal
        isOpen={careerAssistantOpen}
        onClose={() => setCareerAssistantOpen(false)}
      />
    </div>
  );
};
