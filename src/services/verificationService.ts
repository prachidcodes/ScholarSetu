import { ApplicationReadinessReport, VerificationFieldResult } from '../types';

export const verificationService = {
  async runApplicationReadinessCheck(
    formData: {
      studentName: string;
      dateOfBirth: string;
      category: string;
      subTribe: string;
      institutionName: string;
      submittedAnnualIncome: number;
    }
  ): Promise<ApplicationReadinessReport> {
    // Simulate multi-registry verification API latency (UIDAI, e-District, UDISE+, Income Tax)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const fields: VerificationFieldResult[] = [];

    // 1. Identity Check
    const nameMatch = formData.studentName.trim().length > 2;
    fields.push({
      fieldName: 'studentName',
      fieldLabel: 'Student Identity & Aadhaar Demographic',
      submittedValue: formData.studentName,
      verifiedValue: formData.studentName,
      verificationSource: 'Mock Identity Record (UIDAI Gateway)',
      isMatch: nameMatch,
      explanation: nameMatch
        ? 'Full name matches UIDAI Aadhaar biometrics and demographic database with 100% confidence.'
        : 'Name does not match identity records.'
    });

    // 2. Date of Birth Check
    fields.push({
      fieldName: 'dateOfBirth',
      fieldLabel: 'Date of Birth (DOB)',
      submittedValue: formData.dateOfBirth || '14/08/2004',
      verifiedValue: '14/08/2004',
      verificationSource: 'Mock Birth Registry & Class X Board Record',
      isMatch: true,
      explanation: 'Date of birth matches verified school leaving board record.'
    });

    // 3. ST Status Check
    const isST = formData.category.toUpperCase().includes('ST') || formData.category === 'Scheduled Tribe';
    fields.push({
      fieldName: 'category',
      fieldLabel: 'ST Category & Community Validation',
      submittedValue: `${formData.category} (${formData.subTribe || 'Santhal'})`,
      verifiedValue: 'Scheduled Tribe (Santhal)',
      verificationSource: 'Mock ST Certificate Registry (e-District Portal)',
      isMatch: isST,
      explanation: isST
        ? 'Authentic Scheduled Tribe certificate authenticated via State e-District Digital Signature.'
        : 'Category mismatch with official ST registry.'
    });

    // 4. Institution Check
    const instMatch = formData.institutionName.trim().length > 3;
    fields.push({
      fieldName: 'institution',
      fieldLabel: 'Enrolled Institution & AISHE Code',
      submittedValue: formData.institutionName,
      verifiedValue: formData.institutionName,
      verificationSource: 'Mock UDISE+ / AISHE Central Portal',
      isMatch: instMatch,
      explanation: instMatch
        ? 'Active student enrollment and valid AISHE institution code confirmed by campus nodal officer.'
        : 'Institution code could not be verified in AISHE database.'
    });

    // 5. Income Check (The Core Demo Mismatch)
    // If the student still submits ₹2,00,000 or <= 2,50,000, but central registry indicates ₹3,50,000
    const declaredIncome = Number(formData.submittedAnnualIncome) || 200000;
    const isIncomeFixed = declaredIncome > 300000; // If student updated to match or revised

    if (isIncomeFixed) {
      fields.push({
        fieldName: 'annualIncome',
        fieldLabel: 'Annual Family Income Verification',
        submittedValue: `₹${declaredIncome.toLocaleString('en-IN')}`,
        verifiedValue: `₹${declaredIncome.toLocaleString('en-IN')}`,
        verificationSource: 'Mock Income Tax / Revenue Department Record',
        isMatch: true,
        explanation: 'Submitted income declaration matches central revenue records.'
      });
    } else {
      fields.push({
        fieldName: 'annualIncome',
        fieldLabel: 'Annual Family Income Verification',
        submittedValue: `₹${declaredIncome.toLocaleString('en-IN')}`,
        verifiedValue: '₹3,50,000',
        verificationSource: 'Mock Income Tax Record / Revenue Dept',
        isMatch: false,
        discrepancyType: 'INCOME_MISMATCH',
        explanation: `Submitted value is ₹${declaredIncome.toLocaleString(
          'en-IN'
        )}, whereas the automated revenue registry indicates ₹3,50,000 family income. A manual review or updated local income certificate is required.`
      });
    }

    const matches = fields.filter((f) => f.isMatch).length;
    const total = fields.length;
    const overallScore = Math.round((matches / total) * 100);
    const hasMismatch = matches < total;

    const recommendations = hasMismatch
      ? [
          'Under ScholarSetu guidelines, a data mismatch NEVER rejects your application.',
          'Option A: Click "Fix Information" if you wish to adjust your submitted figures or re-upload a recent certificate.',
          'Option B: Click "Request Manual Review" to send your case to the Welfare Officer with your justification.'
        ]
      : [
          'All verification checks passed with 100% precision.',
          'Your application is in ready state for direct automated sanction.'
        ];

    return {
      overallScore,
      isEligibleToSubmit: true,
      hasMismatch,
      fields,
      summary: hasMismatch
        ? 'Identity, ST category, and institution records match. Income record shows a variance with the automated revenue database.'
        : 'All 5 statutory criteria match official government registries.',
      recommendations
    };
  },

  async verifyApplicationData(schemeId: string, formData: any): Promise<ApplicationReadinessReport> {
    return this.runApplicationReadinessCheck({
      studentName: formData.name || formData.studentName || 'Sunita Soren',
      dateOfBirth: formData.dob || formData.dateOfBirth || '2004-08-14',
      category: formData.category || 'ST',
      subTribe: formData.subTribe || 'Santhal',
      institutionName: formData.institutionName || 'Ranchi University',
      submittedAnnualIncome: Number(formData.annualFamilyIncome || formData.submittedAnnualIncome || 200000)
    });
  }
};
