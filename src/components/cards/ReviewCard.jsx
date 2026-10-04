import React from 'react';
import { Star } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

export default function ReviewCard({ review }) {
  return (
    <Card hoverable className="p-6 flex flex-col justify-between h-full bg-white">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={review.avatar} name={review.author} size="md" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">{review.author}</h4>
              <p className="text-xs text-slate-500">{review.role}</p>
            </div>
          </div>
          <span className="text-xs text-slate-400">{review.date}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-slate-700 leading-relaxed italic">
          "{review.comment}"
        </p>
      </div>

      {review.mentorName && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Mentored by <strong className="text-slate-800">{review.mentorName}</strong></span>
        </div>
      )}
    </Card>
  );
}
