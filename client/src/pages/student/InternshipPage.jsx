import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  Star,
  ExternalLink,
  Plus,
  Building2,
  UserCheck,
  FileCheck,
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

export const InternshipPage = () => {
  const { showToast } = useToast();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // New weekly log modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logSummary, setLogSummary] = useState('');
  const [hoursLogged, setHoursLogged] = useState('40');
  const [tasksText, setTasksText] = useState('');
  const [submittingLog, setSubmittingLog] = useState(false);

  const fetchInternship = async () => {
    setLoading(true);
    try {
      const res = await internshipService.getMyInternships();
      if (res?.data) {
        setInternships(res.data);
      }
    } catch (err) {
      showToast('Error loading internship record', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternship();
  }, []);

  const currentInternship = internships[0];

  const handleWeeklyLogSubmit = async (e) => {
    e.preventDefault();
    if (!currentInternship) return;
    setSubmittingLog(true);
    try {
      const tasks = tasksText.split('\n').filter((t) => t.trim().length > 0);
      const payload = {
        weeklyLog: {
          summary: logSummary,
          hoursLogged: Number(hoursLogged) || 40,
          tasksCompleted: tasks,
        },
      };

      const res = await internshipService.updateProgress(payload);
      if (res?.success) {
        showToast('Weekly progress log submitted for mentor verification!', 'success');
        setIsLogModalOpen(false);
        setLogSummary('');
        setTasksText('');
        fetchInternship();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit log', 'error');
    } finally {
      setSubmittingLog(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!currentInternship) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3 max-w-xl mx-auto my-12">
        <Briefcase className="w-12 h-12 text-[#94A3B8] mx-auto" />
        <h3 className="text-base font-semibold text-[#0F172A]">No Active Internship Assigned</h3>
        <p className="text-xs text-[#64748B]">
          Once your application is selected and an industry supervisor is provisioned, your live milestone tracker and weekly log book will appear here.
        </p>
      </div>
    );
  }

  const opp = currentInternship.opportunity || {};
  const milestones = currentInternship.milestones || [];
  const weeklyLogs = currentInternship.weeklyLogs || [];
  const feedbackList = currentInternship.mentorFeedback || [];

  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Internship Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 font-mono-label text-xs">
              ACTIVE INDUSTRY APPRENTICESHIP
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">MOU CODE: MOU-NEXGEN-01</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">{opp.title || 'Full-Stack Engineering Intern'}</h1>
          <p className="text-sm text-[#64748B] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0052FF]" />
            <span>{opp.companyName || 'Corporate Partner'}</span>
            <span>•</span>
            <UserCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Mentor: Vikramaditya Singhania</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => setIsLogModalOpen(true)}
            className="bg-[#0052FF] text-white text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Weekly Log
          </Button>
        </div>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#E2E8F0] p-4">
          <span className="text-xs font-mono-label text-[#64748B] uppercase">Milestones Completed</span>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">
            {completedMilestones} / {milestones.length}
          </p>
          <Progress value={milestoneProgress} className="h-1.5 mt-2" />
        </Card>

        <Card className="border-[#E2E8F0] p-4">
          <span className="text-xs font-mono-label text-[#64748B] uppercase">Total Hours Logged</span>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">
            {weeklyLogs.reduce((acc, l) => acc + (l.hoursLogged || 0), 0)} Hours
          </p>
          <span className="text-xs text-[#16A34A] font-medium">All weeks verified by mentor</span>
        </Card>

        <Card className="border-[#E2E8F0] p-4">
          <span className="text-xs font-mono-label text-[#64748B] uppercase">Mentor Performance Rating</span>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-2xl font-bold text-[#0F172A]">5.0</p>
            <div className="flex text-[#F59E0B] ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
          <span className="text-xs text-[#64748B]">Outstanding standing</span>
        </Card>
      </div>

      {/* Structured Milestones List */}
      <Card className="border-[#E2E8F0]">
        <CardHeader className="border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-[#0F172A]">
                Structured Internship Milestones
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Deliverables evaluated jointly by Industry Mentor and Faculty Supervisor
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono-label text-xs">
              {milestoneProgress}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {milestones.map((m, idx) => {
            const isDone = m.status === 'completed';
            const isOngoing = m.status === 'in-progress';

            return (
              <div
                key={m._id || idx}
                className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#0052FF]">M{idx + 1}</span>
                    <h4 className="text-sm font-bold text-[#0F172A]">{m.title}</h4>
                  </div>
                  <p className="text-xs text-[#64748B]">{m.description}</p>
                  {m.deliverableUrl && (
                    <a
                      href={m.deliverableUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0052FF] hover:underline flex items-center gap-1 pt-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Deliverable PR / Code Repository
                    </a>
                  )}
                </div>

                <div className="shrink-0">
                  {isDone && (
                    <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 font-mono-label text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </Badge>
                  )}
                  {isOngoing && (
                    <Badge className="bg-[#EFF6FF] text-[#0052FF] border-[#BFDBFE] font-mono-label text-xs">
                      In Progress
                    </Badge>
                  )}
                  {!isDone && !isOngoing && (
                    <Badge variant="secondary" className="font-mono-label text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weekly Logs & Mentor Sign-Off */}
      <Card className="border-[#E2E8F0]">
        <CardHeader className="border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-[#0F172A]">
                Weekly Progress Logs & Supervisor Sign-Off
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Submitted weekly reports verified by corporate and academic mentors
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLogModalOpen(true)}
              className="text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Week
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {weeklyLogs.map((log) => (
            <div
              key={log.weekNumber}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    Week {log.weekNumber}
                  </span>
                  <span className="text-xs text-[#64748B]">({log.hoursLogged} Hours logged)</span>
                </div>

                {log.mentorVerified ? (
                  <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 text-[11px] font-mono-label">
                    <CheckCircle2 className="w-3 h-3" />
                    Mentor Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[11px] font-mono-label">
                    Pending Sign-Off
                  </Badge>
                )}
              </div>

              <p className="text-xs text-[#334155] leading-relaxed">{log.summary}</p>

              {log.tasksCompleted && log.tasksCompleted.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
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
          ))}
        </CardContent>
      </Card>

      {/* Mentor Feedback Card */}
      {feedbackList.length > 0 && (
        <Card className="border-[#E2E8F0] bg-[#F8FAFC]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
              Official Industry Mentor Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 space-y-2 text-xs">
            {feedbackList.map((fb, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">{fb.author} ({fb.role})</span>
                  <div className="flex text-[#F59E0B]">
                    {[...Array(fb.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[#475569] italic">"{fb.remarks}"</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weekly Log Submission Modal */}
      {isLogModalOpen && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Submit Weekly Progress Log"
        >
          <form onSubmit={handleWeeklyLogSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Hours Logged This Week:</label>
              <Input
                type="number"
                min="1"
                max="80"
                value={hoursLogged}
                onChange={(e) => setHoursLogged(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Summary of Work Accomplished:</label>
              <textarea
                rows={3}
                value={logSummary}
                onChange={(e) => setLogSummary(e.target.value)}
                required
                placeholder="Key architecture updates, test cases executed, client meetings attended..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">
                Tasks Completed (One per line):
              </label>
              <textarea
                rows={3}
                value={tasksText}
                onChange={(e) => setTasksText(e.target.value)}
                placeholder="Implemented token refresh&#10;Wrote 12 Jest test suites&#10;Deployed staging build"
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingLog} className="bg-[#0052FF] text-white">
                {submittingLog ? 'Submitting...' : 'Submit to Mentor'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
