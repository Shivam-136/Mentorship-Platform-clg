import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Save,
  Camera,
  ExternalLink,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import { updateUserProfile } from '../../store/slices/authSlice';

export default function MentorProfilePage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const authUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(() => ({
    name: authUser?.name || authUser?.fullName || '',
    email: authUser?.email || '',
    title: authUser?.title || authUser?.roleTitle || '',
    company: authUser?.company || '',
    hourlyRate: authUser?.hourlyRate || 120,
    experience: authUser?.experience || '10+ years',
    location: authUser?.location || 'San Francisco, CA (PST)',
    skills: authUser?.skills || 'System Design, Cloud Architecture, Distributed Systems',
    bio: authUser?.bio || '',
    avatar: authUser?.avatar || '',
  }));

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(() => authUser?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warning('Full name is required.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.warning('A valid email address is required.');
      return;
    }

    setIsSaving(true);

    dispatch(
      updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        title: formData.title.trim(),
        roleTitle: formData.title.trim(),
        company: formData.company.trim(),
        hourlyRate: Number(formData.hourlyRate) || 100,
        experience: formData.experience.trim(),
        location: formData.location.trim(),
        skills: formData.skills.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim() || null,
      })
    );

    setIsSaving(false);
    toast.success('Public mentor profile updated successfully.', 'Profile Saved');
  };

  const handleSavePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: photoUrlInput.trim() }));
    setIsPhotoModalOpen(false);
    toast.info('Headshot image URL updated.');
  };

  const handleRemovePhoto = () => {
    setPhotoUrlInput('');
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setIsPhotoModalOpen(false);
    toast.info('Headshot reset to default initials.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Public Mentor Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            This information is showcased to mentees exploring expert advisors on the platform.
          </p>
        </div>
        <a
          href="/mentors"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Preview Public Directory</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          {/* Header & Headshot */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
            <Avatar
              src={formData.avatar}
              name={formData.name || 'Mentor User'}
              size="2xl"
              status="online"
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {formData.name || 'Mentor Name'}
                </h3>
                <Badge variant="purple" size="sm">
                  Verified Coach
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {formData.title || 'Staff / Principal Engineer'}
                {formData.company ? ` at ${formData.company}` : ''}
              </p>
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPhotoModalOpen(true)}
                  leftIcon={<Camera className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Update Headshot
                </Button>
              </div>
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={formData.name}
              placeholder="e.g. Sarah Jenkins"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              placeholder="e.g. sarah@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Professional Headline / Title"
              value={formData.title}
              placeholder="e.g. Principal Engineer, Director of Engineering"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Company / Affiliation"
              value={formData.company}
              placeholder="e.g. Stripe, Google, Datadog"
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          {/* Hourly Rate, Experience, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Base Hourly Rate (USD)"
              type="number"
              min="0"
              step="5"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            />
            <Input
              label="Years of Experience"
              value={formData.experience}
              placeholder="e.g. 10+ years"
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
            <Input
              label="Location & Timezone"
              value={formData.location}
              placeholder="e.g. San Francisco, CA (PST)"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Core Specialties */}
          <Input
            label="Core Specialties & Skills"
            value={formData.skills}
            placeholder="e.g. System Design, Cloud Architecture, Engineering Leadership, Go"
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            helperText="Separate specialties with commas"
          />

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Mentor Bio & Coaching Philosophy
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Introduce your background, notable scale challenges solved, and how you help mentees achieve breakthroughs..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 leading-relaxed"
            />
          </div>

          {/* Save Action */}
          <div className="pt-2 flex items-center justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>

      {/* Headshot Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Update Profile Headshot"
        description="Provide a direct URL to your professional headshot image."
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Headshot Image URL"
            placeholder="https://example.com/headshot.jpg"
            value={photoUrlInput}
            onChange={(e) => setPhotoUrlInput(e.target.value)}
          />

          {photoUrlInput && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Avatar src={photoUrlInput} name={formData.name || 'Preview'} size="lg" />
              <div className="text-[11px] text-slate-500">
                Headshot preview. For optimal display, use a square image (minimum 400x400 px).
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemovePhoto}
              className="text-xs text-rose-600 hover:text-rose-700"
            >
              Remove Photo
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSavePhoto}
              >
                Apply Photo
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
