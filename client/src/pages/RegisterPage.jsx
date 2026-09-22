import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  GraduationCap,
  Users,
  Briefcase,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech / B.E.',
    institutionName: 'Delhi Institute of Technology & Science',
    companyName: 'NexGen Technologies',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'student',
      title: 'Student / Scholar',
      desc: 'Enrolled undergraduate, graduate, or research scholar seeking internships',
      icon: GraduationCap,
    },
    {
      id: 'academician',
      title: 'Faculty / Academician',
      desc: 'Professor, lecturer, or research supervisor across university departments',
      icon: Users,
    },
    {
      id: 'industry',
      title: 'Industry Partner',
      desc: 'Enterprise corporate recruiter, engineering director, or talent lead',
      icon: Briefcase,
    },
    {
      id: 'institution',
      title: 'Institution Admin',
      desc: 'Placement officer, dean, or central university administration',
      icon: Building2,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        department: formData.department,
        degree: formData.degree,
      });

      addToast({
        title: 'Registration Complete',
        message: `Welcome to SkillSetu! Profile created as ${role.toUpperCase()}.`,
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between py-10 px-4 sm:px-6">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">
            Skill<span className="gradient-text">Setu</span>
          </span>
        </Link>
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Already registered? <span className="text-[#0052FF] font-semibold ml-1">Sign In</span>
          </Button>
        </Link>
      </div>

      {/* Main Registration Container */}
      <div className="max-w-xl w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="accent">New Registration</Badge>
          <h1 className="text-3xl font-serif tracking-tight text-[#0F172A]">
            Join the SkillSetu Ecosystem
          </h1>
          <p className="text-sm text-[#64748B]">
            Select your stakeholder role to customize your workspace and data permissions.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-2.5">
                Select Your Stakeholder Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#0052FF] bg-[#0052FF]/5 shadow-xs ring-1 ring-[#0052FF]'
                          : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#0052FF] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">{r.title}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-tight">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Full Name / Organization Head
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Vaidya Ramanath"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Institutional / Corporate Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@university.edu.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>

            {/* Dynamic Role-specific field */}
            {role === 'industry' ? (
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Company / Organization Name
                </label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Dabur Research & Development"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Institution Affiliation
                  </label>
                  <Input
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                    placeholder="All India Institute of Ayurveda"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                    Department / Focus
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Dravyaguna / Clinical Research"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-semibold mt-4"
            >
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
            </Button>
          </form>
        </Card>
      </div>

      <div className="text-center text-xs text-[#64748B] pt-6">
        SkillSetu • National Unified Skills, Internships & Placement Platform
      </div>
    </div>
  );
};
