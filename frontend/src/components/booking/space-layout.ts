export type SpaceLayoutRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "room" | "desk";
};

export const SPACE_LAYOUT: Record<string, SpaceLayoutRect> = {
  r1: { x: 20, y: 20, w: 170, h: 140, type: "room" },
  r2: { x: 210, y: 20, w: 170, h: 140, type: "room" },
  r3: { x: 430, y: 20, w: 170, h: 140, type: "room" },
  r4: { x: 610, y: 20, w: 170, h: 140, type: "room" },
  r5: { x: 610, y: 170, w: 170, h: 140, type: "room" },
  r6: { x: 610, y: 320, w: 170, h: 170, type: "room" },
  r7: { x: 160, y: 330, w: 105, h: 80, type: "room" },
  r8: { x: 280, y: 330, w: 100, h: 80, type: "room" },
  r9: { x: 400, y: 330, w: 85, h: 160, type: "room" },
  r10: { x: 500, y: 330, w: 85, h: 160, type: "room" },
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
  d11: { x: 180, y: 190, w: 40, h: 40, type: "desk" },
  d12: { x: 250, y: 190, w: 40, h: 40, type: "desk" },
  d13: { x: 320, y: 190, w: 40, h: 40, type: "desk" },
  d14: { x: 180, y: 250, w: 40, h: 40, type: "desk" },
  d15: { x: 250, y: 250, w: 40, h: 40, type: "desk" },
  d16: { x: 320, y: 250, w: 40, h: 40, type: "desk" },
  d17: { x: 160, y: 440, w: 40, h: 40, type: "desk" },
  d18: { x: 220, y: 440, w: 40, h: 40, type: "desk" },
  d19: { x: 280, y: 440, w: 40, h: 40, type: "desk" },
  d20: { x: 340, y: 440, w: 40, h: 40, type: "desk" },
};
