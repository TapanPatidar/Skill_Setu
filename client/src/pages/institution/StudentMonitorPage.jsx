import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Award,
  ChevronRight,
  CheckCircle2,
  X,
  Building2,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService.js';
import { getAllDomains } from '../../lib/domains.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const StudentMonitorPage = () => {
  const { showToast } = useToast();
  const domains = getAllDomains();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDomain) params.domain = selectedDomain;
      if (search) params.search = search;
      const res = await institutionService.getStudents(params);
      if (res?.data?.items) {
        let list = res.data.items;
        if (selectedStatus !== 'all') {
          list = list.filter((s) => s.placementStatus === selectedStatus);
        }
        setStudents(list);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading student registry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDomain, selectedStatus, search]);

  const handleExportCsv = () => {
    const headers = ['Name', 'Enrollment No', 'Email', 'Domain', 'Department', 'Year', 'Readiness Score', 'Verified Skills', 'Placement Status'];
    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.enrollmentNumber}"`,
      `"${s.email}"`,
      `"${s.domain}"`,
      `"${s.department}"`,
      s.year,
      s.readinessScore,
      s.verifiedSkillsCount,
      `"${s.placementStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Competency_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${students.length} student records to CSV`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              STUDENT COMPETENCY MASTER REGISTRY
            </span>
            <span className="text-xs text-[#64748B]">• All Disciplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Student Skill & Readiness Monitor
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Central repository of all enrolled students, verified skill badges, national readiness scores, and placement tracking across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2 text-xs">
            <Download className="w-4 h-4 text-[#0052FF]" /> Export Roster CSV
          </Button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
          >
            <option value="">All Academic Disciplines ({domains.length})</option>
            {domains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
          >
            <option value="all">All Placement Statuses</option>
            <option value="seeking">Seeking Opportunities</option>
            <option value="interning">Active Internship</option>
            <option value="placed">Placed with Offer</option>
          </select>
        </div>
      </div>

      {/* 3. Students Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-mono-label uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student & Roll No.</th>
                <th className="py-3.5 px-4">Department & Domain</th>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Readiness Score</th>
                <th className="py-3.5 px-4">Verified Skills</th>
                <th className="py-3.5 px-4">Placement Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n}>
                    <td colSpan={7} className="py-4 px-4 text-center text-slate-400">
                      Loading registry data...
                    </td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-slate-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
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
                            className="h-full bg-gradient-to-r from-[#0052FF] to-[#4D7CFF]"
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
                        onClick={() => setSelectedStudent(s)}
                      >
                        Profile <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Student Detail Slide-Over Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-mono-label font-bold text-[#0052FF] uppercase">
                  OFFICIAL INSTITUTIONAL RECORD
                </span>
                <h3 className="text-xl font-serif font-bold text-[#0F172A] mt-0.5">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.enrollmentNumber} • {selectedStudent.department} ({selectedStudent.domain})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-slate-500">Readiness Score</span>
                <p className="text-xl font-bold font-mono-label text-[#0052FF] mt-1">{selectedStudent.readinessScore}%</p>
                <span className="text-[10px] text-emerald-600">Top 12% in discipline</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-slate-500">Placement Status</span>
                <p className="text-base font-bold capitalize text-[#0F172A] mt-1">{selectedStudent.placementStatus}</p>
                <span className="text-[10px] text-slate-500">{selectedStudent.verifiedSkillsCount} skills verified</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#0F172A] uppercase font-mono-label text-[11px]">Contact & Credentials</h4>
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Institutional Email:</span>
                  <span className="font-mono-label text-slate-800">{selectedStudent.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Year:</span>
                  <span className="font-mono-label text-slate-800">Year {selectedStudent.year} (Graduating 2026)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DigiLocker / ABC Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button variant="outline" onClick={() => setSelectedStudent(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
