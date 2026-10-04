import React from 'react';
import { Video, Clock, User, Calendar } from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function MentorUpcomingSessions() {
  const upcoming = MOCK_BOOKINGS.filter(
    (b) => b.status === 'Upcoming' || b.status === 'Confirmed'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Mentoring Sessions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sessions you are hosting. Mentees will join via the encrypted meeting room.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-800 font-semibold">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Syncing with your linked calendar</span>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <div className="space-y-4">
          {upcoming.map((session) => (
            <SessionCard key={session.id} session={session} isMentorView={true} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No upcoming mentoring sessions"
          description="Your confirmed sessions will appear here."
        />
      )}
    </div>
  );
}
