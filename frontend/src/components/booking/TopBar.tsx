import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-full bg-card/90 px-4 py-3 ring-1 ring-border/60 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-3 pl-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path
              d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          DeskSpace
        </span>
      </Link>

      <div className="flex items-center gap-3 pr-1">
        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-full p-1 pr-4 transition-all hover:bg-accent/60 active:scale-95"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary uppercase ring-1 ring-primary/20">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
              <span className="hidden text-sm font-medium sm:block text-foreground">
                {user.first_name} {user.last_name}
              </span>
            </Link>

            <div className="h-5 w-px bg-border/80" />

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Вийти"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="rounded-full px-5">
                Увійти
              </Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-full px-5 shadow-sm">Реєстрація</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
