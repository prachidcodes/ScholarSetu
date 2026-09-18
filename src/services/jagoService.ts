import { JagoChatMessage, ScholarshipApplication, UserProfile } from '../types';
import type { SupportedLanguage } from '../translations';

export const jagoService = {
  getInitialGreeting(
    user: UserProfile | null,
    latestApp?: ScholarshipApplication,
    language: SupportedLanguage = 'en',
    t?: (key: string, fallback?: string) => string
  ): JagoChatMessage[] {
    const studentFirstName = user?.name ? user.name.split(' ')[0] : 'Scholar';
    const tr = t || ((k: string, fb?: string) => fb || k);

    let contextualSnippet = tr(
      'jago.welcomeDefault',
      'Namaste! I am JAGO, your dedicated Ministry of Tribal Affairs assistant. You can ask me about application status, scheme criteria, DigiLocker verification, or DBT disbursement.'
    );

    if (latestApp && latestApp.status === 'Under Verification' && latestApp.readinessReport?.hasMismatch) {
      contextualSnippet = tr(
        'jago.welcomeMismatch',
        `Namaste ${studentFirstName}! I noticed your **${latestApp.schemeName}** application has an income verification query. How can I assist you in resolving it?`
      );
    } else if (latestApp && latestApp.status === 'Under Manual Review') {
      contextualSnippet = tr(
        'jago.welcomeManualReview',
        `Namaste ${studentFirstName}! Your **${latestApp.schemeName}** application is currently under manual review with the District Welfare Officer.`
      );
    }

    return [
      {
        id: 'msg-jago-welcome',
        sender: 'jago',
        text: `${contextualSnippet}`,
        timestamp: 'Just now',
        quickActions: [
          { label: tr('jago.qFlagged', 'Why is my application flagged?'), action: 'why_flagged' },
          { label: tr('jago.qDisbursement', 'Check my disbursement status'), action: 'disbursement_status' },
          { label: tr('jago.qManualReview', 'How does Manual Review work?'), action: 'manual_review_info' },
          { label: tr('jago.qOneScholarship', 'What is the One-Scholarship Rule?'), action: 'one_scholarship_rule' }
        ]
      }
    ];
  },

  async processUserMessage(
    userMessage: string,
    context: {
      user: UserProfile | null;
      applications: ScholarshipApplication[];
      activeApp?: ScholarshipApplication;
      language?: SupportedLanguage;
      t?: (key: string, fallback?: string) => string;
    }
  ): Promise<JagoChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lang = context.language || 'en';
    const tr = context.t || ((k: string, fb?: string) => fb || k);
    const q = userMessage.toLowerCase().trim();
    const apps = context.applications || [];
    const latestApp = context.activeApp || apps[0];
    const studentName = context.user?.name || 'Scholar';

    // Check for query intent
    const isFlaggedQuery =
      q.includes('flag') ||
      q.includes('mismatch') ||
      q.includes('query') ||
      q.includes('issue') ||
      q.includes('अंतर') ||
      q.includes('तफावत') ||
      q.includes('તફાવત') ||
      q.includes('পার্থক্য') ||
      q.includes('ତାରତମ୍ୟ') ||
      q.includes('తేడా') ||
      q.includes('முரண்பாடு') ||
      (q.includes('why') && (q.includes('pending') || q.includes('reject')));

    const isDisbursementQuery =
      q.includes('disburse') ||
      q.includes('money') ||
      q.includes('payment') ||
      q.includes('dbt') ||
      q.includes('bank') ||
      q.includes('pfms') ||
      q.includes('पैसा') ||
      q.includes('रक्कम') ||
      q.includes('નાણાં') ||
      q.includes('টাকা') ||
      q.includes('ଟଙ୍କା') ||
      q.includes('డబ్బులు') ||
      q.includes('பணம்');

    const isManualReviewQuery =
      q.includes('manual') ||
      q.includes('review') ||
      q.includes('officer') ||
      q.includes('dwo') ||
      q.includes('समीक्षा') ||
      q.includes('પુનરાવલોકન') ||
      q.includes('পর্যালোচনা') ||
      q.includes('ପର୍ଯ୍ୟାଲୋଚନା') ||
      q.includes('సమీక్ష') ||
      q.includes('மறுஆய்வு');

    const isOneScholarshipQuery =
      q.includes('one scholarship') ||
      q.includes('multiple') ||
      q.includes('एक छात्रवृत्ति') ||
      q.includes('एक शिष्यवृत्ती') ||
      q.includes('એક શિષ્યવૃત્તિ') ||
      q.includes('একটি স্কলারশিপ') ||
      q.includes('ଗୋଟିଏ ଛାତ୍ରବୃତ୍ତି') ||
      q.includes('ఒకటి స్కాలర్‌షిప్') ||
      q.includes('ஒரு உதவித்தொகை');

    const isSchemesQuery =
      q.includes('scheme') ||
      q.includes('scholarship') ||
      q.includes('योजना') ||
      q.includes('શિષ્યવૃત્તિ') ||
      q.includes('স্কলারশিপ') ||
      q.includes('ଛାତ୍ରବୃତ୍ତି') ||
      q.includes('స్కాలర్‌షిప్') ||
      q.includes('உதவித்தொகை') ||
      q.includes('pre-matric') ||
      q.includes('post-matric') ||
      q.includes('top class') ||
      q.includes('fellowship') ||
      q.includes('overseas');

    const isDocumentsQuery =
      q.includes('digilocker') ||
      q.includes('document') ||
      q.includes('certificate') ||
      q.includes('दस्तावेज़') ||
      q.includes('कागदपत्रे') ||
      q.includes('દસ્તાવેજ') ||
      q.includes('নথি') ||
      q.includes('ଦସ୍ତାବିଜ') ||
      q.includes('పత్రాలు') ||
      q.includes('ஆவணங்கள்');

    // 1. Mismatch / Flagged Query
    if (isFlaggedQuery) {
      if (latestApp && latestApp.readinessReport?.hasMismatch) {
        const incomeField = latestApp.readinessReport.fields.find((f) => f.fieldName === 'annualIncome');
        const submitted = incomeField?.submittedValue || '₹2,00,000';
        const verified = incomeField?.verifiedValue || '₹3,50,000';

        const responses: Record<SupportedLanguage, string> = {
          en: `**Regarding your ${latestApp.schemeName} (ID: ${latestApp.id}):**\n\nYour application has an **income review signal**. Declared: **${submitted}**, while central records show **${verified}**.\n\nUnder ScholarSetu guidelines, this is **NOT an automatic rejection**. You can:\n1. **Fix Information** if a clerical error was made.\n2. **Request Manual Review** so the District Welfare Officer verifies your physical Tahsildar certificate without losing your place.`,
          hi: `**आपके ${latestApp.schemeName} (ID: ${latestApp.id}) के संबंध में:**\n\nआपके आवेदन में **आय अंतर संकेत** पाया गया है। आपने **${submitted}** घोषित किया था, जबकि केंद्रीय रिकॉर्ड में **${verified}** है।\n\nस्कॉलरसेतु नियमों के तहत यह **अस्वीकृति नहीं है**। आप:\n1. **जानकारी सुधारें** यदि कोई लिपिकीय त्रुटि हुई हो।\n2. **मैन्युअल समीक्षा का अनुरोध करें** ताकि जिला कल्याण अधिकारी आपके वास्तविक प्रमाणपत्र की पुष्टि कर सकें।`,
          mr: `**आपल्या ${latestApp.schemeName} (ID: ${latestApp.id}) बाबत:**\n\nआपल्या अर्जात **उत्पन्नातील तफावत** आढळली आहे. आपण **${submitted}** दर्शवले होते, तर केंद्रीय नोंदीत **${verified}** आहे.\n\nस्कॉलरसेतू नियमांनुसार हा **नकार नाही**. आपण:\n1. **माहिती दुरुस्त करा** (टंकलेखन चूक असल्यास).\n2. **मॅन्युअल पुनरावलोकन विनंती करा** जेणेकरून जिल्हा कल्याण अधिकारी मूळ प्रमाणपत्राची पडताळणी करतील.`,
          gu: `**તમારી ${latestApp.schemeName} (ID: ${latestApp.id}) વિશે:**\n\nતમારી અરજીમાં **આવક તફાવત** જોવા મળ્યો છે. ઘોષિત: **${submitted}**, કેન્દ્રીય રેકોર્ડ: **${verified}**.\n\nઆ **અસ્વીકાર નથી**. તમે:\n1. **માહિતી સુધારો** (જો ભૂલ થઈ હોય).\n2. **મેન્યુઅલ રિવ્યુ વિનંતી કરો** જેથી કલ્યાણ અધિકારી ભૌતિક પ્રમાણપત્ર ચકાસી શકે.`,
          bn: `**আপনার ${latestApp.schemeName} (ID: ${latestApp.id}) সম্পর্কে:**\n\nআপনার আবেদনে **আয়ের তথ্যগত পার্থক্য** দেখা গেছে। ঘোষিত: **${submitted}**, কেন্দ্রীয় রেকর্ড: **${verified}**।\n\nএটি কোনো **বাতিলকরণ নয়**। আপনি:\n1. **তথ্য সংশোধন করুন** যদি টাইপিং ভুল থাকে।\n2. **ম্যানুয়াল পর্যালোচনার আবেদন করুন** যাতে জেলা কল্যাণ আধিকারিক আসল শংসাপত্র যাচাই করেন।`,
          or: `**ଆପଣଙ୍କ ${latestApp.schemeName} (ID: ${latestApp.id}) ବିଷୟରେ:**\n\nଆବେଦନରେ **ଆୟ ତାରତମ୍ୟ** ଚିହ୍ନଟ ହୋଇଛି। ଆପଣ ଦେଇଥିବା ଆୟ: **${submitted}**, କେନ୍ଦ୍ରୀୟ ରେକର୍ଡ: **${verified}**।\n\nଏହା **ବାତିଲ ନୁହେଁ**। ଆପଣ:\n1. **ତଥ୍ୟ ସଂଶୋଧନ କରନ୍ତୁ**।\n2. **ମାନୁଆଲ ଯାଞ୍ଚ ଅନୁରୋଧ କରନ୍ତୁ** ଯାହାଦ୍ୱାରା ଅଧିକାରୀ ଆପଣଙ୍କ ପ୍ରମାଣପତ୍ର ଯାଞ୍ଚ କରିବେ।`,
          te: `**మీ ${latestApp.schemeName} (ID: ${latestApp.id}) కి సంబంధించి:**\n\nమీ దరఖాస్తులో **ఆదాయ తేడా** గమనించబడింది. మీరు తెలిపినది: **${submitted}**, రికార్డుల్లో: **${verified}**.\n\nఇది **తిరస్కరణ కాదు**. మీరు:\n1. **సమాచారాన్ని సరిచేయండి** (తప్పుగా నమోదు చేసినట్లయితే).\n2. **మాన్యువల్ సమీక్షను అభ్యర్థించండి** సంక్షేమ అధికారి పరిశీలించడానికి.`,
          ta: `**உங்கள் ${latestApp.schemeName} (ID: ${latestApp.id}) குறித்து:**\n\nவிண்ணப்பத்தில் **வருமான முரண்பாடு** கண்டறியப்பட்டுள்ளது. நீங்கள் குறிப்பிட்டது: **${submitted}**, மத்திய பதிவேட்டில்: **${verified}**.\n\nஇது **நிராகரிப்பு அல்ல**. நீங்கள்:\n1. **தகவலைத் திருத்துங்கள்**.\n2. **நேரடி மறுஆய்வு கோருங்கள்** (அதிகாரி சான்றிதழை சரிபார்க்க).`
        };

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: responses[lang] || responses.en,
          timestamp: 'Just now',
          contextCard: {
            title: `Application #${latestApp.id}`,
            description: `Status: ${latestApp.status} • Readiness Score: ${latestApp.readinessScore}%`,
            statusBadge: latestApp.status,
            route: `/student/applications/${latestApp.id}`
          },
          quickActions: [
            { label: tr('action.requestManualReview', 'Request Manual Review'), action: 'manual_review_info' },
            { label: tr('action.fixInfo', 'Fix Information'), action: 'open_app' }
          ]
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: tr('status.verified', 'None of your active applications are currently flagged with mismatches! All submitted data is aligned with central databases.'),
        timestamp: 'Just now'
      };
    }

    // 2. Disbursement / DBT Query
    if (isDisbursementQuery) {
      const disbursedApp = apps.find((a) => a.status === 'Disbursed');
      if (disbursedApp && disbursedApp.disbursementDetails) {
        const d = disbursedApp.disbursementDetails;

        const dbtResponses: Record<SupportedLanguage, string> = {
          en: `**DBT Disbursement Confirmed:**\n\n₹${d.amount.toLocaleString('en-IN')} was credited on **${d.disbursedDate}** for **${disbursedApp.schemeName}** directly into your Aadhaar-seeded bank account:\n\n• Bank: ${d.bankName}\n• Account: ${d.accountNumberMasked}\n• PFMS Ref: \`${d.transactionReference}\`\n• Status: ${d.pfmsStatus}`,
          hi: `**डीबीटी (DBT) भुगतान पुष्टि:**\n\nआपकी **${disbursedApp.schemeName}** छात्रवृत्ति का **₹${d.amount.toLocaleString('en-IN')}** आपके आधार-सीडेड बैंक खाते में **${d.disbursedDate}** को जमा किया गया:\n\n• बैंक: ${d.bankName}\n• खाता: ${d.accountNumberMasked}\n• PFMS संदर्भ: \`${d.transactionReference}\`\n• स्थिति: सफल`,
          mr: `**डीबीटी (DBT) जमा पावती:**\n\nआपल्या **${disbursedApp.schemeName}** चे **₹${d.amount.toLocaleString('en-IN')}** आपल्या आधार जोडलेल्या बँक खात्यात **${d.disbursedDate}** रोजी जमा करण्यात आले:\n\n• बँक: ${d.bankName}\n• खाते: ${d.accountNumberMasked}\n• PFMS संदर्भ: \`${d.transactionReference}\``,
          gu: `**ડીબીટી (DBT) ચૂકવણી વિગત:**\n\nતમારી **${disbursedApp.schemeName}** શિષ્યવૃત્તિના **₹${d.amount.toLocaleString('en-IN')}** તમારા આધાર-લિંક્ડ બેંક ખાતામાં **${d.disbursedDate}** ના રોજ જમા કરવામાં આવ્યા છે:\n\n• બેંક: ${d.bankName}\n• PFMS સંદર્ભ: \`${d.transactionReference}\``,
          bn: `**ডিবিটি (DBT) অর্থ প্রদান নিশ্চিতকরণ:**\n\nআপনার **${disbursedApp.schemeName}** স্কলারশিপের **₹${d.amount.toLocaleString('en-IN')}** আধার-সংযুক্ত ব্যাঙ্ক অ্যাকাউন্টে **${d.disbursedDate}** তারিখে জমা হয়েছে:\n\n• ব্যাঙ্ক: ${d.bankName}\n• PFMS রেফারেন্স: \`${d.transactionReference}\``,
          or: `**ଡିବିଟି (DBT) ଅର୍ଥ ପ୍ରଦାନ ସୂଚନା:**\n\nଆପଣଙ୍କ **${disbursedApp.schemeName}** ର **₹${d.amount.toLocaleString('en-IN')}** ଆଧାର-ସଂଯୁକ୍ତ ବ୍ୟାଙ୍କ ଖାତାରେ **${d.disbursedDate}** ରେ ଜମା ହୋଇଛି:\n\n• ବ୍ୟାଙ୍କ: ${d.bankName}\n• PFMS ରେଫରେନ୍ସ: \`${d.transactionReference}\``,
          te: `**డీబీటీ (DBT) చెల్లింపు వివరాలు:**\n\nమీ **${disbursedApp.schemeName}** స్కాలర్‌షిప్ మొత్తం **₹${d.amount.toLocaleString('en-IN')}** మీ ఆధార్-లింక్డ్ బ్యాంక్ ఖాతాలో **${d.disbursedDate}** న జమ చేయబడింది:\n\n• బ్యాంక్: ${d.bankName}\n• PFMS నంబర్: \`${d.transactionReference}\``,
          ta: `**டிபிடி (DBT) நேரடி வங்கி பரிவர்த்தனை:**\n\nஉங்கள் **${disbursedApp.schemeName}** உதவித்தொகை **₹${d.amount.toLocaleString('en-IN')}** ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கில் **${d.disbursedDate}** அன்று வரவு வைக்கப்பட்டது:\n\n• வங்கி: ${d.bankName}\n• PFMS குறிப்பு: \`${d.transactionReference}\``
        };

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: dbtResponses[lang] || dbtResponses.en,
          timestamp: 'Just now',
          contextCard: {
            title: `Disbursed: ₹${d.amount.toLocaleString('en-IN')}`,
            description: `${disbursedApp.schemeName} • PFMS: ${d.transactionReference}`,
            statusBadge: 'Disbursed',
            route: `/student/applications/${disbursedApp.id}`
          }
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `Your current application is under process. Direct Benefit Transfer (DBT) will be credited directly via PFMS once approved by the Welfare Department.`,
        timestamp: 'Just now'
      };
    }

    // 3. Manual Review Explanation
    if (isManualReviewQuery) {
      const mrResponses: Record<SupportedLanguage, string> = {
        en: `**How Manual Review Works on ScholarSetu:**\n\nWhen automated registry cross-checks encounter a discrepancy (like family income or local spelling), you are **never automatically disqualified**.\n\n1. You request a review and provide physical certificate details.\n2. The case routes to the **District Welfare Officer (DWO)**.\n3. The DWO validates your authentic Tahsildar document.\n4. Your application proceeds to Sanction without losing queue priority.`,
        hi: `**स्कॉलरसेतु पर मैन्युअल समीक्षा कैसे काम करती है:**\n\nजब स्वचालित जांच में कोई अंतर आता है (जैसे आय या नाम की वर्तनी), तो छात्रवृत्ति **स्वतः निरस्त नहीं होती**।\n\n1. आप मैन्युअल समीक्षा का अनुरोध करते हैं।\n2. फाइल सीधे **जिला कल्याण अधिकारी (DWO)** के पास जाती है।\n3. अधिकारी आपके तहसीलदार प्रमाणपत्र की पुष्टि करते हैं।\n4. आपका आवेदन बिना कतार में पीछे हुए सीधे स्वीकृति की ओर बढ़ता है।`,
        mr: `**मॅन्युअल पुनरावलोकन कसे चालते:**\n\nनोंदींमध्ये फरक आढळल्यास अर्ज **आपोआप रद्द केला जात नाही**.\n\n1. आपण मॅन्युअल पुनरावलोकन विनंती करता.\n2. प्रकरण **जिल्हा कल्याण अधिकाऱ्यांकडे (DWO)** जाते.\n3. अधिकारी प्रत्यक्ष प्रमाणपत्राची पडताळणी करतात.\n4. अर्ज पूर्ववत मंजुरीसाठी पुढे सरकतो.`,
        gu: `**મેન્યુઅલ રિવ્યુ પ્રક્રિયા:**\n\nજો સરકારી રેકોર્ડમાં વિસંગતતા હોય તો અરજી **આપોઆપ રદ થતી નથી**.\n\n1. તમે સમીક્ષા વિનંતી સબમિટ કરો છો.\n2. કેસ **જિલ્લા કલ્યાણ અધિકારી (DWO)** ને સોંપાય છે.\n3. અધિકારી પ્રમાણપત્ર ચકાસી મંજૂરી આપે છે.`,
        bn: `**ম্যানুয়াল পর্যালোচনা প্রক্রিয়া:**\n\nতথ্যগত অসঙ্গতি থাকলে আবেদন **স্বয়ংক্রিয়ভাবে বাতিল হয় না**।\n\n1. আপনি পর্যালোচনার আবেদন জানান।\n2. ফাইলটি **জেলা কল্যাণ আধিকারিকের (DWO)** কাছে পাঠানো হয়।\n3. আধিকারিক শংসাপত্র যাচাই করে অনুমোদন দেন।`,
        or: `**ମାନୁଆଲ ଯାଞ୍ଚ ପ୍ରକ୍ରିୟା:**\n\nତଥ୍ୟରେ ତାରତମ୍ୟ ଥିଲେ ଆବେଦନ **ସ୍ୱୟଂକ୍ରିୟ ଭାବେ ଖାରଜ ହୁଏ ନାହିଁ**।\n\n1. ଆପଣ ଯାଞ୍ଚ ଅନୁରୋଧ କରନ୍ତି।\n2. ଏହା **ଜିଲ୍ଲା କଲ୍ୟାଣ ଅଧିକାରୀଙ୍କ (DWO)** ନିକଟକୁ ଯାଏ।\n3. ଅଧିକାରୀ ପ୍ରମାଣପତ୍ର ଯାଞ୍ଚ କରି ମଞ୍ଜୁର କରନ୍ତି।`,
        te: `**మాన్యువల్ సమీక్ష విధానం:**\n\nవివరాల్లో తేడాలు ఉన్నప్పుడు దరఖాస్తు **ఆటోమేటిక్‌గా తిరస్కరించబడదు**.\n\n1. మీరు సమీక్ష కోరవచ్చు.\n2. దరఖాస్తు **జిల్లా సంక్షేమ అధికారికి (DWO)** వెళుతుంది.\n3. అధికారి పరిశీలించి ఆమోదిస్తారు.`,
        ta: `**நேரடி மறுஆய்வு முறை:**\n\nதகவல்களில் முரண்பாடு இருந்தால் விண்ணப்பம் **தானாக நிராகரிக்கப்படாது**.\n\n1. நீங்கள் மறுஆய்வு கோரலாம்.\n2. **மாவட்ட நல அலுவலர் (DWO)** சான்றிதழை சரிபார்த்து ஒப்புதல் அளிப்பார்.`
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: mrResponses[lang] || mrResponses.en,
        timestamp: 'Just now',
        quickActions: [
          { label: tr('jago.qFlagged', 'Why is my application flagged?'), action: 'why_flagged' },
          { label: tr('nav.documents', 'Document Wallet'), action: 'go_to_documents' }
        ]
      };
    }

    // 4. One-Scholarship Policy
    if (isOneScholarshipQuery) {
      const oneSchResponses: Record<SupportedLanguage, string> = {
        en: `**The One-Scholarship Rule:**\n\nUnder Ministry of Tribal Affairs guidelines, an ST student can avail **only ONE** government scholarship at a time.\n\nScholarSetu enforces single-scholarship compliance so students do not face recovery or penalties. You can choose the highest eligible scheme for your education tier.`,
        hi: `**एक-छात्रवृत्ति नियम:**\n\nजनजातीय कार्य मंत्रालय के दिशानिर्देशों के तहत, एक एसटी छात्र एक समय में केवल **एक ही सरकारी छात्रवृत्ति** प्राप्त कर सकता है।\n\nस्कॉलरसेतु यह सुनिश्चित करता है ताकि आपको बाद में किसी वसूली या परेशानी का सामना न करना पड़े।`,
        mr: `**एक-शिष्यवृत्ती नियम:**\n\nमंत्रालयाच्या नियमांनुसार एसटी विद्यार्थी एका वेळी केवळ **एकच सरकारी शिष्यवृत्ती** घेऊ शकतात. यामुळे भविष्यातील वसुली टळते.`,
        gu: `**એક-શિષ્યવૃત્તિ નિયમ:**\n\nએસટી વિદ્યાર્થી એક સમયે માત્ર **એક સરકારી શિષ્યવૃત્તિ** મેળવી શકે છે. સ્કોલરસેતુ આ સુનિશ્ચિત કરે છે.`,
        bn: `**একটি-স্কলারশিপ নিয়ম:**\n\nমন্ত্রণালয়ের নির্দেশিকা অনুযায়ী একজন এসটি শিক্ষার্থী একসাথে কেবল **একটি সরকারি স্কলারশিপ** পেতে পারেন।`,
        or: `**ଗୋଟିଏ-ଛାତ୍ରବୃତ୍ତି ନିୟମ:**\n\nନିୟମ ଅନୁଯାୟୀ ଜଣେ ଏସଟି ଛାତ୍ର ଏକାସମୟରେ କେବଳ **ଗୋଟିଏ ସରକାରୀ ଛାତ୍ରବୃତ୍ତି** ପାଇପାରିବେ।`,
        te: `**ఒకే-స్కాలర్‌షిప్ నిబంధన:**\n\nనియమాల ప్రకారం ఒక ఎస్టీ విద్యార్థి ఒకే సమయంలో కేవలం **ఒక ప్రభుత్వ స్కాలర్‌షిప్** మాత్రమే పొందవచ్చు.`,
        ta: `**ஒரு-உதவித்தொகை விதி:**\n\nவிதிகளின்படி ஒரு பழங்குடியின மாணவர் ஒரே நேரத்தில் **ஒரு அரசு உதவித்தொகையை** மட்டுமே பெற முடியும்.`
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: oneSchResponses[lang] || oneSchResponses.en,
        timestamp: 'Just now'
      };
    }

    // 5. Schemes Query
    if (isSchemesQuery) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**Ministry of Tribal Affairs — 5 Central Schemes:**\n\n1. **${tr('schemes.preMatricName', 'Pre-Matric Scholarship')}**: Classes IX & X (≤ ₹2.50L)\n2. **${tr('schemes.postMatricName', 'Post-Matric Scholarship')}**: Class XI through PG (≤ ₹2.50L)\n3. **${tr('schemes.topClassName', 'Top Class Education')}**: Premier institutions like IIT/IIM (≤ ₹6.00L)\n4. **${tr('schemes.fellowshipName', 'National Fellowship (NFST)')}**: M.Phil & Ph.D. scholars (No income ceiling)\n5. **${tr('schemes.overseasName', 'National Overseas Scholarship (NOS)')}**: Masters & Ph.D. abroad (≤ ₹6.00L)`,
        timestamp: 'Just now',
        quickActions: [
          { label: tr('schemes.viewAll', 'Browse All 5 Schemes'), action: 'browse_scholarships' }
        ]
      };
    }

    // 6. Documents Query
    if (isDocumentsQuery) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**${tr('docs.title', 'Digital Document Wallet')} & DigiLocker:**\n\nYour verified wallet securely stores:\n• ${tr('auth.aadhaarLabel', 'Aadhaar Card')}\n• ${tr('auth.stCertLabel', 'ST Caste Certificate')}\n• ${tr('auth.incomeLabel', 'Income Certificate')}\n• Academic Marksheets & Bank Passbook\n\nOnce linked, you never need to repeatedly submit physical photocopies!`,
        timestamp: 'Just now',
        quickActions: [
          { label: tr('docs.title', 'Open Document Wallet'), action: 'go_to_documents' }
        ]
      };
    }

    // Default Fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'jago',
      text: tr(
        'jago.welcomeDefault',
        `Namaste ${studentName}! I am JAGO. I can help you with checking application flags, DBT payment updates, scheme criteria, and document verification.`
      ),
      timestamp: 'Just now',
      quickActions: [
        { label: tr('jago.qFlagged', 'Why is my application flagged?'), action: 'why_flagged' },
        { label: tr('jago.qDisbursement', 'Check my disbursement status'), action: 'disbursement_status' },
        { label: tr('schemes.viewAll', 'Browse All 5 Schemes'), action: 'browse_scholarships' }
      ]
    };
  }
};
