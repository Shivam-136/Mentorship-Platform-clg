import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, MapPin, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function MentorCard({ mentor, onBookNow }) {
  return (
    <Card hoverable className="flex flex-col h-full group transition-all duration-200 hover:-translate-y-1">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header: Avatar, Name, Company, Rate */}
        <div className="flex items-start gap-4">
          <Avatar
            src={mentor.avatar}
            name={mentor.name}
            size="xl"
            status="online"
            className="ring-2 ring-brand-100"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition truncate">
                {mentor.name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" title="Vetted Mentor" />
            </div>
            <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
              {mentor.title}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {mentor.rating.toFixed(2)}
              </span>
              <span>•</span>
              <span>{mentor.reviewsCount} reviews</span>
              <span>•</span>
              <span className="font-medium text-slate-700">{mentor.experience}</span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p className="mt-4 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {mentor.bio}
        </p>

        {/* Skills Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {mentor.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
              +{mentor.skills.length - 4}
            </span>
          )}
        </div>

        {/* Next Availability */}
        <div className="mt-auto pt-5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Next: <strong className="text-slate-700 font-semibold">{mentor.availableNext || 'This week'}</strong></span>
          </div>
          <div className="text-right">
            <span className="text-sm font-extrabold text-slate-900">${mentor.hourlyRate}</span>
            <span className="text-[10px] text-slate-500">/hr</span>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        <Link to={`/mentors/${mentor.id}`} className="flex-1">
          <Button variant="outline" size="sm" fullWidth className="text-xs">
            View Profile
          </Button>
        </Link>
        <Button
          size="sm"
          className="text-xs"
          onClick={() => (onBookNow ? onBookNow(mentor) : null)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Book
        </Button>
      </div>
    </Card>
  );
}
