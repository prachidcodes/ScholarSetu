import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Eye, 
  CheckSquare 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslatedStatus } from '../../utils/statusTranslation';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AdminApplicationsPage: React.FC = () => {
  const { applications, adminResolveReview } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesScheme = schemeFilter === 'all' || app.schemeId === schemeFilter;

    return matchesSearch && matchesStatus && matchesScheme;
  });

  const getStatusBadge = (status: string) => {
    const translated = getTranslatedStatus(status, t);
    switch (status) {
      case 'Disbursed':
        return <Badge variant="success" size="sm" dot>{translated}</Badge>;
      case 'Sanctioned':
        return <Badge variant="purple" size="sm" dot>{translated}</Badge>;
      case 'Under Manual Review':
        return <Badge variant="warning" size="sm" dot>{translated}</Badge>;
      case 'Under Verification':
        return <Badge variant="info" size="sm" dot>{translated}</Badge>;
      default:
        return <Badge variant="neutral" size="sm" dot>{translated}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
            <FileText className="w-4 h-4" />
            <span>{t('admin.allApplications', 'National Registry Database')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('admin.allApplications', 'Application Lifecycle Management')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse, filter, and take administrative actions across all Scheduled Tribe student scholarship dossiers.
          </p>
        </div>

        <Link to="/admin/verification">
          <Button variant="saffron" size="sm" leftIcon={<CheckSquare className="w-4 h-4 text-white" />}>
            {t('admin.manualReviewQueue', 'Open Verification Engine')}
          </Button>
        </Link>
      </div>

      {/* Filter Controls */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, application ID (APP-MOTA-...), or institution..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Under Manual Review">Under Manual Review</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="Disbursed">Disbursed</option>
            </select>

            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            >
              <option value="all">All 5 Schemes</option>
              <option value="scheme-post-matric">Post-Matric</option>
              <option value="scheme-pre-matric">Pre-Matric</option>
              <option value="scheme-top-class">Top Class Education</option>
              <option value="scheme-nfst">National Fellowship (NFST)</option>
              <option value="scheme-nos">National Overseas (NOS)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Data Table */}
      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">App ID & Date</th>
                <th className="p-4">Student & Domicile</th>
                <th className="p-4">Scheme Applied</th>
                <th className="p-4">Institution</th>
                <th className="p-4 text-center">{t('readiness.score', 'Readiness Score')}</th>
                <th className="p-4">{t('apps.statusLabel', 'Status')}</th>
                <th className="p-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => {
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-teal-800 block">{app.id}</span>
                      <span className="text-[11px] text-slate-400">
                        {app.submissionDate || new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{app.studentName}</span>
                      <span className="text-[11px] text-slate-500">{app.state} • ST ({app.subTribe || 'Tribal'})</span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-slate-800 block max-w-[180px] truncate" title={app.schemeName}>
                        {app.schemeName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Income: ₹{(app.annualIncome || app.submittedAnnualIncome || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-slate-700 block max-w-[200px] truncate" title={app.institutionName}>
                        {app.institutionName}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block max-w-[180px]">
                        {app.course || app.courseName || 'Full-time'}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        app.readinessScore === 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {app.readinessScore}%
                      </span>
                    </td>

                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/student/applications/${app.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                          title="View Student Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {app.status === 'Under Manual Review' ? (
                          <Button
                            variant="saffron"
                            size="sm"
                            onClick={() => navigate('/admin/verification')}
                          >
                            Resolve
                          </Button>
                        ) : app.status === 'Sanctioned' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              adminResolveReview(app.id, 'Sanction', 'DBT release approved.');
                            }}
                          >
                            Release DBT
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">In Pipeline</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
