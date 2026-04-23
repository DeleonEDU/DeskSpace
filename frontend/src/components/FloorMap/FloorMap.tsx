import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Floor, Space } from '../../types';
import { SpaceTooltip } from './SpaceTooltip';
import { generateFloorLayout } from './floorLayouts';

interface FloorMapProps {
  floor: Floor;
  activeSpaceTypes: string[];
  onSpaceSelect: (space: Space) => void;
  selectedSpaceId?: number;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  floor,
  activeSpaceTypes,
  onSpaceSelect,
  selectedSpaceId,
}) => {
  const [hoveredSpace, setHoveredSpace] = useState<{ space: Space; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseEnter = useCallback(
    (space: Space, e: React.MouseEvent<SVGElement>) => {
      const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      setHoveredSpace({
        space,
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => setHoveredSpace(null), []);

  const visibleSpaces = floor.spaces.filter((s) =>
    activeSpaceTypes.includes(s.space_type)
  );

  const layout = generateFloorLayout(floor, visibleSpaces);

  return (
    <div className="floor-map-wrapper">
      <svg
        ref={svgRef}
        viewBox="0 0 900 560"
        className="floor-map-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow-sm">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
          <filter id="shadow-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#4ade80" floodOpacity="0.5" />
          </filter>
          <filter id="shadow-selected">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#818cf8" floodOpacity="0.8" />
          </filter>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Floor background */}
        <rect width="900" height="560" rx="16" fill="url(#bg-grad)" />
        <rect width="900" height="560" rx="16" fill="url(#grid)" />

        {/* Floor outline */}
        <rect x="20" y="20" width="860" height="520" rx="12"
          fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1.5" strokeDasharray="8 4" />

        {/* Render layout zones and spaces */}
        {layout.zones.map((zone) => (
          <g key={zone.id}>
            <rect
              x={zone.x} y={zone.y} width={zone.width} height={zone.height}
              rx="10"
              fill={zone.fill}
              stroke={zone.stroke}
              strokeWidth="1"
              opacity="0.5"
            />
            {zone.label && (
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + 18}
                textAnchor="middle"
                fill="rgba(148,163,184,0.6)"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                letterSpacing="1.5"
                style={{ textTransform: 'uppercase' }}
              >
                {zone.label.toUpperCase()}
              </text>
            )}
          </g>
        ))}

        {/* Render spaces */}
        {layout.spaces.map(({ space, x, y, width, height }) => {
          const isSelected = selectedSpaceId === space.id;
          const isHovered = hoveredSpace?.space.id === space.id;
          const isVisible = activeSpaceTypes.includes(space.space_type);

          if (!isVisible) return null;

          return (
            <motion.g
              key={space.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: Math.random() * 0.2 }}
              style={{ cursor: space.status === 'closed' ? 'not-allowed' : 'pointer' }}
              onClick={() => space.status !== 'closed' && space.status !== 'booked' && onSpaceSelect(space)}
              onMouseEnter={(e) => handleMouseEnter(space, e as unknown as React.MouseEvent<SVGElement>)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Space rectangle */}
              <rect
                x={x} y={y}
                width={width} height={height}
                rx={space.space_type === 'desk' ? 6 : 10}
                fill={getSpaceFill(space, isSelected, isHovered)}
                stroke={getSpaceStroke(space, isSelected)}
                strokeWidth={isSelected ? 2 : 1.5}
                filter={isSelected ? 'url(#shadow-selected)' : isHovered ? 'url(#shadow-glow)' : 'url(#shadow-sm)'}
                className="space-rect"
              />

              {/* Desk icon or room label */}
              {space.space_type === 'desk' ? (
                <DeskIcon x={x} y={y} width={width} height={height} space={space} isSelected={isSelected} />
              ) : (
                <RoomLabel x={x} y={y} width={width} height={height} space={space} isSelected={isSelected} />
              )}

              {/* Status dot */}
              <circle
                cx={x + width - 8} cy={y + 8} r="4"
                fill={getStatusColor(space.status)}
              />
            </motion.g>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredSpace && (
            <foreignObject
              x={Math.min(hoveredSpace.x - 120, 660)}
              y={Math.max(hoveredSpace.y - 160, 10)}
              width="240"
              height="155"
              style={{ overflow: 'visible', pointerEvents: 'none' }}
            >
              <SpaceTooltip space={hoveredSpace.space} />
            </foreignObject>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
interface SpaceIconProps {
  x: number; y: number; width: number; height: number;
  space: Space; isSelected: boolean;
}

const DeskIcon: React.FC<SpaceIconProps> = ({ x, y, width, height, space, isSelected }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const color = isSelected ? '#fff' : space.status === 'available' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)';

  return (
    <g>
      {/* Desk surface */}
      <rect x={cx - 10} y={cy - 7} width="20" height="13" rx="2" fill={color} opacity="0.7" />
      {/* Monitor */}
      <rect x={cx - 5} y={cy - 13} width="10" height="7" rx="1" fill={color} opacity="0.9" />
      <line x1={cx} y1={cy - 6} x2={cx} y2={cy - 5} stroke={color} strokeWidth="1" />
      {/* ID badge */}
      <text x={cx} y={y + height - 6} textAnchor="middle" fill={color} fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">
        #{space.id % 100 === 0 ? space.id : space.id % 100}
      </text>
    </g>
  );
};

const RoomLabel: React.FC<SpaceIconProps> = ({ x, y, width, height, space, isSelected }) => {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const color = isSelected ? '#fff' : 'rgba(255,255,255,0.9)';

  // Truncate long names
  const shortName = space.name.replace(/Переговорна\s*/i, '').replace(/Приватний офіс\s*/i, '');
  const lines = shortName.length > 12 ? [shortName.slice(0, 12), shortName.slice(12)] : [shortName];

  return (
    <g>
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={cy - 8 + i * 14}
          textAnchor="middle"
          fill={color}
          fontSize="11"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
        >
          {line}
        </text>
      ))}
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color} fontSize="10" fontFamily="Inter, sans-serif" opacity="0.7">
        ({space.capacity} місць)
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill={color} fontSize="9" fontFamily="Inter, sans-serif" opacity="0.6">
        {space.price_per_hour} ₴/год
      </text>
    </g>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSpaceFill(space: Space, isSelected: boolean, isHovered: boolean): string {
  if (isSelected) return 'rgba(129, 140, 248, 0.7)';
  if (!space.is_active || space.status === 'closed') return 'rgba(100,116,139,0.35)';
  if (space.status === 'booked') return 'rgba(239,68,68,0.25)';
  if (isHovered) {
    if (space.space_type === 'desk') return 'rgba(74,222,128,0.5)';
    if (space.space_type === 'meeting_room') return 'rgba(56,189,248,0.5)';
    return 'rgba(251,191,36,0.5)';
  }
  if (space.space_type === 'desk') return 'rgba(74,222,128,0.2)';
  if (space.space_type === 'meeting_room') return 'rgba(56,189,248,0.2)';
  return 'rgba(251,191,36,0.2)';
}

function getSpaceStroke(space: Space, isSelected: boolean): string {
  if (isSelected) return '#818cf8';
  if (!space.is_active || space.status === 'closed') return 'rgba(100,116,139,0.4)';
  if (space.status === 'booked') return 'rgba(239,68,68,0.5)';
  if (space.space_type === 'desk') return 'rgba(74,222,128,0.6)';
  if (space.space_type === 'meeting_room') return 'rgba(56,189,248,0.6)';
  return 'rgba(251,191,36,0.6)';
}

function getStatusColor(status?: string): string {
  if (status === 'available') return '#4ade80';
  if (status === 'booked') return '#ef4444';
  return '#64748b';
}
