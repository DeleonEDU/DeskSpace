import { useState, useMemo, useCallback } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/PageShell";
import { BuildingSelector } from "@/components/booking/BuildingSelector";
import { FloorPlan } from "@/components/booking/FloorPlan";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { labelCaps } from "@/lib/ui-classes";
import { useSpaces, useBookings, useCreateBooking, type Space } from "@/hooks/use-booking";
import { useAuth } from "@/context/AuthContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DeskSpace — Бронювання" },
      {
        name: "description",
        content: "Оберіть поверх, місце та час — забронюйте коворкінг за кілька кліків.",
      },
    ],
  }),
});

const formatHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:00`;

function Index() {
  const { user, isLoading } = useAuth();
  const createBooking = useCreateBooking();
  const [floor, setFloor] = useState(4);
  const [selected, setSelected] = useState<Space | null>(null);
  const [hovered, setHovered] = useState<Space | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<[number, number]>([10, 12]);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: spaces = [] } = useSpaces();
  const { data: bookings = [], refetch: refetchBookings } = useBookings(
    date,
    timeRange[0],
    timeRange[1],
  );

  const floorSpaces = useMemo(
    () => spaces.filter((s) => s.floor_level === floor),
    [spaces, floor],
  );
  const occupiedSpaceIds = useMemo(() => new Set(bookings.map((b) => b.space_id)), [bookings]);

  const dateLabel = format(date, "d MMMM", { locale: uk });
  const timeLabel = `${formatHour(timeRange[0])} – ${formatHour(timeRange[1])}`;

  const handleSelect = useCallback((s: Space) => setSelected(s), []);
  const handleHover = useCallback((s: Space | null) => setHovered(s), []);
  const handleClear = useCallback(() => setSelected(null), []);

  const handleBook = async () => {
    if (!selected) return;

    const startDateTime = new Date(date);
    startDateTime.setHours(timeRange[0], 0, 0, 0);
    const endDateTime = new Date(date);
    endDateTime.setHours(timeRange[1], 0, 0, 0);

    if (startDateTime < new Date()) {
      toast.error("Неможливо забронювати на минулий час");
      return;
    }

    try {
      await createBooking.mutateAsync({
        space_id: selected.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      });
      setShowSuccess(true);
      refetchBookings();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Спробуйте ще раз";
      toast.error(`Помилка бронювання: ${message}`);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;

  return (
    <PageShell maxWidth="booking">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Open Space</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Забронюйте місце
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Інтерактивна мапа поверху — оберіть кімнату або стіл і зручний час.
          </p>
        </div>
      </header>

      <section className="surface-lg p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[240px_1fr_300px]">
          {/* Controls */}
          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className={labelCaps}>Поверх</h2>
              <BuildingSelector current={floor} onChange={setFloor} />
            </div>

            <div className="surface flex flex-col gap-4 p-4">
              <div>
                <label className={cn(labelCaps, "mb-2 block")} htmlFor="date-trigger">
                  Дата
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="date-trigger"
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:border-primary/40"
                    >
                      <CalendarIcon className="size-4 shrink-0 text-primary" />
                      {dateLabel}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="surface w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      disabled={(d) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return d < today;
                      }}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <div className={cn(labelCaps, "mb-2 flex items-center justify-between")}>
                  <span>Час</span>
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {timeRange[1] - timeRange[0]} год
                  </span>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="mb-3 flex justify-between text-xs font-bold text-primary">
                    <span>{formatHour(timeRange[0])}</span>
                    <span>{formatHour(timeRange[1])}</span>
                  </div>
                  <Slider
                    min={8}
                    max={22}
                    step={1}
                    value={timeRange}
                    onValueChange={(v) => {
                      if (v.length === 2 && v[1] > v[0]) setTimeRange([v[0], v[1]]);
                    }}
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                    <span>08:00</span>
                    <span>22:00</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Map */}
          <div className="min-w-0">
            <FloorPlan
              floor={floor}
              spaces={floorSpaces}
              occupiedSpaceIds={occupiedSpaceIds}
              selectedId={selected?.id ?? null}
              hoveredId={hovered?.id ?? null}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          </div>

          <BookingPanel
            room={selected}
            floor={floor}
            date={dateLabel}
            time={timeLabel}
            hours={timeRange[1] - timeRange[0]}
            isBooking={createBooking.isPending}
            onClear={handleClear}
            onBook={handleBook}
          />
        </div>
      </section>

      <Dialog
        open={showSuccess}
        onOpenChange={(open) => {
          setShowSuccess(open);
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="surface-lg max-w-md border-0 p-8">
          <DialogHeader className="items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <CheckCircle2 className="size-7" />
            </div>
            <DialogTitle className="font-display text-2xl">Бронювання підтверджено</DialogTitle>
            <DialogDescription className="pt-2 text-center">
              <strong className="text-foreground">{selected?.name}</strong> · {floor}-й поверх
              <br />
              <span className="mt-3 inline-block rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground">
                {dateLabel}, {timeLabel}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              className="btn-primary w-full rounded-xl sm:w-auto sm:min-w-[160px]"
              onClick={() => {
                setShowSuccess(false);
                setSelected(null);
              }}
            >
              Чудово
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
