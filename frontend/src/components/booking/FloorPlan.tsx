import { memo, useMemo } from "react";
import type { Space } from "@/hooks/use-booking";
import { SpaceShape } from "@/components/booking/SpaceShape";
import { SPACE_LAYOUT, type SpaceLayoutRect } from "@/components/booking/space-layout";

const VIEWBOX_W = 800;
const VIEWBOX_H = 510;

interface Props {
  spaces: Space[];
  occupiedSpaceIds: Set<number>;
  selectedId: number | null;
  hoveredId: number | null;
  onSelect: (space: Space) => void;
  onHover: (space: Space | null) => void;
  floor: number;
}

function FloorPlanComponent({
  spaces,
  occupiedSpaceIds,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  floor,
}: Props) {
  const visibleSpaces = useMemo(
    () => spaces.filter((s) => SPACE_LAYOUT[s.svg_element_id]),
    [spaces],
  );

  const tooltipTarget = useMemo(() => {
    if (hoveredId == null || hoveredId === selectedId) return null;
    const space = visibleSpaces.find((s) => s.id === hoveredId);
    if (!space) return null;
    const layout = SPACE_LAYOUT[space.svg_element_id];
    if (!layout) return null;
    return { space, layout };
  }, [hoveredId, selectedId, visibleSpaces]);

  return (
    <div className="surface-lg flex flex-col p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Поверх
          </span>
          <span className="font-display text-4xl font-bold leading-none text-foreground">
            {floor}
          </span>
        </div>
        <ul className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[var(--available)] ring-1 ring-[var(--available-border)]" />
            Вільна
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-[var(--occupied)] ring-1 ring-[var(--occupied-border)]" />
            Зайнята
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-primary shadow-[var(--shadow-glow)]" />
            Обрана
          </li>
        </ul>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="h-auto w-full max-h-[min(70vh,520px)]"
          role="img"
          aria-label={`План ${floor}-го поверху`}
        >
          <rect
            x="10"
            y="10"
            width="780"
            height="490"
            rx="16"
            fill="var(--floor)"
            stroke="var(--wall)"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <Walls />
          <LoungeDecor />
          {visibleSpaces.map((space) => {
            const l = SPACE_LAYOUT[space.svg_element_id]!;
            return (
              <SpaceShape
                key={space.id}
                space={space}
                layout={l}
                selectedId={selectedId}
                isOccupied={occupiedSpaceIds.has(space.id)}
                isHovered={hoveredId === space.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            );
          })}
        </svg>

        {tooltipTarget && (
          <SpaceHoverTooltip
            space={tooltipTarget.space}
            layout={tooltipTarget.layout}
            isOccupied={occupiedSpaceIds.has(tooltipTarget.space.id)}
          />
        )}
      </div>
    </div>
  );
}

function SpaceHoverTooltip({
  space,
  layout,
  isOccupied,
}: {
  space: Space;
  layout: SpaceLayoutRect;
  isOccupied: boolean;
}) {
  const centerX = layout.x + layout.w / 2;
  const leftPct = (centerX / VIEWBOX_W) * 100;
  const topPct = (layout.y / VIEWBOX_H) * 100;

  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[140px] max-w-[200px] rounded-xl border border-border/70 bg-popover px-3 py-2.5 text-popover-foreground shadow-[var(--shadow-card)]"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
      role="status"
    >
      <p className="font-display text-sm font-bold leading-tight">{space.name}</p>
      <p className="mt-1 text-xs">
        <span
          className="font-semibold"
          style={{ color: isOccupied ? "var(--status-occupied)" : "var(--status-available)" }}
        >
          {isOccupied ? "Зайнята" : "Вільна"}
        </span>
        {space.capacity ? (
          <span className="text-muted-foreground"> · {space.capacity} місць</span>
        ) : null}
      </p>
      <div
        className="absolute left-1/2 top-full size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border/70 bg-popover"
        aria-hidden
      />
    </div>
  );
}

function Walls() {
  const wall = { stroke: "var(--wall)", strokeOpacity: 0.35, strokeWidth: 4 };
  const door = { fill: "var(--floor)" };
  return (
    <>
      <line x1="10" y1="170" x2="600" y2="170" {...wall} />
      <line x1="600" y1="10" x2="600" y2="500" {...wall} />
      <line x1="200" y1="10" x2="200" y2="170" {...wall} />
      <line x1="390" y1="10" x2="390" y2="170" {...wall} />
      <line x1="150" y1="170" x2="150" y2="420" {...wall} />
      <line x1="150" y1="320" x2="600" y2="320" {...wall} />
      <line x1="150" y1="420" x2="390" y2="420" {...wall} />
      <line x1="275" y1="320" x2="275" y2="420" {...wall} />
      <line x1="390" y1="320" x2="390" y2="500" {...wall} />
      <line x1="495" y1="320" x2="495" y2="500" {...wall} />
      <rect x="180" y="168" width="40" height="4" {...door} />
      <rect x="370" y="168" width="40" height="4" {...door} />
      <rect x="598" y="120" width="4" height="40" {...door} />
      <rect x="598" y="260" width="4" height="40" {...door} />
      <rect x="598" y="400" width="4" height="40" {...door} />
      <rect x="148" y="380" width="4" height="40" {...door} />
      <rect x="200" y="318" width="40" height="4" {...door} />
      <rect x="320" y="318" width="40" height="4" {...door} />
      <rect x="420" y="318" width="40" height="4" {...door} />
      <rect x="520" y="318" width="40" height="4" {...door} />
    </>
  );
}

function LoungeDecor() {
  return (
    <g opacity="0.9">
      <rect
        x="410"
        y="190"
        width="160"
        height="110"
        rx="10"
        fill="var(--secondary)"
        fillOpacity="0.5"
        stroke="var(--wall)"
        strokeOpacity="0.15"
        strokeDasharray="5 4"
      />
      <circle cx="490" cy="245" r="18" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
      <text
        x="490"
        y="248"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.08em"
        fill="var(--muted-foreground)"
      >
        LOUNGE
      </text>
    </g>
  );
}

export const FloorPlan = memo(FloorPlanComponent);
