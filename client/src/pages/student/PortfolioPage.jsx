import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  Award,
  CheckCircle2,
  Trash2,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { portfolioService } from '../../services/portfolioService.js';
import { useToast } from '../../context/ToastContext.jsx';

export const PortfolioPage = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Project');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await portfolioService.getMyPortfolio();
      if (res?.data) {
        setItems(res.data);
      }
    } catch (err) {
      showToast('Error loading portfolio items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        title,
        category,
        description,
        githubUrl: githubUrl || undefined,
        externalLink: externalLink || undefined,
        skills,
        tags: skills,
      };

      const res = await portfolioService.addPortfolioItem(payload);
      if (res?.success) {
        showToast('Portfolio item added successfully!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setGithubUrl('');
        setExternalLink('');
        setSkillsText('');
        fetchPortfolio();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await portfolioService.deletePortfolioItem(id);
      showToast('Item removed from portfolio', 'success');
      fetchPortfolio();
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              VERIFIED PORTFOLIO
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">PEER & INDUSTRY AUDITED</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Digital Portfolio & Work Showcase</h1>
          <p className="text-sm text-[#64748B]">
            Demonstrate your software repositories, design artifacts, clinical studies, and professional certifications.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0052FF] text-white text-xs gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project / Certification
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] space-y-3">
          <FolderGit2 className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-semibold text-[#0F172A]">No portfolio items added yet</h3>
          <p className="text-xs text-[#64748B]">Showcase your capstone projects, open-source work, or certifications.</p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-[#0052FF] text-white text-xs"
          >
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const isVerified = item.verified;

            return (
              <Card
                key={item._id}
                className="border-[#E2E8F0] hover:border-[#0052FF]/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono-label uppercase text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-[#0F172A] leading-snug">{item.title}</h3>
                    </div>

                    <div className="shrink-0">
                      {isVerified ? (
                        <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 font-mono-label text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] font-mono-label">
                          Self-Reported
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Skills tags */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {isVerified && item.verifiedBy && (
                    <div className="text-[11px] text-[#16A34A] bg-[#F0FDF4] p-2 rounded-lg border border-[#DCFCE7] flex items-center justify-between">
                      <span>Verified by {item.verifiedBy?.name || item.verifiedRole || 'Supervisor'}</span>
                      <span className="font-mono-label text-[10px]">
                        {item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : 'Audited'}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0F172A] hover:text-[#0052FF] flex items-center gap-1 font-medium"
                        >
                          <Github className="w-3.5 h-3.5" />
                          GitHub
                        </a>
                      )}
                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0052FF] hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo / Credential
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-1"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Portfolio Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Item to Verified Digital Portfolio"
        >
          <form onSubmit={handleAddItem} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Project or Credential Title:</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Distributed In-Memory Cache in Node.js"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A]"
              >
                <option value="Project">Software / Engineering Project</option>
                <option value="Certification">Industry Certification</option>
                <option value="Publication">Research Publication / Patent</option>
                <option value="Design">UI/UX / Design Case Study</option>
                <option value="Clinical Case">Clinical Case / Healthcare Study</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Description & Impact:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Key problem addressed, architecture patterns utilized, performance benchmarks achieved..."
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">GitHub / Source Repo URL:</label>
                <Input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Live Demo / Credential URL:</label>
                <Input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://..."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">
                Skills / Technologies Used (comma-separated):
              </label>
              <Input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Node.js, Docker, Kubernetes"
                className="text-xs"
              />
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={adding} className="bg-[#0052FF] text-white">
                {adding ? 'Saving...' : 'Save to Portfolio'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
