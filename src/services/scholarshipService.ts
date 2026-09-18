import { ScholarshipScheme, UserProfile } from '../types';
import { SCHEMES } from '../data/mockData';

export interface SchemeEligibilityResult {
  isEligible: boolean;
  isBlockedByOneScholarshipRule: boolean;
  activeSchemeName?: string;
  reasons: string[];
  recommendation: string;
}

export const scholarshipService = {
  getAllSchemes(): ScholarshipScheme[] {
    return SCHEMES;
  },

  getSchemeById(id: string): ScholarshipScheme | undefined {
    return SCHEMES.find((s) => s.id === id);
  },

  checkEligibility(scheme: ScholarshipScheme, user: UserProfile | null): SchemeEligibilityResult {
    if (!user) {
      return {
        isEligible: false,
        isBlockedByOneScholarshipRule: false,
        reasons: ['Please log in as a student to check your personalized eligibility.'],
        recommendation: 'Log in to continue'
      };
    }

    const reasons: string[] = [];
    let isBlockedByOneScholarshipRule = false;
    let activeSchemeName: string | undefined;

    // Check One-Scholarship Policy
    if (user.activeSchemeId && user.activeSchemeId !== scheme.id) {
      const active = SCHEMES.find((s) => s.id === user.activeSchemeId);
      activeSchemeName = active ? active.name : user.activeSchemeId;
      isBlockedByOneScholarshipRule = true;
      reasons.push(
        `One-Scholarship Rule: You are currently enrolled in/availing the "${activeSchemeName}". Under Ministry of Tribal Affairs guidelines, an ST student cannot avail multiple Central/State scholarships simultaneously.`
      );
    }

    // Check Category
    if (user.category && user.category !== 'ST') {
      reasons.push('This scheme is exclusively reserved for Scheduled Tribe (ST) students.');
    }

    // Check Income ceiling if applicable
    if (scheme.maxAnnualIncome > 0 && user.annualFamilyIncome && user.annualFamilyIncome > scheme.maxAnnualIncome) {
      reasons.push(
        `Income Ceiling Exceeded: Scheme requires annual family income <= ₹${scheme.maxAnnualIncome.toLocaleString(
          'en-IN'
        )}. Your verified/declared income is ₹${user.annualFamilyIncome.toLocaleString('en-IN')}.`
      );
    }

    const isEligible = reasons.length === 0;

    let recommendation = 'You fulfill the basic eligibility criteria for this scheme.';
    if (isBlockedByOneScholarshipRule) {
      recommendation = `You must complete or surrender your current scholarship (${activeSchemeName}) before applying to ${scheme.name}.`;
    } else if (!isEligible) {
      recommendation = reasons[0];
    }

    return {
      isEligible,
      isBlockedByOneScholarshipRule,
      activeSchemeName,
      reasons,
      recommendation
    };
  }
};
