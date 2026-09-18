import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  User, 
  GraduationCap, 
  Banknote, 
  FolderLock, 
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { verificationService } from '../../services/verificationService';
import { ReadinessModal } from '../../components/student/ReadinessModal';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export const ApplyPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { schemes, documents, createApplication } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const scheme = schemes.find((s) => s.id === schemeId) || schemes[1]; // defaults to Post-Matric

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: user?.name || 'Sunita Soren',
    dob: '2004-08-14',
    gender: 'Female',
    mobile: user?.mobileNumber || '9876543210',
    email: user?.email || 'student@demo.com',
    aadhaar: user?.aadhaarNumber || '5421 8902 4312',
    category: user?.category || 'ST',
    subTribe: user?.subTribe || 'Santhal',
    state: user?.state || 'Jharkhand',
    district: user?.district || 'Ranchi',

    // Step 2: Academic
    institutionName: 'Ranchi University, Morabadi Campus',
    courseName: 'B.Sc. Computer Science (Honours)',
    rollNumber: 'RU-CS-2023-049',
    currentYearSemester: '2nd Year (Semester 4)',
    previousYearMarks: '78.5%',

    // Step 3: Income (Demo Default triggers the Income Variance scenario)
    annualFamilyIncome: 200000, // Submitted value: ₹2,00,000 (Registry shows ₹3,50,000)
    incomeCertificateNumber: 'JH/REV/2024/7712',
    incomeIssueDate: '2024-04-10',
    guardianOccupation: 'Agriculture & Forest Produce',

    // Step 4: Documents (IDs from wallet)
    selectedDocIds: documents.map((d) => d.id),

    // Step 5: Notes for manual review if requested
    manualReviewRequested: false,
    manualReviewNote: ''
  });

  // Readiness Engine Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [readinessReport, setReadinessReport] = useState<any>(null);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDoc = (docId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedDocIds.includes(docId);
      return {
        ...prev,
        selectedDocIds: exists
          ? prev.selectedDocIds.filter((id) => id !== docId)
          : [...prev.selectedDocIds, docId]
      };
    });
  };

  // Run the Readiness & Resolution Engine check
  const handleCheckReadiness = async () => {
    setIsVerifying(true);
    try {
      const report = await verificationService.verifyApplicationData(scheme.id, formData);
      setReadinessReport(report);
      setIsReadinessModalOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  // Student selects "Fix Information"
  const handleFixInformation = () => {
    setCurrentStep(3);
  };

  // Student selects "Request Manual Review"
  const handleRequestManualReview = async (note: string) => {
    setFormData((prev) => ({
      ...prev,
      manualReviewRequested: true,
      manualReviewNote: note
    }));
    await submitApplicationData(true, note);
  };

  // Submit Application
  const submitApplicationData = async (manualReview = false, note?: string) => {
    setIsSubmittingFinal(true);
    try {
      const report = readinessReport || (await verificationService.verifyApplicationData(scheme.id, formData));

      const newApp = await createApplication({
        schemeId: scheme.id,
        schemeName: scheme.name,
        studentId: user?.id || 'usr-st-9021',
        studentName: formData.name,
        aadhaarNumber: formData.aadhaar,
        state: formData.state,
        annualIncome: Number(formData.annualFamilyIncome),
        institutionName: formData.institutionName,
        courseName: formData.courseName,
        status: manualReview ? 'Under Manual Review' : 'Under Verification',
        readinessScore: report.overallScore,
        readinessReport: {
          ...report,
          manualReviewRequested: manualReview,
          manualReviewNote: note || formData.manualReviewNote
        },
        documents: documents.filter((d) => formData.selectedDocIds.includes(d.id)),
        timeline: [
          {
            status: 'Submitted',
            label: 'Application Submitted',
            timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            description: `Application submitted for ${scheme.name}. Auto-cross verification initiated.`,
            completed: true
          },
          {
            status: manualReview ? 'Under Manual Review' : 'Under Verification',
            label: manualReview ? 'Assigned for Manual Review' : 'Registry Verification',
            timestamp: 'Just now',
            description: manualReview
              ? 'Transferred to District Welfare Officer (DWO) for physical revenue certificate validation.'
              : 'Verifying with UIDAI, e-District, and Income Tax registries.',
            completed: false
          },
          {
            status: 'Sanctioned',
            label: 'Ministry Sanction Order',
            timestamp: 'Pending',
            description: 'Sanction order and PFMS digital mandate generation.',
            completed: false
          },
          {
            status: 'Disbursed',
            label: 'Direct Benefit Transfer (DBT)',
            timestamp: 'Pending',
            description: 'Aadhaar Payment Bridge transfer to beneficiary bank account.',
            completed: false
          }
        ]
      });

      setCreatedAppId(newApp.id);
      setCurrentStep(6); // Step 6: Confirmation Screen
    } finally {
      setIsSubmittingFinal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Scheme Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/student/scholarships"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('nav.scholarships', 'Back to Schemes')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight">
              {t('scholarships.applyNow', 'Application for')} {scheme.name}
            </h1>
            <Badge variant="saffron" size="sm">{scheme.code}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Ministry of Tribal Affairs • Government of India</p>
        </div>
      </div>

      {/* Step Indicator */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Personal' },
            { step: 2, label: 'Academic' },
            { step: 3, label: 'Income' },
            { step: 4, label: 'Documents' },
            { step: 5, label: 'Readiness & Review' },
            { step: 6, label: 'Submitted' }
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep > s.step || (currentStep === 6 && s.step === 6)
                      ? 'bg-teal-800 text-white'
                      : currentStep === s.step
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                      : 'bg-white border border-slate-300 text-slate-400'
                  }`}
                >
                  {currentStep > s.step ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 mt-1 hidden md:block">
                  {s.label}
                </span>
              </div>
              {idx < 5 && (
                <div
                  className={`w-4 sm:w-10 h-0.5 mx-1 transition-colors ${
                    currentStep > s.step ? 'bg-teal-800' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Steps Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardBody className="p-6 sm:p-8">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step 1: Student Demographics & Aadhaar Verification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (as on Aadhaar) *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aadhaar Number (12-Digit) *</label>
                  <input
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    className="w-full px-3 py-2 font-mono border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scheduled Tribe Community *</label>
                  <input
                    type="text"
                    value={`${formData.category} (${formData.subTribe})`}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border text-slate-600 rounded-lg cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domicile State *</label>
                  <input
                    type="text"
                    value={`${formData.district}, ${formData.state}`}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border text-slate-600 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Institution & Academic Information */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <GraduationCap className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step 2: Institution & Academic Enrolment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institution / University Name (AISHE Accredited) *
                  </label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course / Degree Program *</label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => handleInputChange('courseName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll / Enrolment Number *</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    className="w-full px-3 py-2 font-mono border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Year / Semester *</label>
                  <input
                    type="text"
                    value={formData.currentYearSemester}
                    onChange={(e) => handleInputChange('currentYearSemester', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Previous Year Marks / Percentage *</label>
                  <input
                    type="text"
                    value={formData.previousYearMarks}
                    onChange={(e) => handleInputChange('previousYearMarks', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Income & Family Information */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Banknote className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step 3: Family Income & Revenue Certificate Details
                </h3>
              </div>

              <Alert type="info" title="Revenue Verification Engine Notice">
                Enter your total gross family income as certified by your local revenue authority (Tahsildar / SDM). The system cross-references this with government revenue and tax registries.
              </Alert>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Annual Family Income (in ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.annualFamilyIncome}
                      onChange={(e) => handleInputChange('annualFamilyIncome', Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-teal-700 bg-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ceiling for {scheme.name}: ≤ ₹{(scheme.maxAnnualIncome / 100000).toFixed(1)} Lakh/yr
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Income Certificate Number *
                  </label>
                  <input
                    type="text"
                    value={formData.incomeCertificateNumber}
                    onChange={(e) => handleInputChange('incomeCertificateNumber', e.target.value)}
                    className="w-full px-3 py-2 font-mono border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certificate Issue Date *</label>
                  <input
                    type="date"
                    value={formData.incomeIssueDate}
                    onChange={(e) => handleInputChange('incomeIssueDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Occupation *</label>
                  <input
                    type="text"
                    value={formData.guardianOccupation}
                    onChange={(e) => handleInputChange('guardianOccupation', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Document Selection */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FolderLock className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step 4: Select Verified Documents from Wallet
                </h3>
              </div>

              <p className="text-xs text-slate-600">
                Select from your DigiLocker verified documents to attach to this application:
              </p>

              <div className="space-y-2.5">
                {documents.map((doc) => {
                  const isSelected = formData.selectedDocIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => handleToggleDoc(doc.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                        isSelected ? 'bg-teal-50/50 border-teal-700/60 ring-1 ring-teal-700/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-700"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                          <p className="text-[11px] text-slate-500">
                            Issued by: {doc.issuingAuthority} • {doc.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <Badge variant="success" size="sm">
                        {t('docs.verified', 'Verified')}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Application Readiness Engine */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-slate-900 text-base">
                  Step 5: Pre-Submission Application Readiness Check
                </h3>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Application Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Applicant:</strong> {formData.name}</div>
                  <div><strong>Aadhaar:</strong> {formData.aadhaar}</div>
                  <div><strong>Institution:</strong> {formData.institutionName}</div>
                  <div><strong>Course:</strong> {formData.courseName}</div>
                  <div><strong>Declared Income:</strong> ₹{formData.annualFamilyIncome.toLocaleString('en-IN')}/year</div>
                  <div><strong>ST Community:</strong> {formData.category} ({formData.subTribe})</div>
                </div>
              </div>

              {/* READINESS ENGINE HERO CALLOUT */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-300/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>{t('mismatch.title', 'Application Readiness & Resolution Engine')}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before you submit to the Ministry, run our real-time cross-verification engine. ScholarSetu compares your declared information against UIDAI, e-District, and revenue records to prevent processing delays.
                </p>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="saffron"
                    size="md"
                    isLoading={isVerifying}
                    onClick={handleCheckReadiness}
                    leftIcon={<ShieldCheck className="w-4 h-4 text-white" />}
                  >
                    {t('readiness.checkButton', 'Check Application Readiness')}
                  </Button>
                </div>
              </div>

              {/* Report summary if already run */}
              {readinessReport && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">Latest Readiness Check:</span>
                    <Badge variant={readinessReport.hasMismatch ? 'warning' : 'success'} size="sm">
                      {t('readiness.score', 'Readiness Score')}: {readinessReport.overallScore}%
                    </Badge>
                  </div>
                  <p className="text-slate-600">{readinessReport.summary}</p>
                  <button
                    type="button"
                    onClick={() => setIsReadinessModalOpen(true)}
                    className="text-xs font-bold text-teal-800 underline mt-2 block"
                  >
                    View Full Verification Details Report →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {currentStep === 6 && createdAppId && (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                Application Successfully Submitted!
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-xs space-y-1">
                <span className="text-slate-500 uppercase font-semibold">Official Application Reference</span>
                <p className="font-mono text-lg font-bold text-teal-800">{createdAppId}</p>
                <p className="text-slate-600">Scheme: {scheme.name}</p>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your application has entered the unified verification pipeline. You can track each stage live on your tracker timeline.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate(`/student/applications/${createdAppId}`)}
                >
                  Track Application Status
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/student/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}

          {/* Form Step Buttons */}
          {currentStep < 6 && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  {t('common.previous', 'Previous')}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t('common.next', 'Save & Continue')}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingFinal}
                  onClick={() => submitApplicationData(false)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Submit Application Directly
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Application Readiness & Resolution Engine Modal */}
      {readinessReport && (
        <ReadinessModal
          isOpen={isReadinessModalOpen}
          onClose={() => setIsReadinessModalOpen(false)}
          report={readinessReport}
          onFixInformation={handleFixInformation}
          onRequestManualReview={handleRequestManualReview}
          onSubmitDirectly={() => submitApplicationData(false)}
        />
      )}
    </div>
  );
};
