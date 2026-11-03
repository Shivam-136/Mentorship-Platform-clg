import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CalendarClock,
  AlertTriangle,
  Save,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import useToast from '../../utils/useToast';
import { loadState, saveState, STORAGE_KEYS } from '../../utils/storage';
import { mentorService } from '../../services/mentorService';

const DEFAULT_SCHEDULE = [
  { day: 'Monday', enabled: true, from: '17:00', to: '20:00' },
  { day: 'Tuesday', enabled: true, from: '17:00', to: '20:00' },
  { day: 'Wednesday', enabled: false, from: '17:00', to: '20:00' },
  { day: 'Thursday', enabled: true, from: '17:00', to: '20:00' },
  { day: 'Friday', enabled: true, from: '15:00', to: '19:00' },
  { day: 'Saturday', enabled: true, from: '10:00', to: '14:00' },
  { day: 'Sunday', enabled: false, from: '10:00', to: '14:00' },
];

export default function MentorAvailability() {
  const toast = useToast();
  const token = useSelector((state) => state.auth.token);

  const savedData = loadState(STORAGE_KEYS.MENTOR_AVAILABILITY, {
    bufferTime: '15',
    slotDuration: '60',
    schedule: DEFAULT_SCHEDULE,
  });

  const [bufferTime, setBufferTime] = useState(savedData.bufferTime || '15');
  const [slotDuration, setSlotDuration] = useState(savedData.slotDuration || '60');
  const [schedule, setSchedule] = useState(savedData.schedule || DEFAULT_SCHEDULE);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const toggleDay = (idx) => {
    const updated = [...schedule];
    updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
    setSchedule(updated);
    setValidationError(null);
  };

  const updateTime = (idx, field, val) => {
    const updated = [...schedule];
    updated[idx] = { ...updated[idx], [field]: val };
    setSchedule(updated);
    setValidationError(null);
  };

  // Conflict prevention & validation
  const validateSchedule = () => {
    for (const item of schedule) {
      if (item.enabled) {
        if (!item.from || !item.to) {
          return `Please set both start and end times for ${item.day}.`;
        }
        if (item.from >= item.to) {
          return `Invalid schedule on ${item.day}: Start time (${item.from}) must be strictly earlier than end time (${item.to}).`;
        }
      }
    }
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errorMsg = validateSchedule();
    if (errorMsg) {
      setValidationError(errorMsg);
      toast.warning(errorMsg);
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    const payload = {
      bufferTime,
      slotDuration,
      schedule,
      updatedAt: new Date().toISOString(),
    };

    // Save locally
    saveState(STORAGE_KEYS.MENTOR_AVAILABILITY, payload);

    // If backend connection available, send to service
    try {
      if (token) {
        await mentorService.updateAvailability(payload, token);
      }
    } catch {
      // Offline fallback: locally preserved
    }

    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        'Your weekly availability schedule has been saved.',
        'Schedule Updated'
      );
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Availability</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the recurring weekly slots during which mentees can book 1-on-1 sessions.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-800 font-semibold self-start sm:self-auto">
          <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
          <span>Active Booking Calendar</span>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-6">
          {/* Buffer & Slot settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Buffer Time Between Calls
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Prevent back-to-back fatigue with a mandatory recess to take notes.
              </p>
              <Select
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                options={[
                  { value: '0', label: 'No buffer (0 mins)' },
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '45', label: '45 minutes' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Default Slot Duration
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Standard appointment duration allocated per session.
              </p>
              <Select
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                options={[
                  { value: '30', label: '30 minutes' },
                  { value: '45', label: '45 minutes' },
                  { value: '60', label: '60 minutes' },
                  { value: '90', label: '90 minutes' },
                ]}
              />
            </div>
          </div>

          {/* Schedule by Day */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Time Blocks
              </span>
              <span className="text-xs text-slate-500">
                Local Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>

            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                  item.enabled
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-200/60 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${item.day}`}
                    checked={item.enabled}
                    onChange={() => toggleDay(idx)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded cursor-pointer"
                  />
                  <label
                    htmlFor={`day-${item.day}`}
                    className="text-xs font-bold text-slate-900 w-24 cursor-pointer"
                  >
                    {item.day}
                  </label>
                </div>

                {item.enabled ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">From</span>
                    <input
                      type="time"
                      value={item.from}
                      onChange={(e) => updateTime(idx, 'from', e.target.value)}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-slate-400">To</span>
                    <input
                      type="time"
                      value={item.to}
                      onChange={(e) => updateTime(idx, 'to', e.target.value)}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Unavailable</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Availability
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
