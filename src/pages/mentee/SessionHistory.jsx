import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Download,
  Star,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useToast from '../../utils/useToast';
import { addReviewToBooking } from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export default function SessionHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const allBookings = useSelector((state) => state.bookings.bookings) || [];

  const completedSessions = allBookings
    .filter((b) => b.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Modal states
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalType, setModalType] = useState(null); // 'notes' | 'review'

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Export CSV handler
  const handleExportCSV = () => {
    if (completedSessions.length === 0) {
      toast.info('No completed sessions available to export.', 'Export Unavailable');
      return;
    }

    const headers = [
      'Session ID',
      'Date',
      'Time',
      'Mentor Name',
      'Mentor Role',
      'Topic',
      'Duration',
      'Price ($)',
      'Rating Given',
      'Feedback Given',
      'Notes',
    ];

    const rows = completedSessions.map((s) => [
      s.id,
      s.date,
      s.time,
      `"${s.mentorName || ''}"`,
      `"${s.mentorTitle || ''}"`,
      `"${s.topic || ''}"`,
      s.duration || '60 min',
      s.price || 0,
      s.ratingGiven || 'Not Reviewed',
      `"${(s.feedbackGiven || '').replace(/"/g, '""')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mentorship_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Session history exported to CSV.', 'Export Complete');
  };

  const handleOpenNotes = (session) => {
    setSelectedSession(session);
    setModalType('notes');
  };

  const handleOpenReview = (session) => {
    setSelectedSession(session);
    setReviewRating(5);
    setReviewComment('');
    setModalType('review');
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.warning('Please provide a feedback comment.');
      return;
    }

    dispatch(
      addReviewToBooking({
        id: selectedSession.id,
        rating: reviewRating,
        feedback: reviewComment.trim(),
      })
    );

    dispatch(
      addNotification({
        title: 'Feedback Submitted',
        description: `Your ${reviewRating}-star review for ${selectedSession.mentorName} has been recorded.`,
        type: 'review',
      })
    );

    toast.success('Thank you! Your feedback has been recorded.', 'Feedback Submitted');
    setModalType(null);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Session History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived logs of completed coaching calls, mentor recommendations, and action plans.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-3.5 h-3.5" />}
          className="self-start sm:self-auto text-xs"
        >
          Export History (.CSV)
        </Button>
      </div>

      {/* Summary Metrics */}
      {completedSessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Completed Sessions</span>
              <p className="text-lg font-extrabold text-slate-900">
                {completedSessions.length}
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Mentorship Time</span>
              <p className="text-lg font-extrabold text-slate-900">
                {(completedSessions.length * 1.0).toFixed(1)} hrs
              </p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Reviewed Sessions</span>
              <p className="text-lg font-extrabold text-slate-900">
                {completedSessions.filter((s) => s.ratingGiven).length} / {completedSessions.length}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Completed Sessions List */}
      {completedSessions.length > 0 ? (
        <div className="space-y-4">
          {completedSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onViewNotes={handleOpenNotes}
              onLeaveReview={handleOpenReview}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No completed sessions yet"
          description="Your completed sessions, mentor summaries, and key takeaways will be permanently cataloged here."
          actionLabel="Schedule Your First Session"
          onAction={() => navigate('/mentee/mentors')}
        />
      )}

      {/* View Notes Modal */}
      <Modal
        isOpen={modalType === 'notes'}
        onClose={() => setModalType(null)}
        title="Session Notes & Key Takeaways"
        description={`${selectedSession?.topic} with ${selectedSession?.mentorName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 block">Session Summary & Notes:</span>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedSession?.notes || 'No notes were recorded for this session.'}
            </p>
          </div>

          {selectedSession?.feedbackGiven && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
              <span className="font-bold block">
                Your Feedback ({selectedSession.ratingGiven} ★):
              </span>
              <p className="italic">"{selectedSession.feedbackGiven}"</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline" onClick={() => setModalType(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Review Modal */}
      <Modal
        isOpen={modalType === 'review'}
        onClose={() => setModalType(null)}
        title="Leave Feedback for Mentor"
        description={`Share your experience with ${selectedSession?.mentorName}`}
      >
        <form onSubmit={handleConfirmReview} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Rating:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition hover:scale-110 ${
                    star <= reviewRating ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-slate-600 font-semibold ml-2">
                ({reviewRating} / 5 Stars)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Your Review / Testimonial:
            </label>
            <textarea
              rows={3}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="How did this session impact your technical or career problem?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
