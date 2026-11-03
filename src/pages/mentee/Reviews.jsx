import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import useToast from '../../utils/useToast';
import { addReviewToBooking } from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export default function MenteeReviews() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const allBookings = useSelector((state) => state.bookings.bookings) || [];

  const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' | 'pending'
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Eligible completed sessions without review
  const pendingReviews = allBookings.filter(
    (b) => b.status === 'Completed' && !b.ratingGiven
  );

  // Completed sessions with reviews
  const submittedReviews = allBookings.filter((b) => Boolean(b.ratingGiven));

  // Compute average rating given
  const avgRating =
    submittedReviews.length > 0
      ? (
          submittedReviews.reduce((acc, curr) => acc + (curr.ratingGiven || 0), 0) /
          submittedReviews.length
        ).toFixed(1)
      : '0.0';

  const handleOpenReviewModal = (session) => {
    setSelectedSessionForReview(session);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedSessionForReview) return;

    if (!comment.trim()) {
      toast.warning('Please provide your testimonial or feedback comment.');
      return;
    }

    dispatch(
      addReviewToBooking({
        id: selectedSessionForReview.id,
        rating,
        feedback: comment.trim(),
      })
    );

    dispatch(
      addNotification({
        title: 'Review Published',
        description: `Your ${rating}-star review for ${selectedSessionForReview.mentorName} is published.`,
        type: 'review',
      })
    );

    toast.success('Thank you! Your feedback has been published.', 'Review Recorded');
    setSelectedSessionForReview(null);
    setActiveTab('submitted');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reviews & Feedback</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your submitted testimonials and rate completed coaching sessions.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('submitted')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              activeTab === 'submitted'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submitted Reviews ({submittedReviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Awaiting Review ({pendingReviews.length})
          </button>
        </div>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Average Rating Given</span>
            <p className="text-lg font-extrabold text-slate-900">
              {submittedReviews.length > 0 ? `${avgRating} / 5.0` : '—'}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Reviews Submitted</span>
            <p className="text-lg font-extrabold text-slate-900">{submittedReviews.length}</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Sessions Pending Review</span>
            <p className="text-lg font-extrabold text-slate-900">{pendingReviews.length}</p>
          </div>
        </Card>
      </div>

      {/* Pending Reviews Tab */}
      {activeTab === 'pending' && (
        <div>
          {pendingReviews.length > 0 ? (
            <div className="space-y-3">
              {pendingReviews.map((session) => (
                <Card
                  key={session.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{session.topic}</h4>
                      <Badge variant="subtleBrand" size="sm">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      With <strong>{session.mentorName}</strong> ({session.mentorTitle})
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Session Date: {session.date} at {session.time}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleOpenReviewModal(session)}
                    leftIcon={<Star className="w-3.5 h-3.5" />}
                    className="self-start sm:self-center text-xs"
                  >
                    Write Review
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="All completed sessions reviewed!"
              description="You have provided feedback for all your completed mentorship sessions."
              actionLabel="View Submitted Reviews"
              onAction={() => setActiveTab('submitted')}
            />
          )}
        </div>
      )}

      {/* Submitted Reviews Tab */}
      {activeTab === 'submitted' && (
        <div>
          {submittedReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedReviews.map((session) => (
                <Card key={session.id} className="p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{session.mentorName}</h4>
                        <p className="text-xs text-slate-500">{session.topic}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= session.ratingGiven
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic leading-relaxed">
                      "{session.feedbackGiven}"
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Session date: {session.date}
                    </span>
                    <span className="text-brand-600 font-semibold">Verified Review</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="No reviews left yet"
              description="Once you complete a coaching session with a mentor, you can leave a review and testimonial here."
              actionLabel={pendingReviews.length > 0 ? 'Review Completed Sessions' : 'Find a Mentor'}
              onAction={() => {
                if (pendingReviews.length > 0) {
                  setActiveTab('pending');
                } else {
                  navigate('/mentee/mentors');
                }
              }}
            />
          )}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(selectedSessionForReview)}
        onClose={() => setSelectedSessionForReview(null)}
        title="Leave Feedback for Mentor"
        description={`Share your experience with ${selectedSessionForReview?.mentorName}`}
      >
        {selectedSessionForReview && (
          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Rating:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition hover:scale-110 ${
                      star <= rating ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-slate-600 font-semibold ml-2">
                  ({rating} / 5 Stars)
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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="How did this session impact your technical skills or career goals?"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedSessionForReview(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
