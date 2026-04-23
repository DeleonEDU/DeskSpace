import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Monitor, Users } from 'lucide-react';


interface FilterBarProps {
  date: string;
  startTime: string;
  endTime: string;
  activeSpaceTypes: string[];
  onDateChange: (d: string) => void;
  onStartTimeChange: (t: string) => void;
  onEndTimeChange: (t: string) => void;
  onSpaceTypeToggle: (type: string) => void;
}

const SPACE_TYPE_OPTIONS = [
  { value: 'desk', label: 'Стіл', icon: Monitor },
  { value: 'meeting_room', label: 'Переговорна', icon: Users },
  { value: 'private_office', label: 'Офіс', icon: Users },
];

const TIME_OPTIONS = Array.from({ length: 27 }, (_, i) => {
  const totalMins = 8 * 60 + i * 30;
  const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const m = (totalMins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
});

export const FilterBar: React.FC<FilterBarProps> = ({
  date,
  startTime,
  endTime,
  activeSpaceTypes,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onSpaceTypeToggle,
}) => {
  return (
    <div className="filter-bar">
      {/* Date picker */}
      <div className="filter-group">
        <label className="filter-label">
          <Calendar size={13} />
          Дата
        </label>
        <input
          type="date"
          className="filter-input"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => onDateChange(e.target.value)}
          id="filter-date"
        />
      </div>

      {/* Time range */}
      <div className="filter-group">
        <label className="filter-label">
          <Clock size={13} />
          Час
        </label>
        <div className="time-range">
          <select
            className="filter-select"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            id="filter-start-time"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="time-dash">—</span>
          <select
            className="filter-select"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            id="filter-end-time"
          >
            {TIME_OPTIONS.filter((t) => t > startTime).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Space type filter */}
      <div className="filter-group">
        <label className="filter-label">Тип</label>
        <div className="type-toggles">
          {SPACE_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <motion.button
              key={value}
              id={`type-toggle-${value}`}
              className={`type-toggle ${activeSpaceTypes.includes(value) ? 'type-toggle--active' : ''}`}
              onClick={() => onSpaceTypeToggle(value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={13} />
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
