import React from 'react';
import { PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white font-bold font-display text-sm">
              <span className="text-teal-400">ScholarSetu</span> ST Scholarship Platform
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              An initiative under the Ministry of Tribal Affairs (MoTA), Government of India, designed to unify scholarship discovery, verification, and disbursement for Scheduled Tribe students.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">Five Central Schemes</h4>
            <ul className="space-y-1 text-[11px]">
              <li>Pre-Matric Scholarship for ST Students</li>
              <li>Post-Matric Scholarship for ST Students</li>
              <li>Top Class Education in Premier Institutes</li>
              <li>National Fellowship for ST Students (NFST)</li>
              <li>National Overseas Scholarship (NOS)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">Government Links</h4>
            <ul className="space-y-1 text-[11px]">
              <li>Ministry of Tribal Affairs (tribal.nic.in)</li>
              <li>DigiLocker Digital Document Gateway</li>
              <li>Public Financial Management System (PFMS)</li>
              <li>National Scholarship Portal (NSP 2.0)</li>
              <li>National Portal of India (india.gov.in)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs mb-2 uppercase tracking-wider">Tribal Student Helpline</h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold">Toll-Free: 1800-11-7788</span>
              </div>
              <p className="text-slate-400">Email: support-scholarsetu@mota.gov.in</p>
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
          <p>© 2026 Ministry of Tribal Affairs, Government of India. Prototype for Smart India Hackathon 2026.</p>
          <div className="flex items-center gap-4">
            <span>Website Policies</span>
            <span>Security & Compliance</span>
            <span>Accessibility</span>
            <span className="text-amber-400 font-medium">Digital India</span>
          </div>
        </div>

        {/* Mandatory Hackathon Prototype Disclaimer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed">
          ScholarSetu is a Smart India Hackathon 2026 prototype. Government service integrations shown in the prototype may be simulated and do not represent live government verification or authorization.
        </div>
      </div>
    </footer>
  );
};
