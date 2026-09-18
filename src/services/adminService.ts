import { CoverageRegionData, ScholarshipApplication } from '../types';
import { COVERAGE_INTELLIGENCE_DATA } from '../data/mockData';
import { applicationService } from './applicationService';

export interface AdminKpiStats {
  totalApplications: number;
  underVerification: number;
  underManualReview: number;
  sanctioned: number;
  disbursed: number;
  totalDisbursedAmountCr: number;
  passRatePercentage: number;
  mismatchRatePercentage: number;
}

export const adminService = {
  getKpis(): AdminKpiStats {
    const apps = applicationService.getApplications();
    const total = apps.length;
    const underVer = apps.filter((a) => a.status === 'Under Verification').length;
    const manualRev = apps.filter((a) => a.status === 'Under Manual Review').length;
    const sanc = apps.filter((a) => a.status === 'Sanctioned').length;
    const disb = apps.filter((a) => a.status === 'Disbursed').length;
    const approved = apps.filter((a) => a.status === 'Approved').length;

    // Calculate pass vs mismatch based on readinessScore
    const totalChecked = apps.filter((a) => a.readinessScore > 0).length || 1;
    const perfectPass = apps.filter((a) => a.readinessScore === 100).length;
    const passRate = Math.round((perfectPass / totalChecked) * 100);

    return {
      totalApplications: 124890 + total,
      underVerification: 14210 + underVer,
      underManualReview: 3180 + manualRev,
      sanctioned: 41200 + sanc,
      disbursed: 66300 + disb,
      totalDisbursedAmountCr: 142.85,
      passRatePercentage: passRate || 78,
      mismatchRatePercentage: 100 - (passRate || 78)
    };
  },

  getSchemeDistribution() {
    return [
      { scheme: 'Pre-Matric', count: 48200, fill: '#0d9488' },
      { scheme: 'Post-Matric', count: 56100, fill: '#0f766e' },
      { scheme: 'Top Class', count: 12400, fill: '#0284c7' },
      { scheme: 'NFST (PhD)', count: 5900, fill: '#6366f1' },
      { scheme: 'Overseas (NOS)', count: 2290, fill: '#d97706' }
    ];
  },

  getStatusDistribution() {
    return [
      { name: 'Disbursed', value: 66300, color: '#059669' },
      { name: 'Sanctioned', value: 41200, color: '#0d9488' },
      { name: 'Under Verification', value: 14210, color: '#0284c7' },
      { name: 'Manual Review', value: 3180, color: '#f59e0b' }
    ];
  },

  getTrendData() {
    return [
      { month: 'Jul 2024', applications: 18200, verified: 14500, disbursedCr: 12.4 },
      { month: 'Aug 2024', applications: 28400, verified: 24100, disbursedCr: 21.8 },
      { month: 'Sep 2024', applications: 35100, verified: 31200, disbursedCr: 38.2 },
      { month: 'Oct 2024', applications: 42000, verified: 39400, disbursedCr: 52.0 },
      { month: 'Nov 2024', applications: 49800, verified: 45200, disbursedCr: 88.5 },
      { month: 'Dec 2024', applications: 54100, verified: 49800, disbursedCr: 118.0 },
      { month: 'Jan 2025', applications: 58900, verified: 53100, disbursedCr: 142.8 }
    ];
  },

  getCoverageIntelligence(): CoverageRegionData[] {
    return COVERAGE_INTELLIGENCE_DATA;
  }
};
