import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';


// Mock bookings for demo
const MOCK_BOOKINGS = [
  {
    id: 1, space: 411, space_name: 'Переговорна КАРПАТИ', floor_level: 4,
    location_name: 'DeskSpace HQ', user: 1, date: '2026-04-25',
    start_time: '10:00', end_time: '12:00', total_price: 1000, status: 'confirmed' as const,
    created_at: '2026-04-23T09:00:00Z',
  },
  {
    id: 2, space: 405, space_name: 'Стіл #45', floor_level: 4,
    location_name: 'DeskSpace HQ', user: 1, date: '2026-04-24',
    start_time: '09:00', end_time: '18:00', total_price: 900, status: 'confirmed' as const,
    created_at: '2026-04-22T14:00:00Z',
  },
  {
    id: 3, space: 211, space_name: 'Переговорна СИНІЙ КИТ', floor_level: 2,
    location_name: 'DeskSpace HQ', user: 1, date: '2026-04-20',
    start_time: '14:00', end_time: '16:00', total_price: 1200, status: 'cancelled' as const,
    created_at: '2026-04-19T10:00:00Z',
  },
];

const statusConfig = {
  confirmed: { label: 'Підтверджено', color: '#4ade80', icon: CheckCircle },
  pending: { label: 'Очікує', color: '#fbbf24', icon: AlertCircle },
  cancelled: { label: 'Скасовано', color: '#ef4444', icon: X },
};

export const MyBookingsPage: React.FC = () => {
  const bookings = MOCK_BOOKINGS;
  const upcoming = bookings.filter((b) => b.date >= new Date().toISOString().split('T')[0] && b.status !== 'cancelled');
  const past = bookings.filter((b) => b.date < new Date().toISOString().split('T')[0] || b.status === 'cancelled');

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Мої бронювання</h1>
          <p className="page-subtitle">Управління вашими заброньованими просторами</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bookings-stats">
        <div className="stat-card">
          <span className="stat-card__value">{upcoming.length}</span>
          <span className="stat-card__label">Активних</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">
            {bookings.filter((b) => b.status === 'confirmed').reduce((sum, b) => sum + b.total_price, 0).toLocaleString('uk-UA')} ₴
          </span>
          <span className="stat-card__label">Витрачено цього місяця</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{bookings.length}</span>
          <span className="stat-card__label">Всього бронювань</span>
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="bookings-section">
          <h2 className="section-title">Майбутні</h2>
          <div className="bookings-grid">
            {upcoming.map((booking, i) => (
              <BookingCard key={booking.id} booking={booking} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className="bookings-section">
          <h2 className="section-title section-title--muted">Минулі та скасовані</h2>
          <div className="bookings-grid">
            {past.map((booking, i) => (
              <BookingCard key={booking.id} booking={booking} index={i} isPast />
            ))}
          </div>
        </section>
      )}

      {bookings.length === 0 && (
        <div className="empty-state">
          <p>У вас ще немає бронювань</p>
          <a href="/" className="btn btn--primary">Забронювати місце</a>
        </div>
      )}
    </div>
  );
};

function BookingCard({ booking, index, isPast = false }: {
  booking: typeof MOCK_BOOKINGS[0]; index: number; isPast?: boolean;
}) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;
  const formattedDate = format(new Date(booking.date), 'dd MMMM yyyy', { locale: uk });

  return (
    <motion.div
      className={`booking-card ${isPast ? 'booking-card--past' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="booking-card__header">
        <div>
          <h3 className="booking-card__name">{booking.space_name}</h3>
          <div className="booking-card__meta">
            <MapPin size={12} />
            <span>{booking.location_name} · {booking.floor_level}-й поверх</span>
          </div>
        </div>
        <div className="booking-card__status" style={{ color: status.color }}>
          <StatusIcon size={14} />
          {status.label}
        </div>
      </div>

      <div className="booking-card__details">
        <div className="booking-detail">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="booking-detail">
          <Clock size={14} />
          <span>{booking.start_time} — {booking.end_time}</span>
        </div>
      </div>

      <div className="booking-card__footer">
        <span className="booking-card__price">{booking.total_price.toLocaleString('uk-UA')} ₴</span>
        {!isPast && booking.status === 'confirmed' && (
          <button className="btn btn--ghost btn--sm" id={`cancel-booking-${booking.id}`}>
            Скасувати
          </button>
        )}
      </div>
    </motion.div>
  );
}
