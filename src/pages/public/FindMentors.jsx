import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, X, LogIn } from 'lucide-react';
import MentorCard from '../../components/cards/MentorCard';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { mentorService } from '../../services/mentorService';
import { addBooking } from '../../store/slices/bookingSlice';
import useToast from '../../utils/useToast';

const PREDEFINED_SPECIALTIES = [
  'System Design',
  'Cloud Architecture',
  'Product Strategy',
  'Generative AI',
  'Engineering Management',
  'Kubernetes',
  'Distributed Systems',
  'Web Performance',
];

export default function FindMentors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating');

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('16:00');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Fetch mentors from mentorService
  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mentorService.getMentors({
        q: searchQuery,
        skill: selectedSkill,
        sort: selectedSort,
      });
      setMentors(Array.isArray(data) ? data : data?.mentors || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to mentor directory.');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSkill, selectedSort]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  // Synchronize search query parameter
  const handleSearchSubmit = (val) => {
    setSearchQuery(val);
    setSearchParams(val ? { q: val } : {});
    fetchMentors();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedSort('rating');
    setSearchParams({});
  };

  // Open booking modal
  const handleOpenBooking = (mentor) => {
    setSelectedMentorForBooking(mentor);
    setBookingTopic(mentor.topics?.[0]?.title || '1-on-1 Mentorship Strategy Call');
    setBookingDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
    setBookingTime('16:00');
    setBookingNotes('');
  };

  // Submit actual booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning('Please sign in or register as a mentee to schedule sessions.', 'Authentication Required');
      return;
    }

    if (!selectedMentorForBooking) return;

    setSubmittingBooking(true);

    const newBooking = {
      id: `bk-${Date.now()}`,
      mentorId: selectedMentorForBooking.id,
      mentorName: selectedMentorForBooking.name,
      mentorTitle: selectedMentorForBooking.title,
      menteeName: user?.name || user?.fullName || 'Mentee',
      menteeRole: user?.roleTitle || user?.title || 'Engineer',
      topic: bookingTopic,
      date: bookingDate,
      time: `${bookingTime} PST`,
      status: 'Upcoming',
      price: selectedMentorForBooking.hourlyRate || 120,
      notes: bookingNotes,
      meetUrl: 'https://meet.google.com/new',
      isLocal: true,
      syncStatus: 'pending_sync',
      createdAt: new Date().toISOString(),
    };

    dispatch(addBooking(newBooking));
    toast.success(`Session confirmed with ${selectedMentorForBooking.name}!`, 'Booking Placed');

    setSubmittingBooking(false);
    setSelectedMentorForBooking(null);
    navigate('/mentee/bookings');
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Mentor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified senior practitioners from premier engineering teams for 1-on-1 architecture teardowns and career coaching.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            <div className="md:col-span-6">
              <SearchBar
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                onSubmit={() => handleSearchSubmit(searchQuery)}
                onClear={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
                placeholder="Search by mentor name, company, or specialty..."
              />
            </div>

            <div className="md:col-span-3">
              <Select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                placeholder="All Specialties / Skills"
                options={PREDEFINED_SPECIALTIES.map((s) => ({ value: s, label: s }))}
              />
            </div>

            <div className="md:col-span-3">
              <Select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                placeholder="Sort by"
                options={[
                  { value: 'rating', label: 'Highest Rated' },
                  { value: 'sessions', label: 'Most Sessions' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                ]}
              />
            </div>

          </div>

          {/* Quick Skill Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Quick Filter:
            </span>
            {PREDEFINED_SPECIALTIES.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedSkill(selectedSkill === tag ? '' : tag)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                  selectedSkill === tag
                    ? 'bg-brand-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
            {(searchQuery || selectedSkill) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold ml-auto flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {loading ? 'Searching directory...' : `Showing ${mentors.length} verified mentors`}
          </p>
        </div>

        {/* Directory Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-4 bg-slate-200 rounded" />
                    <div className="w-1/2 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-slate-100 rounded-lg" />
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-slate-200 rounded" />
                  <div className="w-20 h-6 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load mentors"
            message={error}
            onRetry={fetchMentors}
          />
        ) : mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookNow={handleOpenBooking}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mentors match your search criteria"
            description="Try searching with a broader title, clearing specialty filters, or resetting your search query."
            actionLabel="Reset Search & Filters"
            onAction={handleClearFilters}
          />
        )}

      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={Boolean(selectedMentorForBooking)}
        onClose={() => setSelectedMentorForBooking(null)}
        title={selectedMentorForBooking ? `Book 1-on-1 Session with ${selectedMentorForBooking.name}` : ''}
        description="Select your session focus and schedule your video consultation."
      >
        {selectedMentorForBooking && (
          isAuthenticated ? (
            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Hourly Rate:</span>
                <span className="text-brand-600 font-bold text-sm">
                  ${selectedMentorForBooking.hourlyRate || 120} / hr
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Topic / Focus
                </label>
                <input
                  type="text"
                  required
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="e.g. System Design Architecture Mock Interview"
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
                  placeholder="Add links to PRDs, architecture drafts, or specific questions..."
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
                  Confirm & Schedule Session (${selectedMentorForBooking.hourlyRate || 120})
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
                  You need an active mentee account to propose 1-on-1 calls, submit agenda briefs, and manage your video sessions.
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
          )
        )}
      </Modal>
    </div>
  );
}
