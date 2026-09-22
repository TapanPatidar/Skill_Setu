import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Sparkles,
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

export const LoginPage = () => {
  const { login, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@skillsetu.edu.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoRoles = [
    {
      role: 'student',
      label: 'Student',
      email: 'student@skillsetu.edu.in',
      desc: 'Multi-discipline scholar with active skill matrix',
      icon: GraduationCap,
    },
    {
      role: 'academician',
      label: 'Academician',
      email: 'faculty@skillsetu.edu.in',
      desc: 'Senior Professor & academic mentor',
      icon: Users,
    },
    {
      role: 'industry',
      label: 'Industry',
      email: 'recruiter@nexgen.com',
      desc: 'Enterprise corporate recruiter & tech partner',
      icon: Briefcase,
    },
    {
      role: 'institution',
      label: 'Institution',
      email: 'placement@university.edu.in',
      desc: 'Central university placement cell administrator',
      icon: Building2,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      addToast({
        title: 'Authentication Successful',
        message: 'Welcome to the SkillSetu Portal Console.',
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      addToast({
        title: 'Sign In Failed',
        message: err.message || 'Please check your credentials or try quick demo login.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleKey) => {
    setLoading(true);
    try {
      await loginAsDemo(roleKey);
      addToast({
        title: `Logged in as Demo ${roleKey.toUpperCase()}`,
        message: `Console initialized with ${roleKey} permissions & mock store.`,
        type: 'success',
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to launch demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between py-10 px-4 sm:px-6">
      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">
            Skill<span className="gradient-text">Setu</span>
          </span>
        </Link>
        <Link to="/register">
          <Button variant="ghost" size="sm">
            Need an account? <span className="text-[#0052FF] font-semibold ml-1">Register</span>
          </Button>
        </Link>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="accent">Sign In to Console</Badge>
          <h1 className="text-3xl font-serif tracking-tight text-[#0F172A]">Welcome back</h1>
          <p className="text-sm text-[#64748B]">
            Access your personalized role dashboard for skill mapping, internships, and placement.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.gov.in"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">Password</label>
                <span className="text-xs text-[#64748B]">Demo: password123</span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm font-semibold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Demo Login Option Required by Phase 1 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-mono-label">
              <span className="bg-white px-3 text-[#64748B]">Or quick launch demo role</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {demoRoles.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => handleQuickDemo(item.role)}
                className="flex items-center gap-2 p-2.5 text-left rounded-xl border border-[#E2E8F0] hover:border-[#0052FF]/40 hover:bg-[#0052FF]/5 transition-all text-[#0F172A] group"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] text-[#0052FF] flex items-center justify-center shrink-0 group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold block leading-tight truncate">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[#64748B] block truncate">Demo Access</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Footnote */}
        <p className="text-center text-xs text-[#64748B]">
          National Academia–Industry Skills & Placement Gateway
        </p>
      </div>

      <div className="text-center text-xs text-[#64748B] pt-6">
        © {new Date().getFullYear()} SkillSetu. All rights reserved.
      </div>
    </div>
  );
};
