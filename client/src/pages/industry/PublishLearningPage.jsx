import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Award,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { learningService } from '../../services/learningService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { DOMAIN_TAXONOMY } from '../../lib/domains.js';

export const PublishLearningPage = () => {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Program Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Engineering & Technology');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('8');
  const [skillsText, setSkillsText] = useState('Docker, Kubernetes, CI/CD pipelines');
  const [syllabusText, setSyllabusText] = useState('Container Architecture\nPod Orchestration\nIngress & Service Meshes\nProduction GitOps');
  const [publishing, setPublishing] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await learningService.getPrograms();
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
  }, []);

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const skillsCovered = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
      const syllabusLines = syllabusText.split('\n').filter(Boolean);
      const syllabus = syllabusLines.map((line, idx) => ({
        week: idx + 1,
        topic: line,
      }));

      const payload = {
        title,
        domain,
        description,
        durationWeeks: Number(durationWeeks) || 8,
        skillsCovered,
        syllabus,
        isCertified: true,
      };

      const res = await learningService.createProgram(payload);
      if (res?.success) {
        showToast('Learning Track published to all university students!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        fetchPrograms();
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish learning track', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              INDUSTRY CO-CREATION
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">ACCELERATED TALENT PIPELINE</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Co-Created Learning Tracks</h1>
          <p className="text-sm text-[#64748B]">
            Publish corporate syllabi to train talent on exact tech stacks and business skills before hiring.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0052FF] text-white text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Publish Learning Track
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <GraduationCap className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No learning programs published yet</h3>
          <p className="text-xs text-[#64748B]">Publish industry modules to bridge students' competency gaps.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => (
            <Card key={prog._id} className="border-[#E2E8F0] flex flex-col justify-between">
              <CardContent className="p-5 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      {prog.domain}
                    </span>
                    <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] text-[10px] font-mono-label gap-1">
                      <Award className="w-3 h-3" />
                      Certified Track
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{prog.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">{prog.description}</p>
                </div>

                {prog.skillsCovered && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {prog.skillsCovered.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                  <span>{prog.durationWeeks || 8} Weeks • Self-paced</span>
                  <div className="flex items-center gap-1 font-semibold text-[#0052FF]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{prog.enrolledCount || 128} Students Enrolled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Publish Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publish Corporate Co-Created Track"
        >
          <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Track Title:</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Production Cloud Engineering with Kubernetes"
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Academic Domain:</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
                >
                  {Object.keys(DOMAIN_TAXONOMY).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Duration (Weeks):</label>
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Overview / Learning Outcomes:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Target skills, prerequisites, and project capstone..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Skills Covered (comma-separated):</label>
              <Input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Docker, Kubernetes, Helm, ArgoCD"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Weekly Topics (One per line):</label>
              <textarea
                rows={4}
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={publishing} className="bg-[#0052FF] text-white">
                {publishing ? 'Publishing...' : 'Publish Track'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
