import { floors } from "@/lib/booking-data";

interface Props {
  current: number;
  onChange: (floor: number) => void;
}

const ROW_H = 44; // height per floor row (button + gap)

export function BuildingSelector({ current, onChange }: Props) {
  return (
    <div className="flex items-start gap-4">
      {/* Floor buttons */}
      <div className="flex flex-col gap-2">
        {floors.map((f) => {
          const active = f === current;
          return (
            <button
              key={f}
              onClick={() => onChange(f)}
              className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] scale-105"
                  : "bg-secondary text-foreground hover:bg-accent"
              }`}
              aria-label={`Поверх ${f}`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Building — each floor aligned with its button */}
      <svg
        viewBox={`0 0 160 ${floors.length * ROW_H + 10}`}
        className="w-auto"
        style={{ height: floors.length * ROW_H + 10 }}
      >
        {/* Ground line */}
        <line
          x1="10"
          y1={floors.length * ROW_H + 4}
          x2="150"
          y2={floors.length * ROW_H + 4}
          stroke="oklch(0.85 0.01 250)"
          strokeWidth="1"
        />

        {floors.map((f, idx) => {
          const active = f === current;
          // Button center y in the column = idx * (size+gap) + size/2
          // size = 36 (size-9), gap = 8 → row = 44, center = idx*44 + 18
          const cy = idx * ROW_H + 18;
          const blockH = 32;
          const y = cy - blockH / 2;
          const inset = idx * 1.5;
          const x = 18 + inset;
          const w = 124 - inset * 2;
          return (
            <g
              key={f}
              style={{ cursor: "pointer", transition: "transform 220ms" }}
              transform={active ? `translate(-3 0)` : ""}
              onClick={() => onChange(f)}
            >
              {/* Slab shadow */}
              <rect
                x={x}
                y={y + blockH}
                width={w}
                height="2.5"
                rx="1.25"
                fill="oklch(0.5 0.02 250 / 0.12)"
              />
              {/* Floor block */}
              <rect
                x={x}
                y={y}
                width={w}
                height={blockH}
                rx="4"
                fill={active ? "var(--primary)" : "oklch(0.98 0.005 250)"}
                stroke={active ? "oklch(0.50 0.16 255)" : "oklch(0.86 0.005 250)"}
                strokeWidth="1"
                style={{ transition: "all 220ms" }}
              />
              {/* Windows */}
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={x + 10 + i * ((w - 20) / 4)}
                  y={y + 9}
                  width={(w - 20) / 4 - 6}
                  height="14"
                  rx="2"
                  fill={active ? "oklch(0.99 0 0 / 0.85)" : "oklch(0.88 0.02 250)"}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
