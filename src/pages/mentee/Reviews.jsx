import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function MenteeReviews() {
  const reviewedSessions = MOCK_BOOKINGS.filter((b) => b.ratingGiven);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reviews & Feedback</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your submitted testimonials and mentor evaluation ratings.
        </p>
      </div>

      {reviewedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewedSessions.map((session) => (
            <Card key={session.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{session.mentorName}</h4>
                  <p className="text-xs text-slate-500">{session.topic}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < session.ratingGiven
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                "{session.feedbackGiven}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>Session date: {session.date}</span>
                <span className="text-brand-600 font-semibold">Published on Mentor Profile</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No reviews left yet"
          description="Once you complete a mentorship session, your feedback will be archived here."
        />
      )}
    </div>
  );
}
