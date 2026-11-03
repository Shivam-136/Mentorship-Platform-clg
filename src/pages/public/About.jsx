import React from 'react';
import { Target, Heart, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Practitioner-Led Knowledge',
      desc: 'Genuine technical mentorship comes from practitioners currently writing production code, shipping features, and driving real architectural decisions.',
    },
    {
      icon: Heart,
      title: 'Radical Candor & Empathy',
      desc: 'High-leverage feedback must be kind, clear, and unvarnished. We foster safe, high-trust environments where engineering and leadership growth accelerates.',
    },
    {
      icon: Award,
      title: 'Growth Without Gatekeeping',
      desc: 'Democratizing access to Staff+ and executive guidance so ambitious engineers from any background can reach leadership potential.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Our Mission</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bridging the gap between engineering ambition and tech leadership.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MentorMatch was created to eliminate the gatekeeping and ambiguity that holds talented engineers and product minds back from achieving their leadership potential.
          </p>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Why we built MentorMatch
            </h2>
            <p>
              Career progression in modern tech is rarely just about raw technical syntax. It is about learning how to negotiate cross-team consensus, frame trade-offs to executives, and design systems that scale sustainably under real production constraints.
            </p>
            <p>
              Static courses and books cannot answer the nuanced trade-offs of your exact architecture or promotion packet. By connecting engineers directly with staff and principal mentors for targeted 1-on-1 strategy sessions, we unlock accelerated, actionable progress.
            </p>
          </div>

          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Vetted Quality Standard</span>
            </div>
            <h3 className="text-lg font-bold">5+ Years Verified Experience</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every mentor on MentorMatch is screened to ensure verified corporate employment and hands-on track record in senior software engineering or product management.
            </p>
            <div className="border-t border-white/15 pt-4 space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero recurring subscription lock-ins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Private 1-on-1 calls with automatic calendar sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dedicated actionable session takeaway notes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">What Guides Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Card key={i} className="p-6 text-center space-y-3 bg-white">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
