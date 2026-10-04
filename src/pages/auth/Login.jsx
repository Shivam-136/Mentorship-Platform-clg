import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('mentee'); // 'mentee' | 'mentor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login and redirect according to role
    setTimeout(() => {
      setLoading(false);
      if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/mentee/dashboard');
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to your MentorMatch account to access your sessions and workspace.
        </p>
      </div>

      {/* Quick Role Selection for login preview */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center">
        <button
          type="button"
          onClick={() => setRole('mentee')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === 'mentee'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign in as Mentee
        </button>
        <button
          type="button"
          onClick={() => setRole('mentor')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            role === 'mentor'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign in as Mentor
        </button>
      </div>

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

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-700">
            Remember this device for 30 days
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          size="md"
          isLoading={loading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-sm mt-2"
        >
          Sign In to {role === 'mentor' ? 'Mentor Workspace' : 'Mentee Portal'}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Don’t have an account?{' '}
        <Link to="/auth/register" className="font-bold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </div>
    </div>
  );
}
