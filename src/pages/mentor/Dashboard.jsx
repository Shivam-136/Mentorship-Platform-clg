import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DollarSign,
  Video,
  Inbox,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import SessionCard from '../../components/cards/SessionCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import { formatCurrency } from '../../utils/helpers';
import {
  acceptBookingRequest,
  declineBookingRequest,
} from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export default function MentorDashboard() {
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector((state) => state.auth.user);
  const bookings = useSelector((state) => state.bookings.bookings);
  const incomingRequests = useSelector((state) => state.bookings.incomingRequests);
  const { transactions } = useSelector((state) => state.earnings);

  // Modal for confirming request action
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'decline'

  // Computed metrics from real user records
  const upcomingSessions = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === 'Upcoming' ||
          b.status === 'Confirmed' ||
          b.status === 'Pending Confirmation'
      ),
    [bookings]
  );

  const completedSessions = useMemo(
    () => bookings.filter((b) => b.status === 'Completed'),
    [bookings]
  );

  const totalGrossEarnings = useMemo(() => {
    const bookingEarnings = completedSessions.reduce(
      (acc, b) => acc + (b.price || 0),
      0
    );
    const transactionEarnings = transactions.reduce(
      (acc, t) => acc + (t.amount || 0),
      0
    );
    return bookingEarnings + transactionEarnings;
  }, [completedSessions, transactions]);

  // Average rating from completed sessions with reviews
  const reviewedSessions = useMemo(
    () => completedSessions.filter((b) => Boolean(b.ratingGiven)),
    [completedSessions]
  );

  const averageRating = useMemo(() => {
    if (reviewedSessions.length === 0) return '—';
    const sum = reviewedSessions.reduce((acc, b) => acc + b.ratingGiven, 0);
    return (sum / reviewedSessions.length).toFixed(1);
  }, [reviewedSessions]);

  // Request actions
  const handleOpenActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    if (actionType === 'accept') {
      dispatch(acceptBookingRequest(selectedRequest.id));
      dispatch(
        addNotification({
          title: 'Session Scheduled',
          description: `Confirmed session with ${selectedRequest.menteeName} on ${selectedRequest.date}.`,
          type: 'booking',
        })
      );
      toast.success(
        `Session with ${selectedRequest.menteeName} confirmed and added to schedule!`,
        'Request Accepted'
      );
    } else {
      dispatch(declineBookingRequest(selectedRequest.id));
      dispatch(
        addNotification({
          title: 'Proposal Declined',
          description: `Declined booking proposal from ${selectedRequest.menteeName}.`,
          type: 'booking',
        })
      );
      toast.info('Booking proposal has been declined.', 'Request Removed');
    }

    setSelectedRequest(null);
    setActionType(null);
  };

  const mentorName = user?.name || user?.fullName || 'Senior Mentor';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge
              variant="purple"
              size="sm"
              className="bg-purple-500/20 text-purple-200 border-purple-400/30"
            >
              Mentor Workspace
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {mentorName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {incomingRequests.length > 0 ? (
                <>
                  You have <strong className="text-white">{incomingRequests.length}</strong>{' '}
                  pending session request{incomingRequests.length > 1 ? 's' : ''} awaiting review,
                  and <strong className="text-white">{upcomingSessions.length}</strong> upcoming
                  session{upcomingSessions.length === 1 ? '' : 's'} on schedule.
                </>
              ) : (
                <>
                  Your calendar is ready. You currently have{' '}
                  <strong className="text-white">{upcomingSessions.length}</strong> session
                  {upcomingSessions.length === 1 ? '' : 's'} scheduled.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/mentor/availability">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xs">
                Manage Availability
              </Button>
            </Link>
            <Link to="/mentor/services">
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Service Offerings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Lifetime Earnings"
          value={formatCurrency(totalGrossEarnings)}
          change={completedSessions.length > 0 ? `${completedSessions.length} settled sessions` : 'No settled sessions'}
          changeType={completedSessions.length > 0 ? 'increase' : 'neutral'}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Requests"
          value={incomingRequests.length}
          change={incomingRequests.length > 0 ? 'Action required' : 'Inbox clear'}
          changeType={incomingRequests.length > 0 ? 'increase' : 'neutral'}
          icon={Inbox}
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingSessions.length}
          change={upcomingSessions.length > 0 ? 'Confirmed calls' : 'Schedule open'}
          changeType={upcomingSessions.length > 0 ? 'increase' : 'neutral'}
          icon={Calendar}
        />
        <StatCard
          title="Average Rating"
          value={averageRating === '—' ? '—' : `${averageRating} ★`}
          change={reviewedSessions.length > 0 ? `${reviewedSessions.length} reviews` : 'Awaiting feedback'}
          changeType={reviewedSessions.length > 0 ? 'increase' : 'neutral'}
          icon={Star}
        />
      </div>

      {/* Incoming Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Incoming Booking Proposals</h3>
            <p className="text-xs text-slate-500">
              Review and confirm 1-on-1 session requests submitted by mentees.
            </p>
          </div>
          {incomingRequests.length > 0 && (
            <Link
              to="/mentor/booking-requests"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>View All ({incomingRequests.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {incomingRequests.length > 0 ? (
          <div className="space-y-3">
            {incomingRequests.slice(0, 3).map((req) => (
              <Card key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-slate-200">
                <div className="flex items-start gap-3.5">
                  <Avatar
                    src={req.avatar}
                    name={req.menteeName || 'Mentee'}
                    size="lg"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{req.menteeName}</h4>
                      <span className="text-xs text-slate-500 font-medium">• {req.menteeRole || 'Mentee'}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">{req.topic}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        {req.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {req.time}
                      </span>
                      {req.fee && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">${req.fee}</span>
                        </>
                      )}
                    </div>
                    {req.brief && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 italic">
                        "{req.brief}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenActionModal(req, 'decline')}
                    className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleOpenActionModal(req, 'accept')}
                    className="text-xs bg-purple-600 hover:bg-purple-700 shadow-xs"
                    leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                  >
                    Accept & Confirm
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No pending booking requests"
            description="When mentees schedule sessions from your profile, proposals will appear here for your confirmation."
          />
        )}
      </div>

      {/* Upcoming Sessions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upcoming Confirmed Calls</h3>
            <p className="text-xs text-slate-500">
              Meetings scheduled on your calendar.
            </p>
          </div>
          {upcomingSessions.length > 0 && (
            <Link
              to="/mentor/upcoming-sessions"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>See Full Schedule ({upcomingSessions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 2).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isMentorView={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Video}
            title="No upcoming calls"
            description="You don't have any mentoring sessions scheduled in the immediate future."
            actionLabel="Review Availability"
            onAction={() => window.location.assign('/mentor/availability')}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={
          actionType === 'accept'
            ? 'Confirm Mentorship Session?'
            : 'Decline Session Proposal?'
        }
        description={
          actionType === 'accept'
            ? `Accept session request from ${selectedRequest?.menteeName}`
            : `Decline session request from ${selectedRequest?.menteeName}`
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900">{selectedRequest?.topic}</span>
            <p className="text-slate-600">
              Mentee: <strong>{selectedRequest?.menteeName}</strong> ({selectedRequest?.menteeRole})
            </p>
            <p className="text-slate-500">
              Proposed Time: {selectedRequest?.date} at {selectedRequest?.time}
            </p>
          </div>

          <p className="text-slate-600">
            {actionType === 'accept'
              ? 'Accepting this request will lock this time slot on your calendar and send an automated meeting confirmation to the mentee.'
              : 'Declining this request will release the proposal and notify the mentee to select an alternative slot.'}
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRequest(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={actionType === 'accept' ? 'primary' : 'danger'}
              onClick={handleConfirmAction}
              className={actionType === 'accept' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {actionType === 'accept' ? 'Confirm Session' : 'Decline Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
