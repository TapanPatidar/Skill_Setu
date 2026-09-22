import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { applicationService } from '../../services/applicationService.js';
import { useToast } from '../../context/ToastContext.jsx';

export const ApplicationsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchApps = async () => {
      setLoading(true);
      try {
        const res = await applicationService.getMyApplications();
        if (isMounted && res?.data) {
          setApplications(res.data);
        }
      } catch (err) {
        showToast('Error loading application tracker', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApps();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selected':
        return <Badge className="bg-[#16A34A] text-white">Selected / Offered</Badge>;
      case 'interview':
        return <Badge className="bg-[#7C3AED] text-white">Interview Scheduled</Badge>;
      case 'shortlisted':
        return <Badge className="bg-[#0052FF] text-white">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      case 'applied':
      default:
        return <Badge variant="secondary">Applied (Under Review)</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              LIFECYCLE TRACKER
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">{applications.length} ACTIVE APPLICATIONS</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">My Applications & Interview Schedule</h1>
          <p className="text-sm text-[#64748B]">
            Real-time stage tracking, recruiter interview links, and historical feedback for your submitted roles.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate('/dashboard/opportunities')}
          className="text-xs bg-[#0052FF] text-white gap-1.5"
        >
          <Building2 className="w-4 h-4" />
          Browse More Roles
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <Send className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No applications found</h3>
          <p className="text-xs text-[#64748B]">Explore verified industry internships and apply directly with one click.</p>
          <Button
            size="sm"
            onClick={() => navigate('/dashboard/opportunities')}
            className="mt-2 bg-[#0052FF] text-white text-xs"
          >
            Explore Opportunities
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const opp = app.opportunity || {};
            const history = app.statusHistory || [];
            const interview = app.interviewSchedule;

            return (
              <Card key={app._id} className="border-[#E2E8F0] overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                          {opp.domain || 'Engineering & Technology'}
                        </span>
                        <span className="text-[10px] text-[#64748B] capitalize">{opp.workMode || 'Hybrid'}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A]">{opp.title || 'Software Engineering Intern'}</h3>
                      <p className="text-xs text-[#475569]">{opp.companyName || 'Corporate Partner'} • Applied {new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>

                    <div className="shrink-0">{getStatusBadge(app.status)}</div>
                  </div>

                  {/* Interview Schedule Callout if interview status */}
                  {interview && interview.meetingLink && (
                    <div className="p-3.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#6D28D9] flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-[#7C3AED]" />
                          Upcoming Interview Round
                        </span>
                        <p className="text-[#4C1D95]">
                          Date & Time: {new Date(interview.date).toLocaleString()}
                        </p>
                        {interview.notes && (
                          <p className="text-[#6D28D9] text-[11px] italic">Note: {interview.notes}</p>
                        )}
                      </div>

                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white font-medium hover:bg-[#6D28D9] transition-all flex items-center gap-1 shrink-0"
                      >
                        Join Meeting Link
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Status Timeline History */}
                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <span className="text-xs font-semibold text-[#0F172A] mb-2 block">Application Timeline:</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {history.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                            <span className="capitalize font-medium text-[#334155]">{step.status}</span>
                            <span className="text-[10px] text-[#94A3B8] font-mono-label">
                              ({new Date(step.changedAt).toLocaleDateString()})
                            </span>
                          </div>
                          {idx < history.length - 1 && (
                            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
