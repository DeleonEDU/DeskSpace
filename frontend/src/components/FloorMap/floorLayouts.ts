import type { Floor, Space } from '../../types';

interface LayoutZone {
  id: string;
  x: number; y: number; width: number; height: number;
  fill: string; stroke: string;
  label?: string;
}

interface PositionedSpace {
  space: Space;
  x: number; y: number; width: number; height: number;
}

interface FloorLayout {
  zones: LayoutZone[];
  spaces: PositionedSpace[];
}

/**
 * Generates a procedural SVG layout for a floor based on its spaces.
 * Rooms (meeting_room, private_office) get larger blocks in the top section.
 * Desks are arranged in a grid in the open-space area.
 */
export function generateFloorLayout(_floor: Floor, visibleSpaces: Space[]): FloorLayout {
  const zones: LayoutZone[] = [];
  const positionedSpaces: PositionedSpace[] = [];

  const desks = visibleSpaces.filter((s) => s.space_type === 'desk');
  const rooms = visibleSpaces.filter(
    (s) => s.space_type === 'meeting_room' || s.space_type === 'private_office'
  );

  const hasBothTypes = desks.length > 0 && rooms.length > 0;

  // ── Layout constants ─────────────────────────────────────────────────────
  const PAD = 40;
  const TOTAL_W = 860;  // 900 - 40px padding each side
  const TOTAL_H = 480;  // 560 - padding

  // If we have rooms, allocate top strip
  let roomAreaH = 0;
  let openAreaY = PAD;
  let openAreaH = TOTAL_H;

  if (rooms.length > 0) {
    roomAreaH = rooms.some((r) => r.capacity >= 8) ? 170 : 130;
    openAreaY = PAD + roomAreaH + 20;
    openAreaH = TOTAL_H - roomAreaH - 30;
  }

  // ── Rooms Zone ───────────────────────────────────────────────────────────
  if (rooms.length > 0) {
    zones.push({
      id: 'rooms-zone',
      x: PAD, y: PAD, width: TOTAL_W, height: roomAreaH,
      fill: 'rgba(56,189,248,0.03)', stroke: 'rgba(56,189,248,0.1)',
      label: 'Переговорні та офіси',
    });

    const roomW = Math.min(220, (TOTAL_W - (rooms.length - 1) * 16) / rooms.length);
    rooms.forEach((room, i) => {
      const rW = room.capacity >= 8 ? Math.min(280, roomW * 1.3) : roomW;
      const rH = room.capacity >= 8 ? roomAreaH - 20 : roomAreaH - 20;
      let rx = PAD + 12;

      // Distribute rooms
      if (i > 0) {
        const prevW = rooms.slice(0, i).reduce((acc) => acc + roomW + 16, 0);
        rx = PAD + 12 + prevW;
      }

      // Clamp within bounds
      rx = Math.min(rx, PAD + TOTAL_W - rW - 12);

      positionedSpaces.push({ space: room, x: rx, y: PAD + 10, width: rW, height: rH });
    });
  }

  // ── Open-space Area ──────────────────────────────────────────────────────
  if (desks.length > 0) {
    if (hasBothTypes) {
      zones.push({
        id: 'open-zone',
        x: PAD, y: openAreaY - 4, width: TOTAL_W, height: openAreaH + 8,
        fill: 'rgba(74,222,128,0.03)', stroke: 'rgba(74,222,128,0.1)',
        label: 'Оpen Space',
      });
    }

    // Split desks into two groups: regular desks and "open alley" desks
    const regularDesks = desks.filter((d) => !d.svg_element_id.startsWith('open-'));
    const openDesks = desks.filter((d) => d.svg_element_id.startsWith('open-'));

    const DESK_W = 68;
    const DESK_H = 56;
    const DESK_GAP_X = 12;
    const DESK_GAP_Y = 14;

    // Regular desks - grid layout with cluster separation
    if (regularDesks.length > 0) {
      const colCount = Math.min(6, regularDesks.length);
      regularDesks.forEach((desk, i) => {
        const col = i % colCount;
        const row = Math.floor(i / colCount);
        // Cluster separation: add gap after 3 desks in a row
        const clusterOffsetX = col >= 3 ? 24 : 0;
        const dx = PAD + 12 + col * (DESK_W + DESK_GAP_X) + clusterOffsetX;
        const dy = openAreaY + 20 + row * (DESK_H + DESK_GAP_Y);
        positionedSpaces.push({ space: desk, x: dx, y: dy, width: DESK_W, height: DESK_H });
      });
    }

    // Open alley desks — bottom row, labeled area
    if (openDesks.length > 0) {
      const alleySectionY = openAreaY + openAreaH - DESK_H - 20;

      // Label: "Опен-плей алея"
      zones.push({
        id: 'alley-zone',
        x: PAD, y: alleySectionY - 12, width: TOTAL_W, height: DESK_H + 28,
        fill: 'rgba(251,191,36,0.04)', stroke: 'rgba(251,191,36,0.15)',
        label: 'Опен-плей алея',
      });

      const colCount = Math.min(8, openDesks.length);
      openDesks.forEach((desk, i) => {
        const col = i % colCount;
        const dx = PAD + 12 + col * (DESK_W + 10);
        positionedSpaces.push({ space: desk, x: dx, y: alleySectionY, width: DESK_W, height: DESK_H });
      });
    }
  }

  return { zones, spaces: positionedSpaces };
}
