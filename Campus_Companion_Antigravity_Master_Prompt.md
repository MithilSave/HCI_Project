# Campus Companion — Master Build Prompt for Antigravity

> **Purpose:** Build a polished, fully interactive, responsive web application for **Campus Companion**, a unified student-life platform. This is the operational product/build brief: implement the app end-to-end, not merely a landing-page mockup or a plan.

---

## 0. Your Role and Working Rules

Act as a senior product designer, UX researcher, frontend engineer, and pragmatic full-stack developer. Work directly in the current Antigravity workspace.

1. **Inspect the existing workspace first.** Identify the framework, package manager, current components, routes, assets, and scripts. Preserve and extend a working project rather than replacing it blindly. If the workspace is empty, scaffold a suitable application.
2. **Build and run the product.** Do not stop after generating a plan, a design description, or a set of code snippets. Implement the interface, wire up the interactions, run the app, check for errors, and fix the issues you find.
3. **Make decisions autonomously.** Use the brief below as the source of truth. Ask a question only if something genuinely blocks implementation.
4. **No dead controls.** Every visible button, link, tab, menu, filter, form, and primary call to action must work. If a feature is simulated for the prototype, its behavior must still work locally and must be clearly represented as demo/simulated rather than pretending to call a real service.
5. **Don't fake integrations.** No fabricated live campus data, payment processing, maps, email/SMS delivery, AI matching, or authentication claims. Use clearly labeled demo data and local interactions when real credentials/services are unavailable.
6. **Keep the interface cohesive.** All modules must feel like parts of the same product, with a shared design system and consistent navigation.
7. **Finish with a QA pass.** Run available lint, type-check, build, and/or test commands. Fix errors and visually inspect the most important screens at desktop and mobile widths.

## 1. Product Vision

### Product name
**Campus Companion**

### Product promise
**Campus, without the chaos.**

Campus Companion is a student-focused campus-life hub that brings common college tasks into one understandable experience. It addresses the problems identified during the project's affinity-mapping and empathy-mapping work:

- Students struggle to find classrooms, labs, faculty offices, and campus facilities.
- Lost-item reports are scattered across chats and informal channels, and ownership is difficult to verify.
- Cafeteria queues, seating availability, and menu information are uncertain.
- Event and workshop announcements are spread across different channels, leading to missed opportunities.
- Group projects suffer from uneven task allocation, scattered communication, version confusion, and missed deadlines.
- Clubs, societies, recruitment dates, volunteering opportunities, and student services are difficult to discover.
- Students want a single, simple place for schedules, reminders, campus information, and everyday tasks.

### Target users
- First-year students who are still learning how the campus works.
- Returning students who need a quicker way to find campus services and activities.
- Students managing classes, events, clubs, and group projects simultaneously.
- Optional secondary user flows for staff or student volunteers who help coordinate lost-and-found items, events, or campus information.

### Product principles
- **Useful before flashy:** visual character should help students act quickly.
- **One home for the essentials:** the main modules should be reachable in one or two actions.
- **Clear status:** make it obvious what is new, pending, full, done, reported, or confirmed.
- **Human and encouraging:** use concise, natural language rather than corporate or AI-sounding slogans.
- **Trust by design:** don't expose private contact details or make unsupported claims about data being live.
- **Accessible by default:** keyboard support, readable text, contrast, focus states, and responsive layouts.

## 2. Technical Direction

Use the current project's existing stack if it is already configured correctly. If starting from an empty workspace, use a maintainable, widely supported stack such as:

- **Next.js App Router + TypeScript** (or retain an existing Vite/React stack if already present).
- **Tailwind CSS** for styling, with a small set of reusable design tokens.
- **Lucide icons** or the project's existing icon library, used consistently.
- **Framer Motion** only if already available or straightforward to add, for restrained transitions—not excessive animation.
- A small state solution appropriate to the app (React Context, Zustand, or equivalent); don't add complexity without need.
- `localStorage` for persistent demo state if no backend is configured.

