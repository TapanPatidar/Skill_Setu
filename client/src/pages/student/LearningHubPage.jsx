import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { learningService } from '../../services/learningService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { DOMAIN_TAXONOMY } from '../../lib/domains.js';

export const LearningHubPage = () => {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDomain) params.domain = selectedDomain;
      const res = await learningService.getPrograms(params);
      if (res?.data) {
        setPrograms(res.data);
      }
    } catch (err) {
      showToast('Error loading learning programs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedDomain]);

  const handleEnroll = async (id, title) => {
    setEnrollingId(id);
    try {
      const res = await learningService.enroll(id);
      if (res?.success) {
        showToast(`Successfully enrolled in "${title}"!`, 'success');
        fetchPrograms();
      }
    } catch (err) {
      showToast(err.message || 'Failed to enroll', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              CORPORATE CO-CREATED TRACKS
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">MICRO-CREDENTIALS</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Industry Learning Hub & Upskilling</h1>
          <p className="text-sm text-[#64748B]">
            Bridge your identified competency gaps through accredited syllabus modules co-authored by corporate partners.
          </p>
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#64748B]" />
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
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <BookOpen className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No learning programs found</h3>
          <p className="text-xs text-[#64748B]">Try selecting another domain or check back soon for newly published tracks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => {
            const isEnrolled = prog.isEnrolled;
            const progress = prog.progress || 0;

            return (
              <Card
                key={prog._id}
                className="border-[#E2E8F0] hover:border-[#0052FF]/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        {prog.domain}
                      </span>
                      {prog.isCertified && (
                        <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] text-[10px] font-mono-label gap-1">
                          <Award className="w-3 h-3" />
                          Certified
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug">{prog.title}</h3>
                    <p className="text-xs text-[#475569]">Offered by {prog.providerName || 'Industry Partner'}</p>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    {prog.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(prog.skillsCovered || []).map((sk) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Syllabus Preview */}
                  {prog.syllabus && prog.syllabus.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#F1F5F9] space-y-1 text-[11px]">
                      <span className="font-semibold text-[#0F172A] block text-xs">Curriculum Modules:</span>
                      {prog.syllabus.slice(0, 2).map((s) => (
                        <p key={s.week} className="text-[#64748B] truncate">
                          • W{s.week}: {s.topic}
                        </p>
                      ))}
                    </div>
                  )}

                  {isEnrolled && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono-label">
                        <span className="text-[#0052FF] font-semibold">Track Progress</span>
                        <span className="text-[#0F172A] font-bold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>{prog.durationWeeks || 8} Weeks • {prog.mode || 'Online'}</span>

                    {isEnrolled ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Continue Learning
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={enrollingId === prog._id}
                        onClick={() => handleEnroll(prog._id, prog.title)}
                        className="text-xs bg-[#0052FF] text-white gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {enrollingId === prog._id ? 'Enrolling...' : 'Enroll Track'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
