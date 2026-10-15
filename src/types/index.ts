export type ReportStatus =
  | "reported"
  | "potential-match"
  | "claim-pending"
  | "ready-for-handover"
  | "resolved";

export type LostFoundReport = {
  id: string;
  type: "lost" | "found";
  title: string;
  category: "electronics" | "id-cards" | "stationery" | "clothing" | "bottle-box" | "books" | "keys" | "other";
  description: string;
  location: string;
  date: string;
  imageDataUrl?: string;
  privateVerificationHint?: string;
  status: ReportStatus;
  createdAt: string;
  createdBy: string;
  handoverCode?: string;
  handoverLocation?: string;
  claimNotes?: string;
};

export type CampusPlace = {
  id: string;
  name: string;
  category: "Classrooms" | "Labs" | "Faculty" | "Admin" | "Library" | "Food" | "Student Services" | "Accessibility" | "Auditorium" | "Other";
  building: string;
  floor: string;
  mapX: number; // percentage on schematic SVG (0-100)
  mapY: number; // percentage on schematic SVG (0-100)
  description: string;
  accessibleRouteAvailable: boolean;
  landmarks?: string[];
};

export type CampusEvent = {
  id: string;
  title: string;
  category: "Technical" | "Cultural" | "Sports" | "Career" | "Workshop" | "Community";
  startAt: string; // ISO string or format "2026-10-18 14:00"
  endAt: string;
  venuePlaceId: string;
  description: string;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  registeredUserIds: string[];
  reminderEnabledUserIds: string[];
  organizer: string;
  requirements?: string;
  tags: string[];
};

export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TaskComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type ProjectTask = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate: string;
  checklist: ChecklistItem[];
  comments: TaskComment[];
  attachmentName?: string;
};

export type ProjectMember = {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
};

export type Project = {
  id: string;
  name: string;
  courseCode: string;
  description: string;
  members: ProjectMember[];
};

export type DietaryTag = "Vegetarian" | "Vegan" | "Contains Dairy" | "Spicy" | "Gluten-Free";

export type CafeteriaCounter = "Meals" | "Snacks" | "Drinks" | "Healthy Bowls";

export type CafeteriaItem = {
  id: string;
  name: string;
  counter: CafeteriaCounter;
  category: string;
  description: string;
  price: number;
  dietary: DietaryTag[];
  available: boolean;
  estimatedWaitMins: number;
  popular?: boolean;
};

export type OrderStatus = "Received" | "Preparing" | "Ready" | "Completed";

export type OrderItem = {
  item: CafeteriaItem;
  quantity: number;
};

export type CafeteriaOrder = {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  counter: string;
  estimatedPickupMinutes: number;
};

export type ClubCategory = "Technology" | "Arts & Culture" | "Sports" | "Social Impact" | "Entrepreneurship" | "Academic";
export type RecruitmentStatus = "Open" | "Closing Soon" | "Closed";

export type Club = {
  id: string;
  name: string;
  category: ClubCategory;
  purpose: string;
  description: string;
  meetingFrequency: string;
  recruitmentStatus: RecruitmentStatus;
  nextActivity: string;
  nextActivityDate?: string;
  contactEmail: string;
  contactRole: string;
  tags: string[];
  membersCount: number;
  isMember?: boolean;
  isInterested?: boolean;
};

export type ServiceCategory = "Academic" | "Administration" | "Careers" | "Health & Wellbeing" | "IT Support" | "Security & Lost Property" | "Accessibility" | "Finance";

export type StudentService = {
  id: string;
  name: string;
  category: ServiceCategory;
  purpose: string;
  locationPlaceId: string;
  openingHours: string;
  contactChannel: string;
  contactEmail: string;
  requiredDocuments: string[];
  helpsWith: string[];
  beforeYouVisit: string;
  coordinator: string;
};

export type TimetableType = "class" | "assessment" | "club" | "workshop" | "meeting";

export type TimetableEntry = {
  id: string;
  title: string;
  courseCode?: string;
  type: TimetableType;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Monday, 7 = Sunday
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  placeId: string;
  instructor?: string;
  notes?: string;
  reminderEnabled?: boolean;
};

export type NotificationCategory =
  | "Classes & timetable"
  | "Events"
  | "Projects"
  | "Lost & Found"
  | "Cafeteria"
  | "Campus updates";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  createdAt: string;
  readAt?: string;
  targetPath?: string;
};

export type AccessibilityPreferences = {
  preferStepFree: boolean;
  largerText: boolean;
  reducedMotion: boolean;
};

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  course: string;
  yearSemester: string;
  campusId: string;
  interests: string[];
  dietaryPreference: string;
  accessibilityPreferences: AccessibilityPreferences;
  savedPlaceIds: string[];
  savedClubIds: string[];
  savedServiceIds: string[];
};

export type FeedbackItem = {
  id: string;
  category: "General" | "Navigation" | "Cafeteria" | "Lost & Found" | "Timetable" | "Bug Report" | "Feature Idea";
  module: string;
  message: string;
  createdAt: string;
};

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastMessage = {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
};
