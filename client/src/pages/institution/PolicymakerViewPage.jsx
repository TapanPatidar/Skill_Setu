import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Download,
  Users,
  Building2,
  Globe,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const PolicymakerViewPage = () => {
  const { showToast } = useToast();
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await institutionService.getPolicyAnalytics();
        if (res?.data) {
          setPolicyData(res.data);
        }
      } catch (err) {
        console.error(err);
        showToast('Error loading policymaker analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleExportBrief = () => {
    const rows = [
      ['Discipline', 'Readiness Score', 'National Assessed Cohort', 'Industry Alignment', 'Target Employment'],
      ...(policyData?.nationalReadiness?.map((nr) => [
        `"${nr.domain}"`,
        `${nr.readinessScore}%`,
        nr.totalAssessed,
        `${nr.industryAlignment}%`,
        `${nr.targetEmploymentRate}%`,
      ]) || []),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Skill_Policy_Brief_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('National policy data brief exported', 'success');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              NATIONAL STATUTORY BENCHMARKS
            </span>
            <span className="text-xs text-[#64748B]">• National Accreditation & Quality Frameworks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Policymaker & Multi-Disciplinary Benchmark
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Anonymized pan-India analytics benchmarking higher education curriculum effectiveness, employer absorption rates, and regional readiness across all 11 disciplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportBrief} className="flex items-center gap-2 text-xs">
            <Download className="w-4 h-4 text-[#0052FF]" /> Export Policy Brief (CSV)
          </Button>
        </div>
      </div>

      {/* 2. Pan-India Macro Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardContent className="p-5">
            <span className="text-slate-500 text-xs font-medium">Institutions Onboarded</span>
            <div className="text-2xl font-serif font-bold text-[#0F172A] mt-2">
              {policyData?.totalInstitutionsOnboarded || 482}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Central, State & Private Universities</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardContent className="p-5">
            <span className="text-slate-500 text-xs font-medium">National Scholars Assessed</span>
            <div className="text-2xl font-serif font-bold text-[#0052FF] font-mono-label mt-2">
              {policyData?.totalNationalStudentsAssessed || '6.2 Lakh+'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Verified diagnostic assessment pool</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardContent className="p-5">
            <span className="text-slate-500 text-xs font-medium">All-India Avg Readiness</span>
            <div className="text-2xl font-serif font-bold text-emerald-700 font-mono-label mt-2">
              {policyData?.allIndiaAverageReadiness || 81.2}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">+6.4% YoY National improvement</p>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardContent className="p-5">
            <span className="text-slate-500 text-xs font-medium">NIRF Criterion V Alignment</span>
            <div className="text-2xl font-serif font-bold text-purple-700 font-mono-label mt-2">
              {policyData?.nirfNaacCriteriaVAlignment || '94.8%'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Digital statutory audit trail</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. National Discipline League Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#0F172A]">National Discipline Readiness & Industry Absorption</h2>
          <p className="text-xs text-[#64748B]">
            Aggregated competency benchmarks across all 11 recognized academic domains in India.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-mono-label uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Academic Discipline</th>
                <th className="py-3.5 px-4">Readiness Score</th>
                <th className="py-3.5 px-4">Total Assessed Pool</th>
                <th className="py-3.5 px-4">Curriculum Industry Alignment</th>
                <th className="py-3.5 px-4">Statutory Target Employment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {policyData?.nationalReadiness?.map((nr, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F172A]">{nr.domain}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono-label text-[#0052FF]">{nr.readinessScore}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-[#0052FF]" style={{ width: `${nr.readinessScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono-label text-slate-700">
                    {nr.totalAssessed.toLocaleString()} scholars
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {nr.industryAlignment}% Aligned
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono-label text-slate-700 font-medium">
                    {nr.targetEmploymentRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Regional Competency Clusters */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">Regional Skill Index & Active Corporate MoUs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {policyData?.regionalIndices?.map((reg, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
              <span className="font-bold text-[#0F172A] block">{reg.region}</span>
              <div className="flex justify-between text-slate-600">
                <span>Readiness Index:</span>
                <strong className="text-[#0052FF] font-mono-label">{reg.readinessIndex}%</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Corporate MoUs:</span>
                <strong className="text-slate-800 font-mono-label">{reg.activeMoUs}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Institutions Participating:</span>
                <strong className="text-slate-800 font-mono-label">{reg.participationCount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
