import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/PageShell";
import { formatPhoneDisplay } from "@/lib/phone";
import { labelCaps } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
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
import { LoadingScreen } from "@/components/LoadingScreen";
import { useMyBookings, useSpaces, useDeleteBooking, type Booking, type Space } from "@/hooks/use-booking";
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
      { title: "Мій профіль — DeskSpace" },
      {
        name: "description",
        content: "Ваші бронювання, історія та контакти.",
      },
    ],
  }),
});

type EnrichedBooking = Booking & {
  space?: Space;
  isUpcoming: boolean;
  dateStr: string;
  timeStr: string;
};

function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { data: spaces = [] } = useSpaces();
  const { data: bookings = [] } = useMyBookings();
  const deleteBooking = useDeleteBooking();

  const handleDelete = async (id: number) => {
    try {
      await deleteBooking.mutateAsync(id);
      toast.success("Бронювання успішно скасовано");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Помилка при скасуванні");
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;

  const now = new Date();

  const enrichedBookings: EnrichedBooking[] = bookings
    .map((b) => {
      const space = spaces.find((s) => s.id === b.space_id);
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
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  const upcoming = enrichedBookings
    .filter((b) => b.isUpcoming && b.status !== "cancelled")
    .reverse();

  const totalHours = enrichedBookings
    .filter((b) => !b.isUpcoming && b.status !== "cancelled")
    .reduce((acc, b) => {
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

  const bookingCount = enrichedBookings.filter((b) => b.status !== "cancelled").length;

  return (
    <PageShell maxWidth="profile">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-foreground">
          Головна
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        <span className="font-medium text-foreground">Мій профіль</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="surface-lg flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-24 items-center justify-center rounded-2xl bg-primary font-display text-3xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">Учасник coworking</p>
          </div>

          <ul className="space-y-3 text-sm">
            {[
              { icon: Mail, value: user.email },
              { icon: Phone, value: formatPhoneDisplay(user.phone_number) },
              { icon: MapPin, value: "Київ, Україна" },
            ].map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary ring-1 ring-border/60">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="font-medium break-all">{value}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary py-3 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <Settings className="size-4" aria-hidden />
            Налаштування
          </button>
        </aside>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: String(bookingCount), l: "Бронювань" },
              { v: `${Math.round(totalHours)} год`, l: "Загалом" },
            ].map((s) => (
              <div key={s.l} className="surface p-5">
                <p className="font-display text-3xl font-bold">{s.v}</p>
                <p className={cn(labelCaps, "mt-1")}>{s.l}</p>
              </div>
            ))}
          </div>

          <section className="surface-lg p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold">Майбутні бронювання</h3>
              <Link
                to="/"
                className="rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/25"
              >
                + Нове
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Немає майбутніх бронювань.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-col gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">{b.space?.name ?? "Невідоме місце"}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.space?.floor_level ?? "?"}-й поверх
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex flex-wrap gap-2 text-xs font-medium">
                        <span className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 ring-1 ring-border/50">
                          <Calendar className="size-3 text-primary" aria-hidden />
                          {b.dateStr}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 ring-1 ring-border/50">
                          <Clock className="size-3 text-primary" aria-hidden />
                          {b.timeStr}
                        </span>
                      </div>
                      <CancelDialog
                        pending={deleteBooking.isPending && deleteBooking.variables === b.id}
                        onConfirm={() => handleDelete(b.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface-lg p-6 sm:p-8">
            <h3 className={cn("mb-5", labelCaps)}>Історія</h3>
            {enrichedBookings.filter((b) => !b.isUpcoming).length === 0 ? (
              <p className="text-sm text-muted-foreground">Історія порожня.</p>
            ) : (
              <ul className="divide-y divide-border/50">
                {enrichedBookings
                  .filter((b) => !b.isUpcoming)
                  .map((b) => (
                    <li
                      key={b.id}
                      className={`flex flex-wrap items-center justify-between gap-2 py-4 ${b.status === "cancelled" ? "opacity-50" : ""}`}
                    >
                      <div>
                        <p className="font-semibold">
                          {b.space?.name ?? "Невідоме місце"}
                          {b.status === "cancelled" && (
                            <span className="ml-2 text-[10px] font-bold uppercase text-destructive">
                              Скасовано
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.space?.floor_level ?? "?"}-й поверх · {b.dateStr}
                        </p>
                      </div>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                        {b.timeStr}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}

function CancelDialog({
  pending,
  onConfirm,
}: {
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={pending}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          title="Скасувати бронювання"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="surface-lg border-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl">Скасувати бронювання?</AlertDialogTitle>
          <AlertDialogDescription>Цю дію неможливо відмінити.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Залишити</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Скасувати
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
