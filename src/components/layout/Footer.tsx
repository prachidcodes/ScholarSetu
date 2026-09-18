import React from 'react';
import { PhoneCall, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white font-bold font-display text-sm">
              <span className="text-teal-400">{t('common.appName', 'ScholarSetu')}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {t('footer.aboutDesc', 'An initiative under the Ministry of Tribal Affairs (MoTA), Government of India, designed to unify scholarship discovery, verification, and disbursement for Scheduled Tribe students.')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">
              {t('footer.schemesTitle', 'Five Central Schemes')}
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>{t('schemes.preMatricName', 'Pre-Matric Scholarship for ST Students')}</li>
              <li>{t('schemes.postMatricName', 'Post-Matric Scholarship for ST Students')}</li>
              <li>{t('schemes.topClassName', 'Top Class Education in Premier Institutes')}</li>
              <li>{t('schemes.fellowshipName', 'National Fellowship for ST Students (NFST)')}</li>
              <li>{t('schemes.overseasName', 'National Overseas Scholarship (NOS)')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">
              {t('footer.govLinksTitle', 'Government Links')}
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>Ministry of Tribal Affairs (tribal.nic.in)</li>
              <li>DigiLocker Digital Document Gateway</li>
              <li>Public Financial Management System (PFMS)</li>
              <li>National Scholarship Portal (NSP 2.0)</li>
              <li>National Portal of India (india.gov.in)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">
              {t('footer.helplineTitle', 'Tribal Student Helpline')}
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold">{t('footer.tollFree', 'Toll-Free: 1800-11-7788')}</span>
              </div>
              <p className="text-slate-400">{t('footer.email', 'Email: support-scholarsetu@mota.gov.in')}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px] font-mono border border-slate-700">
                  <ShieldCheck className="w-3 h-3" />
                  Firebase Project: sih-ps2
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>{t('footer.copyright', '© 2026 Ministry of Tribal Affairs, Government of India. Prototype for Smart India Hackathon 2026.')}</p>
          <div className="flex items-center gap-4">
            <span>{t('footer.policies', 'Website Policies')}</span>
            <span>{t('footer.security', 'Security & Compliance')}</span>
            <span>{t('footer.accessibility', 'Accessibility')}</span>
            <span className="text-amber-400 font-medium">{t('footer.digitalIndia', 'Digital India')}</span>
          </div>
        </div>

        {/* Mandatory Hackathon Prototype Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed">
          {t('footer.disclaimer', 'ScholarSetu is a Smart India Hackathon 2026 prototype. Government service integrations shown in the prototype may be simulated and do not represent live government verification or authorization.')}
        </div>
      </div>
    </footer>
  );
};
