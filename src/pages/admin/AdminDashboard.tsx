import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckSquare, 
  Banknote, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Globe2,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { adminService } from '../../services/adminService';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminDashboard: React.FC = () => {
  const kpis = adminService.getKpis();
  const schemeData = adminService.getSchemeDistribution();
  const statusData = adminService.getStatusDistribution();
  const trendData = adminService.getTrendData();

  const { applications, adminResolveReview } = useApp();
  const navigate = useNavigate();

  // Find applications needing manual review
  const reviewQueue = applications.filter(
    (a) => a.status === 'Under Manual Review' || a.readinessReport?.hasMismatch
  );

  return (
    <div className="space-y-6">
      {/* Top Ministry Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded">
                Ministry of Tribal Affairs (MoTA)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Unified Portal Operations & Intelligence
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              ScholarSetu Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time monitoring of ST scholarship scheme discovery, automated cross-registry verification, District Welfare Officer manual reviews, and DBT disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/verification">
              <Button
                variant="saffron"
                size="md"
                leftIcon={<CheckSquare className="w-4 h-4 text-white" />}
              >
                Verification Engine
              </Button>
            </Link>
            <Link to="/admin/coverage">
              <Button
                variant="outline"
                size="md"
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                leftIcon={<Globe2 className="w-4 h-4 text-amber-400" />}
              >
                Coverage Intelligence
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Total Applications</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {kpis.totalApplications.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">Across 5 Central Schemes</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Under Verification</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-800">
            {kpis.underVerification.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Automated cross-check active</p>
        </Card>

        <Card className="p-4 sm:p-5 border-amber-300 bg-amber-50/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-950">Under Manual Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900">
            {kpis.underManualReview.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">DWO resolution queue</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">Sanctioned</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-800">
            {kpis.sanctioned.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ready for DBT release</p>
        </Card>

        <Card className="p-4 sm:p-5 border-emerald-300 bg-emerald-50/20 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-950">Disbursed (DBT)</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800">
            ₹{kpis.totalDisbursedAmountCr} Cr
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">
            {kpis.disbursed.toLocaleString('en-IN')} students credited
          </p>
        </Card>
      </div>

      {/* Manual Review Priority Queue (Main SIH Demo Scenario) */}
      {reviewQueue.length > 0 && (
        <Card className="border-amber-300 shadow-sm bg-gradient-to-r from-amber-50/40 via-white to-stone-50">
          <CardHeader
            title="District Welfare Officer Priority Resolution Queue"
            subtitle="Applications with detected variances where students have requested manual verification"
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
            action={
              <Link
                to="/admin/verification"
                className="text-xs font-bold text-amber-900 underline hover:text-amber-950"
              >
                Open Verification Workbench →
              </Link>
            }
          />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-200">
              {reviewQueue.slice(0, 3).map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-900">{item.id}</span>
                      <Badge variant="warning" size="sm">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-slate-500">Score: {item.readinessScore}%</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {item.studentName} — {item.schemeName}
                    </h4>

                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Issue:</strong> Submitted ₹{(item.annualIncome || item.submittedAnnualIncome || 0).toLocaleString('en-IN')} vs Verified Source ₹3,50,000
                    </p>

                    {item.readinessReport?.manualReviewNote && (
                      <p className="text-xs text-amber-900 italic mt-1 bg-amber-50/80 p-2 rounded border border-amber-200">
                        "{item.readinessReport.manualReviewNote}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/verification')}
                    >
                      Audit Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        adminResolveReview(
                          item.id,
                          'Approve',
                          'Manual review approved based on Tahsildar rural income certificate.'
                        );
                      }}
                    >
                      Approve & Clear
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Distribution Bar Chart */}
        <Card>
          <CardHeader
            title="Applications Across 5 Ministry Schemes"
            subtitle="Current cycle enrolment breakdown"
          />
          <CardBody>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schemeData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="scheme" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any) => [Number(val).toLocaleString('en-IN'), 'Applications']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {schemeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Status Breakdown Donut Chart */}
        <Card>
          <CardHeader
            title="Verification & Pipeline Status"
            subtitle="Pass vs Manual Review vs Disbursement ratio"
          />
          <CardBody>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [Number(val).toLocaleString('en-IN'), 'Students']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Trend Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="7-Month National Applications & DBT Disbursement Trend"
            subtitle="Volume growth following nationwide rollout across tribal districts"
          />
          <CardBody>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="applications" name="Applications Received" stroke="#0f766e" fillOpacity={1} fill="url(#colorApps)" />
                  <Area type="monotone" dataKey="verified" name="Registry Cleared" stroke="#059669" fillOpacity={1} fill="url(#colorDisbursed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
