import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NotificationCategory, AppNotification } from '../types';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Clock,
  Calendar,
  UtensilsCrossed,
  Search,
  FolderKanban,
  Megaphone,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: (NotificationCategory | 'All')[] = [
    'All',
    'Classes & timetable',
    'Events',
    'Projects',
    'Lost & Found',
    'Cafeteria',
    'Campus updates',
  ];

  const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
    'Classes & timetable': <Clock className="w-4 h-4 text-[#315CEB]" />,
    Events: <Calendar className="w-4 h-4 text-[#F27C66]" />,
    Projects: <FolderKanban className="w-4 h-4 text-[#20845A]" />,
    'Lost & Found': <Search className="w-4 h-4 text-[#C2410C]" />,
    Cafeteria: <UtensilsCrossed className="w-4 h-4 text-[#65A30D]" />,
    'Campus updates': <Megaphone className="w-4 h-4 text-[#6D28D9]" />,
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;
      return true;
    });
  }, [notifications, selectedCategory]);

  // Group into Today and Earlier
  const { todayList, earlierList } = useMemo(() => {
    const today: AppNotification[] = [];
    const earlier: AppNotification[] = [];

    const now = new Date();
    const todayDateStr = now.toISOString().split('T')[0];

    filteredNotifications.forEach((n) => {
      const nDateStr = new Date(n.createdAt).toISOString().split('T')[0];
      if (nDateStr === todayDateStr) {
        today.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { todayList: today, earlierList: earlier };
  }, [filteredNotifications]);

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.targetPath) {
      navigate(notif.targetPath);
    }
  };

  const renderNotificationCard = (notif: AppNotification) => {
    const isUnread = !notif.readAt;

    return (
      <div
        key={notif.id}
        onClick={() => handleNotificationClick(notif)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
          isUnread
            ? 'bg-white border-[#C7D2FE] shadow-xs hover:border-[#315CEB]'
            : 'bg-[#FAF9F5] border-[#E3E5E8] hover:bg-white hover:border-[#CBD5E1]'
        }`}
      >
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={`p-2.5 rounded-xl border shrink-0 ${
              isUnread ? 'bg-[#EEF2FF] border-[#C7D2FE]' : 'bg-white border-[#E3E5E8]'
            }`}
          >
            {categoryIcons[notif.category] || <Bell className="w-4 h-4 text-[#315CEB]" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Badge variant={isUnread ? 'cobalt' : 'neutral'} size="sm">
                {notif.category}
              </Badge>
              <span className="text-[11px] text-[#667085]">
                {new Date(notif.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {isUnread && (
                <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
              )}
            </div>

            <h4
              className={`text-sm leading-snug ${
                isUnread ? 'font-bold text-[#17243A]' : 'font-medium text-[#475467]'
              }`}
            >
              {notif.title}
            </h4>

            <p className="text-xs text-[#667085] mt-1 leading-relaxed">
              {notif.body}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-center">
          {isUnread && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markNotificationAsRead(notif.id);
              }}
              className="p-1.5 rounded-lg text-[#315CEB] hover:bg-[#EEF2FF]"
              title="Mark read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(notif.id);
            }}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#B93838] hover:bg-[#FEF2F2]"
            title="Dismiss notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
            <span>Real-time In-App Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Campus Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Live updates for timetable reminders, lost item matches, cafeteria order tickets, and group project changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-white hover:bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-bold rounded-xl text-[#17243A] flex items-center gap-2 transition-colors shadow-2xs"
          >
            <CheckCheck className="w-4 h-4 text-[#315CEB]" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors border ${
              selectedCategory === cat
                ? 'bg-[#17243A] text-white border-[#17243A]'
                : 'bg-white text-[#667085] border-[#E3E5E8] hover:border-[#315CEB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List Grouped */}
      <div className="space-y-6">
        {todayList.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block px-1">
              Today
            </span>
            <div className="space-y-2.5">
              {todayList.map(renderNotificationCard)}
            </div>
          </div>
        )}

        {earlierList.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block px-1">
              Earlier This Week
            </span>
            <div className="space-y-2.5">
              {earlierList.map(renderNotificationCard)}
            </div>
          </div>
        )}

        {todayList.length === 0 && earlierList.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E3E5E8]">
            <Bell className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
            <h3 className="font-display font-bold text-base text-[#17243A]">
              All caught up!
            </h3>
            <p className="text-xs text-[#667085] mt-1">
              No new alerts in this category right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
