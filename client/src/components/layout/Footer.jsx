import React from 'react';
import { Layers, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="main-footer" className="bg-[#0F172A] text-white border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Skill<span className="text-[#4D7CFF]">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              India's Unified Academia–Industry Bridge for Continuous Skill Mapping, Verified Industry Internships, Faculty Collaborations, and Multi-Disciplinary Campus Placements.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-label bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED CREDENTIALS
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-label bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HeartHandshake className="w-3.5 h-3.5" /> 11 ACADEMIC DISCIPLINES
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-label text-slate-300 uppercase font-semibold tracking-wider">
              Core Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Skill Diagnostic & Matrix</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Verified Internships & Jobs</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Faculty Sabbaticals & FDPs</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Corporate Recruiter Pipeline</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Institutional NAAC/NIRF Analytics</a></li>
            </ul>
          </div>

          {/* Domain Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono-label text-slate-300 uppercase font-semibold tracking-wider">
              Supported Disciplines
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Engineering & Technology</li>
              <li>Management & Business</li>
              <li>Healthcare & Life Sciences</li>
              <li>Commerce, Banking & Law</li>
              <li>Design, Arts & Communication</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillSetu. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Accreditation Guidelines</span>
            <span>•</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
