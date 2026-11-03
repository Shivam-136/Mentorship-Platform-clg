import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  CheckCheck,
  Calendar,
  Star,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import useToast from '../../utils/useToast';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from '../../store/slices/notificationSlice';

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp; // If it was already a relative string

    const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} min ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hr ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return timestamp;
  }
};

export default function Notifications() {
  const dispatch = useDispatch();
  const toast = useToast();

  const notifications = useSelector((state) => state.notifications.notifications);

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread'

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const displayedNotifications = useMemo(() => {
    if (filterTab === 'unread') {
      return notifications.filter((n) => n.unread);
    }
    return notifications;
  }, [notifications, filterTab]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
    toast.info('All notifications marked as read.');
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    toast.info('Notification feed cleared.');
  };

  const handleNotificationClick = (notif) => {
    if (notif.unread) {
      dispatch(markAsRead(notif.id));
    }
  };

  const handleDeleteNotification = (e, notifId) => {
    e.stopPropagation();
    dispatch(removeNotification(notifId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-brand-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'goal':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay updated with real-time session confirmations, mentor feedback, and reminders.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'unread'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      )}

      {/* Notifications List */}
      {displayedNotifications.length > 0 ? (
        <div className="space-y-3">
          {displayedNotifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition flex items-start gap-3.5 cursor-pointer hover:shadow-xs ${
                notif.unread
                  ? 'bg-brand-50/20 border-brand-200'
                  : 'bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-xs ${
                        notif.unread
                          ? 'font-bold text-slate-900'
                          : 'font-semibold text-slate-700'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {formatTime(notif.timestamp || notif.time)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pr-6">
                  {notif.description}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => handleDeleteNotification(e, notif.id)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition shrink-0 self-center"
                title="Dismiss notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={filterTab === 'unread' ? 'No unread notifications' : 'All caught up!'}
          description={
            filterTab === 'unread'
              ? 'You have read all active notifications.'
              : 'New session reminders, booking confirmations, and feedback alerts will show here.'
          }
          actionLabel={filterTab === 'unread' ? 'View All Notifications' : undefined}
          onAction={filterTab === 'unread' ? () => setFilterTab('all') : undefined}
        />
      )}
    </div>
  );
}
