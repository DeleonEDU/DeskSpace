export function LoadingScreen({ label = "Завантаження" }: { label?: string }) {
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
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="animate-pulse font-display text-sm font-medium text-muted-foreground tracking-widest uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
