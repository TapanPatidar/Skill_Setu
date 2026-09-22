import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Award,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Send,
  Users,
  Building2,
  FileCheck,
  CalendarCheck,
  Search,
  FileText,
  BarChart3,
  ShieldCheck,
  ScrollText,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const getRoleNavigation = (role) => {
  switch (role) {
    case 'academician':
      return [
        { name: 'Faculty Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'FDPs & Sabbaticals', path: '/dashboard/faculty-opps', icon: GraduationCap, badge: '2 new' },
        { name: 'Collaboration Hub', path: '/dashboard/collaboration', icon: CalendarCheck, badge: 'Live' },
        { name: 'My Students & Alignment', path: '/dashboard/faculty-students', icon: Users, badge: '28 active' },
        { name: 'Documents Vault', path: '/dashboard/vault', icon: FileText },
      ];

    case 'industry':
      return [
        { name: 'Recruiter Hub', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Opportunities', path: '/dashboard/manage-jobs', icon: Briefcase, badge: '5 open' },
        { name: 'Candidate Pipeline', path: '/dashboard/pipeline', icon: Users, badge: '142' },
        { name: 'Internship Oversight', path: '/dashboard/internship-management', icon: FileCheck },
        { name: 'Co-Created Learning', path: '/dashboard/learning-programs', icon: GraduationCap },
        { name: 'Company Profile & MoUs', path: '/dashboard/company-profile', icon: Building2 },
      ];

    case 'institution':
      return [
        { name: 'Institutional Command', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Placement Analytics', path: '/dashboard/placements', icon: BarChart3, badge: '91.4%' },
        { name: 'Student Competency Registry', path: '/dashboard/students', icon: Users, badge: '2,450' },
        { name: 'Verification Queue', path: '/dashboard/verifications', icon: ShieldCheck, badge: '3 pending' },
        { name: 'Industry Partners & MoUs', path: '/dashboard/partners', icon: Building2, badge: '38 active' },
        { name: 'Departments & CSV Import', path: '/dashboard/departments', icon: FileSpreadsheet },
        { name: 'Enterprise Integrations', path: '/dashboard/integrations', icon: ShieldCheck, badge: 'Live' },
        { name: 'Policymaker Benchmark', path: '/dashboard/policymaker', icon: BarChart3 },
      ];

    case 'student':
    default:
      return [
        { name: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Skill Assessment', path: '/dashboard/assessment', icon: Award, badge: 'Diagnostic' },
        { name: 'Skill Matrix & Profile', path: '/dashboard/skill-profile', icon: BarChart3 },
        { name: 'Career Guidance', path: '/dashboard/career-guidance', icon: Compass, badge: 'Adaptive' },
        { name: 'Internships & Jobs', path: '/dashboard/opportunities', icon: Briefcase, badge: '15 open' },
        { name: 'Active Internship', path: '/dashboard/my-internship', icon: FileSpreadsheet, badge: 'Live' },
        { name: 'Industry Learning', path: '/dashboard/learning', icon: GraduationCap },
        { name: 'Application Tracker', path: '/dashboard/applications', icon: Send, badge: '6' },
        { name: 'Digital Portfolio', path: '/dashboard/portfolio', icon: FolderGit2 },
        { name: 'Documents Vault', path: '/dashboard/vault', icon: FileText },
      ];
  }
};

export const RoleSidebar = ({ role, isCollapsed, onSelectNav }) => {
  const navItems = getRoleNavigation(role);

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-2">
        <span className="text-[11px] font-mono-label font-bold uppercase tracking-wider text-[#64748B]">
          {role.toUpperCase()} CONSOLE
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onSelectNav}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xl transition-all select-none group',
                  isActive
                    ? 'bg-[#0052FF]/10 text-[#0052FF] font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!isCollapsed && item.badge && (
                <span className="text-[10px] font-mono-label font-medium px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#0F172A]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
