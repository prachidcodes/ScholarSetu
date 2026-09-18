import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'or' | 'te' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

export const FUTURE_TRIBAL_LANGUAGES = [
  'Santali (Ol Chiki)',
  'Gondi',
  'Bhili',
  'Ho (Warang Chiti)',
  'Mundari',
  'Khasi',
  'Garo',
  'Mizo'
];

interface TranslationDictionary {
  [key: string]: Record<SupportedLanguage, string>;
}

export const TRANSLATIONS: TranslationDictionary = {
  // Brand & Header
  'app.name': {
    en: 'ScholarSetu',
    hi: 'स्कॉलरशिपसेतु',
    mr: 'स्कॉलरशिपसेतू',
    gu: 'સ્કોલરસેતુ',
    bn: 'স্কলারসেতু',
    or: 'ସ୍ମଲରସେତୁ',
    te: 'స్కాలర్‌సేతు',
    ta: 'ஸ்காலர்சேது'
  },
  'app.subheading': {
    en: 'Unified Scholarship Access Platform for Scheduled Tribe Students',
    hi: 'अनुसूचित जनजाति (एसटी) छात्रों के लिए एकीकृत छात्रवृत्ति मंच',
    mr: 'अनुसूचित जमाती (एसटी) विद्यार्थ्यांसाठी एकत्रित शिष्यवृत्ती व्यासपीठ',
    gu: 'અનુસૂચિત જનજાતિ (ST) વિદ્યાર્થીઓ માટે સંકલિત શિષ્યવૃત્તિ મંચ',
    bn: 'তফসিলি উপজাতি (এসটি) শিক্ষার্থীদের জন্য সমন্বিত বৃত্তি প্ল্যাটফর্ম',
    or: 'ଅନୁସୂଚିତ ଜନଜାତି (ST) ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଏକୀକୃତ ବୃତ୍ତି ପୋର୍ଟାଲ',
    te: 'షెడ్యూల్డ్ తెగల (ST) విద్యార్థుల కోసం సమగ్ర స్కాలర్‌షిప్ వేదిక',
    ta: 'பழங்குடியின (ST) மாணவர்களுக்கான ஒருங்கிணைந்த உதவித்தொகை தளம்'
  },
  'nav.home': {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्यपृष्ठ',
    gu: 'હોમ',
    bn: 'হোম',
    or: 'ମୁଖ୍ୟପୃଷ୍ଠା',
    te: 'హోమ్',
    ta: 'முகப்பு'
  },
  'nav.scholarships': {
    en: 'Scholarships',
    hi: 'छात्रवृत्तियां',
    mr: 'शिष्यवृत्ती',
    gu: 'શિષ્યવૃત્તિઓ',
    bn: 'বৃত্তি সমূহ',
    or: 'ବୃତ୍ତି',
    te: 'స్కాలర్‌షిప్‌లు',
    ta: 'உதவித்தொகைகள்'
  },
  'nav.howItWorks': {
    en: 'How It Works',
    hi: 'प्रक्रिया कैसे काम करती है',
    mr: 'कसे कार्य करते',
    gu: 'કેવી રીતે કાર્ય કરે છે',
    bn: 'কীভাবে কাজ করে',
    or: 'କିପରି କାର୍ଯ୍ୟ କରେ',
    te: 'ఇది ఎలా పనిచేస్తుంది',
    ta: 'எவ்வாறு செயல்படுகிறது'
  },
  'nav.about': {
    en: 'About',
    hi: 'के बारे में',
    mr: 'विषयी',
    gu: 'વિશે',
    bn: 'সম্পর্কে',
    or: 'ବିଷୟରେ',
    te: 'గురించి',
    ta: 'பற்றி'
  },
  'nav.signIn': {
    en: 'Sign In',
    hi: 'साइन इन करें',
    mr: 'साइन इन',
    gu: 'સાઇન ઇન',
    bn: 'সাইন ইন',
    or: 'ସାଇନ୍ ଇନ୍',
    te: 'సైన్ ఇన్',
    ta: 'உள்நுழைக'
  },
  'nav.createAccount': {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    mr: 'खाते तयार करा',
    gu: 'ખાતું બનાવો',
    bn: 'অ্যাকাউন্ট তৈরি করুন',
    or: 'ଖାତା ଖୋଲନ୍ତୁ',
    te: 'ఖాతా సృష్టించండి',
    ta: 'கணக்கு தொடங்குக'
  },
  'nav.dashboard': {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    mr: 'डॅशबोर्ड',
    gu: 'ડેશબોર્ડ',
    bn: 'ড্যাশবোর্ড',
    or: 'ଡ୍ୟାସବୋର୍ଡ',
    te: 'డాష్‌బోర్డ్',
    ta: 'முகப்பு பலகை'
  },
  // Hero section
  'hero.headline': {
    en: 'One Place for Every Scholarship Opportunity',
    hi: 'प्रत्येक छात्रवृत्ति अवसर के लिए एक एकीकृत स्थान',
    mr: 'प्रत्येक शिष्यवृत्ती संधीसाठी एकच व्यासपीठ',
    gu: 'દરેક શિષ્યવૃત્તિ તક માટે એક જ વિશ્વસનીય સ્થળ',
    bn: 'প্রতিটি বৃত্তি সুযোগের জন্য একটি সমন্বিত স্থান',
    or: 'ପ୍ରତ୍ୟେକ ବୃତ୍ତି ସୁଯୋଗ ପାଇଁ ଏକ ସ୍ଥାନ',
    te: 'ప్రతి స్కాలర్‌షిప్ అవకాశం కోసం ఒకే వేదిక',
    ta: 'ஒவ்வொரு உதவித்தொகை வாய்ப்புக்கும் ஒரே தளம்'
  },
  'hero.subcopy': {
    en: 'ScholarSetu brings scholarship discovery, document readiness, verification guidance, and application tracking into one student-friendly experience for Scheduled Tribe students.',
    hi: 'स्कॉलरशिपसेतु अनुसूचित जनजाति (ST) छात्रों के लिए छात्रवृत्ति खोज, दस्तावेज़ तत्परता, सत्यापन मार्गदर्शन और आवेदन ट्रैकिंग को एक छात्र-अनुकूल अनुभव में लाता है।',
    mr: 'स्कॉलरशिपसेतू अनुसूचित जमाती (ST) विद्यार्थ्यांसाठी शिष्यवृत्ती शोध, कागदपत्रांची तयारी, पडताळणी मार्गदर्शन आणि अर्ज ट्रॅकिंग एकाच ठिकाणी उपलब्ध करून देतो.',
    gu: 'સ્કોલરસેતુ અનુસૂચિત જનજાતિ (ST) વિદ્યાર્થીઓ માટે શિષ્યવૃત્તિ શોધ, દસ્તાવેજ સજ્જતા, ચકાસણી માર્ગદર્શન અને અરજી ટ્રેકિંગને એક જ સ્થળે લાવે છે.',
    bn: 'স্কলারসেতু তফসিলি উপজাতি (এসটি) শিক্ষার্থীদের জন্য বৃত্তি সন্ধান, নথির প্রস্তুতি, যাচাইকরণ নির্দেশিকা এবং আবেদন ট্র্যাকিং এক ছাতার নিচে নিয়ে আসে।',
    or: 'ସ୍କଲରସେତୁ ଅନୁସୂଚିତ ଜନଜାତି (ST) ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ବୃତ୍ତି ସନ୍ଧାନ, ଦଲିଲ ପ୍ରସ୍ତୁତି, ଯାଞ୍ଚ ମାର୍ଗଦର୍ଶନ ଓ ଆବେଦନ ଟ୍ରାକିଂକୁ ସହଜ କରେ।',
    te: 'షెడ్యూల్డ్ తెగల (ST) విద్యార్థుల కోసం స్కాలర్‌షిప్ అన్వేషణ, డాక్యుమెంట్ల సన్నద్ధత, ధృవీకరణ మార్గదర్శకత్వం మరియు దరఖాస్తు ట్రాకింగ్‌ను స్కాలర్‌సేతు ఒకే చోట అందిస్తుంది.',
    ta: 'பழங்குடியின (ST) மாணவர்களுக்கான உதவித்தொகை கண்டறிதல், ஆவண தயாரிப்பு, சரிபார்ப்பு வழிகாட்டுதல் மற்றும் விண்ணப்பக் கண்காணிப்பை ஸ்காலர்சேது எளிதாக்குகிறது.'
  },
  'hero.cta.explore': {
    en: 'Explore Scholarships',
    hi: 'छात्रवृत्तियां देखें',
    mr: 'शिष्यवृत्ती शोधा',
    gu: 'શિષ્યવૃત્તિઓ જુઓ',
    bn: 'বৃত্তি অন্বেষণ করুন',
    or: 'ବୃତ୍ତି ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
    te: 'స్కాలర్‌షిప్‌లను అన్వేషించండి',
    ta: 'உதவித்தொகைகளை ஆராய்க'
  },
  'hero.cta.create': {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    mr: 'नोंदणी करा',
    gu: 'ખાતું બનાવો',
    bn: 'অ্যাকাউন্ট তৈরি করুন',
    or: 'ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ',
    te: 'ఖాతా సృష్టించండి',
    ta: 'கணக்கு தொடங்குக'
  },
  'hero.alreadyAccount': {
    en: 'Already have an account? Sign In',
    hi: 'पहले से खाता है? साइन इन करें',
    mr: 'आधीच खाते आहे? साइन इन करा',
    gu: 'પહેલેથી ખાતું છે? સાઇન ઇન કરો',
    bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন',
    or: 'ପୂର୍ବରୁ ଖାତା ଅଛି କି? ସାଇନ୍ ଇନ୍ କରନ୍ତୁ',
    te: 'ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి',
    ta: 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக'
  },
  // Problem section
  'problem.heading': {
    en: "Scholarships Shouldn't Feel Fragmented",
    hi: 'छात्रवृत्ति प्राप्त करना जटिल और बिखरा हुआ नहीं होना चाहिए',
    mr: 'शिष्यवृत्ती मिळवणे गुंतागुंतीचे वाटू नये',
    gu: 'શિષ્યવૃત્તિ મેળવવી મુશ્કેલ કે વિભાજિત ન લાગવી જોઈએ',
    bn: 'বৃত্তি প্রাপ্তি জটিল বা বিচ্ছিন্ন হওয়া উচিত নয়',
    or: 'ବୃତ୍ତି ଆବେଦନ କଷ୍ଟକର ଅନୁଭବ ହେବା ଉଚିତ୍ ନୁହେଁ',
    te: 'స్కాలర్‌షిప్‌లు గందరగోళంగా ఉండకూడదు',
    ta: 'உதவித்தொகை பெறுவது சிக்கலானதாக இருக்கக்கூடாது'
  },
  // Mismatch philosophy
  'mismatch.philosophy': {
    en: 'An information mismatch is a signal to review — not an automatic rejection.',
    hi: 'जानकारी में कोई अंतर समीक्षा का संकेत है - स्वचालित अस्वीकृति नहीं।',
    mr: 'माहितीतील तफावत म्हणजे पुनरावलोकनाचा संकेत आहे - स्वयंचलित नकार नाही.',
    gu: 'માહિતીમાં વિસંગતતા એ સમીક્ષા કરવાનો સંકેત છે - આપમેળે અસ્વીકાર નથી.',
    bn: 'তথ্যের অমিল পর্যালোচনার একটি সংকেত — সরাসরি বাতিল নয়।',
    or: 'ତଥ୍ୟର ଅମେଳ ସମୀକ୍ଷା ପାଇଁ ଏକ ସଙ୍କେତ — ସ୍ୱତଃପ୍ରବୃତ୍ତ ଖାରଜ ନୁହେଁ।',
    te: 'సమాచార వ్యత్యాసం సమీక్షకు సంకేతం — ఆటోమేటిక్ తిరస్కరణ కాదు.',
    ta: 'தகவல் முரண்பாடு என்பது மறுபரிசீலனைக்கான அடையாளம் — தானியங்கி நிராகரிப்பு அல்ல.'
  },
  'action.fixInfo': {
    en: 'Fix Information',
    hi: 'जानकारी सुधारें',
    mr: 'माहिती दुरुस्त करा',
    gu: 'માહિતી સુધારો',
    bn: 'তথ্য সংশোধন করুন',
    or: 'ତଥ୍ୟ ସଂଶୋଧନ କରନ୍ତୁ',
    te: 'సమాచారాన్ని సరిచేయండి',
    ta: 'தகவலை சரிசெய்க'
  },
  'action.requestManualReview': {
    en: 'Request Manual Review',
    hi: 'मैन्युअल समीक्षा का अनुरोध करें',
    mr: 'मॅन्युअल पुनरावलोकनाची विनंती करा',
    gu: 'મેન્યુઅલ સમીક્ષાની વિનંતી કરો',
    bn: 'ম্যানুয়াল পর্যালোচনার অনুরোধ করুন',
    or: 'ମାନୁଆଲ୍ ସମୀକ୍ଷା ଅନୁରୋଧ କରନ୍ତୁ',
    te: 'మాన్యువల్ సమీక్షను అభ్యర్థించండి',
    ta: 'கைமுறை மதிப்பாய்வைக் கோருக'
  },
  // Footer disclaimer
  'footer.disclaimer': {
    en: 'ScholarSetu is a Smart India Hackathon 2026 prototype. Government service integrations shown in the prototype may be simulated and do not represent live government verification or authorization.',
    hi: 'स्कॉलरशिपसेतु स्मार्ट इंडिया हैकथॉन 2026 का एक प्रोटोटाइप है। प्रोटोटाइप में दिखाए गए सरकारी सेवा एकीकरण सिमुलेटेड हो सकते हैं और आधिकारिक लाइव सरकारी सत्यापन या अनुमोदन का प्रतिनिधित्व नहीं करते हैं।',
    mr: 'स्कॉलरशिपसेतू हे स्मार्ट इंडिया हॅकाथॉन 2026 चे प्रोटोटाइप आहे. प्रणालीतील शासकीय सेवांचे एकत्रीकरण प्रात्यक्षिकासाठी असू शकते आणि ते थेट शासकीय पडताळणी दर्शवत नाही.',
    gu: 'સ્કોલરસેતુ સ્માર્ટ ઇન્ડિયા હેકાથોન 2026 નું એક પ્રોટોટાઇપ છે. પ્રોટોટાઇપમાં દર્શાવેલ સરકારી સેવાઓ ડેમો હેતુ માટે હોઈ શકે છે.',
    bn: 'স্কলারসেতু স্মার্ট ইন্ডিয়া হ্যাকাথন ২০২৬-এর একটি প্রোটোটাইপ। প্রদর্শিত সরকারি পরিষেবাগুলি নমুনা হতে পারে এবং সরাসরি অনুমোদন বোঝায় না।',
    or: 'ସ୍କଲରସେତୁ ସ୍ମାର୍ଟ ଇଣ୍ଡିଆ ହ୍ୟାକାଥନ୍ ୨୦୨୬ ର ଏକ ପ୍ରୋଟୋଟାଇପ୍। ଦର୍ଶାଯାଇଥିବା ସରକାରୀ ସେବା ସିମୁଲେଟେଡ୍ ହୋଇପାରେ।',
    te: 'స్కాలర్‌సేతు అనేది స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 నమూనా ప్రాజెక్ట్. ఇందులో చూపబడిన ప్రభుత్వ సేవలు డెమో కోసం ఉద్దేశించినవి.',
    ta: 'ஸ்காலர்சேது என்பது ஸ்மார்ட் இந்தியா ஹேக்கத்தான் 2026 மாதிரி வடிவம். காட்டப்படும் அரசு சேவைகள் மாதிரி நோக்கங்களுக்கானவை.'
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
  isTribalLanguageNoticeOpen: boolean;
  setIsTribalLanguageNoticeOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('scholarsetu_lang') as SupportedLanguage;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const [isTribalLanguageNoticeOpen, setIsTribalLanguageNoticeOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('scholarsetu_lang', language);
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (entry && entry['en']) {
      return entry['en'];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
        isTribalLanguageNoticeOpen,
        setIsTribalLanguageNoticeOpen
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
