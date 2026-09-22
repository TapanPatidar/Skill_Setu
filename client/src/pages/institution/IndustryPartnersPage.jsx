import React, { useState, useEffect } from 'react';
import {
  Building2,
  ScrollText,
  Users,
  Search,
  Plus,
  Calendar,
  ExternalLink,
  CheckCircle2,
  X,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const IndustryPartnersPage = () => {
  const { showToast } = useToast();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showMouModal, setShowMouModal] = useState(false);

  // New MoU Form
  const [mouForm, setMouForm] = useState({
    companyName: '',
    sector: 'IT Services & Software',
    tier: 'Tier-1 Enterprise',
    validUntil: '2028-06-30',
    scope: '',
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await institutionService.getIndustryPartners();
      if (res?.data) {
        setPartners(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading industry partners', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreateMou = (e) => {
    e.preventDefault();
    const newPartner = {
      _id: `partner_${Date.now()}`,
      name: mouForm.companyName,
      sector: mouForm.sector,
      tier: mouForm.tier,
      activeMoU: true,
      mouExpiresAt: mouForm.validUntil,
      totalHires: 0,
      jointLabsCount: 1,
      website: 'https://example.com',
    };

    setPartners((prev) => [newPartner, ...prev]);
    showToast(`MoU with ${mouForm.companyName} recorded successfully!`, 'success');
    setShowMouModal(false);
    setMouForm({ companyName: '', sector: 'IT Services & Software', tier: 'Tier-1 Enterprise', validUntil: '2028-06-30', scope: '' });
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sector.toLowerCase().includes(search.toLowerCase()) ||
      p.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              CORPORATE PARTNERSHIPS & MOUS
            </span>
            <span className="text-xs text-[#64748B]">• 38 Active Legal Agreements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Accredited Industry & Corporate Partners
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Directory of corporate recruiters, national laboratories, and clinical networks with active bilateral MoUs, joint laboratories, and campus placement quotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => setShowMouModal(true)} className="flex items-center gap-2 text-xs">
            <Plus className="w-4 h-4" /> Record New Corporate MoU
          </Button>
        </div>
      </div>

      {/* 2. Search Toolbar */}
      <div className="relative w-full sm:w-80 bg-white rounded-xl border border-[#CBD5E1]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partner by name, sector or tier..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
        />
      </div>

      {/* 3. Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <Card key={partner._id} className="border-[#E2E8F0] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold uppercase bg-blue-50 text-[#0052FF] border border-blue-200">
                  {partner.tier}
                </span>
                <span className="text-[11px] font-mono-label font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active MoU
                </span>
              </div>

              <CardTitle className="text-base font-bold text-[#0F172A]">
                {partner.name}
              </CardTitle>

              <div className="text-xs text-slate-500 font-medium mt-1">
                {partner.sector}
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 text-[11px]">Total Hires:</span>
                  <p className="text-base font-bold font-mono-label text-[#0052FF]">{partner.totalHires}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-slate-500 text-[11px]">Joint Labs:</span>
                  <p className="text-base font-bold font-mono-label text-[#0F172A]">{partner.jointLabsCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-mono-label text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  MoU Valid until: {partner.mouExpiresAt}
                </span>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0052FF] hover:underline flex items-center gap-1 font-medium"
                  >
                    Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 4. Record New MoU Modal */}
      {showMouModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateMou} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F172A]">Record Bilateral Corporate MoU</h2>
                <p className="text-xs text-slate-500">Record industry partnership agreement for NAAC/NIRF audit trails</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMouModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={mouForm.companyName}
                  onChange={(e) => setMouForm({ ...mouForm, companyName: e.target.value })}
                  placeholder="e.g. Cisco Systems India"
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">Sector</label>
                  <select
                    value={mouForm.sector}
                    onChange={(e) => setMouForm({ ...mouForm, sector: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] bg-white focus:outline-none"
                  >
                    <option value="IT Services & Software">IT & Software</option>
                    <option value="Healthcare & Ayush">Healthcare & Ayush</option>
                    <option value="Banking & Finance">Banking & Finance</option>
                    <option value="Manufacturing & Core">Manufacturing & Core</option>
                    <option value="Design & Media">Design & Media</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">MoU Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={mouForm.validUntil}
                    onChange={(e) => setMouForm({ ...mouForm, validUntil: e.target.value })}
                    className="w-full p-2 rounded-xl border border-[#CBD5E1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Scope of Collaboration</label>
                <textarea
                  rows={3}
                  value={mouForm.scope}
                  onChange={(e) => setMouForm({ ...mouForm, scope: e.target.value })}
                  placeholder="e.g. 50 annual student internships, faculty industrial sabbaticals, and sponsored networking lab..."
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setShowMouModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="text-xs">
                Record MoU
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
