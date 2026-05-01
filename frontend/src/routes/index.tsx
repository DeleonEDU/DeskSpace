import { useState, useMemo } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/booking/TopBar";
import { BuildingSelector } from "@/components/booking/BuildingSelector";
import { FloorPlan } from "@/components/booking/FloorPlan";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useSpaces, useBookings, type Space } from "@/hooks/use-booking";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "cospace — Бронювання кімнат" },
      {
        name: "description",
        content:
          "Інтерактивна мапа: оберіть поверх, кімнату та забронюйте зручний час за пару кліків.",
      },
    ],
  }),
});

const formatHour = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:00`;

function Index() {
  const { token, user, isLoading } = useAuth();
  const [floor, setFloor] = useState(4);
  const [selected, setSelected] = useState<Space | null>(null);
  const [hovered, setHovered] = useState<Space | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<[number, number]>([10, 12]);

  const [showSuccess, setShowSuccess] = useState(false);

  const { data: spaces = [] } = useSpaces();
  const { data: bookings = [], refetch: refetchBookings } = useBookings(date, timeRange[0], timeRange[1]);

  const floorSpaces = useMemo(() => spaces.filter(s => s.floor === floor), [spaces, floor]);
  const occupiedSpaceIds = useMemo(() => new Set(bookings.map(b => b.space_id)), [bookings]);

  const tooltip = hovered;
  const dateLabel = format(date, "d MMMM", { locale: uk });
  const timeLabel = `${formatHour(timeRange[0])} – ${formatHour(timeRange[1])}`;

  const handleBook = async () => {
    if (!selected || !token) return;

    const startDateTime = new Date(date);
    startDateTime.setHours(timeRange[0], 0, 0, 0);
    
    const endDateTime = new Date(date);
    endDateTime.setHours(timeRange[1], 0, 0, 0);

    try {
      let currentToken = token;
      let response = await fetch("/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          space_id: selected.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        }),
      });

      // If token expired, try refreshing it
      if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshRes = await fetch("/api/auth/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            currentToken = data.access;
            // Retry booking with new token
            response = await fetch("/api/bookings/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentToken}`
              },
              body: JSON.stringify({
                space_id: selected.id,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
              }),
            });
          }
        }
      }

      if (response.ok) {
        setShowSuccess(true);
        refetchBookings();
      } else {
        const errorData = await response.json();
        toast.error(`Помилка бронювання: ${errorData.detail || "Спробуйте ще раз"}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Сталася помилка при бронюванні.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="size-8 text-primary absolute">
              <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="animate-pulse font-display text-sm font-medium text-muted-foreground tracking-widest uppercase">
            Завантаження
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="min-h-screen px-4 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-5">
        <TopBar />

        <h1 className="sr-only">Бронювання кімнат cospace</h1>

        <section className="rounded-3xl bg-card p-5 ring-1 ring-border/60 shadow-[var(--shadow-card)] backdrop-blur-xl lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px]">
            {/* LEFT — controls */}
            <div className="flex flex-col gap-7">
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Поверх
                </h3>
                <BuildingSelector current={floor} onChange={setFloor} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Дата
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "flex w-full items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-left text-sm font-medium transition hover:bg-accent",
                        )}
                      >
                        <CalendarIcon className="size-4 text-primary" />
                        <span>{dateLabel}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Час
                  </label>
                  <div className="rounded-2xl bg-secondary px-4 py-3">
                    <div className="mb-3 flex justify-between text-xs font-medium">
                      <span>{formatHour(timeRange[0])}</span>
                      <span className="text-muted-foreground">{formatHour(timeRange[1])}</span>
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
            </div>

            {/* CENTER — floor plan */}
            <div className="relative">
              <FloorPlan
                floor={floor}
                spaces={floorSpaces}
                occupiedSpaceIds={occupiedSpaceIds}
                selectedId={selected?.id ?? null}
                hoveredId={hovered?.id ?? null}
                onSelect={(s) => setSelected(s)}
                onHover={setHovered}
              />

              {tooltip && tooltip.id !== selected?.id && (
                <div className="pointer-events-none absolute right-4 top-4 w-[220px] rounded-2xl bg-popover p-4 text-popover-foreground shadow-[var(--shadow-card)] ring-1 ring-border backdrop-blur-xl">
                  <p className="font-display text-sm font-semibold tracking-tight">
                    {tooltip.name}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Статус</span>
                      <span className="font-medium">
                        {occupiedSpaceIds.has(tooltip.id) ? "Зайнята" : "Доступна"}
                      </span>
                    </li>
                    {tooltip.capacity && (
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Місткість</span>
                        <span className="font-medium">{tooltip.capacity}</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — booking */}
            <BookingPanel
              room={selected as any}
              floor={floor}
              date={dateLabel}
              time={timeLabel}
              hours={timeRange[1] - timeRange[0]}
              onClear={() => setSelected(null)}
              onBook={handleBook}
            />
          </div>
        </section>

        <Dialog open={showSuccess} onOpenChange={(open) => {
          setShowSuccess(open);
          if (!open) setSelected(null);
        }}>
          <DialogContent className="sm:max-w-md rounded-3xl bg-card backdrop-blur-xl">
            <DialogHeader className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
              <DialogTitle className="font-display text-xl font-bold">Бронювання підтверджено!</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Ви успішно забронювали <strong>{selected?.name}</strong> на {floor}-му поверсі.
                <br />
                <span className="inline-block mt-2 font-medium text-foreground">
                  {dateLabel}, {timeLabel}
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-4">
              <Button 
                onClick={() => {
                  setShowSuccess(false);
                  setSelected(null);
                }}
                className="rounded-xl w-full sm:w-auto px-8"
              >
                Чудово
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
