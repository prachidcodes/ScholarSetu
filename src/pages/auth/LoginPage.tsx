import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound,
  GraduationCap,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@demo.com');
      setPassword('Student@123');
    } else {
      setEmail('admin@demo.com');
      setPassword('Admin@123');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      {/* Top Navigation Row */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 mb-4 flex items-center justify-between">
        <Link to="/" className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1">
          ← Back to Homepage
        </Link>
        <span className="text-[11px] font-mono text-slate-400">SIH 2026 Prototype</span>
      </div>
      {/* Top Emblem & Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-2xl shadow-md border border-teal-900 mb-3">
          <span className="font-display font-black tracking-tight text-amber-300">SS</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to <span className="text-teal-800">ScholarSetu</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Unified Scholarship Portal for Scheduled Tribe Students
        </p>
        <p className="text-[11px] text-slate-400 font-medium">Ministry of Tribal Affairs • Government of India</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-4">
        {/* Demo Access Card for SIH 2026 Judges */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border-2 border-amber-300/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>SIH 2026 Judges & Demo Access</span>
            </div>
            <span className="text-[10px] bg-amber-200/60 text-amber-900 font-bold px-2 py-0.5 rounded">
              One-Click Fill
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Click either role to auto-populate credentials and test both the ST Student journey and Ministry Admin Intelligence:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="p-2.5 rounded-xl border border-teal-700/30 bg-white hover:bg-teal-50 text-left transition-colors group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-teal-800 font-bold mb-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Demo</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate">student@demo.com</p>
              <p className="text-[10px] text-teal-700 font-semibold mt-1">Sunita Soren (ST)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-left transition-colors group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-0.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Ministry Admin</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono truncate">admin@demo.com</p>
              <p className="text-[10px] text-amber-700 font-semibold mt-1">Dr. R. Marandi</p>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/90 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <Alert type="error" title="Authentication Error">
                {error}
              </Alert>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email or Registered Mobile Number
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@demo.com"
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-teal-700 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              New ST student applying for the first time?{' '}
              <Link to="/register" className="font-bold text-teal-800 hover:underline">
                Register with Aadhaar
              </Link>
            </p>
          </div>
        </div>

        {/* Official footer seal */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>256-Bit SSL Encrypted National Tribal Welfare Gateway</span>
        </div>
      </div>
    </div>
  );
};
