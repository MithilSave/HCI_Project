import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CampusPlace } from '../types';
import {
  Search,
  MapPin,
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  Compass,
  Footprints,
  Clock,
  Accessibility,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation as NavIcon,
  BookOpen,
  Monitor,
  Utensils,
  GraduationCap,
  Building2,
  Shield,
  Activity,
  Award,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const NavigationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { places, profile, toggleSavePlace, addToast } = useApp();

  const [startPlaceId, setStartPlaceId] = useState<string>('main-entrance');
  const [destPlaceId, setDestPlaceId] = useState<string>('cr-304');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRoute, setShowRoute] = useState<boolean>(true);
  const [preferAccessible, setPreferAccessible] = useState<boolean>(
    profile.accessibilityPreferences.preferStepFree
  );
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState<CampusPlace | null>(null);

  // Zoom / Pan state for the map
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Read ?to query param if present
  useEffect(() => {
    const toParam = searchParams.get('to');
    if (toParam && places.some((p) => p.id === toParam)) {
      setDestPlaceId(toParam);
      setShowRoute(true);
    }
  }, [searchParams, places]);

  const categories = [
    'All',
    'Classrooms',
    'Labs',
    'Faculty',
    'Admin',
    'Library',
    'Food',
    'Student Services',
  ];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      const matchCat =
        selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [places, selectedCategory, searchQuery]);

  const startPlace = places.find((p) => p.id === startPlaceId);
  const destPlace = places.find((p) => p.id === destPlaceId);

  // Waypoint network: Coordinates of walkways on 1000x650 grid
  // Main waypoints:
  // Gate: (185, 530)
  // Admin Walkway: (175, 470)
  // Plaza Junction: (280, 420)
  // Building A Entrance: (340, 340)
  // Quad West: (395, 340)
  // Quad Center: (480, 340)
  // Quad North: (540, 220)
  // Library Entrance: (540, 170)
  // Quad South: (535, 420)
  // Dining Commons Entrance: (535, 470)
  // Quad East: (600, 340)
  // Tech Wing B Entrance: (620, 290)
  // Auditorium Entrance: (730, 520)
  // Sports Entrance: (740, 110)

  // Calculate animated route path
  const routePathString = useMemo(() => {
    if (!startPlace || !destPlace || startPlace.id === destPlace.id) {
      return '';
    }

    // Connect from start room to its entrance, through the Quad, to dest entrance, to dest room
    const getEntrance = (place: CampusPlace): [number, number] => {
      switch (place.building) {
        case 'Building A (Academic Wing)':
          return [340, 340];
        case 'Building B (Tech Wing)':
          return [620, 290];
        case 'Library Block':
          return [540, 170];
        case 'Student Hub':
          return [535, 470];
        case 'North Cultural Wing':
          return [730, 520];
        case 'Athletics Arena':
          return [740, 110];
        case 'Administration Block':
        case 'Main Quad':
        case 'Student Health Wing':
        default:
          return [185, 500];
      }
    };

    const startEntrance = getEntrance(startPlace);
    const destEntrance = getEntrance(destPlace);

    // If both places are in the same building, direct corridor route
    if (startPlace.building === destPlace.building) {
      const midX = (startPlace.mapX + destPlace.mapX) / 2;
      return `M ${startPlace.mapX} ${startPlace.mapY} L ${midX} ${startPlace.mapY} L ${midX} ${destPlace.mapY} L ${destPlace.mapX} ${destPlace.mapY}`;
    }

    // Through central quad waypoint network
    return `M ${startPlace.mapX} ${startPlace.mapY} L ${startEntrance[0]} ${startEntrance[1]} Q 480 340 ${destEntrance[0]} ${destEntrance[1]} L ${destPlace.mapX} ${destPlace.mapY}`;
  }, [startPlace, destPlace]);

  // Turn-by-turn guidance and metrics
  const routeDetails = useMemo(() => {
    if (!startPlace || !destPlace || startPlace.id === destPlace.id) {
      return null;
    }

    const dx = destPlace.mapX - startPlace.mapX;
    const dy = destPlace.mapY - startPlace.mapY;
    const rawDist = Math.round(Math.sqrt(dx * dx + dy * dy) * 0.75); // realistic meters
    const distanceMeters = Math.max(40, rawDist);
    const walkingMinutes = Math.max(1, Math.ceil(distanceMeters / 70));

    const steps: { instruction: string; landmark?: string; accessibleNote?: string }[] = [];

    steps.push({
      instruction: `Depart from ${startPlace.name} on ${startPlace.floor}.`,
      landmark: startPlace.landmarks?.[0],
    });

    if (startPlace.building !== destPlace.building) {
      steps.push({
        instruction: `Exit ${startPlace.building} and follow the paved Quad promenade toward ${destPlace.building}.`,
        landmark: 'Passing Central Quad Green & Reflecting Fountain',
        accessibleNote: preferAccessible ? 'Level concrete path with tactile guide pavers' : undefined,
      });
    }

    if (destPlace.floor !== 'Ground Floor') {
      if (preferAccessible) {
        steps.push({
          instruction: `Enter ${destPlace.building} foyer and take Elevator 1 to ${destPlace.floor}.`,
          landmark: 'Elevator foyer is located directly behind the welcome directory',
          accessibleNote: 'Step-free automated door access verified',
        });
      } else {
        steps.push({
          instruction: `Take the central stairs or elevator up to ${destPlace.floor}.`,
          landmark: 'Follow overhead directional plaques',
        });
      }
    }

    steps.push({
      instruction: `Arrive at ${destPlace.name}. Entrance will be clearly marked.`,
      landmark: destPlace.landmarks?.[0] || 'Room number plaque',
    });

    return {
      distanceMeters,
      walkingMinutes,
      steps,
    };
  }, [startPlace, destPlace, preferAccessible]);

  const handleSwap = () => {
    const temp = startPlaceId;
    setStartPlaceId(destPlaceId);
    setDestPlaceId(temp);
    setShowRoute(true);
    addToast('Locations Swapped', undefined, 'info');
  };

  const handleClearRoute = () => {
    setShowRoute(false);
    addToast('Route Cleared', undefined, 'info');
  };

  const handleUseCurrentLocation = () => {
    setStartPlaceId('main-entrance');
    addToast(
      'Demo Location Set',
      'Using simulated start position: Main Campus Gate & Welcome Plaza.',
      'info'
    );
  };

  const isDestSaved = profile.savedPlaceIds.includes(destPlaceId);

  // Helper icon for place category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Classrooms':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Labs':
        return <Monitor className="w-3.5 h-3.5" />;
      case 'Library':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Food':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'Student Services':
      case 'Admin':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'Auditorium':
        return <Award className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#17243A]">
            Find your way around campus
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Schematic architectural floor plan, accessible promenade routing, and landmark guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUseCurrentLocation}
            className="px-3 py-1.5 bg-white border border-[#E3E5E8] hover:border-[#315CEB] text-xs font-semibold rounded-xl text-[#17243A] shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#315CEB]" />
            <span>Use Demo Location</span>
          </button>
        </div>
      </div>

      {/* Route Control Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3E5E8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Start Point */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block">
              Starting From
            </label>
            <select
              value={startPlaceId}
              onChange={(e) => {
                setStartPlaceId(e.target.value);
                setShowRoute(true);
              }}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            >
              {places.map((p) => (
                <option key={`start-${p.id}`} value={p.id}>
                  {p.name} ({p.building})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center py-1">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3E5E8] hover:bg-[#EEF2FF] hover:text-[#315CEB] transition-colors"
              title="Swap start and destination"
              aria-label="Swap locations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Point */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block">
              Destination
            </label>
            <select
              value={destPlaceId}
              onChange={(e) => {
                setDestPlaceId(e.target.value);
                setShowRoute(true);
              }}
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#17243A] focus:outline-none focus:border-[#315CEB]"
            >
              {places.map((p) => (
                <option key={`dest-${p.id}`} value={p.id}>
                  {p.name} ({p.building})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons & Accessible Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E3E5E8]">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#17243A]">
              <input
                type="checkbox"
                checked={preferAccessible}
                onChange={(e) => setPreferAccessible(e.target.checked)}
                className="rounded border-[#E3E5E8] text-[#315CEB] focus:ring-[#315CEB] w-4 h-4"
              />
              <Accessibility className="w-4 h-4 text-[#315CEB]" />
              <span>Step-free / Accessible routes only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            {destPlace && (
              <button
                onClick={() => toggleSavePlace(destPlace.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isDestSaved
                    ? 'bg-[#EEF2FF] text-[#315CEB] border-[#C7D2FE]'
                    : 'bg-white text-[#475467] border-[#E3E5E8] hover:bg-[#F3F4F6]'
                }`}
              >
                {isDestSaved ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Saved Place</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Place</span>
                  </>
                )}
              </button>
            )}

            {showRoute && (
              <button
                onClick={handleClearRoute}
                className="px-3 py-1.5 text-xs font-semibold text-[#667085] hover:text-[#17243A] rounded-xl hover:bg-[#F3F4F6] transition-colors"
              >
                Clear Route
              </button>
            )}

            <button
              onClick={() => setShowRoute(true)}
              className="px-4 py-1.5 bg-[#315CEB] hover:bg-[#2447C5] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Show Route
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors border ${
              selectedCategory === cat
                ? 'bg-[#17243A] text-white border-[#17243A]'
                : 'bg-white text-[#475467] border-[#E3E5E8] hover:border-[#315CEB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Schematic Map & Directions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Schematic SVG Campus Map */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-[#E3E5E8] shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[#17243A]">
                Architectural Campus Map
              </span>
              <span className="text-[11px] text-[#667085] hidden sm:inline">
                (Click any marker or building to inspect)
              </span>
            </div>

            {/* Zoom / Pan Controls */}
            <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl p-0.5">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
                className="p-1 rounded text-[#667085] hover:text-[#17243A] hover:bg-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                className="p-1 rounded text-[#667085] hover:text-[#17243A] hover:bg-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                className="p-1 rounded text-[#667085] hover:text-[#17243A] hover:bg-white"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full aspect-16/10 bg-[#FAF8F5] rounded-2xl border border-[#E3E5E8] overflow-hidden select-none shadow-inner">
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Blueprint grid */}
                <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EAE8E2" strokeWidth="1" />
                </pattern>

                {/* Building subtle elevation shadow */}
                <filter id="buildingShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
                </filter>

                {/* Marker shadow */}
                <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.25" />
                </filter>

                {/* Route gradient */}
                <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#315CEB" />
                  <stop offset="100%" stopColor="#2447C5" />
                </linearGradient>
              </defs>

              {/* Background grass & architectural grid */}
              <rect width="1000" height="650" fill="#FAF8F5" />
              <rect width="1000" height="650" fill="url(#campusGrid)" />

              {/* Campus North Compass Rose */}
              <g transform="translate(940, 50)" opacity="0.45" className="pointer-events-none">
                <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <polygon points="0,-18 5,-2 0,0 -5,-2" fill="#315CEB" />
                <polygon points="0,18 5,2 0,0 -5,2" fill="#94A3B8" />
                <text x="0" y="-24" fontSize="11" fontWeight="bold" fill="#315CEB" textAnchor="middle">
                  N
                </text>
              </g>

              {/* Scale bar indicator */}
              <g transform="translate(40, 620)" opacity="0.5" className="pointer-events-none">
                <line x1="0" y1="0" x2="80" y2="0" stroke="#64748B" strokeWidth="2" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="2" />
                <line x1="80" y1="-4" x2="80" y2="4" stroke="#64748B" strokeWidth="2" />
                <text x="40" y="-6" fontSize="10" fontWeight="bold" fill="#64748B" textAnchor="middle">
                  100 meters
                </text>
              </g>

              {/* Paved Walkways Network (Wide, elegant promenade) */}
              <g fill="none" stroke="#E7E5E0" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round">
                {/* Gate to Admin and Quad */}
                <path d="M 185 530 L 185 460 L 280 420 L 395 340 L 480 340" />
                {/* Quad to Building A */}
                <path d="M 280 420 L 340 340 L 340 320" />
                {/* Quad to Library */}
                <path d="M 480 340 L 540 220 L 540 170" />
                {/* Quad to Dining Hub */}
                <path d="M 480 340 L 535 420 L 535 470" />
                {/* Quad to Tech Wing B */}
                <path d="M 480 340 L 600 340 L 620 290" />
                {/* Dining to Auditorium */}
                <path d="M 535 470 L 650 520 L 730 520" />
                {/* Tech Wing to Sports Pavilion */}
                <path d="M 600 340 L 700 200 L 740 110" />
              </g>

              {/* Walkway inner border for crisp architectural aesthetic */}
              <g fill="none" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 185 530 L 185 460 L 280 420 L 395 340 L 480 340" />
                <path d="M 280 420 L 340 340 L 340 320" />
                <path d="M 480 340 L 540 220 L 540 170" />
                <path d="M 480 340 L 535 420 L 535 470" />
                <path d="M 480 340 L 600 340 L 620 290" />
                <path d="M 535 470 L 650 520 L 730 520" />
                <path d="M 600 340 L 700 200 L 740 110" />
              </g>

              {/* Central Quad Park (Lush green circle with pond/fountain) */}
              <g className="cursor-default">
                <circle cx="480" cy="340" r="92" fill="#E8F5E9" stroke="#C8E6C9" strokeWidth="2" />
                {/* Inner lawn rings */}
                <circle cx="480" cy="340" r="60" fill="#DCEDC8" stroke="#C5E1A5" strokeWidth="1.5" />
                {/* Central water fountain */}
                <circle cx="480" cy="340" r="22" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="2" />
                <circle cx="480" cy="340" r="10" fill="#0284C7" />
                <text x="480" y="344" fontSize="9" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
                  QUAD
                </text>
              </g>

              {/* =========================================
                  BUILDING BLOCKS (With clear roof banners)
                  ========================================= */}

              {/* 1. Main Gate Plaza (Bottom-Left) */}
              <g filter="url(#buildingShadow)">
                <rect x="90" y="500" width="180" height="90" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                {/* Header banner */}
                <path d="M 90 512 Q 90 500 102 500 L 258 500 Q 270 500 270 512 L 270 525 L 90 525 Z" fill="#F1F5F9" />
                <text x="180" y="517" fontSize="11" fontWeight="bold" fill="#475467" textAnchor="middle">
                  CAMPUS MAIN GATE & PLAZA
                </text>
              </g>

              {/* 2. Admin Block & Health Wing (Mid-Left) */}
              <g filter="url(#buildingShadow)">
                <rect x="70" y="240" width="180" height="230" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M 70 252 Q 70 240 82 240 L 238 240 Q 250 240 250 252 L 250 265 L 70 265 Z" fill="#F8FAFC" />
                <text x="160" y="257" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">
                  ADMINISTRATION & HEALTH
                </text>
              </g>

              {/* 3. Building A: Academic Wing (West-Center) */}
              <g filter="url(#buildingShadow)">
                <rect x="230" y="140" width="190" height="190" rx="14" fill="#FFFFFF" stroke="#315CEB" strokeWidth="2.5" />
                {/* Cobalt header banner */}
                <path d="M 230 154 Q 230 140 244 140 L 406 140 Q 420 140 420 154 L 420 168 L 230 168 Z" fill="#EEF2FF" />
                <text x="325" y="160" fontSize="12" fontWeight="bold" fill="#2447C5" textAnchor="middle">
                  BUILDING A · ACADEMIC WING
                </text>
              </g>

              {/* 4. Central Library (North-Center) */}
              <g filter="url(#buildingShadow)">
                <rect x="420" y="30" width="240" height="130" rx="14" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                <path d="M 420 44 Q 420 30 434 30 L 646 30 Q 660 30 660 44 L 660 58 L 420 58 Z" fill="#ECFDF5" />
                <text x="540" y="50" fontSize="12" fontWeight="bold" fill="#047857" textAnchor="middle">
                  CENTRAL LIBRARY & COMMONS
                </text>
              </g>

              {/* 5. Building B: Tech Wing (East-Center) */}
              <g filter="url(#buildingShadow)">
                <rect x="620" y="180" width="200" height="180" rx="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                <path d="M 620 194 Q 620 180 634 180 L 806 180 Q 820 180 820 194 L 820 208 L 620 208 Z" fill="#F0F9FF" />
                <text x="720" y="200" fontSize="12" fontWeight="bold" fill="#0369A1" textAnchor="middle">
                  BUILDING B · TECH WING
                </text>
              </g>

              {/* 6. Student Hub & Dining Commons (South-Center) */}
              <g filter="url(#buildingShadow)">
                <rect x="420" y="480" width="230" height="135" rx="14" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
                <path d="M 420 494 Q 420 480 434 480 L 636 480 Q 650 480 650 494 L 650 508 L 420 508 Z" fill="#FFF7ED" />
                <text x="535" y="500" fontSize="12" fontWeight="bold" fill="#C2410C" textAnchor="middle">
                  STUDENT HUB & DINING
                </text>
              </g>

              {/* 7. Grand Auditorium (South-East) */}
              <g filter="url(#buildingShadow)">
                <rect x="730" y="460" width="200" height="140" rx="14" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2.5" />
                <path d="M 730 474 Q 730 460 744 460 L 916 460 Q 930 460 930 474 L 930 488 L 730 488 Z" fill="#FAF5FF" />
                <text x="830" y="480" fontSize="12" fontWeight="bold" fill="#6D28D9" textAnchor="middle">
                  GRAND AUDITORIUM
                </text>
              </g>

              {/* 8. Sports Pavilion (North-East) */}
              <g filter="url(#buildingShadow)">
                <rect x="730" y="40" width="200" height="120" rx="14" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.5" />
                <path d="M 730 54 Q 730 40 744 40 L 916 40 Q 930 40 930 54 L 930 68 L 730 68 Z" fill="#F0FDF4" />
                <text x="830" y="60" fontSize="12" fontWeight="bold" fill="#15803D" textAnchor="middle">
                  SPORTS & ATHLETICS
                </text>
              </g>

              {/* Active Route Highlight (Glowing animated path) */}
              {showRoute && routePathString && (
                <g>
                  {/* Subtle outer glow */}
                  <path
                    d={routePathString}
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                  {/* Primary walking line with moving dashes */}
                  <path
                    d={routePathString}
                    fill="none"
                    stroke="#315CEB"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="10 8"
                    className="animate-pulse"
                  />
                </g>
              )}

              {/* =========================================
                  PLACE PINS & LABELS (High contrast badges)
                  ========================================= */}
              {places.map((place) => {
                const isStart = place.id === startPlaceId;
                const isDest = place.id === destPlaceId;
                const isSelected = selectedPlaceForModal?.id === place.id;
                const isHovered = hoveredPlaceId === place.id;

                const matchCat =
                  selectedCategory === 'All' ||
                  place.category.toLowerCase() === selectedCategory.toLowerCase();
                const opacity = matchCat ? 1 : 0.35;

                return (
                  <g
                    key={place.id}
                    transform={`translate(${place.mapX}, ${place.mapY})`}
                    opacity={opacity}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredPlaceId(place.id)}
                    onMouseLeave={() => setHoveredPlaceId(null)}
                    onClick={() => {
                      setSelectedPlaceForModal(place);
                      setDestPlaceId(place.id);
                      setShowRoute(true);
                    }}
                  >
                    {/* Pulsing destination radar ring */}
                    {isDest && (
                      <circle
                        cx="0"
                        cy="0"
                        r="32"
                        fill="none"
                        stroke="#315CEB"
                        strokeWidth="2"
                        className="animate-ping opacity-70 pointer-events-none"
                      />
                    )}

                    {/* Circular Pin Base */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isDest || isStart || isSelected || isHovered ? '16' : '12'}
                      fill={
                        isStart
                          ? '#16A34A'
                          : isDest
                          ? '#315CEB'
                          : isSelected
                          ? '#F27C66'
                          : '#FFFFFF'
                      }
                      stroke={
                        isStart
                          ? '#14532D'
                          : isDest
                          ? '#1E40AF'
                          : isSelected
                          ? '#C2410C'
                          : '#475467'
                      }
                      strokeWidth={isDest || isStart || isSelected ? '3' : '2'}
                      filter="url(#markerShadow)"
                    />

                    {/* Pin Center Marker Letter / Icon */}
                    <text
                      x="0"
                      y="4"
                      fontSize={isDest || isStart ? '12' : '9'}
                      fontWeight="bold"
                      fill={isDest || isStart || isSelected ? '#FFFFFF' : '#1E293B'}
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {isStart ? 'A' : isDest ? 'B' : place.floor === 'Ground Floor' ? 'G' : place.floor.charAt(0)}
                    </text>

                    {/* High-Contrast Floating Pill Label */}
                    <g transform="translate(0, 24)" className="pointer-events-none">
                      {/* Badge Background */}
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="20"
                        rx="10"
                        fill={isDest ? '#17243A' : isStart ? '#14532D' : '#FFFFFF'}
                        stroke={isDest ? '#315CEB' : isStart ? '#16A34A' : '#CBD5E1'}
                        strokeWidth="1.5"
                        filter="url(#markerShadow)"
                      />
                      {/* Badge Label Text */}
                      <text
                        x="0"
                        y="4"
                        fontSize="9.5"
                        fontWeight="bold"
                        fill={isDest || isStart ? '#FFFFFF' : '#17243A'}
                        textAnchor="middle"
                      >
                        {(() => {
                          const mapShortNames: Record<string, string> = {
                            'main-entrance': 'Main Gate',
                            'lh-203': 'Hall 203',
                            'cr-304': 'Room 304',
                            'faculty-wing': 'Faculty Wing',
                            'lab-2': 'Comp Lab 2',
                            'makerspace': 'Makerspace',
                            'seminar-hall': 'Seminar B-1',
                            'central-library': 'Library Desk',
                            'cafeteria': 'Food Court',
                            'services-desk': 'Services Desk',
                            'placement-cell': 'Career Cell',
                            'medical-room': 'Health Clinic',
                            'auditorium': 'Auditorium',
                            'sports-complex': 'Sports Gym',
                          };
                          return mapShortNames[place.id] || place.name.slice(0, 12);
                        })()}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-[#E3E5E8] text-xs text-[#667085]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#16A34A] text-white text-[9px] font-bold flex items-center justify-center">
                  A
                </span>
                <span className="font-semibold text-[#17243A]">Start Location</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#315CEB] text-white text-[9px] font-bold flex items-center justify-center">
                  B
                </span>
                <span className="font-semibold text-[#17243A]">Destination</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#315CEB] animate-pulse" />
                <span>Paved Walking Route</span>
              </div>
            </div>
            <span className="text-[11px] text-[#A0AEC0]">
              *Schematic layout with level ground walkway network
            </span>
          </div>
        </div>

        {/* Written Turn-by-Turn Directions Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-[#E3E5E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E5E8]">
            <div>
              <h3 className="font-display font-bold text-base text-[#17243A]">
                Route & Directions
              </h3>
              <p className="text-xs text-[#667085]">
                {startPlace?.name.split(' ')[0]} → {destPlace?.name.split(' ')[0]}
              </p>
            </div>
            {routeDetails && (
              <Badge variant="mint" size="sm">
                Active Route
              </Badge>
            )}
          </div>

          {routeDetails ? (
            <div className="space-y-4">
              {/* Distance & Time summary */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF9F5] border border-[#E3E5E8]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#315CEB]" />
                  <div>
                    <span className="text-[10px] text-[#667085] block font-semibold">
                      WALKING TIME
                    </span>
                    <span className="text-sm font-bold text-[#17243A]">
                      ~{routeDetails.walkingMinutes} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#20845A]" />
                  <div>
                    <span className="text-[10px] text-[#667085] block font-semibold">
                      DISTANCE
                    </span>
                    <span className="text-sm font-bold text-[#17243A]">
                      {routeDetails.distanceMeters} meters
                    </span>
                  </div>
                </div>
              </div>

              {/* Step list */}
              <div className="space-y-3 pt-1">
                <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block">
                  Turn-by-Turn Guidance
                </span>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#E3E5E8] before:content-['']">
                  {routeDetails.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-5 h-5 rounded-full bg-[#315CEB] text-white text-[10px] font-bold flex items-center justify-center shrink-0 z-10 shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-[#17243A] leading-snug">
                          {step.instruction}
                        </p>
                        {step.landmark && (
                          <p className="text-[11px] text-[#667085]">
                            Landmark: <span className="font-medium text-[#475467]">{step.landmark}</span>
                          </p>
                        )}
                        {step.accessibleNote && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#166534] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0] mt-1">
                            <Accessibility className="w-3 h-3" />
                            <span>{step.accessibleNote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination details pill */}
              {destPlace && (
                <div className="p-3.5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-1 text-xs">
                  <div className="font-bold text-[#2447C5] flex items-center justify-between">
                    <span>{destPlace.name}</span>
                    <Badge variant="cobalt" size="sm">
                      {destPlace.floor}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#475467] leading-relaxed">
                    {destPlace.description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <Compass className="w-8 h-8 text-[#9CA3AF] mx-auto" />
              <p className="text-sm font-semibold text-[#17243A]">No route plotted</p>
              <p className="text-xs text-[#667085]">
                Select different start and destination locations above and press &ldquo;Show Route&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Directory of Campus Places */}
      <div className="bg-white rounded-3xl p-6 border border-[#E3E5E8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E5E8]">
          <div>
            <h3 className="font-display font-bold text-lg text-[#17243A]">
              Campus Places Directory ({filteredPlaces.length})
            </h3>
            <p className="text-xs text-[#667085]">
              Browse facilities or search by room code or building name.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="w-full bg-[#FAF9F5] border border-[#E3E5E8] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#17243A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#315CEB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPlaces.map((place) => {
            const isSaved = profile.savedPlaceIds.includes(place.id);
            const isDestination = place.id === destPlaceId;

            return (
              <div
                key={place.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDestination
                    ? 'border-[#315CEB] bg-[#EEF2FF]/40 shadow-xs'
                    : 'border-[#E3E5E8] bg-[#FAF9F5] hover:border-[#315CEB]/50 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="cobalt" size="sm">
                    {place.category}
                  </Badge>
                  <button
                    onClick={() => toggleSavePlace(place.id)}
                    className="text-[#9CA3AF] hover:text-[#315CEB] p-1"
                    title={isSaved ? 'Remove from saved' : 'Save place'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-[#315CEB]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h4 className="font-display font-bold text-sm text-[#17243A] leading-snug">
                  {place.name}
                </h4>
                <p className="text-xs text-[#667085] mt-1">
                  {place.building} · {place.floor}
                </p>
                <p className="text-[11px] text-[#475467] mt-2 line-clamp-2 leading-relaxed">
                  {place.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#E3E5E8] mt-3">
                  <span className="text-[10px] text-[#20845A] font-semibold flex items-center gap-1">
                    <Accessibility className="w-3 h-3" />
                    <span>Wheelchair Accessible</span>
                  </span>

                  <button
                    onClick={() => {
                      setDestPlaceId(place.id);
                      setShowRoute(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#315CEB] hover:text-[#2447C5] flex items-center gap-1"
                  >
                    <span>Route Here</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
