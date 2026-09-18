import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FolderLock, 
  FileText, 
  Bell, 
  BarChart3, 
  CheckSquare, 
  Globe2, 
  Activity,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface SidebarLink {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'warning' | 'saffron';
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { role, user } = useAuth();
  const { unreadNotificationCount, setIsJagoOpen, activeDemoApplication } = useApp();

  const studentLinks: SidebarLink[] = [
    { name: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Scholarships', to: '/student/scholarships', icon: GraduationCap },
    { name: 'Document Wallet', to: '/student/documents', icon: FolderLock },
    { 
      name: 'Applications', 
      to: '/student/applications', 
      icon: FileText,
      badge: activeDemoApplication?.readinessReport?.hasMismatch ? '1 Issue' : undefined,
      badgeVariant: 'warning'
    },
    { 
      name: 'Notifications', 
      to: '/student/notifications', 
      icon: Bell,
      badge: unreadNotificationCount > 0 ? `${unreadNotificationCount}` : undefined,
      badgeVariant: 'saffron'
    }
  ];

  const adminLinks: SidebarLink[] = [
    { name: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Applications', to: '/admin/applications', icon: FileText },
    { name: 'Verification Engine', to: '/admin/verification', icon: CheckSquare },
    { name: 'Coverage Intelligence', to: '/admin/coverage', icon: Globe2 },
    { name: 'Activity & Audit', to: '/admin/activity', icon: Activity }
  ];

  const links: SidebarLink[] = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-[calc(100vh-4.25rem)] border-r border-slate-800 flex-shrink-0 select-none">
      {/* Role Pill Banner */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            {role === 'admin' ? 'Ministry Access' : 'Scholar Portal'}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
            role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
          }`}>
            {role === 'admin' ? 'MoTA Admin' : 'Scheduled Tribe'}
          </span>
        </div>
        <p className="text-xs text-slate-300 font-medium mt-1 truncate">
          {user?.name || (role === 'admin' ? 'MoTA Official' : 'ST Student')}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-800 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0 text-current opacity-80" />
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* JAGO Assistant Trigger Card (for students) */}
      {role !== 'admin' && (
        <div className="p-3.5 mx-3 mb-3 bg-gradient-to-br from-teal-950/80 to-slate-900 border border-teal-800/40 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-black text-xs">
              J
            </div>
            <span className="text-xs font-bold text-teal-300">JAGO AI Assistant</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
            Need help fixing your application mismatch or checking DBT?
          </p>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              setIsJagoOpen(true);
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask JAGO Now</span>
          </button>
        </div>
      )}

      {/* One-Scholarship Rule Notice */}
      <div className="p-3.5 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
          <span>One-Scholarship Rule</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          MoTA enforces single-scholarship compliance per student.
        </p>
      </div>
    </aside>
  );
};
