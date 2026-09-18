import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Search, 
  UserCheck, 
  GraduationCap, 
  Compass, 
  Layers, 
  Clock, 
  HelpCircle, 
  Globe2, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Check, 
  ChevronRight, 
  FolderCheck, 
  ExternalLink,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, FUTURE_TRIBAL_LANGUAGES } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SCHEMES } from '../../data/mockData';

export const HomePage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, role, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isTribalInfoModalOpen, setIsTribalInfoModalOpen] = useState(false);
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<any | null>(null);

  const handleQuickDemoLogin = (targetRole: 'student' | 'admin') => {
    switchDemoRole(targetRole);
    navigate(targetRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Top National Tricolor Ribbon */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Public Header */}
      <header className="sticky top-1.5 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Emblem */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-teal-900/40 relative overflow-hidden group-hover:bg-teal-900 transition-colors">
                  <span className="font-display font-black tracking-tighter text-amber-300 text-xl">SS</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 to-transparent pointer-events-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xl text-slate-900 tracking-tight">
                      Scholar<span className="text-teal-700">Setu</span>
                    </span>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-50 text-amber-900 border border-amber-300/60 rounded">
                      ST Portal
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none mt-0.5">
                    Ministry of Tribal Affairs • Govt. of India
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
              <a href="#home" className="hover:text-teal-700 transition-colors">{t('nav.home')}</a>
              <a href="#schemes" className="hover:text-teal-700 transition-colors">{t('nav.scholarships')}</a>
              <a href="#how-it-works" className="hover:text-teal-700 transition-colors">{t('nav.howItWorks')}</a>
              <a href="#features" className="hover:text-teal-700 transition-colors">Features</a>
              <a href="#mismatch-philosophy" className="hover:text-teal-700 transition-colors">Verification</a>
              <a href="#about" className="hover:text-teal-700 transition-colors">{t('nav.about')}</a>
            </nav>

            {/* Right Controls: Language Selector, Auth Buttons, Demo Switcher */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-300 transition-colors"
                  aria-label="Select Language"
                >
                  <Globe2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName || 'English'}</span>
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Prototype Regional Languages
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                            language === lang.code ? 'font-bold text-teal-800 bg-teal-50/60' : 'text-slate-700'
                          }`}
                        >
                          <span>{lang.nativeName} ({lang.name})</span>
                          {language === lang.code && <Check className="w-3.5 h-3.5 text-teal-700" />}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsLangDropdownOpen(false);
                          setIsTribalInfoModalOpen(true);
                        }}
                        className="w-full text-left text-[11px] text-teal-700 hover:text-teal-900 font-medium px-2 py-1 rounded hover:bg-teal-50"
                      >
                        Tribal Language Roadmap →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Demo Switcher for Evaluation */}
              <div className="flex items-center bg-amber-50/80 border border-amber-300/80 rounded-lg p-1 text-xs">
                <span className="px-2 text-amber-900 font-semibold text-[11px]">Demo:</span>
                <button
                  onClick={() => handleQuickDemoLogin('student')}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 hover:text-teal-900 hover:bg-white transition-colors"
                >
                  Student
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 hover:text-teal-900 hover:bg-white transition-colors"
                >
                  Officer
                </button>
              </div>

              {isAuthenticated ? (
                <Link
                  to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition-all"
                >
                  Go to {role === 'admin' ? 'Admin Workbench' : 'Dashboard'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition-all"
                  >
                    {t('nav.createAccount')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
              <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">{t('nav.home')}</a>
              <a href="#schemes" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">{t('nav.scholarships')}</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">{t('nav.howItWorks')}</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">Key Features</a>
              <a href="#mismatch-philosophy" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">Verification Philosophy</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5">{t('nav.about')}</a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-semibold text-slate-600">Select Language:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="text-center py-2 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2 text-xs font-bold text-white bg-teal-800 rounded-lg shadow-sm"
                >
                  {t('nav.createAccount')}
                </Link>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-2 text-xs">
                <p className="font-semibold text-amber-900 mb-1">Quick Demo Access (SIH 2026):</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickDemoLogin('student')}
                    className="flex-1 py-1.5 bg-white text-slate-800 border border-amber-300 rounded text-center font-medium"
                  >
                    Student View
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="flex-1 py-1.5 bg-white text-slate-800 border border-amber-300 rounded text-center font-medium"
                  >
                    Officer View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#fcfbf9] via-teal-50/20 to-white">
        {/* Subtle Decorative Background Geometry */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(13,148,136,0.12),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>Ministry of Tribal Affairs • SIH 2026 Problem Statement 26238</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {t('hero.headline')}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal max-w-2xl">
                {t('hero.subcopy')}
              </p>

              {/* Key Clarification Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Unified student-facing access layer:</strong> One place to discover, prepare for, and track scholarship opportunities. Designed to coordinate with existing systems (NSP, state e-District, DigiLocker) through secure service adapters.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#schemes"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-md transition-all group"
                >
                  {t('hero.cta.explore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all"
                >
                  {t('hero.cta.create')}
                </Link>
              </div>

              {/* Secondary Sign In Link */}
              <div className="pt-1">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-teal-800 hover:text-teal-950 underline underline-offset-4"
                >
                  {t('hero.alreadyAccount')}
                </Link>
              </div>

              {/* Verified Trust Stats (Illustrative Prototype Demo) */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="font-display font-black text-xl text-slate-900">5 Schemes</div>
                  <div className="text-[11px] text-slate-500 font-medium">Ministry of Tribal Affairs</div>
                </div>
                <div>
                  <div className="font-display font-black text-xl text-teal-800">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Review-First Philosophy</div>
                </div>
                <div>
                  <div className="font-display font-black text-xl text-amber-700">8 Languages</div>
                  <div className="text-[11px] text-slate-500 font-medium">Prototype Multilingual</div>
                </div>
              </div>
            </div>

            {/* Right Respectful Education & Technology Graphic (No stereotypes) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-6 text-white shadow-2xl border border-teal-700/50 overflow-hidden">
                {/* Subtle Geometric Overlay */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-12 -top-12 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Header of Simulated Card */}
                <div className="flex items-center justify-between pb-4 border-b border-teal-700/60 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-700/80 flex items-center justify-center font-bold text-amber-300 text-xs">
                      ST
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-none">ScholarSetu Student Portal</h4>
                      <p className="text-[10px] text-teal-200/80">Aadhaar & DigiLocker Connected (Simulated)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Live Demo
                  </span>
                </div>

                {/* Graphic Visual Representation of Student Journey */}
                <div className="space-y-3.5">
                  {/* Readiness Card Preview */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-teal-100">Scholarship Readiness</span>
                      <span className="text-xs font-black text-amber-300">75% (Illustrative Demo)</span>
                    </div>
                    <div className="h-2 w-full bg-teal-950/60 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-amber-400 rounded-full w-3/4" />
                    </div>
                    <p className="text-[11px] text-slate-200">
                      Identity & ST Category verified. Income record flagged for clarification (not rejected).
                    </p>
                  </div>

                  {/* Verification Pipeline Items */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Aadhaar Format Checksum (Verhoeff)</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-semibold">Valid Format</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>ST Caste Certificate (DigiLocker)</span>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-semibold">Digitally Linked</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-xs">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-300" />
                        <span>Annual Income Declaration Variance</span>
                      </div>
                      <span className="text-[10px] text-amber-200 font-semibold">Review Signal</span>
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-2 rounded bg-white/10 text-center text-[11px] font-semibold text-teal-100 border border-white/15">
                      Fix Information
                    </div>
                    <div className="p-2 rounded bg-amber-500/20 text-center text-[11px] font-bold text-amber-200 border border-amber-400/30">
                      Request Manual Review
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-teal-700/50 flex items-center justify-between text-[10px] text-teal-300">
                  <span>Empowering Scheduled Tribe Scholars Across India</span>
                  <span>MoTA • SIH 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Purpose Section */}
      <section id="problem" className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              The Challenge We Address
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('problem.heading')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Scheduled Tribe students navigating scholarship opportunities often encounter scattered portals, varying state rules, complex document requirements, and confusing status updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Fragmented Information</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students must parse different eligibility thresholds, income ceilings, and document checklists across multiple Central and State websites.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Automatic Rejection Fears</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minor spelling differences or discrepancies between submitted income and automated databases frequently cause panic or immediate rejection without explanation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Disbursement Opacity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                After submission, students struggle to know whether their application is with the college, district officer, or undergoing PFMS Aadhaar payment processing.
              </p>
            </div>
          </div>

          {/* ScholarSetu Solution Callout */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-white to-amber-50 border border-teal-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900">ScholarSetu: A Unified Student-Facing Access Layer</h4>
              <p className="text-xs text-slate-600 max-w-3xl">
                We bring discovery, preparation, document readiness, human-centered issue resolution, and lifecycle tracking together. Students get clear explanations, not cryptic errors.
              </p>
            </div>
            <a
              href="#how-it-works"
              className="shrink-0 px-4 py-2.5 text-xs font-bold text-teal-900 bg-white border border-teal-300 rounded-xl shadow-xs hover:bg-teal-50 transition-colors"
            >
              See How It Works →
            </a>
          </div>
        </div>
      </section>

      {/* Five Official Schemes Section */}
      <section id="schemes" className="py-16 sm:py-24 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Ministry of Tribal Affairs
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Explore Scholarship Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                All five major scholarship and fellowship schemes for Scheduled Tribe students under one roof. (Eligibility values shown below are illustrative demo figures).
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Scholarship Rule Supported</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-6 group hover:border-teal-500/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {scheme.category === 'pre-matric' && 'Pre-Matric'}
                      {scheme.category === 'post-matric' && 'Post-Matric'}
                      {scheme.category === 'top-class' && 'Top Class'}
                      {scheme.category === 'fellowship' && 'NFST'}
                      {scheme.category === 'overseas' && 'NOS'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {scheme.fundingType}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-teal-800 transition-colors">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {scheme.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium">Assistance:</span>
                      <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">
                        {scheme.financialAssistance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium">Income Ceiling:</span>
                      <span className="font-semibold text-slate-800">
                        {scheme.maxAnnualIncome === 0 ? 'No ceiling' : `≤ ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSchemeDetail(scheme)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
                  >
                    View Details
                  </button>
                  <Link
                    to="/register"
                    className="flex-1 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-2xs transition-colors text-center"
                  >
                    Check Readiness
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            * All figures and dates shown are illustrative prototype demo values. Final eligibility conforms to official Ministry guidelines.
          </div>
        </div>
      </section>

      {/* How It Works Section: 6-Step Lifecycle */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Student-Facing Experience
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Six-Step Student Journey
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ScholarSetu guides Scheduled Tribe students step-by-step from registration to direct benefit tracking.
            </p>
          </div>

          {/* 6 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Enter basic contact information, state domicile, and ST community details with simple, accessible fields.',
                icon: UserCheck
              },
              {
                step: '02',
                title: 'Verify Your Identity',
                desc: 'Format-validate your 12-digit Aadhaar with the Verhoeff checksum algorithm and initiate simulated identity checks.',
                icon: ShieldCheck
              },
              {
                step: '03',
                title: 'Discover Relevant Opportunities',
                desc: 'Explore the 5 official schemes matching your educational tier (Pre-Matric, Post-Matric, Top Class, NFST, NOS).',
                icon: Compass
              },
              {
                step: '04',
                title: 'Check Document Readiness',
                desc: 'Sync documents via simulated DigiLocker or upload certificates. Real-time readiness engine calculates pre-submission readiness.',
                icon: FolderCheck
              },
              {
                step: '05',
                title: 'Apply & Resolve Issues',
                desc: 'Never fear rejection. If information varies, click "Fix Information" or "Request Manual Review" with the Welfare Officer.',
                icon: RefreshCw
              },
              {
                step: '06',
                title: 'Track Application & Disbursement',
                desc: 'Follow live timeline stages from institutional verification to PFMS DBT status tracking without leaving the portal.',
                icon: Clock
              }
            ].map((s) => (
              <div key={s.step} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:bg-white hover:border-teal-500/40 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-teal-800/40 group-hover:text-teal-700 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Application Lifecycle Stages Timeline */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950 text-white">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
              <h4 className="font-display font-bold text-lg text-white">Application Lifecycle Tracking</h4>
              <p className="text-xs text-slate-300">
                ScholarSetu acts as a clear window into every phase. (ScholarSetu tracks status and does not directly process treasury payouts).
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider mb-1">Stage 1</div>
                <div className="font-bold text-sm text-white">Submitted</div>
                <p className="text-[11px] text-slate-300 mt-1">Application logged with digital timestamp</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider mb-1">Stage 2</div>
                <div className="font-bold text-sm text-white">Verification</div>
                <p className="text-[11px] text-slate-300 mt-1">Institution & District Officer cross-check</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-teal-300 tracking-wider mb-1">Stage 3</div>
                <div className="font-bold text-sm text-white">Sanction</div>
                <p className="text-[11px] text-slate-300 mt-1">Approval order generated by competent authority</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider mb-1">Stage 4</div>
                <div className="font-bold text-sm text-white">Disbursement</div>
                <p className="text-[11px] text-slate-300 mt-1">Direct Benefit Transfer via PFMS tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mismatch & Verification Philosophy Section */}
      <section id="mismatch-philosophy" className="py-16 sm:py-24 bg-gradient-to-b from-[#fcfbf9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
              Core Differentiating Philosophy
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Review-First, Never Automatic Rejection
            </h2>
            <div className="p-4 rounded-xl bg-amber-50/80 border-2 border-amber-300/80 text-amber-950 font-bold text-base sm:text-lg">
              "{t('mismatch.philosophy')}"
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Illustrative Demo Scenario Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Illustrative Demo Scenario
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  Demo Variance Case
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Submitted Income</span>
                    <div className="text-lg font-black text-slate-900 mt-1">₹2,00,000</div>
                    <span className="text-[10px] text-slate-500">Declared on application</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Verified Mock Income</span>
                    <div className="text-lg font-black text-amber-900 mt-1">₹3,50,000</div>
                    <span className="text-[10px] text-amber-700">Central Revenue cross-check</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Calculated Readiness Estimate:</span>
                    <span className="font-black text-amber-800">~75% (Illustrative Demo Score)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-3/4" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    * Clearly labeled as an illustrative demo scenario, not an official government rejection.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-900">Mandatory Action Choices Given to Student:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/60 text-xs">
                      <strong className="text-teal-900 block mb-1">Option 1: Fix Information</strong>
                      <span className="text-slate-600 text-[11px]">Correct clerical entries if a typographical mistake was made.</span>
                    </div>
                    <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
                      <strong className="text-amber-900 block mb-1">Option 2: Request Manual Review</strong>
                      <span className="text-slate-600 text-[11px]">Provide justification (e.g. agricultural exemption) to Welfare Officer.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer & Timeline Workflow explanation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4>Case Routed for Review</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When the student clicks "Request Manual Review", the case is immediately queued on the District Welfare Officer's workbench with all justification documents attached.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <h4>Application Timeline Event Created</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The student's tracking timeline registers an immutable event: "Manual Review Requested by Student". The student receives real-time SMS/in-app notifications as the officer reviews the case.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <h4>Officer Resolution Console</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Administrators can resolve the discrepancy, request clarification, or approve the application directly without forcing the student to restart the application cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Platform Features (12 Cards) */}
      <section id="features" className="py-16 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Complete Feature Architecture
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Designed for ST Students & Welfare Officers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every feature traces back to the needs of students across remote habitations and the administrators who serve them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Unified Scholarship Discovery', desc: 'Single window across all 5 Ministry of Tribal Affairs schemes with real-time policy checks.', icon: Search },
              { title: 'Student Profile', desc: 'Secure profile capturing domicile, education tier, and Scheduled Tribe community details.', icon: UserCheck },
              { title: 'Aadhaar Validation Architecture', desc: 'Format and Verhoeff checksum validation with mock verification abstraction layer.', icon: ShieldCheck },
              { title: 'Digital Document Wallet', desc: 'Central repository with SHA-256 integrity hashes for certificates, marksheets, and bank passbooks.', icon: FolderCheck },
              { title: 'DigiLocker Connection Architecture', desc: 'Simulated adapter demonstrating one-click document import and cryptographic verification.', icon: ExternalLink },
              { title: 'Scholarship Readiness Engine', desc: 'Pre-submission analysis generating an illustrative readiness estimate and actionable guidance.', icon: Sparkles },
              { title: 'Application Tracking', desc: 'Multi-stage timeline from Submission through Verification, Sanction, and PFMS DBT tracking.', icon: Clock },
              { title: 'Notifications', desc: 'Contextual alerts for document renewals, verification milestones, and manual review updates.', icon: AlertCircle },
              { title: 'JAGO Assistant', desc: 'In-app conversational assistant answering state-aware application and document questions.', icon: HelpCircle },
              { title: 'Manual Review Workflow', desc: 'Human-centered appeals pipeline for officers to resolve variances without automatic disqualification.', icon: RefreshCw },
              { title: 'Multilingual Access', desc: '8 prototype Indian languages with architecture ready for Bhashini tribal language expansion.', icon: Globe2 },
              { title: 'Admin / Coverage Intelligence', desc: 'District saturation analytics identifying "Potentially Unreached Students" across tribal blocks.', icon: Layers }
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-white hover:border-teal-500/50 hover:shadow-xs transition-all space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <f.icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Mission Section */}
      <section id="about" className="py-16 sm:py-20 bg-[#fcfbf9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                About ScholarSetu
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Built for the Smart India Hackathon 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                ScholarSetu was developed for <strong>Problem Statement 26238</strong> under the <strong>Ministry of Tribal Affairs, Government of India</strong>. Our mission is to bridge the digital gap for Scheduled Tribe (ST) students seeking secondary, higher, and overseas educational opportunities.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>The Problem:</strong> Fragmented portals, complex criteria, and fear of automatic rejection deter eligible ST scholars.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>The Approach:</strong> A unified student-facing digital access layer coordinating readiness, verification, and appeals.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>The Goal:</strong> Make scholarship access transparent, dignified, and accessible across every district in India.</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setIsTribalInfoModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-lg transition-colors"
                >
                  View Tribal Language Roadmap
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Prototype Disclaimer & Accuracy Statement
              </h4>
              <p className="text-slate-600 leading-relaxed">
                ScholarSetu does <strong>not</strong> claim to replace official government portals such as NSP, DigiLocker, UIDAI, or PFMS.
              </p>
              <p className="text-slate-600 leading-relaxed">
                External services (Aadhaar demographic matching, DigiLocker import, state revenue databases) are demonstrated through simulated adapter architectures for prototype evaluation.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium">
                Prototype designed for demonstration to Ministry of Tribal Affairs evaluators and SIH 2026 jury.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Detail Modal */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                  {selectedSchemeDetail.code}
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                  {selectedSchemeDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">{selectedSchemeDetail.fullDescription}</p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Financial Assistance</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedSchemeDetail.financialAssistance}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Income Ceiling</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {selectedSchemeDetail.maxAnnualIncome === 0 ? 'No Income Ceiling' : `≤ ₹${selectedSchemeDetail.maxAnnualIncome.toLocaleString('en-IN')}`}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Key Eligibility Criteria (Demo):</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {selectedSchemeDetail.eligibilityCriteria.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Required Documents:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {selectedSchemeDetail.requiredDocuments.map((d: string, idx: number) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <Link
                to="/register"
                className="px-5 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs"
              >
                Create Account to Apply
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tribal Language Roadmap Modal */}
      {isTribalInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Tribal Language Roadmap
                </h3>
                <p className="text-xs text-slate-500">Extensible Architecture for Bhashini Integration</p>
              </div>
              <button
                onClick={() => setIsTribalInfoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3">
              <p className="leading-relaxed">
                ScholarSetu's prototype currently supports <strong>8 regional/common Indian languages</strong> (English, Hindi, Marathi, Gujarati, Bengali, Odia, Telugu, Tamil).
              </p>
              <p className="leading-relaxed">
                We do <strong>not</strong> claim that all tribal languages are currently supported. The architecture uses decoupled translation adapters designed to connect with <strong>Digital India Bhashini</strong> to support major Scheduled Tribe mother tongues:
              </p>
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-800">
                {FUTURE_TRIBAL_LANGUAGES.map((tl) => (
                  <div key={tl} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>{tl}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Official statutory scheme notifications remain grounded in verified legal text to prevent mistranslation of policy mandates.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setIsTribalInfoModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-800 rounded-lg"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold font-display text-sm">
                <div className="w-7 h-7 rounded-lg bg-teal-800 text-amber-300 flex items-center justify-center font-bold text-xs">
                  SS
                </div>
                <span>ScholarSetu</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Unified scholarship access experience for Scheduled Tribe students. An initiative under the Ministry of Tribal Affairs, Government of India.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-mono border border-slate-700">
                  SIH 2026 • PS 26238
                </span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Five Central Schemes</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>Pre-Matric Scholarship (Classes IX–X)</li>
                <li>Post-Matric Scholarship (Post-Secondary)</li>
                <li>National Scholarship (Top Class)</li>
                <li>National Fellowship for ST Students (NFST)</li>
                <li>National Overseas Scholarship (NOS)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#schemes" className="hover:text-white">Scholarships</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#about" className="hover:text-white">About & Mission</a></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Create Account</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Tribal Student Support</h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-semibold">Helpline: 1800-11-7788</span>
                </div>
                <p className="text-slate-400">Email: help-scholarsetu@mota.gov.in</p>
                <p className="text-slate-400">Shastri Bhawan, New Delhi - 110001</p>
              </div>
            </div>
          </div>

          {/* Prototype Mandatory Disclaimer (Section 32) */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-amber-400 block mb-1">Important Prototype Notice:</strong>
            {t('footer.disclaimer')}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 Ministry of Tribal Affairs, Government of India. Prototype for Smart India Hackathon 2026.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Accessibility Statement</span>
              <span className="text-amber-400 font-medium">Digital India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
