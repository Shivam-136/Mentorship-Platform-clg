import React, { useState } from 'react';
import { User, Mail, Briefcase, Target, Sparkles, Check, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function MenteeProfile() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jordan Hayes',
    email: 'jordan.hayes@example.com',
    role: 'Software Engineer',
    company: 'Fintech Scaleup',
    careerGoal: 'Transition to Staff Engineer in 2026 with deep expertise in distributed storage systems.',
    skills: 'Distributed Systems, System Design, Go, Kubernetes, Cloud Architecture',
    bio: 'Software engineer with 4 years of experience building payment pipelines. Eager to master high-availability distributed systems and improve my technical executive presence.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentee Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          This context helps mentors tailor their sessions specifically for your goals.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              name={profile.name}
              size="2xl"
              status="online"
            />
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
              <p className="text-xs text-slate-500">{profile.role} at {profile.company}</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                Change Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Title"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            />
            <Input
              label="Company / Organization"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Primary Career Goal
            </label>
            <textarea
              rows={2}
              value={profile.careerGoal}
              onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
              className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <Input
            label="Target Skills & Topics"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            helperText="Separate topics with commas"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Personal Bio / Context
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile changes saved successfully!
              </span>
            )}
            <Button
              type="submit"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
              className="ml-auto"
            >
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
