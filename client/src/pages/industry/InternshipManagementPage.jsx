import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Star,
  Award,
  Calendar,
  UserCheck,
  Send,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { internshipService } from '../../services/internshipService.js';
import { useToast } from '../../context/ToastContext.jsx';

export const InternshipManagementPage = () => {
  const { showToast } = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackRemarks, setFeedbackRemarks] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Completion Modal
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [finalGrade, setFinalGrade] = useState('Outstanding (A+)');
  const [issuingCert, setIssuingCert] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await internshipService.getMyInternships();
      if (res?.data) {
        setInternships(res.data);
      }
    } catch (err) {
      showToast('Error loading active internships', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const currentInternship = internships[0];

  const handleVerifyWeeklyLog = (weekNum) => {
    if (currentInternship && currentInternship.weeklyLogs) {
      const log = currentInternship.weeklyLogs.find((l) => l.weekNumber === weekNum);
      if (log) {
        log.mentorVerified = true;
        showToast(`Week ${weekNum} log signed off and verified!`, 'success');
        setInternships([...internships]);
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!currentInternship) return;
    setSubmittingFeedback(true);
    try {
      const res = await internshipService.postFeedback(currentInternship._id, {
        rating: feedbackRating,
        remarks: feedbackRemarks,
      });
      if (res?.success) {
        showToast('Mentor evaluation recorded successfully!', 'success');
        setIsFeedbackModalOpen(false);
        setFeedbackRemarks('');
        fetchInternships();
      }
    } catch (err) {
      showToast('Failed to submit evaluation', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!currentInternship) return;
    setIssuingCert(true);
    try {
      const res = await internshipService.completeInternship(currentInternship._id, {
        finalGrade,
      });
      if (res?.success) {
        showToast('Internship successfully completed and digital certificate issued!', 'success');
        setIsCompleteModalOpen(false);
        fetchInternships();
      }
    } catch (err) {
      showToast('Failed to issue certificate', 'error');
    } finally {
      setIssuingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!currentInternship) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3 max-w-xl mx-auto my-12">
        <UserCheck className="w-12 h-12 text-[#94A3B8] mx-auto" />
        <h3 className="text-base font-semibold text-[#0F172A]">No Active Interns Under Supervision</h3>
        <p className="text-xs text-[#64748B]">When you offer positions to shortlisted candidates, they will appear here for progress oversight.</p>
      </div>
    );
  }

  const student = currentInternship.student || {};
  const opp = currentInternship.opportunity || {};
  const milestones = currentInternship.milestones || [];
  const weeklyLogs = currentInternship.weeklyLogs || [];
  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;
  const isCompleted = currentInternship.status === 'completed';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 font-mono-label text-xs">
              MENTOR SUPERVISION CONSOLE
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">MOU-VERIFIED PROGRAM</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Active Internship Management</h1>
          <p className="text-sm text-[#64748B]">
            Review student weekly log books, sign off on hours, evaluate milestone PRs, and issue verified completion credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsFeedbackModalOpen(true)}
            variant="outline"
            className="text-xs gap-1.5"
          >
            <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
            Add Mentor Feedback
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCompleteModalOpen(true)}
            disabled={isCompleted}
            className="text-xs bg-[#16A34A] hover:bg-[#15803D] text-white gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            {isCompleted ? 'Certificate Issued' : 'Finalize & Issue Certificate'}
          </Button>
        </div>
      </div>

      {/* Intern Snapshot Card */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-label uppercase text-[#0052FF] bg-[#0052FF]/10 px-2 py-0.5 rounded font-bold">
                ACTIVE APPRENTICE
              </span>
              <h3 className="text-lg font-bold text-[#0F172A]">{student.name || 'Aarav Sharma'}</h3>
              <p className="text-xs text-[#475569]">
                {opp.title} • {student.email} • {student.institution?.name || 'NIT Delhi'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#64748B] block font-mono-label">MILESTONE PROGRESS</span>
              <span className="text-xl font-bold text-[#0052FF] font-mono-label">
                {completedMilestones}/{milestones.length} ({progressPercent}%)
              </span>
            </div>
          </div>

          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Weekly Logs Requiring Sign-off */}
      <Card className="border-[#E2E8F0]">
        <CardHeader className="border-b border-[#F1F5F9] pb-3">
          <CardTitle className="text-base font-semibold text-[#0F172A]">
            Student Weekly Progress Logs
          </CardTitle>
          <CardDescription className="text-xs text-[#64748B]">
            Audit logged tasks and confirm verified hours
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {weeklyLogs.map((log) => (
            <div
              key={log.weekNumber}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    Week {log.weekNumber}
                  </span>
                  <span className="text-xs text-[#64748B]">({log.hoursLogged} Hours logged)</span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">{log.summary}</p>

                {log.tasksCompleted && log.tasksCompleted.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.tasksCompleted.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-white text-[#475569] border border-[#E2E8F0]"
                      >
                        • {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0">
                {log.mentorVerified ? (
                  <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 text-xs font-mono-label">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified by You
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleVerifyWeeklyLog(log.weekNumber)}
                    className="text-xs bg-[#0052FF] text-white"
                  >
                    Sign Off & Verify Hours
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deliverable Milestones Review */}
      <Card className="border-[#E2E8F0]">
        <CardHeader className="border-b border-[#F1F5F9] pb-3">
          <CardTitle className="text-base font-semibold text-[#0F172A]">
            Milestones & Deliverable PRs
          </CardTitle>
          <CardDescription className="text-xs text-[#64748B]">
            Jointly monitored with Faculty Supervisor
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-[#0F172A]">{m.title}</span>
                <p className="text-[#64748B]">{m.description}</p>
                {m.deliverableUrl && (
                  <a
                    href={m.deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0052FF] hover:underline flex items-center gap-1 pt-0.5 font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Inspect Pull Request / Repository
                  </a>
                )}
              </div>

              <Badge
                variant={m.status === 'completed' ? 'default' : 'secondary'}
                className="font-mono-label self-start sm:self-auto"
              >
                {m.status?.toUpperCase()}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mentor Feedback Modal */}
      {isFeedbackModalOpen && (
        <Modal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          title="Submit Mentor Performance Evaluation"
        >
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Star Rating (1 to 5):</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-[#F59E0B] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= feedbackRating ? 'fill-current' : 'text-[#CBD5E1]'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-sm text-[#0F172A] ml-2">{feedbackRating} / 5 Stars</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Formal Mentor Remarks:</label>
              <textarea
                rows={4}
                value={feedbackRemarks}
                onChange={(e) => setFeedbackRemarks(e.target.value)}
                required
                placeholder="Aarav demonstrated exemplary code quality, rigorous adherence to design guidelines, and excellent communication in sprint reviews..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFeedbackModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingFeedback} className="bg-[#0052FF] text-white">
                {submittingFeedback ? 'Recording...' : 'Record Feedback'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Completion & Certificate Modal */}
      {isCompleteModalOpen && (
        <Modal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          title="Sign-Off & Issue Verifiable Internship Certificate"
        >
          <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D]">
              <span className="font-bold block text-sm">Formal Internship Completion Protocol</span>
              <p className="mt-1 leading-relaxed">
                Issuing this credential records a cryptographically signed completion certificate on SkillSetu, verifiable by institutional registrars and NAAC auditors.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Final Performance Grade:</label>
              <select
                value={finalGrade}
                onChange={(e) => setFinalGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
              >
                <option value="Outstanding (A+)">Outstanding (A+)</option>
                <option value="Excellent (A)">Excellent (A)</option>
                <option value="Very Good (B+)">Very Good (B+)</option>
                <option value="Good (B)">Good (B)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCompleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={issuingCert} className="bg-[#16A34A] text-white">
                {issuingCert ? 'Issuing...' : 'Confirm & Issue Certificate'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
