import React from 'react';
import { MSMEProfile, Tender, MatchResult, TrackedTender } from '../types';
import { formatINR } from '../services/matchmaker';
import { normalizeStatus } from '../services/tenderStorage';
import { 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Award,
  Layers,
  Info,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCheck,
  XCircle
} from 'lucide-react';

interface HeaderStatsProps {
  profile: MSMEProfile;
  tenders: Tender[];
  matches: Map<string, MatchResult>;
  trackedTenders?: Record<string, TrackedTender>;
  onFilterHighMatches: () => void;
  onFilterEmdWaivers: () => void;
  onOpenTracker?: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  profile,
  tenders,
  matches,
  trackedTenders = {},
  onFilterHighMatches,
  onFilterEmdWaivers,
  onOpenTracker,
}) => {
  const matchResults = Array.from(matches.values());

  const highMatches = matchResults.filter(m => m.verdict === 'HIGH_MATCH');
  const moderateMatches = matchResults.filter(m => m.verdict === 'MODERATE_MATCH');
  
  // Calculate total addressable value for high + moderate tenders
  const addressableValue = tenders
    .filter(t => {
      const m = matches.get(t.id);
      return m && (m.verdict === 'HIGH_MATCH' || m.verdict === 'MODERATE_MATCH');
    })
    .reduce((sum, t) => sum + t.estimatedValue, 0);

  // Total EMD savings potential across all eligible tenders
  const totalEmdSavings = matchResults
    .filter(m => m.exemptions.emdExempt)
    .reduce((sum, m) => sum + m.exemptions.emdAmountSaved, 0);

  // Pipeline metrics from actual tracked tenders
  const trackedList = Object.values(trackedTenders);
  const totalInPipeline = trackedList.length;
  const interestedCount = trackedList.filter(t => normalizeStatus(t.status) === 'Interested').length;
  const inPrepCount = trackedList.filter(t => {
    const s = normalizeStatus(t.status);
    return s === 'Preparing Documents' || s === 'Ready to Submit';
  }).length;
  const submittedCount = trackedList.filter(t => normalizeStatus(t.status) === 'Submitted').length;
  const wonCount = trackedList.filter(t => normalizeStatus(t.status) === 'Won').length;
  const lostCount = trackedList.filter(t => normalizeStatus(t.status) === 'Lost').length;

  return (
    <div className="mb-6 space-y-4">
      {/* Profile banner alert */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-blue-800">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-12 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-xs">
                Active MSME Dossier
              </span>
              <span className="text-blue-200 text-xs">
                Registration: <code className="text-amber-300 font-mono">{profile.udyamRegistrationNumber}</code>
              </span>
              {profile.specialStatus.isStartupIndiaRecognized && (
                <span className="bg-emerald-500/30 text-emerald-200 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-400/30">
                  DPIIT Startup India Recognized
                </span>
              )}
              {profile.specialStatus.isZedCertified && (
                <span className="bg-amber-500/30 text-amber-200 text-[11px] font-medium px-2 py-0.5 rounded border border-amber-400/30">
                  ZED {profile.specialStatus.zedGrade} Certified
                </span>
              )}
              {profile.specialStatus.isWomenOwned && (
                <span className="bg-pink-500/30 text-pink-200 text-[11px] font-medium px-2 py-0.5 rounded border border-pink-400/30">
                  Women-Led MSE (3% Quota)
                </span>
              )}
              {profile.specialStatus.isScStOwned && (
                <span className="bg-purple-500/30 text-purple-200 text-[11px] font-medium px-2 py-0.5 rounded border border-purple-400/30">
                  SC/ST Owned MSE (4% Quota)
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{profile.companyName}</span>
              <span className="text-xs font-normal text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                HQ: {profile.location.city}, {profile.location.state}
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-3xl line-clamp-2">
              Primary Domain: <strong className="text-white">{profile.industrySector}</strong> • 
              3-Year Avg Turnover: <strong className="text-amber-300">{formatINR(profile.financials.averageTurnover)}</strong> • 
              Valid Certifications: <strong className="text-emerald-300">{profile.certifications.length} verified</strong> • 
              Highest Delivered Single Contract: <strong className="text-blue-300">{formatINR(profile.experience.maxSingleContractValue)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center min-w-[130px]">
              <div className="text-[11px] text-slate-300 uppercase font-semibold">Match Readiness</div>
              <div className="text-2xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
                <span>{highMatches.length}</span>
                <span className="text-xs text-slate-300 font-normal">/ {tenders.length} Ready</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-medium">
                {Math.round((highMatches.length / Math.max(1, tenders.length)) * 100)}% High Fit Ratio
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: High Match Tenders */}
        <div 
          onClick={onFilterHighMatches}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Eligible Tenders
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
            {highMatches.length}
            <span className="text-xs font-normal text-slate-400 ml-1.5">
              +{moderateMatches.length} conditional
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>Score ≥ 80% pre-qualified</span>
          </div>
        </div>

        {/* Card 2: Addressable Tender Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Addressable Pipeline
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {formatINR(addressableValue)}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
            <span>Govt contracts within capacity</span>
          </div>
        </div>

        {/* Card 3: EMD Savings */}
        <div 
          onClick={onFilterEmdWaivers}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              EMD Waived (MSE Benefit)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
            {formatINR(totalEmdSavings)}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <span>100% Bid security exempted</span>
          </div>
        </div>

        {/* Card 4: Public Procurement Policy Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              PPP-MSE 25% Quota
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-900">
            {profile.category === 'Medium' ? 'Excluded' : '25% Benefit'}
          </div>
          <div className="text-[11px] text-indigo-700 font-medium mt-1 flex items-center gap-1 truncate">
            {profile.category === 'Medium' 
              ? 'Works & High-Cap Tenders' 
              : 'L1 + 15% Price Match Band'}
          </div>
        </div>

      </div>

      {/* Live Pipeline Summary Bar (Task 4 Dashboard Integration) */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
          <span className="font-bold text-slate-800">Bid Pipeline Live Dashboard:</span>
          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full font-mono">
            {totalInPipeline} Tracked
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            Interested: <strong className="text-slate-900">{interestedCount}</strong>
          </span>
          <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-medium border border-blue-200">
            Preparing: <strong className="text-blue-900">{inPrepCount}</strong>
          </span>
          <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-medium border border-purple-200">
            Submitted: <strong className="text-purple-900">{submittedCount}</strong>
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
            Won: <strong className="text-emerald-900">{wonCount}</strong>
          </span>
          <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-medium border border-rose-200">
            Lost: <strong className="text-rose-900">{lostCount}</strong>
          </span>

          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 ml-1 inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
