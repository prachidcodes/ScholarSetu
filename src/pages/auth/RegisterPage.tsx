import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Phone, 
  MapPin, 
  Layers,
  AlertCircle,
  Calendar,
  Lock,
  Globe2,
  FileBadge
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { aadhaarService } from '../../services/aadhaarService';

const ST_TRIBES = [
  'Santhal',
  'Gond',
  'Bhil',
  'Munda',
  'Oraon',
  'Ho',
  'Khasi',
  'Garo',
  'Bodo',
  'Meena',
  'Chenchu',
  'Toda',
  'Lepcha',
  'Kharia',
  'Baiga',
  'Other Scheduled Tribe'
];

const STATES = [
  { name: 'Jharkhand', districts: ['Ranchi', 'East Singhbhum', 'Dumka', 'Khunti', 'Gumla', 'West Singhbhum'] },
  { name: 'Odisha', districts: ['Mayurbhanj', 'Sundargarh', 'Koraput', 'Rayagada', 'Keonjhar', 'Kandhamal'] },
  { name: 'Chhattisgarh', districts: ['Bastar', 'Dantewada', 'Surguja', 'Kanker', 'Bijapur', 'Sukma'] },
  { name: 'Madhya Pradesh', districts: ['Dhar', 'Barwani', 'Jhabua', 'Mandla', 'Dindori', 'Alirajpur'] },
  { name: 'Assam', districts: ['Kokrajhar', 'Karbi Anglong', 'Dima Hasao', 'Chirang', 'Baksa'] },
  { name: 'Meghalaya', districts: ['East Khasi Hills', 'West Garo Hills', 'Ri-Bhoi', 'South Garo Hills'] },
  { name: 'Rajasthan', districts: ['Banswara', 'Dungarpur', 'Pratapgarh', 'Udaipur'] },
  { name: 'Maharashtra', districts: ['Nandurbar', 'Gadchiroli', 'Palghar', 'Dhule'] }
];

