import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';
import useToast from '../../utils/useToast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const resetToken = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState(null);

    if (newPassword.length < 8) {
      setErrorState('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorState('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({ token: resetToken, newPassword });
      setCompleted(true);
      toast.success('Your password has been successfully updated.', 'Password Reset Complete');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      if (err.isNetworkError) {
        setErrorState('Backend service is currently offline. Password reset requires active server connection.');
      } else {
        setErrorState(err.message || 'Invalid or expired password reset token.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create new password
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your new password must be at least 8 characters long.
        </p>
      </div>

      {errorState && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Reset Error</span>
            <span className="text-[11px] leading-relaxed block mt-0.5">{errorState}</span>
          </div>
        </div>
      )}

      {completed ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-emerald-900">Password reset successful</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Your password has been updated. Redirecting you to sign in...
          </p>
          <div className="pt-2">
            <Link to="/auth/login">
              <Button size="sm">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            required
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorState(null);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorState(null);
            }}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <div className="pt-2">
            <Button fullWidth size="md" type="submit" isLoading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