If the workspace already includes a backend or configured service such as Supabase, inspect it and use it only when the configuration is actually present. **Never invent API keys or assume an external service is connected.** The app must be useful in demo mode with no keys or account setup.

### Persistence and demo mode
- Seed the app with plausible, clearly fictional/demo campus data.
- Persist user changes locally: reports, registrations, tasks, club interests, cafeteria orders, read notifications, profile settings, and timetable edits should survive refreshes.
- Include a small, unobtrusive **“Demo data”** indicator in an About/Help area or app footer; use “sample estimate” labels where queues or similar metrics are simulated.
- Add a **Reset demo data** control under Profile/Settings with a confirmation dialog.
- Never display fake real-time data as if it came from campus systems.
- Do not collect sensitive real student data. Use fictional seeded identities and clearly labeled sample contact data.

## 3. Visual Art Direction — Make It Beautiful, Distinctive, and Believable

The product should look like a carefully art-directed student product made by a small design studio—not a generic AI-generated SaaS dashboard.

### Visual concept
A blend of an independent campus magazine, a well-designed utility app, and a modern campus noticeboard. It should feel warm, slightly playful, energetic, and practical. Give it personality through typography, purposeful asymmetry, specific copy, small illustrations, and excellent spacing—not through random gradients or endless cards.

### Suggested palette
Define these as reusable tokens and use them consistently:

- **Ink / primary text:** `#17243A`
- **Paper / page background:** `#F7F6F1`
- **Surface:** `#FFFFFF`
- **Cobalt / primary action:** `#315CEB`
- **Cobalt-dark / hover:** `#2447C5`
- **Campus lime / small accent:** `#DDF36A`
- **Coral / important secondary accent:** `#F27C66`
- **Soft lilac:** `#C8BDF7`
- **Soft mint:** `#BDE8D6`
- **Muted text:** `#667085`
- **Borders:** `#E3E5E8`
- **Success:** `#20845A`
- **Warning:** `#A96116`
- **Error:** `#B93838`

Use mostly paper, white, ink, and cobalt. Lime, coral, mint, and lilac should provide small moments of personality—not paint every element a different color. Always verify text contrast.

### Typography
- Use a confident display face for major headings (e.g. Space Grotesk) and a highly readable sans-serif for body/UI (e.g. Inter), with system fallbacks.
- Make headings editorial and clear; body copy short and scannable.
- Avoid excessive all-caps. Use all-caps only for tiny metadata labels when it improves hierarchy.

### Layout and components
- Desktop: a persistent, collapsible left sidebar, a compact top bar with page title/breadcrumbs, global search, notification bell, and profile menu.
- Mobile: a well-spaced top bar and a compact bottom navigation for the most used areas; remaining modules accessible through a “More” menu.
- Use a 12-column/consistent spacing grid, strong alignment, ample whitespace, and occasional offset layouts so the page does not look mechanically generated.
- Use bordered panels, soft shadows sparingly, rounded corners with a consistent radius system, and restrained hover/focus transitions.
- Do not put every paragraph inside a card. Use cards when they group a meaningful task or data set.
- Use small illustrated empty states, not huge stock-photo heroes.
- Use a consistent icon style. Prefer available project icon assets in `public/` or the existing assets directory if present. Otherwise use Lucide icons. For the Campus Companion modules, preserve recognizable meanings for: Navigation, Lost & Found, Cafeteria, Events, Projects, Clubs, Notifications, Services, Timetable, and Profile.
- Don't rely on random stock images or external image URLs for core UI. Use CSS shapes, simple SVG illustrations, local assets, or the icon set where suitable.

### Brand touches
- Create a simple Campus Companion mark (e.g. a pin/map-path or campus-building motif) in SVG/CSS if no logo already exists.
- Use short, natural microcopy with a friendly student voice. Example: “A little less running around.”, “Your next class is in 18 minutes.”, “Found something? Help it find its person.”
- Use tasteful micro-interactions: button press states, sidebar collapse, filter chips, toast confirmations, subtle route drawing, calendar transitions, and modal entrances.
- Respect reduced-motion preferences. Motion should clarify feedback, never slow down a task.

