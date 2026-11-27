import React, { useState, useMemo, useEffect } from 'react';
import { 
  MSMEProfile, 
  Tender, 
  MatchResult, 
  TrackedTender, 
  ApplicationStatus,
  getOfficialTenderUrl 
} from './types';
import { mockMSMEProfiles } from './data/mockProfiles';
import { evaluateTenderMatch, formatINR } from './services/matchmaker';
import { 
  loadProfiles, 
  saveProfiles, 
  loadCurrentProfileId, 
  saveCurrentProfileId, 
  loadTenders, 
  loadTrackedTenders, 
  saveTrackedTenders 
} from './services/tenderStorage';

import { Sidebar, NavTab } from './components/Sidebar';
import { SimpleFilterSidebar } from './components/SimpleFilterSidebar';
import { FilterDrawer } from './components/FilterDrawer';
import { QuickToolsSidebar } from './components/QuickToolsSidebar';
import { TenderCard } from './components/TenderCard';
import { TenderMatchDiagnostic } from './components/TenderMatchDiagnostic';
import { TenderDetailsModal } from './components/TenderDetailsModal';
import { ProfileSelector } from './components/ProfileSelector';
import { ProfileEditorModal } from './components/ProfileEditorModal';
import { TenderComparisonModal } from './components/TenderComparisonModal';
import { BidTracker } from './components/BidTracker';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { ExportReportModal } from './components/ExportReportModal';

import { 
  Building2, 
  Award, 
  ShieldCheck, 
  FileCheck2, 
  Calendar, 
  Edit3, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  Search,
  SlidersHorizontal,
  Bell,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers,
  ArrowUpDown,
  LayoutGrid,
  List,
  Menu,
  X,
  Database,
  Scale,
  Bookmark,
  Filter,
  ArrowRight
} from 'lucide-react';

