export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  aadhaarNumber?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  state?: string;
  district?: string;
  category?: string; // ST
  subTribe?: string; // Santhal, Gond, Bhil, Munda, Oraon, etc.
  stCertificateNumber?: string;
  institutionName?: string;
  course?: string;
  annualFamilyIncome?: number;
  isBankAadhaarSeeded?: boolean;
  profileCompletionPercentage: number;
  avatarUrl?: string;
  activeSchemeId?: string | null;
}

export type SchemeCategory = 
  | 'pre-matric'
  | 'post-matric'
  | 'top-class'
  | 'fellowship'
  | 'overseas';

export interface ScholarshipScheme {
  id: string;
  category: SchemeCategory;
  name: string;
  code: string;
  shortDescription: string;
  fullDescription: string;
  description?: string;
  targetLevel?: string;
  deadline?: string;
  ministry: string;
  financialAssistance: string;
  maxAnnualIncome: number; // e.g. 250000 or 600000
  targetAudience: string;
  eligibilityCriteria: string[];
  benefits: {
    title: string;
    amountOrDescription: string;
  }[];
  requiredDocuments: string[];
  applicationDeadline: string;
  fundingType: '100% Central' | '60:40 Centre-State' | 'Centrally Sponsored';
  portalUrl?: string;
}

export type DocumentType = 
  | 'aadhaar'
  | 'caste_certificate'
  | 'income_certificate'
  | 'marksheet'
  | 'bank_passbook'
  | 'admission_letter'
  | 'other';

export type DocumentStatus = 
  | 'Uploaded'
  | 'Verifying'
  | 'Verified'
  | 'Mismatch Found'
  | 'Pending';

export interface StudentDocument {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  documentNumber?: string;
  issuingAuthority: string;
  fileUrl?: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: DocumentStatus;
  verifiedSource?: string; // e.g., 'DigiLocker / UIDAI', 'e-District Odisha'
  mismatchReason?: string;
  hashChecksum?: string;
}

export type ApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Verification'
  | 'Under Manual Review'
  | 'Deficiency Found'
  | 'Approved'
  | 'Sanctioned'
  | 'Disbursed'
  | 'Rejected';

export interface VerificationFieldResult {
  fieldName: string;
  fieldLabel: string;
  submittedValue: string;
  verifiedValue: string;
  verificationSource: string;
  isMatch: boolean;
  explanation: string;
  discrepancyType?: 'INCOME_MISMATCH' | 'DOB_MISMATCH' | 'INSTITUTION_MISMATCH' | 'NAME_MISMATCH';
}

export interface ApplicationReadinessReport {
  overallScore: number; // 0 to 100 (e.g. 75)
  isEligibleToSubmit: boolean;
  hasMismatch: boolean;
  fields: VerificationFieldResult[];
  summary: string;
  recommendations: string[];
  manualReviewRequested?: boolean;
  manualReviewNote?: string;
}

export interface DbtDisbursementDetails {
  amount: number;
  currency: string;
  disbursedDate: string;
  transactionReference: string; // e.g. DBT-MOTA-2025-884920
  bankName: string;
  accountNumberMasked: string; // e.g. "•••• 4092"
  ifscCode: string;
  pfmsStatus: 'SUCCESS' | 'CREDITED_TO_ACCOUNT';
}

export interface ScholarshipApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  userId: string;
  studentName: string;
  studentAadhaarMasked: string;
  studentMobile: string;
  studentEmail: string;
  state: string;
  district: string;
  subTribe: string;
  institutionName: string;
  institutionUdiseCode?: string;
  course: string;
  currentYearSemester: string;
  rollNumber: string;
  submittedAnnualIncome: number;
  incomeCertificateNo: string;
  selectedDocumentIds: string[];
  status: ApplicationStatus;
  submittedAt: string;
  submissionDate?: string;
  updatedAt: string;
  readinessScore: number;
  readinessReport?: ApplicationReadinessReport;
  manualReviewRequested: boolean;
  manualReviewNote?: string;
  manualReviewRequestedAt?: string;
  timeline: {
    status: ApplicationStatus;
    label: string;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
  disbursementDetails?: DbtDisbursementDetails;
  adminRemarks?: string;

  // Convenience aliases for cross-component access
  annualIncome?: number;
  courseName?: string;
  aadhaarNumber?: string;
  documents?: StudentDocument[];
}

export type NotificationType = 'disbursement' | 'status_change' | 'action_required' | 'info' | 'warning' | 'success';

export interface NotificationItem {
  id: string;
  userId: string; // or 'admin' or 'all'
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface JagoChatMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  timestamp: string;
  quickActions?: {
    label: string;
    action: string;
  }[];
  contextCard?: {
    title: string;
    description: string;
    statusBadge?: string;
    route?: string;
  };
}

export interface CoverageRegionData {
  state: string;
  stEnrollmentCount: number; // Total enrolled ST students
  applicationCount: number; // Applications received
  unreachedCount: number; // Potential gap
  coveragePercentage: number;
  highGapDistricts: {
    district: string;
    enrolled: number;
    applied: number;
    gap: number;
    institutionsCount: number;
  }[];

  // Extended analytics properties
  stPopulationLakhs?: number;
  eligibleScholars?: number;
  applicationsReceived?: number;
  coverageRate?: number;
  disbursedCr?: number;
  districts?: string[];
}
