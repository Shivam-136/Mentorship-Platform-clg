import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  LogIn,
} from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import ReviewCard from '../../components/cards/ReviewCard';
import { mentorService } from '../../services/mentorService';
import { reviewService } from '../../services/reviewService';
import { addBooking } from '../../store/slices/bookingSlice';
import useToast from '../../utils/useToast';

export default function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('16:00');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMentorData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch mentor details
        const mentorData = await mentorService.getMentorById(id);
        if (isMounted) {
          setMentor(mentorData);
          if (mentorData?.topics?.length > 0) {
            setSelectedTopic(mentorData.topics[0].title);
          }
        }

        // Fetch verified reviews for this mentor
        try {
          const reviewsData = await reviewService.getMentorReviews(id);
          if (isMounted) {
            setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData?.reviews || []);
          }
        } catch {
          if (isMounted) setReviews([]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Mentor profile could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadMentorData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOpenBookingModal = () => {
    setBookingDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning('Please sign in or register as a mentee to schedule sessions.', 'Authentication Required');
      return;
    }

    if (!mentor) return;

    setSubmittingBooking(true);

    const newBooking = {
      id: `bk-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorTitle: mentor.title,
      menteeName: user?.name || user?.fullName || 'Mentee',
      menteeRole: user?.roleTitle || user?.title || 'Engineer',
      topic: selectedTopic || '1-on-1 Mentorship Strategy Session',
      date: bookingDate,
      time: `${bookingTime} PST`,
      status: 'Upcoming',
      price: mentor.hourlyRate || 120,
      notes: bookingNotes,
      meetUrl: 'https://meet.google.com/new',
      isLocal: true,
      syncStatus: 'pending_sync',
      createdAt: new Date().toISOString(),
    };

    dispatch(addBooking(newBooking));
    toast.success(`Session confirmed with ${mentor.name}!`, 'Booking Placed');

    setSubmittingBooking(false);
    setIsBookingModalOpen(false);
    navigate('/mentee/bookings');
  };

  if (loading) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
          <div className="w-32 h-4 bg-slate-200 rounded" />
          <div className="bg-white p-8 rounded-2xl border border-slate-200 h-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 h-96" />
            <div className="bg-white p-8 rounded-2xl border border-slate-200 h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4">
          <ErrorState
            title="Mentor Profile Unavailable"
            message={error || 'The requested mentor profile does not exist or the service is temporarily offline.'}
            onRetry={() => navigate('/mentors')}
          />
          <div className="text-center mt-6">
            <Link to="/mentors">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Browse All Mentors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to mentor directory</span>
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar
                src={mentor.avatar}
                name={mentor.name}
                size="2xl"
                status="online"
                className="ring-4 ring-brand-50"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {mentor.name}
                  </h1>
                  <Badge variant="brand" size="sm" className="gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Mentor
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-slate-700">{mentor.title}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                  {mentor.rating && (
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {mentor.rating} ({mentor.reviewsCount || 0} reviews)
                    </span>
                  )}
                  {mentor.company && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {mentor.company} ({mentor.experience || '5+ yrs'})
                    </span>
                  )}
                  {mentor.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {mentor.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 gap-3">
              <div>
                <span className="text-2xl font-black text-slate-900">${mentor.hourlyRate || 120}</span>
                <span className="text-xs text-slate-500 block">per hour call</span>
              </div>
              <Button size="md" onClick={handleOpenBookingModal} className="px-6 shadow-sm">
                Book 1-on-1 Session
              </Button>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About / Bio */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900">About Mentor</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {mentor.about || mentor.bio || 'Verified industry coach offering targeted technical strategy and career mentorship.'}
              </p>

              {mentor.education && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{mentor.education}</span>
                </div>
              )}
            </Card>

            {/* Structured Topics / Focus Areas */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Session Offerings & Focus Areas</h2>
              <div className="space-y-3">
                {mentor.topics && mentor.topics.length > 0 ? (
                  mentor.topics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          Duration: {topic.duration || '60 mins'} • High-definition 1-on-1 video call
                        </span>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="font-bold text-slate-900 text-sm">${topic.price || mentor.hourlyRate}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTopic(topic.title);
                            handleOpenBookingModal();
                          }}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-500">
                    Standard 1-on-1 Mentorship Call (${mentor.hourlyRate || 120} / 60 mins)
                  </div>
                )}
              </div>
            </Card>

            {/* Verified Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Verified Mentee Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev.id} review={rev} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Star}
                  title="No public reviews yet"
                  description="When mentees complete strategy calls with this mentor, verified feedback will appear here."
                />
              )}
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Booking Snapshot */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Schedule Overview</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Format</span>
                  <span className="font-semibold text-slate-900">1:1 Video (Google Meet)</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Reschedule Window</span>
                  <span className="font-semibold text-slate-900">Up to 24h prior</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Session Notes</span>
                  <span className="font-semibold text-slate-900">Included post-call</span>
                </div>
              </div>
              <Button fullWidth size="md" onClick={handleOpenBookingModal}>
                Book Session Now
              </Button>
            </Card>

            {/* Technical Skills & Domains */}
            {mentor.skills && mentor.skills.length > 0 && (
              <Card className="p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-1.5">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Languages */}
            {mentor.languages && mentor.languages.length > 0 && (
              <Card className="p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Languages</h3>
                <p className="text-xs text-slate-600 font-medium">
                  {mentor.languages.join(', ')}
                </p>
              </Card>
            )}
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={mentor ? `Book Session with ${mentor.name}` : ''}
        description="Select date, time, and prep brief for your 1-on-1 mentorship call."
      >
        {isAuthenticated ? (
          <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Hourly Rate:</span>
              <span className="text-brand-600 font-bold text-sm">
                ${mentor.hourlyRate || 120} / hr
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session Focus Area
              </label>
              <input
                type="text"
                required
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. System Design Mock Interview or Staff Career Roadmap"
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Date"
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />

              <Input
                label="Preferred Time (PST)"
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agenda Brief / Context for Mentor
              </label>
              <textarea
                rows={2}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Include PRD links, architecture drafts, or specific problems..."
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-2">
              <Button
                fullWidth
                size="md"
                type="submit"
                isLoading={submittingBooking}
              >
                Confirm & Schedule Session (${mentor.hourlyRate || 120})
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Sign in to Schedule a Session</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You need an active mentee account to confirm bookings, submit prep notes, and manage video calls.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Link to="/auth/login" className="flex-1">
                <Button fullWidth size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register" className="flex-1">
                <Button fullWidth variant="outline" size="sm">
                  Create Mentee Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
