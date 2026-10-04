import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video, Clock, ArrowRight, Target, Star, Award, Search, Sparkles } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import SessionCard from '../../components/cards/SessionCard';
import MentorCard from '../../components/cards/MentorCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { MOCK_BOOKINGS, MOCK_MENTORS } from '../../data/mockData';

export default function MenteeDashboard() {
  const upcomingSession = MOCK_BOOKINGS.find(
    (b) => b.status === 'Upcoming' || b.status === 'Confirmed'
  );

  const recommendedMentors = MOCK_MENTORS.slice(0, 2);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="brand" size="sm" className="bg-brand-500/20 text-brand-200 border-brand-400/30">
            Mentee Workspace
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Jordan!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your active goal is <strong className="text-white">"Transition to Staff Engineer in 2026"</strong>. You have 1 session scheduled for this week.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/mentee/mentors">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm" rightIcon={<Search className="w-3.5 h-3.5" />}>
                Find a Mentor
              </Button>
            </Link>
            <Link to="/mentee/upcoming-sessions">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Sessions"
          value="2"
          icon={Calendar}
          description="Next on Oct 12"
          trend="+1 this week"
          trendPositive={true}
        />
        <StatCard
          title="Completed Sessions"
          value="6"
          icon={Video}
          description="All time sessions"
          trend="+2 last month"
          trendPositive={true}
        />
        <StatCard
          title="Mentorship Hours"
          value="7.5 hrs"
          icon={Clock}
          description="Direct 1-on-1 guidance"
        />
        <StatCard
          title="Goal Milestones"
          value="3 / 5"
          icon={Target}
          description="Staff roadmap progress"
          trend="60% Complete"
          trendPositive={true}
        />
      </div>

      {/* Next Up Session */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Next Upcoming Session</h3>
          <Link to="/mentee/upcoming-sessions" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
            All upcoming
          </Link>
        </div>

        {upcomingSession ? (
          <SessionCard session={upcomingSession} />
        ) : (
          <Card className="p-6 text-center text-slate-500 text-sm">
            No upcoming sessions scheduled.
          </Card>
        )}
      </div>

      {/* Recommended Mentors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recommended Mentors for Your Goals</h3>
            <p className="text-xs text-slate-500">Based on your focus: System Design & Staff+ Engineering</p>
          </div>
          <Link to="/mentee/mentors" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </div>

    </div>
  );
}
