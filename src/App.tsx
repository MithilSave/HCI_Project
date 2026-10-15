import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';
import { NavigationPage } from './pages/NavigationPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { CafeteriaPage } from './pages/CafeteriaPage';
import { EventsPage } from './pages/EventsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ClubsPage } from './pages/ClubsPage';
import { ServicesPage } from './pages/ServicesPage';
import { TimetablePage } from './pages/TimetablePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpPage } from './pages/HelpPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/navigation" element={<NavigationPage />} />
            <Route path="/lost-found" element={<LostFoundPage />} />
            <Route path="/cafeteria" element={<CafeteriaPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
