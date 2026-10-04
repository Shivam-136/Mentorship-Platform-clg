import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  // Role selector: 'mentee' | 'mentor'
  const [role, setRole] = useState('mentee');
  const [loading, setLoading] = useState(false);

  // Mentee form state
  const [menteeData, setMenteeData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillsInterests: '',
    careerGoal: ''
  });

  // Mentor form state
  const [mentorData, setMentorData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    professionalTitle: '',
    skills: '',
    experience: '',
    bio: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/mentee/dashboard');
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Choose how you would like to participate in the MentorMatch community.
        </p>
      </div>

      {/* Role Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole('mentee')}
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
            <span className="text-[11px] text-slate-500">I want to get guided</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole('mentor')}
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
            <span className="text-xs font-bold block">Continue as Mentor</span>
            <span className="text-[11px] text-slate-500">I want to coach & earn</span>
          </div>
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {role === 'mentee' ? (
          /* Mentee Registration Fields */
          <>
            <Input
              label="Full Name"
              placeholder="e.g. Jordan Hayes"
              required
              value={menteeData.fullName}
              onChange={(e) => setMenteeData({ ...menteeData, fullName: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jordan@example.com"
              required
              value={menteeData.email}
              onChange={(e) => setMenteeData({ ...menteeData, email: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={menteeData.password}
                onChange={(e) => setMenteeData({ ...menteeData, password: e.target.value })}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                value={menteeData.confirmPassword}
                onChange={(e) => setMenteeData({ ...menteeData, confirmPassword: e.target.value })}
              />
            </div>

            <Input
              label="Skills / Interests"
              placeholder="e.g. Distributed Systems, React, System Design"
              helperText="Comma separated topics you want to learn"
              required
              value={menteeData.skillsInterests}
              onChange={(e) => setMenteeData({ ...menteeData, skillsInterests: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Career Goal <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Transition from Senior to Staff Engineer in the next 12 months"
                value={menteeData.careerGoal}
                onChange={(e) => setMenteeData({ ...menteeData, careerGoal: e.target.value })}
                className="block w-full rounded-lg text-sm border border-slate-300 p-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
          </>
        ) : (
          /* Mentor Registration Fields */
          <>
            <Input
              label="Full Name"
              placeholder="e.g. Dr. Sarah Jenkins"
              required
              value={mentorData.fullName}
              onChange={(e) => setMentorData({ ...mentorData, fullName: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="sarah@example.com"
              required
              value={mentorData.email}
              onChange={(e) => setMentorData({ ...mentorData, email: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={mentorData.password}
                onChange={(e) => setMentorData({ ...mentorData, password: e.target.value })}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                value={mentorData.confirmPassword}
                onChange={(e) => setMentorData({ ...mentorData, confirmPassword: e.target.value })}
              />
            </div>

            <Input
              label="Professional Title"
              placeholder="e.g. Principal Engineer at Stripe"
              required
              value={mentorData.professionalTitle}
              onChange={(e) => setMentorData({ ...mentorData, professionalTitle: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Skills / Specialties"
                placeholder="e.g. Go, Kubernetes, System Design"
                required
                value={mentorData.skills}
                onChange={(e) => setMentorData({ ...mentorData, skills: e.target.value })}
              />
              <Input
                label="Experience"
                placeholder="e.g. 10+ years"
                required
                value={mentorData.experience}
                onChange={(e) => setMentorData({ ...mentorData, experience: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Bio & Mentoring Philosophy <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Brief summary of your background, companies worked at, and how you mentor..."
                value={mentorData.bio}
                onChange={(e) => setMentorData({ ...mentorData, bio: e.target.value })}
                className="block w-full rounded-lg text-sm border border-slate-300 p-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </div>
          </>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="md"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-sm"
          >
            Create {role === 'mentor' ? 'Mentor Profile' : 'Mentee Account'}
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-bold text-brand-600 hover:text-brand-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
