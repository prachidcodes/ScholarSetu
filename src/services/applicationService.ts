import { ScholarshipApplication, ApplicationStatus, ApplicationReadinessReport } from '../types';
import { INITIAL_APPLICATIONS, ADMIN_SAMPLE_APPLICATIONS } from '../data/mockData';
import { notificationService } from './notificationService';

const APPLICATIONS_STORAGE_KEY = 'scholarsetu_applications';

export const applicationService = {
  getApplications(userId?: string): ScholarshipApplication[] {
    try {
      const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed: ScholarshipApplication[] = JSON.parse(stored);
        if (userId) {
          return parsed.filter((a) => a.userId === userId);
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    const initial = userId ? INITIAL_APPLICATIONS : ADMIN_SAMPLE_APPLICATIONS;
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(ADMIN_SAMPLE_APPLICATIONS));
    return initial;
  },

  getApplicationById(id: string): ScholarshipApplication | undefined {
    const all = this.getApplications();
    return all.find((a) => a.id === id);
  },

  async createApplication(payload: Omit<ScholarshipApplication, 'id' | 'submittedAt' | 'updatedAt' | 'timeline'>): Promise<ScholarshipApplication> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newId = `APP-MOTA-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newApp: ScholarshipApplication = {
      ...payload,
      id: newId,
      submittedAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Submitted',
          label: 'Application Submitted',
          timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: `Application submitted for ${payload.schemeName}.`,
          completed: true
        },
        {
          status: 'Under Verification',
          label: 'Automated Cross-Verification',
          timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: payload.readinessScore < 100 
            ? 'Verification completed: Income variance flagged for manual resolution.' 
            : 'All registry cross-checks verified successfully.',
          completed: true
        },
        {
          status: payload.readinessScore < 100 ? 'Under Manual Review' : 'Approved',
          label: payload.readinessScore < 100 ? 'Manual Review / Resolution' : 'Verification Approved',
          timestamp: payload.readinessScore < 100 ? 'Pending Student Choice' : 'Ready for Sanction',
          description: payload.readinessScore < 100 
            ? 'Student can fix details or request manual review by District Welfare Officer.' 
            : 'All documents verified.',
          completed: false
        },
        {
          status: 'Sanctioned',
          label: 'Sanction Order Issued',
          timestamp: 'Pending verification',
          description: 'Ministry / State Welfare Department digital sanction order.',
          completed: false
        },
        {
          status: 'Disbursed',
          label: 'Direct Benefit Transfer (DBT)',
          timestamp: 'Pending sanction',
          description: '100% scholarship credited via PFMS to student Aadhaar-seeded bank account.',
          completed: false
        }
      ]
    };

    const apps = this.getApplications();
    const updated = [newApp, ...apps];
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));

    // Create notification
    notificationService.createNotification({
      userId: payload.userId,
      title: `Application Submitted: ${payload.schemeName}`,
      message: `Your application (ID: ${newId}) has been received and verified with a readiness score of ${payload.readinessScore}%.`,
      type: payload.readinessScore < 100 ? 'action_required' : 'status_change',
      linkUrl: `/student/applications/${newId}`
    });

    return newApp;
  },

  async requestManualReview(appId: string, note?: string): Promise<ScholarshipApplication> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const apps = this.getApplications();
    const target = apps.find((a) => a.id === appId);
    if (!target) throw new Error('Application not found');

    const nowFormatted = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    target.status = 'Under Manual Review';
    target.manualReviewRequested = true;
    target.manualReviewNote = note || 'Student submitted clarification that declared income reflects agricultural non-taxable rural earnings.';
    target.manualReviewRequestedAt = new Date().toISOString();
    target.updatedAt = new Date().toISOString();

    // Update timeline
    const manualReviewStep = target.timeline.find((t) => t.status === 'Under Manual Review');
    if (manualReviewStep) {
      manualReviewStep.completed = true;
      manualReviewStep.timestamp = nowFormatted;
      manualReviewStep.description = `Manual review requested by student: "${target.manualReviewNote}"`;
    }

    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));

    // Trigger notification
    notificationService.createNotification({
      userId: target.userId,
      title: 'Manual Review Requested',
      message: `Your application (${target.id}) for ${target.schemeName} has moved to Manual Review. A District Welfare Officer has been assigned.`,
      type: 'status_change',
      linkUrl: `/student/applications/${target.id}`
    });

    return target;
  },

  async updateApplication(appId: string, updates: Partial<ScholarshipApplication>): Promise<ScholarshipApplication> {
    const apps = this.getApplications();
    const target = apps.find((a) => a.id === appId);
    if (!target) throw new Error('Application not found');

    Object.assign(target, updates, { updatedAt: new Date().toISOString() });
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    return target;
  },

  // Admin Actions
  async adminResolveReview(appId: string, decision: 'Approve' | 'Request More Info' | 'Sanction', remarks: string): Promise<ScholarshipApplication> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const apps = this.getApplications();
    const target = apps.find((a) => a.id === appId);
    if (!target) throw new Error('Application not found');

    const nowFormatted = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    target.adminRemarks = remarks;
    target.updatedAt = new Date().toISOString();

    if (decision === 'Approve') {
      target.status = 'Approved';
      target.readinessScore = 100;
      target.timeline.forEach((t) => {
        if (t.status === 'Under Manual Review') {
          t.completed = true;
          t.description = `Manual review resolved by District Welfare Officer: ${remarks}`;
        }
      });
      notificationService.createNotification({
        userId: target.userId,
        title: 'Manual Review Approved',
        message: `Your ${target.schemeName} manual review is resolved and approved: "${remarks}"`,
        type: 'status_change',
        linkUrl: `/student/applications/${target.id}`
      });
    } else if (decision === 'Sanction') {
      target.status = 'Sanctioned';
      target.readinessScore = 100;
      target.timeline.forEach((t) => {
        if (t.status === 'Sanctioned') {
          t.completed = true;
          t.timestamp = nowFormatted;
          t.description = `Sanction Order #SO-MOTA-2025-${Math.floor(1000 + Math.random() * 9000)} generated.`;
        }
      });
      notificationService.createNotification({
        userId: target.userId,
        title: 'Scholarship Sanction Order Issued',
        message: `Congratulations! Sanction Order has been generated for ${target.schemeName}. DBT disbursement is queued.`,
        type: 'status_change',
        linkUrl: `/student/applications/${target.id}`
      });
    } else if (decision === 'Request More Info') {
      target.status = 'Deficiency Found';
      notificationService.createNotification({
        userId: target.userId,
        title: 'Additional Documentation Requested',
        message: `Welfare Officer query on ${target.id}: "${remarks}". Please provide clarification.`,
        type: 'action_required',
        linkUrl: `/student/applications/${target.id}`
      });
    }

    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(apps));
    return target;
  }
};
