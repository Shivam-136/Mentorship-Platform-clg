import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  Video,
  CheckCircle,
  Search
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MentorCard from '../../components/cards/MentorCard';
import ReviewCard from '../../components/cards/ReviewCard';
import Modal from '../../components/ui/Modal';
import { MOCK_MENTORS, MOCK_REVIEWS, MOCK_CATEGORIES } from '../../data/mockData';

export default function Home() {
  const navigate = useNavigate();
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredMentors = MOCK_MENTORS.slice(0, 3);
  const featuredReviews = MOCK_REVIEWS.slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/mentors?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/mentors');
    }
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedMentorForBooking(null);
      navigate('/mentee/bookings');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-brand-50/30 to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Personalized 1-on-1 Career Mentorship</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Learn directly from the world’s top{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">
                tech leaders.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Overcome architectural roadblocks, ace high-stakes Staff+ interviews, and scale your product vision with personalized guidance from senior practitioners.
            </p>

            {/* Quick Search bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl shadow-lg shadow-slate-200/50">
                <div className="flex items-center gap-3 px-3.5 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, company (e.g. Stripe, OpenAI), skill..."
                    className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                  />
                </div>
                <Button type="submit" size="md" className="w-full sm:w-auto px-6 rounded-xl">
                  Find Mentors
                </Button>
              </div>
            </form>

            {/* Popular tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">Popular:</span>
              {['System Design', 'Staff Engineer', 'Product Strategy', 'AI & LLMs', 'Engineering Manager'].map((tag) => (
                <Link
                  key={tag}
                  to={`/mentors?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Platform proof stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto border-t border-slate-200/70">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">500+</p>
                <p className="text-xs text-slate-500 mt-0.5">Vetted Mentors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">18,500+</p>
                <p className="text-xs text-slate-500 mt-0.5">Sessions Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.96 / 5</p>
                <p className="text-xs text-slate-500 mt-0.5">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">94%</p>
                <p className="text-xs text-slate-500 mt-0.5">Promotion / Offer Rate</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">Explore Disciplines</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Mentorship across every discipline
              </h2>
            </div>
            <Link to="/mentors" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Browse all mentors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/mentors?q=${encodeURIComponent(category.name)}`}
                className="group p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-200 hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{category.count} active mentors</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:border-brand-200 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">Staff & Executive Coaches</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Industry Mentors
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Book direct 1-on-1 video sessions with engineers and leaders from premier tech companies.
              </p>
            </div>
            <Link to="/mentors">
              <Button variant="outline" size="sm">
                View All {MOCK_MENTORS.length}+ Mentors
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookNow={(m) => setSelectedMentorForBooking(m)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Summary */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Simple 3-Step Process</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How MentorMatch works
            </h2>
            <p className="text-sm text-slate-600">
              No long term lock-in. Book high-impact sessions when you need them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Find the right mentor</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by verified role, company, skills, language, and budget. Inspect detailed reviews from other developers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Schedule a 1-on-1 session</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pick a slot that matches your time zone. Add your resume, code repo, or topic questions so your mentor prepares in advance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Achieve your career milestones</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive unvarnished honest feedback, concrete action items, and ongoing momentum toward your next promotion or role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Real Success Stories</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by 10,000+ ambitious tech professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to level up your career trajectory?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            Create your account today and book your first 1-on-1 mentorship session with a leading expert.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto px-8 bg-brand-500 hover:bg-brand-600 text-white shadow-lg">
                Get Started as Mentee
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 text-white border-white/20 bg-white/5 hover:bg-white/10">
                Apply to Mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Quick Modal */}
      <Modal
        isOpen={Boolean(selectedMentorForBooking)}
        onClose={() => setSelectedMentorForBooking(null)}
        title={selectedMentorForBooking ? `Book Session with ${selectedMentorForBooking.name}` : ''}
        description="Select a topic and confirm your 1-on-1 mentorship session."
      >
        {selectedMentorForBooking && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Next Available Slot:</span>
              <span className="text-brand-600 font-bold">{selectedMentorForBooking.availableNext}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Select Session Focus:
              </label>
              <div className="space-y-2">
                {selectedMentorForBooking.topics?.map((topic, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer transition text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="topic" defaultChecked={i === 0} className="text-brand-600" />
                      <span className="font-semibold text-slate-900">{topic.title}</span>
                    </div>
                    <span className="font-bold text-slate-700">${topic.price} ({topic.duration})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                fullWidth
                size="md"
                onClick={handleConfirmBooking}
                isLoading={bookingSuccess}
              >
                {bookingSuccess ? 'Booking Confirmed!' : `Confirm Booking ($${selectedMentorForBooking.hourlyRate})`}
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
