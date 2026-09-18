import { 
  ScholarshipScheme, 
  UserProfile, 
  StudentDocument, 
  ScholarshipApplication, 
  NotificationItem,
  CoverageRegionData
} from '../types';

export const SCHEMES: ScholarshipScheme[] = [
  {
    id: 'pre-matric',
    category: 'pre-matric',
    name: 'Pre-Matric Scholarship for ST Students',
    code: 'PMS-ST-IX-X',
    shortDescription: 'Financial support for Scheduled Tribe students studying in Class IX and X to prevent dropouts.',
    fullDescription: 'The Pre-Matric Scholarship Scheme for ST Students aims to support tribal parents for education of their wards studying in Classes IX and X, so that the incidence of drop-out, especially in the transition from elementary to secondary stage, is minimized. The scholarship covers day scholars and hostellers.',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    financialAssistance: 'Up to ₹3,500/year (Day Scholar) / ₹7,000/year (Hosteller)',
    maxAnnualIncome: 250000,
    targetAudience: 'ST students enrolled in Class 9 or 10 in recognized schools.',
    eligibilityCriteria: [
      'Student must belong to a recognized Scheduled Tribe (ST) community.',
      'Annual parental/family income from all sources must not exceed ₹2,50,000.',
      'Enrolled as a regular student in Class IX or X in a Government or recognized private school.',
      'Student should not be holding any other Central or State Government scholarship.'
    ],
    benefits: [
      { title: 'Maintenance Allowance', amountOrDescription: '₹225/month for Day Scholars, ₹525/month for Hostellers (10 months)' },
      { title: 'Ad-hoc Annual Grant', amountOrDescription: '₹750/year (Day Scholar) / ₹1,000/year (Hosteller)' },
      { title: 'Direct Benefit Transfer (DBT)', amountOrDescription: '100% credited directly to student Aadhaar-seeded bank account via PFMS' }
    ],
    requiredDocuments: [
      'ST Caste Certificate issued by competent revenue authority',
      'Income Certificate (valid for current financial year)',
      'Aadhaar Card (linked with bank account)',
      'Previous Class Passing Marksheet / School Bonafide Certificate',
      'Bank Account Passbook showing IFSC and Account Number'
    ],
    applicationDeadline: '31st October 2025',
    fundingType: '60:40 Centre-State'
  },
  {
    id: 'post-matric',
    category: 'post-matric',
    name: 'Post-Matric Scholarship for ST Students',
    code: 'PMS-ST-POST',
    shortDescription: 'Comprehensive support for post-secondary education from Class XI to Master level programs.',
    fullDescription: 'Centrally Sponsored Scheme implemented through State Governments and UT Administrations. Provides 100% financial assistance to eligible Scheduled Tribe students pursuing higher education across recognized degree, diploma, polytechnic, and post-graduate courses in India.',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    financialAssistance: 'Full tuition fee + Compulsory non-refundable fees + ₹13,500/year maintenance',
    maxAnnualIncome: 250000,
    targetAudience: 'ST students pursuing post-matriculation or post-secondary courses.',
    eligibilityCriteria: [
      'Candidate must belong to a Scheduled Tribe recognized in their home State/UT.',
      'Family income from all sources must not exceed ₹2,50,000 per annum.',
      'Must have passed the Matriculation/Higher Secondary or equivalent from a recognized board.',
      'Applicable for regular, full-time courses in recognized universities and institutions.'
    ],
    benefits: [
      { title: 'Tuition Fee Coverage', amountOrDescription: '100% of non-refundable government/university prescribed academic fees' },
      { title: 'Maintenance Allowance', amountOrDescription: 'Group 1 to Group 4 slabs: ₹4,000 to ₹13,500 annually' },
      { title: 'Study Tour & Thesis Grant', amountOrDescription: 'Special allowance for professional and medical/engineering students' },
      { title: 'Disability Allowance', amountOrDescription: 'Additional ₹2,400 to ₹4,200 per annum for Divyangjan scholars' }
    ],
    requiredDocuments: [
      'Digital ST Certificate (verified via State e-District portal)',
      'Current Financial Year Income Certificate from Tahsildar/SDM',
      'Class 10 & 12 Passing Marksheets',
      'Current Course Admission Bonafide / Fee Receipt',
      'Aadhaar-seeded Bank Account Passbook'
    ],
    applicationDeadline: '30th November 2025',
    fundingType: 'Centrally Sponsored'
  },
  {
    id: 'top-class',
    category: 'top-class',
    name: 'National Scholarship for Higher Education (Top Class Education)',
    code: 'TCE-ST-PREMIER',
    shortDescription: 'Full funding for ST students admitted into notified premier institutions (IITs, IIMs, NITs, AIIMS, NLS).',
    fullDescription: 'Provides financial assistance to meritorious ST students pursuing graduate and post-graduate degree courses in 250+ notified premier institutions of excellence such as IITs, NITs, IIMs, AIIMS, National Law Universities, and premier Central Universities.',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    financialAssistance: 'Full tuition fees + ₹3,000/month living expenses + ₹86,000 computer & books grant',
    maxAnnualIncome: 600000,
    targetAudience: 'ST students securing admission in 250+ premier institutions of national importance.',
    eligibilityCriteria: [
      'ST students who have secured admission in any of the notified institutions of excellence.',
      'Family annual income must not exceed ₹6,00,000.',
      'Must maintain satisfactory academic performance and minimum attendance.',
      'Fresh slot allocation based on inter-se merit if institution exceeds allocated quota.'
    ],
    benefits: [
      { title: 'Full Tuition Fee', amountOrDescription: 'Full tuition fee and non-refundable charges (up to ₹2.0 Lakhs/yr in pvt, actuals in govt)' },
      { title: 'Living Expenses', amountOrDescription: '₹3,000 per month (₹36,000 per academic year)' },
      { title: 'Books & Stationery', amountOrDescription: '₹5,000 per annum per student' },
      { title: 'Latest Laptop / Computer Grant', amountOrDescription: 'One-time ₹45,000 allowance for PC/Laptop with accessories' }
    ],
    requiredDocuments: [
      'ST Caste Certificate (DigiLocker verified)',
      'Annual Income Certificate issued by Revenue Authority (not exceeding ₹6 Lakh)',
      'Admission Offer Letter / JEE/NEET/CAT/CLAT Allotment Order',
      'Institute Fee Structure certified by Registrar / Dean',
      'Aadhaar Linked Active Bank Account Details'
    ],
    applicationDeadline: '15th December 2025',
    fundingType: '100% Central'
  },
  {
    id: 'fellowship',
    category: 'fellowship',
    name: 'National Fellowship for ST Students (NFST)',
    code: 'NFST-MPhil-PhD',
    shortDescription: 'Direct fellowship for regular ST scholars pursuing M.Phil and Ph.D. degrees in Indian universities.',
    fullDescription: 'The National Fellowship Scheme provides direct financial support to Scheduled Tribe candidates to undertake advanced research in Sciences, Humanities, Social Sciences, and Engineering leading to M.Phil and Ph.D. degrees in UGC-recognized universities.',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    financialAssistance: 'JRF: ₹37,000/month + HRA; SRF: ₹42,000/month + Contingency grant',
    maxAnnualIncome: 0, // No income ceiling for fellowship
    targetAudience: 'ST researchers enrolled in full-time M.Phil / Ph.D. programs.',
    eligibilityCriteria: [
      'Candidate must belong to ST and have qualified UGC-NET / CSIR-NET or secured university Ph.D. admission.',
      'Must have registered for regular, full-time M.Phil/Ph.D. in recognized universities.',
      'No income ceiling applies for the National Fellowship Scheme.',
      'Candidate should not be employed or drawing salary/fellowship from any other agency.'
    ],
    benefits: [
      { title: 'Junior Research Fellowship (JRF)', amountOrDescription: '₹37,000/month for initial 2 years' },
      { title: 'Senior Research Fellowship (SRF)', amountOrDescription: '₹42,000/month for remaining 3 years' },
      { title: 'Contingency Grant', amountOrDescription: '₹10,000 to ₹25,000/year depending on Humanities vs Science stream' },
      { title: 'House Rent Allowance (HRA)', amountOrDescription: 'As per Central Govt norms (8%, 16%, 27% according to city tier)' }
    ],
    requiredDocuments: [
      'ST Caste Certificate',
      'Post-Graduate Degree Marksheet with minimum 55% marks',
      'Ph.D. Registration / Admission Confirmation Letter from University Registrar',
      'Research Proposal synopsis signed by Research Supervisor',
      'Aadhaar & Bank Details for monthly DBT credit'
    ],
    applicationDeadline: '31st January 2026',
    fundingType: '100% Central'
  },
  {
    id: 'overseas',
    category: 'overseas',
    name: 'National Overseas Scholarship for ST Candidates (NOS)',
    code: 'NOS-ST-GLOBAL',
    shortDescription: 'Full international scholarship for Masters, Ph.D. and Post-Doctoral studies in premier foreign universities.',
    fullDescription: 'Provides financial assistance to selected Scheduled Tribe candidates who have obtained admission in top 1000 QS World University Ranked institutions abroad for pursuing Master level courses, Ph.D., and Post-Doctoral research programs.',
    ministry: 'Ministry of Tribal Affairs, Govt. of India',
    financialAssistance: 'Full tuition fees + US$ 15,400/yr living allowance (US) / £9,900/yr (UK) + Airfare',
    maxAnnualIncome: 600000,
    targetAudience: 'Meritorious ST students with confirmed unconditional admission in top global universities.',
    eligibilityCriteria: [
      'ST candidate with minimum 55% marks in qualifying degree (Bachelor / Master).',
      'Must have secured unconditional offer letter in top 1000 QS ranked university abroad.',
      'Total family income must not exceed ₹6,00,000 per annum.',
      'Candidate age must be below 35 years as on 1st April of selection year.'
    ],
    benefits: [
      { title: 'Tuition Fees', amountOrDescription: '100% of actual tuition fee paid directly to foreign university' },
      { title: 'Annual Maintenance Allowance', amountOrDescription: '$15,400 (USA & other countries) / £9,900 (UK)' },
      { title: 'Contingency & Equipment Allowance', amountOrDescription: '$1,532 / £1,116 annually for research materials and books' },
      { title: 'International Travel', amountOrDescription: 'Economy class return airfare and visa fees reimbursed' }
    ],
    requiredDocuments: [
      'Valid Indian Passport copy',
      'ST Certificate verified by District Magistrate / Collector',
      'Unconditional Admission Offer Letter from Foreign University',
      'IELTS / TOEFL / GRE scorecard',
      'IT Returns / Income Certificate for last 3 financial years'
    ],
    applicationDeadline: '31st March 2026',
    fundingType: '100% Central'
  }
];

