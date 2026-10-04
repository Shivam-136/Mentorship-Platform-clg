import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
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
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      {sent ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-emerald-900">Check your email</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            We’ve sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folder.
          </p>
          <div className="pt-2">
            <Link to="/auth/reset-password">
              <Button size="sm" variant="subtleBrand">
                Simulate Reset Password Link
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Email"
            type="email"
            placeholder="your.email@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            isLoading={loading}
            className="shadow-sm"
          >
            Send Reset Instructions
          </Button>
        </form>
      )}
    </div>
  );
}
