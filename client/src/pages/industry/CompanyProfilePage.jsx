import React, { useState } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Save,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const CompanyProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState(user?.companyName || 'NexGen Innovations Ltd.');
  const [website, setWebsite] = useState('https://nexgen.example.com');
  const [sector, setSector] = useState('Information Technology & Cloud Infrastructure');
  const [location, setLocation] = useState('Bengaluru & Gurugram, India');
  const [size, setSize] = useState('1,000 - 5,000 employees');
  const [about, setAbout] = useState(
    'Leading cloud architecture, AI platform development, and digital transformation partner working closely with premier academic institutions across India.'
  );

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Company profile updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/20 font-mono-label text-xs">
              VERIFIED CORPORATE PROFILE
            </Badge>
            <span className="text-xs text-[#64748B] font-mono-label">CIN: U72200KA2020PTC134567</span>
          </div>
          <h1 className="text-2xl font-serif text-[#0F172A]">{companyName}</h1>
          <p className="text-sm text-[#64748B]">
            Recruiter Profile: {user?.name || 'Pooja Singhania'} ({user?.email})
          </p>
        </div>

        <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 font-mono-label text-xs">
          <ShieldCheck className="w-4 h-4" />
          AICTE & MoE Verified
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <CardTitle className="text-base font-semibold text-[#0F172A]">Organization Information</CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Visible to applicants and partner university placement coordinators
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Company Legal Name:</label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Corporate Website:</label>
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Primary Sector:</label>
                <Input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#0F172A] block">Headquarters / Office Locations:</label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#0F172A] block">Company Overview:</label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#CBD5E1] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="bg-[#0052FF] text-white gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Academic Institutional MoUs */}
        <Card className="border-[#E2E8F0]">
          <CardHeader className="border-b border-[#F1F5F9] pb-3">
            <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0052FF]" />
              Active Institutional MoUs & Placement Partnerships
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Universities with established credit-aligned internship frameworks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {[
              {
                name: 'National Institute of Technology, Delhi',
                code: 'MOU-NITD-2025-09',
                status: 'Active',
                studentsPlaced: 18,
              },
              {
                name: 'All India Institute of Ayurveda (AIIA), New Delhi',
                code: 'MOU-AIIA-2025-14',
                status: 'Active',
                studentsPlaced: 6,
              },
              {
                name: 'Delhi Technological University (DTU)',
                code: 'MOU-DTU-2026-02',
                status: 'Active',
                studentsPlaced: 24,
              },
            ].map((mou) => (
              <div
                key={mou.code}
                className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-[#0F172A]">{mou.name}</h4>
                  <p className="text-[11px] text-[#64748B] font-mono-label">
                    MoU Ref: {mou.code} • {mou.studentsPlaced} students hired
                  </p>
                </div>
                <Badge className="bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0] gap-1 font-mono-label text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified MoU
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
