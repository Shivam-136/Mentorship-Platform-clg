import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarCheck, Video, Rocket, CheckCircle2, DollarSign, Users, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function HowItWorks() {
  const [activeRole, setActiveRole] = useState('mentee');

  const menteeSteps = [
    {
      icon: Search,
      step: '01',
      title: 'Discover Your Ideal Mentor',
      desc: 'Browse mentors by domain, seniority level, tech stack, company background, and hourly rates. Check verified reviews and session specialties.'
    },
    {
      icon: CalendarCheck,
      step: '02',
      title: 'Pick a Time & Submit Your Context',
      desc: 'Select a time slot matching your schedule. When booking, upload your resume, draft architecture, or bullet questions so your mentor prepares beforehand.'
    },
    {
      icon: Video,
      step: '03',
      title: '1-on-1 High-Impact Video Session',
      desc: 'Join via secure video link. Get direct code reviews, system design mock interviews, or tactical career advice in a focused 45-60 minute format.'
    },
    {
      icon: Rocket,
      step: '04',
      title: 'Actionable Notes & Continued Growth',
      desc: 'Receive written takeaway notes and action items from your mentor. Book follow-ups as milestones are reached.'
    }
  ];

  const mentorSteps = [
    {
      icon: Award,
      step: '01',
      title: 'Apply & Verify Credentials',
      desc: 'Submit your professional background, current position, and areas of expertise. Our team reviews every application within 48 hours.'
    },
    {
      icon: CalendarCheck,
      step: '02',
      title: 'Define Availability & Session Pricing',
      desc: 'Connect your Google or Outlook calendar. Set your hourly rates, choose which session topics you wish to offer, and control your time buffers.'
    },
    {
      icon: Users,
      step: '03',
      title: 'Mentor Ambitious Developers',
      desc: 'Accept booking requests with clear mentee briefs. Conduct impactful 1-on-1 calls that solve real engineering challenges.'
    },
    {
      icon: DollarSign,
      step: '04',
      title: 'Earn & Grow Your Network',
      desc: 'Receive reliable weekly direct deposits. Build a stellar mentoring reputation and mentor the next generation of industry leaders.'
    }
  ];

  const currentSteps = activeRole === 'mentee' ? menteeSteps : mentorSteps;

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">The Blueprint</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How MentorMatch Works
          </h1>
          <p className="text-base text-slate-600">
            A frictionless platform built for high-impact knowledge transfer between seasoned tech veterans and ambitious professionals.
          </p>

          {/* Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 mt-4">
            <button
              type="button"
              onClick={() => setActiveRole('mentee')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'mentee'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Mentees
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('mentor')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'mentor'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Mentors
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Card key={idx} className="p-6 relative flex flex-col justify-between h-full bg-white">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">
              {activeRole === 'mentee' ? 'Ready to find your guide?' : 'Share your knowledge with others.'}
            </h3>
            <p className="text-sm text-slate-300">
              {activeRole === 'mentee'
                ? 'Join thousands of developers advancing their careers.'
                : 'Join our vetted network of world-class mentors.'}
            </p>
          </div>
          <Link to="/auth/register">
            <Button size="lg" className="px-8 shrink-0 bg-brand-500 hover:bg-brand-600 text-white shadow-lg">
              {activeRole === 'mentee' ? 'Find a Mentor Now' : 'Apply to Mentor'}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
