import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import MentorCard from '../../components/cards/MentorCard';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { mentorService } from '../../services/mentorService';
import { addBooking } from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import useToast from '../../utils/useToast';

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'System Design',
  'Cloud Architecture',
  'Product Strategy',
  'Generative AI',
  'Design Systems',
  'Engineering Management',
  'Data Engineering',
  'Frontend Engineering',
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviews' },
];

const TIME_SLOTS = [
  '09:00 AM PST',
  '11:00 AM PST',
  '02:00 PM PST',
  '04:30 PM PST',
  '06:00 PM PST',
];

const MIN_BOOKING_DATE = new Date().toISOString().split('T')[0];

export default function MenteeFindMentors() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const user = useSelector((state) => state.auth.user);

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All Specialties');
  const [selectedSort, setSelectedSort] = useState('rating');

  // Booking Modal State
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[0]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingConfirmedData, setBookingConfirmedData] = useState(null);

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const skillParam = selectedSkill === 'All Specialties' ? '' : selectedSkill;
      const data = await mentorService.getMentors({
        search: searchQuery.trim(),
        skill: skillParam,
        sort: selectedSort,
      });
      setMentors(Array.isArray(data) ? data : data?.mentors || []);
    } catch (err) {
      setError(err?.message || 'Failed to retrieve mentors. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSkill, selectedSort]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const handleOpenBookingModal = (mentor) => {
    setSelectedMentor(mentor);
    setSelectedTopicIndex(0);
    setSessionNotes('');
    setBookingConfirmedData(null);
  };

  const handleCloseBookingModal = () => {
    setSelectedMentor(null);
    setBookingConfirmedData(null);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedMentor) return;

    if (!bookingDate) {
      toast.warning('Please choose a session date.');
      return;
    }

    const chosenTopic = selectedMentor.topics?.[selectedTopicIndex] || {
      title: 'General 1-on-1 Mentorship Strategy',
      price: selectedMentor.hourlyRate || 100,
    };

    setIsSubmittingBooking(true);

    const newBooking = {
      id: `booking-${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorTitle: selectedMentor.title,
      mentorAvatar: selectedMentor.avatar,
      menteeId: user?.id || 'mentee-current',
      menteeName: user?.name || 'Current Mentee',
      topic: chosenTopic.title,
      date: bookingDate,
      time: bookingTime,
      duration: '60 min',
      price: chosenTopic.price || selectedMentor.hourlyRate,
      status: 'Upcoming',
      notes: sessionNotes.trim() || 'No preparatory notes attached.',
      meetUrl: `https://meet.jit.si/MentorshipPlatform-${Date.now()}`,
      isLocal: true,
      syncStatus: 'pending_sync',
      createdAt: new Date().toISOString(),
    };

    dispatch(addBooking(newBooking));

    dispatch(
      addNotification({
        title: 'Session Reserved',
        description: `1-on-1 with ${selectedMentor.name} scheduled for ${bookingDate} at ${bookingTime}.`,
        type: 'booking',
      })
    );

    setIsSubmittingBooking(false);
    setBookingConfirmedData(newBooking);
    toast.success(
      `Session booked successfully with ${selectedMentor.name}!`,
      'Booking Confirmed'
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Explore Mentors</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified senior experts and schedule focused 1-on-1 advisory sessions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by mentor name, skill, or role..."
            />
          </div>
          <div className="md:col-span-3">
            <Select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              options={SPECIALTY_OPTIONS}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded" />
              <div className="flex gap-2">
                <div className="h-5 bg-slate-200 rounded w-16" />
                <div className="h-5 bg-slate-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <Card className="p-8 text-center max-w-lg mx-auto space-y-4 border-rose-200 bg-rose-50/30">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Failed to load mentors</h3>
          <p className="text-xs text-slate-600">{error}</p>
          <Button size="sm" onClick={fetchMentors}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Mentors Grid */}
      {!loading && !error && mentors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Showing <strong className="text-slate-800">{mentors.length}</strong> verified mentor{mentors.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookNow={handleOpenBookingModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mentors.length === 0 && (
        <EmptyState
          icon={Filter}
          title="No mentors match your search"
          description="Try broadening your search query or selecting a different specialty filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedSkill('All Specialties');
            setSelectedSort('rating');
          }}
        />
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={Boolean(selectedMentor)}
        onClose={handleCloseBookingModal}
        title={
          bookingConfirmedData
            ? 'Booking Confirmed!'
            : selectedMentor
            ? `Schedule 1-on-1 with ${selectedMentor.name}`
            : ''
        }
        description={
          bookingConfirmedData
            ? 'Your mentorship session is confirmed and synced to your schedule.'
            : selectedMentor?.title
        }
      >
        {selectedMentor && !bookingConfirmedData && (
          <form onSubmit={handleConfirmBooking} className="space-y-5 text-xs">
            {/* Mentor Summary Strip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{selectedMentor.name}</span>
                <p className="text-slate-500 text-[11px]">{selectedMentor.company || selectedMentor.title}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-brand-600">
                  ${selectedMentor.hourlyRate}
                </span>
                <span className="text-[11px] text-slate-500"> / 60 min</span>
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Advisory Topic:
              </label>
              {selectedMentor.topics && selectedMentor.topics.length > 0 ? (
                <div className="space-y-2">
                  {selectedMentor.topics.map((topic, i) => (
                    <label
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedTopicIndex === i
                          ? 'border-brand-500 bg-brand-50/40 text-brand-900'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="topic"
                          checked={selectedTopicIndex === i}
                          onChange={() => setSelectedTopicIndex(i)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span className="font-semibold text-slate-900">{topic.title}</span>
                      </div>
                      <span className="font-bold text-slate-800">${topic.price}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-brand-200 bg-brand-50/30 font-semibold text-slate-800">
                  General 1-on-1 Mentorship & Career Advisory (${selectedMentor.hourlyRate})
                </div>
              )}
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  min={MIN_BOOKING_DATE}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-500 bg-white"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prep Notes / Questions for Mentor (Optional)
              </label>
              <textarea
                rows={3}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What specific questions or challenges would you like to solve during this call?"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseBookingModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmittingBooking}
              >
                Confirm & Reserve Session
              </Button>
            </div>
          </form>
        )}

        {/* Confirmation Screen */}
        {bookingConfirmedData && (
          <div className="space-y-4 text-xs py-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Session Reserved Successfully
              </div>
              <p className="text-slate-600 text-xs">
                Your session for <strong>{bookingConfirmedData.topic}</strong> with{' '}
                <strong>{bookingConfirmedData.mentorName}</strong> is confirmed for{' '}
                <strong>{bookingConfirmedData.date}</strong> at{' '}
                <strong>{bookingConfirmedData.time}</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                fullWidth
                variant="outline"
                size="sm"
                onClick={handleCloseBookingModal}
              >
                Browse More Mentors
              </Button>
              <Button
                fullWidth
                size="sm"
                onClick={() => navigate('/mentee/bookings')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View in My Bookings
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
