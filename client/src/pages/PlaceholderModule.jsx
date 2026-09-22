import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { SectionPill } from '../components/ui/SectionPill.jsx';

export const PlaceholderModule = ({ title, category = 'Module' }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <span className="text-xs font-mono-label text-[#64748B]">{currentPath}</span>
      </div>

      <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl gradient-accent mx-auto flex items-center justify-center text-white shadow-accent-lg">
          <Sparkles className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <SectionPill>{category}</SectionPill>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            {title || 'Ecosystem Module'}
          </h2>
          <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
            This module is part of the SkillSetu multi-domain career platform roadmap, establishing verified competency standards, automated matching, and institutional workflows.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#0F172A] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
            <span>Connected to Mongoose Backend & Mock Fallback Layer</span>
          </div>
          <p>Full interactive CRUD, multi-step forms, and AI matching algorithms arrive in Phase 2 & 3.</p>
        </div>

        <Link to="/dashboard">
          <Button size="md" className="gap-2">
            <span>Return to Role Dashboard</span>
          </Button>
        </Link>
      </Card>
    </div>
  );
};
