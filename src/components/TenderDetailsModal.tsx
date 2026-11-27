import React, { useState, useEffect } from 'react';
import { Tender, MatchResult, MSMEProfile, ApplicationStatus, getOfficialTenderUrl } from '../types';
import { formatINR } from '../services/matchmaker';
import { 
  X, 
  Building, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  FileCheck2, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Phone, 
  Mail, 
  User, 
  Calculator,
  Award,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface TenderDetailsModalProps {
  tender: Tender;
  match: MatchResult;
  profile: MSMEProfile;
  isOpen: boolean;
  onClose: () => void;
  checklist: Record<string, boolean>;
  onToggleChecklist: (docName: string) => void;
  currentStatus: ApplicationStatus;
  onChangeStatus: (status: ApplicationStatus) => void;
  userNotes: string;
  onSaveNotes: (notes: string) => void;
  onOpenDiagnostics: () => void;
  proposedBidValue?: number;
  onSaveProposedBid?: (amount: number) => void;
}

export const TenderDetailsModal: React.FC<TenderDetailsModalProps> = ({
  tender,
  match,
  profile,
  isOpen,
  onClose,
  checklist,
  onToggleChecklist,
  currentStatus,
  onChangeStatus,
  userNotes,
  onSaveNotes,
  onOpenDiagnostics,
  proposedBidValue,
  onSaveProposedBid,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'calculator'>('overview');
  const [notes, setNotes] = useState(userNotes);
  const [proposedBid, setProposedBid] = useState<string>(
    proposedBidValue && proposedBidValue > 0
      ? proposedBidValue.toString()
      : (tender.estimatedValue ? (tender.estimatedValue * 0.94).toFixed(0) : '')
  );

  useEffect(() => {
    if (proposedBidValue && proposedBidValue > 0) {
      setProposedBid(proposedBidValue.toString());
    } else if (tender.estimatedValue) {
      setProposedBid((tender.estimatedValue * 0.94).toFixed(0));
    } else {
      setProposedBid('');
    }
  }, [proposedBidValue, tender.id, tender.estimatedValue]);

  if (!isOpen) return null;

  // Checklist calculations
  const totalDocs = tender.documentsRequired?.length || 0;
  const completedDocs = (tender.documentsRequired || []).filter(d => checklist[d]).length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;

  // Deadline calculation
  const deadline = new Date(tender.submissionDeadline);
  const formattedDeadline = deadline.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Criteria data with fallbacks
  const allowedCategoriesStr = tender.eligibilityCriteria?.allowedEnterpriseCategories?.length
    ? tender.eligibilityCriteria.allowedEnterpriseCategories.join(', ')
    : 'Not specified (Open to all enterprise categories)';

  const minTurnoverStr = tender.eligibilityCriteria?.minTurnoverRequired
    ? formatINR(tender.eligibilityCriteria.minTurnoverRequired)
    : 'Not specified (No minimum turnover mandatory)';

  const minExperienceStr = tender.eligibilityCriteria?.minYearsExperienceRequired
    ? `${tender.eligibilityCriteria.minYearsExperienceRequired} Years in relevant domain`
    : 'Not specified (No minimum experience mandatory)';

  const minSingleOrderStr = tender.eligibilityCriteria?.minSingleWorkOrderValue
    ? formatINR(tender.eligibilityCriteria.minSingleWorkOrderValue)
    : 'Not specified (No single contract value specified)';

  const mandatoryCerts = tender.eligibilityCriteria?.mandatoryCertifications || [];
  const preferredCerts = tender.eligibilityCriteria?.preferredCertifications || [];

  const locationStr = tender.location
    ? `${tender.location.city || 'Not specified'}, ${tender.location.state || 'Not specified'}${tender.location.isPanIndia ? ' (Pan-India Scope)' : ''}`
    : 'Not specified';

  const consortiumStatusStr = tender.eligibilityCriteria?.consortiumAllowed
    ? 'Permitted (Joint Venture / Consortium bidding allowed)'
    : 'Not Permitted (Individual bidding only)';

  const subcontractingStr = tender.eligibilityCriteria?.subcontractingAllowed
    ? `Permitted (up to ${tender.eligibilityCriteria.subcontractingPercentage ?? 'specified'}%)`
    : 'Not Permitted';

  const purchasePrefStr = tender.eligibilityCriteria?.mseExemptionAllowed?.purchasePreferencePercent
    ? `${tender.eligibilityCriteria.mseExemptionAllowed.purchasePreferencePercent}% Procurement Reserve for MSEs (L1 + 15% price band)`
    : (tender.eligibilityCriteria?.makeInIndiaPreference ? `Make in India: ${tender.eligibilityCriteria.makeInIndiaPreference}` : 'Not specified');

  // Verdict badge helper
  const getVerdictBadge = () => {
    switch (match.verdict) {
      case 'HIGH_MATCH':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            HIGH MATCH ({match.overallScore}%)
          </span>
        );
      case 'MODERATE_MATCH':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            MODERATE FIT ({match.overallScore}%)
          </span>
        );
      case 'LOW_MATCH':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            LOW FIT ({match.overallScore}%)
          </span>
        );
      case 'INELIGIBLE':
      default:
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            INELIGIBLE ({match.overallScore}%)
          </span>
        );
    }
  };

  // Readiness badge helper
  const getReadinessBadge = () => {
    switch (match.bidReadinessLevel) {
      case 'Ready to Bid':
        return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Ready to Bid</span>;
      case 'Minor Prep Needed':
        return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Minor Prep Needed</span>;
      case 'High Effort Required':
        return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">High Effort Required</span>;
      case 'Not Feasible':
      default:
        return <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Not Feasible</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                tender.portal === 'GeM' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {tender.portal} E-TENDER
              </span>
              {tender.isDemoData !== false && (
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs" title="Demonstration tender data for academic project">
                  Demo Data
                </span>
              )}
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded" title={`Official Tender ID: ${tender.officialTenderId || tender.tenderNumber}`}>
                {tender.officialTenderId || tender.tenderNumber}
              </span>
              {getVerdictBadge()}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {tender.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {tender.issuingAuthority} {tender.department ? `(${tender.department})` : ''}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Deadline: <strong className="text-slate-800">{formattedDeadline}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {locationStr}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2 overflow-x-auto text-xs font-semibold">
          <div className="flex items-center gap-1 py-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RFP & Scope Overview
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'checklist' 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Bid Document Checklist</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full">
                {completedDocs}/{totalDocs}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'calculator' 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Price & Margin Simulator</span>
            </button>
          </div>

          <button
            onClick={onOpenDiagnostics}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 shrink-0 py-2 cursor-pointer"
          >
            Full AI Diagnostic Dossier →
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-medium text-[10px]">Tender Value</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {tender.estimatedValue ? formatINR(tender.estimatedValue) : 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium text-[10px]">EMD Requirement</span>
                  {match.exemptions.emdExempt ? (
                    <span className="text-xs font-bold text-emerald-700 block">
                      100% Waived ({formatINR(tender.earnestMoneyDeposit)})
                    </span>
                  ) : (
                    <span className="text-base font-bold text-slate-800">
                      {tender.earnestMoneyDeposit ? formatINR(tender.earnestMoneyDeposit) : 'Nil / Excluded'}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium text-[10px]">Tender Fee</span>
                  <span className="text-base font-bold text-slate-800">
                    {match.exemptions.feeExempt ? 'Free for MSEs' : (tender.tenderFee ? formatINR(tender.tenderFee) : 'Free / Nil')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-medium text-[10px]">Make In India</span>
                  <span className="text-xs font-bold text-indigo-700 block mt-0.5">
                    {tender.eligibilityCriteria?.makeInIndiaPreference || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* AI Matching Diagnosis Card (Task 4 Single Source of Truth) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      AI Match Diagnosis & Pre-Qualification Analysis
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Readiness:</span>
                    {getReadinessBadge()}
                  </div>
                </div>

                {/* Criteria evaluation pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {/* Turnover */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.turnover.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Annual Turnover</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.turnover.message}</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.experience.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Experience Duration</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.experience.message}</span>
                    </div>
                  </div>

                  {/* Single Contract Value */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.pastTrackRecord.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Single Contract Benchmark</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.pastTrackRecord.message}</span>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.certifications.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Mandatory Certifications</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.certifications.message}</span>
                    </div>
                  </div>

                  {/* Location Scope */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.location.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Geographic Scope</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.location.message}</span>
                    </div>
                  </div>

                  {/* Sector Match */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                    {match.breakdown.sectorAlignment.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-800 block">Sector Alignment</span>
                      <span className="text-[11px] text-slate-500">{match.breakdown.sectorAlignment.message}</span>
                    </div>
                  </div>
                </div>

                {/* Critical Gaps & Recommendations */}
                {match.gapAnalysis.criticalGaps.length > 0 && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                      Critical Eligibility Gaps to Resolve:
                    </span>
                    <ul className="text-xs text-rose-800 list-disc list-inside space-y-0.5 pl-1">
                      {match.gapAnalysis.criticalGaps.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.gapAnalysis.actionableRecommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-700" />
                      Actionable Recommendations:
                    </span>
                    <ul className="text-xs text-blue-800 list-disc list-inside space-y-0.5 pl-1">
                      {match.gapAnalysis.actionableRecommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Mandatory Pre-Qualification & Statutory Benchmarks (Task 3) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>Mandatory Pre-Qualification & Statutory Benchmarks</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Allowed Enterprise Categories */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Permitted Enterprise Classes
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {allowedCategoriesStr}
                    </span>
                  </div>

                  {/* Minimum Turnover Required */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Mandatory Annual Turnover
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {minTurnoverStr}
                    </span>
                  </div>

                  {/* Prior Experience Required */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Prior Operational Experience
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {minExperienceStr}
                    </span>
                  </div>

                  {/* Minimum Single Contract Value */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Min Single Work Order Value
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {minSingleOrderStr}
                    </span>
                  </div>

                  {/* Mandatory Certifications */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Mandatory Certifications
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mandatoryCerts.length > 0 ? (
                        mandatoryCerts.map((cert, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold text-[11px]">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600 font-medium">None required (Open to standard bidders)</span>
                      )}
                    </div>
                  </div>

                  {/* Preferred Certifications */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Preferred / Bonus Certifications
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preferredCerts.length > 0 ? (
                        preferredCerts.map((cert, idx) => (
                          <span key={idx} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold text-[11px]">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600 font-medium">None specified</span>
                      )}
                    </div>
                  </div>

                  {/* Consortium / Joint Venture Policy */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Consortium / Joint Venture Policy
                    </span>
                    <span className={`font-bold block mt-0.5 ${
                      tender.eligibilityCriteria?.consortiumAllowed ? 'text-emerald-700' : 'text-slate-700'
                    }`}>
                      {consortiumStatusStr}
                    </span>
                  </div>

                  {/* Subcontracting */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Subcontracting Allowance
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {subcontractingStr}
                    </span>
                  </div>

                  {/* Delivery Location */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Work / Delivery Location
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {locationStr}
                    </span>
                  </div>

                  {/* Purchase Preference Clause */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                      Procurement / Purchase Preference
                    </span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {purchasePrefStr}
                    </span>
                  </div>

                </div>
              </div>

              {/* Scope of Work */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Scope of Work Synopsis
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {tender.scopeSummary || 'Not specified'}
                </p>
              </div>

              {/* Detailed Deliverables */}
              {tender.detailedScope?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Key Technical Deliverables & Clauses
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {tender.detailedScope.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact / Officer Details */}
              {tender.contactDetails && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Issuing Department & Nodal Officer
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 pt-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-semibold block">{tender.contactDetails.officerName || 'Not specified'}</span>
                        <span className="text-slate-500 text-[11px]">{tender.contactDetails.designation || 'Nodal Authority'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-blue-600">{tender.contactDetails.email || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{tender.contactDetails.phone || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Official Portal Metadata & Provenance (Requirement 2 & 6) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Official Procurement Source & Portal Metadata</span>
                  </h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    tender.isDemoData !== false 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {tender.isDemoData !== false ? 'Demo Simulation Data' : 'Live Official Listing'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Official Tender ID</span>
                    <strong className="font-mono text-slate-800 block mt-0.5">{tender.officialTenderId || tender.tenderNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Publishing Department</span>
                    <span className="font-medium text-slate-800 block mt-0.5">{tender.publishingDepartment || tender.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Official Source Portal</span>
                    <span className="font-medium text-slate-800 block mt-0.5">{tender.officialSourceName || `${tender.portal} Portal`}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Publication Date</span>
                    <span className="text-slate-700 block mt-0.5">
                      {tender.publicationDate ? new Date(tender.publicationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : tender.publishedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Closing Date & Time</span>
                    <span className="text-slate-700 block mt-0.5">{formattedDeadline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase">Last Updated Timestamp</span>
                    <span className="text-slate-700 block mt-0.5 font-mono text-[11px]">
                      {tender.lastUpdatedTimestamp ? new Date(tender.lastUpdatedTimestamp).toLocaleString('en-IN') : 'Live System'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BID DOCUMENT CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              
              {/* Progress meter */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                  <span>Bid Preparation Progress</span>
                  <span>{completedDocs} of {totalDocs} Documents Ready ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-blue-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-blue-800">
                  Tick off each verified document as your bid team compiles the submission packet. All progress is saved automatically.
                </p>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mandatory Submission Enclosures
                </h3>
                <div className="space-y-2">
                  {(tender.documentsRequired || []).map((doc, idx) => {
                    const isChecked = !!checklist[doc];
                    return (
                      <div
                        key={idx}
                        onClick={() => onToggleChecklist(doc)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <button className="mt-0.5 text-blue-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <span className={`text-xs sm:text-sm font-semibold ${isChecked ? 'line-through text-slate-500' : ''}`}>
                            {doc}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {doc.toLowerCase().includes('udyam') && 'Must match corresponding NIC code for exemption claim.'}
                            {doc.toLowerCase().includes('ca') && 'Must bear Unique Document Identification Number (UDIN).'}
                            {doc.toLowerCase().includes('iso') && 'Accreditation from NABCB / IAF recognized board.'}
                            {doc.toLowerCase().includes('emd') && 'MSE statutory declaration in lieu of bank guarantee.'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes textarea */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Internal Team Notes & Bid Strategy
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    onSaveNotes(e.target.value);
                  }}
                  rows={3}
                  placeholder="Record bid pricing strategy, technical partner names, subcontractor quotes, or pre-bid queries..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                />
              </div>

            </div>
          )}

          {/* TAB 3: PRICE & MARGIN SIMULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>Bid Pricing & L1 Margin Calculator</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Estimated Tender Value (Official Benchmark)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={tender.estimatedValue ? formatINR(tender.estimatedValue) : 'Not specified'}
                      className="w-full bg-slate-200/70 p-2.5 rounded-lg font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">
                      Your Proposed Bid Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={proposedBid}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProposedBid(val);
                        const num = Number(val);
                        if (onSaveProposedBid && !isNaN(num) && num > 0) {
                          onSaveProposedBid(num);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 p-2.5 rounded-lg font-mono font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                    />
                  </div>
                </div>

                {/* Live calculation feedback */}
                {proposedBid && Number(proposedBid) > 0 && tender.estimatedValue > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Proposed Bid</span>
                        <span className="text-base font-extrabold text-blue-700">
                          {formatINR(Number(proposedBid))}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Discount from Benchmark</span>
                        <span className="text-base font-extrabold text-emerald-600">
                          {(((tender.estimatedValue - Number(proposedBid)) / tender.estimatedValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">MSE L1 + 15% Eligibility</span>
                        <span className="text-xs font-bold text-indigo-700 block mt-1">
                          Protected under 25% Allocation
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>MSE L1 Price Preference Rule (PPP-MSE Order 2012):</strong> If your quoted bid is within L1 + 15%, you will be invited to match the L1 price. Upon matching, you will be awarded a minimum of 25% of the total tender procurement volume.
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer with Pipeline Tracker Status */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Pipeline Stage:</span>
            <select
              value={currentStatus}
              onChange={(e) => onChangeStatus(e.target.value as ApplicationStatus)}
              className="bg-white border border-slate-300 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="Interested">Interested / Watching</option>
              <option value="Preparing Documents">Preparing Documents</option>
              <option value="Ready to Submit">Ready to Submit</option>
              <option value="Submitted">Submitted (Bid Placed)</option>
              <option value="Won">Won (Awarded)</option>
              <option value="Lost">Lost / Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            <a
              href={getOfficialTenderUrl(tender)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title={`Opens official government portal (${tender.portal}) to apply for this tender in a new browser tab`}
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
