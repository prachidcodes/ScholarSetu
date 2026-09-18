import React, { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ScholarshipCard } from '../../components/student/ScholarshipCard';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export const ScholarshipsPage: React.FC = () => {
  const { schemes, applications } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === 'all' ||
      (s.targetAudience && s.targetAudience.toLowerCase().includes(selectedLevel.toLowerCase()));

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>{t('common.motaTitle', 'Ministry of Tribal Affairs Central Repository')}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('schemes.heading', 'Unified Scholarship Schemes Explorer')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('schemes.subheading', 'Browse and verify your eligibility across the five central scholarship schemes for Scheduled Tribe students.')}
        </p>
      </div>

      {/* One-Scholarship Policy Advisory */}
      <Alert type="info" title={`${t('common.oneScholarshipRule', 'One-Scholarship Rule')}: Ministry Policy`}>
        Under Ministry of Tribal Affairs guidelines, an eligible ST scholar can avail benefits under only <strong>one</strong> government scholarship at a time. If you already have an active disbursement or approved scholarship, the portal prevents duplicate applications to ensure compliance and avoid financial clawbacks.
      </Alert>

      {/* Search & Level Filters */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by scheme name, institute type, or code (e.g. Post-Matric, NOS, IIT)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
              Level:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white w-full sm:w-auto"
            >
              <option value="all">All Academic Levels</option>
              <option value="Class IX - X">Secondary (Class IX - X)</option>
              <option value="Post-Matric">Post-Matric (XI - PG)</option>
              <option value="Premier">Top Class Premier Institutes</option>
              <option value="Research">M.Phil / Ph.D. Fellowships</option>
              <option value="Overseas">International Masters / Ph.D.</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const app = applications.find((a) => a.schemeId === scheme.id);
          return (
            <ScholarshipCard
              key={scheme.id}
              scheme={scheme}
              user={user}
              applicationStatus={app?.status}
              applicationId={app?.id}
            />
          );
        })}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-slate-600 font-semibold text-sm">No scholarship schemes match your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
            }}
            className="mt-3 text-xs text-teal-800 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
