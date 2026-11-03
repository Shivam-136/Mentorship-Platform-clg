import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useToast from '../../utils/useToast';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function Bookings() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'completed'
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalType, setModalType] = useState(null); // 'reschedule' | 'cancel' | 'review'
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const filtered = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'Upcoming' || b.status === 'Confirmed';
    if (activeTab === 'completed') return b.status === 'Completed';
    return true;
  });

  const handleCancel = (session) => {
    setSelectedSession(session);
    setModalType('cancel');
  };

  const confirmCancel = () => {
    if (!selectedSession) return;
    setBookings(
      bookings.map((b) => (b.id === selectedSession.id ? { ...b, status: 'Cancelled' } : b))
    );
    toast.info('Session cancelled successfully.', 'Booking Cancelled');
    setModalType(null);
    setSelectedSession(null);
  };

  const handleReschedule = (session) => {
    setSelectedSession(session);
    setModalType('reschedule');
  };

  const confirmReschedule = () => {
    toast.success('Reschedule request sent to mentor!', 'Request Sent');
    setModalType(null);
  };

  const handleReview = (session) => {
    setSelectedSession(session);
    setModalType('review');
  };

  const submitReview = () => {
    setBookings(
      bookings.map((b) =>
        b.id === selectedSession.id
          ? { ...b, ratingGiven: reviewRating, feedbackGiven: reviewComment }
          : b
      )
    );
    toast.success('Thank you! Your review has been recorded.', 'Feedback Submitted');
    setModalType(null);
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Bookings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your scheduled, past, and upcoming mentorship calls.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 self-start sm:self-auto">
          {['all', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
              onLeaveReview={handleReview}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookings in this category"
          description="You don't have any bookings matching this filter."
        />
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={modalType === 'cancel'}
        onClose={() => setModalType(null)}
        title="Cancel Mentorship Session?"
        description="Are you sure you want to cancel this booking?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Cancelling this session with <strong>{selectedSession?.mentorName}</strong> will release the time slot and trigger a full refund if canceled 24 hours in advance.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalType(null)}>
              Keep Session
            </Button>
            <Button variant="danger" size="sm" onClick={confirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalType === 'reschedule'}
        onClose={() => setModalType(null)}
        title="Reschedule Session"
        description={`Propose a new time with ${selectedSession?.mentorName}`}
      >
        <div className="space-y-4 text-xs">
          <Input label="Proposed Date" type="date" required defaultValue="2026-10-15" />
          <Input label="Proposed Time (PST)" type="time" required defaultValue="16:00" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Reason / Message for Mentor:
            </label>
            <textarea
              rows={2}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none"
              placeholder="e.g. Conflict with team release meeting..."
            />
          </div>
          <Button fullWidth size="md" onClick={confirmReschedule}>
            Send Reschedule Request
          </Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={modalType === 'review'}
        onClose={() => setModalType(null)}
        title="Leave Feedback for Mentor"
        description={`Share your experience with ${selectedSession?.mentorName}`}
      >
        <div className="space-y-4 text-xs">
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
                  className={`text-2xl transition ${
                    star <= reviewRating ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-slate-500 font-semibold ml-2">({reviewRating} / 5 Stars)</span>
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
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="How did this session impact your problem or career?"
            />
          </div>

          <Button fullWidth size="md" onClick={submitReview}>
            Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
}
