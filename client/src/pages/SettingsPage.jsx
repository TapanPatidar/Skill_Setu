import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  Save,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllDomains } from '../lib/domains.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const SettingsPage = () => {
  const { user, role } = useAuth();
  const { showToast } = useToast();
  const domains = getAllDomains();

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Anand Ramanathan',
    email: user?.email || 'anand.ramanathan@institution.edu.in',
    domain: user?.domain || 'Engineering & Technology',
    institution: user?.institution || 'National Institute of Technology',
    emailNotifs: true,
    smsNotifs: false,
    opportunityAlerts: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Settings saved successfully', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* 1. Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0052FF]" />
          Account & Discipline Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your institutional identity, academic discipline classification, and notification subscriptions.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2. Personal & Institutional Information */}
        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardHeader className="p-5 pb-3 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <User className="w-4 h-4 text-[#0052FF]" /> Personal & Institutional Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Institutional Email</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50 text-slate-500 font-mono-label cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Primary Discipline / Domain</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Affiliated University / Organization</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Notification Subscriptions */}
        <Card className="border-[#E2E8F0] rounded-2xl">
          <CardHeader className="p-5 pb-3 border-b border-[#E2E8F0]">
            <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0052FF]" /> Communications & Alert Preferences
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#0F172A] block">Email Notifications</span>
                <span className="text-[11px] text-slate-500">Receive application updates and verification alerts via email</span>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifs}
                onChange={(e) => setFormData({ ...formData, emailNotifs: e.target.checked })}
                className="w-4 h-4 text-[#0052FF] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#0F172A] block">Opportunity Digest</span>
                <span className="text-[11px] text-slate-500">Weekly curated sabbatical, FDP, and internship matching alerts</span>
              </div>
              <input
                type="checkbox"
                checked={formData.opportunityAlerts}
                onChange={(e) => setFormData({ ...formData, opportunityAlerts: e.target.checked })}
                className="w-4 h-4 text-[#0052FF] rounded"
              />
            </label>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" disabled={saving} className="text-xs py-2 px-5 flex items-center gap-2">
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving Changes...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
};