export const DEMO_STUDENT_PROFILE: UserProfile = {
  id: 'usr-st-9021',
  name: 'Sunita Soren',
  email: 'student@demo.com',
  role: 'student',
  aadhaarNumber: 'XXXX-XXXX-8924',
  mobileNumber: '9845012345',
  dateOfBirth: '2004-08-14',
  state: 'Jharkhand',
  district: 'Ranchi',
  category: 'ST',
  subTribe: 'Santhal',
  stCertificateNumber: 'JH/ST/2023/88921',
  institutionName: 'Birsa Institute of Technology (BIT) Sindri',
  course: 'B.Tech in Computer Science & Engineering',
  annualFamilyIncome: 200000,
  isBankAadhaarSeeded: true,
  profileCompletionPercentage: 90,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  activeSchemeId: null // Not actively receiving another scheme right now, allowing applying
};

export const DEMO_ADMIN_PROFILE: UserProfile = {
  id: 'usr-adm-001',
  name: 'Dr. Rajeshwar Marandi',
  email: 'admin@demo.com',
  role: 'admin',
  state: 'National Portal (New Delhi)',
  district: 'Ministry of Tribal Affairs',
  profileCompletionPercentage: 100,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
};

export const INITIAL_DOCUMENTS: StudentDocument[] = [
  {
    id: 'doc-aadhaar-1',
    userId: 'usr-st-9021',
    type: 'aadhaar',
    title: 'Aadhaar Card (UIDAI)',
    documentNumber: 'XXXX-XXXX-8924',
    issuingAuthority: 'Unique Identification Authority of India',
    fileName: 'Aadhaar_Sunita_Soren_8924.pdf',
    fileSize: '412 KB',
    uploadedAt: '14 Oct 2024, 11:20 AM',
    status: 'Verified',
    verifiedSource: 'DigiLocker / UIDAI Official Gateway'
  },
  {
    id: 'doc-caste-1',
    userId: 'usr-st-9021',
    type: 'caste_certificate',
    title: 'ST Caste Certificate (Santhal)',
    documentNumber: 'JH/ST/2023/88921',
    issuingAuthority: 'Sub-Divisional Officer (SDO), Ranchi, Jharkhand',
    fileName: 'ST_Certificate_Soren_JH.pdf',
    fileSize: '680 KB',
    uploadedAt: '14 Oct 2024, 11:25 AM',
    status: 'Verified',
    verifiedSource: 'e-District Jharkhand State Registry'
  },
  {
    id: 'doc-income-1',
    userId: 'usr-st-9021',
    type: 'income_certificate',
    title: 'Annual Family Income Certificate (FY 2024-25)',
    documentNumber: 'INC/JH/2024/49102',
    issuingAuthority: 'Circle Officer, Kanke, Ranchi',
    fileName: 'Income_Certificate_2024.pdf',
    fileSize: '520 KB',
    uploadedAt: '15 Oct 2024, 02:40 PM',
    status: 'Mismatch Found',
    verifiedSource: 'Mock Income Tax / Revenue Registry',
    mismatchReason: 'Discrepancy: Declared ₹2,00,000, registry shows taxable family income ₹3,50,000.'
  },
  {
    id: 'doc-marksheet-1',
    userId: 'usr-st-9021',
    type: 'marksheet',
    title: 'Class XII Higher Secondary Marksheet & Certificate',
    documentNumber: 'JAC/HS/2023/102941',
    issuingAuthority: 'Jharkhand Academic Council (JAC)',
    fileName: 'Class_12_Marksheet_JAC.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '15 Oct 2024, 02:45 PM',
    status: 'Verified',
    verifiedSource: 'DigiLocker / JAC Board Record'
  },
  {
    id: 'doc-passbook-1',
    userId: 'usr-st-9021',
    type: 'bank_passbook',
    title: 'SBI Savings Account Passbook (Aadhaar Seeded)',
    documentNumber: 'SBIN0001309-38910294',
    issuingAuthority: 'State Bank of India, Main Branch Ranchi',
    fileName: 'SBI_Passbook_Aadhaar_Seeded.pdf',
    fileSize: '890 KB',
    uploadedAt: '16 Oct 2024, 09:10 AM',
    status: 'Verified',
    verifiedSource: 'NPCI Aadhaar Payment Bridge System (APBS)'
  }
];

