import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign,
  Lock,
  ShieldCheck,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import { logout } from '../../store/slices/authSlice';
import { loadState, saveState } from '../../utils/storage';

const MENTOR_PREFERENCES_KEY = 'mp_mentor_preferences';

export default function MentorSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector((state) => state.auth.user);
  const payoutMethod = useSelector((state) => state.earnings.payoutMethod);

  const savedPrefs = loadState(MENTOR_PREFERENCES_KEY, {
    payoutSchedule: 'weekly',
    isListingsPaused: false,
  });

  const [payoutSchedule, setPayoutSchedule] = useState(savedPrefs.payoutSchedule || 'weekly');
  const [isListingsPaused, setIsListingsPaused] = useState(Boolean(savedPrefs.isListingsPaused));
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Danger modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSavePayoutSchedule = (e) => {
    e.preventDefault();
    setIsSavingSchedule(true);
    saveState(MENTOR_PREFERENCES_KEY, {
      payoutSchedule,
      isListingsPaused,
    });
    setTimeout(() => {
      setIsSavingSchedule(false);
      toast.success('Payout frequency preference saved.', 'Settings Updated');
    }, 400);
  };

  const handleTogglePauseListings = () => {
    const nextState = !isListingsPaused;
    setIsListingsPaused(nextState);
    saveState(MENTOR_PREFERENCES_KEY, {
      payoutSchedule,
      isListingsPaused: nextState,
    });
    if (nextState) {
      toast.warning('Mentor listings paused. You will not receive new booking proposals.');
    } else {
      toast.success('Mentor listings reactivated. Mentees can now book slots on your calendar.');
    }
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
        'Password updated successfully for your mentor account.',
        'Credentials Changed'
      );
    }, 500);
  };

  const handleConfirmCloseAccount = () => {
    if (deleteConfirmationText.trim().toLowerCase() !== 'close') {
      toast.warning('Please type "close" to confirm closing your mentor account.');
      return;
    }

    dispatch(logout());
    toast.info('Your mentor account has been closed.', 'Account Closed');
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Mentor Workspace Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure payout destination, schedule frequency, listings status, and security credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* Payout & Banking Destination */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Payout & Direct Deposit</h3>
            </div>
            <Badge variant={payoutMethod ? 'success' : 'slate'} size="sm">
              {payoutMethod ? 'Direct Deposit Linked' : 'No Account Linked'}
            </Badge>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2.5 border border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-500">Connected Bank Account:</span>
              <span className="font-mono font-bold text-slate-800">
                {payoutMethod
                  ? `${payoutMethod.bankName} (${payoutMethod.accountMasked || payoutMethod.accountNumber})`
                  : 'No payout account connected'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-500">Tax Compliance Status:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Electronic 1099 Form on File
              </span>
            </div>
            <div className="pt-1">
              <Link
                to="/mentor/earnings"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Manage Banking in Earnings Suite</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <form onSubmit={handleSavePayoutSchedule} className="space-y-4 pt-1">
            <div className="max-w-xs">
              <Select
                label="Payout Frequency"
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
                options={[
                  { value: 'weekly', label: 'Weekly (Every Friday)' },
                  { value: 'biweekly', label: 'Bi-Weekly (1st and 15th)' },
                  { value: 'monthly', label: 'Monthly (1st of month)' },
                  { value: 'manual', label: 'Manual On-Demand Transfer' },
                ]}
              />
            </div>

            <Button
              type="submit"
              size="sm"
              isLoading={isSavingSchedule}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Payout Preference
            </Button>
          </form>
        </Card>

        {/* Listings Availability Status */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              {isListingsPaused ? (
                <PauseCircle className="w-4 h-4 text-amber-500" />
              ) : (
                <PlayCircle className="w-4 h-4 text-emerald-600" />
              )}
              <h3 className="text-sm font-bold text-slate-900">Listings Visibility</h3>
            </div>
            <Badge variant={isListingsPaused ? 'slate' : 'success'} size="sm">
              {isListingsPaused ? 'Paused' : 'Active & Accepting'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isListingsPaused
              ? 'Your profile is currently hidden from public discovery. Existing scheduled sessions remain confirmed, but mentees cannot book new sessions.'
              : 'Your profile is publicly visible. Verified mentees can discover your profile and request 1-on-1 calls based on your availability schedule.'}
          </p>

          <Button
            size="sm"
            variant="outline"
            onClick={handleTogglePauseListings}
            className="text-xs"
          >
            {isListingsPaused ? 'Reactivate Profile Listings' : 'Pause Accepting New Mentees'}
          </Button>
        </Card>

        {/* Security / Password */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Account Security</h3>
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
                placeholder="Re-enter password"
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

        {/* Danger Zone */}
        <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold">Danger Zone</h3>
          </div>
          <p className="text-xs text-rose-700">
            Permanently close your mentor account, remove your public profile, and clear your offerings and reviews.
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
              Close Mentor Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Close Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Mentor Account Closure"
        description="Are you completely sure you want to close your mentor account?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Closing your account will cancel future sessions, deactivate published service offerings, and remove your coach profile from public listings ({user?.email || 'Current Mentor'}).
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type <strong className="text-rose-600">close</strong> to confirm:
            </label>
            <Input
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="close"
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
              onClick={handleConfirmCloseAccount}
            >
              Permanently Close Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
