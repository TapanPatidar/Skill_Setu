import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send,
  X,
  FileText,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { opportunityService } from '../../services/opportunityService.js';
import { applicationService } from '../../services/applicationService.js';
import { documentService } from '../../services/documentService.js';
import { DOMAIN_TAXONOMY } from '../../lib/domains.js';

export const OpportunitiesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected for drawer/detail modal
  const [activeOpportunity, setActiveOpportunity] = useState(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [userDocs, setUserDocs] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDomain) params.domain = selectedDomain;
      if (selectedWorkMode) params.workMode = selectedWorkMode;
      if (selectedType) params.type = selectedType;
      if (searchQuery) params.search = searchQuery;

      const res = await opportunityService.getOpportunities(params);
      if (res?.data?.opportunities) {
        setOpportunities(res.data.opportunities);
      } else if (Array.isArray(res?.data)) {
        setOpportunities(res.data);
      }
    } catch (err) {
      showToast('Failed to load opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedDomain, selectedWorkMode, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleOpenApply = async (opp) => {
    setActiveOpportunity(opp);
    setIsApplyModalOpen(true);
    try {
      const docRes = await documentService.getMyDocuments();
      if (docRes?.data) {
        const resumes = docRes.data.filter((d) => d.category === 'resume');
        setUserDocs(resumes);
        if (resumes.length > 0) {
          setSelectedResumeId(resumes[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching vault documents:', err);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!activeOpportunity) return;
    setApplying(true);
    try {
      const payload = {
        opportunity: activeOpportunity._id,
        resumeDocument: selectedResumeId || undefined,
        resumeUrl: 'https://skillsetu.in/vault/verified-resume.pdf',
        coverLetter,
      };

      const res = await applicationService.submitApplication(payload);
      if (res?.success) {
        showToast(`Application submitted for ${activeOpportunity.title}!`, 'success');
        setIsApplyModalOpen(false);
        setActiveOpportunity(null);
        setCoverLetter('');
        navigate('/dashboard/applications');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              ALL-DOMAIN PORTAL
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">MATCH SCORES COMPUTED LIVE</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Internship & Job Opportunities</h1>
          <p className="text-sm text-[#64748B]">
            Discover verified industry positions across Engineering, Management, Healthcare & all disciplines with automated fit scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/applications')}
            className="text-xs gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-[#0052FF]" />
            Track My Applications
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              type="text"
              placeholder="Search by role title, company, or key skill (e.g., React, Python, Finance)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs h-10"
            />
          </div>
          <Button type="submit" size="sm" className="bg-[#0052FF] text-white text-xs px-5 h-10">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F1F5F9]">
          <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
          >
            <option value="">All Domains</option>
            {Object.keys(DOMAIN_TAXONOMY).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Work Mode Filter */}
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
          >
            <option value="">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-Site</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
          >
            <option value="">All Types</option>
            <option value="internship">Internship</option>
            <option value="job">Full-time Job</option>
          </select>

          {(selectedDomain || selectedWorkMode || selectedType || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDomain('');
                setSelectedWorkMode('');
                setSelectedType('');
                setSearchQuery('');
              }}
              className="text-xs text-[#DC2626] hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No opportunities matched your criteria</h3>
          <p className="text-xs text-[#64748B]">Try selecting a different discipline domain or adjusting search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const matchScore = opp.matchScore || 80;
            const isHighMatch = matchScore >= 85;

            return (
              <Card
                key={opp._id}
                className="border-[#E2E8F0] hover:border-[#0052FF]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-label font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                          {opp.domain}
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">•</span>
                        <span className="text-[10px] text-[#64748B] capitalize">{opp.workMode}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A] leading-snug">{opp.title}</h3>
                      <p className="text-xs font-medium text-[#475569] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#0052FF]" />
                        {opp.companyName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-extrabold font-mono-label px-2.5 py-1 rounded-full border ${
                          isHighMatch
                            ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                            : 'bg-[#EFF6FF] text-[#0052FF] border-[#BFDBFE]'
                        }`}
                      >
                        {matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(opp.requiredSkills || []).slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                    {(opp.requiredSkills || []).length > 4 && (
                      <span className="text-[10px] text-[#64748B] self-center">
                        +{(opp.requiredSkills || []).length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#0F172A]">{opp.stipend || 'Competitive'}</span>
                      <span>•</span>
                      <span>{opp.duration || '6 Months'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveOpportunity(opp)}
                        className="text-xs text-[#0052FF] h-8 px-2.5"
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleOpenApply(opp)}
                        className="text-xs bg-[#0052FF] text-white h-8 px-3 gap-1"
                      >
                        Apply
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Opportunity Details Drawer / Modal */}
      {activeOpportunity && !isApplyModalOpen && (
        <Modal
          isOpen={Boolean(activeOpportunity)}
          onClose={() => setActiveOpportunity(null)}
          title={activeOpportunity.title}
        >
          <div className="space-y-4 text-xs text-[#334155]">
            <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="font-bold text-sm text-[#0F172A] block">{activeOpportunity.companyName}</span>
                <span className="text-[#64748B]">{activeOpportunity.sector || activeOpportunity.domain}</span>
              </div>
              <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] font-mono-label">
                {activeOpportunity.matchScore || 85}% Matched
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">STIPEND</span>
                <span className="font-bold text-[#0F172A]">{activeOpportunity.stipend || 'Competitive'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">WORK MODE</span>
                <span className="font-bold text-[#0F172A] capitalize">{activeOpportunity.workMode}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] block">DURATION</span>
                <span className="font-bold text-[#0F172A]">{activeOpportunity.duration || '6 Months'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#0F172A] block">Role Description:</span>
              <p className="text-[#64748B] leading-relaxed">{activeOpportunity.description}</p>
            </div>

            {activeOpportunity.responsibilities && (
              <div className="space-y-1.5">
                <span className="font-semibold text-[#0F172A] block">Key Responsibilities:</span>
                <ul className="list-disc pl-4 space-y-1 text-[#475569]">
                  {activeOpportunity.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="font-semibold text-[#0F172A] block">Required Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {(activeOpportunity.requiredSkills || []).map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveOpportunity(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="bg-[#0052FF] text-white gap-1"
                onClick={() => setIsApplyModalOpen(true)}
              >
                Proceed to Apply
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* One-Click Apply Modal */}
      {isApplyModalOpen && activeOpportunity && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for ${activeOpportunity.title}`}
        >
          <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0052FF]/5 border border-[#0052FF]/15">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">{activeOpportunity.title}</h4>
                  <p className="text-[#64748B]">{activeOpportunity.companyName} • {activeOpportunity.location}</p>
                </div>
                <Badge variant="outline" className="text-xs text-[#16A34A] border-[#16A34A]/30">
                  {activeOpportunity.matchScore || 85}% Compatible
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#0052FF]" />
                Select Verified Resume from Vault:
              </label>
              {userDocs.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
                >
                  {userDocs.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.title} ({doc.metadata?.verifiedByInstitution ? 'Institution Verified' : 'Standard'})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">
                  Using default profile resume (Aarav_Sharma_Engineering_Resume.pdf). You can upload additional resumes in the Documents Vault.
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">
                Cover Letter / Statement of Purpose (Optional):
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain your relevant project experience, core domain strengths, and interest in this role..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={applying}
                className="bg-[#0052FF] text-white gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {applying ? 'Submitting...' : 'Confirm Application'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