// Initial active demo application featuring the main Income Mismatch scenario
export const INITIAL_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: 'APP-MOTA-2025-0982',
    schemeId: 'post-matric',
    schemeName: 'Post-Matric Scholarship for ST Students',
    schemeCode: 'PMS-ST-POST',
    userId: 'usr-st-9021',
    studentName: 'Sunita Soren',
    studentAadhaarMasked: 'XXXX-XXXX-8924',
    studentMobile: '+91 98450 12345',
    studentEmail: 'student@demo.com',
    state: 'Jharkhand',
    district: 'Ranchi',
    subTribe: 'Santhal',
    institutionName: 'Birsa Institute of Technology (BIT) Sindri',
    institutionUdiseCode: 'AISHE-C-41902',
    course: 'B.Tech - Computer Science & Engineering',
    currentYearSemester: '2nd Year (Semester IV)',
    rollNumber: '22BITCSE084',
    submittedAnnualIncome: 200000,
    incomeCertificateNo: 'INC/JH/2024/49102',
    selectedDocumentIds: ['doc-aadhaar-1', 'doc-caste-1', 'doc-income-1', 'doc-marksheet-1', 'doc-passbook-1'],
    status: 'Under Verification',
    submittedAt: '2025-01-18T10:30:00Z',
    updatedAt: '2025-01-18T10:35:00Z',
    readinessScore: 75,
    manualReviewRequested: false,
    readinessReport: {
      overallScore: 75,
      isEligibleToSubmit: true,
      hasMismatch: true,
      summary: 'Identity, ST caste category, and academic institution records verified successfully. One income data mismatch detected with the central revenue cross-check database.',
      recommendations: [
        'Do not worry: your application is NOT rejected.',
        'You can click "Fix Information" to revise or re-upload your current Tahsildar issued certificate.',
        'Alternatively, click "Request Manual Review" so the District Welfare Officer (DWO) can manually verify your rural non-taxable agricultural income proof.'
      ],
      fields: [
        {
          fieldName: 'studentName',
          fieldLabel: 'Student Identity (Full Name)',
          submittedValue: 'Sunita Soren',
          verifiedValue: 'Sunita Soren',
          verificationSource: 'Mock Identity Record (UIDAI / DigiLocker)',
          isMatch: true,
          explanation: 'Name matches 100% with Aadhaar demographic and biometrics registry.'
        },
        {
          fieldName: 'dateOfBirth',
          fieldLabel: 'Date of Birth',
          submittedValue: '14/08/2004',
          verifiedValue: '14/08/2004',
          verificationSource: 'Mock Identity Record (UIDAI & Class X Record)',
          isMatch: true,
          explanation: 'Date of birth matches verified school leaving board record.'
        },
        {
          fieldName: 'category',
          fieldLabel: 'ST Category & Community',
          submittedValue: 'Scheduled Tribe (Santhal)',
          verifiedValue: 'Scheduled Tribe (Santhal)',
          verificationSource: 'Mock ST Certificate Registry (e-District Jharkhand)',
          isMatch: true,
          explanation: 'Valid digital certificate found in State Revenue Database with authentic digital signature.'
        },
        {
          fieldName: 'institution',
          fieldLabel: 'Enrolled Institution & AISHE Code',
          submittedValue: 'Birsa Institute of Technology (BIT) Sindri',
          verifiedValue: 'Birsa Institute of Technology (BIT) Sindri',
          verificationSource: 'Mock UDISE+ / AISHE Central Higher Education Portal',
          isMatch: true,
          explanation: 'Active enrollment and regular full-time student status verified through university registrar upload.'
        },
        {
          fieldName: 'annualIncome',
          fieldLabel: 'Annual Family Income',
          submittedValue: '₹2,00,000',
          verifiedValue: '₹3,50,000',
          verificationSource: 'Mock Income Tax / Central Revenue Record',
          isMatch: false,
          discrepancyType: 'INCOME_MISMATCH',
          explanation: 'Submitted application declares ₹2,00,000 based on local rural certificate, but automated cross-check with central tax record indicates ₹3,50,000 parent combined gross. Note: ST income ceiling for Post-Matric is ₹2,50,000.'
        }
      ]
    },
    timeline: [
      {
        status: 'Submitted',
        label: 'Application Submitted',
        timestamp: '18 Jan 2025, 10:30 AM',
        description: 'Student submitted application via ScholarSetu with 5 verified documents.',
        completed: true
      },
      {
        status: 'Under Verification',
        label: 'Automated Cross-Verification',
        timestamp: '18 Jan 2025, 10:32 AM',
        description: 'Cross-checked against UIDAI, e-District Jharkhand, and Central AISHE database.',
        completed: true
      },
      {
        status: 'Under Manual Review',
        label: 'Manual Review / Resolution',
        timestamp: 'Pending Action',
        description: 'Awaiting student resolution for income record discrepancy.',
        completed: false
      },
      {
        status: 'Sanctioned',
        label: 'Scholarship Sanction Order',
        timestamp: 'Expected within 10 days of resolution',
        description: 'State Tribal Welfare Department generates digital sanction order.',
        completed: false
      },
      {
        status: 'Disbursed',
        label: 'Direct Benefit Transfer (DBT)',
        timestamp: 'Pending Sanction',
        description: 'Funds credited directly to Aadhaar-seeded bank account via PFMS.',
        completed: false
      }
    ]
  },
  {
    id: 'APP-MOTA-2024-8172',
    schemeId: 'pre-matric',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    schemeCode: 'PMS-ST-IX-X',
    userId: 'usr-st-9021',
    studentName: 'Sunita Soren',
    studentAadhaarMasked: 'XXXX-XXXX-8924',
    studentMobile: '+91 98450 12345',
    studentEmail: 'student@demo.com',
    state: 'Jharkhand',
    district: 'Ranchi',
    subTribe: 'Santhal',
    institutionName: 'Government High School, Kanke, Ranchi',
    course: 'Class X (Secondary)',
    currentYearSemester: 'Academic Year 2023-24',
    rollNumber: 'GHS-10-042',
    submittedAnnualIncome: 180000,
    incomeCertificateNo: 'INC/JH/2023/18290',
    selectedDocumentIds: ['doc-aadhaar-1', 'doc-caste-1', 'doc-passbook-1'],
    status: 'Disbursed',
    submittedAt: '2024-08-10T09:00:00Z',
    updatedAt: '2025-01-12T14:22:00Z',
    readinessScore: 100,
    manualReviewRequested: false,
    disbursementDetails: {
      amount: 15000,
      currency: 'INR',
      disbursedDate: '12 Jan 2025',
      transactionReference: 'DBT-MOTA-2025-884920',
      bankName: 'State Bank of India',
      accountNumberMasked: '•••• 4092',
      ifscCode: 'SBIN0001309',
      pfmsStatus: 'CREDITED_TO_ACCOUNT'
    },
    timeline: [
      {
        status: 'Submitted',
        label: 'Application Submitted',
        timestamp: '10 Aug 2024, 09:00 AM',
        description: 'Application received and verified.',
        completed: true
      },
      {
        status: 'Under Verification',
        label: 'Verification Complete',
        timestamp: '14 Aug 2024, 11:15 AM',
        description: 'All 5 criteria cleared with 100% readiness score.',
        completed: true
      },
      {
        status: 'Sanctioned',
        label: 'Sanction Order Issued',
        timestamp: '28 Dec 2024, 04:30 PM',
        description: 'Sanction Order #SO-MOTA-JH-9921 generated.',
        completed: true
      },
      {
        status: 'Disbursed',
        label: 'DBT Payment Disbursed',
        timestamp: '12 Jan 2025, 02:22 PM',
        description: '₹15,000 transferred to SBI A/c •••• 4092 via PFMS.',
        completed: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-st-9021',
    title: 'Disbursement Credited Successfully',
    message: '₹15,000 has been disbursed for your Pre-Matric Scholarship directly into your Aadhaar-seeded SBI account (Ref: DBT-MOTA-2025-884920).',
    type: 'disbursement',
    timestamp: '12 Jan 2025, 02:30 PM',
    read: true,
    linkUrl: '/student/applications/APP-MOTA-2024-8172'
  },
  {
    id: 'notif-2',
    userId: 'usr-st-9021',
    title: 'Attention: Application Verification Update',
    message: 'Your Post-Matric Scholarship application has an income verification query. Click to review or request manual review without delay.',
    type: 'action_required',
    timestamp: '18 Jan 2025, 10:35 AM',
    read: false,
    linkUrl: '/student/applications/APP-MOTA-2025-0982'
  },
  {
    id: 'notif-3',
    userId: 'usr-st-9021',
    title: 'DigiLocker Document Synchronization',
    message: '5 official educational and identity credentials successfully synced and certified.',
    type: 'info',
    timestamp: '16 Oct 2024, 10:00 AM',
    read: true,
    linkUrl: '/student/documents'
  }
];

// Admin mock coverage intelligence comparing ST enrollment vs applications
export const COVERAGE_INTELLIGENCE_DATA: CoverageRegionData[] = [
  {
    state: 'Jharkhand',
    stEnrollmentCount: 420000,
    applicationCount: 315000,
    unreachedCount: 105000,
    coveragePercentage: 75.0,
    highGapDistricts: [
      { district: 'West Singhbhum', enrolled: 68000, applied: 42000, gap: 26000, institutionsCount: 142 },
      { district: 'Dumka', enrolled: 54000, applied: 36000, gap: 18000, institutionsCount: 110 },
      { district: 'Gumla', enrolled: 48000, applied: 33500, gap: 14500, institutionsCount: 98 },
      { district: 'Khunti', enrolled: 39000, applied: 27000, gap: 12000, institutionsCount: 84 }
    ]
  },
  {
    state: 'Odisha',
    stEnrollmentCount: 510000,
    applicationCount: 398000,
    unreachedCount: 112000,
    coveragePercentage: 78.0,
    highGapDistricts: [
      { district: 'Mayurbhanj', enrolled: 92000, applied: 67000, gap: 25000, institutionsCount: 210 },
      { district: 'Koraput', enrolled: 76000, applied: 52000, gap: 24000, institutionsCount: 165 },
      { district: 'Nabarangpur', enrolled: 64000, applied: 45000, gap: 19000, institutionsCount: 130 },
      { district: 'Malkangiri', enrolled: 52000, applied: 35000, gap: 17000, institutionsCount: 105 }
    ]
  },
  {
    state: 'Madhya Pradesh',
    stEnrollmentCount: 680000,
    applicationCount: 490000,
    unreachedCount: 190000,
    coveragePercentage: 72.1,
    highGapDistricts: [
      { district: 'Alirajpur', enrolled: 85000, applied: 51000, gap: 34000, institutionsCount: 190 },
      { district: 'Jhabua', enrolled: 98000, applied: 63000, gap: 35000, institutionsCount: 220 },
      { district: 'Barwani', enrolled: 72000, applied: 48000, gap: 24000, institutionsCount: 155 }
    ]
  },
  {
    state: 'Chhattisgarh',
    stEnrollmentCount: 390000,
    applicationCount: 304000,
    unreachedCount: 86000,
    coveragePercentage: 77.9,
    highGapDistricts: [
      { district: 'Bastar', enrolled: 62000, applied: 44000, gap: 18000, institutionsCount: 140 },
      { district: 'Dantewada', enrolled: 38000, applied: 26000, gap: 12000, institutionsCount: 92 },
      { district: 'Bijapur', enrolled: 31000, applied: 19500, gap: 11500, institutionsCount: 78 }
    ]
  },
  {
    state: 'Assam',
    stEnrollmentCount: 240000,
    applicationCount: 198000,
    unreachedCount: 42000,
    coveragePercentage: 82.5,
    highGapDistricts: [
      { district: 'Karbi Anglong', enrolled: 58000, applied: 46000, gap: 12000, institutionsCount: 115 },
      { district: 'Dima Hasao', enrolled: 34000, applied: 27500, gap: 6500, institutionsCount: 68 }
    ]
  }
];

// Admin applications dataset
export const ADMIN_SAMPLE_APPLICATIONS: ScholarshipApplication[] = [
  ...INITIAL_APPLICATIONS,
  {
    id: 'APP-MOTA-2025-1104',
    schemeId: 'top-class',
    schemeName: 'Top Class Education for ST Students',
    schemeCode: 'TCE-ST-PREMIER',
    userId: 'usr-st-4491',
    studentName: 'Mangal Gond',
    studentAadhaarMasked: 'XXXX-XXXX-4491',
    studentMobile: '+91 94231 87612',
    studentEmail: 'mangal.gond@iitb.ac.in',
    state: 'Madhya Pradesh',
    district: 'Jhabua',
    subTribe: 'Gond',
    institutionName: 'Indian Institute of Technology (IIT) Bombay',
    institutionUdiseCode: 'AISHE-U-0104',
    course: 'B.Tech in Electrical Engineering',
    currentYearSemester: '1st Year (Semester II)',
    rollNumber: '24BTECH091',
    submittedAnnualIncome: 320000,
    incomeCertificateNo: 'INC/MP/2024/99120',
    selectedDocumentIds: ['doc-1', 'doc-2', 'doc-3'],
    status: 'Approved',
    submittedAt: '2025-01-14T08:20:00Z',
    updatedAt: '2025-01-19T11:00:00Z',
    readinessScore: 100,
    manualReviewRequested: false,
    timeline: [
      { status: 'Submitted', label: 'Submitted', timestamp: '14 Jan 2025', description: 'Application filed.', completed: true },
      { status: 'Under Verification', label: 'Verified', timestamp: '15 Jan 2025', description: 'IIT Bombay admission & JEE Advanced rank cross-checked.', completed: true },
      { status: 'Approved', label: 'Approved by Committee', timestamp: '19 Jan 2025', description: 'Approved for sanction.', completed: true }
    ]
  },
  {
    id: 'APP-MOTA-2025-1219',
    schemeId: 'fellowship',
    schemeName: 'National Fellowship for ST Students (NFST)',
    schemeCode: 'NFST-MPhil-PhD',
    userId: 'usr-st-7822',
    studentName: 'Priyanka Marandi',
    studentAadhaarMasked: 'XXXX-XXXX-7822',
    studentMobile: '+91 97182 34910',
    studentEmail: 'priyanka.marandi@uohyd.ac.in',
    state: 'Odisha',
    district: 'Mayurbhanj',
    subTribe: 'Santhal',
    institutionName: 'University of Hyderabad',
    institutionUdiseCode: 'AISHE-U-0012',
    course: 'Ph.D. in Tribal Studies & Linguistics',
    currentYearSemester: '2nd Year Ph.D.',
    rollNumber: '23PHDLING04',
    submittedAnnualIncome: 0,
    incomeCertificateNo: 'N/A',
    selectedDocumentIds: ['doc-1', 'doc-2', 'doc-4'],
    status: 'Sanctioned',
    submittedAt: '2025-01-08T12:00:00Z',
    updatedAt: '2025-01-17T16:00:00Z',
    readinessScore: 100,
    manualReviewRequested: false,
    timeline: [
      { status: 'Submitted', label: 'Submitted', timestamp: '08 Jan 2025', description: 'Submitted with UGC-NET JRF award letter.', completed: true },
      { status: 'Under Verification', label: 'Verified', timestamp: '10 Jan 2025', description: 'Verified with University of Hyderabad research cell.', completed: true },
      { status: 'Sanctioned', label: 'Sanctioned', timestamp: '17 Jan 2025', description: 'JRF Fellowship @ ₹37,000/mo sanctioned.', completed: true }
    ]
  },
  {
    id: 'APP-MOTA-2025-1402',
    schemeId: 'overseas',
    schemeName: 'National Overseas Scholarship (NOS)',
    schemeCode: 'NOS-ST-GLOBAL',
    userId: 'usr-st-9912',
    studentName: 'Amit Kumar Bhil',
    studentAadhaarMasked: 'XXXX-XXXX-9912',
    studentMobile: '+91 99281 44552',
    studentEmail: 'amit.bhil@oxford.alumni',
    state: 'Rajasthan',
    district: 'Banswara',
    subTribe: 'Bhil',
    institutionName: 'University of Oxford, United Kingdom',
    institutionUdiseCode: 'QS-RANK-003',
    course: 'M.Sc. in Environmental Change and Management',
    currentYearSemester: '1 Year Masters',
    rollNumber: 'OXF-ST-2025-01',
    submittedAnnualIncome: 480000,
    incomeCertificateNo: 'INC/RJ/2024/77182',
    selectedDocumentIds: ['doc-1', 'doc-2', 'doc-3', 'doc-5'],
    status: 'Under Manual Review',
    submittedAt: '2025-01-16T15:10:00Z',
    updatedAt: '2025-01-17T09:40:00Z',
    readinessScore: 80,
    manualReviewRequested: true,
    manualReviewNote: 'Conditional vs unconditional offer letter verification requested for visa issuance stage.',
    timeline: [
      { status: 'Submitted', label: 'Submitted', timestamp: '16 Jan 2025', description: 'Application received with Oxford offer letter.', completed: true },
      { status: 'Under Manual Review', label: 'Under Manual Review', timestamp: '17 Jan 2025', description: 'Overseas Cell verifying foreign tuition invoice schedule.', completed: true }
    ]
  }
];
