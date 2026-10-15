import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Navigation,
  Search,
  UtensilsCrossed,
  Calendar,
  FolderKanban,
  Users,
  LifeBuoy,
  Clock,
  Bell,
  User,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const {
    unreadNotificationCount,
    cart,
    profile,
    resetDemoData,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const primaryNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Campus Navigation', path: '/navigation', icon: Navigation },
    { label: 'Lost & Found', path: '/lost-found', icon: Search },
    {
      label: 'Cafeteria',
      path: '/cafeteria',
      icon: UtensilsCrossed,
      badge: cart.length > 0 ? `${cart.reduce((s, i) => s + i.quantity, 0)}` : undefined,
    },
    { label: 'Events & Workshops', path: '/events', icon: Calendar },
    { label: 'Group Projects', path: '/projects', icon: FolderKanban },
    { label: 'Clubs & Societies', path: '/clubs', icon: Users },
    { label: 'Student Services', path: '/services', icon: LifeBuoy },
    { label: 'Timetable', path: '/timetable', icon: Clock },
  ];

  const secondaryNavItems = [
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? `${unreadNotificationCount}` : undefined,
    },
    { label: 'Profile & Settings', path: '/profile', icon: User },
    { label: 'Help & FAQ', path: '/help', icon: HelpCircle },
  ];

  // Map route to readable page title
  const getPageMeta = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard')
      return { title: 'Dashboard', subtitle: 'Here’s your campus at a glance.' };
    if (path.startsWith('/navigation'))
      return { title: 'Campus Navigation', subtitle: 'Schematic map and turn-by-turn routing.' };
    if (path.startsWith('/lost-found'))
      return { title: 'Lost & Found', subtitle: 'Found something? Help it find its person.' };
    if (path.startsWith('/cafeteria'))
      return { title: 'Campus Cafeteria', subtitle: 'Counters, queue estimates, and demo order pickup.' };
    if (path.startsWith('/events'))
      return { title: 'Events & Workshops', subtitle: 'Discover activities and reserve your spot.' };
    if (path.startsWith('/projects'))
      return { title: 'Group Projects', subtitle: 'Track responsibilities and project deliverables.' };
    if (path.startsWith('/clubs'))
      return { title: 'Clubs & Societies', subtitle: 'Join student communities and recruitment drives.' };
    if (path.startsWith('/services'))
      return { title: 'Student Services', subtitle: 'Directory of support desks and administrative offices.' };
    if (path.startsWith('/timetable'))
      return { title: 'Weekly Timetable', subtitle: 'Your schedule, lecture rooms, and class reminders.' };
    if (path.startsWith('/notifications'))
      return { title: 'Notification Center', subtitle: 'Stay updated on classes, matches, and deadlines.' };
    if (path.startsWith('/profile'))
      return { title: 'Student Profile & Settings', subtitle: 'Manage identity, preferences, and saved items.' };
    if (path.startsWith('/help'))
      return { title: 'Help & Campus FAQ', subtitle: 'Learn how Campus Companion works and leave feedback.' };
    return { title: 'Campus Companion', subtitle: 'Campus, without the chaos.' };
  };

  const pageMeta = getPageMeta();

  return (
    <div className="min-h-screen bg-[#F7F6F1] flex flex-col font-sans text-[#17243A]">
      {/* Top Banner Notice (Prototype Info) */}
      <div className="bg-[#17243A] text-white text-[12px] px-4 py-1.5 flex items-center justify-between border-b border-[#2D3748]">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="w-2 h-2 rounded-full bg-[#DDF36A] animate-pulse shrink-0" />
          <span className="font-medium truncate">
            Campus Companion Prototype · Running with curated demo data (No external login required)
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setResetDialogOpen(true)}
            className="flex items-center gap-1 text-[11px] text-[#A0AEC0] hover:text-[#DDF36A] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <span className="text-[#4A5568]">|</span>
          <NavLink
            to="/help"
            className="text-[11px] text-[#A0AEC0] hover:text-white transition-colors"
          >
            FAQ
          </NavLink>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#E3E5E8] bg-white transition-all duration-200 z-30 select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="p-4 border-b border-[#E3E5E8] flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 min-w-0">
              {/* Custom SVG Campus Companion Logo */}
              <div className="w-10 h-10 rounded-xl bg-[#315CEB] flex items-center justify-center text-white shadow-md shadow-[#315CEB]/20 shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                  <circle cx="12" cy="7" r="1.2" fill="#DDF36A" stroke="#DDF36A" />
                </svg>
              </div>

              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <span className="font-display font-bold text-lg text-[#17243A] block leading-tight tracking-tight">
                    Campus Companion
                  </span>
                  <span className="text-[11px] text-[#667085] block truncate">
                    Campus, without chaos.
                  </span>
                </div>
              )}
            </NavLink>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg text-[#667085] hover:text-[#17243A] hover:bg-[#F3F4F6] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-semibold tracking-wider text-[#9CA3AF] uppercase px-3 block mb-1">
                  Primary Modules
                </span>
              )}
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                        isActive
                          ? 'bg-[#315CEB] text-white shadow-xs'
                          : 'text-[#475467] hover:bg-[#F4F5F7] hover:text-[#17243A]'
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#DDF36A] text-[#17243A]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="space-y-1 pt-2 border-t border-[#E3E5E8]/60">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-semibold tracking-wider text-[#9CA3AF] uppercase px-3 block mb-1">
                  Personal & Support
                </span>
              )}
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all group ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#315CEB]'
                          : 'text-[#475467] hover:bg-[#F4F5F7] hover:text-[#17243A]'
                      } ${sidebarCollapsed ? 'justify-center px-2' : ''}`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#F27C66] text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* User Profile Footer pill */}
          <div className="p-3 border-t border-[#E3E5E8] bg-[#FAF9F5]">
            <NavLink
              to="/profile"
              className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#315CEB] text-white font-display font-semibold flex items-center justify-center shrink-0 shadow-2xs">
                {profile.displayName.charAt(0)}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#17243A] truncate">
                    {profile.displayName}
                  </div>
                  <div className="text-[11px] text-[#667085] truncate">
                    {profile.yearSemester}
                  </div>
                </div>
              )}
            </NavLink>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E3E5E8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Title / Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-[#667085] hover:text-[#17243A] hover:bg-[#F3F4F6] md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold font-display text-[#17243A] truncate leading-tight">
                  {pageMeta.title}
                </h1>
                <p className="text-xs text-[#667085] hidden sm:block truncate mt-0.5">
                  {pageMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Actions / Search / Notifications */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Bar Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:py-2 text-xs font-medium text-[#667085] bg-[#F7F6F1] hover:bg-[#EEF2FF] hover:text-[#315CEB] border border-[#E3E5E8] rounded-xl transition-all shadow-2xs"
                title="Global Search (Ctrl + K)"
              >
                <Search className="w-4 h-4 text-[#315CEB]" />
                <span className="hidden sm:inline">Search anything...</span>
                <span className="sm:hidden">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-[#E3E5E8] rounded text-[#9CA3AF] shadow-2xs font-semibold">
                  Ctrl+K
                </kbd>
              </button>

              {/* Cart shortcut (if items exist) */}
              {cart.length > 0 && (
                <button
                  onClick={() => navigate('/cafeteria')}
                  className="relative p-2 rounded-xl text-[#315CEB] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE] transition-colors"
                  title="View Cafeteria Cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#315CEB] text-white text-[10px] font-bold flex items-center justify-center">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </button>
              )}

              {/* Notification Bell */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-xl text-[#475467] hover:text-[#17243A] hover:bg-[#F3F4F6] border border-transparent hover:border-[#E3E5E8] transition-colors"
                title="Notification Center"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F27C66] ring-2 ring-white" />
                )}
              </button>

              {/* Profile Shortcut */}
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-[#E3E5E8] hover:border-[#315CEB] bg-[#FAF9F5] hover:bg-white transition-all"
                title="View Student Profile"
              >
                <div className="w-6 h-6 rounded-full bg-[#315CEB] text-white text-xs font-bold flex items-center justify-center">
                  {profile.displayName.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-[#17243A] hidden lg:inline">
                  {profile.displayName.split(' ')[0]}
                </span>
              </button>
            </div>
          </header>

          {/* Main page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E3E5E8] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#315CEB]' : 'text-[#667085]'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/navigation"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#315CEB]' : 'text-[#667085]'
            }`
          }
        >
          <Navigation className="w-5 h-5" />
          <span>Map</span>
        </NavLink>
        <NavLink
          to="/cafeteria"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-[#315CEB]' : 'text-[#667085]'
            }`
          }
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span>Food</span>
          {cart.length > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-[#315CEB]" />
          )}
        </NavLink>
        <NavLink
          to="/timetable"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#315CEB]' : 'text-[#667085]'
            }`
          }
        >
          <Clock className="w-5 h-5" />
          <span>Schedule</span>
        </NavLink>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium text-[#667085] hover:text-[#17243A]"
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F27C66]" />
            )}
          </div>
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E5E8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#315CEB] text-white flex items-center justify-center font-bold">
                  CC
                </div>
                <span className="font-display font-bold text-base text-[#17243A]">
                  All Modules
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:bg-[#F3F4F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2.5 rounded-xl font-medium text-sm ${
                        isActive
                          ? 'bg-[#315CEB] text-white'
                          : 'text-[#475467] hover:bg-[#F3F4F6]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-[#DDF36A] text-[#17243A] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-[#E3E5E8] text-xs text-[#667085] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setResetDialogOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#E3E5E8] hover:bg-[#FEF2F2] hover:text-[#B93838] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals & Notifications */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={resetDialogOpen}
        title="Reset Demo Data?"
        message="This will restore all records (Lost & Found reports, timetable items, tasks, cafeteria orders, and profile) back to their clean initial seed state. Any changes you made during this session will be cleared."
        confirmText="Reset to Seed Data"
        cancelText="Keep My Changes"
        variant="danger"
        onConfirm={resetDemoData}
        onCancel={() => setResetDialogOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};
