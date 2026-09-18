import React, { useState } from 'react';
import { 
  Globe2, 
  MapPin, 
  Tent,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { adminService } from '../../services/adminService';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CoverageIntelligencePage: React.FC = () => {
  const regions = adminService.getCoverageIntelligence();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [campSuccess, setCampSuccess] = useState<string | null>(null);

  const chartData = regions.map((r) => ({
    state: r.state,
    eligibleScholars: Math.round(r.stEnrollmentCount / 1000), // in thousands
    applicationsReceived: Math.round(r.applicationCount / 1000),
    coverageRate: r.coveragePercentage
  }));

  const filteredRegions = regions.filter((r) =>
    r.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.highGapDistricts?.some((d) => d.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeployCamp = (state: string, district: string) => {
    setCampSuccess(`Mobile Tribal Student Outreach Van dispatched to ${district}, ${state} with biometric Aadhaar and DigiLocker enrollment kits.`);
    setTimeout(() => setCampSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
          <Globe2 className="w-4 h-4" />
          <span>{t('admin.districtCoverage', 'Ministry of Tribal Affairs Geospatial Insights')}</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('admin.districtCoverage', 'Tribal Scholarship Coverage & Saturation Intelligence')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Pinpointing gaps where eligible Scheduled Tribe students have not yet transitioned to central scholarships. Identifies low-saturation blocks and mobilizes grassroots welfare camps.
        </p>
      </div>

      {campSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Tent className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{campSuccess}</span>
        </div>
      )}

      {/* State-wise Saturation Chart */}
      <Card>
        <CardHeader
          title="State-wise Eligible Scholars vs. Applications Received (in Thousands)"
          subtitle="Measures digital onboarding saturation across major tribal belts"
        />
        <CardBody>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val}k Students`,
                    name === 'eligibleScholars' ? 'Estimated Eligible' : 'Applications Logged'
                  ]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="eligibleScholars" name="Estimated Eligible (k)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applicationsReceived" name="Applications Logged (k)" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Coverage Gap District Table */}
      <Card>
        <CardHeader
          title="State & District-Level Tribal Penetration Matrix"
          subtitle="Districts below 75% saturation require localized mobilization"
          action={
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by state or district..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
              />
            </div>
          }
        />

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">State / UT</th>
                  <th className="p-4">Enrolled ST Students</th>
                  <th className="p-4">Applications Logged</th>
                  <th className="p-4">Coverage Rate</th>
                  <th className="p-4">Unreached Gap</th>
                  <th className="p-4">Priority Districts with Gaps</th>
                  <th className="p-4 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegions.map((r) => {
                  const isLowCoverage = r.coveragePercentage < 75;

                  return (
                    <tr key={r.state} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-800" />
                          <span>{r.state}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-medium text-slate-700">
                        {r.stEnrollmentCount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 font-bold text-slate-900">
                        {r.applicationCount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                r.coveragePercentage >= 80
                                  ? 'bg-emerald-600'
                                  : r.coveragePercentage >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${r.coveragePercentage}%` }}
                            />
                          </div>
                          <span className={`font-bold font-mono ${
                            isLowCoverage ? 'text-amber-700' : 'text-slate-800'
                          }`}>
                            {r.coveragePercentage}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-rose-700 font-mono">
                        {r.unreachedCount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {r.highGapDistricts?.map((d) => (
                            <span
                              key={d.district}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                isLowCoverage
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {d.district} ({Math.round(d.gap / 1000)}k gap)
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <Button
                          variant={isLowCoverage ? 'saffron' : 'outline'}
                          size="sm"
                          onClick={() => handleDeployCamp(r.state, r.highGapDistricts?.[0]?.district || r.state)}
                        >
                          Mobilize Camp
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
