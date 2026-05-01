import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { TopBar } from "@/components/booking/TopBar";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Settings,
  ChevronRight,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyBookings, useSpaces, useDeleteBooking } from "@/hooks/use-booking";
import { format, isAfter } from "date-fns";
import { toast } from "sonner";
import { uk } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Мій профіль — cospace" },
      {
        name: "description",
        content: "Профіль користувача cospace: ваші бронювання, історія та налаштування.",
      },
    ],
  }),
});

function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { data: spaces = [] } = useSpaces();
  const { data: bookings = [] } = useMyBookings();
  const deleteBooking = useDeleteBooking();

  const handleDelete = async (id: number) => {
    try {
      await deleteBooking.mutateAsync(id);
      toast.success("Бронювання успішно скасовано");
    } catch (error: any) {
      toast.error(error.message || "Помилка при скасуванні бронювання");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="size-8 text-primary absolute">
              <path
                d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
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
  if (!user) return <Navigate to="/login" />;

  const now = new Date();

  const enrichedBookings = bookings
    .map((b: any) => {
      const space = spaces.find((s: any) => s.id === b.space_id);
      const startDate = new Date(b.start_time);
      const endDate = new Date(b.end_time);

      return {
        ...b,
        space,
        isUpcoming: isAfter(startDate, now),
        dateStr: format(startDate, "d MMMM", { locale: uk }),
        timeStr: `${format(startDate, "HH:mm")} – ${format(endDate, "HH:mm")}`,
      };
    })
    .sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  const upcoming = enrichedBookings
    .filter((b: any) => b.isUpcoming && b.status !== "cancelled")
    .reverse();

  const totalHours = enrichedBookings
    .filter((b: any) => !b.isUpcoming)
    .reduce((acc: number, b: any) => {
      if (b.status === "cancelled") return acc;
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

  return (
    <main className="min-h-screen px-4 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-5">
        <TopBar />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Головна
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">Мій профіль</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <aside className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-border/60 shadow-[var(--shadow-card)] backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.72_0.16_280)] font-display text-3xl font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-muted-foreground">Учасник</p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-foreground">
                <Mail className="size-4 text-primary" />
                <span>{user.email}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Phone className="size-4 text-primary" />
                <span>{user.phone_number}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Київ, Україна</span>
              </li>
            </ul>

            <button className="flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent">
              <Settings className="size-4" /> Налаштування
            </button>
          </aside>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  v: enrichedBookings
                    .filter((b: any) => b.status !== "cancelled")
                    .length.toString(),
                  l: "Бронювань",
                },
                { v: `${Math.round(totalHours)} год`, l: "Загалом" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-card p-4 ring-1 ring-border/60 shadow-[var(--shadow-soft)] backdrop-blur-xl"
                >
                  <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                    {s.v}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <section className="rounded-3xl bg-card p-6 ring-1 ring-border/60 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold tracking-tight">
                  Майбутні бронювання
                </h3>
                <Link to="/" className="text-xs font-medium text-primary hover:underline">
                  + Нове
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Немає майбутніх бронювань.</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map((b: any) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3"
                    >
                      <div>
                        <p className="font-display text-sm font-semibold">
                          {b.space?.name || "Невідоме місце"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.space?.floor || "?"}-й поверх
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            {b.dateStr}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            {b.timeStr}
                          </span>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              disabled={deleteBooking.isPending}
                              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95 disabled:opacity-50"
                              title="Скасувати бронювання"
                            >
                              {deleteBooking.isPending && deleteBooking.variables === b.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Скасувати бронювання?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ви впевнені, що хочете скасувати це бронювання? Цю дію неможливо
                                відмінити.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Ні, залишити</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(b.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Так, скасувати
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* History */}
            <section className="rounded-3xl bg-card p-6 ring-1 ring-border/60 shadow-[var(--shadow-card)] backdrop-blur-xl">
              <h3 className="mb-4 font-display text-base font-semibold tracking-tight">Історія</h3>
              {enrichedBookings.filter((b: any) => !b.isUpcoming).length === 0 ? (
                <p className="text-sm text-muted-foreground">Історія порожня.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {enrichedBookings
                    .filter((b: any) => !b.isUpcoming)
                    .map((b: any) => (
                      <li
                        key={b.id}
                        className={`flex items-center justify-between py-3 text-sm ${b.status === "cancelled" ? "opacity-50" : ""}`}
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {b.space?.name || "Невідоме місце"}
                            {b.status === "cancelled" && (
                              <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                                Скасовано
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {b.space?.floor || "?"}-й поверх · {b.dateStr}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">{b.timeStr}</span>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
