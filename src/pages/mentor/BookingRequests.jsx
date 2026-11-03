import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inbox,
  CheckCircle,
  Calendar,
  Clock,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import {
  acceptBookingRequest,
  declineBookingRequest,
} from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export default function BookingRequests() {
  const dispatch = useDispatch();
  const toast = useToast();

  const requests = useSelector((state) => state.bookings.incomingRequests) || [];

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' | 'decline'
  const [declineReason, setDeclineReason] = useState('');

  const handleOpenActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setDeclineReason('');
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    if (actionType === 'accept') {
      dispatch(acceptBookingRequest(selectedRequest.id));
      dispatch(
        addNotification({
          title: 'Booking Confirmed',
          description: `You accepted session request for "${selectedRequest.topic}" with ${selectedRequest.menteeName}.`,
          type: 'booking',
        })
      );
      toast.success(
        `Session with ${selectedRequest.menteeName} accepted and scheduled!`,
        'Request Confirmed'
      );
    } else {
      dispatch(declineBookingRequest(selectedRequest.id));
      dispatch(
        addNotification({
          title: 'Booking Declined',
          description: `Declined session proposal from ${selectedRequest.menteeName}.`,
          type: 'booking',
        })
      );
      toast.info('Booking request has been declined.', 'Request Removed');
    }

    setSelectedRequest(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking Requests</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming mentorship proposals from mentees before confirming time slots on your calendar.
          </p>
        </div>

        <Badge variant={requests.length > 0 ? 'purple' : 'slate'} size="sm">
          {requests.length} Pending Proposal{requests.length === 1 ? '' : 's'}
        </Badge>
      </div>

      {/* Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-6 space-y-4 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar src={req.avatar} name={req.menteeName || 'Mentee'} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{req.menteeName}</h4>
                    <p className="text-xs text-slate-500">{req.menteeRole || 'Mentee Candidate'}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-slate-900">
                    ${req.fee || req.price || 100}
                  </span>
                  <span className="text-xs text-slate-500 block">Session Fee</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                <div className="flex items-center gap-3 flex-wrap text-slate-700">
                  <span className="font-bold text-slate-900">{req.topic}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> {req.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {req.time}
                  </span>
                  {req.duration && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500">{req.duration}</span>
                    </>
                  )}
                </div>

                {req.brief && (
                  <p className="text-slate-600 leading-relaxed pt-1">
                    <strong className="text-slate-800">Mentee Objectives / Questions:</strong> "{req.brief}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenActionModal(req, 'decline')}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Decline Request
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenActionModal(req, 'accept')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 shadow-xs"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Confirm & Schedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No booking requests"
          description="You're all caught up! New requests will notify you immediately when mentees book sessions."
        />
      )}

      {/* Confirmation Dialog */}
      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={
          actionType === 'accept'
            ? 'Accept & Schedule Session'
            : 'Decline Session Request'
        }
        description={
          actionType === 'accept'
            ? `Confirm 1-on-1 session with ${selectedRequest?.menteeName}`
            : `Decline mentorship proposal from ${selectedRequest?.menteeName}`
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 block">{selectedRequest?.topic}</span>
            <p className="text-slate-600">
              Mentee: <strong>{selectedRequest?.menteeName}</strong>
            </p>
            <p className="text-slate-500">
              Date & Time: {selectedRequest?.date} at {selectedRequest?.time}
            </p>
          </div>

          {actionType === 'decline' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Declining (Optional feedback for mentee)
              </label>
              <textarea
                rows={2}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Schedule conflict with existing client commitment..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-rose-500"
              />
            </div>
          )}

          <p className="text-slate-600">
            {actionType === 'accept'
              ? 'Accepting will book this slot on your calendar and dispatch a confirmed meeting invite to the mentee.'
              : 'Declining will release this proposal and alert the mentee so they can select a different opening.'}
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
              {actionType === 'accept' ? 'Confirm Booking' : 'Decline Proposal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
