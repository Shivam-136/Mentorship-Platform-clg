import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  History,
  Download,
  Star,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import useToast from '../../utils/useToast';
import { formatCurrency } from '../../utils/helpers';

export default function MentorSessionHistory() {
  const toast = useToast();
  const allBookings = useSelector((state) => state.bookings.bookings);

  const completedSessions = useMemo(() => {
    return allBookings
      .filter((b) => b.status === 'Completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allBookings]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const totalGross = useMemo(() => {
    return completedSessions.reduce((acc, b) => acc + (b.price || 0), 0);
  }, [completedSessions]);

  const reviewedCount = useMemo(() => {
    return completedSessions.filter((b) => Boolean(b.ratingGiven)).length;
  }, [completedSessions]);

  const handleExportCSV = () => {
    if (completedSessions.length === 0) {
      toast.info('No completed sessions available to export.', 'Export Unavailable');
      return;
    }

    const headers = [
      'Session ID',
      'Date',
      'Time',
      'Mentee Name',
      'Mentee Role',
      'Topic',
      'Duration',
      'Fee ($)',
      'Rating Received',
      'Feedback Received',
      'Notes',
    ];

    const rows = completedSessions.map((s) => [
      s.id,
      s.date,
      s.time,
      `"${s.menteeName || ''}"`,
      `"${s.menteeRole || ''}"`,
      `"${s.topic || ''}"`,
      s.duration || '60 min',
      s.price || 0,
      s.ratingGiven || 'Not Rated',
      `"${(s.feedbackGiven || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mentor_session_history_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Session history exported to CSV.', 'Report Generated');
  };

  const handleOpenNotes = (session) => {
    setSelectedSession(session);
    setIsNotesModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentoring History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Permanent archive of previously completed mentoring calls, mentee feedback, and earnings.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto text-xs"
        >
          Export Statement (.CSV)
        </Button>
      </div>

      {/* Summary Metrics */}
      {completedSessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completed Calls</span>
              <p className="text-lg font-extrabold text-slate-900">
                {completedSessions.length}
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Gross Call Revenue</span>
              <p className="text-lg font-extrabold text-slate-900">
                {formatCurrency(totalGross)}
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Mentees Reviewed</span>
              <p className="text-lg font-extrabold text-slate-900">
                {reviewedCount} / {completedSessions.length}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Sessions List */}
      {completedSessions.length > 0 ? (
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isMentorView={true}
              onViewNotes={handleOpenNotes}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No completed sessions yet"
          description="Your mentoring call history will appear here automatically once scheduled calls finish."
        />
      )}

      {/* View Notes Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title="Session Record & Mentee Feedback"
        description={`${selectedSession?.topic} with ${selectedSession?.menteeName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 block">Session Notes:</span>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedSession?.notes || 'No notes were recorded for this session.'}
            </p>
          </div>

          {selectedSession?.feedbackGiven && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Mentee Feedback ({selectedSession.ratingGiven} / 5 Stars):</span>
              </div>
              <p className="italic">"{selectedSession.feedbackGiven}"</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline" onClick={() => setIsNotesModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
