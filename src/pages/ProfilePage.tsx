import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  User,
  Settings,
  Bookmark,
  Accessibility,
  Download,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Heart,
  Save,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    places,
    clubs,
    services,
    events,
    exportDataAsJson,
    resetDemoData,
    addToast,
  } = useApp();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [course, setCourse] = useState(profile.course);
  const [yearSemester, setYearSemester] = useState(profile.yearSemester);
  const [campusId, setCampusId] = useState(profile.campusId);
  const [dietaryPreference, setDietaryPreference] = useState(profile.dietaryPreference);
  const [preferStepFree, setPreferStepFree] = useState(
    profile.accessibilityPreferences.preferStepFree
  );
  const [reducedMotion, setReducedMotion] = useState(
    profile.accessibilityPreferences.reducedMotion
  );
  const [newInterestInput, setNewInterestInput] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      course: course.trim(),
      yearSemester: yearSemester.trim(),
      campusId: campusId.trim(),
      dietaryPreference,
      accessibilityPreferences: {
        preferStepFree,
        largerText: profile.accessibilityPreferences.largerText,
        reducedMotion,
      },
    });
  };

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newInterestInput.trim()) {
      e.preventDefault();
      const val = newInterestInput.trim();
      if (!profile.interests.includes(val)) {
        updateProfile({ interests: [...profile.interests, val] });
      }
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    updateProfile({ interests: profile.interests.filter((i) => i !== interest) });
  };

  // Summaries
  const savedPlacesList = places.filter((p) => profile.savedPlaceIds.includes(p.id));
  const savedClubsList = clubs.filter((c) => profile.savedClubIds.includes(c.id));
  const savedServicesList = services.filter((s) => profile.savedServiceIds.includes(s.id));
  const registeredEventsList = events.filter((e) => e.registeredUserIds.includes(profile.id));

  return (
    <div className="space-y-6">
      {/* Header Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#315CEB] text-white text-2xl font-display font-bold flex items-center justify-center shrink-0 shadow-md shadow-[#315CEB]/20">
            {profile.displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-display font-bold text-[#17243A]">
                {profile.displayName}
              </h2>
              <Badge variant="lime" size="sm">
                Demo Student
              </Badge>
            </div>
            <p className="text-xs text-[#667085]">
              {profile.course} · {profile.yearSemester}
            </p>
            <p className="text-[11px] font-mono text-[#9CA3AF] mt-0.5">
              Campus ID: {profile.campusId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportDataAsJson}
            className="px-4 py-2 bg-white hover:bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold rounded-xl text-[#17243A] flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#315CEB]" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => setResetDialogOpen(true)}
            className="px-4 py-2 bg-[#FFF1EE] hover:bg-[#FFE4DE] text-[#C2410C] border border-[#FFDDD2] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#F27C66]" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Profile & Preferences Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E5E8]">
            <h3 className="font-display font-bold text-base text-[#17243A]">
              Identity & Student Settings
            </h3>
            <span className="text-xs text-[#667085]">Saved in browser storage</span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#17243A] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17243A] block mb-1">
                  Student / Campus ID
                </label>
                <input
                  type="text"
                  value={campusId}
                  onChange={(e) => setCampusId(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#17243A] block mb-1">
                  Academic Major / Department
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#17243A] block mb-1">
                  Year & Semester
                </label>
                <input
                  type="text"
                  value={yearSemester}
                  onChange={(e) => setYearSemester(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Dietary Preference (for Cafeteria recommendations)
              </label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Halal">Halal</option>
                <option value="No Restrictions">No Restrictions</option>
              </select>
            </div>

            {/* Accessibility Settings */}
            <div className="p-4 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#17243A] block uppercase tracking-wider">
                Accessibility Preferences
              </span>

              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-[#17243A]">
                <input
                  type="checkbox"
                  checked={preferStepFree}
                  onChange={(e) => setPreferStepFree(e.target.checked)}
                  className="rounded border-[#E3E5E8] text-[#315CEB] w-4 h-4"
                />
                <div>
                  <span className="font-semibold block">Prefer step-free routes</span>
                  <span className="text-[11px] text-[#667085]">
                    Navigation defaults to ramp-equipped paths and elevators
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-[#17243A]">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="rounded border-[#E3E5E8] text-[#315CEB] w-4 h-4"
                />
                <div>
                  <span className="font-semibold block">Reduced motion mode</span>
                  <span className="text-[11px] text-[#667085]">
                    Minimize interface transitions and board animations
                  </span>
                </div>
              </label>
            </div>

            {/* Interests Tag Cloud */}
            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Campus Interests & Clubs Focus (Press Enter to add)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl min-h-[44px]">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E3E5E8] rounded-lg text-xs font-semibold text-[#17243A]"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-[#9CA3AF] hover:text-[#B93838]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="Type interest..."
                  className="bg-transparent border-none outline-none text-xs text-[#17243A] placeholder-[#9CA3AF] p-1 flex-1 min-w-[120px]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Preferences</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Saved Items & Registered Events Summary */}
        <div className="lg:col-span-5 space-y-5">
          {/* Registered Events */}
          <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E5E8]">
              <h4 className="font-display font-bold text-sm text-[#17243A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F27C66]" />
                <span>My Registered Events ({registeredEventsList.length})</span>
              </h4>
              <NavLink to="/events" className="text-xs text-[#315CEB] font-semibold hover:underline">
                Explore
              </NavLink>
            </div>

            <div className="space-y-2">
              {registeredEventsList.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] italic py-2">
                  No registered events yet.
                </p>
              ) : (
                registeredEventsList.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] text-xs flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-[#17243A] block truncate">
                        {evt.title}
                      </span>
                      <span className="text-[11px] text-[#667085]">
                        {new Date(evt.startAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <Badge variant="coral" size="sm">
                      {evt.category}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Places */}
          <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E5E8]">
              <h4 className="font-display font-bold text-sm text-[#17243A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#315CEB]" />
                <span>Saved Campus Places ({savedPlacesList.length})</span>
              </h4>
              <NavLink to="/navigation" className="text-xs text-[#315CEB] font-semibold hover:underline">
                Map
              </NavLink>
            </div>

            <div className="space-y-2">
              {savedPlacesList.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] text-xs flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-semibold text-[#17243A] block truncate">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-[#667085]">{p.building}</span>
                  </div>
                  <NavLink
                    to={`/navigation?to=${p.id}`}
                    className="text-xs font-bold text-[#315CEB] hover:underline shrink-0"
                  >
                    Route
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Clubs */}
          <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E3E5E8]">
              <h4 className="font-display font-bold text-sm text-[#17243A] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#3F6212]" />
                <span>Bookmarked Clubs ({savedClubsList.length})</span>
              </h4>
              <NavLink to="/clubs" className="text-xs text-[#315CEB] font-semibold hover:underline">
                Clubs
              </NavLink>
            </div>

            <div className="space-y-2">
              {savedClubsList.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] text-xs flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-semibold text-[#17243A] block truncate">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-[#667085]">{c.category}</span>
                  </div>
                  <Badge variant="lime" size="sm">
                    {c.recruitmentStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Reset */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        title="Reset Demo Data to Initial Seed?"
        message="This will clear your local changes and reload the default fictional student records. Your current edits and tasks will be overwritten."
        confirmText="Reset Everything"
        variant="danger"
        onConfirm={resetDemoData}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
};
