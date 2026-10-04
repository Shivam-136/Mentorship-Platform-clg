import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import MentorCard from '../../components/cards/MentorCard';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { MOCK_MENTORS } from '../../data/mockData';

export default function MenteeFindMentors() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedSort, setSelectedSort] = useState('rating');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingDone, setBookingDone] = useState(false);

  const filteredMentors = useMemo(() => {
    return MOCK_MENTORS.filter((mentor) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mentor.name.toLowerCase().includes(q) ||
        mentor.title.toLowerCase().includes(q) ||
        mentor.skills.some((s) => s.toLowerCase().includes(q));

      const matchesSkill = !selectedSkill || mentor.skills.includes(selectedSkill);
      return matchesSearch && matchesSkill;
    }).sort((a, b) => {
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'price-low') return a.hourlyRate - b.hourlyRate;
      if (selectedSort === 'price-high') return b.hourlyRate - a.hourlyRate;
      return 0;
    });
  }, [searchQuery, selectedSkill, selectedSort]);

  const handleConfirm = () => {
    setBookingDone(true);
    setTimeout(() => {
      setBookingDone(false);
      setSelectedMentor(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Explore Mentors</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Find and schedule 1-on-1 sessions with verified industry experts.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-3">
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
              placeholder="All Specialties"
              options={[
                'System Design',
                'Cloud Architecture',
                'Product Strategy',
                'Generative AI',
                'Design Systems',
                'Engineering Management'
              ]}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              placeholder="Sort by"
              options={[
                { value: 'rating', label: 'Highest Rated' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onBookNow={(m) => setSelectedMentor(m)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mentors found"
          description="Try broadening your search or clearing active filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedSkill('');
          }}
        />
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={Boolean(selectedMentor)}
        onClose={() => setSelectedMentor(null)}
        title={selectedMentor ? `Book 1-on-1 with ${selectedMentor.name}` : ''}
        description="Select a topic to confirm your mentorship session."
      >
        {selectedMentor && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Next Slot:</span>
              <span className="text-brand-600 font-bold">{selectedMentor.availableNext}</span>
            </div>

            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Available Focus Areas:
              </p>
              <div className="space-y-2">
                {selectedMentor.topics?.map((topic, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/20 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" name="topic" defaultChecked={i === 0} />
                      <span className="font-semibold text-slate-900">{topic.title}</span>
                    </div>
                    <span className="font-bold text-slate-800">${topic.price}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              fullWidth
              size="md"
              onClick={handleConfirm}
              isLoading={bookingDone}
            >
              {bookingDone ? 'Booking Reserved!' : `Confirm Session ($${selectedMentor.hourlyRate})`}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
