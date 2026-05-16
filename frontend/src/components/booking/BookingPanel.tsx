import { memo } from "react";
import { Calendar, Clock, MapPin, X, CheckCircle2, Users } from "lucide-react";
import type { Space } from "@/hooks/use-booking";
import { labelCaps } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

interface Props {
  room: Space | null;
  floor: number;
  date: string;
  time: string;
  hours?: number;
  isBooking?: boolean;
  onClear: () => void;
  onBook: () => void;
}

function BookingPanelComponent({
  room,
  floor,
  date,
  time,
  hours = 2,
  isBooking = false,
  onClear,
  onBook,
}: Props) {
  return (
    <aside className="surface-lg flex w-full flex-col gap-5 p-5 lg:sticky lg:top-8 lg:w-[300px] lg:self-start">
      <div className="flex items-center justify-between gap-2">
        <h2 className={labelCaps}>Ваше бронювання</h2>
        {room && (
          <CheckCircle2 className="size-5 shrink-0 text-primary" aria-hidden />
        )}
      </div>

      <div className="rounded-xl border border-border/50 bg-secondary/40 p-5 text-center">
        <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {room ? room.name : "Оберіть місце"}
        </p>
        {room?.capacity ? (
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Users className="size-3.5" aria-hidden />
            {room.capacity} місць
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">На плані поверху зліва</p>
        )}
      </div>

      <ul className="space-y-2.5 text-sm">
        {[
          { icon: MapPin, text: `${floor}-й поверх` },
          { icon: Calendar, text: date },
          { icon: Clock, text: time },
        ].map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 px-3 py-2.5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="font-medium">{text}</span>
          </li>
        ))}
      </ul>

      {hours > 0 && room && (
        <p className="text-center text-xs font-medium text-muted-foreground">
          Тривалість: <span className="text-foreground">{hours} год</span>
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-2">
        <button
          type="button"
          disabled={!room || isBooking}
          onClick={onBook}
          className={cn("btn-primary w-full py-3.5 text-sm")}
        >
          {isBooking ? "Бронюємо…" : "Забронювати"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
          Скинути
        </button>
      </div>
    </aside>
  );
}

export const BookingPanel = memo(BookingPanelComponent);
