import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, Shield, CheckCircle2, AlertCircle, Info, Lock, Mail } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { authStart, authSuccess, authFailure } from '../../store/slices/authSlice';
import useToast from '../../utils/useToast';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [role, setRole] = useState('mentee'); // 'mentee' | 'mentor'
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    company: '',
    experience: '5+ years',
    skills: '',
    careerGoal: '',
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorState(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setErrorState('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorState('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorState('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      dispatch(authStart());

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        title: formData.title.trim(),
        company: formData.company.trim(),
        experience: formData.experience,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        careerGoal: formData.careerGoal.trim(),
      };

      const response = await authService.register(payload);

      dispatch(
        authSuccess({
          user: response.user,
          token: response.token,
          role: response.user?.role || role,
        })
      );

      toast.success('Your account has been created successfully!', 'Welcome to MentorMatch');

      if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/mentee/dashboard');
      }
    } catch (err) {
      dispatch(authFailure(err.message));
      setErrorState(
        err.isNetworkError
          ? 'Backend service is not running or unreachable. Ensure the API server is active on localhost.'
          : err.message || 'Registration failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Explicit, transparent offline client session mode for reviewing frontend dashboards
  const handleOfflineClientSession = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorState('Please enter your full name and email address above first.');
      return;
    }

    const localUser = {
      id: `usr-${Date.now()}`,
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      role: role,
      roleTitle: formData.title.trim() || (role === 'mentor' ? 'Verified Mentor' : 'Software Engineer'),
      company: formData.company.trim() || 'Independent',
      bio: formData.careerGoal.trim() || '',
      isLocalDraft: true,
    };

    dispatch(
      authSuccess({
        user: localUser,
        token: null, // No fake token
        role: role,
      })
    );

    toast.info(`Created local ${role} profile for frontend evaluation.`, 'Client Profile Active');

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
          Create your account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your account type to access personalized 1-on-1 mentorship.
        </p>
      </div>

      {/* Role Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setRole('mentee');
            setErrorState(null);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            role === 'mentee'
              ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <User className={`w-5 h-5 ${role === 'mentee' ? 'text-brand-600' : 'text-slate-400'}`} />
            {role === 'mentee' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
          </div>
          <div>
            <span className="text-xs font-bold block">Continue as Mentee</span>
            <span className="text-[11px] text-slate-500">I want 1-on-1 guidance</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole('mentor');
            setErrorState(null);
          }}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            role === 'mentor'
              ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-2 ring-purple-500/20'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Shield className={`w-5 h-5 ${role === 'mentor' ? 'text-purple-600' : 'text-slate-400'}`} />
            {role === 'mentor' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
          </div>
          <div>
            <span className="text-xs font-bold block">Apply as Mentor</span>
            <span className="text-[11px] text-slate-500">I want to coach & earn</span>
          </div>
        </button>
      </div>

      {/* Error Banner */}
      {errorState && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Registration Notice</span>
            <span className="text-[11px] leading-relaxed block mt-0.5">{errorState}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Legal Name"
          placeholder="e.g. Alex Morgan"
          required
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="alex.morgan@company.com"
          required
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="Min. 6 characters"
            required
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />
        </div>

        {role === 'mentor' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Professional Title"
                placeholder="e.g. Principal Engineer"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
              <Input
                label="Current / Former Company"
                placeholder="e.g. Stripe, OpenAI, Meta"
                required
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
              />
            </div>
            <Input
              label="Primary Specialties (Comma-separated)"
              placeholder="e.g. System Design, Distributed Systems, Go"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
            />
          </>
        ) : (
          <Input
            label="Primary Career Goal"
            placeholder="e.g. Transition to Staff Engineer in 2026"
            value={formData.careerGoal}
            onChange={(e) => handleChange('careerGoal', e.target.value)}
          />
        )}

        <div className="pt-2">
          <Button fullWidth size="md" type="submit" isLoading={loading}>
            Create {role === 'mentor' ? 'Mentor Application' : 'Mentee Account'}
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
          The backend API is not yet running. Fill in your details above and click below to initialize a client session with your exact entered profile.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          fullWidth
          onClick={handleOfflineClientSession}
          className="text-xs bg-white"
        >
          Initialize Local {role === 'mentor' ? 'Mentor' : 'Mentee'} Profile
        </Button>
      </div>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
