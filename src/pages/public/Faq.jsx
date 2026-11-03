import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageSquare } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const FAQS_DATA = [
  {
    q: 'How does 1-on-1 mentorship work on MentorMatch?',
    a: 'Browse verified mentors by specialty, tech stack, or seniority. Inspect their hourly rates and focus topics, then propose a slot directly on their availability calendar. Once confirmed by the mentor, you will automatically receive an instant Google Meet or Zoom link, along with dedicated session preparation notes.',
  },
  {
    q: 'Can I cancel or reschedule a booked session?',
    a: 'Yes. Sessions can be rescheduled or cancelled directly from your Mentee Bookings dashboard. Cancellations made at least 24 hours prior to the scheduled start time trigger a full refund.',
  },
  {
    q: 'How are mentors verified on the platform?',
    a: 'Every mentor on MentorMatch passes through a screening process verifying their corporate employment, a minimum of 5+ years of relevant industry experience, and a proven track record of technical or product leadership.',
  },
  {
    q: 'What is the difference between Mentee and Mentor accounts?',
    a: 'Mentees have access to mentor search, booking management, session notes, and personalized career roadmaps. Mentors receive a dedicated workspace for setting weekly availability, receiving booking proposals, tracking earnings, and reviewing mentee briefs.',
  },
  {
    q: 'Are the sessions recorded?',
    a: 'By default, sessions are strictly private between you and your mentor. If both parties agree at the start of the call, you may record the session for your personal study and reference.',
  },
  {
    q: 'How are payments handled?',
    a: 'Payment is authorized upon booking and processed securely. Mentors receive direct automated bank deposits 48 hours after the call is successfully completed.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Platform Guidance</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Everything you need to know about scheduling sessions, mentor vetting standards, and platform operations.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                className="overflow-hidden transition-all duration-200 border border-slate-200/90 bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Help Box */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Have a specific question?</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Can’t find what you are looking for? Reach out directly to our support team and we will respond promptly.
          </p>
          <div>
            <Link to="/contact">
              <Button size="sm" variant="outline">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
