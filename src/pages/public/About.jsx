import React from 'react';
import { Compass, Target, Heart, Award, ShieldCheck, Users } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Practitioner-Led Knowledge',
      desc: 'We believe genuine mentorship comes from leaders currently writing code, shipping features, and driving real organizational decisions.'
    },
    {
      icon: Heart,
      title: 'Radical Candor & Empathy',
      desc: 'Actionable feedback must be kind, clear, and unvarnished. We foster high-trust environments where growth accelerates.'
    },
    {
      icon: Award,
      title: 'Excellence Without Gatekeeping',
      desc: 'Breaking down traditional executive networks and making top-tier technical guidance accessible to ambitious minds everywhere.'
    }
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Our Mission</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bridging the gap between ambition and tech leadership.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MentorMatch was founded to eliminate the arbitrary barriers that hold talented engineers and product minds back from realizing their full leadership potential.
          </p>
        </div>

        {/* Story */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Why we started MentorMatch
            </h2>
            <p>
              Throughout our careers at companies like Google, Stripe, and Meta, we noticed that career progression isn't just about raw skill. It's about knowing how to navigate architectural trade-offs, drive cross-functional alignment, and articulate business impact.
            </p>
            <p>
              Traditional courses and static books fail to answer the subtle nuances of real-world scenarios. By connecting engineers directly with staff and principal mentors for targeted 1-on-1 sessions, we unlock exponential growth.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-brand-600 to-indigo-700 rounded-xl p-8 text-white space-y-6">
            <div className="text-3xl font-extrabold">18,500+</div>
            <p className="text-xs text-brand-100 uppercase tracking-wider font-semibold">Transformative sessions delivered</p>
            <div className="border-t border-white/20 pt-4">
              <p className="text-xs italic text-brand-50">
                "Having a mentor who walked through the exact Staff transition three years before me shaved at least two years off my promotion journey."
              </p>
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
                <Card key={i} className="p-6 text-center space-y-3">
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
