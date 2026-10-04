import React from 'react';
import { Video, Calendar, Clock, AlertCircle } from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function UpcomingSessions() {
  const upcoming = MOCK_BOOKINGS.filter(
    (b) => b.status === 'Upcoming' || b.status === 'Confirmed'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Sessions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed video calls. Meeting rooms open 5 minutes prior to the start time.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Times shown in your local time zone</span>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <div className="space-y-4">
          {upcoming.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No upcoming sessions"
          description="You don't have any sessions scheduled for the near future."
          actionLabel="Find a Mentor"
          onAction={() => window.location.assign('/mentee/mentors')}
        />
      )}
    </div>
  );
}
