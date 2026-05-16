import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="surface flex items-center justify-between px-4 py-2.5 sm:px-5">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-opacity hover:opacity-90"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
            <path
              d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="hidden sm:block">
          <span className="font-display text-lg font-bold tracking-tight">DeskSpace</span>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Coworking
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 ring-1 ring-transparent transition-colors hover:bg-secondary hover:ring-border/50"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary font-display text-sm font-bold text-foreground ring-1 ring-border">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
              <span className="hidden max-w-[140px] truncate text-sm font-medium sm:block">
                {user.first_name} {user.last_name}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="size-9 rounded-xl text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              title="Вийти"
            >
              <LogOut className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-xl font-semibold">
                Увійти
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="btn-primary rounded-xl px-4">
                Реєстрація
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
