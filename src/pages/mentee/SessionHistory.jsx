import React from 'react';
import { History, Download, FileText } from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function SessionHistory() {
  const completed = MOCK_BOOKINGS.filter((b) => b.status === 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Session History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived logs of completed coaching calls, notes, and action plans.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
          Export History (.CSV)
        </Button>
      </div>

      {completed.length > 0 ? (
        <div className="space-y-4">
          {completed.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No past sessions"
          description="Your completed sessions and mentor summaries will appear here."
        />
      )}
    </div>
  );
}
