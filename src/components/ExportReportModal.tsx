import React from 'react';
import { Tender, MatchResult, MSMEProfile } from '../types';
import { formatINR } from '../services/matchmaker';
import { X, Printer, ShieldCheck, CheckCircle2, Building, Calendar } from 'lucide-react';

interface ExportReportModalProps {
  tender: Tender;
  match: MatchResult;
  profile: MSMEProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  tender,
  match,
  profile,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Controls Bar (hidden during print) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-20">
          <span className="text-xs font-bold text-slate-700">
            Print Preview: MSME Tender Pre-qualification Dossier
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs font-bold px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-900 bg-white">
          
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Government of India • MSME Public Procurement Framework
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                TenderSetu Eligibility & Pre-Qualification Assessment Dossier
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Generated under Public Procurement Policy for MSEs Order, 2012 & GFR 2017 Rule 173(i)
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: {currentDate}</div>
              <div>Report ID: TS-{tender.id.toUpperCase()}-{Date.now().toString().slice(-6)}</div>
            </div>
          </div>

          {/* Section 1: Enterprise Profile */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 px-3 rounded">
              1. Bidder Enterprise Credentials
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs p-2">
              <div>
                <span className="text-slate-500 block">Enterprise Name:</span>
                <strong className="text-slate-900 text-sm">{profile.companyName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Udyam Registration Number:</span>
                <strong className="font-mono text-slate-900">{profile.udyamRegistrationNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">MSME Classification:</span>
                <span className="font-bold">{profile.category} Enterprise ({profile.enterpriseType})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Annual Turnover (FY24 / Avg):</span>
                <span className="font-bold">{formatINR(profile.financials.turnoverFY24)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registered Location:</span>
                <span>{profile.location.city}, {profile.location.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Largest Prior Delivered Contract:</span>
                <span className="font-bold">{formatINR(profile.experience.maxSingleContractValue)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Tender Details */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 px-3 rounded">
              2. Target Tender Specifications
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs p-2">
              <div className="col-span-2">
                <span className="text-slate-500 block">Tender Title:</span>
                <strong className="text-slate-900 text-sm">{tender.title}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tender Reference No:</span>
                <strong className="font-mono text-blue-700">{tender.tenderNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Issuing Authority / Portal:</span>
                <span>{tender.issuingAuthority} ({tender.portal})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Tender Value:</span>
                <strong className="text-slate-900 text-sm">{formatINR(tender.estimatedValue)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Bid Submission Deadline:</span>
                <strong className="text-slate-900">
                  {new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 3: Pre-qualification Score & Verdict */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 px-3 rounded">
              3. Matchmaking & Eligibility Assessment
            </h2>

            <div className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold">Eligibility Verdict</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {match.verdict === 'HIGH_MATCH' && 'QUALIFIED: Ready to Bid'}
                  {match.verdict === 'MODERATE_MATCH' && 'CONDITIONALLY QUALIFIED: Minor Gaps Covered by MSE Relaxation'}
                  {match.verdict === 'LOW_MATCH' && 'MARGINAL MATCH: High Competition / Gaps'}
                  {match.verdict === 'INELIGIBLE' && 'DISQUALIFIED'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Overall Pre-qualification Score: <strong>{match.overallScore} out of 100</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">{match.overallScore}%</span>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 mt-2">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2 border-b">Parameter</th>
                  <th className="p-2 border-b">Required Threshold</th>
                  <th className="p-2 border-b">Bidder Capability</th>
                  <th className="p-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-semibold">Annual Turnover</td>
                  <td className="p-2">{match.breakdown.turnover.requiredValueFormatted}</td>
                  <td className="p-2">{match.breakdown.turnover.userValueFormatted}</td>
                  <td className="p-2 font-bold text-emerald-700">
                    {match.breakdown.turnover.passed ? 'PASSED' : 'RELAXED (MSE)'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Prior Experience</td>
                  <td className="p-2">{match.breakdown.experience.requiredValueFormatted}</td>
                  <td className="p-2">{match.breakdown.experience.userValueFormatted}</td>
                  <td className="p-2 font-bold text-emerald-700">
                    {match.breakdown.experience.passed ? 'PASSED' : 'DEFICIT'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Mandatory Certifications</td>
                  <td className="p-2">{tender.eligibilityCriteria.mandatoryCertifications.join(', ') || 'None'}</td>
                  <td className="p-2">{match.breakdown.certifications.matchedCertifications.join(', ') || 'None'}</td>
                  <td className="p-2 font-bold text-emerald-700">
                    {match.breakdown.certifications.passed ? 'VERIFIED' : 'PENDING'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Single Work Order Scale</td>
                  <td className="p-2">{match.breakdown.pastTrackRecord.requiredValueFormatted}</td>
                  <td className="p-2">{match.breakdown.pastTrackRecord.userValueFormatted}</td>
                  <td className="p-2 font-bold text-emerald-700">
                    {match.breakdown.pastTrackRecord.passed ? 'PASSED' : 'CONDITIONAL'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Statutory Exemptions */}
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 p-1.5 px-3 rounded">
              4. Statutory MSME Exemptions Claimable
            </h2>
            <div className="p-3 border rounded-xl bg-slate-50 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span>Earnest Money Deposit (EMD / Bid Security) Waiver:</span>
                <strong className="text-emerald-700">
                  {match.exemptions.emdExempt ? `100% EXEMPT (Saves ${formatINR(match.exemptions.emdAmountSaved)})` : 'N/A'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Tender Document Fee:</span>
                <strong className="text-emerald-700">
                  {match.exemptions.feeExempt ? `FREE (Saves ${formatINR(tender.tenderFee)})` : 'Standard'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>PPP-MSE 2012 Purchase Preference:</span>
                <strong className="text-indigo-900">
                  {match.exemptions.msePricePreferenceEligible ? '25% Allocation Band (L1 + 15%)' : 'None'}
                </strong>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="h-12 border-b border-dashed border-slate-400"></div>
              <span className="block mt-1 font-semibold text-slate-800">Prepared by Bid Team Lead</span>
              <span className="text-[11px] text-slate-400">{profile.companyName}</span>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-slate-400"></div>
              <span className="block mt-1 font-semibold text-slate-800">Managing Director / Authorized Signatory</span>
              <span className="text-[11px] text-slate-400">Seal & Date</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
