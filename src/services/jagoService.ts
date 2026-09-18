import { JagoChatMessage, ScholarshipApplication, UserProfile } from '../types';
import { SCHEMES } from '../data/mockData';

export const jagoService = {
  getInitialGreeting(user: UserProfile | null, latestApp?: ScholarshipApplication): JagoChatMessage[] {
    const studentFirstName = user?.name ? user.name.split(' ')[0] : 'Student';
    
    let contextualSnippet = "I am JAGO, your dedicated Ministry of Tribal Affairs AI scholarship assistant.";
    if (latestApp && latestApp.status === 'Under Verification' && latestApp.readinessReport?.hasMismatch) {
      contextualSnippet = `Namaste ${studentFirstName}! I noticed your **${latestApp.schemeName}** application has an income verification query (Score: ${latestApp.readinessScore}%). How can I assist you with this today?`;
    } else if (latestApp && latestApp.status === 'Under Manual Review') {
      contextualSnippet = `Namaste ${studentFirstName}! Your **${latestApp.schemeName}** application is currently under manual review with the District Welfare Officer.`;
    }

    return [
      {
        id: 'msg-jago-welcome',
        sender: 'jago',
        text: `${contextualSnippet}\n\nYou can ask me about your application status, eligibility, DigiLocker verification, or resolution steps.`,
        timestamp: 'Just now',
        quickActions: [
          { label: 'Why is my application flagged?', action: 'why_flagged' },
          { label: 'Check my disbursement status', action: 'disbursement_status' },
          { label: 'How does Manual Review work?', action: 'manual_review_info' },
          { label: 'What is the One-Scholarship Rule?', action: 'one_scholarship_rule' }
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
    }
  ): Promise<JagoChatMessage> {
    // Simulate brief typing response latency
    await new Promise((resolve) => setTimeout(resolve, 650));

    const q = userMessage.toLowerCase().trim();
    const apps = context.applications || [];
    const latestApp = context.activeApp || apps[0];
    const studentName = context.user?.name || 'Student';

    // 0. Multilingual Hindi / Regional keywords detection
    if (
      q.includes('छात्रवृत्ति') || 
      q.includes('योजना') || 
      q.includes('पैसा') || 
      q.includes('कब आएगा') ||
      q.includes('जाति') ||
      q.includes('आय') ||
      q.includes('नमस्ते')
    ) {
      if (q.includes('पैसा') || q.includes('कब आएगा') || q.includes('डीबीटी') || q.includes('स्टेटस')) {
        const disbursedApp = apps.find((a) => a.status === 'Disbursed');
        if (disbursedApp && disbursedApp.disbursementDetails) {
          const d = disbursedApp.disbursementDetails;
          return {
            id: `msg-${Date.now()}`,
            sender: 'jago',
            text: `**डीबीटी (DBT) भुगतान विवरण:**\n\nआपकी **${disbursedApp.schemeName}** छात्रवृत्ति का **₹${d.amount.toLocaleString('en-IN')}** आपके आधार से जुड़े बैंक खाते में **${d.disbursedDate}** को सफलतापूर्वक भेज दिया गया है।\n\n• बैंक: ${d.bankName}\n• खाता: ${d.accountNumberMasked}\n• PFMS संदर्भ: \`${d.transactionReference}\``,
            timestamp: 'Just now'
          };
        }
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `नमस्ते ${studentName}! मैं JAGO, जनजातीय कार्य मंत्रालय का छात्रवृत्ति सहायक हूँ।\n\nमैं आपकी सहायता कर सकता हूँ:\n1. **5 केंद्रीय योजनाओं** की पात्रता जानने में (Pre-Matric, Post-Matric, Top Class, National Fellowship, National Overseas)\n2. **आवेदन की स्थिति** और डीबीटी बैंक भुगतान चेक करने में\n3. **डिजिलॉकर** से जाति और आय प्रमाण पत्र जोड़ने में\n4. किसी भी जानकारी में अंतर होने पर **मैन्युअल समीक्षा** कराने में\n\nआप नीचे दिए गए विकल्पों में से चुन सकते हैं:`,
        timestamp: 'Just now',
        quickActions: [
          { label: 'आवेदन की स्थिति जांचें', action: 'why_flagged' },
          { label: '5 योजनाएं देखें', action: 'browse_scholarships' },
          { label: 'दस्तावेज़ वॉलेट खोलें', action: 'go_to_documents' }
        ]
      };
    }

    // 1. "Why is my application flagged?" or income mismatch query
    if (
      q.includes('flagged') || 
      q.includes('mismatch') || 
      q.includes('why') && (q.includes('pending') || q.includes('query') || q.includes('issue') || q.includes('error'))
    ) {
      if (latestApp && latestApp.readinessReport?.hasMismatch) {
        const incomeField = latestApp.readinessReport.fields.find((f) => f.fieldName === 'annualIncome');
        const submitted = incomeField?.submittedValue || '₹2,00,000';
        const verified = incomeField?.verifiedValue || '₹3,50,000';

        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: `**Regarding your ${latestApp.schemeName} (ID: ${latestApp.id}):**\n\nYour application shows an **income mismatch**. You submitted **${submitted}**, while the verified government revenue cross-check source shows **${verified}**.\n\n**Important:** Under ScholarSetu rules, this does **NOT** reject your application. You have two clear choices:\n1. **Fix Information:** If you made a clerical error, update your income figure.\n2. **Request Manual Review:** If your declared income is correct (e.g., non-taxable rural agricultural income certified by the Tahsildar), request manual review for the Welfare Officer to verify your physical certificate.`,
          timestamp: 'Just now',
          contextCard: {
            title: `Application #${latestApp.id}`,
            description: `Status: ${latestApp.status} • Readiness Score: ${latestApp.readinessScore}%`,
            statusBadge: latestApp.status,
            route: `/student/applications/${latestApp.id}`
          },
          quickActions: [
            { label: 'How to Request Manual Review', action: 'manual_review_info' },
            { label: 'Open Application Details', action: 'open_app' }
          ]
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `None of your active applications are currently flagged with mismatches! All submitted data is aligned with central databases.`,
        timestamp: 'Just now'
      };
    }

    // 2. Disbursement / Payment status
    if (q.includes('disburse') || q.includes('money') || q.includes('payment') || q.includes('dbt') || q.includes('bank') || q.includes('received')) {
      const disbursedApp = apps.find((a) => a.status === 'Disbursed');
      if (disbursedApp && disbursedApp.disbursementDetails) {
        const d = disbursedApp.disbursementDetails;
        return {
          id: `msg-${Date.now()}`,
          sender: 'jago',
          text: `**DBT Disbursement Confirmed:**\n\n₹${d.amount.toLocaleString('en-IN')} was credited on **${d.disbursedDate}** for your **${disbursedApp.schemeName}** directly into your Aadhaar-seeded bank account:\n\n• **Bank:** ${d.bankName}\n• **Account:** ${d.accountNumberMasked}\n• **PFMS Transaction Ref:** \`${d.transactionReference}\`\n• **Status:** ${d.pfmsStatus}`,
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
        text: `Your current application for **${latestApp?.schemeName || 'your scholarship'}** is at stage **"${latestApp?.status || 'Submitted'}"**. Direct Benefit Transfer (DBT) will be released immediately once the Sanction Order is generated by the State Welfare Department.`,
        timestamp: 'Just now'
      };
    }

    // 3. Manual Review explanation
    if (q.includes('manual review') || q.includes('welfare officer') || q.includes('appeal') || q.includes('review')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**How Manual Review Works on ScholarSetu:**\n\nWhen automated cross-checks find a difference (like in family income or institution name), you are never automatically disqualified.\n\n1. You can submit a brief clarification explaining why your local certificate differs from tax records.\n2. The file is assigned directly to the **District Welfare Officer (DWO)**.\n3. The DWO reviews your physical certificate or agricultural income affidavit.\n4. Once resolved, the application proceeds to Sanction without losing your queue seniority!`,
        timestamp: 'Just now',
        quickActions: [
          { label: 'Why is my application flagged?', action: 'why_flagged' },
          { label: 'Go to Documents Wallet', action: 'go_to_documents' }
        ]
      };
    }

    // 4. One-Scholarship Policy
    if (q.includes('one scholarship') || q.includes('multiple') || q.includes('another scheme') || q.includes('two scholarships')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**The One-Scholarship Policy:**\n\nUnder Ministry of Tribal Affairs guidelines, an ST student can avail **only ONE** government scholarship at any given time.\n\nScholarSetu enforces this to protect you from penalty, recovery, or cancellation. If you are currently receiving a scheme (such as Pre-Matric or Post-Matric), you cannot draw benefits from Top Class Education or National Fellowship at the same time.`,
        timestamp: 'Just now'
      };
    }

    // 5. Eligibility & Scheme discovery
    if (q.includes('eligible') || q.includes('top class') || q.includes('overseas') || q.includes('post-matric') || q.includes('fellowship') || q.includes('pre-matric')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**Ministry of Tribal Affairs 5 Core Schemes:**\n\n1. **Pre-Matric:** Classes IX & X (Income <= ₹2.5L)\n2. **Post-Matric:** Class XI, College & University degrees (Income <= ₹2.5L)\n3. **Top Class Education:** 250+ premier institutions (IIT, IIM, NIT, AIIMS) (Income <= ₹6.0L)\n4. **National Fellowship (NFST):** Full-time M.Phil & Ph.D. scholars (No income ceiling!)\n5. **National Overseas Scholarship (NOS):** Top 1000 world universities abroad (Income <= ₹6.0L)\n\nVisit the **Scholarships** tab to see your personalized eligibility report!`,
        timestamp: 'Just now',
        quickActions: [
          { label: 'Browse Scholarships', action: 'browse_scholarships' }
        ]
      };
    }

    // 6. Documents / DigiLocker
    if (q.includes('digilocker') || q.includes('document') || q.includes('certificate') || q.includes('aadhaar')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'jago',
        text: `**DigiLocker Integration on ScholarSetu:**\n\nYour **Document Wallet** allows one-click import and digital verification of:\n• Aadhaar Card (UIDAI)\n• ST Caste Certificate (e-District)\n• Income Certificate (Revenue Dept)\n• Academic Marksheets (CBSE / State Boards)\n• Bank Passbook (Aadhaar Seeded)\n\nOnce certified in your wallet, you do NOT need to re-upload them when applying for any scheme!`,
        timestamp: 'Just now',
        quickActions: [
          { label: 'Open Document Wallet', action: 'go_to_documents' }
        ]
      };
    }

    // Default conversational fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'jago',
      text: `Thank you, ${studentName}. I can assist you with:\n• Checking why your application has an income or document flag\n• Understanding your DBT disbursement status\n• Explaining the 5 Ministry of Tribal Affairs schemes\n• Guiding you through the simulated DigiLocker wallet\n\nWhat would you like to explore?`,
      timestamp: 'Just now',
      quickActions: [
        { label: 'Why is my application flagged?', action: 'why_flagged' },
        { label: 'Check my disbursement status', action: 'disbursement_status' },
        { label: 'Browse 5 Schemes', action: 'browse_scholarships' }
      ]
    };
  }
};
