import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Club, ClubCategory } from '../types';
import {
  Users,
  Search,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  Mail,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ClubsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    clubs,
    profile,
    toggleSaveClub,
    toggleClubMembership,
    toggleClubInterest,
    addToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [selectedClubModal, setSelectedClubModal] = useState<Club | null>(null);

  // Check highlight query parameter
  React.useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      const match = clubs.find((c) => c.id === highlight);
      if (match) setSelectedClubModal(match);
    }
  }, [searchParams, clubs]);

  const categories: (ClubCategory | 'All')[] = [
    'All',
    'Technology',
    'Arts & Culture',
    'Sports',
    'Social Impact',
    'Entrepreneurship',
  ];

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      if (selectedCategory !== 'All' && club.category !== selectedCategory) return false;
      if (showSavedOnly && !profile.savedClubIds.includes(club.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          club.name.toLowerCase().includes(q) ||
          club.purpose.toLowerCase().includes(q) ||
          club.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [clubs, selectedCategory, showSavedOnly, searchQuery, profile]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#3F6212]" />
            <span>Campus Student Communities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Clubs, Societies & Student Coalitions
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Find your crowd, join weekly workshops, and take leadership roles in student-run initiatives.
          </p>
        </div>

        <div className="p-4 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl flex items-center gap-4 text-xs">
          <div>
            <span className="font-bold text-sm font-display text-[#17243A] block">
              {clubs.filter((c) => c.isMember).length} Clubs Joined
            </span>
            <span className="text-[#667085]">Active participation</span>
          </div>
          <Users className="w-6 h-6 text-[#315CEB]" />
        </div>
      </div>

      {/* Filter and Category Bar */}
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

        {/* Search & Saved Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E3E5E8]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by club name or interests..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#17243A]">
            <input
              type="checkbox"
              checked={showSavedOnly}
              onChange={(e) => setShowSavedOnly(e.target.checked)}
              className="rounded border-[#E3E5E8] text-[#315CEB] focus:ring-[#315CEB] w-4 h-4"
            />
            <span>Show bookmarked clubs only</span>
          </label>
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E3E5E8]">
          <Users className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
          <h3 className="font-display font-bold text-base text-[#17243A]">No clubs found</h3>
          <p className="text-xs text-[#667085] mt-1">
            Try resetting your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club) => {
            const isSaved = profile.savedClubIds.includes(club.id);

            return (
              <div
                key={club.id}
                className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="lime" size="sm">
                      {club.recruitmentStatus}
                    </Badge>

                    <button
                      onClick={() => toggleSaveClub(club.id)}
                      className="p-1 text-[#9CA3AF] hover:text-[#315CEB]"
                      title={isSaved ? 'Unbookmark' : 'Bookmark'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#315CEB]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#17243A] leading-snug">
                    {club.name}
                  </h3>
                  <span className="text-xs text-[#315CEB] font-semibold block mt-0.5">
                    {club.category} · {club.membersCount} members
                  </span>

                  <p className="text-xs text-[#475467] mt-3 line-clamp-2 leading-relaxed">
                    {club.purpose}
                  </p>

                  <div className="mt-3 p-3 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[#667085]">
                      <Clock className="w-3.5 h-3.5 text-[#315CEB] shrink-0" />
                      <span className="truncate">{club.meetingFrequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#17243A] font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#F27C66] shrink-0" />
                      <span className="truncate">Next: {club.nextActivity}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {club.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-[10px] text-[#667085]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClubModal(club)}
                    className="text-xs font-semibold text-[#475467] hover:text-[#17243A]"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1.5">
                    {club.isMember ? (
                      <button
                        onClick={() => toggleClubMembership(club.id)}
                        className="px-3 py-1.5 bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-xs font-bold rounded-xl hover:bg-[#DCFCE7]"
                      >
                        Member (Leave)
                      </button>
                    ) : club.isInterested ? (
                      <button
                        onClick={() => toggleClubInterest(club.id)}
                        className="px-3 py-1.5 bg-[#EEF2FF] text-[#315CEB] border border-[#C7D2FE] text-xs font-bold rounded-xl hover:bg-[#E0E7FF]"
                      >
                        Interest Sent
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleClubInterest(club.id)}
                        className="px-3 py-1.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Join / Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Club Detail Modal */}
      {selectedClubModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedClubModal(null)}
          title={selectedClubModal.name}
          subtitle={`${selectedClubModal.category} · ${selectedClubModal.membersCount} active members`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="lime">{selectedClubModal.recruitmentStatus}</Badge>
              <span className="text-xs text-[#667085]">
                Meets: {selectedClubModal.meetingFrequency}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#17243A] uppercase tracking-wider block mb-1">
                About the Community
              </span>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                {selectedClubModal.description}
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#17243A]">
                <Sparkles className="w-4 h-4 text-[#315CEB]" />
                <span className="font-semibold">Next Scheduled Activity:</span>
                <span>{selectedClubModal.nextActivity}</span>
              </div>
              <div className="flex items-center gap-2 text-[#667085]">
                <Mail className="w-4 h-4 text-[#667085]" />
                <span>
                  {selectedClubModal.contactRole}:{' '}
                  <strong className="text-[#17243A]">
                    {selectedClubModal.contactEmail}
                  </strong>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E5E8] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedClubModal(null)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleClubMembership(selectedClubModal.id);
                    setSelectedClubModal((c) =>
                      c ? { ...c, isMember: !c.isMember, isInterested: false } : null
                    );
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
                    selectedClubModal.isMember
                      ? 'bg-[#FEF2F2] text-[#B93838] border border-[#FECACA]'
                      : 'bg-[#315CEB] text-white hover:bg-[#2447C5]'
                  }`}
                >
                  {selectedClubModal.isMember ? 'Withdraw Membership' : 'Join as Full Member'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
