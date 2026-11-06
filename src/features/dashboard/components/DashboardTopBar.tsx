import React from 'react';
import {
  Menu,
  ExternalLink,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { DashboardTab } from './DashboardSidebar';

export interface DashboardTopBarProps {
  activeTab: DashboardTab;
  onOpenMobileNav: () => void;
  onLogout: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  photographerName: string;
  photographerEmail: string;
}

const TAB_TITLES: Record<DashboardTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Studio Overview',
    subtitle: 'Performance statistics, recent client inquiries, and studio activities',
  },
  bookings: {
    title: 'Booking Inquiries',
    subtitle: 'Manage client booking requests, review requirements, and coordinate sessions',
  },
  services: {
    title: 'Photography Services',
    subtitle: 'Manage service disciplines, descriptions, and catalog visibility',
  },
  profile: {
    title: 'Photographer Profile',
    subtitle: 'Manage your public studio profile, contact phone, and credentials',
  },
};

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  activeTab,
  onOpenMobileNav,
  onLogout,
  onRefresh,
  isRefreshing = false,
  photographerName,
  photographerEmail,
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 text-navy hover:bg-slate-100 rounded-frame focus:outline-none focus:ring-2 focus:ring-sage"
          aria-label="Open Studio Navigation Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-caption font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Studio Admin
            </span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-body font-display font-bold text-navy truncate">
              {currentTabInfo.title}
            </span>
          </div>
          <p className="text-caption text-slate-500 truncate hidden md:block">
            {currentTabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Status & User Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs hidden sm:inline-flex py-1.5 px-3"
            title="Refresh studio records"
          >
            Refresh
          </Button>
        )}

        <a
          href="#home"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-frame text-xs font-bold text-slate-700 hover:text-navy hover:bg-slate-100 transition-colors border border-slate-200"
          title="Open public studio website in preview"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>

        {/* Quick User Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-navy text-sage font-bold flex items-center justify-center text-xs shadow-xs">
            {(photographerName || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="hidden xl:flex flex-col text-left min-w-0">
            <span className="text-xs font-bold text-navy truncate max-w-[130px]">
              {photographerName || 'Studio Owner'}
            </span>
            {photographerEmail && (
              <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                {photographerEmail}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Sign out of photographer dashboard"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
