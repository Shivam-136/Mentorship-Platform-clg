import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Save, Check, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function MentorProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    title: 'Principal Engineer at Stripe',
    company: 'Stripe',
    hourlyRate: 120,
    experience: '12+ years',
    location: 'San Francisco, CA (PST)',
    skills: 'System Design, Cloud Architecture, Distributed Systems, Career Growth, Go, Kubernetes',
    bio: 'Ex-Google tech lead specializing in scalable distributed systems, cloud architecture, and engineering leadership. Passionate about helping mid-level engineers make the leap to senior and staff roles.',
    topics: [
      { title: 'System Design Mock Interview', duration: '60 mins', price: 120 },
      { title: 'Staff+ Career Roadmap Review', duration: '45 mins', price: 95 },
      { title: 'Technical Architecture Deep Dive', duration: '60 mins', price: 130 }
    ]
  });

  const handleTopicChange = (index, field, value) => {
    const updated = [...profile.topics];
    updated[index][field] = value;
    setProfile({ ...profile, topics: updated });
  };

  const addTopic = () => {
    setProfile({
      ...profile,
      topics: [...profile.topics, { title: 'New Mentorship Topic', duration: '45 mins', price: 100 }]
    });
  };

  const removeTopic = (index) => {
    setProfile({
      ...profile,
      topics: profile.topics.filter((_, i) => i !== index)
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Public Mentor Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This information is shown to mentees browsing the platform.
          </p>
        </div>
        <a
          href="/mentors/mentor-1"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Preview Public Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
            <Avatar
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
              name={profile.name}
              size="2xl"
              status="online"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                <Badge variant="purple" size="sm">Verified Coach</Badge>
              </div>
              <p className="text-xs text-slate-500">{profile.title}</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                Update Headshot
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
              label="Professional Title"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            />
            <Input
              label="Hourly Rate ($ USD)"
              type="number"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
            />
            <Input
              label="Total Experience"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
            />
          </div>

          <Input
            label="Expertise & Skills"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            helperText="Separate skills with commas"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Mentor Bio & Background
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full text-sm p-3 border border-slate-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Session Offerings editor */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Session Offerings</h4>
                <p className="text-xs text-slate-500">Specific topic blueprints available for booking.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addTopic} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Topic
              </Button>
            </div>

            <div className="space-y-3">
              {profile.topics.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={t.title}
                    onChange={(e) => handleTopicChange(idx, 'title', e.target.value)}
                    className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none font-semibold text-slate-800"
                    placeholder="Topic Title"
                  />
                  <input
                    type="text"
                    value={t.duration}
                    onChange={(e) => handleTopicChange(idx, 'duration', e.target.value)}
                    className="w-24 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-600"
                    placeholder="Duration"
                  />
                  <input
                    type="number"
                    value={t.price}
                    onChange={(e) => handleTopicChange(idx, 'price', Number(e.target.value))}
                    className="w-20 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none font-bold text-slate-800"
                    placeholder="Price"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile saved successfully!
              </span>
            )}
            <Button
              type="submit"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
              className="ml-auto bg-purple-600 hover:bg-purple-700"
            >
              Save Profile Updates
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
