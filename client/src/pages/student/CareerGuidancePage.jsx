import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { skillsService } from '../../services/skillsService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const CareerGuidancePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchGuidance = async () => {
      setLoading(true);
      try {
        const res = await skillsService.getRecommendations();
        if (isMounted && res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGuidance();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6">
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const targetRoles = data?.targetRoles || [];
  const careerPath = data?.careerPath || { milestones: [] };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              AICTE / SMART AUTOMATION GUIDANCE
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">ADAPTIVE CAREER ENGINE</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Adaptive Career Guidance & Pathways</h1>
          <p className="text-sm text-[#64748B]">
            Automated career mapping matching your academic major, verified competencies, and adjacent market opportunities.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate('/dashboard/opportunities')}
          className="gap-2 bg-[#0052FF] text-white"
        >
          <Briefcase className="w-4 h-4" />
          View Matched Openings
        </Button>
      </div>

      {/* Target Roles & Adjacent Mobility */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0052FF]" />
            Ranked Career Pathways & Adjacent Mobility
          </h2>
          <span className="text-xs text-[#64748B] font-mono-label">Ranked by Compatibility %</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targetRoles.map((r, idx) => (
            <Card
              key={r.role}
              className={`border transition-all hover:shadow-md ${
                r.isAdjacent ? 'bg-[#F8FAFC] border-[#CBD5E1]' : 'bg-white border-[#E2E8F0]'
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {r.isAdjacent && (
                      <span className="text-[10px] font-mono-label uppercase font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-full border border-[#DDD6FE] mb-1 inline-block">
                        Adjacent Domain Opportunity
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#0F172A]">{r.role}</h3>
                    <p className="text-xs text-[#64748B]">{r.domain} • {r.subField}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#0052FF] font-mono-label">
                      {r.matchPercentage}%
                    </span>
                    <span className="text-[10px] text-[#64748B] block">Fit Score</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Missing Requirements:</span>
                    <span className="font-mono-label text-[#0F172A]">
                      {r.missingSkills.length === 0 ? 'Fully Qualified' : `${r.missingSkills.length} skills to bridge`}
                    </span>
                  </div>

                  {r.missingSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.missingSkills.map((ms) => (
                        <span
                          key={ms}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-medium border border-[#FDE68A]"
                        >
                          + {ms}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#0052FF] hover:bg-[#0052FF]/10 gap-1"
                    onClick={() => navigate('/dashboard/opportunities')}
                  >
                    Explore Job Openings
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Step-by-Step Career Milestones Progression */}
      <Card className="border-[#E2E8F0]">
        <CardHeader className="border-b border-[#F1F5F9] pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0052FF]" />
                Your Recommended Progression Roadmap
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Curated milestones from diagnostic calibration to verified corporate placement
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono-label text-xs">
              Target: {careerPath.targetRole || 'Full-Stack Software Engineer'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
            {careerPath.milestones.map((m) => {
              const isCompleted = m.status === 'completed';
              const isInProgress = m.status === 'in-progress';

              return (
                <div key={m.step} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                      isCompleted
                        ? 'bg-[#16A34A] text-white ring-4 ring-[#DCFCE7]'
                        : isInProgress
                        ? 'bg-[#0052FF] text-white ring-4 ring-[#DBEAFE]'
                        : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : m.step}
                  </div>

                  <div className="flex-1 bg-[#FAFAFA] p-4 rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-[#0F172A]">{m.title}</h4>
                      <span className="text-xs text-[#64748B] capitalize">
                        Status: <span className={isInProgress ? 'text-[#0052FF] font-medium' : isCompleted ? 'text-[#16A34A] font-medium' : ''}>{m.status}</span>
                      </span>
                    </div>

                    {isCompleted && (
                      <Badge variant="outline" className="text-xs text-[#16A34A] border-[#16A34A]/30 font-mono-label self-start sm:self-auto">
                        COMPLETED
                      </Badge>
                    )}
                    {isInProgress && (
                      <Badge variant="default" className="text-xs bg-[#0052FF] text-white font-mono-label self-start sm:self-auto">
                        ACTIVE IN PROGRESS
                      </Badge>
                    )}
                    {!isCompleted && !isInProgress && (
                      <Badge variant="secondary" className="text-xs font-mono-label self-start sm:self-auto">
                        UPCOMING
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