### Avoid these design clichés
- No giant centered gradient hero with “Empowering the future of…” copy.
- No default purple/pink AI gradient everywhere.
- No endless identical white cards with the same icon/title/description layout.
- No giant decorative blobs, random emojis as primary icons, or fake graphs with meaningless numbers.
- No fabricated testimonials, fake “AI-powered” claims, fake user counts, or invented institutional endorsements.
- No decorative controls that look functional but do nothing.

## 4. Information Architecture and Routes

Build a complete navigable application with these sections. Use routes/pages that fit the existing framework; the following paths are preferred if practical:

- `/` or `/dashboard` — Home dashboard
- `/navigation` — Campus navigation and location finder
- `/lost-found` — Lost & Found
- `/cafeteria` — Cafeteria services
- `/events` — Events and workshops
- `/projects` — Group project workspace
- `/clubs` — Clubs and societies
- `/services` — Student services directory
- `/timetable` — Timetable and schedule
- `/notifications` — Notification center
- `/profile` — Student profile and settings
- `/help` — FAQ and feedback

All routes must be reachable from the sidebar/top navigation and from relevant contextual links. Browser back/forward navigation should work correctly.

## 5. First-Run Experience and Shared App Shell

### Entry behavior
- Open directly into a polished dashboard using a fictional demo student, without forcing account creation.
- If there is no saved profile, show a small optional welcome setup (name, year/semester, interests, accessibility preferences). Give users a clear **“Explore demo first”** option.
- Make the demo identity editable from Profile.

### Shared app shell
- Left sidebar with brand mark and links for Home, Navigation, Lost & Found, Cafeteria, Events, Projects, Clubs, Student Services, and Timetable.
- Display an unread notification indicator on the notification bell.
- Use active nav highlighting, useful tooltips for collapsed nav, and clear focus styles.
- Top bar includes page title, global search (with a `Ctrl/Cmd + K` keyboard shortcut if feasible), notification access, and profile avatar/menu.
- Mobile layout must preserve access to primary modules without horizontal scrolling.
- Implement a toast/snackbar system for success, warning, and error feedback.
- Use modals/drawers for short creation tasks where that improves flow; ensure Escape closes appropriate dialogs and focus is handled sensibly.
- Include realistic empty states, loading placeholders only where meaningful, validation messages, and error states.

## 6. Dashboard — `/` or `/dashboard`

The dashboard should feel like a personal campus control center, not a wall of charts.

### Header block
- Personalized greeting: “Morning, [Name]” or time-aware greeting.
- A natural subheading such as “Here’s your campus at a glance.”
- Show current weekday/date using the system clock; do not hard-code an old date.
- A small campus context label (e.g. “Campus overview · Demo data”) without claiming live status.

### Useful dashboard sections
1. **Next up:** next timetable item with time, location, a countdown or time-to-class, and a “Get directions” action that opens Navigation with the destination prefilled.
2. **Quick actions:** Find a room, Report an item, Explore events, View timetable, Check cafeteria.
3. **Today’s schedule:** next few classes/events with time and room; “View full timetable” opens the timetable.
4. **Events worth a look:** 2–3 upcoming seeded events with category/date and a working detail/register link.
5. **Cafeteria snapshot:** sample queue estimate, open counters/menu preview, clearly marked as demo/estimated, with a “See menu” action.
6. **Project pulse:** tasks due soon and progress indicators based on actual seeded task state, with a link to Projects.
7. **Lost & Found matches:** a small panel showing recently reported items or suggested matches, with a “View reports” action.
8. **Campus tip / useful note:** rotate from a small predefined set or use a static tip; don't claim it is AI-generated.

Dashboard content should be responsive: rearrange into one column on mobile and avoid squeezing cards into tiny columns.

## 7. Campus Navigation — `/navigation`

### Goal
Help a student locate classrooms, laboratories, faculty offices, administrative offices, library, cafeteria, student services, entrances, and other campus facilities without having to ask around.

