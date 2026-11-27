import React from 'react';
import { MSMEProfile } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  Building2, 
  ShieldCheck, 
  Scale, 
  Bookmark, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  X, 
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { formatINR } from '../services/matchmaker';

export type NavTab = 'dashboard' | 'search' | 'profile' | 'eligibility' | 'comparison' | 'tracker' | 'advisor';

interface SidebarProps {
  currentProfile: MSMEProfile;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenProfileSelector: () => void;
  compareCount: number;
  trackedCount: number;
  onOpenAdvisor: () => void;
  onOpenDiagnosticsTender?: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentProfile,
  activeTab,
  setActiveTab,
  onOpenProfileSelector,
  compareCount,
  trackedCount,
  onOpenAdvisor,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed = false,
  setIsCollapsed,
}) => {
  const mainNavItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'search' as NavTab,
      label: 'Tender Search',
      icon: Search,
      badge: null,
    },
    {
      id: 'profile' as NavTab,
      label: 'Company Profile',
      icon: Building2,
      badge: currentProfile.category,
    },
    {
      id: 'eligibility' as NavTab,
      label: 'Eligibility Check',
      icon: ShieldCheck,
      badge: null,
    },
    {
      id: 'comparison' as NavTab,
      label: 'Compare Tenders',
      icon: Scale,
      badge: compareCount > 0 ? `${compareCount}` : null,
      badgeColor: 'bg-electric-500 text-white',
    },
    {
      id: 'tracker' as NavTab,
      label: 'Bid Tracker',
      icon: Bookmark,
      badge: trackedCount > 0 ? `${trackedCount}` : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold',
    },
    {
      id: 'advisor' as NavTab,
      label: 'AI Advisor',
      icon: Sparkles,
      badge: 'AI Active',
      badgeColor: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    },
  ];

  const secondaryNavItems = [
    {
      label: 'MSME Policy Guide',
      icon: BookOpen,
      action: () => {
        setActiveTab('advisor');
        setIsMobileOpen(false);
      },
    },
    {
      label: 'Help & Rules',
      icon: HelpCircle,
      action: () => {
        onOpenAdvisor();
        setIsMobileOpen(false);
      },
    },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const widthClass = isCollapsed ? 'lg:w-[72px]' : 'lg:w-[240px]';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#060B18]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Fixed Deep Navy Enterprise Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 ${widthClass} w-[240px] bg-[#0B1224] text-slate-300 border-r border-[#192648] flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        
        {/* Top Brand & Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo & Platform Branding */}
          <div className={`p-4 border-b border-[#192648] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-glow-blue ring-1 ring-blue-400/40 shrink-0 cursor-pointer"
                title="TenderSetu Enterprise"
                onClick={() => handleNavClick('dashboard')}
              >
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              
              {!isCollapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-white font-sans">
                      Tender<span className="text-blue-400">Setu</span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                    AI Tender Intelligence
                  </p>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            {setIsCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${isCollapsed ? 'hidden' : ''}`}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Collapsed Expand Button bar */}
          {isCollapsed && setIsCollapsed && (
            <div className="hidden lg:flex justify-center py-2 border-b border-[#192648]">
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Expand Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Source Indicator / Status Bar */}
          {!isCollapsed && (
            <div className="px-4 py-1.5 bg-[#111C35] border-b border-[#192648] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                  Demo Sandbox
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono bg-[#0B1224] px-1.5 py-0.5 rounded border border-[#192648]">
                CPPP • GeM
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Procurement Menu
              </div>
            )}
            
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badgeColor || 'bg-[#111C35] text-slate-300 border border-[#192648]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Knowledge & Policy Group */}
            {!isCollapsed && (
              <div className="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Governance & Rules
              </div>
            )}
            
            {secondaryNavItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-1.5'} rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer group`}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Company Profile Section */}
        <div className="p-2 border-t border-[#192648] bg-[#0E172F]">
          <div 
            onClick={onOpenProfileSelector}
            className={`bg-[#111C35] rounded-xl p-2.5 border border-[#192648] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-2'} shadow-xs cursor-pointer hover:border-blue-500/50 transition-colors`}
            title={isCollapsed ? `${currentProfile.companyName} (${currentProfile.category})` : 'Switch MSME Profile'}
          >
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white font-black flex items-center justify-center text-[10px] uppercase shrink-0 shadow-glow-blue">
                {currentProfile.companyName.substring(0, 2)}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {currentProfile.companyName}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate mt-0.5 font-mono">
                    {currentProfile.category} • {formatINR(currentProfile.financials.turnoverFY24)}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>GFR 173(i) & PPP-MSE</span>
              <span className="text-emerald-400 font-semibold">100% Compliant</span>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
