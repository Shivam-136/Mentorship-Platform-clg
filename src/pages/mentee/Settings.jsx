import React, { useState } from 'react';
import { Lock, Bell, CreditCard, Shield, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

export default function MenteeSettings() {
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [calendarSync, setCalendarSync] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account preferences, notifications, and security credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security & Password */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" size="sm" variant="outline">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Preferences & Notifications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifications & Preferences</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <strong className="block text-xs text-slate-900">Session Reminders</strong>
                <span className="text-[11px] text-slate-500">Get notified 24 hours and 30 minutes before video calls</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <strong className="block text-xs text-slate-900">Google Calendar Sync</strong>
                <span className="text-[11px] text-slate-500">Automatically push scheduled sessions to your Google Calendar</span>
              </div>
              <input
                type="checkbox"
                checked={calendarSync}
                onChange={(e) => setCalendarSync(e.target.checked)}
                className="h-4 w-4 text-brand-600 rounded"
              />
            </label>
          </div>

          <Select
            label="Timezone"
            defaultValue="America/Los_Angeles"
            options={[
              { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada) - GMT-7' },
              { value: 'America/New_York', label: 'Eastern Time (US & Canada) - GMT-4' },
              { value: 'Europe/London', label: 'Greenwich Mean Time (London) - GMT+1' },
              { value: 'Asia/Kolkata', label: 'India Standard Time - GMT+5:30' }
            ]}
          />
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-3">
          <h3 className="text-sm font-bold text-rose-900">Danger Zone</h3>
          <p className="text-xs text-rose-700">
            Permanently delete your mentee account, bookings history, and personal roadmap.
          </p>
          <Button variant="danger" size="sm">
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  );
}