### UI requirements
- Clear page heading: “Find your way around campus.”
- Searchable destination input with autocomplete.
- Category chips: Classrooms, Labs, Faculty, Admin, Library, Food, Student Services, Accessibility, Other.
- Start point selector (e.g. Main Entrance, Current Building, Library) and destination selector.
- An original **schematic campus map** built from local SVG/CSS or a simple visual floor/building plan. It should have clickable markers and a clear legend. Do not require a paid Maps API key.
- Route display with highlighted path and step-by-step written directions, approximate walking time/distance, and helpful landmarks.
- Toggle or preference for accessible route where the map data supports it; label routes as demo/schematic.
- “Use current location” can set a simulated starting point and must state that it is a demo location, not actual device GPS.
- Buttons: “Show route”, “Swap locations” (where appropriate), “Clear route”, and “Save place”. All should work.
- Search results should prioritize exact matches and support partial matches.
- Link relevant timetable items to the correct destination.

### Seed places
Include at least 12 distinct places, for example:
- Main Entrance
- Lecture Hall 203
- Classroom 304
- Computer Lab 2
- Faculty Office Wing
- Library
- Seminar Hall
- Cafeteria
- Student Services Desk
- Placement Cell
- Medical Room
- Auditorium

Make the place list data-driven so the names/coordinates can later be replaced with actual campus details. Do not represent the demo map as a verified map of a real institution.

### Behavior
Selecting a destination and pressing “Show route” must update the map highlighting and directions panel. Selecting a marker should show a useful place detail and a route action. Saved places should appear in a Saved Places section or profile.

## 8. Lost & Found — `/lost-found`

### Goal
Replace informal, scattered item reporting with a structured campus process, while protecting ownership and personal contact details.

### Main interface
- Header with the line “Found something? Help it find its person.”
- Segmented tabs: **All items**, **Lost**, **Found**, **My reports**.
- Search, category filter, location, recent/oldest sorting, and status filter.
- Report cards with image/placeholder, item title, category, last-seen/found location, date, brief description, status badge, and detail action.
- Buttons: **Report lost item** and **Report found item**.

### Reporting flow
Use a clear multi-field form with validation:
- Report type: Lost / Found
- Item title
- Category (electronics, ID/cards, stationery, clothing/accessories, bottle/lunchbox, books, keys, other)
- Description
- Location
- Date/time (allow unknown date where applicable)
- Optional image upload with preview; validate file type/size and offer remove/replace.
- Optional private detail used to verify ownership; do not display this detail publicly.
- Preferred safe handover location (e.g. security desk) if applicable.
- Consent/confirmation before submitting.

On submit, add the report to local state and show a toast plus a success view with the generated report ID. The report must persist after refresh.

### Suggested matching
- Show a “Possible matches” section based on transparent rules: matching category, keywords in title/description, nearby location text, and date proximity.
- Display why an item was suggested (e.g. “Same category and similar location”).
- Do not claim it uses machine learning or image recognition unless a real integration exists.
- If no matches exist, say so and suggest broadening the search.

### Claim and safe handover
- A user can click “This might be mine” / “Claim item” and enter private identifying details.
- Keep claim details hidden from the public item card.
- Simulate an owner/reviewer verification state with clear statuses: Reported, Potential match, Claim pending, Ready for handover, Resolved.
- When a match is accepted in demo mode, generate a one-time handover code. If a QR package is already available or simple to add, render a QR encoding that code; otherwise display the code clearly. Do not imply it has been sent to a real external service.
- Show a safety note advising users to arrange handover at a designated public campus desk and not share sensitive personal information publicly.
- Allow the creator to mark a report resolved, with a confirmation dialog.

### Seed demo reports
Include at least 6 fictional items such as a calculator, water bottle, ID holder, headphones, notebook, and umbrella. Clearly mark these as sample entries if needed.

## 9. Cafeteria — `/cafeteria`

### Goal
Help students make informed cafeteria decisions and reduce uncertainty about menus, queues, and seating.

