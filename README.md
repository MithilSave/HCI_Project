# Campus Companion — Campus, without the chaos.

> A unified, human-centered student-life web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**.

---

## 🏛️ Project Overview

**Campus Companion** addresses the daily friction students experience navigating campus, recovering lost items, coordinating group work, timing cafeteria visits, and discovering university events.

Built as an offline-capable, interactive prototype following HCI research, empathy mapping, and Nielsen-Norman usability principles.

---

## 🚀 Key Modules & Routes

1. **Dashboard (`/` or `/dashboard`)**
   - Time-aware student greeting ("Morning / Afternoon / Evening, Alex")
   - System clock live calendar date & contextual demo badge
   - "Next Up" timetable item with countdown and pre-filled room directions
   - Cafeteria queue wait time & seating occupancy snapshot
   - Group project sprint velocity & high-priority task counters
   - Recent Lost & Found activity and curated campus tips

2. **Campus Navigation (`/navigation`)**
   - Custom vector schematic campus map with interactive building & room markers
   - Category filtering (Classrooms, Labs, Faculty, Admin, Library, Dining Commons)
   - Route path generation with distance (meters) and estimated walking time (minutes)
   - Step-by-step turn guidance with physical campus landmarks
   - Accessible route toggle (step-free ramp and elevator landmarks)
   - "Use Demo Location" and bookmarking for favorite places

3. **Lost & Found Registry (`/lost-found`)**
   - Segmented tabs: All items, Lost, Found, My reports
   - Multi-field reporting with category, location, date, and image preview
   - **Privacy-preserving verification clue**: private details are kept confidential
   - Rule-based potential match detection explaining matching factors
   - Safe handover workflow generating a one-time verification voucher (e.g., `#CC-8429`) for security desk pickup

4. **Cafeteria & Dining (`/cafeteria`)**
   - Menu categorized by counters: Meals, Snacks, Drinks, Healthy Bowls
   - Dietary filter tags: Vegetarian, Vegan, Gluten-Free, Spicy, Contains Dairy
   - Simulated counter queue wait times and live seating occupancy bar
   - Slide-over Cart Drawer with item increment/decrement controls and subtotal calculation
   - Demo checkout simulation with order tokens (`#CC-180`) and pipeline tracking (`Received` → `Preparing` → `Ready` → `Completed`)

5. **Events & Workshops (`/events`)**
   - List and Calendar Agenda view toggles
   - Category filters: Technical, Cultural, Sports, Career, Workshop, Community
   - Filter for "My registered events only"
   - Event details modal with venue navigation links and attendee capacity bar
   - Spot registration and in-app reminder alerts

6. **Group Projects Workspace (`/projects`)**
   - Multi-project switcher (e.g. *CS-482 HCI Studio*, *ENV-301 Energy Audit*)
   - Kanban board with four columns: `To Do`, `In Progress`, `In Review`, `Done`
   - Task creation with priorities (`Low`, `Medium`, `High`), due dates, assignees, checklists, and activity comments
   - Quick column transitions and sprint progress bar

7. **Clubs & Societies (`/clubs`)**
   - Searchable student organization directory
   - Recruitment status badges (`Open`, `Closing Soon`, `Closed`)
   - Club detail modal with meeting frequencies, next activity dates, and contact emails
   - "Join / Inquire" and bookmarking actions

8. **Student Services Directory (`/services`)**
   - Administration, IT Support, Career Guidance, Health Clinic, Security, and Accommodations
   - Operating hours, service scope, and "Before You Visit" checklists
   - Required document guides and one-click email copying
   - Direct link to launch venue directions on the campus map

9. **Weekly Timetable (`/timetable`)**
   - Visual schedule grid with week and day view toggles
   - Visual category badges (Class, Assessment, Club Sprint, Workshop, Meeting)
   - Class creation with **intelligent collision detection** and time conflict warnings
   - One-click "Navigate" to plot directions to any lecture room
   - Per-entry reminder toggles

10. **Notification Center (`/notifications`)**
    - Grouped into "Today" and "Earlier This Week"
    - Filterable by module category
    - Unread bell badge reflecting live unread count
    - Deep-linking to relevant modules upon notification click

11. **Student Profile & Settings (`/profile`)**
    - Fictional student profile editor (Name, Course, Semester, Campus ID)
    - Dietary preference and accessibility settings (Step-free routing, Reduced motion)
    - Interest tags manager
    - Summaries of saved places, bookmarked clubs, and registered events
    - **Export Data as JSON** and **Reset Demo Data** with safety confirmation dialog

12. **Help & Campus FAQ (`/help`)**
    - Searchable accordion answering key operational questions honestly
    - Local usability feedback form with module attribution

13. **Global Search (`Ctrl + K` / `Cmd + K`)**
    - Instant global search modal querying places, events, clubs, services, timetable, and tasks

---

## 🎨 Design System & Palette

- **Ink (Text):** `#17243A`
- **Paper (Background):** `#F7F6F1`
- **Surface:** `#FFFFFF`
- **Cobalt (Primary):** `#315CEB` (Hover: `#2447C5`)
- **Campus Lime (Accent):** `#DDF36A`
- **Coral (Secondary Accent):** `#F27C66`
- **Soft Lilac:** `#C8BDF7`
- **Soft Mint:** `#BDE8D6`
- **Typography:** Space Grotesk (Headings), Inter (UI & Body)

---

## 🛠️ Running the Project Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run production build & type check
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
