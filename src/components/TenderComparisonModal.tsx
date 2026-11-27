import React from 'react';
import { Tender, MatchResult, MSMEProfile } from '../types';
import { formatINR } from '../services/matchmaker';
import { 
  X, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Building,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface TenderComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedTenders: Tender[];
  matches: Map<string, MatchResult>;
  profile: MSMEProfile;
  onRemoveFromCompare: (tenderId: string) => void;
  onOpenDetails: (tender: Tender) => void;
}

export const TenderComparisonModal: React.FC<TenderComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedTenders,
  matches,
  profile,
  onRemoveFromCompare,
  onOpenDetails,
}) => {
  if (!isOpen) return null;

  const count = comparedTenders.length;

  // Calculate comparative dimension highlights (if >= 2 tenders)
  const getHighlights = () => {
    if (count < 2) return null;

    // 1. Highest eligibility score
    let highestScoreTender = comparedTenders[0];
    let maxScore = matches.get(highestScoreTender.id)?.overallScore ?? 0;
    let isScoreTied = false;

    // 2. Lowest payable EMD (if MSE exempt, payable is 0)
    let lowestEmdTender = comparedTenders[0];
    const getPayableEmd = (t: Tender) => {
      const m = matches.get(t.id);
      return m?.exemptions.emdExempt ? 0 : t.earnestMoneyDeposit;
    };
    let minPayableEmd = getPayableEmd(lowestEmdTender);

    // 3. Deadline comparisons (earliest vs most lead time)
    let earliestDeadlineTender = comparedTenders[0];
    let latestDeadlineTender = comparedTenders[0];
    let minDeadlineTime = new Date(comparedTenders[0].submissionDeadline).getTime();
    let maxDeadlineTime = minDeadlineTime;

    // 4. Lowest eligibility gaps
    let lowestGapsTender = comparedTenders[0];
    const getGapsCount = (t: Tender) => {
      const m = matches.get(t.id);
      return (m?.gapAnalysis.criticalGaps.length || 0) * 2 + (m?.gapAnalysis.minorGaps.length || 0);
    };
    let minGapsScore = getGapsCount(lowestGapsTender);

    for (let i = 1; i < comparedTenders.length; i++) {
      const t = comparedTenders[i];
      const m = matches.get(t.id);
      const score = m?.overallScore ?? 0;
      if (score > maxScore) {
        maxScore = score;
        highestScoreTender = t;
        isScoreTied = false;
      } else if (score === maxScore) {
        isScoreTied = true;
      }

      const payableEmd = getPayableEmd(t);
      if (payableEmd < minPayableEmd) {
        minPayableEmd = payableEmd;
        lowestEmdTender = t;
      }

      const dTime = new Date(t.submissionDeadline).getTime();
      if (dTime < minDeadlineTime) {
        minDeadlineTime = dTime;
        earliestDeadlineTender = t;
      }
      if (dTime > maxDeadlineTime) {
        maxDeadlineTime = dTime;
        latestDeadlineTender = t;
      }

      const gapsScore = getGapsCount(t);
      if (gapsScore < minGapsScore) {
        minGapsScore = gapsScore;
        lowestGapsTender = t;
      }
    }

    return {
      highestScoreTender,
      maxScore,
      isScoreTied,
      lowestEmdTender,
      minPayableEmd,
      earliestDeadlineTender,
      latestDeadlineTender,
      lowestGapsTender,
    };
  };

  const highlights = getHighlights();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <span>Side-by-Side Tender Eligibility Comparison</span>
            </h2>
            <p className="text-xs text-slate-500">
              Comparing {count} of up to 3 tenders against <strong className="text-slate-800">{profile.companyName}</strong> credentials.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-x-auto flex-1 space-y-5">
          
          {/* Validation: 0 Tenders Selected */}
          {count === 0 && (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Scale className="w-14 h-14 mx-auto stroke-1 text-slate-300" />
              <h3 className="text-base font-bold text-slate-700">No tenders selected for comparison</h3>
              <p className="text-xs max-w-md mx-auto text-slate-500">
                You can compare between 2 and 3 tenders simultaneously. Browse through the Matched Tenders list and click the compare icon on any tender card to add it here.
              </p>
              <button
                onClick={onClose}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Browse Matched Tenders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Validation: Only 1 Tender Selected */}
          {count === 1 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-amber-950">At Least 2 Tenders Required for Comparison</h4>
                  <p className="text-amber-800">
                    You currently have only 1 tender selected (<strong>{comparedTenders[0].tenderNumber}</strong>). Side-by-side comparative analysis requires at least 2 tenders (and up to 3). Please select at least one more tender from the tender list.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onClose}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Browse & Select Another Tender</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview of the single selected tender */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md">
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {comparedTenders[0].tenderNumber}
                  </span>
                  <button
                    onClick={() => onRemoveFromCompare(comparedTenders[0].id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{comparedTenders[0].title}</h4>
                <p className="text-xs text-slate-500 mt-1">{comparedTenders[0].issuingAuthority}</p>
                <div className="text-xs font-bold text-slate-800 mt-2">
                  Estimated Value: {formatINR(comparedTenders[0].estimatedValue)}
                </div>
              </div>
            </div>
          )}

          {/* Valid Selection: 2 or 3 Tenders */}
          {count >= 2 && (
            <div className="space-y-5">
              
              {/* Comparative Multi-Dimensional Highlights */}
              {highlights && (
                <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Comparative Dimension Highlights & Trade-offs
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    
                    {/* Highlight 1: Best Match Score */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Highest Eligibility Score
                      </span>
                      <span className="font-bold text-slate-900 block truncate mt-0.5">
                        {highlights.highestScoreTender.tenderNumber}
                      </span>
                      <span className="text-emerald-700 font-semibold text-[11px] block mt-0.5">
                        {highlights.maxScore}% Fit {highlights.isScoreTied ? '(Tied)' : ''}
                      </span>
                    </div>

                    {/* Highlight 2: Lowest Net EMD */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Lowest EMD Deposit Payable
                      </span>
                      <span className="font-bold text-slate-900 block truncate mt-0.5">
                        {highlights.lowestEmdTender.tenderNumber}
                      </span>
                      <span className="text-blue-700 font-semibold text-[11px] block mt-0.5">
                        {highlights.minPayableEmd === 0 ? '₹0 (100% MSE Waived)' : formatINR(highlights.minPayableEmd)}
                      </span>
                    </div>

                    {/* Highlight 3: Submission Lead Time */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Most Preparation Lead Time
                      </span>
                      <span className="font-bold text-slate-900 block truncate mt-0.5">
                        {highlights.latestDeadlineTender.tenderNumber}
                      </span>
                      <span className="text-slate-700 font-semibold text-[11px] block mt-0.5">
                        Due: {new Date(highlights.latestDeadlineTender.submissionDeadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Highlight 4: Lowest Disqualification Gaps */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Fewest Compliance Gaps
                      </span>
                      <span className="font-bold text-slate-900 block truncate mt-0.5">
                        {highlights.lowestGapsTender.tenderNumber}
                      </span>
                      <span className="text-indigo-700 font-semibold text-[11px] block mt-0.5">
                        {matches.get(highlights.lowestGapsTender.id)?.gapAnalysis.criticalGaps.length === 0
                          ? '0 Critical Gaps Identified'
                          : 'Minimal gaps required'}
                      </span>
                    </div>

                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    Note: Relative highlights reflect specific operational dimensions (financials, timeline, compliance). No tender is universally superior; bidders should balance profit margin potential against preparation lead time.
                  </p>
                </div>
              )}

              {/* Side-by-Side Comparison Matrix Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-3.5 w-48 font-bold text-slate-600 uppercase tracking-wider bg-slate-100/70 border-r border-slate-200">
                        Criteria / Metric
                      </th>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <th key={t.id} className="p-3.5 min-w-[240px] max-w-[320px] align-top bg-white border-r border-slate-200 last:border-r-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                  {t.officialTenderId || t.tenderNumber}
                                </span>
                                {t.isDemoData !== false && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                    Demo
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => onRemoveFromCompare(t.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Remove from comparison"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-1">
                              {t.title}
                            </h4>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {t.issuingAuthority} {t.department ? `(${t.department})` : ''}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    
                    {/* Row 1: Eligibility Verdict & Score */}
                    <tr className="bg-slate-50/60">
                      <td className="p-3.5 font-bold text-slate-800 bg-slate-100/70 border-r border-slate-200">
                        Eligibility Match & Verdict
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        if (!m) return null;
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xl font-black ${
                                m.overallScore >= 80 ? 'text-emerald-600' : m.overallScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                              }`}>
                                {m.overallScore}%
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                m.verdict === 'HIGH_MATCH' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : m.verdict === 'MODERATE_MATCH' 
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                  : m.verdict === 'LOW_MATCH'
                                  ? 'bg-orange-100 text-orange-900 border border-orange-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}>
                                {m.verdict.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-1">
                              Readiness: <strong>{m.bidReadinessLevel}</strong>
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 2: Disqualifying Conditions / Critical Gaps */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Critical Gaps / Disqualification Risk
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        const critGaps = m?.gapAnalysis.criticalGaps || [];
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            {critGaps.length === 0 ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                No critical disqualifying gaps
                              </span>
                            ) : (
                              <div className="space-y-1">
                                <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px]">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  {critGaps.length} Disqualifying Gap(s) Found:
                                </span>
                                <ul className="text-[11px] text-rose-800 list-disc list-inside space-y-0.5">
                                  {critGaps.map((gap, i) => (
                                    <li key={i}>{gap}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 3: Estimated Value */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Tender Value (Budget)
                      </td>
                      {comparedTenders.map(t => (
                        <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0 font-bold text-sm text-slate-900">
                          {formatINR(t.estimatedValue)}
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: EMD Requirement & Waiver */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        EMD (Bid Security)
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            {m?.exemptions.emdExempt ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                100% Waived ({formatINR(t.earnestMoneyDeposit)})
                              </span>
                            ) : (
                              <span className="font-semibold text-slate-800">
                                {formatINR(t.earnestMoneyDeposit)} (No waiver)
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 5: Tender Fee */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Tender Document Fee
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            {m?.exemptions.feeExempt ? (
                              <span className="text-emerald-700 font-semibold">Free for MSEs</span>
                            ) : (
                              <span className="font-semibold text-slate-800">
                                {t.tenderFee ? formatINR(t.tenderFee) : 'Free / Nil'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 6: Submission Deadline */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Submission Deadline
                      </td>
                      {comparedTenders.map(t => {
                        const deadline = new Date(t.submissionDeadline);
                        const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            <span className="font-semibold block text-slate-900">
                              {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              Time: {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {daysLeft < 0 ? (
                              <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 bg-slate-100 text-slate-600 border border-slate-200">
                                Deadline Passed
                              </span>
                            ) : daysLeft === 0 ? (
                              <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 bg-amber-100 text-amber-900 border border-amber-300">
                                Closing Today
                              </span>
                            ) : daysLeft <= 7 ? (
                              <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 bg-rose-100 text-rose-800 border border-rose-200">
                                {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 bg-blue-100 text-blue-800">
                                {daysLeft} days remaining
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 7: Department & Location */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Portal & Location
                      </td>
                      {comparedTenders.map(t => (
                        <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0 space-y-1">
                          <span className="font-semibold text-slate-800 block">
                            Portal: <strong className="text-blue-600">{t.portal}</strong>
                          </span>
                          <span className="text-[11px] text-slate-600 block flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {t.location.city}, {t.location.state}
                            {t.location.isPanIndia && ' (Pan-India)'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 8: Allowed Enterprise Classes */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Enterprise Class Eligibility
                      </td>
                      {comparedTenders.map(t => {
                        const isAllowed = t.eligibilityCriteria.allowedEnterpriseCategories.includes(profile.category);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0 space-y-1">
                            <span className="font-semibold block text-slate-800">
                              {t.eligibilityCriteria.allowedEnterpriseCategories.join(', ')}
                            </span>
                            <span className={`text-[11px] font-medium block flex items-center gap-1 ${
                              isAllowed ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {isAllowed ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{profile.category} enterprise eligible</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>{profile.category} enterprise barred</span>
                                </>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 9: Turnover Threshold */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Turnover Benchmark
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {m?.breakdown.turnover.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                              <span>Req: {formatINR(t.eligibilityCriteria.minTurnoverRequired)}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {m?.breakdown.turnover.relaxationApplied 
                                ? 'GFR 173(i) MSE relaxation applies' 
                                : m?.breakdown.turnover.message}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 10: Operational Experience */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Experience Benchmark
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {m?.breakdown.experience.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                              <span>Req: {t.eligibilityCriteria.minYearsExperienceRequired} Years</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {m?.breakdown.experience.message}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 11: Past Single Contract Threshold */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Single Contract Threshold
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                            <div className="flex items-center gap-1.5 font-semibold">
                              {m?.breakdown.pastTrackRecord.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              )}
                              <span>Req: {formatINR(t.eligibilityCriteria.minSingleWorkOrderValue)}</span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {m?.breakdown.pastTrackRecord.message}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 12: Mandatory Certifications */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Mandatory Certifications
                      </td>
                      {comparedTenders.map(t => {
                        const m = matches.get(t.id);
                        const matched = m?.breakdown.certifications.matchedCertifications || [];
                        const missing = m?.breakdown.certifications.missingCertifications || [];
                        return (
                          <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0 space-y-1">
                            <div className="font-semibold text-slate-800">
                              {matched.length} of {t.eligibilityCriteria.mandatoryCertifications.length} Held
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {t.eligibilityCriteria.mandatoryCertifications.length > 0 
                                ? t.eligibilityCriteria.mandatoryCertifications.join(', ') 
                                : 'None required'}
                            </div>
                            {missing.length > 0 && (
                              <span className="text-[10px] text-rose-600 font-medium block">
                                Missing: {missing.join(', ')}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 13: Consortium / Joint Venture */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Consortium / JV Policy
                      </td>
                      {comparedTenders.map(t => (
                        <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                          <span className={`font-semibold block ${
                            t.eligibilityCriteria.consortiumAllowed ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {t.eligibilityCriteria.consortiumAllowed 
                              ? 'Permitted (JV / Consortium Bidding Allowed)' 
                              : 'Not Permitted (Individual Bidder Only)'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 14: Purchase Preference & Policies */}
                    <tr>
                      <td className="p-3.5 font-semibold text-slate-600 bg-slate-100/70 border-r border-slate-200">
                        Procurement Preference
                      </td>
                      {comparedTenders.map(t => (
                        <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0 space-y-0.5">
                          <span className="font-semibold text-slate-800 block">
                            MSE: {t.eligibilityCriteria.mseExemptionAllowed?.purchasePreferencePercent}% (L1 + 15% band)
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            MII: {t.eligibilityCriteria.makeInIndiaPreference || 'Not specified'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 15: Action / Next Step */}
                    <tr className="bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-800 bg-slate-100/70 border-r border-slate-200">
                        Action
                      </td>
                      {comparedTenders.map(t => (
                        <td key={t.id} className="p-3.5 border-r border-slate-200 last:border-r-0">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenDetails(t);
                            }}
                            className="w-full text-xs font-bold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <span>Open RFP & Bid</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between sticky bottom-0">
          <span className="text-xs text-slate-500">
            {count} / 3 tenders compared
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
