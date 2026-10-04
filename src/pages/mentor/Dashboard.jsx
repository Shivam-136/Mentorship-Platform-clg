import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Video,
  Inbox,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import SessionCard from '../../components/cards/SessionCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { MOCK_BOOKINGS } from '../../data/mockData';

export default function MentorDashboard() {
  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      menteeName: 'Carlos Santana',
      menteeRole: 'Senior Frontend Dev at Atlassian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      topic: 'Staff Engineer Promotion Pitch Prep',
      date: 'Friday, Oct 16',
      time: '3:00 PM - 4:00 PM PST',
      fee: 120,
      brief: 'Need feedback on my staff promotion packet and cross-functional influence examples.'
    },
    {
      id: 'req-2',
      menteeName: 'Priya Sharma',
      menteeRole: 'Cloud Engineer at AWS',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      topic: 'Distributed Systems & Consensus Deep Dive',
      date: 'Monday, Oct 19',
      time: '5:00 PM - 6:00 PM PST',
      fee: 120,
      brief: 'Reviewing Raft and Paxos nuances for upcoming Principal level interviews.'
    }
  ]);

  const upcomingSessions = MOCK_BOOKINGS.filter(
    (b) => b.status === 'Upcoming' || b.status === 'Confirmed'
  );

  const handleAccept = (reqId) => {
    setRequests(requests.filter((r) => r.id !== reqId));
    alert('Booking request accepted! Added to upcoming sessions.');
  };

  const handleDecline = (reqId) => {
    setRequests(requests.filter((r) => r.id !== reqId));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Badge variant="purple" size="sm" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
              Verified Mentor Workspace
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good afternoon, Dr. Jenkins!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              You have {requests.length} pending booking requests awaiting review, and 2 sessions scheduled for this week.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/mentor/availability">
              <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
                Manage Availability
              </Button>
            </Link>
            <Link to="/mentors/mentor-1" target="_blank">
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Public Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value="$4,560"
          icon={DollarSign}
          trend="+$640 this month"
          trendPositive={true}
        />
        <StatCard
          title="Sessions Completed"
          value="38"
          icon={Video}
          trend="+5 this month"
          trendPositive={true}
        />
        <StatCard
          title="Pending Requests"
          value={String(requests.length)}
          icon={Inbox}
          description="Requires response"
        />
        <StatCard
          title="Average Rating"
          value="4.95"
          icon={Star}
          description="Based on 142 reviews"
        />
      </div>

      {/* Pending Booking Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pending Booking Requests</h3>
            <p className="text-xs text-slate-500">Mentees are waiting for your confirmation.</p>
          </div>
          <Link to="/mentor/booking-requests" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
            View all requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <Card key={req.id} className="p-5 flex flex-col justify-between space-y-4 border-purple-100">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={req.avatar} name={req.menteeName} size="md" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{req.menteeName}</h4>
                        <p className="text-xs text-slate-500">{req.menteeRole}</p>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">${req.fee}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-800">{req.topic}</p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" /> {req.date} • {req.time}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 italic">
                    "{req.brief}"
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => handleAccept(req.id)}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    Accept Request
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDecline(req.id)}
                    className="text-xs text-rose-600 hover:bg-rose-50"
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-xs text-slate-500">
            No pending booking requests right now.
          </Card>
        )}
      </div>

      {/* Upcoming Mentoring Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Upcoming Mentoring Sessions</h3>
          <Link to="/mentor/upcoming-sessions" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
            Full schedule
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <SessionCard key={session.id} session={session} isMentorView={true} />
          ))}
        </div>
      </div>

    </div>
  );
}
