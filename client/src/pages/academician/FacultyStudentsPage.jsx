import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Send,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { mockInstitutionStudents } from '../../mock/mockData.js';
import { useToast } from '../../context/ToastContext.jsx';

export const FacultyStudentsPage = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState(mockInstitutionStudents);
  const [search, setSearch] = useState('');
  const [selectedStudentForEndorse, setSelectedStudentForEndorse] = useState(null);
  const [endorseSkill, setEndorseSkill] = useState('');
  const [endorseRemark, setEndorseRemark] = useState('');

  const [curriculumGaps] = useState([
    {
      skill: 'Microservices & Distributed Systems',
      domain: 'Engineering & Technology',
      industryDemandPct: 92,
      cohortMasteryPct: 64,
      gap: -28,
      status: 'Critical Gap',
      remedy: 'Add Spring Cloud / Go lab modules in Semester 6',
    },
    {
      skill: 'Good Clinical Practice (GCP) & ABDM APIs',
      domain: 'Healthcare & Ayush',
      industryDemandPct: 88,
      cohortMasteryPct: 52,
      gap: -36,
      status: 'Critical Gap',
      remedy: 'Integrate Ayush Grid digital health simulation capstone',
    },
    {
      skill: 'Financial Valuation (LBO & DCF Modeling)',
      domain: 'Management & Business',
      industryDemandPct: 86,
      cohortMasteryPct: 71,
      gap: -15,
      status: 'Moderate Gap',
      remedy: 'Mandatory Capstone on Bloomberg / NSE terminal datasets',
    },
    {
      skill: 'Multi-Brand Design Tokens & WCAG AAA',
      domain: 'Design & Creative Arts',
      industryDemandPct: 84,
      cohortMasteryPct: 69,
      gap: -15,
      status: 'Moderate Gap',
      remedy: 'Design system portfolio review by industry art directors',
    },
  ]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleEndorse = (e) => {
    e.preventDefault();
    if (!endorseSkill) {
      showToast('Please select or specify a skill to endorse', 'error');
      return;
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s._id === selectedStudentForEndorse._id) {
          return {
            ...s,
            readinessScore: Math.min(100, s.readinessScore + 4),
            endorsementsCount: (s.endorsementsCount || 1) + 1,
          };
        }
        return s;
      })
    );

    showToast(`Endorsed ${endorseSkill} for ${selectedStudentForEndorse.name}! (+4 pts added)`, 'success');
    setSelectedStudentForEndorse(null);
    setEndorseSkill('');
    setEndorseRemark('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
            FACULTY SUPERVISION & PEDAGOGY
          </span>
          <span className="text-xs text-[#64748B]">• Mentee Cohort & Curriculum Mapping</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
          Mentee Roster & Curriculum Alignment
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          Track individual competency progress, issue official academic skill endorsements, and align departmental course syllabus with emerging industry demand.
        </p>
      </div>

      {/* 2. Curriculum Gap vs Industry Demand Alert Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0052FF]" />
              Industry Demand vs. Student Cohort Competency
            </h2>
            <p className="text-xs text-[#64748B]">
              Real-time analytics comparing live employer hiring requirements against institutional assessment records.
            </p>
          </div>
          <span className="text-xs font-mono-label text-[#0052FF] font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Updated Today
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curriculumGaps.map((gap, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono-label text-slate-500 uppercase font-semibold">
                    {gap.domain}
                  </span>
                  <h3 className="text-xs font-bold text-[#0F172A] mt-0.5">{gap.skill}</h3>
                </div>
                <span className={`text-[10px] font-mono-label font-bold px-2 py-0.5 rounded-full ${
                  gap.status === 'Critical Gap' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {gap.status} ({gap.gap}%)
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Industry Hiring Priority:</span>
                  <span className="font-bold text-[#0F172A] font-mono-label">{gap.industryDemandPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-[#0052FF]" style={{ width: `${gap.industryDemandPct}%` }} />
                </div>

                <div className="flex justify-between text-slate-600 pt-1">
                  <span>Current Cohort Mastery:</span>
                  <span className="font-bold text-slate-700 font-mono-label">{gap.cohortMasteryPct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${gap.cohortMasteryPct}%` }} />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0052FF] shrink-0" />
                <span><strong className="text-slate-800">Remedy:</strong> {gap.remedy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Students Roster Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Assigned Scholars & Mentees ({filteredStudents.length})</h2>
            <p className="text-xs text-[#64748B]">Click 'Endorse Skill' to issue verified academic credentials.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or department..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-mono-label uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Student & Roll No.</th>
                <th className="py-3 px-4">Department & Domain</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4">Verified Skills</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredStudents.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0F172A]">{s.name}</div>
                    <div className="text-[11px] font-mono-label text-slate-500">{s.enrollmentNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#0F172A]">{s.department}</div>
                    <div className="text-[11px] text-slate-500">{s.domain}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono-label text-slate-700">Year {s.year}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono-label text-[#0F172A]">{s.readinessScore}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${s.readinessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold bg-blue-50 text-[#0052FF] border border-blue-200">
                      {s.verifiedSkillsCount} verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold capitalize ${
                      s.placementStatus === 'placed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.placementStatus === 'interning'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {s.placementStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      className="text-xs py-1 px-2.5 flex items-center gap-1 ml-auto"
                      onClick={() => setSelectedStudentForEndorse(s)}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
                      Endorse Skill
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Endorsement Modal */}
      {selectedStudentForEndorse && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleEndorse} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-label font-bold text-[#0052FF] uppercase">
                  FACULTY COMPETENCY ENDORSEMENT
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
                  Endorse {selectedStudentForEndorse.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudentForEndorse.department} • {selectedStudentForEndorse.enrollmentNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentForEndorse(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Select / Specify Skill *</label>
                <input
                  type="text"
                  required
                  value={endorseSkill}
                  onChange={(e) => setEndorseSkill(e.target.value)}
                  placeholder="e.g. Distributed Consensus, GCP Protocol, HPLC Chemometrics"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Faculty Remarks & Assessment Bench</label>
                <textarea
                  rows={3}
                  value={endorseRemark}
                  onChange={(e) => setEndorseRemark(e.target.value)}
                  placeholder="Demonstrated exceptional mastery in lab capstone and peer review..."
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-slate-700">
                ⭐ Endorsing this competency grants an official verified badge in the student's Digital Portfolio and adds <strong>+4% to their National Readiness Score</strong>.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setSelectedStudentForEndorse(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Endorsement
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
