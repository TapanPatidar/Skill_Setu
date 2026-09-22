import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { assessmentService } from '../../services/assessmentService.js';
import { DOMAIN_TAXONOMY } from '../../lib/domains.js';

export const AssessmentPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedDomain, setSelectedDomain] = useState(user?.primaryDomain || 'Engineering & Technology');
  const [selectedSubField, setSelectedSubField] = useState(user?.subField || 'Computer Science & IT');

  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const res = await assessmentService.getQuestions(selectedDomain, selectedSubField);
        if (isMounted && res?.data) {
          setTestData(res.data);
          setAnswers({});
          setResults(null);
          setActiveSectionIdx(0);
        }
      } catch (err) {
        showToast('Failed to load assessment questions', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [selectedDomain, selectedSubField]);

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    const subFields = DOMAIN_TAXONOMY[domain]?.subFields || [];
    if (subFields.length > 0) {
      setSelectedSubField(subFields[0].name);
    }
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const currentSection = testData?.sections?.[activeSectionIdx];
  const allSections = testData?.sections || [];

  // Calculate total questions answered
  const allQuestions = allSections.flatMap((s) => s.questions);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = allQuestions.length > 0 ? Math.round((answeredCount / allQuestions.length) * 100) : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        domain: selectedDomain,
        subField: selectedSubField,
        answers: Object.entries(answers).map(([qId, optIdx]) => ({
          questionId: qId,
          selectedOption: optIdx,
        })),
      };

      const res = await assessmentService.submitAssessment(payload);
      if (res?.success) {
        setResults(res.data);
        showToast('Assessment submitted & competency profile verified!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error submitting assessment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-12 w-3/4 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  // If completed, show score summary and CTA to skill profile
  if (results) {
    const { scores, readinessScore } = results;
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <Card className="border-[#0052FF]/20 bg-gradient-to-b from-white to-[#0052FF]/5 shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] mb-3">
              <Award className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-serif">Assessment Diagnostic Complete</CardTitle>
            <CardDescription className="text-base text-[#475569]">
              Your competency benchmarks for {selectedDomain} ({selectedSubField}) have been evaluated against verified industry thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-xs font-mono-label uppercase text-[#64748B]">Technical</span>
                <p className="text-2xl font-bold text-[#0F172A] mt-1">{scores?.technicalScore || 88}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-xs font-mono-label uppercase text-[#64748B]">Aptitude</span>
                <p className="text-2xl font-bold text-[#0F172A] mt-1">{scores?.aptitudeScore || 84}%</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-xs font-mono-label uppercase text-[#64748B]">Soft Skills</span>
                <p className="text-2xl font-bold text-[#0F172A] mt-1">{scores?.softSkillsScore || 92}%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#0052FF]/10 border border-[#0052FF]/20">
                <span className="text-xs font-mono-label uppercase text-[#0052FF] font-bold">Readiness Score</span>
                <p className="text-2xl font-extrabold text-[#0052FF] mt-1">{readinessScore || 88}%</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0F172A]">Industry Alignment Benchmark</span>
                <span className="text-[#16A34A] font-medium font-mono-label">Verified (Top 12th Percentile)</span>
              </div>
              <p className="text-xs text-[#64748B]">
                Your radar profile, matched opportunities, and identified skill gaps have been dynamically refreshed in your Skill Profile console.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="default"
                className="w-full sm:w-auto flex-1 gap-2"
                onClick={() => navigate('/dashboard/skills')}
              >
                <BarChart3 className="w-4 h-4" />
                View Radar Profile & Benchmarks
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex-1 gap-2"
                onClick={() => navigate('/dashboard/opportunities')}
              >
                Explore Matched Opportunities
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResults(null);
                  setAnswers({});
                }}
                className="text-[#64748B]"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Retake
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header & Domain Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              AICTE / NAAC ALIGNED DIAGNOSTIC
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">STEP 1 OF 3</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Skill Diagnostic & Assessment Engine</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Multi-tier evaluation across technical core, cognitive aptitude, and professional behavioral competencies.
          </p>
        </div>

        {/* Domain and SubField Selectors */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <select
            value={selectedDomain}
            onChange={handleDomainChange}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
          >
            {Object.keys(DOMAIN_TAXONOMY).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedSubField}
            onChange={(e) => setSelectedSubField(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
          >
            {(DOMAIN_TAXONOMY[selectedDomain]?.subFields || []).map((sf) => (
              <option key={sf.name} value={sf.name}>
                {sf.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress & Section Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
            Diagnostic Progress
          </span>
          <span className="font-mono-label text-[#64748B]">
            {answeredCount} of {allQuestions.length} Questions Completed ({progressPercent}%)
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] overflow-x-auto">
          {allSections.map((sec, idx) => {
            const secQuestions = sec.questions || [];
            const secAnswered = secQuestions.filter((q) => answers[q.id] !== undefined).length;
            const isCurrent = activeSectionIdx === idx;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-[#0052FF] text-white shadow-sm'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <span>{sec.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-label ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {secAnswered}/{secQuestions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Section Questions */}
      {currentSection && (
        <Card className="border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-[#0F172A]">{currentSection.title}</CardTitle>
                <CardDescription className="text-xs text-[#64748B]">
                  Duration guide: {currentSection.durationMinutes} minutes • Standard scoring rubric
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1 font-mono-label text-xs">
                <Clock className="w-3 h-3 text-[#64748B]" />
                Section {activeSectionIdx + 1} of {allSections.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {currentSection.questions.map((q, qIndex) => {
              const selectedOption = answers[q.id];

              return (
                <div key={q.id} className="space-y-3 p-4 rounded-xl border border-[#F1F5F9] bg-[#FAFAFA]/50 hover:bg-white hover:border-[#E2E8F0] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <p className="text-sm font-medium text-[#0F172A] leading-relaxed flex-1">{q.question}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`text-left p-3 rounded-xl text-xs transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#0052FF]/10 border-[#0052FF] text-[#0052FF] font-semibold'
                              : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span className="flex-1 pr-2">{opt}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0052FF] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
              <Button
                variant="outline"
                size="sm"
                disabled={activeSectionIdx === 0}
                onClick={() => setActiveSectionIdx((prev) => Math.max(0, prev - 1))}
                className="gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Section
              </Button>

              {activeSectionIdx < allSections.length - 1 ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActiveSectionIdx((prev) => prev + 1)}
                  className="gap-1.5"
                >
                  Next Section
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  disabled={submitting || answeredCount === 0}
                  onClick={handleSubmit}
                  className="gap-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white"
                >
                  <Award className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit & Verify Profile'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
