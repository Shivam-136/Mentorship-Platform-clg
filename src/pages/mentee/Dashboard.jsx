import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, Video, Clock, ArrowRight, Target, Search } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import SessionCard from '../../components/cards/SessionCard';
import MentorCard from '../../components/cards/MentorCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { mentorService } from '../../services/mentorService';

export default function MenteeDashboard() {
  const user = useSelector((state) => state.auth.user);
  const bookings = useSelector((state) => state.bookings.bookings) || [];
  const { goals, milestones } = useSelector((state) => state.progress) || { goals: [], milestones: [] };

  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // Compute real statistics from actual user-generated bookings
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'Upcoming' || b.status === 'Confirmed'
  );
  const completedBookings = bookings.filter((b) => b.status === 'Completed');
  const mentorshipHours = (completedBookings.length * 1.0).toFixed(1);

  const completedMilestonesCount = milestones.filter((m) => m.completed).length;
  const milestonesDisplay = milestones.length > 0 ? `${completedMilestonesCount} / ${milestones.length}` : '0';

  const nextUpcomingSession = upcomingBookings[0] || null;
  const activeGoalTitle = goals[0]?.title || null;

  useEffect(() => {
    let isMounted = true;
    async function loadRecommendedMentors() {
      try {
        setLoadingMentors(true);
        const data = await mentorService.getMentors({ limit: 2 });
        if (isMounted) {
          setRecommendedMentors(Array.isArray(data) ? data : data?.mentors || []);
        }
      } catch {
        if (isMounted) setRecommendedMentors([]);
      } finally {
        if (isMounted) setLoadingMentors(false);
      }
    }

    loadRecommendedMentors();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = user?.name || user?.fullName || 'Mentee';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="brand" size="sm" className="bg-brand-500/20 text-brand-200 border-brand-400/30">
            Mentee Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeGoalTitle ? (
              <>
                Your active target is <strong className="text-white">"{activeGoalTitle}"</strong>.{' '}
                {upcomingBookings.length > 0
                  ? `You have ${upcomingBookings.length} session${upcomingBookings.length > 1 ? 's' : ''} scheduled.`
                  : 'You have no sessions scheduled right now.'}
              </>
            ) : (
              'Define your career goals and schedule high-impact 1-on-1 strategy sessions with verified mentors.'
            )}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/mentee/mentors">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm" rightIcon={<Search className="w-3.5 h-3.5" />}>
                Find a Mentor
              </Button>
            </Link>
            <Link to="/mentee/upcoming-sessions">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Schedule ({upcomingBookings.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Sessions"
          value={String(upcomingBookings.length)}
          icon={Calendar}
          description={nextUpcomingSession ? `Next: ${nextUpcomingSession.date}` : 'None scheduled'}
        />
        <StatCard
          title="Completed Sessions"
          value={String(completedBookings.length)}
          icon={Video}
          description="Verified calls completed"
        />
        <StatCard
          title="Mentorship Hours"
          value={`${mentorshipHours} hrs`}
          icon={Clock}
          description="Direct 1-on-1 guidance"
        />
        <StatCard
          title="Goal Milestones"
          value={milestonesDisplay}
          icon={Target}
          description={milestones.length > 0 ? `${Math.round((completedMilestonesCount / milestones.length) * 100)}% complete` : 'No milestones set'}
        />
      </div>

      {/* Next Upcoming Session */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Next Upcoming Session</h3>
          {upcomingBookings.length > 0 && (
            <Link to="/mentee/upcoming-sessions" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all ({upcomingBookings.length})
            </Link>
          )}
        </div>

        {nextUpcomingSession ? (
          <SessionCard session={nextUpcomingSession} />
        ) : (
          <Card className="p-8 text-center space-y-3 bg-white">
            <p className="text-xs text-slate-500">
              You do not have any sessions scheduled right now.
            </p>
            <div>
              <Link to="/mentee/mentors">
                <Button size="sm" variant="outline">
                  Browse Mentor Directory
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Mentor Discovery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Explore Industry Mentors</h3>
            <p className="text-xs text-slate-500">Connect with senior practitioners across engineering and product disciplines.</p>
          </div>
          <Link to="/mentee/mentors" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingMentors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-200" />
                  <div className="space-y-2 flex-1">
                    <div className="w-3/4 h-4 bg-slate-200 rounded" />
                    <div className="w-1/2 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-full h-10 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : recommendedMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Mentor directory is active"
            description="Browse all available mentors to find guidance in system design, product strategy, and career progression."
            actionLabel="View Directory"
            onAction={() => window.location.assign('/mentee/mentors')}
          />
        )}
      </div>
    </div>
  );
}
