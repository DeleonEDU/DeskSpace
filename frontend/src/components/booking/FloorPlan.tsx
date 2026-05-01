import { Space } from "@/hooks/use-booking";

interface Props {
  spaces: Space[];
  occupiedSpaceIds: Set<number>;
  selectedId: number | null;
  hoveredId: number | null;
  onSelect: (space: Space) => void;
  onHover: (space: Space | null) => void;
  floor: number;
}

export function FloorPlan({
  spaces,
  occupiedSpaceIds,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  floor,
}: Props) {
  const getStatus = (spaceId: number) => {
    if (spaceId === selectedId) return "selected";
    if (occupiedSpaceIds.has(spaceId)) return "occupied";
    return "available";
  };

  const fillFor = (status: string) => {
    if (status === "selected") return "var(--selected)";
    if (status === "occupied") return "var(--occupied)";
    return "var(--available)";
  };

  const textFor = (status: string) => {
    if (status === "selected") return "var(--selected-foreground)";
    if (status === "occupied") return "var(--occupied-foreground)";
    return "var(--available-foreground)";
  };

  // We will map svg_element_id to visual coordinates
  const layout: Record<
    string,
    { x: number; y: number; w: number; h: number; type: "room" | "desk" }
  > = {
    // Top rooms
    r1: { x: 20, y: 20, w: 170, h: 140, type: "room" },
    r2: { x: 210, y: 20, w: 170, h: 140, type: "room" },
    r3: { x: 400, y: 20, w: 170, h: 140, type: "room" },

    // Right rooms
    r4: { x: 610, y: 20, w: 170, h: 140, type: "room" },
    r5: { x: 610, y: 170, w: 170, h: 140, type: "room" },
    r6: { x: 610, y: 320, w: 170, h: 170, type: "room" },

    // Bottom rooms
    r7: { x: 160, y: 330, w: 105, h: 80, type: "room" },
    r8: { x: 280, y: 330, w: 100, h: 80, type: "room" },
    r9: { x: 400, y: 330, w: 85, h: 160, type: "room" },
    r10: { x: 500, y: 330, w: 85, h: 160, type: "room" },

    // Left desks (Open space)
    d1: { x: 30, y: 180, w: 40, h: 40, type: "desk" },
    d2: { x: 90, y: 180, w: 40, h: 40, type: "desk" },
    d3: { x: 30, y: 235, w: 40, h: 40, type: "desk" },
    d4: { x: 90, y: 235, w: 40, h: 40, type: "desk" },
    d5: { x: 30, y: 290, w: 40, h: 40, type: "desk" },
    d6: { x: 90, y: 290, w: 40, h: 40, type: "desk" },
    d7: { x: 30, y: 345, w: 40, h: 40, type: "desk" },
    d8: { x: 90, y: 345, w: 40, h: 40, type: "desk" },
    d9: { x: 30, y: 400, w: 40, h: 40, type: "desk" },
    d10: { x: 90, y: 400, w: 40, h: 40, type: "desk" },

    // Center desks (Open space)
    d11: { x: 180, y: 190, w: 40, h: 40, type: "desk" },
    d12: { x: 250, y: 190, w: 40, h: 40, type: "desk" },
    d13: { x: 320, y: 190, w: 40, h: 40, type: "desk" },
    d14: { x: 180, y: 250, w: 40, h: 40, type: "desk" },
    d15: { x: 250, y: 250, w: 40, h: 40, type: "desk" },
    d16: { x: 320, y: 250, w: 40, h: 40, type: "desk" },

    // Bottom desks
    d17: { x: 160, y: 440, w: 40, h: 40, type: "desk" },
    d18: { x: 220, y: 440, w: 40, h: 40, type: "desk" },
    d19: { x: 280, y: 440, w: 40, h: 40, type: "desk" },
    d20: { x: 340, y: 440, w: 40, h: 40, type: "desk" },
  };

  return (
    <div className="relative rounded-3xl bg-[var(--floor)] p-6 ring-1 ring-border/60">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Поверх
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {floor}
          </h3>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-[var(--available)] ring-1 ring-inset ring-black/5" />
            Доступна
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-[var(--occupied)] ring-1 ring-inset ring-black/5" />
            Зайнята
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-[var(--selected)]" />
            Обрана
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 800 510"
        className="h-auto w-full"
        role="img"
        aria-label={`План ${floor}-го поверху`}
      >
        {/* Outline of the floor */}
        <rect
          x="10"
          y="10"
          width="780"
          height="490"
          rx="18"
          fill="none"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />

        {/* Walls / separators */}
        <line
          x1="10"
          y1="170"
          x2="600"
          y2="170"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="600"
          y1="10"
          x2="600"
          y2="500"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="200"
          y1="10"
          x2="200"
          y2="170"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="390"
          y1="10"
          x2="390"
          y2="170"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />

        <line
          x1="150"
          y1="170"
          x2="150"
          y2="420"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="150"
          y1="320"
          x2="600"
          y2="320"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="150"
          y1="420"
          x2="390"
          y2="420"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />

        <line
          x1="275"
          y1="320"
          x2="275"
          y2="420"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="390"
          y1="320"
          x2="390"
          y2="500"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />
        <line
          x1="495"
          y1="320"
          x2="495"
          y2="500"
          stroke="var(--wall)"
          strokeOpacity="0.35"
          strokeWidth="4"
        />

        {/* Doors */}
        <rect x="180" y="168" width="40" height="4" fill="var(--floor)" />
        <rect x="370" y="168" width="40" height="4" fill="var(--floor)" />
        <rect x="598" y="120" width="4" height="40" fill="var(--floor)" />
        <rect x="598" y="260" width="4" height="40" fill="var(--floor)" />
        <rect x="598" y="400" width="4" height="40" fill="var(--floor)" />
        <rect x="148" y="380" width="4" height="40" fill="var(--floor)" />
        <rect x="200" y="318" width="40" height="4" fill="var(--floor)" />
        <rect x="320" y="318" width="40" height="4" fill="var(--floor)" />
        <rect x="420" y="318" width="40" height="4" fill="var(--floor)" />
        <rect x="520" y="318" width="40" height="4" fill="var(--floor)" />

        {/* Plants (Вазонки) */}
        <g stroke="var(--wall)" strokeOpacity="0.5" strokeWidth="2" fill="#86efac">
          <circle cx="40" cy="460" r="12" />
          <circle cx="40" cy="460" r="6" fill="#4ade80" />
          <circle cx="750" cy="460" r="16" />
          <circle cx="750" cy="460" r="8" fill="#4ade80" />
          <circle cx="750" cy="40" r="14" />
          <circle cx="750" cy="40" r="7" fill="#4ade80" />
          <circle cx="420" cy="460" r="12" />
          <circle cx="420" cy="460" r="6" fill="#4ade80" />
        </g>

        {/* Lounge area */}
        <rect
          x="420"
          y="200"
          width="140"
          height="80"
          rx="8"
          fill="var(--wall)"
          fillOpacity="0.1"
          stroke="var(--wall)"
          strokeOpacity="0.2"
        />
        <circle cx="490" cy="240" r="20" fill="var(--wall)" fillOpacity="0.2" />
        <text
          x="490"
          y="244"
          fontSize="12"
          textAnchor="middle"
          fill="var(--wall)"
          fillOpacity="0.6"
        >
          Lounge
        </text>

        {spaces.map((space) => {
          const l = layout[space.svg_element_id];
          if (!l) return null;

          const status = getStatus(space.id);
          const isSelected = status === "selected";
          const isHover = space.id === hoveredId;
          const isOccupied = status === "occupied";

          return (
            <g
              key={space.id}
              onClick={() => !isOccupied && onSelect(space)}
              onMouseEnter={() => onHover(space)}
              onMouseLeave={() => onHover(null)}
              className={isOccupied ? "cursor-not-allowed" : "cursor-pointer"}
            >
              <rect
                x={l.x}
                y={l.y}
                width={l.w}
                height={l.h}
                rx={l.type === "room" ? 12 : 6}
                fill={fillFor(status)}
                stroke={isSelected ? "var(--selected)" : "var(--wall)"}
                strokeOpacity={isSelected ? 1 : 0.18}
                strokeWidth={isSelected ? 2 : 1}
                style={{
                  transition: "all 220ms cubic-bezier(0.4, 0, 0.2, 1)",
                  filter: isSelected
                    ? "drop-shadow(0 10px 24px oklch(0.62 0.16 255 / 0.35))"
                    : isHover && !isOccupied
                      ? "drop-shadow(0 6px 16px oklch(0.5 0.05 250 / 0.18))"
                      : "none",
                  transformOrigin: `${l.x + l.w / 2}px ${l.y + l.h / 2}px`,
                  transform: isHover && !isOccupied ? "scale(1.02)" : "scale(1)",
                }}
              />
              {l.type === "room" ? (
                <foreignObject x={l.x} y={l.y} width={l.w} height={l.h} pointerEvents="none">
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center"
                    style={{ color: textFor(status) }}
                  >
                    <span className="font-display text-sm font-semibold tracking-tight">
                      {space.name}
                    </span>
                    {space.capacity && (
                      <span className="text-[10px] opacity-80">{space.capacity} місць</span>
                    )}
                  </div>
                </foreignObject>
              ) : (
                <foreignObject x={l.x} y={l.y} width={l.w} height={l.h} pointerEvents="none">
                  <div
                    className="flex h-full w-full items-center justify-center text-center"
                    style={{ color: textFor(status) }}
                  >
                    <span className="text-[10px] font-bold">
                      {space.name.replace("Стіл #", "#")}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
