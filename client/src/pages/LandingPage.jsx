import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  Layers,
  LineChart,
  FileCheck2,
  BookOpen,
  Calendar,
  Compass,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.jsx';
import { SectionPill } from '../components/ui/SectionPill.jsx';

export const LandingPage = () => {
  const { isAuthenticated, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [activeRoleTab, setActiveRoleTab] = useState('student');

  const handleDemoLaunch = async (role) => {
    await loginAsDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex flex-col selection:bg-[#0052FF]/15 selection:text-[#0052FF]">
      {/* Sticky Glass-blur Navbar */}
      <Navbar />

      {/* 1. Asymmetric Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 sm:pt-18 sm:pb-32 lg:pt-24 lg:pb-36">
        {/* Blurred accent background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0052FF]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#4D7CFF]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <SectionPill>National Skill Ecosystem • All Disciplines</SectionPill>

              <h1 className="text-4xl sm:text-6xl lg:text-[4.5rem] tracking-tight font-serif leading-[1.08] text-[#0F172A]">
                Unified Academia–Industry Bridge for Modern{' '}
                <span className="gradient-text block sm:inline">Higher Education.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] max-w-xl leading-relaxed">
                A comprehensive institutional platform connecting students, academicians, corporate recruiters, and universities across{' '}
                <strong className="text-[#0F172A] font-semibold">Engineering, Management, Healthcare, Sciences & Design</strong>.
                Seamlessly benchmark competencies, automate verified internship workflows, facilitate faculty sabbaticals,
                and secure high-impact placements.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/register">
                  <Button size="xl" variant="primary" className="w-full sm:w-auto gap-2">
                    <span>Explore the Portal</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    Sign In to Console
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Strip micro-bullets */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Four Dedicated Roles
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> NABH / GCP Standardized
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Real-time Skill Gap Engine
                </span>
              </div>
            </div>

            {/* Right Abstract Visual with Asymmetric Radius & Motion */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* Corner Accent Block */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0052FF]/10 rounded-2xl -z-10" />

              {/* 3x3 Dot Grid Graphic */}
              <div className="absolute -bottom-8 -left-8 grid grid-cols-3 gap-2 p-3 bg-white/80 rounded-xl shadow-xs border border-[#E2E8F0] -z-10">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#0052FF]/40" />
                ))}
              </div>

              {/* Main Visual Container with Asymmetric Radius */}
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-700">
                {/* Internal Dot Grid */}
                <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

                {/* Rotating Dashed Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-[#0052FF]/40 rounded-full animate-spin-slow pointer-events-none" />

                {/* Top Badge Inside Visual */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono-label">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                    <span>SKILL MATRIX ENGINE</span>
                  </div>
                  <span className="text-white/60 text-xs font-mono-label">v1.0 LIVE</span>
                </div>

                {/* Center Core Badge */}
                <div className="relative z-10 text-center my-auto space-y-2">
                  <div className="w-16 h-16 rounded-2xl gradient-accent mx-auto flex items-center justify-center text-white shadow-accent-lg shadow-blue-500/30">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h4 className="text-white font-serif text-xl tracking-tight">SkillSetu Hub</h4>
                  <p className="text-slate-300 text-xs max-w-xs mx-auto">
                    Empowering multi-disciplinary learners with verified industrial pathways.
                  </p>
                </div>

                {/* Floating Card 1: Top Right (Bobbing) */}
                <div className="absolute -top-3 -right-2 sm:right-2 z-20 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E2E8F0] animate-float-bob-1 max-w-[210px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Cloud Architecture</p>
                      <p className="text-[10px] text-emerald-600 font-medium">96% Industry Match</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: Bottom Left (Bobbing) */}
                <div className="absolute -bottom-3 -left-2 sm:left-2 z-20 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E2E8F0] animate-float-bob-2 max-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0052FF] flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">AI Systems Engineering</p>
                      <p className="text-[10px] text-[#64748B]">NexGen Research • ₹35k/mo</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Status bar inside graphic */}
                <div className="relative z-10 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                  <span>National University Network</span>
                  <span className="text-[#4D7CFF] font-semibold">15 Live Openings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip Section */}
      <section className="border-y border-[#E2E8F0] bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">National Accreditation & Enterprise Standards</h4>
                <p className="text-xs text-[#64748B]">
                  Supporting 11 disciplines, verified credential issuance & NIRF/NAAC audit trails
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono-label font-medium uppercase text-[#64748B]">
              <span className="hover:text-[#0F172A] transition-colors">Engineering & Tech</span>
              <span>•</span>
              <span className="hover:text-[#0F172A] transition-colors">Management & Finance</span>
              <span>•</span>
              <span className="hover:text-[#0F172A] transition-colors">Healthcare & Ayush</span>
              <span>•</span>
              <span className="hover:text-[#0F172A] transition-colors">Design & Media</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inverted Stats Section (Dark with Dot Pattern) */}
      <section className="bg-[#0F172A] text-white py-24 sm:py-32 relative overflow-hidden">
        {/* Dot Pattern Texture */}
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <SectionPill light>Ecosystem Metrics</SectionPill>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-white">
              Measurable Impact in Ayush Education & Placement.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Consolidating student skill profiles, corporate hiring demands, and institutional MoUs into an
              automated evidence pipeline.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-2">
              <span className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
                91.4<span className="text-[#4D7CFF]">%</span>
              </span>
              <p className="text-xs font-mono-label text-slate-300 uppercase">Placement & Internship Rate</p>
              <p className="text-[11px] text-slate-400">+6.2% improvement with AI mapping</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-2">
              <span className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
                840<span className="text-[#4D7CFF]">+</span>
              </span>
              <p className="text-xs font-mono-label text-slate-300 uppercase">Enrolled Ayush Scholars</p>
              <p className="text-[11px] text-slate-400">BAMS, MD (Ayu), Bio-Tech & IT</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-2">
              <span className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
                46<span className="text-[#4D7CFF]">+</span>
              </span>
              <p className="text-xs font-mono-label text-slate-300 uppercase">Industry Partners</p>
              <p className="text-[11px] text-slate-400">Pharma, Ayush R&D & Hospitals</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-2">
              <span className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
                100<span className="text-[#4D7CFF]">%</span>
              </span>
              <p className="text-xs font-mono-label text-slate-300 uppercase">Verified Credentials</p>
              <p className="text-[11px] text-slate-400">Digital Portfolios & NAAC audits</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Grid (8 Features, First Card Spanning) */}
      <section id="features" className="py-24 sm:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <SectionPill>End-to-End Capabilities</SectionPill>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#0F172A]">
              Architected for the Modern Ayush Knowledge Economy.
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              Eight unified modules spanning assessment, industry programs, faculty development, and placement analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: First Card Spanning 2 columns on desktop */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full bg-gradient-to-br from-white via-white to-blue-50/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <Badge variant="accent">Flagship Automation</Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4">
                    1. Adaptive Skill Assessment & Matrix Profiling
                  </CardTitle>
                  <CardDescription className="text-base text-[#64748B] max-w-xl">
                    Standardized diagnostic assessments evaluating competencies across pharmacognosy,
                    evidence-based Panchakarma, herbal formulation stability, and health informatics. Computes
                    individual skill readiness indices and identifies curriculum gap areas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Category 1</span>
                      <strong className="text-[#0F172A] font-semibold">Ayush & Ayurveda</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Category 2</span>
                      <strong className="text-[#0F172A] font-semibold">Pharmacognosy</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Category 3</span>
                      <strong className="text-[#0F172A] font-semibold">GCP Clinical Trials</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Category 4</span>
                      <strong className="text-[#0F172A] font-semibold">Ayurvedic Informatics</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2: Dynamic Skill Mapping */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <LineChart className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">2. Real-Time Skill Mapping</CardTitle>
                <CardDescription>
                  Algorithmic matching of corporate job requirements to student competency profiles with
                  automatic micro-credential recommendations.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3: Internships & Apprenticeships */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">3. Ayush Internships & Apprenticeships</CardTitle>
                <CardDescription>
                  Verified openings in herbal extraction labs, Ayush hospitals, clinical trial centers, and
                  pharma R&D units with milestone-based stipend tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4: Campus Placements */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">4. Multi-Stage Placement Pipeline</CardTitle>
                <CardDescription>
                  Transparent corporate recruitment funnel: Applied → Shortlisted → Technical Interview →
                  Formal Offer → Mutual Acceptance.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5: Industry Learning Programs */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">5. Industry Micro-Credentials</CardTitle>
                <CardDescription>
                  Co-created specialized courses in Ayurvedic Informatics, HPTLC standardization, and
                  wellness tourism management with accredited certificates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6: Digital Portfolio */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">6. Verifiable Digital Portfolios</CardTitle>
                <CardDescription>
                  Faculty-endorsed case studies, research publications, botanical specimens, and formulations
                  packaged for corporate recruiters.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 7: Faculty Portal */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">7. Faculty Sabbaticals & FDPs</CardTitle>
                <CardDescription>
                  Dedicated portal for academicians to engage in industrial training, corporate consultancy,
                  sponsored research grants, and student mentorship.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 8: Institutional Analytics */}
            <Card className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <CardTitle className="mt-4">8. Smart Placement Analytics</CardTitle>
                <CardDescription>
                  Centralized command console for placement cells: tracking MoUs, student employment rates,
                  salary percentiles, and NAAC/NABH accreditation records.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. "How It Works" Timeline Section */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <SectionPill>Workflow Blueprint</SectionPill>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#0F172A]">
              How the Collaboration Journey Unfolds.
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              A structured four-step pipeline connecting institutional scholars to industrial reality.
            </p>
          </div>

          {/* Desktop Horizontal / Mobile Vertical Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-4 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <Badge variant="trend" className="text-[10px] hidden md:inline-flex">Step 1</Badge>
              </div>
              <h4 className="text-base font-semibold text-[#0F172A]">Skill Assessment</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Scholars complete standardized domain competency tests across Ayurvedic therapeutics, QA, and informatics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <Badge variant="trend" className="text-[10px] hidden md:inline-flex">Step 2</Badge>
              </div>
              <h4 className="text-base font-semibold text-[#0F172A]">Gap Analysis</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Automated matching against industry job requirements recommends certified micro-learning tracks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <Badge variant="trend" className="text-[10px] hidden md:inline-flex">Step 3</Badge>
              </div>
              <h4 className="text-base font-semibold text-[#0F172A]">Internship Matching</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Seamless application to R&D labs, pharmaceutical plants, and hospitals with digital NOC approvals.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl gradient-accent text-white flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <Badge variant="trend" className="text-[10px] hidden md:inline-flex">Step 4</Badge>
              </div>
              <h4 className="text-base font-semibold text-[#0F172A]">Placement & Collab</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Formal career placement, institutional MoU creation, and long-term joint research milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Built for Four Roles" Section */}
      <section id="four-roles" className="py-24 sm:py-32 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <SectionPill>Tailored Experiences</SectionPill>
            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#0F172A]">
              Engineered for Four Key Stakeholders.
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
              Every role receives a dedicated console, tailored toolsets, and immediate value.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { key: 'student', label: 'Ayush Scholar (Student)', icon: GraduationCap },
              { key: 'academician', label: 'Faculty (Academician)', icon: Users },
              { key: 'industry', label: 'Corporate Partner (Industry)', icon: Briefcase },
              { key: 'institution', label: 'Placement Cell (Institution)', icon: Building2 },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveRoleTab(t.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeRoleTab === t.key
                    ? 'gradient-accent text-white shadow-accent-sm'
                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Role Showcase Display */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-8 sm:p-12">
            {activeRoleTab === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="accent">For Students & Research Scholars</Badge>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#0F172A]">
                    Accelerate Your Multi-Disciplinary Career.
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Build a verified skill profile, benchmark your competencies with industry-designed diagnostics,
                    gain priority access to high-stipend corporate internships, and assemble an interactive
                    digital portfolio.
                  </p>
                  <ul className="space-y-2 text-sm text-[#0F172A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Take diagnostic skill tests across tech, management & sciences
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> One-click internship & job applications
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Direct mentor feedback & verified weekly logs
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button onClick={() => handleDemoLaunch('student')} className="gap-2">
                      <span>Launch Student Demo Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-mono-label font-bold text-[#64748B] uppercase">
                      STUDENT CONSOLE PREVIEW
                    </span>
                    <Badge variant="trend">Readiness: 94%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0F172A]">Cloud Architecture & DevOps</span>
                      <span className="text-xs text-emerald-600 font-semibold">Verified Advanced</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0F172A]">Financial Analytics & Modeling</span>
                      <span className="text-xs text-emerald-600 font-semibold">Certified</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0F172A]">Biomedical Clinical Research</span>
                      <span className="text-xs text-blue-600 font-semibold">Active Track</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'academician' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="accent">For Faculty & Academic Mentors</Badge>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#0F172A]">
                    Bridge Academic Research with Industrial Sabbaticals.
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Faculty members can engage in corporate research consultancies, apply for high-throughput
                    laboratory sabbaticals, mentor scholars through live industry projects, and endorse student competencies.
                  </p>
                  <ul className="space-y-2 text-sm text-[#0F172A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Browse sponsored FDPs and industrial sabbaticals
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Supervise student internships with digital NOCs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Issue verified competency credentials
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button onClick={() => handleDemoLaunch('academician')} className="gap-2">
                      <span>Launch Faculty Demo Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-mono-label font-bold text-[#64748B] uppercase">
                      FACULTY CONSOLE PREVIEW
                    </span>
                    <Badge variant="trend">28 Mentees</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-xs">
                      <p className="text-xs font-semibold text-[#0F172A]">Industry Sabbatical: Syngene Phyto-Lab</p>
                      <p className="text-[11px] text-[#64748B]">3 Months • ₹60,000 / mo honorarium</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs">
                      <p className="text-xs font-semibold text-[#0F172A]">National Faculty Development Program</p>
                      <p className="text-[11px] text-[#64748B]">2 Weeks • AICTE Accredited</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'industry' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="accent">For Recruiters & Corporate R&D</Badge>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#0F172A]">
                    Source Pre-Screened Talent Across All Disciplines.
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Cut recruitment overheads by directly searching candidates with verified skills,
                    post internships or full-time openings, and sponsor collaborative innovation challenges.
                  </p>
                  <ul className="space-y-2 text-sm text-[#0F172A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Post openings with customizable eligibility filters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Real-time applicant pipeline (Applied → Accepted)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Partner on university laboratory testing & MoUs
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button onClick={() => handleDemoLaunch('industry')} className="gap-2">
                      <span>Launch Recruiter Demo Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-mono-label font-bold text-[#64748B] uppercase">
                      RECRUITER PIPELINE PREVIEW
                    </span>
                    <Badge variant="trend">142 Applicants</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#0F172A]">Herbal Drug Formulation Intern</p>
                        <p className="text-[11px] text-[#64748B]">4 Openings • Hybrid</p>
                      </div>
                      <Badge variant="success">64 Matched</Badge>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#0F172A]">Clinical Research Associate</p>
                        <p className="text-[11px] text-[#64748B]">2 Openings • On-site</p>
                      </div>
                      <Badge variant="success">18 Shortlisted</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeRoleTab === 'institution' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <Badge variant="accent">For Placement Cells & Institutional Admins</Badge>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#0F172A]">
                    Automate Placements & Strengthen NAAC/NABH Compliance.
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Gain birds-eye visibility into institutional placement rates, manage industry MoUs,
                    audit student internships for university credits, and export accreditation-ready analytics.
                  </p>
                  <ul className="space-y-2 text-sm text-[#0F172A]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Centralized tracking of 46+ corporate partners
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Automated NOC generation & verification audits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" /> Cohort analytics for NIRF, NAAC & statutory reporting
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Button onClick={() => handleDemoLaunch('institution')} className="gap-2">
                      <span>Launch Institution Demo Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-mono-label font-bold text-[#64748B] uppercase">
                      INSTITUTION COMMAND PREVIEW
                    </span>
                    <Badge variant="trend">91.4% Placed</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0F172A]">Active Corporate MoUs</span>
                      <span className="text-xs font-bold text-[#0052FF]">18 Formal Accords</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-xs flex items-center justify-between">
                      <span className="text-xs font-medium text-[#0F172A]">Ayush Scholars Placed</span>
                      <span className="text-xs font-bold text-emerald-600">768 Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Featured Gradient-Border Card Showcase */}
      <section id="ayush-domain" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Card featured={true} className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0052FF]" />
                  <span className="text-xs font-mono-label font-semibold text-[#0052FF] uppercase">
                    Ayush & Modern Healthcare Convergence
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif tracking-tight text-[#0F172A]">
                  Connecting Traditional Medicine with Global Regulatory Standards.
                </h3>
                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                  SkillSetu bridges classical Ayurveda disciplines (Dravyaguna, Panchakarma, Rasa Shastra) with modern
                  chromatography, clinical trial Good Clinical Practice (GCP), HL7/FHIR healthcare informatics, and
                  wellness tourism management.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="default">Pharmacognosy & Extraction</Badge>
                  <Badge variant="default">GCP Clinical Trials</Badge>
                  <Badge variant="default">Evidence-Based Panchakarma</Badge>
                  <Badge variant="default">Ayurvedic Health Informatics</Badge>
                  <Badge variant="default">Nutraceutical Export Compliance</Badge>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 text-center">
                <div className="w-12 h-12 rounded-xl gradient-accent mx-auto flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A]">Enterprise Ready</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Engineered for seamless campus ERP integration, verified internship tracking, and automated institutional compliance audits.
                </p>
                <Link to="/register" className="inline-block w-full">
                  <Button size="sm" variant="primary" className="w-full">
                    Register Your Organization
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 8. Inverted Final CTA Section (Dark with Dot Pattern) */}
      <section className="bg-[#0F172A] text-white py-24 sm:py-32 relative overflow-hidden">
        {/* Dot Pattern Texture */}
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          <SectionPill light>Get Started Today</SectionPill>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-white leading-tight">
            Ready to Automate Your Academia–Industry{' '}
            <span className="text-[#4D7CFF] block sm:inline">Collaboration?</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join the All India Institute of Ayurveda, accredited colleges, and leading biopharma & Ayush
            partners in building a transparent skill mapping and placement ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="xl" variant="primary" className="w-full sm:w-auto gap-2">
                <span>Create Portal Account</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                Sign In with Demo Credentials
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-400 font-mono-label pt-4">
            PHASE 1 FOUNDATION • NO CC REQUIRED • INSTANT ONE-CLICK DEMO ACCESS
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
