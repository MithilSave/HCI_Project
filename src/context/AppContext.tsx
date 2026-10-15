import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CampusPlace,
  LostFoundReport,
  CampusEvent,
  Project,
  ProjectTask,
  CafeteriaItem,
  CafeteriaOrder,
  OrderItem,
  Club,
  StudentService,
  TimetableEntry,
  AppNotification,
  UserProfile,
  FeedbackItem,
  ToastMessage,
  ToastType,
  ReportStatus,
  TaskStatus,
} from '../types';
import {
  SEED_PLACES,
  SEED_LOST_FOUND,
  SEED_CAFETERIA_ITEMS,
  SEED_EVENTS,
  SEED_PROJECTS,
  SEED_PROJECT_TASKS,
  SEED_CLUBS,
  SEED_SERVICES,
  SEED_TIMETABLE,
  SEED_NOTIFICATIONS,
  SEED_PROFILE,
} from '../data/seedData';

const STORAGE_KEY = 'CAMPUS_COMPANION_STATE_V1.1';

interface AppContextType {
  places: CampusPlace[];
  lostFoundReports: LostFoundReport[];
  cafeteriaItems: CafeteriaItem[];
  cafeteriaOrders: CafeteriaOrder[];
  cart: OrderItem[];
  events: CampusEvent[];
  projects: Project[];
  tasks: ProjectTask[];
  clubs: Club[];
  services: StudentService[];
  timetable: TimetableEntry[];
  notifications: AppNotification[];
  profile: UserProfile;
  feedback: FeedbackItem[];
  toasts: ToastMessage[];

  // Toast actions
  addToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  // Profile & Saved actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleSavePlace: (placeId: string) => void;
  toggleSaveClub: (clubId: string) => void;
  toggleSaveService: (serviceId: string) => void;

  // Lost & Found
  addLostFoundReport: (report: Omit<LostFoundReport, 'id' | 'createdAt' | 'status' | 'createdBy'>) => LostFoundReport;
  updateReportStatus: (reportId: string, status: ReportStatus, handoverCode?: string, claimNotes?: string) => void;
  claimReport: (reportId: string, privateProof: string) => { handoverCode: string };
  resolveReport: (reportId: string) => void;

  // Cafeteria
  addToCart: (item: CafeteriaItem) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (counter?: string) => CafeteriaOrder;
  advanceOrderStatus: (orderId: string) => void;

  // Events
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent: (eventId: string) => void;
  toggleEventReminder: (eventId: string) => void;

  // Projects
  addTask: (task: Omit<ProjectTask, 'id' | 'comments' | 'checklist'> & { checklistItems?: string[] }) => void;
  updateTask: (taskId: string, updates: Partial<ProjectTask>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  toggleChecklistItem: (taskId: string, checklistId: string) => void;
  addCommentToTask: (taskId: string, text: string) => void;

  // Clubs
  toggleClubMembership: (clubId: string) => void;
  toggleClubInterest: (clubId: string) => void;

  // Timetable
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => TimetableEntry;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  toggleTimetableReminder: (id: string) => void;
  checkTimetableOverlap: (dayOfWeek: number, startTime: string, endTime: string, excludeId?: string) => TimetableEntry | null;

  // Notifications
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;

  // Helpers
  getPlaceById: (id: string) => CampusPlace | undefined;
  submitFeedback: (category: FeedbackItem['category'], module: string, message: string) => void;
  resetDemoData: () => void;
  exportDataAsJson: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage with fallback to SEED
  const loadInitialState = <T,>(key: string, seed: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // In case localStorage is blocked or corrupted
    }
    return seed;
  };