export const RegisterPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    aadhaarNumber: '',
    dateOfBirth: '2004-08-14',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    category: 'ST',
    subTribe: 'Santhal',
    stCertificateNumber: 'JH-ST-2024-998241',
    consent: true
  });

  const [aadhaarValidationState, setAadhaarValidationState] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: false });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'aadhaarNumber') {
      const cleanDigits = value.replace(/\D/g, '');
      if (cleanDigits.length === 12) {
        const check = aadhaarService.validateFormat(cleanDigits);
        setAadhaarValidationState({ isValid: check.isValid, error: check.error });
      } else {
        setAadhaarValidationState({ isValid: false, error: cleanDigits.length > 0 ? 'Enter full 12 digits' : undefined });
      }
    }

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errs.name = 'Full name as per Aadhaar is required';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
      
      const cleanAadhaar = formData.aadhaarNumber.replace(/\D/g, '');
      const aadhaarCheck = aadhaarService.validateFormat(cleanAadhaar);
      if (!aadhaarCheck.isValid) {
        errs.aadhaarNumber = aadhaarCheck.error || 'Enter a valid 12-digit Aadhaar number with valid checksum';
      }
    } else if (step === 2) {
      const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        errs.mobileNumber = 'Enter a valid 10-digit Indian mobile number';
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Enter a valid email address';
      }
      if (!formData.password || formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 3) {
      if (!formData.state) errs.state = 'Please select your state';
      if (!formData.district) errs.district = 'Please select your district';
    } else if (step === 4) {
      if (!formData.subTribe) errs.subTribe = 'Please select your Scheduled Tribe community';
      if (!formData.stCertificateNumber.trim()) {
        errs.stCertificateNumber = 'ST Certificate or acknowledgement number is required';
      }
      if (!formData.consent) errs.consent = 'Consent is required to proceed with registration';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      await registerStudent({
        name: formData.name,
        aadhaarNumber: formData.aadhaarNumber,
        mobileNumber: formData.mobileNumber,
        dateOfBirth: formData.dateOfBirth,
        state: formData.state,
        district: formData.district,
        category: formData.category,
        subTribe: formData.subTribe,
        stCertificateNumber: formData.stCertificateNumber,
        email: formData.email
      });
      navigate('/student/dashboard');
    } catch (err: any) {
      setErrors({ form: err.message || 'Registration failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAadhaarInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const selectedStateObj = STATES.find((s) => s.name === formData.state) || STATES[0];

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top bar with home link and language selector */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-4">
        <Link to="/" className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1">
          ← Back to Homepage
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Globe2 className="w-3.5 h-3.5 text-teal-700" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="text-xs border border-slate-300 rounded px-2 py-0.5 bg-white"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.nativeName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="mx-auto w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xl shadow-md border border-teal-900 mb-2">
          <span className="text-amber-300 font-display">SS</span>
        </div>
        <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
          Scheduled Tribe Student Registration
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Unified Access Platform • Ministry of Tribal Affairs
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="shadow-xl border-slate-200">
          {/* Step Indicator */}
          <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 rounded-t-xl">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Identity' },
                { step: 2, label: 'Contact' },
                { step: 3, label: 'Domicile' },
                { step: 4, label: 'Community' },
                { step: 5, label: 'Confirm' }
              ].map((s, idx) => (
                <div key={s.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep > s.step
                          ? 'bg-teal-800 text-white'
                          : currentStep === s.step
                          ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                          : 'bg-white border border-slate-300 text-slate-400'
                      }`}
                    >
                      {currentStep > s.step ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 mt-1 hidden sm:block">
                      {s.label}
                    </span>
                  </div>
                  {idx < 4 && (
                    <div
                      className={`w-6 sm:w-12 h-0.5 mx-1 transition-colors ${
                        currentStep > s.step ? 'bg-teal-800' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <CardBody className="p-6 sm:p-8">
            {errors.form && (
              <Alert type="error" className="mb-5">
                {errors.form}
              </Alert>
            )}

            {/* STEP 1: Name, DOB & Aadhaar Number */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="w-5 h-5 text-teal-800" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Step 1: Student Identity & Aadhaar Verification
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name (As printed on Aadhaar Card) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Sunita Soren"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                  {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-xs text-rose-600 mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      12-Digit Aadhaar Number *
                    </label>
                    <span className="text-[10px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Verhoeff Checksum
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', formatAadhaarInput(e.target.value))}
                      placeholder="e.g. 5421 8902 4312"
                      maxLength={14}
                      className={`w-full px-3.5 py-2.5 text-sm font-mono tracking-wider rounded-lg border focus:ring-2 focus:outline-none ${
                        aadhaarValidationState.isValid
                          ? 'border-emerald-500 bg-emerald-50/30 focus:ring-emerald-600'
                          : errors.aadhaarNumber
                          ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-600'
                          : 'border-slate-300 focus:ring-teal-700'
                      }`}
                    />
                    {aadhaarValidationState.isValid && (
                      <div className="absolute right-3 top-2.5 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Check className="w-4 h-4" />
                        <span>Valid Format</span>
                      </div>
                    )}
                  </div>

                  {errors.aadhaarNumber && (
                    <p className="text-xs text-rose-600 mt-1">{errors.aadhaarNumber}</p>
                  )}
                  
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Simulated Aadhaar Validation Architecture (Demo). Real numbers are never stored in plain text.
                  </p>
                </div>

                {/* Quick Autofill hint for testing */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block">SIH 2026 Demo Fast-Fill:</span>
                    <span className="text-[11px] text-amber-800">Sunita Soren • Santhal ST • Valid Aadhaar</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange('name', 'Sunita Soren');
                      handleInputChange('dateOfBirth', '2004-08-14');
                      handleInputChange('aadhaarNumber', '5421 8902 4312');
                      handleInputChange('mobileNumber', '9876543210');
                      handleInputChange('email', 'sunita.soren@demo.edu.in');
                      handleInputChange('password', 'Student@123');
                      handleInputChange('confirmPassword', 'Student@123');
                      handleInputChange('stCertificateNumber', 'JH-ST-2024-998241');
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-white border border-amber-300 rounded shadow-2xs hover:bg-amber-100"
                  >
                    Auto-Fill Demo
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Mobile Number, Email & Password */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Phone className="w-5 h-5 text-teal-800" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Step 2: Contact & Security Credentials
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (Aadhaar linked) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 text-sm rounded-r-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-xs text-rose-600 mt-1">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. sunita.soren@demo.edu.in"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Set Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    />
                    {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Re-type password"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                    />
                    {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: State & District */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin className="w-5 h-5 text-teal-800" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Step 3: Domicile & Tribal District
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / UT of Domicile *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => {
                      handleInputChange('state', e.target.value);
                      const s = STATES.find((st) => st.name === e.target.value);
                      if (s && s.districts.length > 0) {
                        handleInputChange('district', s.districts[0]);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none bg-white"
                  >
                    {STATES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none bg-white"
                  >
                    {selectedStateObj.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 4: Category (ST), Sub-Tribe & ST Certificate */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Layers className="w-5 h-5 text-teal-800" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Step 4: Scheduled Tribe (ST) Community & Certificate
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Social Category
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Scheduled Tribe (ST) - Constitution Order (1950)"
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg border border-slate-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-Tribe / Community Name *
                  </label>
                  <select
                    value={formData.subTribe}
                    onChange={(e) => handleInputChange('subTribe', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none bg-white"
                  >
                    {ST_TRIBES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.subTribe && (
                    <p className="text-xs text-rose-600 mt-1">{errors.subTribe}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ST Certificate Number / e-District Acknowledgement *
                  </label>
                  <input
                    type="text"
                    value={formData.stCertificateNumber}
                    onChange={(e) => handleInputChange('stCertificateNumber', e.target.value)}
                    placeholder="e.g. JH-ST-2024-998241"
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-700 focus:outline-none"
                  />
                  {errors.stCertificateNumber && (
                    <p className="text-xs text-rose-600 mt-1">{errors.stCertificateNumber}</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">
                    Will be cross-verified against state caste repository or DigiLocker issued records.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-700"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I hereby give my consent to the Ministry of Tribal Affairs to verify my identity and community credentials using simulated Aadhaar e-KYC and state caste registries.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs text-rose-600 mt-1">{errors.consent}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Confirmation & Profile Creation */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Step 5: Review & Confirm Registration
                  </h3>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Student Name:</span>
                    <span className="font-bold text-slate-800">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-bold text-slate-800">{formData.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Aadhaar (Masked):</span>
                    <span className="font-mono font-bold text-slate-800">
                      XXXX-XXXX-{formData.aadhaarNumber.replace(/\D/g, '').slice(-4) || '5928'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Mobile & Email:</span>
                    <span className="font-bold text-slate-800">{formData.mobileNumber} • {formData.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">State & District:</span>
                    <span className="font-bold text-slate-800">{formData.district}, {formData.state}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Community / ST Cert:</span>
                    <span className="font-bold text-teal-800">ST ({formData.subTribe}) • {formData.stCertificateNumber}</span>
                  </div>
                </div>

                <Alert type="success" title="DigiLocker Integration Ready">
                  Upon registration, your personal DigiLocker wallet will be linked to automatically discover and verify your ST certificates.
                </Alert>
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
              ) : (
                <Link to="/" className="text-xs text-slate-500 hover:text-slate-800">
                  Cancel
                </Link>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  onClick={handleFinalSubmit}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Complete Registration
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-teal-800 font-bold hover:underline">
            Sign In with Credentials
          </Link>
        </p>
      </div>
    </div>
  );
};
