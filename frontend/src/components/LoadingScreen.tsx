export function LoadingScreen({ label = "Завантаження" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="surface flex flex-col items-center gap-5 px-10 py-8">
        <div className="relative size-12" aria-hidden>
          <div className="absolute inset-0 rounded-xl bg-primary/20" />
          <div className="absolute inset-0 animate-spin rounded-xl border-2 border-primary border-t-transparent" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
