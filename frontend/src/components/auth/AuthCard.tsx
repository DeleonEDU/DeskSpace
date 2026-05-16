import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 py-10">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="surface-lg w-full max-w-[440px] p-8 sm:p-10">
        <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden>
            <path
              d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2v-9z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <header className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </header>
        {children}
        {footer ? (
          <footer className="mt-8 text-center text-sm text-muted-foreground">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}
