import React, { useState } from 'react';
import { 
  Tender, 
  MatchResult, 
  MSMEProfile, 
  TrackedTender 
} from '../types';
import { 
  ShieldCheck, 
  Scale, 
  Bookmark, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  Trash2, 
  BookOpen
} from 'lucide-react';
import { formatINR } from '../services/matchmaker';

interface QuickToolsSidebarProps {
  tenders: Tender[];
  matches: Map<string, MatchResult>;
  profile: MSMEProfile;
  comparedTenderIds: string[];
  onToggleCompare: (tenderId: string) => void;
  onOpenComparisonModal: () => void;
  trackedTenders: Record<string, TrackedTender>;
  onOpenBidTracker: () => void;
  onOpenDiagnostics: (tender: Tender) => void;
  onOpenAdvisor: () => void;
  onOpenDetails: (tender: Tender) => void;
}

export const QuickToolsSidebar: React.FC<QuickToolsSidebarProps> = ({
  tenders,
  matches,
  profile,
  comparedTenderIds,
  onToggleCompare,
  onOpenComparisonModal,
  trackedTenders,
  onOpenBidTracker,
  onOpenDiagnostics,
  onOpenAdvisor,
}) => {
  // Quick eligibility selected tender ID
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string>(() => {
    return tenders[0]?.id || '';
  });

  const selectedDiagnosticTender = tenders.find(t => t.id === selectedDiagnosticId) || tenders[0];
  const diagnosticMatch = selectedDiagnosticTender ? matches.get(selectedDiagnosticTender.id) : undefined;

  const comparedTenders = tenders.filter(t => comparedTenderIds.includes(t.id));

  // Bid Pipeline stats
  const pipelineTenders = Object.values(trackedTenders);
  const totalPipelineValue = pipelineTenders.reduce((sum, tr) => {
    const tender = tenders.find(t => t.id === tr.tenderId);
    return sum + (tender ? (tr.bidValueProposed || tender.estimatedValue) : 0);
  }, 0);

  const activePipelineStages = pipelineTenders.reduce((acc, tr) => {
    acc[tr.status] = (acc[tr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="space-y-5 w-full">
      
      {/* TOOL 1: QUICK ELIGIBILITY CHECK */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">Quick Eligibility</h3>
              <p className="text-[10px] text-slate-400">Evaluate {profile.category} criteria</p>
            </div>
          </div>
        </div>

        {/* Tender Selector Dropdown */}
        <div className="mb-3">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Select Tender to Evaluate
          </label>
          <select
            value={selectedDiagnosticId}
            onChange={(e) => setSelectedDiagnosticId(e.target.value)}
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all truncate"
          >
            {tenders.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.portal}] {t.tenderNumber} - {t.title.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>

        {/* Selected Tender Quick Match Card */}
        {selectedDiagnosticTender && diagnosticMatch && (
          <div className="space-y-2.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                {selectedDiagnosticTender.title}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                diagnosticMatch.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                diagnosticMatch.overallScore >= 60 ? 'bg-amber-100 text-amber-900' :
                'bg-rose-100 text-rose-800'
              }`}>
                {diagnosticMatch.overallScore}% Fit
              </span>
            </div>

            {/* Quick check items */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-slate-100">
                {diagnosticMatch.breakdown.turnover.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className="text-slate-600 truncate">Turnover Check</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-slate-100">
                {diagnosticMatch.breakdown.experience.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="text-slate-600 truncate">Experience</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-slate-100">
                {diagnosticMatch.exemptions.emdExempt ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="text-slate-600 truncate">EMD Waived</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-2 py-1.5 rounded-lg border border-slate-100">
                {diagnosticMatch.breakdown.certifications.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                )}
                <span className="text-slate-600 truncate">Certs Match</span>
              </div>
            </div>

            {/* Launch Detailed Diagnostic Button */}
            <button
              onClick={() => onOpenDiagnostics(selectedDiagnosticTender)}
              className="w-full mt-1 text-[11px] font-bold py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>View Full Diagnostic</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* TOOL 2: TENDER COMPARISON LAUNCHER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">Compare Tenders</h3>
              <p className="text-[10px] text-slate-400">Side-by-side RFP matrix</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            {comparedTenderIds.length} / 3 Selected
          </span>
        </div>

        {comparedTenders.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200 space-y-1.5">
            <Scale className="w-6 h-6 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No tenders selected</p>
            <p className="text-[10px] text-slate-400">
              Click <span className="font-semibold text-purple-600">"Compare"</span> on 2 or 3 tender cards.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="space-y-1.5">
              {comparedTenders.map((t) => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[9px] text-purple-700 block font-semibold">{t.tenderNumber}</span>
                    <span className="font-medium text-slate-800 truncate block">{t.title}</span>
                  </div>
                  <button
                    onClick={() => onToggleCompare(t.id)}
                    title="Remove from comparison"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-1 flex gap-2">
              <button
                disabled={comparedTenderIds.length < 2}
                onClick={onOpenComparisonModal}
                className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  comparedTenderIds.length >= 2
                    ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Launch Matrix ({comparedTenderIds.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  comparedTenderIds.forEach(id => onToggleCompare(id));
                }}
                title="Clear all selected"
                className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            {comparedTenderIds.length === 1 && (
              <p className="text-[10px] text-amber-600 font-medium text-center">
                Select 1 more tender to unlock comparison
              </p>
            )}
          </div>
        )}
      </div>

      {/* TOOL 3: BID PIPELINE SNAPSHOT */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">Bid Pipeline</h3>
              <p className="text-[10px] text-slate-400">Tracked bids & stages</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
            {pipelineTenders.length} Active
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Pipeline Value:</span>
            <span className="font-extrabold text-slate-900">{formatINR(totalPipelineValue)}</span>
          </div>

          {/* Pipeline stage chips */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-white p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Interested:</span>
              <span className="font-bold text-slate-800">{activePipelineStages['Interested'] || 0}</span>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Reviewing RFP:</span>
              <span className="font-bold text-slate-800">{activePipelineStages['Reviewing RFP'] || 0}</span>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Preparing Bid:</span>
              <span className="font-bold text-slate-800">{activePipelineStages['Preparing Bid'] || 0}</span>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Submitted:</span>
              <span className="font-bold text-emerald-700">{activePipelineStages['Submitted'] || 0}</span>
            </div>
          </div>

          <button
            onClick={onOpenBidTracker}
            className="w-full text-[11px] font-bold py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Open Bid Pipeline Board</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* TOOL 4: STATUTORY MSME PROCUREMENT POLICY GUIDELINES */}
      <div className="bg-gradient-to-br from-[#0B1224] via-[#111C35] to-[#1E1B4B] rounded-2xl p-4 text-white shadow-enterprise border border-[#192648] space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-glow-blue">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Statutory Benefits</h4>
            <p className="text-[10px] text-blue-300">Public Procurement Order 2012</p>
          </div>
        </div>

        <div className="space-y-2 text-[11px] text-blue-100">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="font-bold text-amber-300 block text-[10px] uppercase tracking-wider">GFR Rule 173(i)</span>
            <p className="text-[11px] text-slate-200 leading-snug mt-0.5">
              100% Earnest Money Deposit (EMD) exemption for all valid Udyam registered MSEs.
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="font-bold text-emerald-300 block text-[10px] uppercase tracking-wider">PPP-MSE Order</span>
            <p className="text-[11px] text-slate-200 leading-snug mt-0.5">
              25% annual central procurement quota + 15% price preference band (L1 + 15%).
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAdvisor}
          className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-1.5 transition-all shadow-glow-blue cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Consult AI Policy Advisor</span>
        </button>
      </div>

    </aside>
  );
};
