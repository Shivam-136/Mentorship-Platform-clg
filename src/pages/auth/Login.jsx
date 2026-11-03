import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, AlertCircle, Info } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { authStart, authSuccess, authFailure } from '../../store/slices/authSlice';
import useToast from '../../utils/useToast';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [role, setRole] = useState('mentee'); // 'mentee' | 'mentor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState(null);

    if (!email || !password) {
      setErrorState('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      dispatch(authStart());

      // Attempt genuine backend API call
      const response = await authService.login({ email, password, role });

      dispatch(
        authSuccess({
          user: response.user,
          token: response.token,
          role: response.user?.role || role,
        })
      );

      toast.success(`Welcome back, ${response.user?.name || 'User'}!`, 'Signed In');

      if ((response.user?.role || role) === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/mentee/dashboard');
      }
    } catch (err) {
      dispatch(authFailure(err.message));
      setErrorState(
        err.isNetworkError
          ? 'Backend server is not running or unreachable. Ensure the API server is active on localhost.'
          : err.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Explicit, transparent offline client session mode for reviewing frontend dashboards
  const handleOfflineClientSession = () => {
    const localUser = {
      id: `usr-${Date.now()}`,
      name: email ? email.split('@')[0] : (role === 'mentor' ? 'Verified Mentor' : 'Active Mentee'),
      email: email || `${role}@example.com`,
      role: role,
      roleTitle: role === 'mentor' ? 'Staff Mentor' : 'Software Engineer',
      isLocalDraft: true,
    };

    dispatch(
      authSuccess({
        user: localUser,
        token: null, // No fake token
        role: role,
      })
    );

    toast.info(`Entered ${role === 'mentor' ? 'Mentor' : 'Mentee'} workspace in client review mode.`, 'Client Session Active');

    if (role === 'mentor') {
      navigate('/mentor/dashboard');
    } else {
      navigate('/mentee/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to your MentorMatch account to access your workspace and 1-on-1 sessions.
        </p>
      </div>

      {/* Role Selection Toggle */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center">
        <button
          type="button"
          onClick={() => {
            setRole('mentee');
            setErrorState(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === 'mentee'
              ? 'bg-white text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign in as Mentee
        </button>
        <button
          type="button"
          onClick={() => {
            setRole('mentor');
            setErrorState(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === 'mentor'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign in as Mentor
        </button>
      </div>

      {/* Error Banner */}
      {errorState && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Authentication Notice</span>
            <span className="text-[11px] leading-relaxed block mt-0.5">{errorState}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button fullWidth size="md" type="submit" isLoading={loading}>
            Sign In with Account
          </Button>
        </div>
      </form>

      {/* Transparent Offline Development Fallback */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-3.5 h-3.5 text-brand-600" />
          <span>Client Review Mode</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          The backend API is not yet running. You can activate a genuine local client session to evaluate dashboard workflows and UI interactions.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          fullWidth
          onClick={handleOfflineClientSession}
          className="text-xs bg-white"
        >
          Enter {role === 'mentor' ? 'Mentor' : 'Mentee'} Portal (Client Session)
        </Button>
      </div>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/auth/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
