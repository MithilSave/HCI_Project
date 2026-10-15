import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CampusEvent } from '../types';
import {
  Calendar as CalIcon,
  Search,
  MapPin,
  Clock,
  Users,
  Bell,
  BellRing,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  List,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    events,
    profile,
    getPlaceById,
    registerForEvent,
    unregisterFromEvent,
    toggleEventReminder,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showRegisteredOnly, setShowRegisteredOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventModal, setSelectedEventModal] = useState<CampusEvent | null>(null);

  // Check highlight query param from global search
  React.useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      const target = events.find((e) => e.id === highlight);
      if (target) setSelectedEventModal(target);
    }
  }, [searchParams, events]);

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Career',
    'Workshop',
    'Community',
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;
      if (showRegisteredOnly && !evt.registeredUserIds.includes(profile.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          evt.title.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q) ||
          evt.organizer.toLowerCase().includes(q) ||
          evt.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [events, selectedCategory, showRegisteredOnly, searchQuery, profile]);

  const handleRegisterToggle = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    const isRegistered = evt.registeredUserIds.includes(profile.id);
    if (isRegistered) {
      unregisterFromEvent(eventId);
    } else {
      registerForEvent(eventId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F27C66]" />
            <span>Campus Engagement Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Events, Workshops & Campus Life
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Never miss a hackathon, guest lecture, or cultural walk. Direct calendar integration and room directions.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-[#FAF9F5] rounded-2xl border border-[#E3E5E8] self-start md:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#17243A] shadow-xs'
                : 'text-[#667085] hover:text-[#17243A]'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-[#17243A] shadow-xs'
                : 'text-[#667085] hover:text-[#17243A]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-4">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#17243A] text-white border-[#17243A]'
                  : 'bg-[#FAF9F5] text-[#667085] border-[#E3E5E8] hover:border-[#315CEB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & My Registrations Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E3E5E8]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, club, or tags..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#17243A]">
            <input
              type="checkbox"
              checked={showRegisteredOnly}
              onChange={(e) => setShowRegisteredOnly(e.target.checked)}
              className="rounded border-[#E3E5E8] text-[#315CEB] focus:ring-[#315CEB] w-4 h-4"
            />
            <span>Show my registered events only</span>
          </label>
        </div>
      </div>

      {/* Events View: List or Calendar */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => {
            const isRegistered = evt.registeredUserIds.includes(profile.id);
            const hasReminder = evt.reminderEnabledUserIds.includes(profile.id);
            const venue = getPlaceById(evt.venuePlaceId);
            const occupancyPct = Math.round((evt.registeredCount / evt.capacity) * 100);

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="coral" size="sm">
                      {evt.category}
                    </Badge>
                    <button
                      onClick={() => toggleEventReminder(evt.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        hasReminder
                          ? 'bg-[#EEF2FF] text-[#315CEB] border-[#C7D2FE]'
                          : 'bg-[#FAF9F5] text-[#9CA3AF] border-[#E3E5E8] hover:text-[#17243A]'
                      }`}
                      title={hasReminder ? 'Reminder enabled' : 'Turn on reminder'}
                    >
                      {hasReminder ? (
                        <BellRing className="w-3.5 h-3.5 text-[#315CEB]" />
                      ) : (
                        <Bell className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#17243A] leading-snug">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-[#667085]">
                    <div className="flex items-center gap-2">
                      <CalIcon className="w-3.5 h-3.5 text-[#315CEB] shrink-0" />
                      <span className="font-semibold text-[#17243A]">
                        {new Date(evt.startAt).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        ·{' '}
                        {new Date(evt.startAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F27C66] shrink-0" />
                      <span className="truncate">{venue?.name || 'Campus Venue'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#475467] mt-3 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Capacity Bar */}
                  <div className="mt-4 pt-3 border-t border-[#E3E5E8]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#667085]">Registration Capacity</span>
                      <span className="font-bold text-[#17243A]">
                        {evt.registeredCount}/{evt.capacity} spots
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancyPct > 85 ? 'bg-[#F27C66]' : 'bg-[#315CEB]'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedEventModal(evt)}
                    className="text-xs font-semibold text-[#475467] hover:text-[#17243A]"
                  >
                    Details & Venue
                  </button>

                  <button
                    onClick={() => handleRegisterToggle(evt.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors shadow-2xs ${
                      isRegistered
                        ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] hover:bg-[#DCFCE7]'
                        : 'bg-[#315CEB] text-white hover:bg-[#2447C5]'
                    }`}
                  >
                    {isRegistered ? 'Registered (Cancel)' : 'Register Spot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar Agenda Layout */
        <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#17243A]">
            Upcoming Events Schedule
          </h3>
          <div className="divide-y divide-[#E3E5E8]">
            {filteredEvents.map((evt) => {
              const isRegistered = evt.registeredUserIds.includes(profile.id);
              const venue = getPlaceById(evt.venuePlaceId);
              const eventDate = new Date(evt.startAt);

              return (
                <div
                  key={`cal-${evt.id}`}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-[#667085]">
                        {eventDate.toLocaleDateString([], { month: 'short' })}
                      </span>
                      <span className="text-base font-bold font-display text-[#17243A]">
                        {eventDate.getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="coral" size="sm">
                          {evt.category}
                        </Badge>
                        <span className="text-xs text-[#667085]">
                          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#17243A]">{evt.title}</h4>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {venue?.name} · Organized by {evt.organizer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setSelectedEventModal(evt)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#475467] hover:bg-[#F3F4F6] rounded-xl border border-[#E3E5E8]"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleRegisterToggle(evt.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl ${
                        isRegistered
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                          : 'bg-[#315CEB] text-white hover:bg-[#2447C5]'
                      }`}
                    >
                      {isRegistered ? 'Registered' : 'Register'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEventModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEventModal(null)}
          title={selectedEventModal.title}
          subtitle={`Organized by ${selectedEventModal.organizer}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="coral">{selectedEventModal.category}</Badge>
              <span className="text-xs font-semibold text-[#667085]">
                {selectedEventModal.registeredCount}/{selectedEventModal.capacity} Registered
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#17243A]">
                <CalIcon className="w-4 h-4 text-[#315CEB]" />
                <span className="font-semibold">
                  {new Date(selectedEventModal.startAt).toLocaleString([], {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#17243A]">
                  <MapPin className="w-4 h-4 text-[#F27C66]" />
                  <span>
                    {getPlaceById(selectedEventModal.venuePlaceId)?.name || 'Campus Venue'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate(`/navigation?to=${selectedEventModal.venuePlaceId}`);
                    setSelectedEventModal(null);
                  }}
                  className="text-xs font-bold text-[#315CEB] hover:underline flex items-center gap-1"
                >
                  <span>Route on Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#17243A] uppercase tracking-wider mb-1">
                Overview & Description
              </h4>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                {selectedEventModal.description}
              </p>
            </div>

            {selectedEventModal.requirements && (
              <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl text-xs text-[#2447C5]">
                <span className="font-bold block mb-0.5">Attendee Requirements:</span>
                <p>{selectedEventModal.requirements}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedEventModal.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-[11px] font-medium text-[#667085]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E3E5E8] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEventReminder(selectedEventModal.id)}
                  className="px-3 py-2 rounded-xl border border-[#E3E5E8] text-xs font-semibold text-[#475467] hover:bg-[#FAF9F5] flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {selectedEventModal.reminderEnabledUserIds.includes(profile.id)
                      ? 'Reminder Set'
                      : 'Remind Me'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    handleRegisterToggle(selectedEventModal.id);
                    setSelectedEventModal(null);
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
                    selectedEventModal.registeredUserIds.includes(profile.id)
                      ? 'bg-[#FEF2F2] text-[#B93838] border border-[#FECACA] hover:bg-[#FEE2E2]'
                      : 'bg-[#315CEB] text-white hover:bg-[#2447C5]'
                  }`}
                >
                  {selectedEventModal.registeredUserIds.includes(profile.id)
                    ? 'Cancel Registration'
                    : 'Confirm Registration'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
