import React, { useState } from 'react';
import { CalendarClock, Plus, Trash2, Check, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

export default function MentorAvailability() {
  const [saved, setSaved] = useState(false);
  const [bufferTime, setBufferTime] = useState('15');
  const [schedule, setSchedule] = useState([
    { day: 'Monday', enabled: true, from: '17:00', to: '20:00' },
    { day: 'Tuesday', enabled: true, from: '17:00', to: '20:00' },
    { day: 'Wednesday', enabled: false, from: '17:00', to: '20:00' },
    { day: 'Thursday', enabled: true, from: '17:00', to: '20:00' },
    { day: 'Friday', enabled: true, from: '15:00', to: '19:00' },
    { day: 'Saturday', enabled: true, from: '10:00', to: '14:00' },
    { day: 'Sunday', enabled: false, from: '10:00', to: '14:00' }
  ]);

  const toggleDay = (idx) => {
    const updated = [...schedule];
    updated[idx].enabled = !updated[idx].enabled;
    setSchedule(updated);
  };

  const updateTime = (idx, field, val) => {
    const updated = [...schedule];
    updated[idx][field] = val;
    setSchedule(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Availability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define the hours mentees can book 1-on-1 sessions on your calendar.
          </p>
        </div>
        <Badge variant="success" size="sm" dot>
          Google Calendar Connected
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-6">
          
          {/* Buffer setting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Buffer Between Calls</h4>
              <p className="text-xs text-slate-500">Prevent back-to-back sessions so you have time to take notes.</p>
            </div>
            <div className="w-48">
              <Select
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                options={[
                  { value: '0', label: 'No buffer' },
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' }
                ]}
              />
            </div>
          </div>

          {/* Schedule by Day */}
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  item.enabled ? 'border-slate-200 bg-white' : 'border-slate-200/60 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleDay(idx)}
                    className="h-4 w-4 text-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-900 w-24">{item.day}</span>
                </div>

                {item.enabled ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">From</span>
                    <input
                      type="time"
                      value={item.from}
                      onChange={(e) => updateTime(idx, 'from', e.target.value)}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                    <span className="text-slate-400">To</span>
                    <input
                      type="time"
                      value={item.to}
                      onChange={(e) => updateTime(idx, 'to', e.target.value)}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Unavailable</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Schedule saved and synced with calendar!
              </span>
            )}
            <Button type="submit" size="md" className="ml-auto bg-purple-600 hover:bg-purple-700">
              Save Availability
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
