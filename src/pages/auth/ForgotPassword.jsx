import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';
import useToast from '../../utils/useToast';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState(null);

    if (!email.trim()) {
      setErrorState('Please enter your account email address.');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSent(true);
      toast.success('Password reset instructions sent to your email.', 'Check Email');
    } catch (err) {
      if (err.isNetworkError) {
        setErrorState('Backend service is currently offline. When connected, password recovery links are delivered via email.');
      } else {
        setErrorState(err.message || 'Unable to process password reset.');
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
          Reset your password
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email address and we will dispatch a secure link to reset your credentials.
        </p>
      </div>

      {errorState && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Password Reset Notice</span>
            <span className="text-[11px] leading-relaxed block mt-0.5">{errorState}</span>
          </div>
        </div>
      )}

      {sent ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-emerald-900">Check your inbox</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
          </p>
          <div className="pt-2">
            <Link to="/auth/login">
              <Button size="sm" variant="outline">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email Address"
            type="email"
            placeholder="your.email@example.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorState(null);
            }}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <div className="pt-2">
            <Button fullWidth size="md" type="submit" isLoading={loading}>
              Send Reset Link
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
