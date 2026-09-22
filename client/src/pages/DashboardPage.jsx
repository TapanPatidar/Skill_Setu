import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Briefcase,
  GraduationCap,
  Users,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { dashboardService } from '../services/dashboardService.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { mockOpportunities } from '../mock/mockData.js';

export const DashboardPage = () => {
  const { user, role, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getStats(role);
        if (isMounted && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [role]);

  // Role metadata configurations representing all fields
  const roleHeaders = {
    student: {
      badge: 'Multi-Discipline Scholar • Engineering & Tech Cohort',
      title: `Welcome back, ${user?.name || 'Aarav Sharma'}`,
      subtitle:
        'National SkillSetu Portal • Your verified competency matrix is mapped to 15 industry internships across Cloud, AI, Management & Biotech.',
      actionBtn: 'Take Skill Diagnostic',
      actionRoute: '/dashboard/assessment',
    },
    academician: {
      badge: 'Faculty Portal • Academic & Industry Council',
      title: `Welcome, ${user?.name || 'Dr. Vaidya Ramanath'}`,
      subtitle:
        'Department of Computer Science & Applied Informatics • 28 active research mentees and 2 new industry sabbatical openings.',
      actionBtn: 'Review Sabbaticals',
      actionRoute: '/dashboard/faculty-opps',
    },
    industry: {
      badge: 'Corporate Recruiter Hub • Enterprise Partner',
      title: `Welcome, ${user?.name || 'Pooja Singhania'}`,
      subtitle:
        'NexGen Innovations & Cloud Systems • 142 candidates in pipeline with 4 active internship drives across Cloud, AI & Management.',
      actionBtn: 'Post New Opportunity',
      actionRoute: '/dashboard/manage-jobs',
    },
    institution: {
      badge: 'Placement & Accreditation Command Center',
      title: `Welcome, ${user?.name || 'Dr. K. S. Dhiman'}`,
      subtitle:
        'Central Placement & Industry Collaboration Cell • 91.4% placement rate recorded with 18 formal corporate MoUs active across all departments.',
      actionBtn: 'Export Placement Analytics',
      actionRoute: '/dashboard/placements',
    },
  };

  const currentHeader = roleHeaders[role] || roleHeaders.student;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Header Banner */}
      <div className="relative rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0052FF]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
              <span className="text-xs font-mono-label font-bold uppercase text-[#0052FF]">
                {currentHeader.badge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
              {currentHeader.title}
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              {currentHeader.subtitle}
            </p>
          </div>

          {/* Header Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              size="md"
              onClick={() => navigate(currentHeader.actionRoute)}
              className="gap-2 bg-[#0052FF] text-white shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentHeader.actionBtn}</span>
            </Button>
          </div>
        </div>

        {/* Live Role Switcher bar for testing across all 4 roles */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">Switch Active Role:</span>
            {['student', 'academician', 'industry', 'institution'].map((r) => (
              <button
                key={r}
                onClick={() => switchDemoRole(r)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  role === r
                    ? 'bg-[#0052FF] text-white font-semibold shadow-xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-slate-200'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono-label text-[#64748B]">
            NATIONAL HIGHER EDUCATION ECOSYSTEM • 11 DISCIPLINES
          </span>
        </div>
      </div>

      {/* 2. Key Metrics Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-serif text-[#0F172A]">Key Metrics Overview</h2>
          <span className="text-xs text-[#64748B]">Real-time synchronization across institutions & industry</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 space-y-3 border-[#E2E8F0]">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats &&
              Object.entries(stats).map(([key, item]) => (
                <Card
                  key={key}
                  className="p-6 hover:shadow-md transition-all duration-200 border-[#E2E8F0]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono-label font-bold text-[#64748B] uppercase tracking-wider">
                      {item.label}
                    </span>
                    {item.trend && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <TrendingUp className="w-3 h-3" />
                        {item.trend}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-3xl font-bold font-serif text-[#0F172A] tracking-tight">
                      {item.value}
                    </span>
                    {item.desc && (
                      <p className="text-xs text-[#64748B] leading-tight pt-1">{item.desc}</p>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* 3. Role-Specific Content Sections */}
      {role === 'student' && (
        <div className="space-y-6">
          {/* Quick Access Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/dashboard/assessment')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <Award className="w-5 h-5 text-[#0052FF] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Take Skill Diagnostic</h4>
              <p className="text-[11px] text-[#64748B]">Automated gap calibration</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/career-guidance')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <Compass className="w-5 h-5 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Career Guidance</h4>
              <p className="text-[11px] text-[#64748B]">Adaptive pathways & adjacent roles</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/my-internship')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#16A34A] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Active Internship</h4>
              <p className="text-[11px] text-[#64748B]">Weekly logs & milestone tracker</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/applications')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <Clock className="w-5 h-5 text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">My Applications</h4>
              <p className="text-[11px] text-[#64748B]">Interview schedules & status</p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Matched Opportunities */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Ranked Internship & Job Matches</h3>
                  <p className="text-xs text-[#64748B]">Computed dynamically based on your verified skill profile</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard/opportunities')}
                  className="text-xs text-[#0052FF]"
                >
                  View All Openings
                </Button>
              </div>

              <div className="space-y-3">
                {mockOpportunities.slice(0, 3).map((opp) => (
                  <Card key={opp._id} className="p-5 hover:border-[#0052FF]/40 transition-all border-[#E2E8F0]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-label font-bold uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                            {opp.domain}
                          </span>
                          <span className="text-[10px] text-[#64748B] capitalize">{opp.workMode}</span>
                          <span className="text-xs font-mono-label font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                            {opp.matchScore}% Fit
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A]">{opp.title}</h4>
                        <p className="text-xs text-[#64748B]">
                          {opp.companyName} • {opp.location} • {opp.stipend || 'Competitive'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(opp.requiredSkills || []).slice(0, 4).map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded bg-[#F8FAFC] text-[10px] text-[#334155] border border-[#E2E8F0]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <Button
                          size="sm"
                          onClick={() => navigate('/dashboard/opportunities')}
                          className="bg-[#0052FF] text-white text-xs"
                        >
                          Review & Apply
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Competency Diagnostic & Career Mobility */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Verified Competency Matrix</h3>
              <Card className="p-5 space-y-4 border-[#E2E8F0]">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span className="text-xs font-semibold text-[#0F172A]">Diagnostic Proficiency</span>
                  <span className="text-xs text-emerald-600 font-bold font-mono-label">88 / 100 Score</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#64748B]">Cloud & Full-Stack Systems</span>
                      <span className="font-semibold text-[#0F172A]">94%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F5F9]">
                      <div className="h-full rounded-full bg-[#0052FF] w-[94%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#64748B]">Relational & NoSQL Databases</span>
                      <span className="font-semibold text-[#0F172A]">86%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F5F9]">
                      <div className="h-full rounded-full bg-[#0052FF] w-[86%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#64748B]">DevOps & Container Architecture</span>
                      <span className="font-semibold text-[#0F172A]">72%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F1F5F9]">
                      <div className="h-full rounded-full bg-[#0052FF] w-[72%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard/skill-profile')}
                    className="w-full text-xs"
                  >
                    View Comprehensive Radar Matrix
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {role === 'industry' && (
        <div className="space-y-6">
          {/* Quick Access for Industry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/dashboard/manage-jobs')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <Briefcase className="w-5 h-5 text-[#0052FF] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Manage Postings</h4>
              <p className="text-[11px] text-[#64748B]">Jobs & Internships</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/pipeline')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <Users className="w-5 h-5 text-[#7C3AED] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Candidate Pipeline</h4>
              <p className="text-[11px] text-[#64748B]">Ranked by Match %</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/internship-management')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <FileSpreadsheet className="w-5 h-5 text-[#16A34A] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Intern Supervision</h4>
              <p className="text-[11px] text-[#64748B]">Log sign-offs & certs</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/learning-programs')}
              className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0052FF] hover:shadow-sm text-left transition-all group"
            >
              <GraduationCap className="w-5 h-5 text-[#D97706] mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-[#0F172A]">Co-Created Tracks</h4>
              <p className="text-[11px] text-[#64748B]">Publish training syllabus</p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0F172A]">Active Talent Drives</h3>
                <Button
                  size="sm"
                  onClick={() => navigate('/dashboard/manage-jobs')}
                  className="gap-1.5 bg-[#0052FF] text-white text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post New Opening
                </Button>
              </div>

              <div className="space-y-3">
                <Card className="p-5 border-[#E2E8F0]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        Engineering & Technology
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1">Full-Stack Cloud Engineering Intern</h4>
                      <p className="text-xs text-[#64748B]">NexGen Innovations • 2 Positions • Bengaluru (Hybrid)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className="bg-[#EFF6FF] text-[#0052FF] border-[#BFDBFE] font-mono-label">18 Applicants</Badge>
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">8 High-Fit Matches</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate('/dashboard/pipeline')}
                        className="text-xs bg-[#0052FF] text-white"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-[#E2E8F0]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        Management & Business
                      </span>
                      <h4 className="text-sm font-bold text-[#0F172A] mt-1">Product Strategy & Analytics Associate</h4>
                      <p className="text-xs text-[#64748B]">NexGen Innovations • 1 Position • ₹45,000 / mo</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className="bg-[#EFF6FF] text-[#0052FF] border-[#BFDBFE] font-mono-label">12 Applicants</Badge>
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">5 Shortlisted</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate('/dashboard/pipeline')}
                        className="text-xs bg-[#0052FF] text-white"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Institutional Partnerships</h3>
              <Card className="p-5 space-y-3 text-xs border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> 3 Institutional MoUs Verified
                </div>
                <p className="text-[#64748B]">
                  Your corporate profile is accredited with NIT Delhi, DTU, and AIIA to conduct seamless placement drives with university credits.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard/company-profile')}
                  className="w-full text-xs"
                >
                  Manage Profile & Partnerships
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {role === 'academician' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Sponsored Industrial Sabbaticals & FDPs</h3>
            <div className="space-y-3">
              <Card className="p-5 border-[#E2E8F0]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20">
                      3 Months Industry Fellowship
                    </Badge>
                    <h4 className="text-sm font-bold text-[#0F172A] mt-2">
                      NexGen Cloud • Distributed Systems & AI Reliability Lab
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Advanced distributed architecture and microservice resilience. AICTE sponsored honorarium of ₹75,000/mo.
                    </p>
                  </div>
                  <Button size="sm" className="bg-[#0052FF] text-white text-xs">Apply</Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Mentee Supervision</h3>
            <Card className="p-5 space-y-3 text-xs border-[#E2E8F0]">
              <p className="text-[#64748B]">
                You have <strong>28 active scholars</strong> under your supervision across Engineering, Informatics, and Capstone research tracks.
              </p>
              <div className="p-3 bg-[#F1F5F9] rounded-xl space-y-1">
                <span className="font-semibold text-[#0F172A]">Pending Internship Approvals</span>
                <p className="text-[#64748B]">3 NOC applications require faculty endorsement.</p>
              </div>
              <Button size="sm" className="w-full text-xs bg-[#0052FF] text-white">Review NOC Approvals</Button>
            </Card>
          </div>
        </div>
      )}

      {role === 'institution' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Placement & Internship Summary</h3>
            <Card className="p-6 space-y-4 border-[#E2E8F0]">
              <div className="grid grid-cols-3 gap-4 text-center border-b border-[#E2E8F0] pb-4">
                <div>
                  <span className="text-2xl font-bold font-serif text-[#0F172A]">840</span>
                  <p className="text-[11px] text-[#64748B] uppercase font-mono-label">Total Cohort</p>
                </div>
                <div>
                  <span className="text-2xl font-bold font-serif text-emerald-600">768</span>
                  <p className="text-[11px] text-[#64748B] uppercase font-mono-label">Placed / Interning</p>
                </div>
                <div>
                  <span className="text-2xl font-bold font-serif text-[#0052FF]">72</span>
                  <p className="text-[11px] text-[#64748B] uppercase font-mono-label">In Pipeline</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-[#0F172A]">Top Recruiting Disciplines This Academic Cycle:</p>
                <div className="grid grid-cols-2 gap-2 text-[#64748B]">
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">Engineering & Technology: 40%</div>
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">Management & Business: 22%</div>
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">Healthcare & Ayush: 14%</div>
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">Sciences, Design & Commerce: 24%</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#0F172A]">Accreditation Records</h3>
            <Card className="p-5 space-y-3 text-xs border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-[#0052FF] font-semibold">
                <Building2 className="w-4 h-4" /> NAAC / NIRF Audit Packets
              </div>
              <p className="text-[#64748B]">
                All student internships are timestamped, validated with faculty NOCs, and formatted for
                submission to AICTE and NAAC criterion inspectors.
              </p>
              <Button size="sm" className="w-full text-xs bg-[#0052FF] text-white">
                Generate NAAC Criterion V Export
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
