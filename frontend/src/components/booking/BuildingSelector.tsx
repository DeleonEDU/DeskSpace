import { memo } from "react";
import { floors } from "@/lib/booking-data";
import { cn } from "@/lib/utils";

interface Props {
  current: number;
  onChange: (floor: number) => void;
}

const ROW_H = 44;

function BuildingSelectorComponent({ current, onChange }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-2" role="tablist" aria-label="Поверхи">
        {floors.map((f) => {
          const active = f === current;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(f)}
              className={cn(
                "flex size-10 items-center justify-center rounded-xl text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "bg-secondary text-foreground ring-1 ring-border/60 hover:bg-accent",
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      <svg
        viewBox={`0 0 140 ${floors.length * ROW_H + 8}`}
        className="w-[120px] shrink-0"
        style={{ height: floors.length * ROW_H + 8 }}
        aria-hidden
      >
        <line
          x1="8"
          y1={floors.length * ROW_H + 2}
          x2="132"
          y2={floors.length * ROW_H + 2}
          stroke="var(--border)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {floors.map((f, idx) => {
          const active = f === current;
          const cy = idx * ROW_H + 18;
          const blockH = 28;
          const y = cy - blockH / 2;
          const inset = idx * 1.2;
          const x = 14 + inset;
          const w = 112 - inset * 2;
          return (
            <g
              key={f}
              style={{ cursor: "pointer" }}
              onClick={() => onChange(f)}
              onKeyDown={(e) => e.key === "Enter" && onChange(f)}
              role="button"
              tabIndex={0}
            >
              <rect
                x={x}
                y={y + blockH}
                width={w}
                height="2"
                rx="1"
                fill="var(--foreground)"
                opacity="0.08"
              />
              <rect
                x={x}
                y={y}
                width={w}
                height={blockH}
                rx="5"
                fill={active ? "var(--primary)" : "var(--secondary)"}
                stroke={active ? "var(--primary)" : "var(--border)"}
                strokeWidth="1"
              />
              {[0, 1, 2, 3].map((i) => (
                <rect
                  key={i}
                  x={x + 8 + i * ((w - 16) / 4)}
                  y={y + 8}
                  width={(w - 16) / 4 - 5}
                  height="12"
                  rx="2"
                  fill={active ? "var(--primary-foreground)" : "var(--muted-foreground)"}
                  opacity={active ? 0.85 : 0.25}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const BuildingSelector = memo(BuildingSelectorComponent);
