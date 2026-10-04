import React, { useState } from 'react';
import { DollarSign, Calendar, Lock, ShieldCheck, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function MentorSettings() {
  const [saved, setSaved] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentor Workspace Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure payout destination, calendar syncing, and security preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Payout & Banking */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Payout & Stripe Connect</h3>
            </div>
            <Badge variant="success" size="sm" dot>
              Stripe Active
            </Badge>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Connected Bank Account:</span>
              <span className="font-mono font-bold text-slate-800">Chase Checking (•••• 8492)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax Form (W-9 / 1099):</span>
              <span className="text-emerald-700 font-semibold">Verified on File</span>
            </div>
          </div>

          <div className="w-64">
            <Select
              label="Payout Frequency"
              value={payoutSchedule}
              onChange={(e) => setPayoutSchedule(e.target.value)}
              options={[
                { value: 'weekly', label: 'Weekly (Every Friday)' },
                { value: 'monthly', label: 'Monthly (1st of month)' },
                { value: 'manual', label: 'Manual Payout' }
              ]}
            />
          </div>
        </Card>

        {/* Security / Password */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Account Security</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
            </div>
            <div className="pt-2 flex items-center justify-between">
              {saved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Password updated!
                </span>
              )}
              <Button type="submit" size="sm" variant="outline" className="ml-auto">
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-3">
          <h3 className="text-sm font-bold text-rose-900">Pause or Close Mentor Account</h3>
          <p className="text-xs text-rose-700">
            Temporarily pause accepting new mentees, or completely close your mentor profile.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Pause Listings
            </Button>
            <Button variant="danger" size="sm">
              Deactivate Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
