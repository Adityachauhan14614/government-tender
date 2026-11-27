import React, { useState } from 'react';
import { indianProcurementPolicies } from '../data/regulatoryRules';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  CheckCircle2,
  Search
} from 'lucide-react';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'How does an MSME claim 100% exemption from Earnest Money Deposit (EMD)?',
    a: 'Under Section 11 of the MSMED Act 2006 and the Public Procurement Policy for MSEs Order 2012, all registered Micro and Small Enterprises holding a valid Udyam Registration Certificate are fully exempt from submitting EMD (Bid Security) in all Central Ministries, Departments, CPSEs, and GeM tenders. During bid submission on GeM or CPPP, select "MSE Exemption Claimed" and upload your Udyam Certificate in the technical packet.'
  },
  {
    q: 'Can our company bid if our annual turnover is below the tender requirement?',
    a: 'Yes, if the tender allows MSE turnover relaxation! Under Rule 173(i) of General Financial Rules (GFR) 2017 and DPIIT Office Memorandum dated 10.03.2016, procuring entities may relax conditions of prior turnover and prior experience for Startups and Micro/Small Enterprises, provided your enterprise meets the technical specifications and quality standards (e.g. BIS/ISO test reports).'
  },
  {
    q: 'What is the MSE 25% Purchase Preference (L1 + 15% Rule)?',
    a: 'If a large non-MSE enterprise quotes the lowest price (L1), any participating MSE whose quote falls within the price band of L1 + 15% is given the opportunity to match the L1 price. Once matched, the MSE is guaranteed award of at least 25% of the total procurement quantity. Furthermore, 3% is specifically reserved for Women-owned MSEs and 4% for SC/ST-owned MSEs.'
  },
  {
    q: 'Are Medium Enterprises entitled to the same EMD and purchase preference benefits as Micro and Small?',
    a: 'No. The Public Procurement Policy for MSEs Order 2012 specifically applies to "Micro and Small Enterprises" (MSEs). Medium enterprises (turnover ₹50 Cr - ₹250 Cr) do not qualify for the 25% quota or mandatory EMD exemption, though they may still benefit from the Make in India preference and general MSME support schemes.'
  },
  {
    q: 'What advantage does MSME ZED (Zero Defect Zero Effect) certification give in tenders?',
    a: 'ZED certified enterprises (Bronze, Silver, Gold) receive preferential weightage and pre-qualification credits in various State Discom, Urban Local Body, and Railways tenders. In addition, ZED certified MSMEs receive up to 80% subsidies on testing/certification costs and concessions on bank guarantee commission rates.'
  }
];

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredFaqs = FAQ_ITEMS.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) || 
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                STATUTORY PROCUREMENT RULES
              </span>
              <span className="text-xs text-slate-500 font-medium">
                MSME Sambandh & GFR 2017 Manual
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>MSME Public Procurement & Exemption Advisor</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search procurement rules: EMD waiver, GFR 173, Women MSE quota, L1 matching..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-500 outline-hidden"
            />
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Eligibility & Exemption Questions</span>
            </h3>

            <div className="space-y-2">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className={`w-full p-3.5 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 transition-colors ${
                        isOpen ? 'bg-blue-50/70 text-blue-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-90 text-blue-600' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Policies Overview Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Key Gazette Orders & Procurement Circulars</span>
            </h3>

            <div className="space-y-3">
              {indianProcurementPolicies.map((pol) => (
                <div key={pol.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{pol.title}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono shrink-0">
                      {pol.authority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{pol.summary}</p>
                  
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Key Statutory Entitlements:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {pol.benefits.slice(0, 4).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded border border-slate-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-blue-800 bg-blue-50/60 p-2 rounded-lg border border-blue-100 mt-2">
                    <strong>How to Claim in Tender:</strong> {pol.howToClaim}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