  const places = SEED_PLACES;
  const [lostFoundReports, setLostFoundReports] = useState<LostFoundReport[]>(() =>
    loadInitialState('lostFound', SEED_LOST_FOUND)
  );
  const [cafeteriaItems] = useState<CafeteriaItem[]>(SEED_CAFETERIA_ITEMS);
  const [cafeteriaOrders, setCafeteriaOrders] = useState<CafeteriaOrder[]>(() =>
    loadInitialState('cafeteriaOrders', [
      {
        id: 'ord-101',
        orderNumber: 'CC-290',
        items: [
          { item: SEED_CAFETERIA_ITEMS[0], quantity: 1 },
          { item: SEED_CAFETERIA_ITEMS[7], quantity: 1 },
        ],
        totalAmount: 10.25,
        status: 'Ready',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        counter: 'Healthy Bowls & Beverages',
        estimatedPickupMinutes: 0,
      },
    ])
  );
  const [cart, setCart] = useState<OrderItem[]>(() => loadInitialState('cart', []));
  const [events, setEvents] = useState<CampusEvent[]>(() => loadInitialState('events', SEED_EVENTS));
  const [projects] = useState<Project[]>(SEED_PROJECTS);
  const [tasks, setTasks] = useState<ProjectTask[]>(() => loadInitialState('tasks', SEED_PROJECT_TASKS));
  const [clubs, setClubs] = useState<Club[]>(() => loadInitialState('clubs', SEED_CLUBS));
  const [services] = useState<StudentService[]>(SEED_SERVICES);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => loadInitialState('timetable', SEED_TIMETABLE));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadInitialState('notifications', SEED_NOTIFICATIONS)
  );
  const [profile, setProfile] = useState<UserProfile>(() => loadInitialState('profile', SEED_PROFILE));
  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => loadInitialState('feedback', []));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage safely
  const persist = (key: string, value: unknown) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
    } catch {
      // Storage quota or privacy mode error ignored safely
    }
  };

  useEffect(() => persist('lostFound', lostFoundReports), [lostFoundReports]);
  useEffect(() => persist('cafeteriaOrders', cafeteriaOrders), [cafeteriaOrders]);
  useEffect(() => persist('cart', cart), [cart]);
  useEffect(() => persist('events', events), [events]);
  useEffect(() => persist('tasks', tasks), [tasks]);
  useEffect(() => persist('clubs', clubs), [clubs]);
  useEffect(() => persist('timetable', timetable), [timetable]);
  useEffect(() => persist('notifications', notifications), [notifications]);
  useEffect(() => persist('profile', profile), [profile]);
  useEffect(() => persist('feedback', feedback), [feedback]);

  // Toast System
  const addToast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper
  const getPlaceById = (id: string): CampusPlace | undefined => {
    return places.find((p) => p.id === id);
  };

  // Profile & Saved Actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    addToast('Profile updated', 'Your preferences have been saved locally.', 'success');
  };

  const toggleSavePlace = (placeId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedPlaceIds.includes(placeId);
      const updated = isSaved
        ? prev.savedPlaceIds.filter((id) => id !== placeId)
        : [...prev.savedPlaceIds, placeId];
      const place = getPlaceById(placeId);
      addToast(
        isSaved ? 'Place removed' : 'Place saved',
        place ? `${place.name} has been ${isSaved ? 'removed from' : 'added to'} your saved places.` : undefined,
        'info'
      );
      return { ...prev, savedPlaceIds: updated };
    });
  };

  const toggleSaveClub = (clubId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedClubIds.includes(clubId);
      const updated = isSaved
        ? prev.savedClubIds.filter((id) => id !== clubId)
        : [...prev.savedClubIds, clubId];
      const club = clubs.find((c) => c.id === clubId);
      addToast(
        isSaved ? 'Club unbookmarked' : 'Club bookmarked',
        club ? `${club.name} ${isSaved ? 'removed from' : 'saved to'} your favorites.` : undefined,
        'info'
      );
      return { ...prev, savedClubIds: updated };
    });
  };

  const toggleSaveService = (serviceId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedServiceIds.includes(serviceId);
      const updated = isSaved
        ? prev.savedServiceIds.filter((id) => id !== serviceId)
        : [...prev.savedServiceIds, serviceId];
      const srv = services.find((s) => s.id === serviceId);
      addToast(
        isSaved ? 'Service removed' : 'Service saved',
        srv ? `${srv.name} saved for quick access.` : undefined,
        'info'
      );
      return { ...prev, savedServiceIds: updated };
    });
  };

  // Lost & Found
  const addLostFoundReport = (
    reportData: Omit<LostFoundReport, 'id' | 'createdAt' | 'status' | 'createdBy'>
  ): LostFoundReport => {
    const id = `LF-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: LostFoundReport = {
      ...reportData,
      id,
      status: 'reported',
      createdAt: new Date().toISOString(),
      createdBy: profile.displayName || 'Alex Chen',
    };

    setLostFoundReports((prev) => [newReport, ...prev]);

    // Create an in-app notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `${newReport.type === 'lost' ? 'Lost' : 'Found'} Item Logged: ${newReport.title}`,
      body: `Your report (#${id}) is now active. We'll alert you if a matching item is reported.`,
      category: 'Lost & Found',
      createdAt: new Date().toISOString(),
      targetPath: '/lost-found',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'Report Submitted',
      `Reference ID: #${id}. Report is now live for matching.`,
      'success'
    );
    return newReport;
  };

  const updateReportStatus = (
    reportId: string,
    status: ReportStatus,
    handoverCode?: string,
    claimNotes?: string
  ) => {
    setLostFoundReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status, handoverCode: handoverCode || r.handoverCode, claimNotes: claimNotes || r.claimNotes } : r
      )
    );
  };

  const claimReport = (reportId: string, privateProof: string): { handoverCode: string } => {
    const handoverCode = `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    setLostFoundReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'ready-for-handover',
              handoverCode,
              claimNotes: privateProof,
              handoverLocation: r.handoverLocation || 'Campus Security & Central Lost Property (Main Gate)',
            }
          : r
      )
    );

    const targetReport = lostFoundReports.find((r) => r.id === reportId);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Handover Code Issued: ${handoverCode}`,
      body: `Your claim for "${targetReport?.title || 'Item'}" has been approved. Present this code at the security desk for pickup.`,
      category: 'Lost & Found',
      createdAt: new Date().toISOString(),
      targetPath: '/lost-found',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'Claim Registered!',
      `Handover Code: ${handoverCode}. Head to Central Security Desk with your ID.`,
      'success'
    );
    return { handoverCode };
  };

  const resolveReport = (reportId: string) => {
    setLostFoundReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    addToast('Report Resolved', 'The item report has been archived as resolved.', 'info');
  };

  // Cafeteria
  const addToCart = (item: CafeteriaItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    addToast('Added to cart', `${item.name} ($${item.price.toFixed(2)})`, 'info');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.item.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is OrderItem => i !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== itemId));
    addToast('Item removed from cart', undefined, 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (counter = 'Express Food Counter'): CafeteriaOrder => {
    const totalAmount = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
    const orderNumber = `CC-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: CafeteriaOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: [...cart],
      totalAmount,
      status: 'Received',
      createdAt: new Date().toISOString(),
      counter,
      estimatedPickupMinutes: 8,
    };

    setCafeteriaOrders((prev) => [newOrder, ...prev]);
    clearCart();

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Order Placed #${orderNumber}`,
      body: `Estimated preparation time: 8-10 minutes at ${counter}.`,
      category: 'Cafeteria',
      createdAt: new Date().toISOString(),
      targetPath: '/cafeteria',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'Demo Order Confirmed!',
      `Order #${orderNumber} received. Simulated status: Received.`,
      'success'
    );
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    setCafeteriaOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        let nextStatus: CafeteriaOrder['status'] = ord.status;
        if (ord.status === 'Received') nextStatus = 'Preparing';
        else if (ord.status === 'Preparing') nextStatus = 'Ready';
        else if (ord.status === 'Ready') nextStatus = 'Completed';

        if (nextStatus === 'Ready') {
          const notif: AppNotification = {
            id: `notif-${Date.now()}`,
            title: `Order #${ord.orderNumber} Ready!`,
            body: `Your order is hot and ready at ${ord.counter}. Please collect.`,
            category: 'Cafeteria',
            createdAt: new Date().toISOString(),
            targetPath: '/cafeteria',
          };
          setNotifications((n) => [notif, ...n]);
        }

        addToast(
          `Order #${ord.orderNumber} Updated`,
          `Status changed to ${nextStatus}`,
          'info'
        );
        return { ...ord, status: nextStatus };
      })
    );
  };

  // Events
  const registerForEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          if (e.registeredUserIds.includes(profile.id)) return e;
          const updated = {
            ...e,
            registeredCount: e.registeredCount + 1,
            registeredUserIds: [...e.registeredUserIds, profile.id],
          };

          const notif: AppNotification = {
            id: `notif-${Date.now()}`,
            title: `Registered: ${e.title}`,
            body: `You are confirmed! Event starts at ${new Date(e.startAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
            category: 'Events',
            createdAt: new Date().toISOString(),
            targetPath: '/events',
          };
          setNotifications((n) => [notif, ...n]);

          addToast('Registration Successful', `You're all set for ${e.title}!`, 'success');
          return updated;
        }
        return e;
      })
    );
  };

  const unregisterFromEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const updated = {
            ...e,
            registeredCount: Math.max(0, e.registeredCount - 1),
            registeredUserIds: e.registeredUserIds.filter((id) => id !== profile.id),
            reminderEnabledUserIds: e.reminderEnabledUserIds.filter((id) => id !== profile.id),
          };
          addToast('Registration Cancelled', `You have unregistered from ${e.title}.`, 'info');
          return updated;
        }
        return e;
      })
    );
  };

  const toggleEventReminder = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const hasReminder = e.reminderEnabledUserIds.includes(profile.id);
          const updatedReminders = hasReminder
            ? e.reminderEnabledUserIds.filter((id) => id !== profile.id)
            : [...e.reminderEnabledUserIds, profile.id];

          addToast(
            hasReminder ? 'Reminder removed' : 'In-app reminder set',
            hasReminder
              ? `Reminder turned off for ${e.title}.`
              : `You'll be alerted in the Notification Center before ${e.title} starts.`,
            'info'
          );

          if (!hasReminder) {
            const notif: AppNotification = {
              id: `notif-${Date.now()}`,
              title: `Reminder Active: ${e.title}`,
              body: `We will highlight this event on your dashboard on ${new Date(e.startAt).toLocaleDateString()}.`,
              category: 'Events',
              createdAt: new Date().toISOString(),
              targetPath: '/events',
            };
            setNotifications((n) => [notif, ...n]);
          }

          return { ...e, reminderEnabledUserIds: updatedReminders };
        }
        return e;
      })
    );
  };

  // Projects & Tasks
  const addTask = (
    taskData: Omit<ProjectTask, 'id' | 'comments' | 'checklist'> & { checklistItems?: string[] }
  ) => {
    const id = `task-${Date.now()}`;
    const checklist = (taskData.checklistItems || []).map((text, idx) => ({
      id: `cl-${idx}-${Date.now()}`,
      text,
      done: false,
    }));

    const newTask: ProjectTask = {
      ...taskData,
      id,
      checklist,
      comments: [],
    };

    setTasks((prev) => [newTask, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `New Task Created: ${newTask.title}`,
      body: `Assigned to ${newTask.assigneeName || 'Unassigned'} with ${newTask.priority} priority.`,
      category: 'Projects',
      createdAt: new Date().toISOString(),
      targetPath: '/projects',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Task Created', `"${newTask.title}" added to ${newTask.status.toUpperCase()}`, 'success');
  };

  const updateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    addToast('Task Updated', undefined, 'info');
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addToast('Task Deleted', 'The task has been permanently removed.', 'info');
  };

  const moveTask = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    addToast('Task Moved', `Status set to ${status.replace('-', ' ').toUpperCase()}`, 'info');
  };

  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((c) =>
          c.id === checklistId ? { ...c, done: !c.done } : c
        );
        return { ...t, checklist: updatedChecklist };
      })
    );
  };

  const addCommentToTask = (taskId: string, text: string) => {
    const newComment = {
      id: `cm-${Date.now()}`,
      author: profile.displayName || 'Alex Chen',
      text,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t
      )
    );
    addToast('Comment posted', undefined, 'info');
  };

  // Clubs
  const toggleClubMembership = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const isMember = !c.isMember;
          const updated = {
            ...c,
            isMember,
            isInterested: false,
            membersCount: isMember ? c.membersCount + 1 : Math.max(1, c.membersCount - 1),
          };

          addToast(
            isMember ? 'Joined Club!' : 'Left Club',
            isMember ? `You are now a member of ${c.name}.` : `You have withdrawn from ${c.name}.`,
            isMember ? 'success' : 'info'
          );

          if (isMember) {
            const notif: AppNotification = {
              id: `notif-${Date.now()}`,
              title: `Welcome to ${c.name}!`,
              body: `Next activity: ${c.nextActivity} on ${c.nextActivityDate || 'TBA'}.`,
              category: 'Campus updates',
              createdAt: new Date().toISOString(),
              targetPath: '/clubs',
            };
            setNotifications((n) => [notif, ...n]);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const toggleClubInterest = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const isInterested = !c.isInterested;
          addToast(
            isInterested ? 'Interest Submitted' : 'Interest Withdrawn',
            isInterested
              ? `The coordinators of ${c.name} have received your application inquiry.`
              : `Your expression of interest for ${c.name} was withdrawn.`,
            'info'
          );
          return { ...c, isInterested };
        }
        return c;
      })
    );
  };

  // Timetable
  const checkTimetableOverlap = (
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): TimetableEntry | null => {
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    for (const entry of timetable) {
      if (entry.id === excludeId) continue;
      if (entry.dayOfWeek === dayOfWeek) {
        const entryStart = toMinutes(entry.startTime);
        const entryEnd = toMinutes(entry.endTime);
        // Check for time overlap
        if (newStart < entryEnd && newEnd > entryStart) {
          return entry;
        }
      }
    }
    return null;
  };

  const addTimetableEntry = (entryData: Omit<TimetableEntry, 'id'>): TimetableEntry => {
    const id = `tt-${Date.now()}`;
    const newEntry: TimetableEntry = { ...entryData, id };
    setTimetable((prev) => [...prev, newEntry]);

    addToast(
      'Timetable Updated',
      `"${newEntry.title}" added to your weekly schedule.`,
      'success'
    );
    return newEntry;
  };

  const updateTimetableEntry = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetable((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    addToast('Schedule entry updated', undefined, 'info');
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((e) => e.id !== id));
    addToast('Schedule entry deleted', undefined, 'info');
  };

  const toggleTimetableReminder = (id: string) => {
    setTimetable((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const reminderEnabled = !e.reminderEnabled;
          addToast(
            reminderEnabled ? 'Class reminder enabled' : 'Class reminder disabled',
            `You will ${reminderEnabled ? 'receive in-app alerts' : 'no longer be alerted'} 15 minutes before ${e.title}.`,
            'info'
          );
          return { ...e, reminderEnabled };
        }
        return e;
      })
    );
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.readAt).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
    );
    addToast('All notifications marked as read', undefined, 'info');
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Feedback
  const submitFeedback = (
    category: FeedbackItem['category'],
    module: string,
    message: string
  ) => {
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      category,
      module,
      message,
      createdAt: new Date().toISOString(),
    };
    setFeedback((prev) => [newFeedback, ...prev]);
    addToast('Feedback Saved', 'Thank you! Your feedback has been recorded locally.', 'success');
  };

  // Reset demo state
  const resetDemoData = () => {
    try {
      // Clear localStorage for this app key
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore
    }

    setLostFoundReports(SEED_LOST_FOUND);
    setCafeteriaOrders([
      {
        id: 'ord-101',
        orderNumber: 'CC-290',
        items: [
          { item: SEED_CAFETERIA_ITEMS[0], quantity: 1 },
          { item: SEED_CAFETERIA_ITEMS[7], quantity: 1 },
        ],
        totalAmount: 10.25,
        status: 'Ready',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        counter: 'Healthy Bowls & Beverages',
        estimatedPickupMinutes: 0,
      },
    ]);
    setCart([]);
    setEvents(SEED_EVENTS);
    setTasks(SEED_PROJECT_TASKS);
    setClubs(SEED_CLUBS);
    setTimetable(SEED_TIMETABLE);
    setNotifications(SEED_NOTIFICATIONS);
    setProfile(SEED_PROFILE);
    setFeedback([]);

    addToast('Demo Data Reset', 'All records have been restored to initial seed state.', 'success');
  };

  // Export JSON
  const exportDataAsJson = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile,
      lostFoundReports,
      cafeteriaOrders,
      events,
      tasks,
      clubs,
      timetable,
      notifications,
      feedback,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campus-companion-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Data Exported', 'Campus Companion data saved as JSON file.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        places,
        lostFoundReports,
        cafeteriaItems,
        cafeteriaOrders,
        cart,
        events,
        projects,
        tasks,
        clubs,
        services,
        timetable,
        notifications,
        profile,
        feedback,
        toasts,
        addToast,
        removeToast,
        updateProfile,
        toggleSavePlace,
        toggleSaveClub,
        toggleSaveService,
        addLostFoundReport,
        updateReportStatus,
        claimReport,
        resolveReport,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        advanceOrderStatus,
        registerForEvent,
        unregisterFromEvent,
        toggleEventReminder,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleChecklistItem,
        addCommentToTask,
        toggleClubMembership,
        toggleClubInterest,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        toggleTimetableReminder,
        checkTimetableOverlap,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        getPlaceById,
        submitFeedback,
        resetDemoData,
        exportDataAsJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
