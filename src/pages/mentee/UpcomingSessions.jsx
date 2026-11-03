import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  CalendarCheck,
} from 'lucide-react';
import SessionCard from '../../components/cards/SessionCard';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import useToast from '../../utils/useToast';
import {
  cancelBooking,
  rescheduleBooking,
} from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

const RESCHEDULE_TIMES = [
  '09:00 AM PST',
  '11:00 AM PST',
  '02:00 PM PST',
  '04:30 PM PST',
  '06:00 PM PST',
];

export default function UpcomingSessions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const allBookings = useSelector((state) => state.bookings.bookings) || [];

  // Filter and sort upcoming
  const upcomingSessions = allBookings
    .filter(
      (b) =>
        b.status === 'Upcoming' ||
        b.status === 'Confirmed' ||
        b.status === 'Pending Confirmation'
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Modal states
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalType, setModalType] = useState(null); // 'join' | 'reschedule' | 'cancel'

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState(RESCHEDULE_TIMES[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Cancel state
  const [cancelReason, setCancelReason] = useState('');

  // Handlers
  const handleOpenJoin = (session) => {
    setSelectedSession(session);
    setModalType('join');
  };

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
        title: 'Reschedule Request Sent',
        description: `Requested new time for session with ${selectedSession.mentorName}.`,
        type: 'booking',
      })
    );

    toast.success(
      'Reschedule request sent to mentor. Status updated.',
      'Request Registered'
    );
    setModalType(null);
    setSelectedSession(null);
  };

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
        title: 'Session Cancelled',
        description: `Your upcoming session with ${selectedSession.mentorName} on ${selectedSession.date} was cancelled.`,
        type: 'booking',
      })
    );
    toast.info('Session cancelled successfully.', 'Booking Cancelled');
    setModalType(null);
    setSelectedSession(null);
  };

  const nextSession = upcomingSessions[0] || null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Sessions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed video calls. Meeting rooms open 5 minutes prior to the scheduled start time.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
      </div>

      {/* Featured Next Session Banner if exists */}
      {nextSession && (
        <Card className="p-6 bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white border-none shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm" className="bg-brand-500/20 text-brand-200 border-brand-400/30">
                  Next Up
                </Badge>
                <span className="text-xs text-brand-200 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {nextSession.date} at {nextSession.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {nextSession.topic}
              </h3>
              <p className="text-xs text-slate-300">
                1-on-1 Strategy Session with <strong className="text-white">{nextSession.mentorName}</strong> ({nextSession.mentorTitle || 'Senior Mentor'})
              </p>
            </div>

            <Button
              size="md"
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm shrink-0 self-start sm:self-center"
              onClick={() => handleOpenJoin(nextSession)}
              leftIcon={<Video className="w-4 h-4 text-brand-600" />}
            >
              Enter Session Room
            </Button>
          </div>
        </Card>
      )}

      {/* Sessions List */}
      {upcomingSessions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              <strong>{upcomingSessions.length}</strong> upcoming session{upcomingSessions.length === 1 ? '' : 's'} on schedule
            </span>
          </div>

          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleOpenJoin}
                onReschedule={handleOpenReschedule}
                onCancel={handleOpenCancel}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No upcoming sessions"
          description="You don't have any mentorship sessions scheduled in the near future."
          actionLabel="Find a Mentor"
          onAction={() => navigate('/mentee/mentors')}
        />
      )}

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
              <CalendarCheck className="w-4 h-4 text-brand-600" />
              <span>Session Scheduled</span>
            </div>
            <p className="text-xs text-brand-800">
              Date: <strong>{selectedSession?.date}</strong> at{' '}
              <strong>{selectedSession?.time}</strong> (Duration: {selectedSession?.duration || '60 min'}).
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Pre-Call Checklist:
            </span>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Test your microphone and webcam in your browser</li>
              <li>Prepare 2-3 specific questions or discussion points</li>
              <li>Close extraneous background applications for optimal audio quality</li>
            </ul>
          </div>

          {selectedSession?.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
              <strong className="block text-slate-800 mb-0.5">Your Session Notes:</strong>
              <p>{selectedSession.notes}</p>
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic">
            Note: Mentors join promptly at the scheduled start time. Video streams are powered via standard WebRTC rooms.
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
                  Launch Meeting Room
                </Button>
              </a>
            )}
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
              Reason / Message for Mentor:
            </label>
            <textarea
              rows={2}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              placeholder="e.g. Schedule conflict with release sprint..."
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

      {/* Cancel Modal */}
      <Modal
        isOpen={modalType === 'cancel'}
        onClose={() => setModalType(null)}
        title="Cancel Upcoming Session?"
        description="Are you sure you want to cancel this booking?"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-800">
            <span className="font-bold block">Cancellation Notice</span>
            <p>
              Cancelling this session with <strong>{selectedSession?.mentorName}</strong> will release the time slot ({selectedSession?.date} at {selectedSession?.time}).
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
              placeholder="e.g. Schedule conflict or need more time to prepare materials..."
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
    </div>
  );
}
