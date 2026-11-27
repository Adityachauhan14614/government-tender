import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  LayoutGrid, 
  List, 
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedVerdict: string;
  setSelectedVerdict: (v: string) => void;
  selectedPortal: string;
  setSelectedPortal: (p: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  onlyEmdExempt: boolean;
  setOnlyEmdExempt: (b: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedState: string;
  setSelectedState: (st: string) => void;
  selectedValueRange: string;
  setSelectedValueRange: (vr: string) => void;
  selectedEnterpriseCategory: string;
  setSelectedEnterpriseCategory: (ec: string) => void;
  selectedCertification: string;
  setSelectedCertification: (cert: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  viewMode: 'grid' | 'table';
  setViewMode: (v: 'grid' | 'table') => void;
  totalFiltered: number;
  totalAvailable: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedVerdict,
  setSelectedVerdict,
  selectedPortal,
  setSelectedPortal,
  selectedSector,
  setSelectedSector,
  onlyEmdExempt,
  setOnlyEmdExempt,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  selectedValueRange,
  setSelectedValueRange,
  selectedEnterpriseCategory,
  setSelectedEnterpriseCategory,
  selectedCertification,
  setSelectedCertification,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  totalFiltered,
  totalAvailable,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Check how many advanced filters are active
  const advancedFilterCount = [
    selectedCategory !== 'ALL',
    selectedState !== 'ALL',
    selectedValueRange !== 'ALL',
    selectedEnterpriseCategory !== 'ALL',
    selectedCertification !== 'ALL',
    selectedStatus !== 'ALL',
  ].filter(Boolean).length;

  const isFiltered = 
    searchQuery.trim() !== '' || 
    selectedVerdict !== 'ALL' || 
    selectedPortal !== 'ALL' || 
    selectedSector !== 'ALL' || 
    onlyEmdExempt ||
    advancedFilterCount > 0;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs mb-6 space-y-3">
      {/* Search and primary toggle row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenders by title, ID, ref number, ministry, sector, or city (e.g. Solar, AIIMS, GeM, Vadodara)..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all outline-hidden text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Verdict quick tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedVerdict('ALL')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              selectedVerdict === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tenders ({totalAvailable})
          </button>
          <button
            onClick={() => setSelectedVerdict('HIGH_MATCH')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              selectedVerdict === 'HIGH_MATCH'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            High Match (≥80%)
          </button>
          <button
            onClick={() => setSelectedVerdict('MODERATE_MATCH')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-all ${
              selectedVerdict === 'MODERATE_MATCH'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            Moderate Fit
          </button>
        </div>

        {/* View Mode */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md ${
              viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md ${
              viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Primary filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Portal Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Portal:</span>
            <select
              value={selectedPortal}
              onChange={(e) => setSelectedPortal(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Portals (GeM, CPPP, IREPS)</option>
              <option value="GeM">GeM Portal Only</option>
              <option value="CPPP">CPPP Portal Only</option>
              <option value="IREPS">Indian Railways (IREPS)</option>
            </select>
          </div>

          {/* Sector Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 max-w-[200px] cursor-pointer"
            >
              <option value="ALL">All Industry Sectors</option>
              <option value="Solar">Solar & Renewable Power</option>
              <option value="Electrical">Electrical Equipment & Panels</option>
              <option value="Cybersecurity">Cybersecurity & Software Services</option>
              <option value="Medical Devices">Medical Devices & Consumables</option>
              <option value="Civil Works">Civil Infrastructure & Roads</option>
              <option value="Eco-Products">Eco-Packaging & Waste Bags</option>
            </select>
          </div>

          {/* EMD Exemption checkbox */}
          <label className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 rounded-md px-2.5 py-1 cursor-pointer transition-colors text-amber-900 select-none font-medium">
            <input
              type="checkbox"
              checked={onlyEmdExempt}
              onChange={(e) => setOnlyEmdExempt(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>100% EMD Waived Only</span>
          </label>

          {/* Advanced Filters Toggle Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              showAdvanced || advancedFilterCount > 0
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
            {advancedFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {advancedFilterCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium ml-1 cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{totalFiltered}</strong> of {totalAvailable} tenders
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="MATCH_DESC">Highest Match Score</option>
              <option value="VALUE_DESC">Tender Value: High to Low</option>
              <option value="VALUE_ASC">Tender Value: Low to High</option>
              <option value="DEADLINE_ASC">Submission Deadline: Urgency</option>
              <option value="EMD_SAVED_DESC">Highest EMD Savings</option>
            </select>
          </div>
        </div>

      </div>

      {/* Advanced Filter Drawer (Collapsible) */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100 text-xs bg-slate-50/60 p-3 rounded-lg">
          
          {/* Tender Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Products">Products</option>
              <option value="Services">Services</option>
              <option value="Works">Works & Civil</option>
            </select>
          </div>

          {/* Location / State */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">State / Scope:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Locations</option>
              <option value="Pan-India">Pan-India Only</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Karnataka">Karnataka</option>
            </select>
          </div>

          {/* Estimated Tender Value */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">Tender Value:</label>
            <select
              value={selectedValueRange}
              onChange={(e) => setSelectedValueRange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Any Budget</option>
              <option value="UNDER_1CR">Under ₹1 Crore</option>
              <option value="1CR_TO_5CR">₹1 Cr to ₹5 Crore</option>
              <option value="ABOVE_5CR">Above ₹5 Crore</option>
            </select>
          </div>

          {/* Enterprise Eligibility */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">Enterprise Class:</label>
            <select
              value={selectedEnterpriseCategory}
              onChange={(e) => setSelectedEnterpriseCategory(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Enterprises</option>
              <option value="Micro">Micro Enterprises</option>
              <option value="Small">Small Enterprises</option>
              <option value="Medium">Medium Enterprises</option>
            </select>
          </div>

          {/* Mandatory Certification */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">Mandatory Cert:</label>
            <select
              value={selectedCertification}
              onChange={(e) => setSelectedCertification(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Any / None Required</option>
              <option value="NONE_REQUIRED">No Mandatory Certs</option>
              <option value="ISO-9001">ISO 9001 (QMS)</option>
              <option value="BIS-ISI">BIS / ISI Marked</option>
              <option value="ISO-27001">ISO 27001 (Security)</option>
              <option value="CERT-IN">CERT-In Empaneled</option>
              <option value="ISO-13485">ISO 13485 (Medical)</option>
              <option value="CPWD-CLASS-1">CPWD Class-1</option>
              <option value="CIPET-17088">CIPET / IS 17088</option>
            </select>
          </div>

          {/* Tender Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 block">Tender Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md py-1 px-2 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Closing Soon">Closing Soon (Urgent)</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
};
