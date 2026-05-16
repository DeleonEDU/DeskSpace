import { memo, useCallback } from "react";
import type { Space } from "@/hooks/use-booking";
import type { SpaceLayoutRect } from "@/components/booking/space-layout";

type Status = "available" | "occupied" | "selected";

function statusOf(spaceId: number, selectedId: number | null, occupied: boolean): Status {
  if (spaceId === selectedId) return "selected";
  if (occupied) return "occupied";
  return "available";
}

const fills: Record<Status, string> = {
  available: "var(--available)",
  occupied: "var(--occupied)",
  selected: "var(--primary)",
};

const strokes: Record<Status, string> = {
  available: "var(--available-border)",
  occupied: "var(--occupied-border)",
  selected: "var(--primary)",
};

const labelFills: Record<Status, string> = {
  available: "var(--foreground)",
  occupied: "var(--muted-foreground)",
  selected: "var(--primary-foreground)",
};

type Props = {
  space: Space;
  layout: SpaceLayoutRect;
  selectedId: number | null;
  isOccupied: boolean;
  isHovered: boolean;
  onSelect: (space: Space) => void;
  onHover: (space: Space | null) => void;
};

function SpaceShapeComponent({
  space,
  layout: l,
  selectedId,
  isOccupied,
  isHovered,
  onSelect,
  onHover,
}: Props) {
  const status = statusOf(space.id, selectedId, isOccupied);
  const rx = l.type === "room" ? 14 : 7;
  const cx = l.x + l.w / 2;
  const isRoom = l.type === "room";
  const showStatus = isRoom && status !== "selected";
  const statusLabel = isOccupied ? "Зайнята" : "Вільна";
  const nameY = showStatus ? l.y + l.h / 2 + 4 : l.y + l.h / 2;
  const label =
    l.type === "desk" ? space.name.replace("Стіл #", "#") : space.name;

  const handleClick = useCallback(() => {
    if (!isOccupied) onSelect(space);
  }, [isOccupied, onSelect, space]);

  const handleEnter = useCallback(() => onHover(space), [onHover, space]);
  const handleLeave = useCallback(() => onHover(null), [onHover]);

  return (
    <g
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={isOccupied ? "cursor-not-allowed" : "cursor-pointer"}
      style={{ opacity: isOccupied && status !== "selected" ? 0.72 : 1 }}
    >
      <rect
        x={l.x}
        y={l.y}
        width={l.w}
        height={l.h}
        rx={rx}
        fill={fills[status]}
        stroke={strokes[status]}
        strokeWidth={status === "selected" ? 2.5 : isHovered && !isOccupied ? 2 : 1}
      />
      {showStatus && (
        <text
          x={cx}
          y={l.y + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isOccupied ? "var(--status-occupied)" : "var(--status-available)"}
          fontSize={10}
          fontWeight={700}
          pointerEvents="none"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {statusLabel}
        </text>
      )}
      <text
        x={cx}
        y={isRoom && space.capacity ? nameY - 6 : nameY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={labelFills[status]}
        fontSize={isRoom ? 12 : 10}
        fontWeight={700}
        pointerEvents="none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </text>
      {isRoom && space.capacity ? (
        <text
          x={cx}
          y={nameY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={labelFills[status]}
          fontSize={9}
          opacity={0.85}
          pointerEvents="none"
        >
          {space.capacity} місць
        </text>
      ) : null}
    </g>
  );
}

export const SpaceShape = memo(SpaceShapeComponent);