### Features
- Menu by counter/category (Meals, Snacks, Drinks, Vegetarian, etc.).
- Search and dietary filters/tags such as Vegetarian, Vegan, Contains Dairy, Spicy; only display tags supported by seeded data.
- Item cards with name, short description, price, dietary markers, availability, and “Add” button.
- Favorites or “Save item” interaction.
- Counter tabs with **sample queue estimates** and estimated wait times. Clearly label these as simulated demo values rather than live measurements.
- A simple seating status indicator (e.g. “Limited seating · sample status”) with an explanation that it is prototype data.
- Cart drawer/panel showing selected items, quantity increment/decrement, remove action, subtotal, and clear cart.
- Demo checkout flow that confirms a mock order and assigns an order number; **do not process real payments**.
- Demo order status steps such as Received → Preparing → Ready. Advance status through a clear simulated action or time-independent user action; do not claim a real kitchen system is connected.
- Show a useful empty state when cart is empty and a clear success state after placing a demo order.

### Behavior
All filters, item additions, quantity changes, favorites, and order creation must function and persist. Prices and queue estimates must come from seeded data objects, not hard-coded visual text disconnected from state.

## 10. Events & Workshops — `/events`

### Goal
Make events and workshops discoverable in one place, and make registration/reminders understandable.

### Listing interface
- View toggle: **Upcoming / Calendar** (or list/calendar).
- Search and category filters (Technical, Cultural, Sports, Career, Workshop, Community).
- Optional filters for date, availability, and events the user has registered for.
- Event cards with title, category, date, start/end time, venue, short description, registration status, and a clear action.
- Highlight deadlines without alarmist visual styling.

### Event detail
- A clear detail panel/page with full description, date/time, venue, organizer (fictional), requirements, capacity status, registration deadline, and a link to campus navigation for the venue.
- Registration flow: Register / Cancel registration / Join waitlist as appropriate. Update state and My Events immediately.
- Prevent duplicate registration.
- Create an in-app notification on successful registration.
- Reminder toggle per event; in demo mode this records a preference and adds a scheduled-reminder item in the app UI. Do not claim to deliver push/email/SMS reminders if no service is configured.
- Event cards and registration status must update across Dashboard, Events, and Notifications.

### Seed events
Use at least 6 varied fictional demo events with plausible future dates generated relative to the current date where practical. Example themes: AI & Emerging Technologies Workshop, Design Jam, Inter-College Football, Career Readiness Session, Photography Walk, Student Club Open House. Label sample event data appropriately and avoid implying official events are real.

## 11. Group Projects — `/projects`

### Goal
Make responsibilities, deadlines, and progress visible to students collaborating on academic work.

### Main view
- Project list or project switcher with at least 2 fictional demo projects.
- A clean Kanban board with columns **To do**, **In progress**, **In review**, **Done**.
- Task cards display title, assignee avatar/initials, due date, priority, and status.
- Summary of tasks due soon and completion progress computed from actual tasks.

### Required interactions
- Create, edit, and delete a task (confirm deletion).
- Move a task between columns with a dropdown or drag-and-drop if stable; provide a keyboard-accessible alternative.
- Assign to a demo team member.
- Set priority and due date.
- Add description/checklist items and comments/activity notes.
- Attach a local file or link as a reference; for demo uploads, retain only browser-local state or metadata and do not claim cloud file storage.
- Show overdue/due-soon states in a calm, clear way.
- Provide empty states for each Kanban column.
- Persist task changes after refresh.

### Example project data
Use plausible fictional projects such as “Campus Companion Prototype” and “HCI Research Report,” with demo team members and tasks. Do not populate the board with invented performance analytics presented as real.

## 12. Clubs & Societies — `/clubs`

### Goal
Help students discover clubs, understand what they do, and find clear joining/recruitment information.

### Features
- Directory with search and filters by interest/category: Technology, Arts & Culture, Sports, Social Impact, Entrepreneurship, Academic.
- Club cards with name, concise purpose, interests/tags, meeting frequency, recruitment status, next activity, and a detail action.
- Club detail view with description, activities, eligibility (if applicable), contact role/email using clearly fictional demo data, and upcoming events.
- Join / Express interest / Withdraw interest actions. State should update to “Interest submitted” or “Member” in demo mode.
- Bookmark/save clubs and display saved clubs in Profile or on the page.
- Include an accessible empty state when no clubs match the filters.

