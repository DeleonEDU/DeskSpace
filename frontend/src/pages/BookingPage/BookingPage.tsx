import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuildingSelector } from '../../components/BuildingSelector/BuildingSelector';
import { FloorMap } from '../../components/FloorMap/FloorMap';
import { BookingPanel } from '../../components/BookingPanel/BookingPanel';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { useBookingStore } from '../../store';
import { MOCK_LOCATIONS } from '../../mocks/data';
import type { Space, SelectedSlot, Floor } from '../../types';
import { ChevronDown, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const BookingPage: React.FC = () => {
  const {
    selectedLocationId, selectedFloorId,
    selectedDate, selectedStartTime, selectedEndTime,
    activeSpaceTypes, selectedSlot,
    setLocation, setFloor, setDate, setStartTime, setEndTime,
    setSpaceTypes, selectSlot, reset,
  } = useBookingStore();

  const [isBooking, setIsBooking] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  // Use mock data (replace with react-query in production)
  const locations = MOCK_LOCATIONS;
  const activeLocation = locations.find((l) => l.id === selectedLocationId) ?? locations[0];
  const activeFloor = activeLocation.floors.find((f) => f.id === selectedFloorId) ?? activeLocation.floors[3]; // default 4th floor

  // Ensure store is initialized
  React.useEffect(() => {
    if (!selectedLocationId) setLocation(activeLocation.id);
    if (!selectedFloorId) setFloor(activeFloor.id);
  }, []);

  const handleSpaceSelect = useCallback(
    (space: Space) => {
      const slot: SelectedSlot = {
        space,
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      };
      selectSlot(slot);
    },
    [selectedDate, selectedStartTime, selectedEndTime, selectSlot]
  );

  const handleSpaceTypeToggle = useCallback(
    (type: string) => {
      const next = activeSpaceTypes.includes(type)
        ? activeSpaceTypes.filter((t) => t !== type)
        : [...activeSpaceTypes, type];
      if (next.length > 0) setSpaceTypes(next);
    },
    [activeSpaceTypes, setSpaceTypes]
  );

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    setIsBooking(true);
    try {
      // In production: call bookingsApi.createBooking(...)
      await new Promise((res) => setTimeout(res, 1200)); // mock delay
      toast.success(`Заброньовано: ${selectedSlot.space.name} на ${selectedSlot.date}!`);
      reset();
    } catch {
      toast.error('Помилка бронювання. Спробуйте ще раз.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleFloorSelect = (floor: Floor) => {
    setFloor(floor.id);
    reset();
  };

  return (
    <div className="booking-page">
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-title">Оберіть місце</h1>
          <p className="page-subtitle">Інтерактивна карта просторів та переговорних</p>
        </div>

        {/* Location selector */}
        <div className="location-selector">
          <button
            className="location-btn"
            onClick={() => setShowLocationMenu((v) => !v)}
            id="location-dropdown-btn"
          >
            <MapPin size={16} />
            <span>{activeLocation.name}</span>
            <span className="location-address">{activeLocation.address}</span>
            <ChevronDown size={14} className={showLocationMenu ? 'rotated' : ''} />
          </button>

          <AnimatePresence>
            {showLocationMenu && (
              <motion.div
                className="location-dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    className={`location-option ${loc.id === activeLocation.id ? 'location-option--active' : ''}`}
                    onClick={() => { setLocation(loc.id); setShowLocationMenu(false); }}
                    id={`location-option-${loc.id}`}
                  >
                    <strong>{loc.name}</strong>
                    <span>{loc.address}, {loc.city}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main layout: 3 columns ── */}
      <div className="booking-layout">
        {/* Left: Building selector + filters */}
        <aside className="booking-sidebar-left">
          <div className="sidebar-section">
            <span className="sidebar-section__label">Оберіть поверх</span>
            <BuildingSelector
              floors={activeLocation.floors}
              selectedFloorId={activeFloor.id}
              onFloorSelect={handleFloorSelect}
            />
          </div>

          <div className="sidebar-section">
            <FilterBar
              date={selectedDate}
              startTime={selectedStartTime}
              endTime={selectedEndTime}
              activeSpaceTypes={activeSpaceTypes}
              onDateChange={setDate}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onSpaceTypeToggle={handleSpaceTypeToggle}
            />
          </div>
        </aside>

        {/* Center: Floor map */}
        <main className="booking-main">
          {/* Floor title + legend */}
          <div className="floor-header">
            <div className="floor-title">
              <motion.h2
                key={activeFloor.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="floor-name"
              >
                {activeFloor.name.toUpperCase()}
              </motion.h2>
            </div>
            <div className="map-legend">
              <span className="legend-item">
                <span className="legend-dot legend-dot--green" />
                Доступна
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--red" />
                Зайнята
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--gray" />
                Закрита
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-dot--purple" />
                Обрана
              </span>
            </div>
          </div>

          {/* Map */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFloor.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="map-container"
            >
              <FloorMap
                floor={activeFloor}
                activeSpaceTypes={activeSpaceTypes}
                onSpaceSelect={handleSpaceSelect}
                selectedSpaceId={selectedSlot?.space.id}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right: Booking panel */}
        <aside className="booking-sidebar-right">
          <BookingPanel
            selectedSlot={selectedSlot}
            onConfirm={handleConfirmBooking}
            onClear={reset}
            isLoading={isBooking}
            floorName={activeFloor.name}
          />
        </aside>
      </div>
    </div>
  );
};
