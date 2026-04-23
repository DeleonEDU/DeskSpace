import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import type { SelectedSlot } from '../../types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface BookingPanelProps {
  selectedSlot: SelectedSlot | null;
  onConfirm: () => void;
  onClear: () => void;
  isLoading?: boolean;
  floorName: string;
}

export const BookingPanel: React.FC<BookingPanelProps> = ({
  selectedSlot,
  onConfirm,
  onClear,
  isLoading,
  floorName,
}) => {
  const totalHours = selectedSlot
    ? calcHours(selectedSlot.startTime, selectedSlot.endTime)
    : 0;
  const totalPrice = selectedSlot
    ? selectedSlot.space.price_per_hour * totalHours
    : 0;

  const formattedDate = selectedSlot?.date
    ? format(new Date(selectedSlot.date), 'dd MMMM', { locale: uk })
    : '';

  return (
    <div className="booking-panel">
      <div className="booking-panel__header">
        <h3>Ваше бронювання</h3>
      </div>

      <AnimatePresence mode="wait">
        {selectedSlot ? (
          <motion.div
            key="has-slot"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="booking-panel__content"
          >
            {/* Selected Space */}
            <div className="booking-summary-card">
              <div className="summary-space-name">{selectedSlot.space.name}</div>
              <div className="summary-space-type">{selectedSlot.space.space_type_display}</div>

              <div className="summary-detail">
                <MapPin size={14} />
                <span>{floorName}</span>
              </div>
              <div className="summary-detail">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              <div className="summary-detail">
                <Clock size={14} />
                <span>{selectedSlot.startTime} — {selectedSlot.endTime}</span>
              </div>
            </div>

            {/* Price */}
            <div className="booking-price">
              <span className="price-amount">{totalPrice.toLocaleString('uk-UA')}</span>
              <span className="price-currency"> ₴</span>
              <span className="price-breakdown">
                ({selectedSlot.space.price_per_hour} ₴/год × {totalHours}год)
              </span>
            </div>

            {/* Actions */}
            <motion.button
              className="btn btn--primary btn--full"
              onClick={onConfirm}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Забронювати зараз
                </>
              )}
            </motion.button>

            <motion.button
              className="btn btn--ghost btn--full"
              onClick={onClear}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw size={15} />
              Скинути вибір
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="no-slot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="booking-panel__empty"
          >
            <div className="empty-illustration">
              <svg viewBox="0 0 80 80" width="64" height="64">
                <circle cx="40" cy="40" r="36" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.2)" strokeWidth="1.5" />
                <rect x="22" y="32" width="36" height="26" rx="4" fill="rgba(129,140,248,0.2)" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" />
                <rect x="30" y="24" width="20" height="10" rx="2" fill="rgba(129,140,248,0.2)" stroke="rgba(129,140,248,0.4)" strokeWidth="1.5" />
                <circle cx="40" cy="45" r="4" fill="rgba(129,140,248,0.5)" />
              </svg>
            </div>
            <p className="empty-text">Оберіть місце на карті поверху щоб почати бронювання</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function calcHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0.5, ((eh * 60 + em) - (sh * 60 + sm)) / 60);
}
