import React from 'react';
import { History, Download } from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function MentorSessionHistory() {
  const completed = MOCK_BOOKINGS.filter((b) => b.status === 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentoring History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of previously completed mentoring calls, notes delivered, and payouts.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
          Export Tax Report (.CSV)
        </Button>
      </div>

      {completed.length > 0 ? (
        <div className="space-y-4">
          {completed.map((session) => (
            <SessionCard key={session.id} session={session} isMentorView={true} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No completed sessions yet"
          description="Your mentoring call history will appear here once calls finish."
        />
      )}
    </div>
  );
}
