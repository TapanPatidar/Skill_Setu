import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  ShieldCheck,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialNotifications = [
  {
    id: 'notif_1',
    category: 'mentorship',
    title: 'New Mentorship Request',
    message: 'Dr. Anand Ramanathan accepted your research mentorship inquiry in Distributed Systems.',
    time: '15 minutes ago',
    unread: true,
    link: '/dashboard/career-guidance',
  },
  {
    id: 'notif_2',
    category: 'verifications',
    title: 'Skill Badge Attested',
    message: 'Your NPTEL Cloud Architecture Certificate (Score: 89%) has been verified by Dean of Academics.',
    time: '2 hours ago',
    unread: true,
    link: '/dashboard/skill-profile',
  },
  {
    id: 'notif_3',
    category: 'applications',
    title: 'Interview Shortlist Alert',
    message: 'NexGen Cloud Systems has shortlisted your profile for the Cloud Systems Engineering Internship.',
    time: 'Yesterday',
    unread: false,
    link: '/dashboard/applications',
  },
  {
    id: 'notif_4',
    category: 'system',
    title: 'National NIRF Benchmark Updated',
    message: 'Annual institutional competency metrics synchronized with national accreditation standards.',
    time: '2 days ago',
    unread: false,
    link: '/dashboard/policymaker',
  },
];

export const NotificationsPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read', 'success');
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter !== 'all') return n.category === filter;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0052FF]" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding your applications, mentorship requests, skill attestations, and campus announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead} className="text-xs">
            Mark all as read
          </Button>
        )}
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Updates' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'mentorship', label: 'Mentorship' },
          { id: 'verifications', label: 'Verifications' },
          { id: 'applications', label: 'Applications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filter === tab.id
                ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
                : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm divide-y divide-[#E2E8F0] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No notifications found in this view.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                item.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0052FF] flex items-center justify-center shrink-0 mt-0.5">
                  {item.category === 'mentorship' ? (
                    <Users className="w-4 h-4" />
                  ) : item.category === 'verifications' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${item.unread ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                      {item.title}
                    </h3>
                    {item.unread && <span className="w-2 h-2 rounded-full bg-[#0052FF]" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] font-mono-label text-slate-400 mt-1 block">{item.time}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
