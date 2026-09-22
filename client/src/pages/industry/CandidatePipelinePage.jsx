import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Video,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  Building2,
  Calendar,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { opportunityService } from '../../services/opportunityService.js';
import { applicationService } from '../../services/applicationService.js';
import { useToast } from '../../context/ToastContext.jsx';

export const CandidatePipelinePage = () => {
  const [searchParams] = useSearchParams();
  const oppIdParam = searchParams.get('oppId');
  const { showToast } = useToast();

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(oppIdParam || '');
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interview Schedule Modal state
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [interviewDate, setInterviewDate] = useState('2026-03-24T15:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/setu-tech-demo');
  const [interviewNotes, setInterviewNotes] = useState('Technical discussion on React 18 concurrency and microservice API design');
  const [scheduling, setScheduling] = useState(false);

  // Load all opportunities for selector
  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await opportunityService.getMyOpportunities();
        if (res?.data && res.data.length > 0) {
          setOpportunities(res.data);
          if (!selectedOppId) {
            setSelectedOppId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      }
    };
    fetchOpps();
  }, []);

  // Fetch candidate pipeline for selected opportunity
  const fetchCandidates = async () => {
    if (!selectedOppId) return;
    setLoading(true);
    try {
      const res = await opportunityService.getCandidates(selectedOppId);
      if (res?.data) {
        setPipelineData(res.data);
      }
    } catch (err) {
      showToast('Error loading candidate pipeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOppId) {
      fetchCandidates();
    }
  }, [selectedOppId]);

  const handleStatusUpdate = async (applicationId, newStatus, extra = {}) => {
    try {
      const res = await applicationService.updateApplicationStatus(applicationId, {
        status: newStatus,
        ...extra,
      });
      if (res?.success) {
        showToast(`Candidate status updated to "${newStatus}"!`, 'success');
        fetchCandidates();
      }
    } catch (err) {
      showToast('Failed to update candidate status', 'error');
    }
  };

  const handleOpenInterviewModal = (cand) => {
    setInterviewCandidate(cand);
    setIsInterviewModalOpen(true);
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewCandidate) return;
    setScheduling(true);
    try {
      await handleStatusUpdate(interviewCandidate.applicationId, 'interview', {
        interviewSchedule: {
          date: new Date(interviewDate),
          meetingLink,
          notes: interviewNotes,
        },
        note: `Interview scheduled for ${new Date(interviewDate).toLocaleString()}`,
      });
      setIsInterviewModalOpen(false);
    } finally {
      setScheduling(false);
    }
  };

  const currentOpp = pipelineData?.opportunity || opportunities.find((o) => o._id === selectedOppId) || {};
  const candidates = pipelineData?.candidates || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              TALENT MATCHING MATRIX
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">RANKED BY COMPETENCY %</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Candidate Review & Pipeline</h1>
          <p className="text-sm text-[#64748B]">
            Automated ranking comparing applicant verified skill profiles, CGPA eligibility, and role criteria.
          </p>
        </div>

        {/* Opportunity Selector */}
        {opportunities.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap">Opportunity:</span>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF] max-w-xs truncate"
            >
              {opportunities.map((opp) => (
                <option key={opp._id} value={opp._id}>
                  {opp.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Opportunity Info Strip */}
      {currentOpp && currentOpp.title && (
        <div className="p-4 rounded-2xl bg-[#0052FF]/5 border border-[#0052FF]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-mono-label text-[10px] uppercase text-[#0052FF] font-bold">CURRENT ACTIVE PIPELINE</span>
            <h3 className="font-bold text-sm text-[#0F172A]">{currentOpp.title}</h3>
            <p className="text-[#64748B]">{currentOpp.domain} • {currentOpp.location} • {currentOpp.stipend}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white text-[#0F172A] border border-[#CBD5E1] font-mono-label text-xs">
              {candidates.length} Ranked Applicants
            </Badge>
          </div>
        </div>
      )}

      {/* Candidates List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <Users className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No candidates have applied yet</h3>
          <p className="text-xs text-[#64748B]">Share your opportunity across university placement cells to attract applicants.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((cand, idx) => {
            const student = cand.student || {};
            const matchScore = cand.matchScore || 85;
            const isTopMatch = matchScore >= 85;

            return (
              <Card
                key={cand.applicationId || idx}
                className="border-[#E2E8F0] hover:border-[#0052FF]/30 transition-all"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono-label uppercase text-[#0052FF] bg-[#0052FF]/10 px-2 py-0.5 rounded font-bold">
                          RANK #{idx + 1}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono-label">
                          CGPA: {cand.studentCgpa || student.profile?.cgpa || 8.8} • Year {cand.studentYear || student.year || 3}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono-label text-[#16A34A] border-[#16A34A]/30 bg-[#DCFCE7]"
                        >
                          {cand.eligibilityStatus || 'Eligible'}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-[#0F172A]">{student.name || 'Aarav Sharma'}</h3>
                      <p className="text-xs text-[#475569]">
                        {student.email} • {student.primaryDomain || 'Engineering & Technology'} ({student.subField || 'Computer Science'})
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="text-right">
                        <span
                          className={`text-sm font-extrabold font-mono-label px-3 py-1 rounded-full border ${
                            isTopMatch
                              ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                              : 'bg-[#EFF6FF] text-[#0052FF] border-[#BFDBFE]'
                          }`}
                        >
                          {matchScore}% Compatibility
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Alignment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-1">
                      <span className="font-semibold text-[#16A34A] text-[11px] block">
                        Verified Matched Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(cand.matchedSkills || []).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded bg-white text-[#15803D] border border-[#BBF7D0] font-medium"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
                      <span className="font-semibold text-[#D97706] text-[11px] block">
                        Missing or In-Progress Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(cand.missingSkills || []).length === 0 ? (
                          <span className="text-[10px] text-[#16A34A] italic">None (All requirements met!)</span>
                        ) : (
                          (cand.missingSkills || []).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] px-2 py-0.5 rounded bg-white text-[#B45309] border border-[#FCD34D]"
                            >
                              ! {s}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter preview */}
                  {cand.coverLetter && (
                    <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#F1F5F9] text-xs text-[#64748B]">
                      <span className="font-semibold text-[#0F172A] block text-[11px]">Candidate Statement:</span>
                      <p className="italic line-clamp-2">"{cand.coverLetter}"</p>
                    </div>
                  )}

                  {/* Actions & Pipeline Status */}
                  <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B] font-medium">Status:</span>
                      <Badge variant="secondary" className="capitalize font-mono-label">
                        {cand.status}
                      </Badge>
                      <a
                        href="https://skillsetu.in/vault/aarav-resume.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0052FF] hover:underline flex items-center gap-1 font-medium ml-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Verified Resume
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(cand.applicationId, 'shortlisted')}
                        disabled={cand.status === 'shortlisted' || cand.status === 'interview' || cand.status === 'selected'}
                        className="text-xs h-8"
                      >
                        Shortlist
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleOpenInterviewModal(cand)}
                        className="text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-8 gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Schedule Interview
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(cand.applicationId, 'selected')}
                        disabled={cand.status === 'selected'}
                        className="text-xs bg-[#16A34A] hover:bg-[#15803D] text-white h-8"
                      >
                        Offer Internship
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && interviewCandidate && (
        <Modal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          title={`Schedule Interview with ${interviewCandidate.student?.name || 'Candidate'}`}
        >
          <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Interview Date & Time:</label>
              <Input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Virtual Meeting Link (Google Meet / Teams):</label>
              <Input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Notes & Round Agenda:</label>
              <textarea
                rows={3}
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Technical architecture evaluation, system design discussion..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsInterviewModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={scheduling} className="bg-[#7C3AED] text-white">
                {scheduling ? 'Scheduling...' : 'Confirm & Dispatch Invite'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
