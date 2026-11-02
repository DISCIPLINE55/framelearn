import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Camera,
  User,
  LogOut,
  ExternalLink,
  X,
  Sparkles,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export type DashboardTab = 'overview' | 'bookings' | 'services' | 'profile';

export interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  pendingBookingsCount?: number;
  activeServicesCount?: number;
  photographerName?: string;
  photographerEmail?: string;
  onLogout: () => void;
  onAddNewService?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingBookingsCount = 0,
  activeServicesCount = 0,
  photographerName = 'Arafat Nabuku Jansu',
  photographerEmail = 'framelearn28@gmail.com',
  onLogout,
  onAddNewService,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
      description: 'Studio KPI & desk',
    },
    {
      id: 'bookings' as DashboardTab,
      label: 'Booking Inquiries',
      icon: Calendar,
      badge: pendingBookingsCount > 0 ? `${pendingBookingsCount} new` : undefined,
      description: 'Manage client requests',
    },
    {
      id: 'services' as DashboardTab,
      label: 'Photography Services',
      icon: Camera,
      badge: activeServicesCount > 0 ? `${activeServicesCount} active` : undefined,
      description: 'Offerings & packages',
    },
    {
      id: 'profile' as DashboardTab,
      label: 'My Profile',
      icon: User,
      badge: undefined,
      description: 'Studio contact & bio',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-navy text-white p-5 select-none justify-between overflow-y-auto">
      {/* Top Half: Brand, Identity, Nav Links */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-frame bg-sage text-navy flex items-center justify-center font-bold shadow-subtle flex-shrink-0">
              <Camera className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold tracking-tight text-white text-body truncate">
                  FrameLearn
                </span>
                <span className="text-[10px] font-bold text-sage bg-sage/20 border border-sage/30 px-1.5 py-0.2 rounded">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/70 tracking-wider uppercase">
                Studio Management
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-white/70 hover:text-white rounded-frame hover:bg-navy-800"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Photographer Identity Card */}
        <div className="p-3.5 rounded-frame bg-navy-800/90 border border-navy-700/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sage text-navy font-bold flex items-center justify-center text-small flex-shrink-0 shadow-xs">
            {photographerName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-small font-bold text-white truncate">
                {photographerName}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-sage flex-shrink-0" />
            </div>
            <span className="text-[11px] text-sage font-semibold truncate">
              Studio Owner & Photographer
            </span>
            <span className="text-[10px] text-white/60 truncate">
              {photographerEmail}
            </span>
          </div>
        </div>

        {/* Primary Management Navigation */}
        <nav aria-label="Studio dashboard sections" className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider px-3 mb-1 block">
            Studio Navigation
          </span>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-frame text-small transition-all text-left group ${
                  isActive
                    ? 'bg-sage text-navy font-bold shadow-subtle'
                    : 'text-white/90 hover:text-white hover:bg-navy-800 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? 'bg-navy/15 text-navy' : 'bg-navy-800 text-sage group-hover:bg-navy-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate leading-tight">{item.label}</span>
                    <span
                      className={`text-[10px] truncate ${
                        isActive ? 'text-navy/70' : 'text-white/50'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge && (
                  <Badge
                    variant={isActive ? 'navy' : 'sage'}
                    size="sm"
                    className="ml-2 flex-shrink-0 text-[10px] px-2 py-0.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Studio Shortcuts */}
        <div className="pt-2 space-y-2">
          <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider px-3 block">
            Quick Actions
          </span>
          {onAddNewService && (
            <button
              type="button"
              onClick={() => {
                onAddNewService();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-frame text-xs font-semibold text-white/80 hover:text-white hover:bg-navy-800 transition-colors border border-navy-700/60"
            >
              <Plus className="w-3.5 h-3.5 text-sage" />
              <span>Add New Photography Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Half: Public Site Link & Logout Button */}
      <div className="pt-6 mt-6 border-t border-navy-800 space-y-2.5">
        <a
          href="#home"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-frame text-xs font-semibold text-white/80 hover:text-white hover:bg-navy-800 transition-colors border border-navy-700"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span>Open Public Studio Site</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-white/50" />
        </a>

        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          onClick={onLogout}
          leftIcon={<LogOut className="w-4 h-4" />}
          className="border-navy-700 text-white hover:bg-red-950/50 hover:text-red-300 hover:border-red-900 justify-start"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 flex-shrink-0 min-h-screen border-r border-navy-950 shadow-elevated sticky top-0 h-screen z-20">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
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
