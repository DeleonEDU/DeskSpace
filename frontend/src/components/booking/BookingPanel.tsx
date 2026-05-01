import { Calendar, Clock, MapPin, Tv, X } from "lucide-react";
import type { Space } from "@/hooks/use-booking";

interface Props {
  room: Space | null;
  floor: number;
  date: string;
  time: string;
  hours?: number;
  onClear: () => void;
  onBook: () => void;
}

export function BookingPanel({ room, floor, date, time, hours = 2, onClear, onBook }: Props) {
  return (
    <aside className="flex w-full flex-col gap-4 rounded-3xl bg-card p-6 ring-1 ring-border/60 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:w-[280px]">
      <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Ваше бронювання
      </h3>

      <div className="rounded-2xl bg-secondary px-4 py-4 text-center">
        <p className="font-display text-xl font-semibold tracking-tight text-foreground">
          {room ? room.name : "Оберіть місце"}
        </p>
        {room?.capacity && (
          <p className="mt-1 text-xs text-muted-foreground">{room.capacity} місць</p>
        )}
      </div>

      <ul className="space-y-3 text-sm text-foreground">
        <li className="flex items-center gap-3">
          <MapPin className="size-4 text-primary" />
          <span>{floor}-й поверх</span>
        </li>
        <li className="flex items-center gap-3">
          <Calendar className="size-4 text-primary" />
          <span>{date}</span>
        </li>
        <li className="flex items-center gap-3">
          <Clock className="size-4 text-primary" />
          <span>{time}</span>
        </li>
      </ul>

      <div className="mt-auto pt-4"></div>
      <button
        disabled={!room}
        onClick={onBook}
        className="rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-40"
      >
        Забронювати
      </button>
      <button
        onClick={onClear}
        className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <X className="size-4" /> Скинути
      </button>
    </aside>
  );
}
