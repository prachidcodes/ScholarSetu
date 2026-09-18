import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Globe2,
  Home,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { Badge } from '../ui/Badge';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { unreadNotificationCount, notifications, markNotificationAsRead } = useApp();
  const { language, setLanguage, t, setIsTribalLanguageNoticeOpen } = useLanguage();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Subtle National Tricolor Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-amber-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left: Mobile Toggle & Brand Emblem */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-3 group">
              {/* Emblem Logo Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-teal-900/40 relative overflow-hidden group-hover:bg-teal-900 transition-colors">
                <span className="font-display font-black tracking-tighter text-amber-300 text-xl">SS</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/40 to-transparent pointer-events-none" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                    Scholar<span className="text-teal-700">Setu</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-50 text-amber-900 border border-amber-300/60 rounded">
                    {t('nav.studentPortal', 'ST Portal')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-none">
                  {t('common.motaTitle', 'Ministry of Tribal Affairs • Govt. of India')}
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Home link, Language Selector, Demo Switcher, Notifications, User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Link back to public homepage */}
            <Link
              to="/"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
              title={t('nav.home', 'Home')}
            >
              <Home className="w-4 h-4 text-teal-800" />
              <span className="hidden lg:inline">{t('nav.home', 'Home')}</span>
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowNotifDropdown(false);
                  setShowProfileDropdown(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
                aria-label="Select Language"
              >
                <Globe2 className="w-3.5 h-3.5 text-teal-700" />
                <span className="font-medium">
                  {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName || 'English'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                    <span>{t('nav.language', 'Language')}</span>
                    <button
                      onClick={() => {
                        setShowLangDropdown(false);
                        setIsTribalLanguageNoticeOpen(true);
                      }}
                      className="text-teal-700 hover:underline capitalize font-semibold"
                    >
                      {t('nav.tribalNotice', 'Tribal Languages')}
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          language === l.code ? 'font-bold text-teal-800 bg-teal-50' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{l.nativeName}</span>
                          <span className="text-slate-400 text-[11px]">({l.name})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Role Switcher (Crucial for SIH 2026 Judges) */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="px-2 py-1 text-slate-500 font-medium">{t('common.demoMode', 'Demo View')}:</span>
              <button
                onClick={() => {
                  switchDemoRole('student');
                  navigate('/student/dashboard');
                }}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  role === 'student'
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('dashboard.verifiedScholar', 'Student')}
              </button>
              <button
                onClick={() => {
                  switchDemoRole('admin');
                  navigate('/admin/dashboard');
                }}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  role === 'admin'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('admin.officerRole', 'Ministry Official')}
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900">{t('nav.notifications', 'Notifications')}</span>
                    <Link
                      to={role === 'admin' ? '/admin/dashboard' : '/student/notifications'}
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-xs text-teal-700 hover:underline font-medium"
                    >
                      {t('common.view', 'View All')}
                    </Link>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 4).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkUrl) {
                              navigate(n.linkUrl);
                              setShowNotifDropdown(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {role === 'admin' ? t('admin.officerRole', 'Ministry Official') : t('dashboard.verifiedScholar', 'ST Scholar')}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    {user?.state && (
                      <Badge variant="neutral" size="sm" className="mt-2 text-[10px]">
                        State: {user.state} {user.category ? `• ${user.category}` : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                      onClick={() => setShowProfileDropdown(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {t('nav.dashboard', 'Dashboard')}
                    </Link>
                    {role === 'student' && (
                      <>
                        <Link
                          to="/student/documents"
                          onClick={() => setShowProfileDropdown(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          {t('nav.documents', 'Digital Document Wallet')}
                        </Link>
                        <Link
                          to="/student/applications"
                          onClick={() => setShowProfileDropdown(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          {t('nav.applications', 'Application Tracker')}
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav.signOut', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
