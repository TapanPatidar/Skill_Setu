import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Users,
  FolderGit2,
  Plus,
  Video,
  MessageSquare,
  Clock,
  Send,
  Building2,
  CheckCircle2,
  FileText,
  DollarSign,
  ChevronRight,
  X,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';
import { facultyService } from '../../services/facultyService.js';
import { getAllDomains } from '../../lib/domains.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const FacultyCollabHubPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const domains = getAllDomains();

  const [activeTab, setActiveTab] = useState('events'); // events, mentorship, research
  const [events, setEvents] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [researchProposals, setResearchProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [activeMentorship, setActiveMentorship] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'guest-lecture',
    domain: 'Engineering & Technology',
    speakerName: user?.name || 'Dr. Anand Ramanathan',
    scheduledAt: '',
    durationMinutes: 90,
    maxParticipants: 200,
    meetingLink: '',
    description: '',
  });

  // New Research Proposal Form State
  const [proposalForm, setProposalForm] = useState({
    title: '',
    domain: 'Healthcare & Ayush',
    industryPartnerName: 'Sun Pharma Advanced Research Company',
    budget: '₹ 6,00,000',
    proposedDuration: '6 Months',
    abstract: '',
    deliverables: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [evRes, mentRes, resRes] = await Promise.all([
        facultyService.getCollabEvents(),
        facultyService.getMentorshipRequests(),
        facultyService.getResearchProposals(),
      ]);

      if (evRes?.data?.items) setEvents(evRes.data.items);
      if (mentRes?.data) setMentorships(mentRes.data);
      if (resRes?.data) setResearchProposals(resRes.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading collaboration hub', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRegisterEvent = async (id) => {
    try {
      const res = await facultyService.registerForEvent(id);
      showToast(res.message || 'Registered for session!', 'success');
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, attendeesCount: e.attendeesCount + 1, userRegistered: true } : e))
      );
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await facultyService.createEvent(eventForm);
      if (res.success) {
        showToast('Collaboration session scheduled!', 'success');
        setEvents((prev) => [res.data, ...prev]);
        setShowEventModal(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...proposalForm,
        deliverables: proposalForm.deliverables.split('\n').filter((l) => l.trim()),
      };
      const res = await facultyService.submitResearchProposal(payload);
      if (res.success) {
        showToast('Research proposal submitted to industry partner!', 'success');
        setResearchProposals((prev) => [res.data, ...prev]);
        setShowResearchModal(false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit proposal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await facultyService.sendMentorshipMessage(activeMentorship._id, replyText);
      showToast('Message sent to scholar', 'success');
      activeMentorship.messages.push({
        senderName: user?.name || 'Dr. Anand Ramanathan',
        senderRole: 'academician',
        text: replyText,
        createdAt: new Date().toISOString(),
      });
      setReplyText('');
    } catch (err) {
      showToast('Error sending message', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              INTERDISCIPLINARY COLLABORATION
            </span>
            <span className="text-xs text-[#64748B]">• Mentorship & Joint R&D</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Academician Collaboration Hub
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Bridge academic research with industry practice. Host guest lectures, mentor emerging scholars across all 11 disciplines, and submit joint industrial R&D proposals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <CalendarCheck className="w-4 h-4 text-[#0052FF]" /> Host Session
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowResearchModal(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <FolderGit2 className="w-4 h-4" /> Propose Joint R&D
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'events'
              ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
              : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <CalendarCheck className="w-4 h-4" /> Industry Lectures & Workshops ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('mentorship')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'mentorship'
              ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
              : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <Users className="w-4 h-4" /> Mentorship Console ({mentorships.length})
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'research'
              ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
              : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
          }`}
        >
          <FolderGit2 className="w-4 h-4" /> Joint R&D Proposals ({researchProposals.length})
        </button>
      </div>

      {/* 3. Tab 1: Industry Lectures & Workshops */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <Card key={ev._id} className="border-[#E2E8F0] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold uppercase bg-blue-50 text-[#0052FF] border border-blue-200">
                    {ev.type.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] font-mono-label text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ev.durationMinutes} min
                  </span>
                </div>

                <CardTitle className="text-base font-bold text-[#0F172A] line-clamp-2">
                  {ev.title}
                </CardTitle>

                <div className="text-xs text-slate-600 mt-1">
                  Speaker: <strong className="text-[#0F172A]">{ev.speakerName || ev.organizationName}</strong>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block text-[11px] font-mono-label text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded mb-2">
                    {ev.domain}
                  </span>
                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#0052FF]" /> Scheduled:</span>
                    <span className="font-semibold text-[#0F172A] font-mono-label">
                      {new Date(ev.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Registered:</span>
                    <span className="font-semibold text-[#0F172A] font-mono-label">{ev.attendeesCount} / {ev.maxParticipants}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {ev.meetingLink && (
                    <a
                      href={ev.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-red-500" /> Link
                    </a>
                  )}
                  <Button
                    variant="primary"
                    className="flex-1 text-xs py-1.5"
                    disabled={ev.userRegistered}
                    onClick={() => handleRegisterEvent(ev._id)}
                  >
                    {ev.userRegistered ? 'Registered ✓' : 'Register Session'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 4. Tab 2: Mentorship Console */}
      {activeTab === 'mentorship' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Scholar & Faculty Mentorship Inquiries</h2>
            <p className="text-xs text-[#64748B] mb-6">
              Review direct mentorship requests, review thesis topics, and exchange guidance notes with student researchers and junior faculty.
            </p>

            <div className="divide-y divide-[#E2E8F0]">
              {mentorships.map((req) => (
                <div key={req._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F172A]">{req.requesterName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-label font-bold uppercase bg-slate-100 text-slate-700">
                        {req.requesterRole}
                      </span>
                      <span className="text-xs text-slate-400">• {req.requesterDomain}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0052FF] mt-1">{req.topic}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      Latest: "{req.messages?.[req.messages.length - 1]?.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono-label font-semibold capitalize ${
                      req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {req.status}
                    </span>
                    <Button
                      variant="outline"
                      className="text-xs flex items-center gap-1.5"
                      onClick={() => setActiveMentorship(req)}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0052FF]" />
                      Conversation ({req.messages?.length || 0})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 3: Joint R&D Proposals */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">University-Industry Joint R&D Collaborations</h2>
                <p className="text-xs text-[#64748B]">
                  Formal research partnerships co-funded by corporate R&D divisions and national laboratories.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {researchProposals.map((prop) => (
                <div key={prop._id} className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono-label text-slate-500 uppercase font-bold">
                        {prop.domain}
                      </span>
                      <h3 className="text-base font-bold text-[#0F172A] mt-1 leading-snug">{prop.title}</h3>
                      <p className="text-xs text-[#0052FF] font-medium flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5" /> {prop.industryPartnerName}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono-label font-bold uppercase ${
                      prop.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-[#E2E8F0]">
                    {prop.abstract}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0]">
                      <span className="text-slate-500">Proposed Budget:</span>
                      <p className="font-bold text-emerald-700 font-mono-label">{prop.budget}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#E2E8F0]">
                      <span className="text-slate-500">Timeline:</span>
                      <p className="font-bold text-[#0F172A]">{prop.proposedDuration}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono-label text-slate-500 font-bold block mb-1.5">
                      KEY DELIVERABLES:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {prop.deliverables?.map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Mentorship Messages Drawer / Modal */}
      {activeMentorship && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-mono-label font-bold text-[#0052FF] uppercase">
                  MENTORSHIP THREAD
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-0.5">{activeMentorship.topic}</h3>
                <p className="text-xs text-slate-500">
                  With {activeMentorship.requesterName} ({activeMentorship.requesterDomain})
                </p>
              </div>
              <button
                onClick={() => setActiveMentorship(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              {activeMentorship.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl max-w-[85%] text-xs ${
                    msg.senderRole === 'academician'
                      ? 'ml-auto bg-[#0052FF] text-white'
                      : 'mr-auto bg-white border border-[#E2E8F0] text-[#0F172A]'
                  }`}
                >
                  <span className={`block text-[10px] font-mono-label font-bold mb-1 ${
                    msg.senderRole === 'academician' ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {msg.senderName}
                  </span>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type guidance note, reading recommendation or action..."
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
              <Button type="submit" variant="primary" className="text-xs py-2 px-4 flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Host Session Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Schedule Collaboration Session</h2>
                <p className="text-xs text-slate-500">Broadcast a guest lecture, workshop, or hackathon across universities</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Masterclass: Real-Time Telemetry & Systems Architecture"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Session Type</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                  >
                    <option value="guest-lecture">Guest Lecture</option>
                    <option value="workshop">Interactive Workshop</option>
                    <option value="innovation-challenge">Hackathon / Challenge</option>
                    <option value="live-project">Live Capstone Project</option>
                    <option value="case-competition">Case Competition</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Academic Discipline</label>
                  <select
                    value={eventForm.domain}
                    onChange={(e) => setEventForm({ ...eventForm, domain: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.scheduledAt}
                    onChange={(e) => setEventForm({ ...eventForm, scheduledAt: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Meeting / Video Link</label>
                  <input
                    type="text"
                    value={eventForm.meetingLink}
                    onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Outline key concepts, software tools, or case studies covered..."
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setShowEventModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="text-xs">
                {submitting ? 'Broadcasting...' : 'Broadcast Session'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 8. Propose Joint R&D Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateProposal} className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Submit Joint Research Proposal</h2>
                <p className="text-xs text-slate-500">Formalize an R&D partnership with an accredited industry partner</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                  placeholder="e.g. Near-Infrared Chemometrics for Botanical Quality Assurance"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Target Corporate Partner</label>
                  <input
                    type="text"
                    required
                    value={proposalForm.industryPartnerName}
                    onChange={(e) => setProposalForm({ ...proposalForm, industryPartnerName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Discipline</label>
                  <select
                    value={proposalForm.domain}
                    onChange={(e) => setProposalForm({ ...proposalForm, domain: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                  >
                    {domains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Requested Budget</label>
                  <input
                    type="text"
                    value={proposalForm.budget}
                    onChange={(e) => setProposalForm({ ...proposalForm, budget: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Duration</label>
                  <input
                    type="text"
                    value={proposalForm.proposedDuration}
                    onChange={(e) => setProposalForm({ ...proposalForm, proposedDuration: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Methodology & Research Abstract *</label>
                <textarea
                  rows={3}
                  required
                  value={proposalForm.abstract}
                  onChange={(e) => setProposalForm({ ...proposalForm, abstract: e.target.value })}
                  placeholder="Summarize the core scientific innovation, industry application, and test hypotheses..."
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Deliverables (One per line)</label>
                <textarea
                  rows={2}
                  value={proposalForm.deliverables}
                  onChange={(e) => setProposalForm({ ...proposalForm, deliverables: e.target.value })}
                  placeholder="e.g. 1 Patent application&#10;Working FPGA prototype&#10;2 Research papers"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setShowResearchModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting} className="text-xs">
                {submitting ? 'Submitting...' : 'Submit to Partner'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
