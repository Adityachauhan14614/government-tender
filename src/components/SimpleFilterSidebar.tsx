import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Tag, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  IndianRupee,
  X 
} from 'lucide-react';

interface SimpleFilterSidebarProps {
  selectedPortal: string;
  setSelectedPortal: (portal: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedValueRange: string;
  setSelectedValueRange: (range: string) => void;
  selectedEnterpriseCategory: string;
  setSelectedEnterpriseCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onlyEmdExempt: boolean;
  setOnlyEmdExempt: (exempt: boolean) => void;
  selectedVerdict: string;
  setSelectedVerdict: (verdict: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalAvailable: number;
  onClose?: () => void;
}

export const SimpleFilterSidebar: React.FC<SimpleFilterSidebarProps> = ({
  selectedPortal,
  setSelectedPortal,
  selectedSector,
  setSelectedSector,
  selectedValueRange,
  setSelectedValueRange,
  selectedEnterpriseCategory,
  setSelectedEnterpriseCategory,
  selectedStatus,
  setSelectedStatus,
  onlyEmdExempt,
  setOnlyEmdExempt,
  selectedVerdict,
  setSelectedVerdict,
  onResetFilters,
  totalFiltered,
  totalAvailable,
  onClose,
}) => {
  const isFiltered = 
    selectedPortal !== 'ALL' ||
    selectedSector !== 'ALL' ||
    selectedValueRange !== 'ALL' ||
    selectedEnterpriseCategory !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    onlyEmdExempt ||
    selectedVerdict !== 'ALL';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Filter Tenders
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Showing {totalFiltered} of {totalAvailable}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
              title="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter 1: Eligibility Fit */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Eligibility Verdict
          </span>
        </label>
        <select
          value={selectedVerdict}
          onChange={(e) => setSelectedVerdict(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">All Verdicts</option>
          <option value="HIGH_MATCH">High Match Only (80%+ Score)</option>
          <option value="MODERATE_MATCH">Moderate Fit (Conditional)</option>
          <option value="LOW_MATCH">Low Alignment</option>
          <option value="INELIGIBLE">Ineligible Only</option>
        </select>
      </div>

      {/* Filter 2: Official Portal Source */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            Procurement Portal
          </span>
        </label>
        <select
          value={selectedPortal}
          onChange={(e) => setSelectedPortal(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">All Portals (GeM & CPPP)</option>
          <option value="GeM">GeM (Government e-Marketplace)</option>
          <option value="CPPP">CPPP (Central e-Procure)</option>
        </select>
      </div>

      {/* Filter 3: Industry Sector */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-violet-600" />
            Industry Sector
          </span>
        </label>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">All Industry Sectors</option>
          <option value="Renewable Energy">Renewable Energy / Solar</option>
          <option value="IT & Software">IT & Software Systems</option>
          <option value="Healthcare">Healthcare & Diagnostics</option>
          <option value="Manufacturing">Manufacturing & Engineering</option>
          <option value="Smart City Solutions">Smart City Solutions</option>
        </select>
      </div>

      {/* Filter 4: Tender Value Range */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            Tender Estimated Value
          </span>
        </label>
        <select
          value={selectedValueRange}
          onChange={(e) => setSelectedValueRange(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">Any Budget Value</option>
          <option value="BELOW_1CR">Under ₹1 Crore</option>
          <option value="1CR_TO_5CR">₹1 Crore to ₹5 Crore</option>
          <option value="ABOVE_5CR">Above ₹5 Crore</option>
        </select>
      </div>

      {/* Filter 5: Enterprise Eligibility */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            MSME Classification
          </span>
        </label>
        <select
          value={selectedEnterpriseCategory}
          onChange={(e) => setSelectedEnterpriseCategory(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">All Enterprises</option>
          <option value="MICRO">Micro Enterprises</option>
          <option value="SMALL">Small Enterprises</option>
          <option value="MEDIUM">Medium Enterprises</option>
        </select>
      </div>

      {/* Filter 6: Deadline Urgency Status */}
      <div className="space-y-1.5 text-xs">
        <label className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            Tender Status
          </span>
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
        >
          <option value="ALL">All Active & Closing</option>
          <option value="ACTIVE">Active Bids</option>
          <option value="CLOSING_SOON">Closing Soon (≤ 7 Days)</option>
        </select>
      </div>

      {/* Filter 7: EMD Exemption Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-start gap-2.5 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={onlyEmdExempt}
            onChange={(e) => setOnlyEmdExempt(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
          <div>
            <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
              100% EMD Waived Only
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              GFR 2017 Rule 173(i) MSE Exemption
            </span>
          </div>
        </label>
      </div>

    </div>
  );
};
