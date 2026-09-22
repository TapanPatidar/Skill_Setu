import React, { useState, useEffect } from 'react';
import {
  Plug,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Server,
  GraduationCap,
  FileCheck,
  Building2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { integrationService } from '../../services/integrationService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const IntegrationsPage = () => {
  const { showToast } = useToast();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await integrationService.getIntegrations();
      if (res?.data) {
        setIntegrations(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading integrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSync = async (id) => {
    setSyncingId(id);
    try {
      const res = await integrationService.triggerSync(id);
      showToast(res.message || 'Sync completed successfully!', 'success');
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, lastSync: 'Just now', status: 'connected' } : item
        )
      );
    } catch (err) {
      showToast('Sync trigger failed', 'error');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-label font-bold bg-[#0052FF]/10 text-[#0052FF]">
              SYSTEM INTEROPERABILITY
            </span>
            <span className="text-xs text-[#64748B]">• Unified Academic & Enterprise Data Connectors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Enterprise & National Platform Integrations
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Bi-directional data bridges with national education registries. Sync verified credits from NPTEL/SWAYAM, student degrees from DigiLocker ABC, and campus ERP rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono-label font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Gateways Operational
          </span>
        </div>
      </div>

      {/* 2. Integrations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <Card key={item.id} className="border-[#E2E8F0] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="p-6 pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono-label uppercase font-bold text-[#0052FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono-label font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {item.status}
                </span>
              </div>

              <CardTitle className="text-base font-bold text-[#0F172A]">
                {item.name}
              </CardTitle>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] text-slate-500">Last Synced:</span>
                  <p className="font-bold text-[#0F172A] font-mono-label mt-0.5">{item.lastSync}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] text-slate-500">Volume Synced:</span>
                  <p className="font-bold text-emerald-700 font-mono-label mt-0.5">{item.recordsSynced}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono-label">
                  Health: <strong className="text-slate-800">{item.health}</strong>
                </span>
                <Button
                  variant="primary"
                  className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                  disabled={syncingId === item.id}
                  onClick={() => handleSync(item.id)}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                  {syncingId === item.id ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
