import React from 'react';
import { Tender, MatchResult, MSMEProfile } from '../types';
import { formatINR } from '../services/matchmaker';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Award, 
  FileText, 
  Printer, 
  Building, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Scale,
  Download
} from 'lucide-react';

interface TenderMatchDiagnosticProps {
  tender: Tender;
  match: MatchResult;
  profile: MSMEProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenDetails: () => void;
  onExportReport: () => void;
}

export const TenderMatchDiagnostic: React.FC<TenderMatchDiagnosticProps> = ({
  tender,
  match,
  profile,
  isOpen,
  onClose,
  onOpenDetails,
  onExportReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {tender.tenderNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {tender.portal} Portal • {tender.category}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 line-clamp-1">
              Eligibility Match Diagnostic & RFP Pre-qualification
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against: <strong className="text-slate-800">{profile.companyName}</strong> ({profile.category} Enterprise)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportReport}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
              title="Print or Export Match Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Top Score Banner */}
          <div className={`rounded-xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            match.verdict === 'HIGH_MATCH' 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : match.verdict === 'MODERATE_MATCH'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex flex-col items-center justify-center border border-slate-200/60 shrink-0">
                <span className={`text-2xl font-black ${
                  match.overallScore >= 80 ? 'text-emerald-600' : match.overallScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {match.overallScore}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Match</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base">
                    {match.verdict === 'HIGH_MATCH' && 'Pre-Qualified: High Eligibility Match'}
                    {match.verdict === 'MODERATE_MATCH' && 'Conditional Eligibility (Minor Gaps)'}
                    {match.verdict === 'LOW_MATCH' && 'Low Capability Match'}
                    {match.verdict === 'INELIGIBLE' && 'Does Not Meet Pre-qualification Criteria'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-lg">
                  {match.verdict === 'HIGH_MATCH' && 'Your enterprise satisfies all mandatory pre-qualification hurdles and can immediately prepare the technical proposal and BOQ bid.'}
                  {match.verdict === 'MODERATE_MATCH' && 'Your company is conditionally eligible. You can claim MSE relaxations or partner with a consortium member to bridge minor criteria gaps.'}
                  {match.verdict === 'LOW_MATCH' && 'Significant gaps in turnover or mandatory certifications. Review recommendations below before investing in bid preparation.'}
                  {match.verdict === 'INELIGIBLE' && 'Your profile does not satisfy multiple non-negotiable clauses of this tender. Bidding without consortium may result in rejection at technical evaluation.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right sm:border-l sm:pl-4 border-slate-300">
              <span className="text-[11px] uppercase font-bold text-slate-500 block">Readiness Status</span>
              <span className={`text-sm font-black px-2.5 py-1 rounded-md inline-block mt-0.5 ${
                match.bidReadinessLevel === 'Ready to Bid' 
                  ? 'bg-emerald-600 text-white' 
                  : match.bidReadinessLevel === 'Minor Prep Needed'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-rose-600 text-white'
              }`}>
                {match.bidReadinessLevel}
              </span>
            </div>
          </div>

          {/* Criteria Breakdown Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>Detailed Criteria Scoring (100 Pts Total)</span>
            </h3>

            <div className="space-y-2.5">
              
              {/* 1. Turnover Check */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {match.breakdown.turnover.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      Annual Financial Turnover
                    </span>
                    {match.breakdown.turnover.relaxationApplied && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                        MSE GFR 173(i) Relaxed
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {match.breakdown.turnover.score} / {match.breakdown.turnover.maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full ${match.breakdown.turnover.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${(match.breakdown.turnover.score / match.breakdown.turnover.maxScore) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <span>{match.breakdown.turnover.details}</span>
                  <span className="font-semibold text-slate-800">
                    Your FY24: {match.breakdown.turnover.userValueFormatted} vs Req: {match.breakdown.turnover.requiredValueFormatted}
                  </span>
                </div>
              </div>

              {/* 2. Certifications Check */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {match.breakdown.certifications.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      Mandatory Certifications & Quality Accreditations
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {match.breakdown.certifications.score} / {match.breakdown.certifications.maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full ${match.breakdown.certifications.passed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${(match.breakdown.certifications.score / match.breakdown.certifications.maxScore) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>{match.breakdown.certifications.details}</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {match.breakdown.certifications.matchedCertifications.map(c => (
                      <span key={c} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {c} (Verified)
                      </span>
                    ))}
                    {match.breakdown.certifications.missingCertifications.map(c => (
                      <span key={c} className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        {c} (Missing)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Past Contract / Single Work Order Track Record */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {match.breakdown.pastTrackRecord.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      Prior Single Contract Execution Scale
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {match.breakdown.pastTrackRecord.score} / {match.breakdown.pastTrackRecord.maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full ${match.breakdown.pastTrackRecord.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${(match.breakdown.pastTrackRecord.score / match.breakdown.pastTrackRecord.maxScore) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <span>{match.breakdown.pastTrackRecord.details}</span>
                  <span className="font-semibold text-slate-800">
                    Your Max Contract: {match.breakdown.pastTrackRecord.userValueFormatted} vs Req: {match.breakdown.pastTrackRecord.requiredValueFormatted}
                  </span>
                </div>
              </div>

              {/* 4. Years of Experience */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {match.breakdown.experience.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      Years of Operational Experience
                    </span>
                    {match.breakdown.experience.relaxationApplied && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Startup India Exemption
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {match.breakdown.experience.score} / {match.breakdown.experience.maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(match.breakdown.experience.score / match.breakdown.experience.maxScore) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600">
                  {match.breakdown.experience.details}
                </div>
              </div>

              {/* 5. Location Advantage */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900">
                      Location & Delivery Feasibility
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {match.breakdown.location.score} / {match.breakdown.location.maxScore} pts
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {match.breakdown.location.details}
                </div>
              </div>

            </div>
          </div>

          {/* MSME Financial Exemptions & Statutory Advantages */}
          <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Statutory MSME Exemptions & Procurement Benefits Applied</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-xs">
                <span className="text-slate-500 font-medium block">Earnest Money Deposit (EMD) Waiver</span>
                <span className="text-sm font-bold text-emerald-700 block mt-0.5">
                  {match.exemptions.emdExempt ? `100% Waived (Saves ${formatINR(match.exemptions.emdAmountSaved)})` : 'Not Applicable (Full EMD Required)'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Under MSMED Act 2006 & Public Procurement Policy Order 2012
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-xs">
                <span className="text-slate-500 font-medium block">25% Purchase Preference (L1 + 15%)</span>
                <span className="text-sm font-bold text-indigo-900 block mt-0.5">
                  {match.exemptions.msePricePreferenceEligible ? 'Eligible for 25% Allocation' : 'Not Reserved for MSEs'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {match.exemptions.purchasePreferenceClause || 'General competitive bidding'}
                </span>
              </div>
            </div>
          </div>

          {/* Gap Analysis & Actionable Advice */}
          {match.gapAnalysis.actionableRecommendations.length > 0 && (
            <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                <span>Actionable Recommendations to Qualify or Maximize Win Odds</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {match.gapAnalysis.actionableRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenDetails();
            }}
            className="text-xs font-bold px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
          >
            <span>Proceed to RFP Checklist & Bid Preparation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
