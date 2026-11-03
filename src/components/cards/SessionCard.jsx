import React from 'react';
import { Calendar, Clock, Video, FileText } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getStatusColor } from '../../utils/helpers';

export default function SessionCard({
  session,
  isMentorView = false,
  onJoin,
  onReschedule,
  onCancel,
  onLeaveReview,
  onViewNotes,
}) {
  const isCompleted = session.status?.toLowerCase() === 'completed';
  const isUpcoming = session.status?.toLowerCase() === 'upcoming' || session.status?.toLowerCase() === 'confirmed';

  return (
    <Card hoverable className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex flex-col items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900">{session.topic}</h4>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>With <strong>{isMentorView ? session.menteeName : session.mentorName}</strong></span>
            <span>•</span>
            <span className="text-slate-500">{isMentorView ? session.menteeRole : session.mentorTitle}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              {session.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {session.time}
            </span>
            {session.price && (
              <span className="font-semibold text-slate-800">
                ${session.price}
              </span>
            )}
          </div>

          {session.notes && (
            <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md mt-2 max-w-xl">
              <strong>Notes:</strong> {session.notes}
            </p>
          )}

          {session.ratingGiven && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-md mt-2">
              ⭐ <strong>Review left:</strong> "{session.feedbackGiven}"
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0 md:self-center border-t md:border-t-0 pt-3 md:pt-0">
        {isUpcoming && (
          <>
            {onJoin ? (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Video className="w-4 h-4" />}
                className="text-xs shadow-sm"
                onClick={() => onJoin(session)}
              >
                Join Meeting
              </Button>
            ) : (
              <a
                href={session.meetUrl || '#'}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Video className="w-4 h-4" />}
                  className="text-xs shadow-sm"
                >
                  Join Meeting
                </Button>
              </a>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReschedule && onReschedule(session)}
              className="text-xs"
            >
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel && onCancel(session)}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Cancel
            </Button>
          </>
        )}

        {isCompleted && !session.ratingGiven && !isMentorView && (
          <Button
            size="sm"
            variant="subtleBrand"
            onClick={() => onLeaveReview && onLeaveReview(session)}
            className="text-xs"
          >
            Leave Review
          </Button>
        )}

        {isCompleted && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            className="text-xs"
            onClick={() => onViewNotes && onViewNotes(session)}
          >
            View Notes
          </Button>
        )}
      </div>
    </Card>
  );
}
