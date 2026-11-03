import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import { logout } from '../../store/slices/authSlice';
import { loadState, saveState } from '../../utils/storage';

const PREFERENCES_STORAGE_KEY = 'mp_mentee_preferences';

export default function MenteeSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.auth.user);

  // Preferences from storage
  const savedPrefs = loadState(PREFERENCES_STORAGE_KEY, {
    emailAlerts: true,
    calendarSync: true,
    timezone: 'America/Los_Angeles',
  });

  const [preferences, setPreferences] = useState(savedPrefs);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Danger modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    saveState(PREFERENCES_STORAGE_KEY, preferences);
    setTimeout(() => {
      setIsSavingPrefs(false);
      toast.success('Your preferences have been saved.', 'Settings Updated');
    }, 400);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.warning('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      toast.warning('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(
        'Password updated successfully for this session.',
        'Security Credentials Changed'
      );
    }, 600);
  };

  const handleConfirmDeleteAccount = () => {
    if (deleteConfirmationText.trim().toLowerCase() !== 'delete') {
      toast.warning('Please type "delete" to confirm account termination.');
      return;
    }

    dispatch(logout());
    toast.info('Your account has been deleted.', 'Account Closed');
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your account security credentials, notifications, and time zone preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security & Password */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Min 8 characters"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-type new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                variant="outline"
                isLoading={isUpdatingPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Preferences & Notifications */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifications & Calendar Sync</h3>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer">
                <div>
                  <strong className="block text-xs text-slate-900">Session Reminders</strong>
                  <span className="text-[11px] text-slate-500">
                    Receive email notifications 24 hours and 30 minutes before video calls
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailAlerts}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailAlerts: e.target.checked })
                  }
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer">
                <div>
                  <strong className="block text-xs text-slate-900">Google Calendar Sync</strong>
                  <span className="text-[11px] text-slate-500">
                    Push confirmed sessions directly to your connected calendar
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.calendarSync}
                  onChange={(e) =>
                    setPreferences({ ...preferences, calendarSync: e.target.checked })
                  }
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 rounded"
                />
              </label>
            </div>

            <Select
              label="Default Timezone"
              value={preferences.timezone}
              onChange={(e) =>
                setPreferences({ ...preferences, timezone: e.target.value })
              }
              options={[
                { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada) - GMT-7' },
                { value: 'America/Denver', label: 'Mountain Time (US & Canada) - GMT-6' },
                { value: 'America/Chicago', label: 'Central Time (US & Canada) - GMT-5' },
                { value: 'America/New_York', label: 'Eastern Time (US & Canada) - GMT-4' },
                { value: 'Europe/London', label: 'Greenwich Mean Time (London) - GMT+1' },
                { value: 'Europe/Berlin', label: 'Central European Time - GMT+2' },
                { value: 'Asia/Kolkata', label: 'India Standard Time - GMT+5:30' },
                { value: 'Asia/Tokyo', label: 'Japan Standard Time - GMT+9' },
              ]}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="sm"
                isLoading={isSavingPrefs}
              >
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold">Danger Zone</h3>
          </div>
          <p className="text-xs text-rose-700">
            Permanently delete your mentee account, booking history, submitted reviews, and career roadmaps. This action cannot be reversed.
          </p>
          <div className="pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDeleteConfirmationText('');
                setIsDeleteModalOpen(true);
              }}
            >
              Delete Mentee Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Termination"
        description="Are you completely sure you want to delete your account?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Deleting your account will erase your active profile ({user?.email || 'Current Mentee'}), cancel upcoming sessions, and delete your progress data.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type <strong className="text-rose-600">delete</strong> to confirm:
            </label>
            <Input
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="delete"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDeleteAccount}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
