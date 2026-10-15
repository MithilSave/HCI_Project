import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Navigation,
  Search,
  Calendar,
  Clock,
  UtensilsCrossed,
  FolderKanban,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    timetable,
    events,
    tasks,
    lostFoundReports,
    cafeteriaItems,
    getPlaceById,
    registerForEvent,
  } = useApp();

  // Time-aware greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }, []);

  // System clock date format
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Find next class/commitment from timetable (sorted by time)
  const currentDayOfWeek = new Date().getDay() || 7; // 1 = Monday, 7 = Sunday
  const nextClass = useMemo(() => {
    const todaysClasses = timetable.filter((t) => t.dayOfWeek === currentDayOfWeek);
    if (todaysClasses.length > 0) {
      return todaysClasses[0];
    }
    // Fallback to first class in timetable
    return timetable[0];
  }, [timetable, currentDayOfWeek]);

  const nextClassPlace = nextClass ? getPlaceById(nextClass.placeId) : undefined;

  // Project task metrics
  const projectMetrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const dueSoon = tasks.filter((t) => t.status !== 'done' && t.priority === 'high').length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, dueSoon, progressPercent };
  }, [tasks]);

  // Upcoming 3 events
  const upcomingEvents = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  // Recent Lost & Found reports
  const recentReports = useMemo(() => {
    return lostFoundReports.slice(0, 3);
  }, [lostFoundReports]);

  // Rotating campus tips
  const tips = [
    'Need quiet study? The Central Library 1st Floor Carrels maintain strict silence with ergonomic seating.',
    'Skip the peak rush: Cafeteria Counter B usually clears between 13:15 and 13:45.',
    'Lab 2 software studio has specialized GPU cloud nodes accessible for CS-482 student projects.',
    'Found an unattended item? Bring it to the Main Gate Security Kiosk for verified cataloging.',
  ];
  const activeTip = tips[new Date().getDate() % tips.length];

  return (
    <div className="space-y-6">
      {/* Editorial Header Block */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
            <span>{todayFormatted}</span>
            <span>·</span>
            <span className="text-[#315CEB]">Campus overview</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#17243A] tracking-tight">
            {greeting}, {profile.displayName.split(' ')[0]}
          </h2>
          <p className="text-sm sm:text-base text-[#475467] mt-1.5 leading-relaxed">
            Here’s your campus at a glance. You have{' '}
            <strong className="text-[#17243A] font-semibold">
              {timetable.filter((t) => t.dayOfWeek === currentDayOfWeek).length || 2} scheduled commitments
            </strong>{' '}
            and{' '}
            <strong className="text-[#17243A] font-semibold">
              {projectMetrics.dueSoon} high-priority tasks
            </strong>{' '}
            on your radar today.
          </p>
        </div>

        {/* Decorative subtle brand geometric motif */}
        <div className="hidden lg:block absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="#315CEB" strokeWidth="4" />
            <path d="M50 10 L50 90 M10 50 L90 50" stroke="#315CEB" strokeWidth="3" />
            <circle cx="50" cy="50" r="16" fill="#DDF36A" />
          </svg>
        </div>
      </section>

      {/* Grid: Next Up & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Up Card */}
        {nextClass && (
          <div className="lg:col-span-2 bg-[#17243A] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#DDF36A] text-xs font-semibold border border-white/15">
                <Clock className="w-3.5 h-3.5" />
                <span>Next commitment · {nextClass.startTime} – {nextClass.endTime}</span>
              </div>
              <Badge variant="lime" size="sm">
                {nextClass.type.toUpperCase()}
              </Badge>
            </div>

            <div className="my-2">
              <h3 className="text-xl sm:text-2xl font-display font-bold leading-snug">
                {nextClass.title}
              </h3>
              {nextClass.instructor && (
                <p className="text-sm text-[#A0AEC0] mt-1">Instructor: {nextClass.instructor}</p>
              )}

              {nextClassPlace && (
                <div className="flex items-center gap-2 mt-3 text-xs text-[#E2E8F0]">
                  <MapPin className="w-4 h-4 text-[#DDF36A] shrink-0" />
                  <span className="font-semibold text-white">{nextClassPlace.name}</span>
                  <span className="text-[#A0AEC0]">({nextClassPlace.building}, {nextClassPlace.floor})</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 mt-4">
              <div className="text-xs text-[#A0AEC0]">
                {nextClass.notes ? (
                  <span className="italic truncate max-w-sm block">Note: {nextClass.notes}</span>
                ) : (
                  <span>Ready to go? Directions are pre-plotted on the campus map.</span>
                )}
              </div>

              <button
                onClick={() => navigate(`/navigation?to=${nextClass.placeId}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <span>Get Directions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#17243A] mb-3">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <button
                onClick={() => navigate('/navigation')}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#EEF2FF] text-left transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] group-hover:bg-white text-[#315CEB] flex items-center justify-center border border-[#E3E5E8] shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A] group-hover:text-[#315CEB]">
                    Find a Room or Lab
                  </div>
                  <div className="text-[11px] text-[#667085]">Schematic route finder</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/lost-found')}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF1EE] text-left transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] group-hover:bg-white text-[#F27C66] flex items-center justify-center border border-[#E3E5E8] shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A] group-hover:text-[#C2410C]">
                    Report Lost or Found
                  </div>
                  <div className="text-[11px] text-[#667085]">Safe item recovery</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/cafeteria')}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F7FEE7] text-left transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] group-hover:bg-white text-[#3F6212] flex items-center justify-center border border-[#E3E5E8] shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A] group-hover:text-[#3F6212]">
                    Cafeteria Queue & Menu
                  </div>
                  <div className="text-[11px] text-[#667085]">Counter wait estimates</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/timetable')}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F5F3FF] text-left transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FAF9F5] group-hover:bg-white text-[#6D28D9] flex items-center justify-center border border-[#E3E5E8] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#17243A] group-hover:text-[#6D28D9]">
                    Full Weekly Schedule
                  </div>
                  <div className="text-[11px] text-[#667085]">Classes and exams</div>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E5E8] mt-3 flex items-center justify-between text-xs text-[#667085]">
            <span>Press Ctrl+K for search</span>
            <Compass className="w-4 h-4 text-[#315CEB]" />
          </div>
        </div>
      </div>

      {/* Row 2: Today's Schedule & Cafeteria Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-[#17243A]">
                Today&rsquo;s Commitments
              </h3>
              <p className="text-xs text-[#667085]">
                {timetable.length} classes and sessions registered this week
              </p>
            </div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-xs font-semibold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
            >
              <span>View full timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {timetable.slice(0, 3).map((item) => {
              const place = getPlaceById(item.placeId);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] flex items-center justify-between gap-4 hover:border-[#315CEB]/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E3E5E8] flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold text-[#667085]">TIME</span>
                      <span className="text-xs font-bold text-[#17243A]">
                        {item.startTime.split(':')[0]}:{item.startTime.split(':')[1]}
                      </span>
                    </div>

                    <div className="truncate">
                      <div className="font-bold text-sm text-[#17243A] truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#315CEB] shrink-0" />
                        <span>{place?.name || item.placeId}</span>
                        {item.courseCode && (
                          <span className="text-[#9CA3AF]">({item.courseCode})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/navigation?to=${item.placeId}`)}
                      className="px-2.5 py-1 text-xs font-medium text-[#315CEB] hover:bg-[#EEF2FF] rounded-lg transition-colors hidden sm:inline-block"
                    >
                      Route
                    </button>
                    <Badge variant={item.type === 'class' ? 'cobalt' : item.type === 'assessment' ? 'coral' : 'lime'} size="sm">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cafeteria Snapshot */}
        <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-[#17243A]">
                Dining Commons
              </h3>
              <Badge variant="mint" size="sm" dot>
                Open Now
              </Badge>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7FEE7] border border-[#D9F99D] mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#3F6212]">
                  Seating Availability
                </span>
                <span className="text-xs font-bold text-[#3F6212]">68% Full</span>
              </div>
              <div className="w-full h-1.5 bg-[#D9F99D] rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-[#65A30D] rounded-full w-[68%]" />
              </div>
              <span className="text-[10px] text-[#4D7C0F] block mt-1">
                Sample estimate · Dining Commons Ground Floor
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8]">
                <span className="font-medium text-[#17243A]">Counter A (Hot Meals)</span>
                <span className="font-bold text-[#A96116]">~8 min wait</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8]">
                <span className="font-medium text-[#17243A]">Counter B (Bowls & Drinks)</span>
                <span className="font-bold text-[#20845A]">~3 min wait</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between">
            <span className="text-xs text-[#667085]">
              {cafeteriaItems.length} menu items available
            </span>
            <button
              onClick={() => navigate('/cafeteria')}
              className="text-xs font-bold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
            >
              <span>See Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Events Worth a Look & Project Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Worth a Look */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-[#17243A]">
                Events Worth a Look
              </h3>
              <p className="text-xs text-[#667085]">
                Upcoming workshops, jams, and student activities
              </p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
            >
              <span>All events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((evt) => {
              const isRegistered = evt.registeredUserIds.includes(profile.id);
              const venue = getPlaceById(evt.venuePlaceId);
              return (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] flex flex-col justify-between hover:shadow-xs transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="coral" size="sm">
                        {evt.category}
                      </Badge>
                      <span className="text-[11px] font-semibold text-[#667085]">
                        {new Date(evt.startAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-[#17243A] leading-snug line-clamp-2">
                      {evt.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-[#667085] mt-2 truncate">
                      <MapPin className="w-3 h-3 text-[#F27C66] shrink-0" />
                      <span className="truncate">{venue?.name || 'Campus Venue'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E3E5E8] mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#667085]">
                      {evt.registeredCount}/{evt.capacity} booked
                    </span>
                    <button
                      onClick={() => {
                        if (!isRegistered) registerForEvent(evt.id);
                        else navigate('/events');
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
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

        {/* Project Pulse */}
        <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-[#17243A]">
                Project Pulse
              </h3>
              <Badge variant="cobalt" size="sm">
                CS-482 Studio
              </Badge>
            </div>

            <p className="text-xs text-[#667085] mb-4">
              Campus Companion Prototype & Evaluation
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#17243A]">Sprint Progress</span>
                  <span className="font-bold text-[#315CEB]">
                    {projectMetrics.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#315CEB] rounded-full transition-all duration-300"
                    style={{ width: `${projectMetrics.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] text-center">
                  <span className="text-xl font-bold font-display text-[#17243A] block">
                    {projectMetrics.completed}/{projectMetrics.total}
                  </span>
                  <span className="text-[11px] text-[#667085]">Tasks Done</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FFF1EE] border border-[#FFDDD2] text-center">
                  <span className="text-xl font-bold font-display text-[#C2410C] block">
                    {projectMetrics.dueSoon}
                  </span>
                  <span className="text-[11px] text-[#C2410C]">High Priority</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between">
            <span className="text-xs text-[#667085]">Kanban workflow active</span>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-bold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
            >
              <span>Open Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Lost & Found Activity & Campus Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lost & Found Matches */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-[#17243A]">
                Lost & Found Recent Reports
              </h3>
              <p className="text-xs text-[#667085]">
                Recent items reported across classrooms, labs, and cafeteria
              </p>
            </div>
            <button
              onClick={() => navigate('/lost-found')}
              className="text-xs font-semibold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
            >
              <span>View all reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => navigate('/lost-found')}
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8] hover:border-[#315CEB]/40 cursor-pointer transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      report.type === 'lost' ? 'bg-[#F27C66]' : 'bg-[#315CEB]'
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-semibold text-xs sm:text-sm text-[#17243A] truncate">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-[#667085] truncate">
                      {report.location} · {report.date}
                    </div>
                  </div>
                </div>

                <Badge
                  variant={
                    report.status === 'ready-for-handover'
                      ? 'mint'
                      : report.status === 'potential-match'
                      ? 'coral'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {report.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Useful Campus Tip Card */}
        <div className="bg-[#FAF9F5] rounded-3xl p-6 border border-[#E3E5E8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex p-2.5 rounded-xl bg-[#EEF2FF] text-[#315CEB] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#17243A] mb-1">
              Campus Field Tip
            </h3>
            <p className="text-xs text-[#475467] leading-relaxed mt-2">
              &ldquo;{activeTip}&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between text-xs text-[#667085]">
            <span>Student Life Wisdom</span>
            <span className="font-semibold text-[#17243A]">Verified Advice</span>
          </div>
        </div>
      </div>
    </div>
  );
};
