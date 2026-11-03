import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Clock,
  Calendar,
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

export default function MentorUpcomingSessions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const allBookings = useSelector((state) => state.bookings.bookings);

  const upcomingSessions = useMemo(() => {
    return allBookings
      .filter(
        (b) =>
          b.status === 'Upcoming' ||
          b.status === 'Confirmed' ||
          b.status === 'Pending Confirmation'
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allBookings]);

  // Modals state
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalType, setModalType] = useState(null); // 'join' | 'notes' | 'reschedule' | 'cancel'

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState(RESCHEDULE_TIMES[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Cancel state
  const [cancelReason, setCancelReason] = useState('');

  const handleOpenJoin = (session) => {
    setSelectedSession(session);
    setModalType('join');
  };

  const handleOpenNotes = (session) => {
    setSelectedSession(session);
    setModalType('notes');
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
      toast.warning('Please specify a proposed new date.');
      return;
    }

    dispatch(
      rescheduleBooking({
        id: selectedSession.id,
        newDate: rescheduleDate,
        newTime: rescheduleTime,
        note: rescheduleReason.trim() || 'Mentor requested schedule shift.',
      })
    );

    dispatch(
      addNotification({
        title: 'Session Rescheduled',
        description: `Proposed new time for session with ${selectedSession.menteeName}.`,
        type: 'booking',
      })
    );

    toast.success('Reschedule notice dispatched to mentee.', 'Session Rescheduled');
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
        description: `Cancelled session with ${selectedSession.menteeName} on ${selectedSession.date}.`,
        type: 'booking',
      })
    );

    toast.info('Session cancelled.', 'Booking Cancelled');
    setModalType(null);
    setSelectedSession(null);
  };

  const nextSession = upcomingSessions[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Upcoming Mentoring Sessions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1-on-1 strategy calls and mock interviews you are scheduled to host.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-800 font-semibold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Local Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
      </div>

      {/* Featured Next Session */}
      {nextSession && (
        <Card className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border-none shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  variant="purple"
                  size="sm"
                  className="bg-purple-500/20 text-purple-200 border-purple-400/30"
                >
                  Next Hosting Call
                </Badge>
                <span className="text-xs text-purple-200 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {nextSession.date} at {nextSession.time}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {nextSession.topic}
              </h3>
              <p className="text-xs text-slate-300">
                With mentee <strong className="text-white">{nextSession.menteeName}</strong> ({nextSession.menteeRole || 'Mentee'})
              </p>
            </div>

            <Button
              size="md"
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm shrink-0 self-start sm:self-center"
              onClick={() => handleOpenJoin(nextSession)}
              leftIcon={<Video className="w-4 h-4 text-purple-600" />}
            >
              Enter Host Room
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
                isMentorView={true}
                onJoin={handleOpenJoin}
                onReschedule={handleOpenReschedule}
                onCancel={handleOpenCancel}
                onViewNotes={handleOpenNotes}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No upcoming mentoring sessions"
          description="Your confirmed sessions will appear here once mentees book slots or you accept booking requests."
          actionLabel="Check Availability"
          onAction={() => navigate('/mentor/availability')}
        />
      )}

      {/* Host Room Modal */}
      <Modal
        isOpen={modalType === 'join'}
        onClose={() => setModalType(null)}
        title="Session Meeting Room"
        description={`${selectedSession?.topic} with ${selectedSession?.menteeName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-purple-900">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CalendarCheck className="w-4 h-4 text-purple-600" />
              <span>Session Scheduled</span>
            </div>
            <p className="text-xs text-purple-800">
              Date: <strong>{selectedSession?.date}</strong> at{' '}
              <strong>{selectedSession?.time}</strong> (Duration: {selectedSession?.duration || '60 mins'}).
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              Host Prep Checklist:
            </span>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Review mentee background notes and submitted goals</li>
              <li>Have your architecture canvas, slides, or shared code editor open</li>
              <li>Ensure good lighting and audio input</li>
            </ul>
          </div>

          {selectedSession?.notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
              <strong className="block text-slate-800 mb-0.5">Mentee Request Notes:</strong>
              <p>{selectedSession.notes}</p>
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic">
            Note: Meeting rooms are hosted via secure encrypted WebRTC. Join up to 5 minutes prior to the start time.
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
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Launch Meeting Room
                </Button>
              </a>
            )}
          </div>
        </div>
      </Modal>

      {/* View Notes Modal */}
      <Modal
        isOpen={modalType === 'notes'}
        onClose={() => setModalType(null)}
        title="Mentee Context & Session Notes"
        description={`${selectedSession?.topic} with ${selectedSession?.menteeName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-bold text-slate-900 block">Session Focus & Brief:</span>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {selectedSession?.notes || 'No prep notes were submitted for this session.'}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="outline" onClick={() => setModalType(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalType === 'reschedule'}
        onClose={() => setModalType(null)}
        title="Reschedule Mentoring Call"
        description={`Propose a new date or time with ${selectedSession?.menteeName}`}
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
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Time Slot
              </label>
              <select
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-purple-500 bg-white"
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
              Reason / Message for Mentee
            </label>
            <textarea
              rows={2}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-purple-500"
              placeholder="e.g. Schedule adjustment required due to on-call incident..."
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
            <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
              Submit Reschedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={modalType === 'cancel'}
        onClose={() => setModalType(null)}
        title="Cancel Mentoring Session?"
        description="Are you sure you want to cancel this booking?"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-800">
            <span className="font-bold block">Cancellation Alert</span>
            <p>
              Cancelling this session with <strong>{selectedSession?.menteeName}</strong> ({selectedSession?.date} at {selectedSession?.time}) will release the appointment and automatically issue a full refund to the mentee.
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
              placeholder="e.g. Unforeseen personal emergency..."
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
