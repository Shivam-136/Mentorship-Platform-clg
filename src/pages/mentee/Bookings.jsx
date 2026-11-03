import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Video,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import useToast from '../../utils/useToast';
import {
  cancelBooking,
  rescheduleBooking,
  addReviewToBooking,
} from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

const RESCHEDULE_TIMES = [
  '09:00 AM PST',
  '11:00 AM PST',
  '02:00 PM PST',
  '04:30 PM PST',
  '06:00 PM PST',
];

export default function Bookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bookings = useSelector((state) => state.bookings.bookings);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'completed' | 'cancelled'
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalType, setModalType] = useState(null); // 'cancel' | 'reschedule' | 'review' | 'notes' | 'join'

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState(RESCHEDULE_TIMES[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Cancel form state
  const [cancelReason, setCancelReason] = useState('');

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter(
        (b) =>
          b.status === 'Upcoming' ||
          b.status === 'Confirmed' ||
          b.status === 'Pending Confirmation'
      ).length,
      completed: bookings.filter((b) => b.status === 'Completed').length,
      cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    };
  }, [bookings]);

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        if (activeTab === 'upcoming') {
          return (
            b.status === 'Upcoming' ||
            b.status === 'Confirmed' ||
            b.status === 'Pending Confirmation'
          );
        }
        if (activeTab === 'completed') return b.status === 'Completed';
        if (activeTab === 'cancelled') return b.status === 'Cancelled';
        return true;
      })
      .filter((b) => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        return (
          b.mentorName?.toLowerCase().includes(q) ||
          b.topic?.toLowerCase().includes(q) ||
          b.notes?.toLowerCase().includes(q)
        );
      });
  }, [bookings, activeTab, searchFilter]);

  // Cancel Handlers
  const handleOpenCancel = (session) => {
    setSelectedSession(session);
    setCancelReason('');
    setModalType('cancel');
  };

  const handleConfirmCancel = () => {
    if (!selectedSession) return;
    dispatch(cancelBooking(selectedSession.id));
    dispatch(
      addNotification({
        title: 'Booking Cancelled',
        description: `Your session with ${selectedSession.mentorName} for ${selectedSession.date} has been cancelled.`,
        type: 'booking',
      })
    );
    toast.info('Session cancelled successfully.', 'Booking Cancelled');
    setModalType(null);
    setSelectedSession(null);
  };

  // Reschedule Handlers
  const handleOpenReschedule = (session) => {
    setSelectedSession(session);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setRescheduleDate(tomorrow.toISOString().split('T')[0]);
    setRescheduleTime(session.time || RESCHEDULE_TIMES[0]);
    setRescheduleReason('');
    setModalType('reschedule');
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!selectedSession || !rescheduleDate) {
      toast.warning('Please select a proposed date.');
      return;
    }

    dispatch(
      rescheduleBooking({
        id: selectedSession.id,
        newDate: rescheduleDate,
        newTime: rescheduleTime,
        note: rescheduleReason.trim() || 'Schedule conflict request.',
      })
    );

    dispatch(
      addNotification({
        title: 'Reschedule Request Submitted',
        description: `Requested new time (${rescheduleDate} at ${rescheduleTime}) for session with ${selectedSession.mentorName}.`,
        type: 'booking',
      })
    );

    toast.success(
      'Reschedule request registered. Status updated to Pending Confirmation.',
      'Request Sent'
    );
    setModalType(null);
    setSelectedSession(null);
  };

  // Review Handlers
  const handleOpenReview = (session) => {
    setSelectedSession(session);
    setReviewRating(5);
    setReviewComment('');
    setModalType('review');
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.warning('Please write a short testimonial or feedback comment.');
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
        title: 'Feedback Recorded',
        description: `Your ${reviewRating}-star review for ${selectedSession.mentorName} has been submitted.`,
        type: 'review',
      })
    );

    toast.success('Thank you! Your feedback has been recorded.', 'Feedback Submitted');
    setModalType(null);
    setSelectedSession(null);
  };

  // Join Meeting Handlers
  const handleOpenJoin = (session) => {
    setSelectedSession(session);
    setModalType('join');
  };

  // View Notes Handlers
  const handleOpenNotes = (session) => {
    setSelectedSession(session);
    setModalType('notes');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Bookings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your scheduled, past, and upcoming mentorship calls.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'upcoming', label: `Upcoming (${counts.upcoming})` },
            { id: 'completed', label: `Completed (${counts.completed})` },
            { id: 'cancelled', label: `Cancelled (${counts.cancelled})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      {bookings.length > 0 && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by mentor name or session topic..."
              className="w-full text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onCancel={handleOpenCancel}
              onReschedule={handleOpenReschedule}
              onLeaveReview={handleOpenReview}
              onJoin={handleOpenJoin}
              onViewNotes={handleOpenNotes}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={
            activeTab === 'all'
              ? 'No bookings on record'
              : `No ${activeTab} bookings`
          }
          description={
            activeTab === 'all'
              ? 'You have not scheduled any mentorship sessions yet.'
              : `You do not have any bookings currently in the "${activeTab}" status.`
          }
          actionLabel="Explore Mentors"
          onAction={() => navigate('/mentee/mentors')}
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
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-800">
            <span className="font-bold block">Cancellation Notice</span>
            <p>
              Cancelling this session with <strong>{selectedSession?.mentorName}</strong> ({selectedSession?.topic}) will release the reserved time slot ({selectedSession?.date} at {selectedSession?.time}).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict or project priorities shifted..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalType(null)}>
              Keep Session
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalType === 'reschedule'}
        onClose={() => setModalType(null)}
        title="Reschedule Mentorship Session"
        description={`Propose a new date and time with ${selectedSession?.mentorName}`}
      >
        <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Proposed Date
              </label>
              <input
                type="date"
                required
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Time Slot
              </label>
              <select
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500 bg-white"
              >
                {RESCHEDULE_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason / Note for Mentor
            </label>
            <textarea
              rows={2}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              placeholder="e.g. Unforeseen production incident conflict..."
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
              Send Reschedule Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={modalType === 'review'}
        onClose={() => setModalType(null)}
        title="Leave Review & Rating"
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
              placeholder="How did this session impact your career or technical understanding?"
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

      {/* View Notes Modal */}
      <Modal
        isOpen={modalType === 'notes'}
        onClose={() => setModalType(null)}
        title="Session Notes & Key Takeaways"
        description={`${selectedSession?.topic} with ${selectedSession?.mentorName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 block">Session Summary</span>
            <p className="text-slate-600 leading-relaxed">
              {selectedSession?.notes || 'No session notes were logged for this call.'}
            </p>
          </div>

          {selectedSession?.feedbackGiven && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <span className="font-bold block mb-1">
                Your Review ({selectedSession.ratingGiven} ★):
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

      {/* Join Session Modal */}
      <Modal
        isOpen={modalType === 'join'}
        onClose={() => setModalType(null)}
        title="Mentorship Session Room"
        description={`${selectedSession?.topic} with ${selectedSession?.mentorName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-2 text-brand-900">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Video className="w-4 h-4 text-brand-600" />
              <span>Room Ready for Scheduled Time</span>
            </div>
            <p className="text-xs text-brand-800">
              Scheduled Date: <strong>{selectedSession?.date}</strong> at{' '}
              <strong>{selectedSession?.time}</strong> (Duration: {selectedSession?.duration || '60 min'}).
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Pre-Call Checklist:
            </span>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Check your microphone and camera settings</li>
              <li>Have your architecture questions or code snippets open in a separate window</li>
              <li>Ensure a quiet, distraction-free environment for optimal focus</li>
            </ul>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Note: Meeting rooms open automatically 5 minutes prior to session start. Video/audio stream connects via standard WebRTC.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalType(null)}>
              Close
            </Button>
            {selectedSession?.meetUrl && (
              <a
                href={selectedSession.meetUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Button size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open Video Room
                </Button>
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
