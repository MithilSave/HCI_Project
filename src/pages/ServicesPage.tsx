import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StudentService, ServiceCategory } from '../types';
import {
  LifeBuoy,
  Search,
  Clock,
  MapPin,
  Mail,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    services,
    profile,
    getPlaceById,
    toggleSaveService,
    addToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceModal, setSelectedServiceModal] = useState<StudentService | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check highlight query param from global search
  React.useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      const match = services.find((s) => s.id === highlight);
      if (match) setSelectedServiceModal(match);
    }
  }, [searchParams, services]);

  const categories: (ServiceCategory | 'All')[] = [
    'All',
    'Administration',
    'IT Support',
    'Careers',
    'Health & Wellbeing',
    'Security & Lost Property',
    'Accessibility',
  ];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (selectedCategory !== 'All' && srv.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          srv.name.toLowerCase().includes(q) ||
          srv.purpose.toLowerCase().includes(q) ||
          srv.helpsWith.some((h) => h.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleCopyContact = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    addToast('Contact Copied', `${email} copied to your clipboard.`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#6D28D9]" />
            <span>Campus Administrative Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Student Services & Helpdesks
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Everything you need for administrative clearances, health checkups, IT troubleshooting, and career coaching.
          </p>
        </div>

        <div className="p-3 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl text-[11px] text-[#667085] max-w-xs">
          <span className="font-bold text-[#17243A] block mb-0.5">Prototype Disclaimer:</span>
          Operating hours and staff contacts are verified sample demo records for university usability testing.
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

        {/* Search */}
        <div className="relative w-full sm:w-72 pt-2 border-t border-[#E3E5E8]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-4.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by department, letters, or certificates..."
            className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => {
          const isSaved = profile.savedServiceIds.includes(srv.id);
          const locationPlace = getPlaceById(srv.locationPlaceId);

          return (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="lilac" size="sm">
                    {srv.category}
                  </Badge>

                  <button
                    onClick={() => toggleSaveService(srv.id)}
                    className="p-1 text-[#9CA3AF] hover:text-[#315CEB]"
                    title={isSaved ? 'Unsave' : 'Save'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#315CEB]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="font-display font-bold text-base text-[#17243A] leading-snug">
                  {srv.name}
                </h3>

                <p className="text-xs text-[#475467] mt-2 line-clamp-2 leading-relaxed">
                  {srv.purpose}
                </p>

                <div className="mt-4 p-3 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#667085]">
                    <Clock className="w-3.5 h-3.5 text-[#315CEB] shrink-0" />
                    <span className="truncate">{srv.openingHours}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#17243A]">
                    <MapPin className="w-3.5 h-3.5 text-[#F27C66] shrink-0" />
                    <span className="truncate font-semibold">
                      {locationPlace?.name || 'Campus Desk'}
                    </span>
                  </div>
                </div>

                {/* What it helps with tags */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                    Key Assistance
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {srv.helpsWith.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-[10px] text-[#475467]"
                      >
                        {item}
                      </span>
                    ))}
                    {srv.helpsWith.length > 2 && (
                      <span className="text-[10px] text-[#315CEB] font-semibold self-center">
                        +{srv.helpsWith.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedServiceModal(srv)}
                  className="text-xs font-semibold text-[#475467] hover:text-[#17243A]"
                >
                  View Details & Docs
                </button>

                <button
                  onClick={() => navigate(`/navigation?to=${srv.locationPlaceId}`)}
                  className="px-3 py-1.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedServiceModal(null)}
          title={selectedServiceModal.name}
          subtitle={`Lead Coordinator: ${selectedServiceModal.coordinator}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="lilac">{selectedServiceModal.category}</Badge>
              <span className="text-xs text-[#667085]">
                {selectedServiceModal.openingHours}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-[#17243A] uppercase tracking-wider block mb-1">
                What this service helps with
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475467]">
                {selectedServiceModal.helpsWith.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 bg-[#FAF9F5] rounded-xl border border-[#E3E5E8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#20845A] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-[#17243A] uppercase tracking-wider block mb-1">
                Required Documents Checklist
              </span>
              <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl space-y-1.5 text-xs text-[#92400E]">
                {selectedServiceModal.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl text-xs space-y-2">
              <span className="font-bold text-[#17243A] block">Before You Visit:</span>
              <p className="text-[#475467] leading-relaxed">
                {selectedServiceModal.beforeYouVisit}
              </p>

              <div className="pt-2 flex items-center justify-between text-[#667085] border-t border-[#E3E5E8]/60">
                <span>Contact Email: {selectedServiceModal.contactEmail}</span>
                <button
                  onClick={() =>
                    handleCopyContact(
                      selectedServiceModal.contactEmail,
                      selectedServiceModal.id
                    )
                  }
                  className="text-xs font-bold text-[#315CEB] hover:underline flex items-center gap-1"
                >
                  {copiedId === selectedServiceModal.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#20845A]" />
                      <span className="text-[#20845A]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E5E8] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
              >
                Close
              </button>

              <button
                onClick={() => {
                  navigate(`/navigation?to=${selectedServiceModal.locationPlaceId}`);
                  setSelectedServiceModal(null);
                }}
                className="px-4 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs"
              >
                <MapPin className="w-4 h-4" />
                <span>Show Venue on Campus Map</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
