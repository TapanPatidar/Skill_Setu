import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Send,
  FileCheck,
  X,
  AlertCircle,
} from 'lucide-react';
import { facultyService } from '../../services/facultyService.js';
import { DOMAIN_TAXONOMY, getAllDomains } from '../../lib/domains.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const FacultyOpportunitiesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const domains = getAllDomains();

  const [activeTab, setActiveTab] = useState('all'); // all, faculty-internship, fdp, industrial-training, consultancy, research-project, my-applications
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applyModalOpp, setApplyModalOpp] = useState(null);
  const [proposalSummary, setProposalSummary] = useState('');
  const [expectedOutcomes, setExpectedOutcomes] = useState('');
  const [nocUrl, setNocUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState([
    {
      _id: 'myapp_01',
      opportunityTitle: 'Industry Immersion Fellowship in Cloud Microservices & Distributed DBs',
      organizationName: 'Tata Consultancy Services - Cloud Labs',
      type: 'faculty-internship',
      status: 'submitted',
      appliedAt: '2026-03-02',
      institutionApproval: 'pending',
    },
  ]);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDomain) params.domain = selectedDomain;
      if (selectedWorkMode) params.workMode = selectedWorkMode;
      if (activeTab !== 'all' && activeTab !== 'my-applications') params.type = activeTab;
      if (searchQuery) params.search = searchQuery;

      const res = await facultyService.getOpportunities(params);
      if (res?.data?.items) {
        setOpportunities(res.data.items);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading faculty opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'my-applications') {
      fetchOpps();
    }
  }, [activeTab, selectedDomain, selectedWorkMode, searchQuery]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposalSummary.trim()) {
      showToast('Please provide a brief proposal summary', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await facultyService.applyForOpportunity(applyModalOpp._id, {
        proposalSummary,
        expectedOutcomes: expectedOutcomes.split('\n').filter((l) => l.trim()),
        nocDocUrl: nocUrl || 'https://documents.skillsetu.gov.in/noc_faculty_ramanath.pdf',
      });

      if (res.success) {
        showToast('Application submitted successfully!', 'success');
        setMyApplications((prev) => [
          {
            _id: `myapp_${Date.now()}`,
            opportunityTitle: applyModalOpp.title,
            organizationName: applyModalOpp.organizationName,
            type: applyModalOpp.type,
            status: 'submitted',
            appliedAt: new Date().toISOString().split('T')[0],
            institutionApproval: 'pending',
          },
          ...prev,
        ]);
        setApplyModalOpp(null);
        setProposalSummary('');
        setExpectedOutcomes('');
      }
    } catch (err) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getBadgeTypeColor = (type) => {
    switch (type) {
      case 'faculty-internship':
        return 'bg-blue-50 text-[#0052FF] border-blue-200';
      case 'fdp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'consultancy':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'research-project':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              ACADEMIA–INDUSTRY SABBATICALS
            </span>
            <span className="text-xs text-[#64748B]">• All 11 Disciplines Covered</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Faculty Opportunities Explorer
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Discover industrial sabbaticals, AICTE-recognized FDPs, sponsored R&D projects, and corporate consultancies curated for Indian higher education faculty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={activeTab === 'my-applications' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('my-applications')}
            className="flex items-center gap-2 text-xs"
          >
            <FileCheck className="w-4 h-4" />
            My Applications ({myApplications.length})
          </Button>
        </div>
      </div>

      {/* 2. Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E2E8F0]">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'faculty-internship', label: 'Faculty Internships' },
          { id: 'fdp', label: 'National FDPs' },
          { id: 'industrial-training', label: 'Industrial Immersion' },
          { id: 'consultancy', label: 'Corporate Consultancy' },
          { id: 'research-project', label: 'Joint R&D Projects' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. My Applications View */}
      {activeTab === 'my-applications' ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A]">My Submitted Faculty Applications</h2>
          <div className="divide-y divide-[#E2E8F0]">
            {myApplications.map((app) => (
              <div key={app._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{app.opportunityTitle}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {app.organizationName}</span>
                    <span>•</span>
                    <span className="font-mono-label">Applied: {app.appliedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono-label font-semibold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                    Status: {app.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono-label font-medium bg-blue-50 text-[#0052FF] border border-blue-200">
                    NOC: {app.institutionApproval}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 4. Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, host organization or keyword..."
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
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-lg border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              >
                <option value="">All Work Modes</option>
                <option value="remote">Virtual / Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site Industrial</option>
              </select>
            </div>
          </div>

          {/* 5. Opportunities Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-white border border-[#E2E8F0] p-6 animate-pulse space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-6 bg-slate-100 rounded w-4/5" />
                  <div className="h-16 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">No faculty opportunities found</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Try loosening your discipline filter or search terms to view all open sabbatical and FDP cohorts.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDomain('');
                  setSelectedWorkMode('');
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <Card
                  key={opp._id}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow border-[#E2E8F0] rounded-2xl overflow-hidden"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono-label font-semibold border ${getBadgeTypeColor(opp.type)}`}>
                        {opp.type.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono-label text-[#64748B] capitalize flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {opp.workMode}
                      </span>
                    </div>

                    <CardTitle className="text-base font-bold text-[#0F172A] line-clamp-2 leading-snug">
                      {opp.title}
                    </CardTitle>

                    <div className="flex items-center gap-1.5 text-xs text-[#0052FF] font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{opp.organizationName}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-[11px] font-mono-label text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded mb-2">
                        {opp.domain}
                      </span>
                      <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#F1F5F9] text-xs">
                      <div className="flex items-center justify-between text-[#475569]">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration:</span>
                        <span className="font-semibold text-[#0F172A]">{opp.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#475569]">
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Honorarium:</span>
                        <span className="font-semibold text-emerald-700 font-mono-label">{opp.fundingOrHonorarium?.amount || 'Institutional Grant'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-xs py-1.5"
                        onClick={() => setSelectedOpp(opp)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1 text-xs py-1.5 flex items-center justify-center gap-1"
                        onClick={() => setApplyModalOpp(opp)}
                      >
                        Apply <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* 6. Detail View Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold border ${getBadgeTypeColor(selectedOpp.type)}`}>
                  {selectedOpp.type.toUpperCase()}
                </span>
                <h2 className="text-xl font-serif font-bold text-[#0F172A] mt-2">{selectedOpp.title}</h2>
                <p className="text-xs text-[#0052FF] font-medium flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5" /> {selectedOpp.organizationName} • {selectedOpp.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-[#0F172A] uppercase tracking-wider font-mono-label text-[11px] mb-1">
                  Scope & Description
                </h3>
                <p className="text-slate-600 leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                  {selectedOpp.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium">Domain & Sub-field</span>
                  <p className="font-bold text-[#0F172A] mt-0.5">{selectedOpp.domain}</p>
                  <p className="text-slate-500">{selectedOpp.subField || 'All Sub-specializations'}</p>
                </div>
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-slate-500 font-medium">Funding / Honorarium</span>
                  <p className="font-bold text-emerald-700 font-mono-label mt-0.5">{selectedOpp.fundingOrHonorarium?.amount}</p>
                  <p className="text-slate-500">{selectedOpp.fundingOrHonorarium?.details}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F172A] uppercase tracking-wider font-mono-label text-[11px] mb-1">
                  Eligibility Criteria
                </h3>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-1">
                  <p className="text-slate-700">• Minimum Academic Experience: <strong>{selectedOpp.eligibility?.minExperienceYears || 2} Years</strong></p>
                  <p className="text-slate-700">• Allowed Departments: <strong>{selectedOpp.eligibility?.departmentsAllowed?.join(', ') || 'All Allied Departments'}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <Button variant="outline" onClick={() => setSelectedOpp(null)} className="text-xs">
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setApplyModalOpp(selectedOpp);
                  setSelectedOpp(null);
                }}
                className="text-xs flex items-center gap-1.5"
              >
                Proceed to Apply <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Application Submission Modal */}
      {applyModalOpp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleApply} className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-label uppercase font-bold text-[#0052FF]">
                  FACULTY SABBATICAL APPLICATION
                </span>
                <h2 className="text-lg font-bold text-[#0F172A] mt-1">{applyModalOpp.title}</h2>
                <p className="text-xs text-slate-500">{applyModalOpp.organizationName}</p>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  Research / Immersion Proposal Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={proposalSummary}
                  onChange={(e) => setProposalSummary(e.target.value)}
                  placeholder="Outline your planned academic contribution, technical focus, and how this sabbatical will enrich your department's pedagogy..."
                  className="w-full p-3 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  Expected Deliverables & Academic Outcomes (One per line)
                </label>
                <textarea
                  rows={2}
                  value={expectedOutcomes}
                  onChange={(e) => setExpectedOutcomes(e.target.value)}
                  placeholder="e.g. Co-authored IEEE / Scopus publication&#10;New Elective Curriculum on Cloud Microservices&#10;Patented joint laboratory bench"
                  className="w-full p-3 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  Institutional NOC (No Objection Certificate) URL / File Reference
                </label>
                <input
                  type="text"
                  value={nocUrl}
                  onChange={(e) => setNocUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or leave blank for digital institutional routing"
                  className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Your university's Dean of Academic Affairs will automatically receive a digital approval request in their Verification Queue.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setApplyModalOpp(null)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit Sabbatical Application'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
