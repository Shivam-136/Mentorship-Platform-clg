import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Search,
  CalendarDays,
  Video,
  History,
  Star,
  Bell,
  User,
  Settings,
  UserCheck,
  Inbox,
  CalendarClock,
  LogOut,
  ArrowLeftRight,
  X
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const ICON_MAP = {
  LayoutDashboard,
  Search,
  CalendarDays,
  Video,
  History,
  Star,
  Bell,
  User,
  Settings,
  UserCheck,
  Inbox,
  CalendarClock
};

export default function Sidebar({
  role = 'mentee', // 'mentee' | 'mentor'
  links = [],
  isOpen = false,
  onClose = () => {}
}) {
  const navigate = useNavigate();

  const isMentor = role === 'mentor';

  const userProfile = isMentor
    ? {
        name: 'Dr. Sarah Jenkins',
        roleTitle: 'Principal Engineer (Mentor)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        badge: 'Verified Mentor',
        badgeVariant: 'purple'
      }
    : {
        name: 'Jordan Hayes',
        roleTitle: 'Software Engineer (Mentee)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        badge: 'Active Mentee',
        badgeVariant: 'brand'
      };

  const handleRoleSwitch = () => {
    if (isMentor) {
      navigate('/mentee/dashboard');
    } else {
      navigate('/mentor/dashboard');
    }
    onClose();
  };

  const handleLogout = () => {
    navigate('/auth/login');
    onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">
            Mentor<span className="text-brand-600">Match</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Pill */}
      <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <Badge variant={userProfile.badgeVariant} size="sm" dot>
          {userProfile.badge}
        </Badge>
        <button
          type="button"
          onClick={handleRoleSwitch}
          title="Switch view for previewing demo"
          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <ArrowLeftRight className="w-3 h-3" />
          <span>Switch to {isMentor ? 'Mentee' : 'Mentor'}</span>
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {links.map((link) => {
          const IconComponent = ICON_MAP[link.icon] || LayoutDashboard;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? isMentor
                      ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                      : 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`
              }
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={userProfile.avatar}
            name={userProfile.name}
            size="md"
            status="online"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 truncate">
              {userProfile.name}
            </h5>
            <p className="text-[11px] text-slate-500 truncate">
              {userProfile.roleTitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            onClick={onClose}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-center hover:bg-slate-50 transition"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] font-medium text-rose-600 hover:text-rose-700 py-1.5 px-2 rounded-lg bg-white border border-rose-200 text-center hover:bg-rose-50 transition flex items-center justify-center gap-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: sticky left */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