### Seed clubs
At least 6 fictional clubs, e.g. Coding Collective, Design Circle, Green Campus, Photography Society, Football Club, Entrepreneurship Cell. These are sample concept data—not claims about actual organizations.

## 13. Student Services — `/services`

### Goal
Make administrative and support services easier to discover and navigate.

### Features
- Searchable service directory with categories: Academic, Administration, Careers, Health & Wellbeing, IT Support, Security & Lost Property, Accessibility, Finance.
- Service cards show purpose, location, sample opening hours, contact channel, required documents (where relevant), and a “View details” action.
- Details view includes “What this service helps with,” “Before you visit,” steps to request help, location, and a “Get directions” button into Navigation.
- Mark services as saved/favorite.
- “Copy contact details” or “Copy service instructions” should work if included.
- Provide a short disclaimer that service hours/contacts are sample prototype data and must be replaced with verified campus details before real deployment.

## 14. Timetable — `/timetable`

### Goal
Give students a readable view of classes and commitments, with direct paths to classrooms and reminders.

### Features
- Week/day toggle with previous/next week controls and a “Today” action.
- Calendar grid on desktop; compact agenda/list view on mobile.
- Classes/events display title, time, location, category, and optional notes.
- Distinguish class, assessment, club event, workshop, and project meeting through a consistent visual coding system; do not rely on color alone.
- Add/edit/delete a timetable entry with validation and confirmation for destructive actions.
- Detect and warn about overlapping entries; allow users to proceed after seeing the warning if appropriate.
- “Get directions” for entries with a place opens Navigation with destination prefilled.
- Reminder toggle on each entry. In demo mode, show reminders in the notification center only.
- Persist user-edited schedule entries.

## 15. Notifications — `/notifications`

### Features
- Notification center grouped into Today / Earlier or similar.
- Categories: Classes & timetable, Events, Projects, Lost & Found, Cafeteria, Campus updates.
- Unread/read styling, mark one as read, mark all as read, and clear/dismiss actions.
- Clicking a notification navigates to the related module or item.
- Notification bell badge must reflect actual unread count.
- Create in-app notifications as actions occur (event registration, project due-soon status, lost-and-found claim updates, demo cafeteria order ready, timetable reminder preference set).
- Preferences for notification categories and quiet hours can be stored locally. Do not promise actual push or background reminders without a configured delivery service.

## 16. Profile and Preferences — `/profile`

### Profile fields
- Display name (seed as a fictional demo student, editable).
- Course/department, year/semester, and optional campus identifier field that is not required and should not use real private identifiers in seeded data.
- Interests used for event and club suggestions.
- Dietary preference (optional).
- Accessibility preferences (e.g. prefer step-free route, larger text, reduced motion).
- Notification preferences.
- Saved places, saved clubs, and event registrations summary.

### Settings interactions
- Edit profile and save changes.
- Update interests and accessibility choices.
- Toggle optional compact view/dark mode only if implemented cleanly; do not include a toggle that does nothing.
- Export demo data as JSON if practical.
- Reset demo data with a confirmation step.
- Add a “Demo mode” explanation and a “Feedback” link.

## 17. Global Search and Help

### Global search
- Search for places, events, services, clubs, and project tasks.
- Results grouped by type with a small icon and a clear action.
- Empty state for no results.
- Keyboard access (`Ctrl/Cmd + K`, Escape to close) if feasible.
- Selecting a result opens the correct route/details and pre-fills related fields when practical.

### Help and feedback
- Include a compact FAQ with questions such as “How do I find a classroom?”, “How do I report a lost item?”, “Are cafeteria wait times live?”, “How do event reminders work?”, and “Is this connected to real campus systems?”
- Answer honestly: this is a working prototype using demo data unless an integration is explicitly configured.
- Provide a feedback form with category, message, optional page/module, validation, and a success confirmation. Persist demo feedback locally; do not claim it was sent to staff.

## 18. Shared Functional Requirements

