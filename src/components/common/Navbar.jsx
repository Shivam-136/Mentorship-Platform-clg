import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ArrowRight, User, Shield, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { PUBLIC_NAV_LINKS } from '../../constants/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                Mentor<span className="text-brand-600">Match</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Elevate Together
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons & Portal Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Portal Switcher for reviewer demo */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
              >
                <span>Demo Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {demoMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDemoMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-40 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Direct Dashboard Access</p>
                    <Link
                      to="/mentee/dashboard"
                      onClick={() => setDemoMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition"
                    >
                      <User className="w-4 h-4 text-brand-600" />
                      Mentee Dashboard
                    </Link>
                    <Link
                      to="/mentor/dashboard"
                      onClick={() => setDemoMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition"
                    >
                      <Shield className="w-4 h-4 text-purple-600" />
                      Mentor Dashboard
                    </Link>
                  </div>
                </>
              )}
            </div>

            <Link to="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm font-semibold">
                Sign In
              </Button>
            </Link>
            
            <Link to="/auth/register">
              <Button size="sm" className="text-sm shadow-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Join Platform
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/auth/login" className="text-xs font-semibold text-brand-600 px-2 py-1">
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
              Role Dashboards
            </div>
            <Link
              to="/mentee/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              <User className="w-4 h-4 text-brand-600" />
              Mentee Dashboard
            </Link>
            <Link
              to="/mentor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              Mentor Dashboard
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth size="md">
                Get Started Free
              </Button>
            </Link>
            <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
              <Button fullWidth variant="outline" size="md">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