export function App() {
  // Profiles State
  const [profiles, setProfiles] = useState<MSMEProfile[]>(() => loadProfiles());
  const [currentProfileId, setCurrentProfileId] = useState<string>(() => loadCurrentProfileId());

  // Current active profile
  const currentProfile = useMemo(() => {
    return profiles.find(p => p.id === currentProfileId) || profiles[0] || mockMSMEProfiles[0];
  }, [profiles, currentProfileId]);

  // Tenders State
  const [tenders] = useState<Tender[]>(() => loadTenders());

  // Tracked tenders (Pipeline / Bookmarks)
  const [trackedTenders, setTrackedTenders] = useState<Record<string, TrackedTender>>(() => loadTrackedTenders());

  // Compared tender IDs (up to 3)
  const [comparedTenderIds, setComparedTenderIds] = useState<string[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Sidebar and tools panel states
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showRightTools, setShowRightTools] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');
  const [selectedPortal, setSelectedPortal] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [onlyEmdExempt, setOnlyEmdExempt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedValueRange, setSelectedValueRange] = useState<string>('ALL');
  const [selectedEnterpriseCategory, setSelectedEnterpriseCategory] = useState<string>('ALL');
  const [selectedCertification, setSelectedCertification] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState('MATCH_DESC');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<MSMEProfile | undefined>(undefined);
  const [diagnosticTender, setDiagnosticTender] = useState<Tender | null>(null);
  const [detailsTender, setDetailsTender] = useState<Tender | null>(null);
  const [exportTender, setExportTender] = useState<Tender | null>(null);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Sync profiles and current profile ID to storage
  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveCurrentProfileId(currentProfileId);
  }, [currentProfileId]);

  useEffect(() => {
    saveTrackedTenders(trackedTenders);
  }, [trackedTenders]);

  // Real-time Match Calculation Engine for all tenders against active profile
  const matches = useMemo(() => {
    const matchMap = new Map<string, MatchResult>();
    for (const tender of tenders) {
      matchMap.set(tender.id, evaluateTenderMatch(currentProfile, tender));
    }
    return matchMap;
  }, [currentProfile, tenders]);

  // Summary Card Metrics Calculations
  const highMatchesCount = useMemo(() => {
    return tenders.filter(t => {
      const m = matches.get(t.id);
      return m && m.overallScore >= 75 && m.verdict !== 'INELIGIBLE';
    }).length;
  }, [tenders, matches]);

  const totalTenderValue = useMemo(() => {
    return tenders.reduce((sum, t) => sum + t.estimatedValue, 0);
  }, [tenders]);

  const emdExemptCount = useMemo(() => {
    return tenders.filter(t => matches.get(t.id)?.exemptions.emdExempt).length;
  }, [tenders, matches]);

  const totalEmdSaved = useMemo(() => {
    return tenders.reduce((sum, t) => sum + (matches.get(t.id)?.exemptions.emdAmountSaved || 0), 0);
  }, [tenders, matches]);

  const pppMseCount = useMemo(() => {
    return tenders.filter(t => {
      const m = matches.get(t.id);
      return (
        (m?.exemptions.msePricePreferenceEligible) ||
        t.eligibilityCriteria.mseExemptionAllowed.purchasePreferencePercent > 0 ||
        t.eligibilityCriteria.allowedEnterpriseCategories.includes('Micro')
      );
    }).length;
  }, [tenders, matches]);

  // Filtered & Sorted Tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const match = matches.get(t.id);
      if (!match) return false;

      // Search Query: robust whitespace-trimmed case-insensitive token search
      if (searchQuery.trim()) {
        const queryTokens = searchQuery.trim().toLowerCase().split(/\s+/);
        const searchCorpus = [
          t.title,
          t.tenderNumber,
          t.officialTenderId || '',
          t.id,
          t.issuingAuthority,
          t.department,
          t.publishingDepartment || '',
          t.officialSourceName || '',
          t.category,
          t.subCategory,
          t.location.state,
          t.location.city,
          ...(t.matchedSectorTags || [])
        ].join(' ').toLowerCase();

        const allTokensMatch = queryTokens.every(token => searchCorpus.includes(token));
        if (!allTokensMatch) return false;
      }

      // Verdict filter
      if (selectedVerdict !== 'ALL') {
        if (selectedVerdict === 'HIGH_MATCH' && match.verdict !== 'HIGH_MATCH') return false;
        if (selectedVerdict === 'MODERATE_MATCH' && match.verdict !== 'MODERATE_MATCH') return false;
        if (selectedVerdict === 'LOW_MATCH' && match.verdict !== 'LOW_MATCH') return false;
        if (selectedVerdict === 'INELIGIBLE' && match.verdict !== 'INELIGIBLE') return false;
      }

      // Portal filter
      if (selectedPortal !== 'ALL' && t.portal !== selectedPortal) {
        return false;
      }

      // Sector filter
      if (selectedSector !== 'ALL') {
        const matchesSec = t.matchedSectorTags.some(tag => 
          tag.toLowerCase().includes(selectedSector.toLowerCase())
        ) || t.subCategory.toLowerCase().includes(selectedSector.toLowerCase());
        if (!matchesSec) return false;
      }

      // EMD exemption filter
      if (onlyEmdExempt && !match.exemptions.emdExempt) {
        return false;
      }

      // Tender Category filter (Products, Works, Services)
      if (selectedCategory !== 'ALL' && t.category !== selectedCategory) {
        return false;
      }

      // Location / State filter
      if (selectedState !== 'ALL') {
        if (selectedState === 'Pan-India') {
          if (!t.location.isPanIndia) return false;
        } else {
          if (t.location.state.toLowerCase() !== selectedState.toLowerCase() && !t.location.isPanIndia) {
            return false;
          }
        }
      }

      // Estimated Value Range filter
      if (selectedValueRange !== 'ALL') {
        if (selectedValueRange === 'UNDER_1CR' && t.estimatedValue >= 10000000) return false;
        if (selectedValueRange === '1CR_TO_5CR' && (t.estimatedValue < 10000000 || t.estimatedValue > 50000000)) return false;
        if (selectedValueRange === 'ABOVE_5CR' && t.estimatedValue <= 50000000) return false;
      }

      // Enterprise Category filter (Micro, Small, Medium)
      if (selectedEnterpriseCategory !== 'ALL') {
        if (!t.eligibilityCriteria.allowedEnterpriseCategories.includes(selectedEnterpriseCategory as any)) {
          return false;
        }
      }

      // Mandatory Certification filter
      if (selectedCertification !== 'ALL') {
        if (selectedCertification === 'NONE_REQUIRED') {
          if (t.eligibilityCriteria.mandatoryCertifications.length > 0) return false;
        } else {
          const hasCert = t.eligibilityCriteria.mandatoryCertifications.some(
            c => c.toLowerCase() === selectedCertification.toLowerCase()
          );
          if (!hasCert) return false;
        }
      }

      // Tender Status filter
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const matchA = matches.get(a.id);
      const matchB = matches.get(b.id);
      const scoreA = matchA ? matchA.overallScore : 0;
      const scoreB = matchB ? matchB.overallScore : 0;

      if (sortBy === 'MATCH_DESC') return scoreB - scoreA;
      if (sortBy === 'VALUE_DESC') return b.estimatedValue - a.estimatedValue;
      if (sortBy === 'VALUE_ASC') return a.estimatedValue - b.estimatedValue;
      if (sortBy === 'DEADLINE_ASC') {
        return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
      }
      if (sortBy === 'EMD_SAVED_DESC') {
        const savedA = matchA?.exemptions.emdAmountSaved || 0;
        const savedB = matchB?.exemptions.emdAmountSaved || 0;
        return savedB - savedA;
      }
      return 0;
    });
  }, [
    tenders, 
    matches, 
    searchQuery, 
    selectedVerdict, 
    selectedPortal, 
    selectedSector, 
    onlyEmdExempt, 
    selectedCategory,
    selectedState,
    selectedValueRange,
    selectedEnterpriseCategory,
    selectedCertification,
    selectedStatus,
    sortBy
  ]);

  // Handlers for Tracking & Comparison
  const handleToggleTrack = (tenderId: string) => {
    setTrackedTenders(prev => {
      const copy = { ...prev };
      if (copy[tenderId]) {
        delete copy[tenderId];
      } else {
        copy[tenderId] = {
          tenderId,
          status: 'Interested',
          userNotes: '',
          checklist: {},
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return copy;
    });
  };

  const handleRemoveTracked = (tenderId: string) => {
    const tender = tenders.find(t => t.id === tenderId);
    const label = tender ? `"${tender.title.slice(0, 45)}..."` : 'this tender';
    if (window.confirm(`Are you sure you want to remove ${label} from your bid pipeline?`)) {
      setTrackedTenders(prev => {
        const copy = { ...prev };
        delete copy[tenderId];
        return copy;
      });
    }
  };

  const handleUpdateTargetDate = (tenderId: string, targetDate: string) => {
    setTrackedTenders(prev => {
      const current = prev[tenderId];
      if (!current) return prev;
      return {
        ...prev,
        [tenderId]: {
          ...current,
          targetSubmissionDate: targetDate,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleToggleCompare = (tenderId: string) => {
    setComparedTenderIds(prev => {
      if (prev.includes(tenderId)) {
        return prev.filter(id => id !== tenderId);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 tenders simultaneously. Please remove one first.');
        return prev;
      }
      return [...prev, tenderId];
    });
  };

  const handleToggleChecklist = (tenderId: string, docName: string) => {
    setTrackedTenders(prev => {
      const current = prev[tenderId] || {
        tenderId,
        status: 'Interested',
        userNotes: '',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedChecklist = {
        ...current.checklist,
        [docName]: !current.checklist[docName]
      };
      return {
        ...prev,
        [tenderId]: {
          ...current,
          checklist: updatedChecklist,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleUpdateStatus = (tenderId: string, status: ApplicationStatus) => {
    setTrackedTenders(prev => {
      const current = prev[tenderId] || {
        tenderId,
        status,
        userNotes: '',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [tenderId]: {
          ...current,
          status,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleSaveNotes = (tenderId: string, notes: string) => {
    setTrackedTenders(prev => {
      const current = prev[tenderId] || {
        tenderId,
        status: 'Interested',
        userNotes: notes,
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [tenderId]: {
          ...current,
          userNotes: notes,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleSaveProposedBid = (tenderId: string, amount: number) => {
    setTrackedTenders(prev => {
      const current = prev[tenderId] || {
        tenderId,
        status: 'Interested',
        userNotes: '',
        checklist: {},
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [tenderId]: {
          ...current,
          bidValueProposed: amount,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const handleSaveProfile = (saved: MSMEProfile) => {
    setProfiles(prev => {
      const exists = prev.some(p => p.id === saved.id);
      if (exists) {
        return prev.map(p => p.id === saved.id ? saved : p);
      }
      return [...prev, saved];
    });
    setCurrentProfileId(saved.id);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedVerdict('ALL');
    setSelectedPortal('ALL');
    setSelectedSector('ALL');
    setOnlyEmdExempt(false);
    setSelectedCategory('ALL');
    setSelectedState('ALL');
    setSelectedValueRange('ALL');
    setSelectedEnterpriseCategory('ALL');
    setSelectedCertification('ALL');
    setSelectedStatus('ALL');
  };

  // Active filters calculation for badge and removable chips
  const activeFilters = useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];

    if (selectedVerdict !== 'ALL') {
      const verdictLabels: Record<string, string> = {
        HIGH_MATCH: 'High Match',
        MODERATE_MATCH: 'Moderate Fit',
        LOW_MATCH: 'Low Alignment',
        INELIGIBLE: 'Ineligible',
      };
      list.push({
        id: 'verdict',
        label: verdictLabels[selectedVerdict] || selectedVerdict,
        onRemove: () => setSelectedVerdict('ALL'),
      });
    }

    if (selectedPortal !== 'ALL') {
      list.push({
        id: 'portal',
        label: `Portal: ${selectedPortal}`,
        onRemove: () => setSelectedPortal('ALL'),
      });
    }

    if (selectedSector !== 'ALL') {
      list.push({
        id: 'sector',
        label: `Sector: ${selectedSector}`,
        onRemove: () => setSelectedSector('ALL'),
      });
    }

    if (selectedValueRange !== 'ALL') {
      const valueLabels: Record<string, string> = {
        UNDER_1CR: 'Under ₹1 Cr',
        '1CR_TO_5CR': '₹1 Cr - ₹5 Cr',
        ABOVE_5CR: 'Above ₹5 Cr',
      };
      list.push({
        id: 'value',
        label: valueLabels[selectedValueRange] || selectedValueRange,
        onRemove: () => setSelectedValueRange('ALL'),
      });
    }

    if (selectedEnterpriseCategory !== 'ALL') {
      list.push({
        id: 'enterprise',
        label: `${selectedEnterpriseCategory} Enterprise`,
        onRemove: () => setSelectedEnterpriseCategory('ALL'),
      });
    }

    if (selectedStatus !== 'ALL') {
      list.push({
        id: 'status',
        label: `Status: ${selectedStatus}`,
        onRemove: () => setSelectedStatus('ALL'),
      });
    }

    if (onlyEmdExempt) {
      list.push({
        id: 'emd',
        label: '100% EMD Waived',
        onRemove: () => setOnlyEmdExempt(false),
      });
    }

    return list;
  }, [
    selectedVerdict,
    selectedPortal,
    selectedSector,
    selectedValueRange,
    selectedEnterpriseCategory,
    selectedStatus,
    onlyEmdExempt,
  ]);

  const comparedTenders = tenders.filter(t => comparedTenderIds.includes(t.id));

  // Quick helper to switch to Comparison tab or modal
  const handleOpenComparison = () => {
    if (comparedTenderIds.length >= 2) {
      setIsComparisonModalOpen(true);
    } else {
      setActiveTab('comparison');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased w-full overflow-x-hidden">
      
      {/* 1. FIXED DARK NAVY SIDEBAR */}
      <Sidebar
        currentProfile={currentProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfileSelector={() => setIsProfileSelectorOpen(true)}
        compareCount={comparedTenderIds.length}
        trackedCount={Object.keys(trackedTenders).length}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* 2. MAIN APP CONTAINER (Padded for desktop sidebar - responsive 72px or 240px) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 w-full ${isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[240px]'}`}>
        
        {/* DASHBOARD HEADER */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all w-full shadow-2xs">
          <div className="w-full flex flex-col gap-2.5">
            
            {/* Top row: Brand & Breadcrumb + Global Search + Notifications & Profile Switcher */}
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              
              {/* Left: Mobile Toggle & Breadcrumb / Dynamic Page Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileNavOpen(true)}
                  aria-label="Open navigation sidebar"
                  className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-500">TenderSetu</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">
                      {activeTab === 'dashboard' ? 'Dashboard' :
                       activeTab === 'search' ? 'Tender Search' :
                       activeTab === 'comparison' ? 'Comparison Matrix' :
                       activeTab === 'tracker' ? 'Bid Pipeline' :
                       activeTab === 'eligibility' ? 'Eligibility Engine' :
                       activeTab === 'profile' ? 'Company Profile' :
                       'AI Policy Advisor'}
                    </span>
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none mt-0.5">
                    {activeTab === 'dashboard' ? 'Procurement Intelligence Feed' :
                     activeTab === 'search' ? 'Comprehensive Tender Search' :
                     activeTab === 'comparison' ? 'Side-by-Side RFP Matrix' :
                     activeTab === 'tracker' ? 'Procurement Pipeline Board' :
                     activeTab === 'eligibility' ? 'MSME Criteria Matching' :
                     activeTab === 'profile' ? 'Enterprise Credentials' :
                     'MSME Policy & Regulatory Advisor'}
                  </h1>
                </div>
              </div>

              {/* Center / Right: Global Search & Controls */}
              <div className="flex items-center gap-2.5 ml-auto">
                
                {/* Demo / Live Source Indicator Badge */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Demo Sandbox • CPPP & GeM Verified</span>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors relative cursor-pointer shadow-2xs"
                    title="Procurement Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                  </button>

                  {/* Notifications Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-900">Procurement Alerts</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                          2 New
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px]">
                          <span className="font-bold text-blue-900 block">CPPP Bid Closing Soon</span>
                          <span className="text-slate-600">Solar Rooftop System tender closing in 5 days. 100% EMD waived.</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px]">
                          <span className="font-bold text-emerald-900 block">High Match Alert</span>
                          <span className="text-slate-600">89% Match for your {currentProfile.category} enterprise on GeM Cloud tender.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="w-full text-center text-[10px] font-bold text-blue-600 hover:underline pt-1 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                {/* Active MSME Profile Dropdown Pill */}
                <button
                  onClick={() => setIsProfileSelectorOpen(true)}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400 transition-all text-left shadow-2xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                    {currentProfile.companyName.charAt(0)}
                  </div>
                  <div className="hidden sm:block leading-tight">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[130px]">
                      {currentProfile.companyName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {currentProfile.category} Enterprise
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>
              </div>

            </div>

            {/* Bottom row of Header: Fast Global Tender Filter */}
            <div className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search government tenders by title, ID, department, sector, ministry, state... (Instant real-time filter)"
                  className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm bg-slate-50/90 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shadow-2xs hidden sm:inline-block">
                    {filteredTenders.length} Found
                  </span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN BODY CONTENT AREA */}
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 min-w-0">
          
          {/* TAB 1: DASHBOARD OR TENDER SEARCH VIEW */}
          {(activeTab === 'dashboard' || activeTab === 'search') && (
            <div className="space-y-6">
              
              {/* ENTERPRISE HERO SECTION - Compact (~170px) */}
              <div className="relative rounded-2xl p-4 sm:p-5 text-white shadow-enterprise border border-[#192648] bg-gradient-to-r from-[#0B1224] via-[#111C35] to-[#1E1B4B] overflow-hidden">
                {/* Ambient lighting glows */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-amber-300" />
                        <span>GFR 2017 & PPP-MSE 2012 Certified</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        Udyam: {currentProfile.udyamRegistrationNumber}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                      Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-violet-300">{currentProfile.companyName}</span>
                    </h2>

                    <p className="text-xs text-slate-300 leading-normal line-clamp-2">
                      AI-powered government tender intelligence for Indian MSMEs. Automatically evaluates your turnover, track record, and certifications against GeM and CPPP eligibility criteria.
                    </p>

                    <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                      <button
                        onClick={() => {
                          const el = document.getElementById('tender-discovery-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Browse Tenders</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setIsAdvisorOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>MSME Policy Guide</span>
                      </button>

                      <button
                        onClick={() => setShowRightTools(!showRightTools)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{showRightTools ? 'Hide Quick Tools' : 'Show Quick Tools'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Location & Coverage Quick Stats Card */}
                  <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 shrink-0 md:w-64 space-y-2 shadow-lg">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                      <span className="text-slate-400 font-medium text-[11px]">Classification:</span>
                      <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">{currentProfile.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                      <span className="text-slate-400 font-medium text-[11px]">Headquarters:</span>
                      <span className="font-bold text-slate-200 text-[11px]">{currentProfile.location.city}, {currentProfile.location.state}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium text-[11px]">Scope:</span>
                      <span className="font-bold text-emerald-400 text-[11px]">{currentProfile.operationalStates.length} States Pan-India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FIVE ENTERPRISE STATISTICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                
                {/* Stat 1: Total Available Tenders */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise hover:border-blue-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Total Available
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{tenders.length}</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      Active Bids
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Live feeds across GeM & CPPP
                  </p>
                </div>

                {/* Stat 2: High Eligibility Matches */}
                <div 
                  onClick={() => {
                    setSelectedVerdict(selectedVerdict === 'HIGH_MATCH' ? 'ALL' : 'HIGH_MATCH');
                  }}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer shadow-enterprise hover:shadow-lg ${
                    selectedVerdict === 'HIGH_MATCH' 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' 
                      : 'border-slate-200/90 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      High Fit Matches
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {highMatchesCount}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ≥ 75% Fit
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {selectedVerdict === 'HIGH_MATCH' ? 'Filter active • Click to reset' : 'Prime win probability'}
                  </p>
                </div>

                {/* Stat 3: Total Tender Value */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise hover:border-indigo-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Cumulative Value
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {formatINR(totalTenderValue)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Combined value of live tenders
                  </p>
                </div>

                {/* Stat 4: EMD Exemptions */}
                <div 
                  onClick={() => setOnlyEmdExempt(!onlyEmdExempt)}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer shadow-enterprise hover:shadow-lg ${
                    onlyEmdExempt 
                      ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20' 
                      : 'border-slate-200/90 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      EMD Exemptions
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {emdExemptCount}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      100% Waived
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Saved ₹{formatINR(totalEmdSaved)} under GFR 173(i)
                  </p>
                </div>

                {/* Stat 5: PPP-MSE Preference */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-enterprise hover:border-amber-400 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      PPP-MSE Preference
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {pppMseCount}
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full">
                      15% Margin
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    PPP-MSE Order 2012 reservation quota
                  </p>
                </div>

              </div>

              {/* TENDER DISCOVERY SECTION */}
              <div id="tender-discovery-section"></div>

              {/* DYNAMIC DASHBOARD LAYOUT: Full-Width Tender Cards Grid + Optional Tools */}
              <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
                
                {/* CENTER: GOVERNMENT TENDER CARDS (Full available width) */}
                <div className="flex-1 min-w-0 w-full flex flex-col gap-3.5">
                  
                  {/* Controls / View Bar */}
                  <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">
                        {filteredTenders.length} Tenders Available
                      </span>
                      {filteredTenders.length < tenders.length && (
                        <button
                          onClick={resetFilters}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] underline cursor-pointer"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* Sort Dropdown */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="MATCH_DESC">Best Match Score</option>
                          <option value="VALUE_DESC">Value: High to Low</option>
                          <option value="VALUE_ASC">Value: Low to High</option>
                          <option value="DEADLINE_ASC">Closing Soonest</option>
                          <option value="EMD_SAVED_DESC">Highest EMD Saved</option>
                        </select>
                      </div>

                      {/* Filters Button with active filter badge */}
                      <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          activeFilters.length > 0
                            ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                        title="Open filter drawer"
                      >
                        <Filter className={`w-3.5 h-3.5 ${activeFilters.length > 0 ? 'text-white' : 'text-blue-600'}`} />
                        <span>Filters</span>
                        {activeFilters.length > 0 && (
                          <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-white text-blue-700 leading-tight">
                            {activeFilters.length}
                          </span>
                        )}
                      </button>

                      {/* View Mode Toggle */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 p-0.5">
                        <button
                          onClick={() => setViewMode('grid')}
                          title="Grid View"
                          className={`p-1 rounded-md transition-colors ${
                            viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setViewMode('table')}
                          title="List / Row View"
                          className={`p-1 rounded-md transition-colors ${
                            viewMode === 'table' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick Tools Toggle Button */}
                      <button
                        onClick={() => setShowRightTools(!showRightTools)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          showRightTools
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                        title="Toggle Quick Tools Panel"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tools</span>
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE FILTER CHIPS ROW */}
                  {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap py-0.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Active:
                      </span>
                      {activeFilters.map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => chip.onRemove()}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs transition-all hover:bg-blue-100 hover:border-blue-300 cursor-pointer group"
                          title={`Click to remove filter: ${chip.label}`}
                        >
                          <span>{chip.label}</span>
                          <span className="p-0.5 rounded-full group-hover:bg-blue-200/80 text-blue-600 group-hover:text-blue-900 transition-colors">
                            <X className="w-3 h-3 pointer-events-none" />
                          </span>
                        </button>
                      ))}

                      <button
                        onClick={resetFilters}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-1"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                  {/* Tender Stream */}
                  {filteredTenders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                      <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-800">No matching tenders found</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        No tenders match your current filter parameters or search keyword. Try clearing some filters or searching for different criteria.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    /* Responsive Grid: 3 cards per row on 1920px (minmax 450px or 380px with max 3-col), 2 cards on 1366-1536px, 1 on small */
                    <div 
                      className="grid gap-4 w-full items-stretch grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
                    >
                      {filteredTenders.map((tender) => {
                        const match = matches.get(tender.id)!;
                        return (
                          <div key={tender.id} className="min-w-0 h-full flex flex-col">
                            <TenderCard
                              tender={tender}
                              match={match}
                              profile={currentProfile}
                              isTracked={!!trackedTenders[tender.id]}
                              isCompared={comparedTenderIds.includes(tender.id)}
                              onToggleTrack={() => handleToggleTrack(tender.id)}
                              onToggleCompare={() => handleToggleCompare(tender.id)}
                              onOpenDiagnostics={() => setDiagnosticTender(tender)}
                              onOpenDetails={() => setDetailsTender(tender)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Compact List View - Single row per tender */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs w-full divide-y divide-slate-100">
                      {filteredTenders.map((tender) => {
                        const match = matches.get(tender.id)!;
                        const isEligible = match.verdict !== 'INELIGIBLE';
                        const isTracked = !!trackedTenders[tender.id];
                        const isCompared = comparedTenderIds.includes(tender.id);

                        return (
                          <div 
                            key={tender.id} 
                            className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                          >
                            {/* Left: Fit score & Title */}
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className="relative w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 font-black text-xs" title={`Fit: ${match.overallScore}%`}>
                                <span className={
                                  match.overallScore >= 80 ? 'text-emerald-700' :
                                  match.overallScore >= 60 ? 'text-blue-700' :
                                  'text-rose-700'
                                }>
                                  {match.overallScore}%
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                    tender.portal === 'GeM' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                                  }`}>
                                    {tender.portal}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-500 font-semibold truncate">
                                    {tender.officialTenderId || tender.tenderNumber}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                    isEligible ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    {isEligible ? 'Eligible' : 'Ineligible'}
                                  </span>
                                </div>

                                <h4 
                                  onClick={() => setDetailsTender(tender)}
                                  className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 text-sm"
                                  title={tender.title}
                                >
                                  {tender.title}
                                </h4>

                                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {tender.issuingAuthority} • {tender.publishingDepartment || tender.department}
                                </div>
                              </div>
                            </div>

                            {/* Center: Financials & Due Date */}
                            <div className="flex items-center gap-4 shrink-0 text-slate-700">
                              <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated</div>
                                <div className="font-extrabold text-slate-900">{formatINR(tender.estimatedValue)}</div>
                              </div>

                              <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase">EMD</div>
                                {isEligible && match.exemptions.emdExempt ? (
                                  <span className="text-emerald-700 font-bold text-[11px]">Waived</span>
                                ) : (
                                  <span className="text-slate-600">{formatINR(tender.earnestMoneyDeposit)}</span>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 justify-end">
                              <button
                                onClick={() => handleToggleTrack(tender.id)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isTracked ? 'bg-amber-500 border-amber-600 text-slate-950' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                                title={isTracked ? 'Tracked' : 'Track in Bid Pipeline'}
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleToggleCompare(tender.id)}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isCompared ? 'bg-blue-600 border-blue-700 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                                title={isCompared ? 'Compared' : 'Compare'}
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setDiagnosticTender(tender)}
                                className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                              >
                                Check Fit
                              </button>

                              <button
                                onClick={() => setDetailsTender(tender)}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                              >
                                Details
                              </button>

                              <a
                                href={getOfficialTenderUrl(tender)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer shadow-xs"
                                title={`Apply on official portal (${tender.portal})`}
                              >
                                Apply
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* RIGHT: QUICK TOOLS PANEL (Responsive: toggled or visible on ultra-wide) */}
                {showRightTools && (
                  <aside className="w-full lg:w-[260px] shrink-0">
                    <div className="sticky top-20">
                      <QuickToolsSidebar
                        tenders={tenders}
                        matches={matches}
                        profile={currentProfile}
                        comparedTenderIds={comparedTenderIds}
                        onToggleCompare={handleToggleCompare}
                        onOpenComparisonModal={handleOpenComparison}
                        trackedTenders={trackedTenders}
                        onOpenBidTracker={() => setActiveTab('tracker')}
                        onOpenDiagnostics={(t) => setDiagnosticTender(t)}
                        onOpenAdvisor={() => setIsAdvisorOpen(true)}
                        onOpenDetails={(t) => setDetailsTender(t)}
                      />
                    </div>
                  </aside>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: TENDER COMPARISON VIEW */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tender Comparison Matrix</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Side-by-side evaluation of requirements, turnover criteria, EMD waivers, and MSME concessions
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Dashboard
                </button>
              </div>

              {comparedTenders.length < 2 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Select 2 or 3 tenders to compare</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      You currently have {comparedTenders.length} tender{comparedTenders.length === 1 ? '' : 's'} selected. Navigate to the dashboard or search and click <span className="font-bold text-purple-600">"Compare"</span> on any tender card.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs font-bold px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-xs"
                  >
                    Go to Dashboard & Select Tenders
                  </button>
                </div>
              ) : (
                <TenderComparisonModal
                  isOpen={true}
                  onClose={() => setActiveTab('dashboard')}
                  comparedTenders={comparedTenders}
                  matches={matches}
                  profile={currentProfile}
                  onRemoveFromCompare={handleToggleCompare}
                  onOpenDetails={(t) => setDetailsTender(t)}
                />
              )}
            </div>
          )}

          {/* TAB 3: BID TRACKER & PIPELINE */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bid Pipeline Board</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track RFP lifecycle, document checklists, proposed margins, and target deadlines across 6 stages
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Dashboard
                </button>
              </div>

              <BidTracker
                trackedTenders={trackedTenders}
                tenders={tenders}
                matches={matches}
                onUpdateStatus={handleUpdateStatus}
                onRemoveTracked={handleRemoveTracked}
                onOpenDetails={(t) => setDetailsTender(t)}
                onSaveNotes={handleSaveNotes}
                onUpdateTargetDate={handleUpdateTargetDate}
                onTrackTender={handleToggleTrack}
              />
            </div>
          )}

          {/* TAB 4: ELIGIBILITY CHECK VIEW */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">MSME Eligibility Engine</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant rule evaluation against GFR 2017 Rule 173(i), DPIIT Startups, and Public Procurement Policy
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Dashboard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tenders.map((tender) => {
                  const match = matches.get(tender.id)!;
                  return (
                    <div 
                      key={tender.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-enterprise hover:shadow-xl hover:border-blue-400 transition-all space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {tender.officialTenderId || tender.tenderNumber}
                        </span>
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                          match.overallScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          match.overallScore >= 60 ? 'bg-amber-100 text-amber-900' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {match.overallScore}% Fit
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{tender.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{tender.publishingDepartment || tender.department}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Turnover Check</span>
                          <span className={`font-bold ${match.breakdown.turnover.passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {match.breakdown.turnover.passed ? 'Qualified' : 'Shortfall'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">EMD Exemption</span>
                          <span className="font-bold text-emerald-700">
                            {match.exemptions.emdExempt ? '100% Waived' : 'Required'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setDiagnosticTender(tender)}
                        className="w-full text-xs font-bold py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                      >
                        Open In-Depth Diagnostic
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: COMPANY PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Overview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-enterprise space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-lg">
                        {currentProfile.category} Enterprise • {currentProfile.enterpriseType}
                      </span>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        Udyam: {currentProfile.udyamRegistrationNumber}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {currentProfile.companyName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      HQ: {currentProfile.location.city}, {currentProfile.location.state} • Operational Coverage: {currentProfile.operationalStates.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setProfileToEdit(currentProfile);
                        setIsProfileEditorOpen(true);
                      }}
                      className="text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Credentials</span>
                    </button>

                    <button
                      onClick={() => setIsProfileSelectorOpen(true)}
                      className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      Switch Profile
                    </button>
                  </div>
                </div>

                {/* Financial & Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">FY24 Annual Turnover</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {formatINR(currentProfile.financials.turnoverFY24)}
                    </span>
                    <span className="text-[11px] text-slate-500">3-Yr Avg: {formatINR(currentProfile.financials.averageTurnover)}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Max Past Single Contract</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {formatINR(currentProfile.experience.maxSingleContractValue)}
                    </span>
                    <span className="text-[11px] text-slate-500">Completed single order ceiling</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Delivered Govt Contracts</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {currentProfile.experience.completedGovProjectsCount} Projects
                    </span>
                    <span className="text-[11px] text-slate-500">Cumulative: {formatINR(currentProfile.experience.totalCompletedProjectsValue)}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Operational Longevity</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {currentProfile.experience.yearsInBusiness} Years
                    </span>
                    <span className="text-[11px] text-slate-500">Founded in {currentProfile.foundingYear}</span>
                  </div>
                </div>

                {/* Certifications Verified */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Verified Quality Certifications & Accreditations ({currentProfile.certifications.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {currentProfile.certifications.map((c) => (
                      <div key={c.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-500">Issuing Body: {c.issuingBody}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Valid Until: {c.validUntil}</span>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Clients */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Key Past Government & Public Sector Clients</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.experience.topPastClients.map((client, idx) => (
                      <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: AI ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">MSME Policy & Procurement Advisor</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Statutory guidance on GFR 2017 Rule 173(i), PPP-MSE Order 2012, and DPIIT relaxations
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Back to Dashboard
                </button>
              </div>

              <AIAdvisorModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
              />
            </div>
          )}

        </main>

        {/* FOOTER */}
        <footer className="bg-[#0B1224] border-t border-[#192648] text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12 no-print w-full">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <span className="font-black text-white text-base tracking-tight font-sans">
                  Tender<span className="text-blue-400">Setu</span>
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  MSME Procurement Platform
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Demo Sandbox
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Engineered for Indian MSMEs in statutory compliance with GFR 2017 Rule 173(i) & PPP-MSE Order 2012
              </p>
            </div>

            <div className="flex items-center gap-5 text-[11px] text-slate-400">
              <button onClick={() => setIsAdvisorOpen(true)} className="hover:text-blue-400 transition-colors cursor-pointer">
                Policy Guidelines
              </button>
              <a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                GeM Portal (Official)
              </a>
              <a href="https://eprocure.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                CPPP Portal (Official)
              </a>
              <a href="https://msme.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                Ministry of MSME
              </a>
            </div>
          </div>
        </footer>

      </div>

      {/* MODALS */}
      
      {/* Profile Switcher Drawer */}
      <ProfileSelector
        isOpen={isProfileSelectorOpen}
        onClose={() => setIsProfileSelectorOpen(false)}
        profiles={profiles}
        currentProfileId={currentProfileId}
        onSelectProfile={(id) => setCurrentProfileId(id)}
        onOpenEditor={(p) => {
          setIsProfileSelectorOpen(false);
          setProfileToEdit(p);
          setIsProfileEditorOpen(true);
        }}
      />

      {/* Profile Editor Modal */}
      <ProfileEditorModal
        isOpen={isProfileEditorOpen}
        onClose={() => {
          setIsProfileEditorOpen(false);
          setProfileToEdit(undefined);
        }}
        profileToEdit={profileToEdit}
        onSaveProfile={handleSaveProfile}
      />

      {/* Tender Match Diagnostic Modal */}
      {diagnosticTender && matches.get(diagnosticTender.id) && (
        <TenderMatchDiagnostic
          tender={diagnosticTender}
          match={matches.get(diagnosticTender.id)!}
          profile={currentProfile}
          isOpen={true}
          onClose={() => setDiagnosticTender(null)}
          onOpenDetails={() => {
            const t = diagnosticTender;
            setDiagnosticTender(null);
            setDetailsTender(t);
          }}
          onExportReport={() => {
            const t = diagnosticTender;
            setDiagnosticTender(null);
            setExportTender(t);
          }}
        />
      )}

      {/* Tender Details & Bid Checklist Modal */}
      {detailsTender && matches.get(detailsTender.id) && (
        <TenderDetailsModal
          tender={detailsTender}
          match={matches.get(detailsTender.id)!}
          profile={currentProfile}
          isOpen={true}
          onClose={() => setDetailsTender(null)}
          checklist={trackedTenders[detailsTender.id]?.checklist || {}}
          onToggleChecklist={(doc) => handleToggleChecklist(detailsTender.id, doc)}
          currentStatus={trackedTenders[detailsTender.id]?.status || 'Interested'}
          onChangeStatus={(st) => handleUpdateStatus(detailsTender.id, st)}
          userNotes={trackedTenders[detailsTender.id]?.userNotes || ''}
          onSaveNotes={(nt) => handleSaveNotes(detailsTender.id, nt)}
          proposedBidValue={trackedTenders[detailsTender.id]?.bidValueProposed}
          onSaveProposedBid={(amount) => handleSaveProposedBid(detailsTender.id, amount)}
          onOpenDiagnostics={() => {
            const t = detailsTender;
            setDetailsTender(null);
            setDiagnosticTender(t);
          }}
        />
      )}

      {/* Standalone Comparison Modal triggered from Quick Tools */}
      {isComparisonModalOpen && (
        <TenderComparisonModal
          isOpen={true}
          onClose={() => setIsComparisonModalOpen(false)}
          comparedTenders={comparedTenders}
          matches={matches}
          profile={currentProfile}
          onRemoveFromCompare={handleToggleCompare}
          onOpenDetails={(t) => setDetailsTender(t)}
        />
      )}

      {/* Export / Printable Dossier Modal */}
      {exportTender && matches.get(exportTender.id) && (
        <ExportReportModal
          tender={exportTender}
          match={matches.get(exportTender.id)!}
          profile={currentProfile}
          isOpen={true}
          onClose={() => setExportTender(null)}
        />
      )}

      {/* Policy & AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
      />

      {/* Filter Drawer Component (380px slide-in from right) */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedPortal={selectedPortal}
        setSelectedPortal={setSelectedPortal}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedValueRange={selectedValueRange}
        setSelectedValueRange={setSelectedValueRange}
        selectedEnterpriseCategory={selectedEnterpriseCategory}
        setSelectedEnterpriseCategory={setSelectedEnterpriseCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onlyEmdExempt={onlyEmdExempt}
        setOnlyEmdExempt={setOnlyEmdExempt}
        selectedVerdict={selectedVerdict}
        setSelectedVerdict={setSelectedVerdict}
        onResetFilters={resetFilters}
        totalFiltered={filteredTenders.length}
        totalAvailable={tenders.length}
      />

    </div>
  );
}

export default App;
