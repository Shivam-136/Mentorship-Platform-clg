import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import ReviewCard from '../../components/cards/ReviewCard';
import { MOCK_REVIEWS } from '../../data/mockData';

export default function MentorReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentee Reviews & Ratings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Public feedback left by verified mentees following 1-on-1 sessions.
        </p>
      </div>

      {/* Summary Scorecard */}
      <Card className="p-6 bg-gradient-to-r from-purple-50/60 to-white border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="text-center sm:text-left">
            <span className="text-4xl font-black text-slate-900">4.95</span>
            <div className="flex items-center gap-1 mt-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">Based on 142 total reviews</p>
          </div>
        </div>

        <div className="space-y-1.5 flex-1 max-w-xs text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span>5 Stars</span>
            <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[94%]" />
            </div>
            <span>94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>4 Stars</span>
            <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[6%]" />
            </div>
            <span>6%</span>
          </div>
        </div>
      </Card>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
