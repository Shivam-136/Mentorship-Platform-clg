import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Compass,
  LayoutDashboard,
  Search,
  CalendarDays,
  Video,
  History,
  Target,
  Star,
  Bell,
  User,
  Settings,
  UserCheck,
  Briefcase,
  DollarSign,
  Inbox,
  CalendarClock,
  LogOut,
  ArrowLeftRight,
  X
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { logout } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';

const ICON_MAP = {
  LayoutDashboard,
  Search,
  CalendarDays,
  Video,
  History,
  Target,
  Star,
  Bell,
  User,
  Settings,
  UserCheck,
  Briefcase,
  DollarSign,
  Inbox,
  CalendarClock,
};

export default function Sidebar({
  role = 'mentee', // 'mentee' | 'mentor'
  links = [],
  isOpen = false,
  onClose = () => {}
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isMentor = role === 'mentor';

  // Derive dynamic user details strictly from real auth state
  const displayName = user?.name || user?.fullName || (isMentor ? 'Mentor Workspace' : 'Mentee Workspace');
  const roleSubtitle = user?.roleTitle || user?.title || (isMentor ? 'Mentor Portal' : 'Mentee Portal');
  const avatarUrl = user?.avatar || null;
  const badgeText = isMentor ? 'Mentor Mode' : 'Mentee Mode';
  const badgeVariant = isMentor ? 'purple' : 'brand';

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleRoleSwitch = () => {
    if (isMentor) {
      navigate('/mentee/dashboard');
    } else {
      navigate('/mentor/dashboard');
    }
    onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been safely signed out.',
      })
    );
    navigate('/auth/login');
    onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      
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
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Indicator & Switcher */}
      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <Badge variant={badgeVariant} size="sm" dot>
          {badgeText}
        </Badge>
        <button
          type="button"
          onClick={handleRoleSwitch}
          className="text-[11px] font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 transition"
        >
          <ArrowLeftRight className="w-3 h-3 text-slate-400" />
          <span>Switch to {isMentor ? 'Mentee' : 'Mentor'}</span>
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
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
                      ? 'bg-purple-50 text-purple-700 shadow-xs border border-purple-200/80 font-bold'
                      : 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/80 font-bold'
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

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={avatarUrl}
            name={displayName}
            size="md"
            status="online"
          />
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-slate-900 truncate">
              {displayName}
            </h5>
            <p className="text-[11px] text-slate-500 truncate">
              {roleSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-center hover:bg-slate-50 transition"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 py-1.5 px-2 rounded-lg bg-white border border-rose-200 text-center hover:bg-rose-50 transition flex items-center justify-center gap-1"
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

      {/* Mobile Drawer with Backdrop */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
