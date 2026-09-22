import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { institutionService } from '../../services/institutionService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const VerificationQueuePage = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected, all
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await institutionService.getVerificationQueue({ status: activeTab });
      if (res?.data?.items) {
        setClaims(res.data.items);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading verification queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [activeTab]);

  const handleProcessClaim = async (e) => {
    e.preventDefault();
    if (actionType === 'reject' && !reviewerNotes.trim()) {
      showToast('Please provide a reason for rejecting the claim', 'error');
      return;
    }

    setProcessing(true);
    try {
      const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
      const res = await institutionService.updateVerificationClaim(selectedClaim._id, newStatus, reviewerNotes);
      if (res.success) {
        showToast(`Claim ${newStatus} successfully!`, 'success');
        setClaims((prev) =>
          prev.map((c) =>
            c._id === selectedClaim._id ? { ...c, status: newStatus, reviewerNotes } : c
          )
        );
        setSelectedClaim(null);
        setReviewerNotes('');
      }
    } catch (err) {
      showToast('Failed to update claim', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const getClaimTypeBadge = (type) => {
    switch (type) {
      case 'certificate':
        return 'bg-blue-50 text-[#0052FF] border-blue-200';
      case 'internship':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'skill':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              ACCREDITATION & INTEGRITY CONSOLE
            </span>
            <span className="text-xs text-[#64748B]">• Institutional Attestation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Skill & Credential Verification Queue
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Review and digitally validate student-submitted certificates, MOOC course completions, internship completion letters, and clinical logbooks before they populate verified portfolios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono-label font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            {claims.filter((c) => c.status === 'pending').length} Pending Action
          </span>
        </div>
      </div>

      {/* 2. Status Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        {[
          { id: 'pending', label: 'Pending Review' },
          { id: 'approved', label: 'Approved Claims' },
          { id: 'rejected', label: 'Returned / Rejected' },
          { id: 'all', label: 'All Records' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#0052FF] text-white shadow-sm font-semibold'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Claims Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-500 font-mono-label uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student & Domain</th>
                <th className="py-3.5 px-4">Claim Type</th>
                <th className="py-3.5 px-4">Credential Title & Issuer</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Evidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n}>
                    <td colSpan={7} className="py-4 px-4 text-center text-slate-400">
                      Loading verification queue...
                    </td>
                  </tr>
                ))
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-slate-500">
                    No verification claims in this tab.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0F172A]">{claim.studentName}</div>
                      <div className="text-[11px] text-slate-500">{claim.domain}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono-label font-bold uppercase border ${getClaimTypeBadge(claim.type)}`}>
                        {claim.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F172A] max-w-xs truncate">{claim.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" /> {claim.issuingAuthority}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-label text-slate-600">
                      {new Date(claim.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={claim.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#0052FF] hover:underline font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" /> View PDF
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono-label font-bold capitalize ${
                        claim.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : claim.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {claim.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            className="text-[11px] py-1 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setActionType('reject');
                            }}
                          >
                            Return
                          </Button>
                          <Button
                            variant="primary"
                            className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedClaim(claim);
                              setActionType('approve');
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono-label">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Action Verification Modal */}
      {selectedClaim && actionType && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleProcessClaim} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-mono-label uppercase font-bold ${
                  actionType === 'approve' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {actionType === 'approve' ? 'ATTEST CREDENTIAL CLAIM' : 'RETURN CREDENTIAL CLAIM'}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-0.5">{selectedClaim.title}</h3>
                <p className="text-xs text-slate-500">
                  Student: {selectedClaim.studentName} ({selectedClaim.domain})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuer:</span>
                  <span className="font-bold text-[#0F172A]">{selectedClaim.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credential Document:</span>
                  <a href={selectedClaim.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-[#0052FF] font-medium underline flex items-center gap-1">
                    Open Evidence <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">
                  {actionType === 'approve' ? 'Validation Notes (Optional)' : 'Reason for Rejection *'}
                </label>
                <textarea
                  rows={3}
                  required={actionType === 'reject'}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'e.g. Verified with DigiLocker / ABC repository, approved for 4 university credits.'
                      : 'e.g. Certificate missing candidate full name or QR code verification fails.'
                  }
                  className="w-full p-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => setSelectedClaim(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={processing}
                className={`text-xs ${actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Confirm Attestation' : 'Return Claim'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
