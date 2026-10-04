import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, Compass, User, Calendar, ExternalLink } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { MENTEE_NAV_LINKS } from '../constants/navigation';

export default function MenteeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Find current active item title
  const currentItem = MENTEE_NAV_LINKS.find((item) => item.href === location.pathname) || {
    name: 'Mentee Portal'
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar
        role="mentee"
        links={MENTEE_NAV_LINKS}
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
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {currentItem.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/mentee/mentors" className="hidden sm:block">
              <Button size="sm" variant="subtleBrand" className="text-xs">
                Browse Mentors
              </Button>
            </Link>

            <Link
              to="/mentee/notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <Link to="/mentee/profile" className="flex items-center gap-2">
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                name="Jordan Hayes"
                size="sm"
                status="online"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-700">
                Jordan
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
