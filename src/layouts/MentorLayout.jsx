import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Bell } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { MENTOR_NAV_LINKS } from '../constants/navigation';

export default function MentorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(true);
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const displayName = user?.name || user?.fullName || 'Mentor';
  const avatarUrl = user?.avatar || null;

  const currentItem = MENTOR_NAV_LINKS.find((item) => item.href === location.pathname) || {
    name: 'Mentor Workspace',
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar
        role="mentor"
        links={MENTOR_NAV_LINKS}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentItem.name}
              </h1>
              <Badge variant="purple" size="sm" className="hidden sm:inline-flex">
                Mentor Mode
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Availability Status Toggle */}
            <button
              type="button"
              onClick={() => setIsAcceptingBookings(!isAcceptingBookings)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold hover:border-slate-300 transition"
              title="Toggle booking acceptance status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAcceptingBookings ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="text-slate-700">
                {isAcceptingBookings ? 'Accepting Bookings' : 'Bookings Paused'}
              </span>
            </button>

            <Link
              to="/mentor/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <Link to="/mentor/profile" className="flex items-center gap-2.5 group">
              <Avatar
                src={avatarUrl}
                name={displayName}
                size="sm"
                status="online"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition">
                {displayName}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
