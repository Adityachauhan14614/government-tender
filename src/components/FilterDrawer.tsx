import React, { useEffect } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Tag, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  IndianRupee,
  X,
  Check
} from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
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
}) => {
  // Listen for ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Semi-transparent Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-[#060B18]/70 backdrop-blur-xs z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer from Right (380px wide on desktop, full width on mobile) */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[380px] bg-white text-slate-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Filter Tenders"
      >
        {/* Header: Title, Showing X of 8 count, and Close Button */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight leading-tight">
                Filter Tenders
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Showing {totalFiltered} of {totalAvailable}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close filter drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: All 7 filters in identical specified order */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          
          {/* 1. Eligibility Verdict */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Eligibility Verdict</span>
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

          {/* 2. Procurement Portal */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Procurement Portal</span>
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

          {/* 3. Industry Sector */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Tag className="w-3.5 h-3.5 text-violet-600" />
              <span>Industry Sector</span>
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

          {/* 4. Tender Estimated Value */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tender Estimated Value</span>
            </label>
            <select
              value={selectedValueRange}
              onChange={(e) => setSelectedValueRange(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">Any Budget Value</option>
              <option value="UNDER_1CR">Under ₹1 Crore</option>
              <option value="1CR_TO_5CR">₹1 Crore to ₹5 Crore</option>
              <option value="ABOVE_5CR">Above ₹5 Crore</option>
            </select>
          </div>

          {/* 5. MSME Classification */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>MSME Classification</span>
            </label>
            <select
              value={selectedEnterpriseCategory}
              onChange={(e) => setSelectedEnterpriseCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">All Enterprises</option>
              <option value="Micro">Micro Enterprises</option>
              <option value="Small">Small Enterprises</option>
              <option value="Medium">Medium Enterprises</option>
            </select>
          </div>

          {/* 6. Tender Status */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>Tender Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="ALL">All Active & Closing</option>
              <option value="Active">Active Bids</option>
              <option value="Closing Soon">Closing Soon (≤ 7 Days)</option>
            </select>
          </div>

          {/* 7. 100% EMD Waived Only Checkbox */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer group hover:bg-blue-50/50 hover:border-blue-200 transition-all select-none">
              <input
                type="checkbox"
                checked={onlyEmdExempt}
                onChange={(e) => setOnlyEmdExempt(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700 transition-colors">
                  100% EMD Waived Only
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  GFR 2017 Rule 173(i) MSE Exemption
                </span>
              </div>
            </label>
          </div>

        </div>

        {/* Sticky Footer: "Reset All" (outline) and "Apply Filters" (primary) */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset All</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </aside>
    </>
  );
};
