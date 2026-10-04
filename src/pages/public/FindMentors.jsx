import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Check, X } from 'lucide-react';
import MentorCard from '../../components/cards/MentorCard';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { MOCK_MENTORS } from '../../data/mockData';

export default function FindMentors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating');
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Extract all unique skills across mentors
  const allSkills = useMemo(() => {
    const set = new Set();
    MOCK_MENTORS.forEach((m) => m.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, []);

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    return MOCK_MENTORS.filter((mentor) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mentor.name.toLowerCase().includes(q) ||
        mentor.title.toLowerCase().includes(q) ||
        mentor.company.toLowerCase().includes(q) ||
        mentor.skills.some((s) => s.toLowerCase().includes(q));

      const matchesSkill = !selectedSkill || mentor.skills.includes(selectedSkill);

      return matchesSearch && matchesSkill;
    }).sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (selectedSort === 'price-high') return b.hourlyRate - a.hourlyRate;
      if (selectedSort === 'sessions') return b.sessionsCount - a.sessionsCount;
      return 0;
    });
  }, [searchQuery, selectedSkill, selectedSort]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSkill('');
    setSelectedSort('rating');
    setSearchParams({});
  };

  const handleBookingSubmit = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedMentorForBooking(null);
      navigate('/mentee/bookings');
    }, 1200);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Mentor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect with verified practitioners from leading tech companies for 1-on-1 strategy and interview coaching.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            <div className="md:col-span-6">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setSearchParams(val ? { q: val } : {});
                }}
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
                options={allSkills.map((s) => ({ value: s, label: s }))}
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
                  { value: 'price-high', label: 'Price: High to Low' }
                ]}
              />
            </div>

          </div>

          {/* Quick Skill Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Quick Filter:
            </span>
            {['System Design', 'Cloud Architecture', 'Product Strategy', 'Generative AI', 'Design Systems', 'React'].map((tag) => (
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
            Showing <span className="text-slate-900">{filteredMentors.length}</span> vetted mentors
          </p>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onBookNow={(m) => setSelectedMentorForBooking(m)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mentors match your search"
            description="Try changing your search terms, clearing selected skill filters, or sorting differently."
            actionLabel="Reset Filters"
            onAction={handleClearFilters}
          />
        )}

      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={Boolean(selectedMentorForBooking)}
        onClose={() => setSelectedMentorForBooking(null)}
        title={selectedMentorForBooking ? `Book Session with ${selectedMentorForBooking.name}` : ''}
        description="Select a topic to confirm your 1-on-1 mentorship session."
      >
        {selectedMentorForBooking && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Next Available Slot:</span>
              <span className="text-brand-600 font-bold">{selectedMentorForBooking.availableNext}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Available Focus Areas:
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
                onClick={handleBookingSubmit}
                isLoading={bookingConfirmed}
              >
                {bookingConfirmed ? 'Session Scheduled!' : `Confirm Booking ($${selectedMentorForBooking.hourlyRate})`}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
