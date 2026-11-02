import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Camera,
  User,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export type DashboardTab = 'overview' | 'bookings' | 'services' | 'profile';

export interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  pendingBookingsCount?: number;
  photographerName?: string;
  photographerEmail?: string;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingBookingsCount = 0,
  photographerName = 'Arafat Nabuku Jansu',
  photographerEmail = 'framelearn28@gmail.com',
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'bookings' as DashboardTab,
      label: 'Booking Inquiries',
      icon: Calendar,
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount} new` : undefined,
    },
    {
      id: 'services' as DashboardTab,
      label: 'Photography Services',
      icon: Camera,
      badge: undefined,
    },
    {
      id: 'profile' as DashboardTab,
      label: 'My Profile',
      icon: User,
      badge: undefined,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-navy text-white p-5 select-none">
      {/* Studio Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sage text-navy flex items-center justify-center font-bold shadow-subtle flex-shrink-0">
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display font-bold tracking-tight text-white text-body truncate">
              FrameLearn
            </span>
            <span className="text-[11px] font-semibold text-sage uppercase tracking-wider">
              Studio Portal
            </span>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded hover:bg-navy-800"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Photographer Identity Card */}
      <div className="my-5 p-3.5 rounded-frame bg-navy-800/80 border border-navy-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-sage/20 border border-sage/40 text-sage font-bold flex items-center justify-center text-small flex-shrink-0">
          {photographerName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-small font-bold text-white truncate">
            {photographerName}
          </span>
          <span className="text-caption text-white/70 truncate">
            {photographerEmail}
          </span>
        </div>
      </div>

      {/* Primary Management Navigation */}
      <nav aria-label="Studio dashboard sections" className="flex flex-col gap-1.5 flex-1">
        <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider px-3 mb-1">
          Management
        </span>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-frame text-small font-bold transition-all text-left ${
                isActive
                  ? 'bg-sage text-navy font-bold shadow-subtle'
                  : 'text-white/90 hover:text-white hover:bg-navy-800'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <IconComponent className={`w-4 h-4 flex-shrink-0 stroke-[2.2] ${isActive ? 'text-navy' : 'text-sage'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? 'navy' : 'sage'}
                  size="sm"
                  className="ml-2 flex-shrink-0 text-[10px] px-1.5 py-0.5"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-navy-800 space-y-2">
        <a
          href="#home"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-frame text-xs font-semibold text-white/80 hover:text-white hover:bg-navy-800 transition-colors"
        >
          <span>View Public Studio Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/60" />
        </a>

        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          onClick={onLogout}
          leftIcon={<LogOut className="w-4 h-4" />}
          className="border-navy-700 text-white hover:bg-red-950/40 hover:text-red-300 hover:border-red-900 justify-start"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 rounded-frame overflow-hidden border-2 border-navy-950 shadow-elevated">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

