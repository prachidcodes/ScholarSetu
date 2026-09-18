import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'action_required':
        return <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
            <Bell className="w-4 h-4" />
            <span>Communications Hub</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notifications & Official Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time status updates from the Ministry of Tribal Affairs and District Welfare Office.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<CheckCheck className="w-4 h-4 text-teal-800" />}
          onClick={markAllNotificationsAsRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {['all', 'warning', 'success', 'info'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors capitalize ${
              filterType === t
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All Alerts' : t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            onClick={() => {
              markNotificationAsRead(item.id);
              if (item.linkUrl) navigate(item.linkUrl);
            }}
            className={`cursor-pointer transition-all hover:border-teal-700/40 ${
              !item.read ? 'bg-amber-50/30 border-amber-300/80 shadow-xs' : 'bg-white'
            }`}
          >
            <CardBody className="p-4 sm:p-5 flex items-start gap-4">
              {getIcon(item.type)}
              <div className="flex-1 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.message}</p>

                {item.linkUrl && (
                  <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-teal-800 hover:underline">
                    <span>View Related Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              )}
            </CardBody>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold text-sm">No notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
