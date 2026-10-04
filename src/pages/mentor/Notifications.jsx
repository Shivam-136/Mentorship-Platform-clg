import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function MentorNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentor Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Booking alerts, schedule changes, and payout notifications.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-rose-600"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 transition flex items-start gap-4 ${
                notif.unread ? 'bg-purple-50/20 border-purple-200' : 'bg-white'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[11px] text-slate-400">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.description}</p>
              </div>
              {notif.unread && (
                <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 self-center" />
              )}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="You don't have any unread notifications."
        />
      )}
    </div>
  );
}
