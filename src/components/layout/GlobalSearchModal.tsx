import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { places, events, services, clubs, tasks, timetable } = useApp();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filteredPlaces = cleanQuery
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.building.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredEvents = cleanQuery
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(cleanQuery) ||
          e.category.toLowerCase().includes(cleanQuery) ||
          e.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredClubs = cleanQuery
    ? clubs.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.purpose.toLowerCase().includes(cleanQuery) ||
          c.category.toLowerCase().includes(cleanQuery) ||
          c.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  const filteredServices = cleanQuery
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQuery) ||
          s.purpose.toLowerCase().includes(cleanQuery) ||
          s.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredTasks = cleanQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQuery) ||
          t.description?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredTimetable = cleanQuery
    ? timetable.filter(
        (tt) =>
          tt.title.toLowerCase().includes(cleanQuery) ||
          tt.courseCode?.toLowerCase().includes(cleanQuery) ||
          tt.instructor?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    filteredPlaces.length +
    filteredEvents.length +
    filteredClubs.length +
    filteredServices.length +
    filteredTasks.length +
    filteredTimetable.length;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E3E5E8] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E3E5E8] bg-[#FAF9F5]">
          <Search className="w-5 h-5 text-[#315CEB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classrooms, labs, events, clubs, tasks, services..."
            className="w-full text-base bg-transparent border-none outline-none text-[#17243A] placeholder-[#9CA3AF] font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#9CA3AF] hover:text-[#17243A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-[#667085] bg-white border border-[#E3E5E8] rounded-md shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-5 text-sm divide-y divide-[#E3E5E8]/60">
          {!cleanQuery ? (
            <div className="py-6 px-2 text-center space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-[#EEF2FF] text-[#315CEB]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-[#17243A]">
                  Quick Campus Discovery
                </h3>
                <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                  Type any room number (e.g. &ldquo;304&rdquo;), event title, club name, or student service to jump straight in.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Classroom 304', 'Library', 'Cafeteria', 'AI Workshop', 'Coding Collective', 'IT Support'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1 text-xs font-medium bg-[#F7F6F1] hover:bg-[#EEF2FF] hover:text-[#315CEB] border border-[#E3E5E8] rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <Compass className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
              <p className="font-display font-semibold text-[#17243A]">
                No matching results found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#667085] mt-1">
                Try searching for a broader keyword or check spelling.
              </p>
            </div>
          ) : (
            <>
              {/* Places */}
              {filteredPlaces.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Campus Places ({filteredPlaces.length})
                  </span>
                  <div className="space-y-1">
                    {filteredPlaces.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect(`/navigation?to=${p.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#EEF2FF] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#315CEB] group-hover:bg-white group-hover:shadow-xs transition-all">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-[#17243A] group-hover:text-[#315CEB] truncate">
                              {p.name}
                            </div>
                            <div className="text-xs text-[#667085] truncate">
                              {p.building} · {p.floor}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="cobalt" size="sm">
                            {p.category}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#315CEB] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {filteredEvents.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Events & Workshops ({filteredEvents.length})
                  </span>
                  <div className="space-y-1">
                    {filteredEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect(`/events?highlight=${e.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF1EE] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#F27C66] group-hover:bg-white group-hover:shadow-xs transition-all">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-[#17243A] group-hover:text-[#C2410C] truncate">
                              {e.title}
                            </div>
                            <div className="text-xs text-[#667085] truncate">
                              {new Date(e.startAt).toLocaleDateString([], {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}{' '}
                              · {e.organizer}
                            </div>
                          </div>
                        </div>
                        <Badge variant="coral" size="sm">
                          {e.category}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clubs */}
              {filteredClubs.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Clubs & Societies ({filteredClubs.length})
                  </span>
                  <div className="space-y-1">
                    {filteredClubs.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelect(`/clubs?highlight=${c.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7FEE7] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#3F6212] group-hover:bg-white group-hover:shadow-xs transition-all">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-[#17243A] group-hover:text-[#3F6212] truncate">
                              {c.name}
                            </div>
                            <div className="text-xs text-[#667085] truncate">{c.purpose}</div>
                          </div>
                        </div>
                        <Badge variant="lime" size="sm">
                          {c.recruitmentStatus}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {filteredServices.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Student Services ({filteredServices.length})
                  </span>
                  <div className="space-y-1">
                    {filteredServices.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelect(`/services?highlight=${s.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F5F3FF] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#6D28D9] group-hover:bg-white group-hover:shadow-xs transition-all">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-[#17243A] group-hover:text-[#6D28D9] truncate">
                              {s.name}
                            </div>
                            <div className="text-xs text-[#667085] truncate">{s.openingHours}</div>
                          </div>
                        </div>
                        <Badge variant="lilac" size="sm">
                          {s.category}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {filteredTasks.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Project Tasks ({filteredTasks.length})
                  </span>
                  <div className="space-y-1">
                    {filteredTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect('/projects')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F4F6] text-left transition-colors group"
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium text-[#17243A] truncate">{t.title}</div>
                          <div className="text-xs text-[#667085] truncate">
                            Status: {t.status} · Due: {t.dueDate}
                          </div>
                        </div>
                        <Badge
                          variant={t.priority === 'high' ? 'coral' : t.priority === 'medium' ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {t.priority}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timetable */}
              {filteredTimetable.length > 0 && (
                <div className="pt-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#667085] block mb-2 px-2">
                    Timetable Entries ({filteredTimetable.length})
                  </span>
                  <div className="space-y-1">
                    {filteredTimetable.map((tt) => (
                      <button
                        key={tt.id}
                        onClick={() => handleSelect('/timetable')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#EEF2FF] text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-[#FAF9F5] text-[#315CEB]">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="font-medium text-[#17243A] truncate">{tt.title}</div>
                            <div className="text-xs text-[#667085] truncate">
                              Day {tt.dayOfWeek} · {tt.startTime} – {tt.endTime}
                            </div>
                          </div>
                        </div>
                        <Badge variant="cobalt" size="sm">
                          {tt.type}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#E3E5E8] bg-[#FAF9F5] flex items-center justify-between text-xs text-[#667085]">
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-white border border-[#E3E5E8] rounded shadow-2xs font-semibold">Enter</kbd> to select
          </span>
          <span className="text-[11px] font-medium text-[#315CEB]">Campus Companion Search</span>
        </div>
      </div>
    </div>
  );
};
