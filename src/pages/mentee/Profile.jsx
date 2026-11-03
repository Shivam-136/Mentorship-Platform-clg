import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Save,
  Camera,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import useToast from '../../utils/useToast';
import { updateUserProfile } from '../../store/slices/authSlice';

export default function MenteeProfile() {
  const dispatch = useDispatch();
  const toast = useToast();
  const authUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(() => ({
    name: authUser?.name || authUser?.fullName || '',
    email: authUser?.email || '',
    title: authUser?.title || authUser?.roleTitle || '',
    company: authUser?.company || '',
    careerGoal: authUser?.careerGoal || '',
    skills: authUser?.skills || '',
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
        careerGoal: formData.careerGoal.trim(),
        skills: formData.skills.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim() || null,
      })
    );

    setIsSaving(false);
    toast.success('Your profile changes have been saved.', 'Profile Updated');
  };

  const handleSavePhoto = () => {
    setFormData((prev) => ({ ...prev, avatar: photoUrlInput.trim() }));
    setIsPhotoModalOpen(false);
    toast.info('Avatar image URL updated.');
  };

  const handleRemovePhoto = () => {
    setPhotoUrlInput('');
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setIsPhotoModalOpen(false);
    toast.info('Avatar reset to default initials.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mentee Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          This background and goal context helps mentors prepare targeted advice before your 1-on-1 calls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6">
          {/* Header Avatar and Quick Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
            <Avatar
              src={formData.avatar}
              name={formData.name || 'Mentee User'}
              size="2xl"
              status="online"
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                {formData.name || 'Mentee Name'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {formData.title ? `${formData.title}` : 'Engineering Candidate'}
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
                  Change Photo
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
              placeholder="e.g. Alex Morgan"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              placeholder="e.g. alex@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Current Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Title / Role"
              value={formData.title}
              placeholder="e.g. Frontend Developer, Student, Tech Lead"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Company / University"
              value={formData.company}
              placeholder="e.g. Stripe, Acme Corp, UC Berkeley"
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>

          {/* Career Goal */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Primary Career Objective
            </label>
            <textarea
              rows={2}
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              placeholder="e.g. Prepare for Senior / Staff System Design interviews and transition into distributed cloud architecture."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          {/* Skills */}
          <Input
            label="Key Skills & Learning Focus Areas"
            value={formData.skills}
            placeholder="e.g. System Design, React, Go, Microservices, Cloud Architecture"
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            helperText="Separate topics or skills with commas"
          />

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Personal Bio / Context for Mentors
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Share your current work experience, notable projects, and specific hurdles you would like mentor guidance on."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </Card>
      </form>

      {/* Change Photo Modal */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Update Profile Photo"
        description="Provide a direct URL to your profile avatar image."
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Avatar Image URL"
            placeholder="https://example.com/avatar.jpg"
            value={photoUrlInput}
            onChange={(e) => setPhotoUrlInput(e.target.value)}
          />

          {photoUrlInput && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Avatar src={photoUrlInput} name={formData.name || 'Preview'} size="lg" />
              <div className="text-[11px] text-slate-500">
                Avatar preview. Ensure the image is accessible publicly via HTTPS.
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
                onClick={handleSavePhoto}
              >
                Apply Image
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
