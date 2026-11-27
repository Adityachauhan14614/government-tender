import React from 'react';
import { MSMEProfile, TrackedTender } from '../types';
import { 
  Building2, 
  FileCheck2, 
  Layers, 
  Sparkles, 
  Bookmark, 
  HelpCircle, 
  BarChart3, 
  Scale, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { formatINR } from '../services/matchmaker';

interface NavbarProps {
  currentProfile: MSMEProfile;
  activeTab: 'matcher' | 'comparison' | 'tracker' | 'policies' | 'profile';
  setActiveTab: (tab: 'matcher' | 'comparison' | 'tracker' | 'policies' | 'profile') => void;
  onOpenProfileSelector: () => void;
  trackedCount: number;
  compareCount: number;
  onOpenAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  activeTab,
  setActiveTab,
  onOpenProfileSelector,
  trackedCount,
  compareCount,
  onOpenAdvisor,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Govt of India style ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              MSME SAMBANDH & GeM INTEGRATED
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              National Public Procurement Eligibility & Matchmaking Engine for Indian MSMEs
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              GFR 2017 Rule 173(i) & PPP-MSE 2012 Compliant
            </span>
            <button 
              onClick={onOpenAdvisor}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Procurement Policy Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20 ring-2 ring-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">
                  Tender<span className="text-blue-600">Setu</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  MSME Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                AI Eligibility Matchmaker & Bid Discovery
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('matcher')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'matcher'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Matched Tenders</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === 'comparison'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Compare Tenders</span>
              {compareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === 'tracker'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bid Pipeline</span>
              {trackedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">
                  {trackedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('policies')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'policies'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>MSME Policies</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Profile</span>
            </button>
          </nav>

          {/* Active MSME Profile Switcher Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfileSelector}
              className="flex items-center gap-2.5 bg-slate-50 hover:bg-blue-50/80 border border-slate-300 hover:border-blue-400 p-1.5 pr-3 rounded-xl transition-all cursor-pointer text-left group"
              title="Click to switch or customize MSME Profile"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {currentProfile.companyName.substring(0, 2)}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 max-w-[150px] truncate group-hover:text-blue-700">
                    {currentProfile.companyName}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    currentProfile.category === 'Micro' 
                      ? 'bg-purple-100 text-purple-700' 
                      : currentProfile.category === 'Small' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentProfile.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                  <span>{currentProfile.udyamRegistrationNumber.substring(0, 14)}...</span>
                  <span className="text-emerald-600 font-sans font-semibold">
                    Turnover: {formatINR(currentProfile.financials.turnoverFY24)}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-1" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-around gap-1 mt-3 pt-2 border-t border-slate-200 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveTab('matcher')}
            className={`px-2.5 py-1.5 font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'matcher' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Matched Tenders
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-2.5 py-1.5 font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'comparison' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Compare ({compareCount})
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-2.5 py-1.5 font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'tracker' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Pipeline ({trackedCount})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-2.5 py-1.5 font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'policies' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Policies
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-2.5 py-1.5 font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600'
            }`}
          >
            Profile
          </button>
        </div>

      </div>
    </header>
  );
};
