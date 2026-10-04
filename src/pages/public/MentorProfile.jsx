import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  MapPin,
  Globe,
  Clock,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Share2,
  ArrowLeft
} from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import ReviewCard from '../../components/cards/ReviewCard';
import { MOCK_MENTORS, MOCK_REVIEWS } from '../../data/mockData';

export default function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find mentor by id or fallback to first mentor
  const mentor = MOCK_MENTORS.find((m) => m.id === id) || MOCK_MENTORS[0];
  const [selectedTopic, setSelectedTopic] = useState(mentor.topics?.[0] || null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setIsBookingModalOpen(false);
      navigate('/mentee/bookings');
    }, 1200);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/mentors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all mentors</span>
          </Link>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
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
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {mentor.rating.toFixed(2)} ({mentor.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {mentor.company} ({mentor.experience})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {mentor.location || 'Remote'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 gap-2">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">${mentor.hourlyRate}</span>
                <span className="text-xs text-slate-500"> / hour</span>
              </div>
              <Button onClick={() => setIsBookingModalOpen(true)} size="md" className="shadow-sm">
                Book a Session
              </Button>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Bio */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">About Me</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {mentor.about || mentor.bio}
              </p>

              {mentor.education && (
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>{mentor.education}</span>
                </div>
              )}

              {mentor.languages && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Languages: {mentor.languages.join(', ')}</span>
                </div>
              )}
            </Card>

            {/* Areas of Expertise */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <Badge key={skill} variant="default" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Mentorship Focus Topics */}
            <Card className="p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Session Offerings</h2>
              <div className="space-y-3">
                {mentor.topics?.map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setIsBookingModalOpen(true);
                    }}
                    className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">1-on-1 personalized deep dive • {topic.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900">${topic.price}</span>
                      <Button variant="outline" size="sm" className="ml-3 text-xs">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Reviews */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verified Reviews</h2>
                  <p className="text-xs text-slate-500">{mentor.reviewsCount} reviews from verified mentees</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-extrabold text-slate-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {mentor.rating.toFixed(2)}
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_REVIEWS.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={rev.avatar} name={rev.author} size="xs" />
                        <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                        <span className="text-[11px] text-slate-400">• {rev.role}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Sticky Right Booking Sidebar Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <Card className="p-6 shadow-sm border border-slate-200">
              <h3 className="text-base font-bold text-slate-900 mb-4">Book 1-on-1 Session</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Next Available: <strong>{mentor.availableNext}</strong></span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Choose Focus:
                  </label>
                  <div className="space-y-1.5">
                    {mentor.topics?.map((topic, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedTopic(topic)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition ${
                          selectedTopic?.title === topic.title
                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{topic.title}</span>
                          <span className="font-bold">${topic.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Session Fee</span>
                    <span className="font-semibold text-slate-900">${selectedTopic?.price || mentor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service & Video Processing</span>
                    <span className="font-semibold text-slate-900">$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Due</span>
                    <span>${selectedTopic?.price || mentor.hourlyRate}</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="md"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="shadow-sm"
                >
                  Continue to Booking
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Free cancellation up to 24h before session.
                </p>
              </div>
            </Card>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Confirm Session with ${mentor.name}`}
        description="Review session details and reserve your slot."
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Mentor:</span>
              <strong className="text-slate-900">{mentor.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Topic:</span>
              <strong className="text-slate-900">{selectedTopic?.title || '1-on-1 Consultation'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Time:</span>
              <strong className="text-brand-600">{mentor.availableNext}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Price:</span>
              <strong className="text-slate-900">${selectedTopic?.price || mentor.hourlyRate}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Add prep context or questions for {mentor.name.split(' ')[0]}:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Preparing for staff interview at Stripe; would love feedback on my raft replication draft..."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <Button
            fullWidth
            size="md"
            onClick={handleBooking}
            isLoading={isBooked}
          >
            {isBooked ? 'Booking Confirmed! Redirecting...' : 'Confirm & Reserve Slot'}
          </Button>
        </div>
      </Modal>

    </div>
  );
}