- Search fields support typing, clearing, and filtering.
- Filters can be combined and reset.
- All modals and forms can be closed without accidental data loss; unsaved changes should be handled sensibly.
- Forms have labels, required-field validation, useful errors, and success feedback.
- Confirm before destructive actions such as deletion or resetting demo data.
- All visible cards/rows use data from shared state rather than being isolated hard-coded HTML.
- State changes in one module must update linked modules when relevant—for example, an event registration updates My Events and Notifications; a timetable entry's place can open Navigation; a project task update changes the project pulse on Dashboard.
- Use stable IDs and normalized data structures for items, events, places, tasks, clubs, service entries, notifications, and user preferences.
- Avoid duplicate toast messages and stale/uncontrolled local component state.
- Handle localStorage read/write defensively (including unavailable storage/private browsing); provide safe defaults if stored data is invalid or outdated.
- Seed data should initialize only when there is no existing user data. Add a versioned storage key or safe migration strategy.
- No hard-coded real personal data.

## 19. Suggested Data Types

Use TypeScript types/interfaces or equivalent structures. Adapt as needed but maintain clarity:

```ts
type ReportStatus =
  | "reported"
  | "potential-match"
  | "claim-pending"
  | "ready-for-handover"
  | "resolved";

type LostFoundReport = {
  id: string;
  type: "lost" | "found";
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  imageDataUrl?: string;
  privateVerificationHint?: string;
  status: ReportStatus;
  createdAt: string;
  createdBy: string;
};

type CampusPlace = {
  id: string;
  name: string;
  category: string;
  building?: string;
  floor?: string;
  mapX: number;
  mapY: number;
  description: string;
  accessibleRouteAvailable?: boolean;
};

type CampusEvent = {
  id: string;
  title: string;
  category: string;
  startAt: string;
  endAt: string;
  venuePlaceId: string;
  description: string;
  registrationDeadline?: string;
  capacity?: number;
  registeredCount?: number;
  registeredUserIds: string[];
  reminderEnabledUserIds: string[];
};

type ProjectTask = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "in-review" | "done";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
  dueDate?: string;
  checklist?: { id: string; text: string; done: boolean }[];
  comments?: { id: string; author: string; text: string; createdAt: string }[];
};

type AppNotification = {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  readAt?: string;
  targetPath?: string;
};
```

## 20. Seed Data and Prototype Integrity

Provide enough demo data that the app feels alive immediately without requiring the student to create everything from scratch:

- 12+ campus places.
- 6+ lost/found reports.
- 8–12 cafeteria items across at least 3 counters/categories.
- 6+ campus events.
- 2+ projects and 8+ tasks distributed across board statuses.
- 6+ clubs.
- 6+ student services.
- 6+ timetable entries across different days.
- 6+ notifications across categories.

Keep example information internally consistent. E.g. event venues must match a seeded campus place; a dashboard “next class” should correspond to a timetable event; notifications should link to valid modules; task totals should match the board data. Any approximate queue times, seat availability, capacities, or attendance numbers must be labeled as demo/sample values.

## 21. Responsive Design and Accessibility

- Test at approximately **1440px desktop**, **1024px tablet/small laptop**, and **390px mobile** widths.
- No horizontal page overflow. Tables/boards should convert to compact lists or scroll within their own containers when necessary.
- Use semantic HTML landmarks and headings in order.
- Every form control has an associated label; icon-only buttons have accessible names/tooltips.
- All key actions work by keyboard. Focus indicators must be visible.
- Use sufficient contrast and don't communicate status with color alone—include text labels/icons.
- Add alt text to meaningful images and hide purely decorative SVGs from screen readers.
- Use `prefers-reduced-motion` to reduce non-essential animation.
- Ensure buttons have comfortable touch targets on mobile.

## 22. Performance, Reliability, and Security Basics

