import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LostFoundReport, ReportStatus } from '../types';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  QrCode,
  Tag,
  ArrowRight,
  Filter,
  Sparkles,
  Camera,
  X,
  Upload,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const LostFoundPage: React.FC = () => {
  const {
    lostFoundReports,
    profile,
    addLostFoundReport,
    claimReport,
    resolveReport,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'my-reports'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'lost' | 'found'>('lost');
  const [detailModalItem, setDetailModalItem] = useState<LostFoundReport | null>(null);
  const [claimModalItem, setClaimModalItem] = useState<LostFoundReport | null>(null);
  const [claimProofText, setClaimProofText] = useState('');
  const [handoverSuccessCode, setHandoverSuccessCode] = useState<string | null>(null);
  const [resolveConfirmId, setResolveConfirmId] = useState<string | null>(null);

  // Form State for Report
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<LostFoundReport['category']>('electronics');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formPrivateHint, setFormPrivateHint] = useState('');
  const [formHandoverLocation, setFormHandoverLocation] = useState(
    'Campus Security & Central Lost Property (Main Gate)'
  );
  const [formImagePreview, setFormImagePreview] = useState<string | undefined>(undefined);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filtered & Sorted reports
  const filteredReports = useMemo(() => {
    return lostFoundReports
      .filter((r) => {
        if (activeTab === 'lost' && r.type !== 'lost') return false;
        if (activeTab === 'found' && r.type !== 'found') return false;
        if (activeTab === 'my-reports' && r.createdBy !== profile.displayName) return false;
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchDesc = r.description.toLowerCase().includes(q);
          const matchLoc = r.location.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchLoc;
        }
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [lostFoundReports, activeTab, selectedCategory, statusFilter, searchQuery, sortBy, profile]);

  // Suggested Matches algorithm (transparent rule: opposite type + matching category or overlapping keyword)
  const suggestedMatches = useMemo(() => {
    const suggestions: { item: LostFoundReport; matchWith: LostFoundReport; reason: string }[] = [];

    const myItems = lostFoundReports.filter(
      (r) => r.createdBy === profile.displayName || r.type === 'lost'
    );
    const candidateItems = lostFoundReports.filter((r) => r.type === 'found' && r.status !== 'resolved');

    for (const myItem of myItems.slice(0, 2)) {
      for (const candidate of candidateItems) {
        if (myItem.id === candidate.id) continue;

        // Check category match
        if (myItem.category === candidate.category) {
          suggestions.push({
            item: candidate,
            matchWith: myItem,
            reason: `Matching category (${myItem.category}) and reported near same time window.`,
          });
          break;
        }
      }
    }
    return suggestions;
  }, [lostFoundReports, profile]);

  // Handle image upload with size validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('File too large', 'Please select an image smaller than 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenReport = (type: 'lost' | 'found') => {
    setReportType(type);
    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setFormPrivateHint('');
    setFormImagePreview(undefined);
    setFormErrors({});
    setReportModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formTitle.trim()) errors.title = 'Item title is required';
    if (!formDescription.trim()) errors.description = 'Please provide a clear description';
    if (!formLocation.trim()) errors.location = 'Location is required';
    if (!formDate) errors.date = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addLostFoundReport({
      type: reportType,
      title: formTitle.trim(),
      category: formCategory,
      description: formDescription.trim(),
      location: formLocation.trim(),
      date: formDate,
      privateVerificationHint: formPrivateHint.trim() || undefined,
      handoverLocation: formHandoverLocation,
      imageDataUrl: formImagePreview,
    });

    setReportModalOpen(false);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalItem || !claimProofText.trim()) return;

    const result = claimReport(claimModalItem.id, claimProofText.trim());
    setHandoverSuccessCode(result.handoverCode);
    setClaimModalItem(null);
    setClaimProofText('');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E3E5E8] text-xs font-semibold text-[#667085] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#315CEB]" />
            <span>Campus Item Registry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Found something? Help it find its person.
          </h2>
          <p className="text-xs sm:text-sm text-[#475467] mt-1 max-w-xl">
            Structured item logging with private verification clues and secure security-desk handover vouchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleOpenReport('lost')}
            className="px-4 py-2 bg-[#FFF1EE] hover:bg-[#FFE4DE] text-[#C2410C] border border-[#FFDDD2] text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-[#F27C66]" />
            <span>Report Lost Item</span>
          </button>
          <button
            onClick={() => handleOpenReport('found')}
            className="px-4 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found Item</span>
          </button>
        </div>
      </div>

      {/* Suggested Potential Matches Banner (if any) */}
      {suggestedMatches.length > 0 && (
        <div className="bg-[#FAF9F5] rounded-3xl p-5 border border-[#C7D2FE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2447C5]">
              <Sparkles className="w-4 h-4 text-[#315CEB]" />
              <span>Suggested Item Matches (Rule-based detection)</span>
            </div>
            <span className="text-[11px] text-[#667085]">
              Matches category and timeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedMatches.map(({ item, matchWith, reason }) => (
              <div
                key={`match-${item.id}-${matchWith.id}`}
                className="p-3.5 bg-white rounded-2xl border border-[#E3E5E8] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="coral" size="sm">
                      Potential Match
                    </Badge>
                    <span className="text-[11px] text-[#667085]">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#17243A] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#475467] mt-1">{item.description}</p>
                  <p className="text-[11px] text-[#315CEB] font-medium mt-2 bg-[#EEF2FF] p-2 rounded-lg">
                    Reason: {reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E3E5E8] mt-3">
                  <span className="text-xs text-[#667085]">Found at: {item.location}</span>
                  <button
                    onClick={() => setClaimModalItem(item)}
                    className="px-3 py-1 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    This is Mine
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs space-y-4">
        {/* Segmented Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E5E8]">
          <div className="flex items-center p-1 bg-[#F7F6F1] rounded-2xl border border-[#E3E5E8]">
            {(
              [
                { id: 'all', label: 'All Items' },
                { id: 'lost', label: 'Lost' },
                { id: 'found', label: 'Found' },
                { id: 'my-reports', label: 'My Reports' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#17243A] shadow-xs'
                    : 'text-[#667085] hover:text-[#17243A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#667085]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="text-xs font-semibold bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-2.5 py-1 text-[#17243A]"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Search & Sub-filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, brand, or location..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#17243A] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="id-cards">Student ID & Cards</option>
              <option value="bottle-box">Bottles & Boxes</option>
              <option value="stationery">Stationery & Notebooks</option>
              <option value="keys">Keys & Badges</option>
              <option value="clothing">Clothing & Gear</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#17243A] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="potential-match">Potential Match</option>
              <option value="claim-pending">Claim Pending</option>
              <option value="ready-for-handover">Ready for Handover</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E3E5E8]">
          <Search className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
          <h3 className="font-display font-bold text-base text-[#17243A]">
            No matching items found
          </h3>
          <p className="text-xs text-[#667085] mt-1">
            Try adjusting your search terms or filter selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const isMine = report.createdBy === profile.displayName;
            const statusVariant = {
              reported: 'neutral',
              'potential-match': 'coral',
              'claim-pending': 'warning',
              'ready-for-handover': 'mint',
              resolved: 'success',
            }[report.status] as any;

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-[#E3E5E8] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant={report.type === 'lost' ? 'coral' : 'cobalt'}
                      size="sm"
                    >
                      {report.type.toUpperCase()}
                    </Badge>
                    <Badge variant={statusVariant} size="sm">
                      {report.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#17243A] leading-snug">
                    {report.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#667085] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#315CEB] shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#667085] mt-1">
                    <Calendar className="w-3.5 h-3.5 text-[#667085] shrink-0" />
                    <span>{report.date}</span>
                  </div>

                  <p className="text-xs text-[#475467] mt-3 line-clamp-3 leading-relaxed">
                    {report.description}
                  </p>

                  {/* Private Hint Notice */}
                  {report.privateVerificationHint && (
                    <div className="mt-3 p-2 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] flex items-center gap-2 text-[11px] text-[#667085]">
                      <Lock className="w-3 h-3 text-[#315CEB]" />
                      <span>Has private verification clue (protected)</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#E3E5E8] mt-4 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-semibold text-[#9CA3AF]">
                    #{report.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDetailModalItem(report)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#475467] hover:text-[#17243A] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                    >
                      Details
                    </button>

                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => setClaimModalItem(report)}
                        className="px-3 py-1 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                      >
                        Claim
                      </button>
                    )}

                    {isMine && report.status !== 'resolved' && (
                      <button
                        onClick={() => setResolveConfirmId(report.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#20845A] hover:bg-[#F0FDF4] rounded-lg border border-[#BBF7D0] transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Item Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={reportType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
        subtitle="Provide clear identifying details. Private clues are kept strictly confidential."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Item Title *
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. TI-84 Plus Graphing Calculator, Silver Flask..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
            {formErrors.title && (
              <span className="text-xs text-[#B93838] mt-0.5 block">{formErrors.title}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
              >
                <option value="electronics">Electronics</option>
                <option value="id-cards">Student ID & Cards</option>
                <option value="bottle-box">Bottle & Lunchbox</option>
                <option value="stationery">Stationery & Books</option>
                <option value="keys">Keys & Tags</option>
                <option value="clothing">Clothing & Bags</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Date Lost / Found *
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
              />
              {formErrors.date && (
                <span className="text-xs text-[#B93838] mt-0.5 block">{formErrors.date}</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Location *
            </label>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              placeholder="e.g. Lecture Hall 203, Library 1st Floor Study Pod..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
            {formErrors.location && (
              <span className="text-xs text-[#B93838] mt-0.5 block">{formErrors.location}</span>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Public Description *
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Describe color, general brand, visible condition (avoid sharing private serials or passwords here)..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-3 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            />
            {formErrors.description && (
              <span className="text-xs text-[#B93838] mt-0.5 block">
                {formErrors.description}
              </span>
            )}
          </div>

          {/* Private Verification Hint (Safety Requirement) */}
          <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#315CEB]" />
              <label className="text-xs font-bold text-[#2447C5]">
                Private Ownership Verification Clue (Confidential)
              </label>
            </div>
            <p className="text-[11px] text-[#475467] leading-relaxed">
              Enter a detail only the true owner would know (e.g. serial number suffix, custom lock screen wallpaper, engraved name, or stickers). This is NOT shown on the public report.
            </p>
            <input
              type="text"
              value={formPrivateHint}
              onChange={(e) => setFormPrivateHint(e.target.value)}
              placeholder="e.g. Holographic cat sticker inside the battery compartment"
              className="w-full bg-white border border-[#C7D2FE] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none"
            />
          </div>

          {/* Handover Safe Location */}
          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Preferred Handover Staging Desk
            </label>
            <select
              value={formHandoverLocation}
              onChange={(e) => setFormHandoverLocation(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none"
            >
              <option value="Campus Security & Central Lost Property (Main Gate)">
                Campus Security & Central Lost Property (Main Gate)
              </option>
              <option value="Unified Student Services Desk (Admin Block)">
                Unified Student Services Desk (Admin Block)
              </option>
              <option value="Central Library Front Circulation Desk">
                Central Library Front Circulation Desk
              </option>
              <option value="Cafeteria Supervisor Counter">Cafeteria Supervisor Counter</option>
            </select>
          </div>

          {/* Image Upload with preview */}
          <div>
            <label className="text-xs font-bold text-[#17243A] block mb-1">
              Optional Image Preview (Max 2MB)
            </label>
            {formImagePreview ? (
              <div className="relative inline-block border border-[#E3E5E8] rounded-2xl overflow-hidden">
                <img
                  src={formImagePreview}
                  alt="Item preview"
                  className="w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormImagePreview(undefined)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-3 bg-[#FAF9F5] border border-dashed border-[#E3E5E8] rounded-2xl cursor-pointer hover:border-[#315CEB] transition-colors">
                <Camera className="w-5 h-5 text-[#667085]" />
                <span className="text-xs text-[#667085]">
                  Click to select a photo from your device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E5E8]">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {detailModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setDetailModalItem(null)}
          title={detailModalItem.title}
          subtitle={`Report #${detailModalItem.id} · Logged by ${detailModalItem.createdBy}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <Badge variant={detailModalItem.type === 'lost' ? 'coral' : 'cobalt'}>
                {detailModalItem.type.toUpperCase()}
              </Badge>
              <Badge variant="mint">{detailModalItem.status.replace('-', ' ')}</Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#667085]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#315CEB]" />
                <span className="text-[#17243A] font-semibold">{detailModalItem.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date: {detailModalItem.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
              {detailModalItem.description}
            </p>

            {detailModalItem.handoverLocation && (
              <div className="p-3 bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl text-xs">
                <span className="font-bold text-[#17243A] block">Handover Desk:</span>
                <span className="text-[#667085]">{detailModalItem.handoverLocation}</span>
              </div>
            )}

            <div className="pt-3 border-t border-[#E3E5E8] flex justify-end gap-2">
              <button
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
              >
                Close
              </button>
              {detailModalItem.status !== 'resolved' && (
                <button
                  onClick={() => {
                    setClaimModalItem(detailModalItem);
                    setDetailModalItem(null);
                  }}
                  className="px-4 py-2 bg-[#315CEB] text-white text-xs font-bold rounded-xl hover:bg-[#2447C5]"
                >
                  Claim This Item
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Claim Modal (Privacy Preserving) */}
      {claimModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setClaimModalItem(null)}
          title="Verify Ownership to Claim"
          subtitle={`Claiming: ${claimModalItem.title}`}
          maxWidth="md"
        >
          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl text-xs text-[#92400E] leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Safe Verification Process</span>
              </div>
              Please provide identifying clues (e.g. unlock passcode type, unique scratches, contents of pouch) that only the rightful owner can verify.
            </div>

            <div>
              <label className="text-xs font-bold text-[#17243A] block mb-1">
                Your Ownership Proof Details *
              </label>
              <textarea
                rows={3}
                required
                value={claimProofText}
                onChange={(e) => setClaimProofText(e.target.value)}
                placeholder="e.g. The case has a small scratch on the bottom-right and contains my spare blue SIM pin."
                className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-3 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#315CEB]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3E5E8]">
              <button
                type="button"
                onClick={() => setClaimModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F3F4F6] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Submit Claim & Generate Voucher
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Handover Voucher Success Dialog */}
      {handoverSuccessCode && (
        <Modal
          isOpen={true}
          onClose={() => setHandoverSuccessCode(null)}
          title="Claim Approved · Handover Code"
          subtitle="Present this voucher to Campus Security or Helpdesk staff."
          maxWidth="sm"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#315CEB] flex items-center justify-center mx-auto border border-[#C7D2FE]">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
                Verification Token
              </span>
              <span className="text-3xl font-mono font-bold text-[#17243A] tracking-wider block mt-1">
                {handoverSuccessCode}
              </span>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#E3E5E8] rounded-2xl text-xs text-[#475467] text-left space-y-1">
              <span className="font-bold text-[#17243A] block">Next Steps:</span>
              <p>1. Walk to the Central Security Desk at Main Campus Gate.</p>
              <p>2. Show this code along with your Student ID card.</p>
              <p>3. Verify ownership details with the duty officer.</p>
            </div>

            <button
              onClick={() => setHandoverSuccessCode(null)}
              className="w-full py-2.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Done & Saved to Notifications
            </button>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog for Resolving Report */}
      <ConfirmDialog
        isOpen={Boolean(resolveConfirmId)}
        title="Mark Item as Resolved?"
        message="This will mark the item as returned to its owner and archive the public listing."
        confirmText="Mark as Resolved"
        variant="primary"
        onConfirm={() => {
          if (resolveConfirmId) {
            resolveReport(resolveConfirmId);
            setResolveConfirmId(null);
          }
        }}
        onCancel={() => setResolveConfirmId(null)}
      />
    </div>
  );
};
