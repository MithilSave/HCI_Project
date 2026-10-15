import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TimetableEntry, TimetableType } from '../types';
import {
  Clock,
  Calendar,
  Plus,
  MapPin,
  Trash2,
  Bell,
  BellRing,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const TimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    timetable,
    places,
    getPlaceById,
    addTimetableEntry,
    deleteTimetableEntry,
    toggleTimetableReminder,
    checkTimetableOverlap,
  } = useApp();

  const [activeDayOfWeek, setActiveDayOfWeek] = useState<number>(() => {
    const current = new Date().getDay();
    return current === 0 ? 7 : current; // 1 = Mon, 7 = Sun
  });
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New timetable entry form
  const [entryTitle, setEntryTitle] = useState('');
  const [entryCourseCode, setEntryCourseCode] = useState('');
  const [entryType, setEntryType] = useState<TimetableType>('class');
  const [entryDay, setEntryDay] = useState<number>(1);
  const [entryStartTime, setEntryStartTime] = useState('09:00');
  const [entryEndTime, setEntryEndTime] = useState('10:30');
  const [entryPlaceId, setEntryPlaceId] = useState<string>(places[0]?.id || 'cr-304');
  const [entryInstructor, setEntryInstructor] = useState('');
  const [entryNotes, setEntryNotes] = useState('');

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<TimetableEntry | null>(null);

  const daysOfWeek = [
    { num: 1, name: 'Monday', short: 'Mon' },
    { num: 2, name: 'Tuesday', short: 'Tue' },
    { num: 3, name: 'Wednesday', short: 'Wed' },
    { num: 4, name: 'Thursday', short: 'Thu' },
    { num: 5, name: 'Friday', short: 'Fri' },
    { num: 6, name: 'Saturday', short: 'Sat' },
    { num: 7, name: 'Sunday', short: 'Sun' },
  ];

  const typeConfig: Record<
    TimetableType,
    { label: string; badge: 'cobalt' | 'coral' | 'lime' | 'lilac' | 'mint' }
  > = {
    class: { label: 'Lecture / Class', badge: 'cobalt' },
    assessment: { label: 'Exam / Midterm', badge: 'coral' },
    club: { label: 'Club Session', badge: 'lime' },
    workshop: { label: 'Studio Workshop', badge: 'lilac' },
    meeting: { label: 'Team Meeting', badge: 'mint' },
  };

  const handleOpenAddModal = (defaultDay?: number) => {
    setEntryTitle('');
    setEntryCourseCode('');
    setEntryType('class');
    setEntryDay(defaultDay || activeDayOfWeek);
    setEntryStartTime('09:00');
    setEntryEndTime('10:30');
    setEntryPlaceId(places[0]?.id || 'cr-304');
    setEntryInstructor('');
    setEntryNotes('');
    setConflictWarning(null);
    setAddModalOpen(true);
  };

  const handleFormCheckAndSubmit = (e: React.FormEvent, overrideConflict = false) => {
    e.preventDefault();
    if (!entryTitle.trim()) return;

    if (!overrideConflict) {
      const overlap = checkTimetableOverlap(entryDay, entryStartTime, entryEndTime);
      if (overlap) {
        setConflictWarning(overlap);
        return;
      }
    }

    addTimetableEntry({
      title: entryTitle.trim(),
      courseCode: entryCourseCode.trim() || undefined,
      type: entryType,
      dayOfWeek: entryDay as any,
      startTime: entryStartTime,
      endTime: entryEndTime,
      placeId: entryPlaceId,
      instructor: entryInstructor.trim() || undefined,
      notes: entryNotes.trim() || undefined,
      reminderEnabled: true,
    });

    setAddModalOpen(false);
    setConflictWarning(null);
  };

  const entriesForDay = (dayNum: number) => {
    return timetable
      .filter((e) => e.dayOfWeek === dayNum)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
            <span>Academic Schedule & Room Locations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Timetable & Class Navigator
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            View your weekly lectures, labs, team syncs, and assessments. Launch direct directions to any classroom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center p-1 bg-[#FAF9F5] rounded-2xl border border-[#E3E5E8]">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-[#17243A] shadow-xs'
                  : 'text-[#667085] hover:text-[#17243A]'
              }`}
            >
              Week Grid
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-[#17243A] shadow-xs'
                  : 'text-[#667085] hover:text-[#17243A]'
              }`}
            >
              Daily View
            </button>
          </div>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Week / Day Selector Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E3E5E8] shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5">
          {daysOfWeek.map((day) => {
            const isToday =
              (new Date().getDay() === 0 ? 7 : new Date().getDay()) === day.num;
            const isSelected = activeDayOfWeek === day.num;

            return (
              <button
                key={day.num}
                onClick={() => setActiveDayOfWeek(day.num)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all relative flex flex-col items-center min-w-[64px] ${
                  isSelected
                    ? 'bg-[#17243A] text-white shadow-2xs'
                    : 'bg-[#FAF9F5] text-[#667085] hover:bg-white hover:text-[#17243A] border border-[#E3E5E8]'
                }`}
              >
                <span>{day.short}</span>
                {isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-[#DDF36A]' : 'bg-[#315CEB]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            const cur = new Date().getDay();
            setActiveDayOfWeek(cur === 0 ? 7 : cur);
          }}
          className="px-3 py-1.5 bg-[#FAF9F5] border border-[#E3E5E8] hover:bg-[#EEF2FF] hover:text-[#315CEB] text-xs font-bold rounded-xl text-[#17243A] shrink-0"
        >
          Today
        </button>
      </div>

      {/* View Content: Week Columns or Selected Day */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {daysOfWeek.slice(0, 5).map((day) => {
            const dayEntries = entriesForDay(day.num);
            const isCurrentDay =
              (new Date().getDay() === 0 ? 7 : new Date().getDay()) === day.num;

            return (
              <div
                key={day.num}
                className={`rounded-3xl p-4 border flex flex-col min-h-[460px] ${
                  isCurrentDay
                    ? 'bg-white border-[#315CEB] shadow-sm'
                    : 'bg-[#FAF9F5] border-[#E3E5E8]'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E5E8]">
                  <div>
                    <span className="font-display font-bold text-sm text-[#17243A] block">
                      {day.name}
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      {dayEntries.length} commitments
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAddModal(day.num)}
                    className="p-1 rounded-lg text-[#667085] hover:text-[#17243A] hover:bg-white transition-colors"
                    title={`Add entry to ${day.name}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {dayEntries.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#9CA3AF] border border-dashed border-[#E3E5E8] rounded-2xl">
                      No classes on {day.short}
                    </div>
                  ) : (
                    dayEntries.map((entry) => {
                      const place = getPlaceById(entry.placeId);
                      const config = typeConfig[entry.type];

                      return (
                        <div
                          key={entry.id}
                          className="p-3.5 bg-white rounded-2xl border border-[#E3E5E8] shadow-2xs hover:shadow-xs transition-shadow space-y-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-bold text-[#315CEB]">
                              {entry.startTime} – {entry.endTime}
                            </span>
                            <Badge variant={config.badge} size="sm">
                              {entry.type}
                            </Badge>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-[#17243A] leading-snug">
                            {entry.title}
                          </h4>

                          {entry.courseCode && (
                            <span className="text-[11px] font-semibold text-[#667085] block">
                              Code: {entry.courseCode}
                            </span>
                          )}

                          <div className="flex items-center gap-1.5 text-xs text-[#667085] pt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#F27C66] shrink-0" />
                            <span className="truncate">{place?.name || entry.placeId}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E3E5E8] mt-2">
                            <button
                              onClick={() => toggleTimetableReminder(entry.id)}
                              className="text-[#9CA3AF] hover:text-[#315CEB]"
                              title={
                                entry.reminderEnabled ? 'Reminder on' : 'Reminder off'
                              }
                            >
                              {entry.reminderEnabled ? (
                                <BellRing className="w-3.5 h-3.5 text-[#315CEB]" />
                              ) : (
                                <Bell className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/navigation?to=${entry.placeId}`)}
                                className="text-xs font-bold text-[#315CEB] hover:underline"
                              >
                                Directions
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(entry.id)}
                                className="text-[#9CA3AF] hover:text-[#B93838]"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily View */
        <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E5E8]">
            <div>
              <h3 className="font-display font-bold text-lg text-[#17243A]">
                Schedule for{' '}
                {daysOfWeek.find((d) => d.num === activeDayOfWeek)?.name || 'Today'}
              </h3>
              <p className="text-xs text-[#667085]">
                {entriesForDay(activeDayOfWeek).length} scheduled sessions
              </p>
            </div>

            <button
              onClick={() => handleOpenAddModal(activeDayOfWeek)}
              className="px-3.5 py-1.5 bg-[#315CEB] text-white text-xs font-bold rounded-xl hover:bg-[#2447C5]"
            >
              Add to this day
            </button>
          </div>

          <div className="space-y-3">
            {entriesForDay(activeDayOfWeek).length === 0 ? (
              <div className="py-12 text-center text-xs text-[#9CA3AF]">
                No classes scheduled for this day. Enjoy your free time!
              </div>
            ) : (
              entriesForDay(activeDayOfWeek).map((entry) => {
                const place = getPlaceById(entry.placeId);
                const config = typeConfig[entry.type];

                return (
                  <div
                    key={entry.id}
                    className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E3E5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-[#E3E5E8] flex flex-col items-center justify-center text-center shrink-0">
                        <Clock className="w-4 h-4 text-[#315CEB] mb-1" />
                        <span className="text-xs font-mono font-bold text-[#17243A]">
                          {entry.startTime}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={config.badge} size="sm">
                            {config.label}
                          </Badge>
                          <span className="text-xs text-[#667085]">
                            until {entry.endTime}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-[#17243A] leading-snug">
                          {entry.title}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-[#667085] mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#F27C66] shrink-0" />
                          <span>
                            {place?.name} ({place?.building}, {place?.floor})
                          </span>
                        </div>

                        {entry.notes && (
                          <p className="text-xs text-[#475467] italic mt-1.5">
                            Note: {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <button
                        onClick={() => toggleTimetableReminder(entry.id)}
                        className={`p-2 rounded-xl border ${
                          entry.reminderEnabled
                            ? 'bg-[#EEF2FF] text-[#315CEB] border-[#C7D2FE]'
                            : 'bg-white text-[#9CA3AF] border-[#E3E5E8]'
                        }`}
                      >
                        {entry.reminderEnabled ? (
                          <BellRing className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => navigate(`/navigation?to=${entry.placeId}`)}
                        className="px-3.5 py-2 bg-[#315CEB] text-white text-xs font-bold rounded-xl hover:bg-[#2447C5] flex items-center gap-1.5 shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(entry.id)}
                        className="p-2 text-[#9CA3AF] hover:text-[#B93838]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Schedule Commitment"
        subtitle="Ensure no room or time collisions occur with existing lectures."
        maxWidth="lg"
      >
        <form onSubmit={(e) => handleFormCheckAndSubmit(e, false)} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Class / Commitment Title *
            </label>
            <input
              type="text"
              required
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              placeholder="e.g. Distributed Systems & Algorithms (CS-440)..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={entryCourseCode}
                onChange={(e) => setEntryCourseCode(e.target.value)}
                placeholder="CS-482"
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Type
              </label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as TimetableType)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              >
                <option value="class">Lecture / Class</option>
                <option value="assessment">Exam / Assessment</option>
                <option value="workshop">Studio Workshop</option>
                <option value="club">Club Sprint</option>
                <option value="meeting">Team Meeting</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Day of Week
              </label>
              <select
                value={entryDay}
                onChange={(e) => setEntryDay(Number(e.target.value))}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              >
                {daysOfWeek.map((d) => (
                  <option key={d.num} value={d.num}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={entryStartTime}
                onChange={(e) => setEntryStartTime(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={entryEndTime}
                onChange={(e) => setEntryEndTime(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Classroom / Laboratory *
            </label>
            <select
              value={entryPlaceId}
              onChange={(e) => setEntryPlaceId(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.building}, {p.floor})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Notes / Required Preparation
            </label>
            <input
              type="text"
              value={entryNotes}
              onChange={(e) => setEntryNotes(e.target.value)}
              placeholder="e.g. Bring laptop with Figma installed..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A]"
            />
          </div>

          {/* Conflict Warning Alert */}
          {conflictWarning && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-xs text-[#991B1B] space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-[#B93838]" />
                <span>Time Collision Detected!</span>
              </div>
              <p>
                This overlaps with <strong className="font-semibold">{conflictWarning.title}</strong> ({conflictWarning.startTime} – {conflictWarning.endTime}).
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => handleFormCheckAndSubmit(e, true)}
                  className="px-3 py-1 bg-[#B93838] text-white font-bold rounded-lg hover:bg-[#991B1B]"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E5E8]">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Schedule Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        title="Remove Timetable Entry?"
        message="Are you sure you want to remove this commitment from your weekly schedule?"
        confirmText="Remove Entry"
        variant="danger"
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteTimetableEntry(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
