import React from 'react';
import { Tender, MatchResult, MSMEProfile, getOfficialTenderUrl } from '../types';
import { formatINR } from '../services/matchmaker';
import { 
  Building, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  Scale, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock,
  AlertCircle
} from 'lucide-react';

interface TenderCardProps {
  tender: Tender;
  match: MatchResult;
  profile: MSMEProfile;
  isTracked: boolean;
  isCompared: boolean;
  onToggleTrack: () => void;
  onToggleCompare: () => void;
  onOpenDiagnostics: () => void;
  onOpenDetails: () => void;
}

export const TenderCard: React.FC<TenderCardProps> = ({
  tender,
  match,
  profile,
  isTracked,
  isCompared,
  onToggleTrack,
  onToggleCompare,
  onOpenDiagnostics,
  onOpenDetails,
}) => {
  const pubDateStr = tender.publicationDate 
    ? new Date(tender.publicationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : 'Recently';

  const closeDate = tender.closingDate || tender.submissionDeadline;
  const closeDateStr = new Date(closeDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });

  const deadlineDate = new Date(closeDate);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isClosingSoon = diffDays <= 7 && diffDays >= 0;
  const isEligible = match.verdict !== 'INELIGIBLE';

  const getVerdictBadge = () => {
    switch (match.verdict) {
      case 'HIGH_MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            High Fit
          </span>
        );
      case 'MODERATE_MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Moderate
          </span>
        );
      case 'LOW_MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Low Alignment
          </span>
        );
      case 'INELIGIBLE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ineligible
          </span>
        );
    }
  };

  const getScoreStrokeClass = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500 text-emerald-600';
    if (score >= 60) return 'stroke-blue-500 text-blue-600';
    if (score >= 40) return 'stroke-amber-500 text-amber-500';
    return 'stroke-rose-500 text-rose-600';
  };

  const officialUrl = getOfficialTenderUrl(tender);

  // Ineligibility reason text for banner
  const ineligibilityReason = match.gapAnalysis.criticalGaps?.[0] || 
    (match.breakdown.pastTrackRecord && !match.breakdown.pastTrackRecord.passed ? 'Past contract requirement not met' :
     match.breakdown.turnover && !match.breakdown.turnover.passed ? 'Turnover requirement not met' :
     match.breakdown.certifications && !match.breakdown.certifications.passed ? 'Mandatory certifications missing' :
     'Eligibility criteria not met');

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between h-full shadow-enterprise hover:shadow-lg min-w-0 ${
      match.verdict === 'HIGH_MATCH' 
        ? 'border-emerald-300 hover:border-emerald-500 ring-1 ring-emerald-500/20' 
        : 'border-slate-200/90 hover:border-blue-400'
    }`}>
      
      {/* 1. TOP HEADER & TITLE (Padding 16px) */}
      <div className="p-4 pb-2.5">
        
        {/* Top Badges Row + Circular SVG Fit Score Gauge */}
        <div className="flex items-start justify-between gap-2.5 mb-2">
          
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
              tender.portal === 'GeM' 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : tender.portal === 'CPPP' 
                ? 'bg-blue-100 text-blue-900 border border-blue-300' 
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
            }`}>
              {tender.portal}
            </span>

            {tender.isDemoData !== false && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300" title="Demonstration tender data">
                Demo
              </span>
            )}

            <span className="text-[11px] font-mono font-semibold text-slate-500 truncate" title={`Tender ID: ${tender.officialTenderId || tender.tenderNumber}`}>
              {tender.officialTenderId || tender.tenderNumber}
            </span>

            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
              tender.status === 'Closing Soon' || isClosingSoon
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : tender.status === 'Active'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {tender.status === 'Closing Soon' || isClosingSoon ? 'Closing Soon' : tender.status}
            </span>
          </div>

          {/* Fit Score Ring with Percentage centered inside */}
          <div className="relative w-10 h-10 shrink-0" title={`AI Fit Score: ${match.overallScore}%`}>
            <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-slate-100"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getScoreStrokeClass(match.overallScore).split(' ')[0]}
                strokeDasharray={`${match.overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-[10px] font-black leading-none ${getScoreStrokeClass(match.overallScore).split(' ')[1]}`}>
                {match.overallScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Issuing Authority & Department */}
        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mb-1 truncate">
          <Building className="w-3 h-3 shrink-0 text-slate-400" />
          <span className="truncate">{tender.issuingAuthority}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 truncate">{tender.publishingDepartment || tender.department}</span>
        </div>

        {/* Tender Title (Strictly max 2 lines with title tooltip) */}
        <h3 
          onClick={onOpenDetails}
          className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug transition-colors min-h-[2.5rem]"
          title={tender.title}
        >
          {tender.title}
        </h3>

        {/* Verdict Badge, Due Date, Location Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
          {getVerdictBadge()}

          <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Pub: {pubDateStr}</span>
          </span>

          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isClosingSoon 
              ? 'bg-rose-100 text-rose-800 border border-rose-200' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Due: {closeDateStr} {diffDays >= 0 ? `(${diffDays}d)` : '(Closed)'}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[100px]">{tender.location.isPanIndia ? 'Pan-India' : tender.location.state}</span>
          </span>
        </div>
      </div>

      {/* 2. TENDER FINANCIALS & EMD BANNER (Single slim line) */}
      <div className="px-4 py-2 bg-slate-50/90 border-y border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="truncate">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Value:</span>
          <span className="text-sm font-extrabold text-slate-900">
            {formatINR(tender.estimatedValue)}
          </span>
        </div>

        <div className="text-right truncate">
          {isEligible && match.exemptions.emdExempt ? (
            <span className="text-[11px] font-bold text-teal-700 inline-flex items-center gap-1" title={`EMD Waived under GFR 173(i) • Saved ₹${formatINR(tender.earnestMoneyDeposit)}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>100% EMD Waived</span>
            </span>
          ) : !isEligible ? (
            <span className="text-[11px] font-medium text-slate-500 inline-flex items-center gap-1 truncate" title={ineligibilityReason}>
              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate max-w-[140px]">{ineligibilityReason}</span>
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-700">
              EMD: {formatINR(tender.earnestMoneyDeposit)}
            </span>
          )}
        </div>
      </div>

      {/* 3. 4 CRITERIA BOXES IN ONE ROW (Responsive 4-col, 2x2 on narrow screens) */}
      <div className="p-4 py-2.5">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Company Criteria Verification
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          
          {/* 1. Turnover Check */}
          <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 font-medium text-[10px] truncate">Turnover</span>
              {match.breakdown.turnover.passed ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
              )}
            </div>
            <div className="font-semibold text-slate-800 text-[10px] truncate mt-0.5">
              {match.breakdown.turnover.userValueFormatted}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Req: {match.breakdown.turnover.requiredValueFormatted}
            </div>
          </div>

          {/* 2. Certifications Check */}
          <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 font-medium text-[10px] truncate">Certs</span>
              {match.breakdown.certifications.passed ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
              )}
            </div>
            <div className="font-semibold text-slate-800 text-[10px] truncate mt-0.5">
              {match.breakdown.certifications.matchedCertifications.length}/{tender.eligibilityCriteria.mandatoryCertifications.length || 1} Met
            </div>
            <div className="text-[9px] text-slate-400 truncate" title={match.breakdown.certifications.missingCertifications.join(', ') || 'All verified'}>
              {match.breakdown.certifications.missingCertifications.length > 0 
                ? match.breakdown.certifications.missingCertifications[0] 
                : 'Verified'}
            </div>
          </div>

          {/* 3. Past Contract Check */}
          <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 font-medium text-[10px] truncate">Contract</span>
              {match.breakdown.pastTrackRecord.passed ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
              )}
            </div>
            <div className="font-semibold text-slate-800 text-[10px] truncate mt-0.5">
              {match.breakdown.pastTrackRecord.userValueFormatted}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              Req: {match.breakdown.pastTrackRecord.requiredValueFormatted}
            </div>
          </div>

          {/* 4. MSE Preference Check */}
          <div className="bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 font-medium text-[10px] truncate">MSE Pref</span>
              <Award className="w-3 h-3 text-indigo-600 shrink-0" />
            </div>
            <div className="font-semibold text-indigo-900 text-[10px] truncate mt-0.5">
              {match.exemptions.msePricePreferenceEligible ? '15% L1 Band' : 'Standard'}
            </div>
            <div className="text-[9px] text-slate-400 truncate">
              {tender.eligibilityCriteria.makeInIndiaPreference ? 'MII Pref' : 'Non-MII'}
            </div>
          </div>

        </div>
      </div>

      {/* 4. CARD ACTIONS ROW (Always pushed to bottom via mt-auto, in ONE row) */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 mt-auto flex items-center justify-between gap-1.5 text-xs">
        
        {/* Left side actions: Bookmark & Compare */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleTrack}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isTracked 
                ? 'bg-amber-500 border-amber-600 text-slate-950 font-bold shadow-xs' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={isTracked ? 'Tracked in Bid Pipeline' : 'Track in Bid Pipeline'}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleCompare}
            className={`px-2 py-1.5 rounded-lg border transition-all cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
              isCompared 
                ? 'bg-blue-600 border-blue-700 text-white shadow-xs' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={isCompared ? 'Remove from Comparison' : 'Add to Comparison Matrix'}
          >
            <Scale className="w-3 h-3" />
            <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
          </button>
        </div>

        {/* Right side actions: Check Fit (outline), View Details, Apply */}
        <div className="flex items-center gap-1.5 min-w-0 justify-end">
          <button
            onClick={onOpenDiagnostics}
            className="text-[11px] font-semibold px-2 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
            title="Diagnose point-by-point criteria fit"
          >
            Check Fit
          </button>

          <button
            onClick={onOpenDetails}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs shrink-0"
            title="View full tender details and documents"
          >
            View Details
          </button>

          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1 transition-colors cursor-pointer shadow-xs shrink-0"
            title={`Apply on official portal (${tender.portal})`}
          >
            <span>Apply</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