- Keep dependencies reasonable and avoid unnecessary packages.
- Use reusable components, clear file names, and separation between data, UI, and state logic.
- Avoid putting large base64 image uploads into localStorage without size limits; validate uploads and provide clear error messages. If persistence is too heavy, keep a local preview for the current session and save metadata only, while explaining the limitation.
- Do not log personal profile data or private lost-item verification fields to the console.
- Do not expose private claim details on public report cards.
- Never collect or store payment-card details. The cafeteria checkout is a demo order simulation only.
- Don't claim data syncs between users or devices unless there is a real configured backend.

## 23. Implementation Order

Implement in this order, while keeping a coherent visual shell throughout:

1. Inspect repository, set up or preserve the project, and define design tokens.
2. Build shared app shell, navigation, routing, responsive layouts, buttons, inputs, badges, dialog/drawer, toast, and empty states.
3. Define types, seeded data, persistence layer, and global state.
4. Build Dashboard and Global Search.
5. Build Campus Navigation.
6. Build Lost & Found and the suggested-match/claim flow.
7. Build Cafeteria menu/cart/demo order flow.
8. Build Events registration/reminder flow.
9. Build Projects Kanban and task management.
10. Build Clubs and Student Services.
11. Build Timetable and Notifications integration.
12. Build Profile, Preferences, Help, Feedback, and Reset Demo Data.
13. Run responsive/accessibility/functionality QA; fix every issue that can be reproduced.

If the full scope must be staged, complete a cohesive, functional implementation of every core module before adding optional polish. Do not leave unfinished pages as “Coming soon” when the requirements above describe basic expected functionality.

## 24. Definition of Done — Acceptance Checklist

Do not consider the task complete until the following are true:

### Visual quality
- [ ] The interface has a distinctive Campus Companion visual identity, not a generic template.
- [ ] Typography, color, spacing, icon usage, and component styles are consistent.
- [ ] Desktop and mobile layouts look intentionally designed.
- [ ] Empty states, success states, warnings, and confirmations are designed.

### Core navigation
- [ ] Every sidebar/bottom-nav link opens the correct page.
- [ ] Active-page states are correct.
- [ ] Browser back/forward navigation works.
- [ ] Global search returns relevant seeded results and opens the right destination.

### Main user journeys
- [ ] A student can search for “Classroom 304”, choose a starting point, and see a schematic route and directions.
- [ ] A student can submit a lost-item report, see it in My Reports, and see explainable possible matches when the seeded data permits.
- [ ] A student can claim a demo item and see the appropriate status/handover confirmation without exposing private details publicly.
- [ ] A student can filter cafeteria items, add/remove items, change quantity, and place a demo order.
- [ ] A student can explore an event, register, enable its in-app reminder preference, and see a notification/state update.
- [ ] A student can create/edit a project task, change its status, and see dashboard task summaries update.
- [ ] A student can search/filter clubs, express interest, and see that state reflected in the UI.
- [ ] A student can open a student service and launch directions to its seeded campus location.
- [ ] A student can navigate the timetable, edit/add an entry, and open directions for its room.
- [ ] Notification read/unread actions update the bell count correctly.
- [ ] Profile changes persist after refresh.
- [ ] Reset demo data restores seed state only after explicit confirmation.

### Reliability
- [ ] No visible control is inert.
- [ ] Forms validate input and show comprehensible errors.
- [ ] No uncaught console errors or broken imports.
- [ ] The project passes the available build/type-check/lint commands, or any pre-existing limitation is clearly identified.
- [ ] Core flows work at desktop and mobile widths.
- [ ] The app remains usable without external API keys.
- [ ] Simulated data/integrations are clearly labeled and never represented as live.

## 25. Final Instructions to Antigravity

Now implement **Campus Companion** in the current workspace using the specification above. Start by inspecting the existing repository and assets. Then build the application end-to-end, launch it, test the listed user journeys, and fix visual or functional problems. Prioritize a visually distinctive, highly usable, genuinely interactive product over flashy but empty screens.

When finished, provide a concise handoff containing:
1. What was implemented.
2. The main routes/features.
3. Any demo-only/simulated behavior and what would require real backend/API integration.
4. Commands to run the project.
5. Build/test results and any remaining limitations.

**Do not respond with another plan. Execute the build.**
