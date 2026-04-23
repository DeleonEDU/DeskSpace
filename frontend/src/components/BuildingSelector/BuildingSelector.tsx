import React from 'react';
import { motion } from 'framer-motion';
import type { Floor } from '../../types';

interface BuildingSelectorProps {
  floors: Floor[];
  selectedFloorId: number | null;
  onFloorSelect: (floor: Floor) => void;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({
  floors,
  selectedFloorId,
  onFloorSelect,
}) => {
  // Floors sorted descending (top floor at top visually)
  const sorted = [...floors].sort((a, b) => b.level - a.level);

  return (
    <div className="building-selector">
      <div className="building-visual">
        {/* Roof */}
        <div className="building-roof">
          <div className="roof-triangle" />
        </div>

        {/* Floor buttons */}
        {sorted.map((floor) => {
          const isSelected = floor.id === selectedFloorId;
          const availableCount = floor.spaces.filter((s) => s.status === 'available').length;
          const totalCount = floor.spaces.length;

          return (
            <motion.button
              key={floor.id}
              className={`floor-btn ${isSelected ? 'floor-btn--active' : ''}`}
              onClick={() => onFloorSelect(floor)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              title={`${floor.name} — ${availableCount}/${totalCount} вільно`}
            >
              <span className="floor-number">{floor.level}</span>
              <span className="floor-windows">
                {/* Mini windows indicating availability */}
                {Array.from({ length: Math.min(4, totalCount) }).map((_, wi) => (
                  <span
                    key={wi}
                    className="floor-window"
                    style={{
                      background: wi < Math.round((availableCount / totalCount) * 4)
                        ? 'rgba(74,222,128,0.8)'
                        : 'rgba(100,116,139,0.4)',
                    }}
                  />
                ))}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="floor-indicator"
                  className="floor-active-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Ground / trees */}
        <div className="building-ground">
          <div className="ground-tree" />
          <div className="ground-tree ground-tree--sm" />
        </div>
      </div>

      {selectedFloorId && (
        <div className="floor-stats">
          {(() => {
            const f = floors.find((fl) => fl.id === selectedFloorId)!;
            const avail = f.spaces.filter((s) => s.status === 'available').length;
            const booked = f.spaces.filter((s) => s.status === 'booked').length;
            return (
              <>
                <span className="stat-pill stat-pill--green">{avail} вільних</span>
                <span className="stat-pill stat-pill--red">{booked} зайнятих</span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
