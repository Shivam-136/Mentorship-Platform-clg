import React, { useState } from 'react';
import { Inbox, CheckCircle, XCircle, Calendar, Clock, DollarSign, MessageCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export default function BookingRequests() {
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

  const handleAction = (id, action) => {
    setRequests(requests.filter((r) => r.id !== id));
    alert(`Booking request ${action}ed!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Booking Requests</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review incoming session proposals from mentees before confirming time slots.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="p-6 space-y-4 border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar src={req.avatar} name={req.menteeName} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{req.menteeName}</h4>
                    <p className="text-xs text-slate-500">{req.menteeRole}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-slate-900">${req.fee}</span>
                  <span className="text-xs text-slate-500 block">Session Fee</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                <div className="flex items-center gap-4 flex-wrap text-slate-700">
                  <span className="font-bold text-slate-900">{req.topic}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> {req.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {req.time}
                  </span>
                </div>
                <p className="text-slate-600">
                  <strong>Mentee Note:</strong> "{req.brief}"
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(req.id, 'declin')}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
                >
                  Decline Request
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(req.id, 'accept')}
                  className="text-xs bg-purple-600 hover:bg-purple-700"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Confirm & Schedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No booking requests"
          description="You're all caught up! New requests will notify you when submitted."
        />
      )}
    </div>
  );
}
