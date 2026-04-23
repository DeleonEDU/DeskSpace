import React from 'react';
import { motion } from 'framer-motion';
import type { Space } from '../../types';
import { Wifi, Tv, Camera, Video, Monitor } from 'lucide-react';

interface SpaceTooltipProps {
  space: Space;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  wifi: <Wifi size={11} />,
  tv: <Tv size={11} />,
  camera: <Camera size={11} />,
  video: <Video size={11} />,
  monitor: <Monitor size={11} />,
};

export const SpaceTooltip: React.FC<SpaceTooltipProps> = ({ space }) => {
  const statusLabel = space.status === 'available' ? 'Вільна' : space.status === 'booked' ? 'Зайнята' : 'Закрита';
  const statusColor = space.status === 'available' ? '#4ade80' : space.status === 'booked' ? '#ef4444' : '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="space-tooltip"
    >
      <div className="tooltip-header">
        <span className="tooltip-name">{space.name}</span>
        <span className="tooltip-type">{space.space_type_display}</span>
      </div>
      <div className="tooltip-row">
        <span className="tooltip-label">Статус:</span>
        <span style={{ color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
      </div>
      {space.capacity > 1 && (
        <div className="tooltip-row">
          <span className="tooltip-label">Місць:</span>
          <span>{space.capacity}</span>
        </div>
      )}
      <div className="tooltip-row">
        <span className="tooltip-label">Ціна:</span>
        <span className="tooltip-price">{space.price_per_hour} ₴/год</span>
      </div>
      {space.amenities.length > 0 && (
        <div className="tooltip-amenities">
          {space.amenities.slice(0, 4).map((a) => (
            <span key={a.id} className="amenity-chip">
              {ICON_MAP[a.icon_name] || null}
              {a.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
