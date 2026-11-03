import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Compass, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left / Main form area */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Mentor<span className="text-brand-600">Match</span>
            </span>
          </Link>

          <div className="max-w-md mx-auto w-full">
            <Outlet />
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MentorMatch. All rights reserved.</p>
        </div>
      </div>

      {/* Right / Hero visual column */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-200 border border-white/10 backdrop-blur-sm mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            Vetted Professional Network
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate your career through high-impact mentorship.
          </h2>
          <p className="mt-4 text-sm text-slate-300 leading-relaxed">
            Gain immediate access to verified Staff Engineers, Design Directors, and VP-level leaders from companies like Stripe, Figma, and Linear.
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-slate-200 shadow-xl">
          <div className="flex items-center gap-1 text-amber-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs leading-relaxed italic text-slate-200">
            "Within three months of pairing with my mentor on MentorMatch, I landed an L6 role with a 45% compensation bump. The mock system design interviews were game-changers."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Mentee Testimonial"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
            />
            <div>
              <p className="text-xs font-bold text-white">David Zhang</p>
              <p className="text-[11px] text-slate-400">Staff Software Engineer at Datadog</p>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Guaranteed 1-on-1 private video coaching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Flexible scheduling with direct calendar sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
