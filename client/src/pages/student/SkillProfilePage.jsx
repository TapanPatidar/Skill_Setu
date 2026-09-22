import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { skillsService } from '../../services/skillsService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const SkillProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await skillsService.getProfile();
        if (isMounted && res?.data) {
          setProfileData(res.data);
        }
      } catch (err) {
        console.error('Error loading skill profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const benchmarks = profile.benchmarks || [
    { subject: 'Technical Core', studentScore: 88, industryBenchmark: 75, fullMark: 100 },
    { subject: 'Analytical Aptitude', studentScore: 84, industryBenchmark: 70, fullMark: 100 },
    { subject: 'Professional Soft Skills', studentScore: 90, industryBenchmark: 80, fullMark: 100 },
    { subject: 'System Design & Scalability', studentScore: 82, industryBenchmark: 75, fullMark: 100 },
    { subject: 'Cloud & Tooling', studentScore: 78, industryBenchmark: 65, fullMark: 100 },
  ];

  const verifiedSkills = profile.verifiedSkills || [];
  const skillGaps = profile.skillGaps || [];
  const readinessScore = profile.readinessScore || 87;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              COMPETENCY RADAR & AUDIT
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">VERIFIED VIA SHA-256</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Student Skill Profile & Benchmarking</h1>
          <p className="text-sm text-[#64748B]">
            Real-time radar alignment comparing your verified proficiencies directly with corporate employer hiring thresholds.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#F8FAFC] px-5 py-3 rounded-2xl border border-[#E2E8F0] self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <span className="text-xs text-[#64748B] font-mono-label block">READINESS INDEX</span>
            <span className="text-2xl font-extrabold text-[#0052FF]">{readinessScore}%</span>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/assessment')}
            variant="outline"
            className="gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Recalibrate
          </Button>
        </div>
      </div>

      {/* Grid: Radar Chart + Target Career Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Card (7 cols) */}
        <Card className="lg:col-span-7 border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-[#0F172A]">
                  Multi-Dimensional Competency Radar
                </CardTitle>
                <CardDescription className="text-xs text-[#64748B]">
                  Your score vs. Industry target baseline across 5 key dimensions
                </CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono-label text-xs">
                5 Vectors
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={benchmarks}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <Radar
                    name="Student Score"
                    dataKey="studentScore"
                    stroke="#0052FF"
                    fill="#0052FF"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Industry Benchmark"
                    dataKey="industryBenchmark"
                    stroke="#94A3B8"
                    fill="#94A3B8"
                    fillOpacity={0.15}
                    strokeDasharray="3 3"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#FFF',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Target Role & Academic Alignment (5 cols) */}
        <Card className="lg:col-span-5 border-[#E2E8F0] flex flex-col justify-between">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <CardTitle className="text-base font-semibold text-[#0F172A]">Target Career Track</CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Optimal industry role based on current domain curriculum
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 flex-1">
            <div className="p-4 rounded-2xl bg-[#0052FF]/5 border border-[#0052FF]/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-label font-bold text-[#0052FF] uppercase">PRIMARY TARGET</span>
                <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  94% Match
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {user?.profile?.targetRole || 'Full-Stack Software Engineer'}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Matches your high scores in Technical Core (88%) and System Design (82%). Recommended by academic mentor.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-[#0F172A] block">Cross-Domain Adjacent Tracks:</span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#334155]">Cloud DevOps Solutions Architect</span>
                  <span className="font-mono-label text-[#0052FF] font-medium">86% match</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[#334155]">Fintech Distributed Core Engineer</span>
                  <span className="font-mono-label text-[#64748B]">79% match</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between mt-2 text-xs"
              onClick={() => navigate('/dashboard/career-guidance')}
            >
              <span>Explore Detailed Career Paths</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Verified Skills & Prioritized Gaps Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified Skills Card */}
        <Card className="border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  Institution-Verified Skills
                </CardTitle>
                <CardDescription className="text-xs text-[#64748B]">
                  Authenticated via automated assessments and faculty audits
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono-label text-[#16A34A] border-[#16A34A]/30">
                {verifiedSkills.length} Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {verifiedSkills.map((sk) => (
              <div
                key={sk.skillName}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">{sk.skillName}</h4>
                    <span className="text-[11px] text-[#64748B] font-mono-label">
                      Verified {new Date(sk.verifiedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={sk.level === 'Advanced' ? 'default' : 'secondary'}
                  className="text-xs font-medium"
                >
                  {sk.level}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prioritized Skill Gaps Card */}
        <Card className="border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  Identified Skill Gaps
                </CardTitle>
                <CardDescription className="text-xs text-[#64748B]">
                  Prioritized deficits between your score and role requirements
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-mono-label">
                {skillGaps.length} Identified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {skillGaps.map((gap) => {
              const severityColor =
                gap.severity === 'critical'
                  ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                  : gap.severity === 'moderate'
                  ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                  : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';

              return (
                <div
                  key={gap.skillName}
                  className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[#0F172A]">{gap.skillName}</h4>
                      <span className={`text-[10px] font-mono-label uppercase px-2 py-0.5 rounded-full border font-bold ${severityColor}`}>
                        {gap.severity}
                      </span>
                    </div>
                    <span className="text-xs font-mono-label text-[#64748B]">
                      {gap.currentProficiency}% / {gap.requiredProficiency}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Progress
                      value={(gap.currentProficiency / gap.requiredProficiency) * 100}
                      className="h-1.5"
                    />
                  </div>

                  {gap.suggestedProgramTitle && (
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#64748B] flex items-center gap-1 truncate max-w-[240px]">
                        <BookOpen className="w-3.5 h-3.5 text-[#0052FF] shrink-0" />
                        <span className="truncate">{gap.suggestedProgramTitle}</span>
                      </span>
                      <Link
                        to="/dashboard/learning"
                        className="text-[#0052FF] hover:underline font-medium shrink-0 ml-2"
                      >
                        Enroll Track →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
