import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { opportunityService } from '../../services/opportunityService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { DOMAIN_TAXONOMY } from '../../lib/domains.js';

export const ManageJobsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Modal
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('internship');
  const [domain, setDomain] = useState('Engineering & Technology');
  const [subField, setSubField] = useState('Computer Science & IT');
  const [sector, setSector] = useState('Information Technology & Cloud Infrastructure');
  const [description, setDescription] = useState('');
  const [workMode, setWorkMode] = useState('hybrid');
  const [location, setLocation] = useState('Bengaluru (Hybrid)');
  const [stipend, setStipend] = useState('₹35,000 / month');
  const [duration, setDuration] = useState('6 Months');
  const [positions, setPositions] = useState('2');
  const [skillsText, setSkillsText] = useState('React, Node.js, SQL, Git');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [degreesText, setDegreesText] = useState('B.Tech, B.E., MCA');
  const [posting, setPosting] = useState(false);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const res = await opportunityService.getMyOpportunities();
      if (res?.data) {
        setOpportunities(res.data);
      }
    } catch (err) {
      showToast('Error loading company opportunities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleDomainChange = (e) => {
    const d = e.target.value;
    setDomain(d);
    const subFields = DOMAIN_TAXONOMY[d]?.subFields || [];
    if (subFields.length > 0) setSubField(subFields[0].name);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const requiredSkills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
      const degree = degreesText.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        title,
        type,
        domain,
        subField,
        sector,
        description,
        workMode,
        location,
        stipend,
        duration,
        positions: Number(positions) || 1,
        requiredSkills,
        eligibility: {
          degree,
          minCgpa: Number(minCgpa) || 7.0,
          allowedYears: [3, 4],
        },
      };

      const res = await opportunityService.createOpportunity(payload);
      if (res?.success) {
        showToast('Opportunity published and opened for student applications!', 'success');
        setIsPostModalOpen(false);
        fetchOpps();
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish opportunity', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              RECRUITER SUITE
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">TALENT ACQUISITION</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Manage Posted Opportunities</h1>
          <p className="text-sm text-[#64748B]">
            Create and track job and internship postings across all 11 higher education domains with automated candidate ranking.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsPostModalOpen(true)}
          className="bg-[#0052FF] text-white text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Post New Opportunity
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <Briefcase className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No active opportunities posted</h3>
          <p className="text-xs text-[#64748B]">Publish your first internship or job to start receiving ranked applicants.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <Card key={opp._id} className="border-[#E2E8F0] hover:border-[#0052FF]/30 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      {opp.domain}
                    </span>
                    <span className="text-[10px] text-[#64748B] capitalize">
                      {opp.type} • {opp.workMode}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono-label ${
                        opp.status === 'open'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {opp.status?.toUpperCase() || 'OPEN'}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A]">{opp.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-1">{opp.description}</p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] pt-1">
                    <span className="font-semibold text-[#0F172A]">{opp.stipend || 'Competitive'}</span>
                    <span>•</span>
                    <span>{opp.duration || '6 Months'}</span>
                    <span>•</span>
                    <span>{opp.location}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#0052FF] font-mono-label">
                      {opp.applicantsCount || 14} Candidates
                    </span>
                    <span className="text-[10px] text-[#64748B] block">in review pipeline</span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate(`/dashboard/pipeline?oppId=${opp._id}`)}
                    className="text-xs bg-[#0052FF] text-white gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Review Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Post Opportunity Modal */}
      {isPostModalOpen && (
        <Modal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          title="Publish New Job or Internship Drive"
        >
          <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Role Title:</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cloud & Microservices Engineering Intern"
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Opportunity Type:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
                >
                  <option value="internship">Internship</option>
                  <option value="job">Full-time Job</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Academic Domain:</label>
                <select
                  value={domain}
                  onChange={handleDomainChange}
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
                <label className="font-semibold text-[#0F172A] block">Specialization / SubField:</label>
                <select
                  value={subField}
                  onChange={(e) => setSubField(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
                >
                  {(DOMAIN_TAXONOMY[domain]?.subFields || []).map((sf) => (
                    <option key={sf.name} value={sf.name}>
                      {sf.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Job Description & Responsibilities:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key deliverables, tech stack, team focus..."
                required
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Work Mode:</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
                >
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On-Site</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Location:</label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Gurgaon"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Stipend / Package:</label>
                <Input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. ₹35,000 / month"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">
                  Required Competencies / Skills (comma-separated):
                </label>
                <Input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="React, Node.js, SQL, Docker"
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Allowed Degrees / Disciplines:</label>
                <Input
                  type="text"
                  value={degreesText}
                  onChange={(e) => setDegreesText(e.target.value)}
                  placeholder="B.Tech, MCA, M.Tech"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPostModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={posting} className="bg-[#0052FF] text-white">
                {posting ? 'Publishing...' : 'Publish Opportunity'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
