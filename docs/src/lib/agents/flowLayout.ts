import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  type Edge,
  type Frame,
  type Scenario,
} from "./types.ts";

// The flow page's layout, simplified from RocketSim's own: screens sit on one
// row in first-visit order, and an arrow leaves the tapped element. Elements
// in the tab bar's band leave through the bottom into a lane under the
// screens; every other element leaves through the side into the next screen.
// All numbers are in board units, the board being as wide as its screens.

/** The window the board is seen through; the camera fits content into it. */
export const VIEWPORT = { w: 900, h: 640 } as const;

const SCREEN_SCALE = 200 / SCREEN_WIDTH;
const BEZEL = 4;
const CARD_WIDTH = 200 + BEZEL * 2;
const CARD_HEIGHT = Math.round(SCREEN_HEIGHT * SCREEN_SCALE) + BEZEL * 2;
const GAP = 96;
const FIRST_X = 130;
const TOP = 112;
const LANE_FIRST = 34;
const LANE_STEP = 30;
const CORNER = 14;
// Elements below this share of the screen leave through the bottom.
const BOTTOM_BAND = 0.82;
const CAMERA_PADDING = 40;
const CAMERA_MAX_SCALE = 1.1;

interface Point {
  x: number;
  y: number;
}

interface LaidScreen {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  at: number;
}

interface LaidEdge {
  id: string;
  index: number;
  d: string;
  arrow: string;
  pill: Point;
  /** Where the tapped element sits on the board. */
  ring: Frame;
  /** Where the arrow starts, drawn as a dot. */
  anchor: Point;
  label: string;
  tone: Edge["tone"];
  at: number;
  until?: number;
  prerequisite: boolean;
  state?: Edge["state"];
}

interface Camera {
  scale: number;
  x: number;
  y: number;
}

interface BoardLayout {
  width: number;
  height: number;
  screens: LaidScreen[];
  edges: LaidEdge[];
  start: Point;
  bracket: { x1: number; x2: number; y: number };
  /** The camera for each beat, panning to what has appeared so far. */
  cameras: Camera[];
}

const round = (value: number) => Math.round(value * 10) / 10;

/** A polyline through `points` with its corners rounded. */
function roundedPath(points: Point[]): string {
  const commands = [`M${round(points[0].x)} ${round(points[0].y)}`];
  for (let index = 1; index < points.length - 1; index += 1) {
    const before = points[index - 1];
    const corner = points[index];
    const after = points[index + 1];
    const radius = Math.min(
      CORNER,
      Math.hypot(corner.x - before.x, corner.y - before.y) / 2,
      Math.hypot(after.x - corner.x, after.y - corner.y) / 2,
    );
    const towardBefore = unit(corner, before);
    const towardAfter = unit(corner, after);
    const entry = {
      x: corner.x + towardBefore.x * radius,
      y: corner.y + towardBefore.y * radius,
    };
    const exit = {
      x: corner.x + towardAfter.x * radius,
      y: corner.y + towardAfter.y * radius,
    };
    commands.push(
      `L${round(entry.x)} ${round(entry.y)}`,
      `Q${round(corner.x)} ${round(corner.y)} ${round(exit.x)} ${round(exit.y)}`,
    );
  }
  const last = points[points.length - 1];
  commands.push(`L${round(last.x)} ${round(last.y)}`);
  return commands.join(" ");
}

function unit(from: Point, to: Point): Point {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / length, y: (to.y - from.y) / length };
}

/** A triangle whose tip is at `tip`, pointing along `direction`. */
function arrowHead(tip: Point, direction: Point): string {
  const size = 9;
  const base = {
    x: tip.x - direction.x * size,
    y: tip.y - direction.y * size,
  };
  const normal = { x: -direction.y, y: direction.x };
  const left = {
    x: base.x + normal.x * size * 0.62,
    y: base.y + normal.y * size * 0.62,
  };
  const right = {
    x: base.x - normal.x * size * 0.62,
    y: base.y - normal.y * size * 0.62,
  };
  return [tip, left, right].map((p) => `${round(p.x)},${round(p.y)}`).join(" ");
}

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function cameraFor(box: Box): Camera {
  const width = box.x2 - box.x1 + CAMERA_PADDING * 2;
  const height = box.y2 - box.y1 + CAMERA_PADDING * 2;
  const scale = Math.min(
    VIEWPORT.w / width,
    VIEWPORT.h / height,
    CAMERA_MAX_SCALE,
  );
  return {
    scale: round(scale * 1000) / 1000,
    x: round((VIEWPORT.w - (box.x2 - box.x1) * scale) / 2 - box.x1 * scale),
    y: round((VIEWPORT.h - (box.y2 - box.y1) * scale) / 2 - box.y1 * scale),
  };
}

function laneKey(edge: Edge): string {
  return `${edge.from}:${edge.element}:${edge.to}`;
}

export function layoutBoard(scenario: Scenario): BoardLayout {
  const order = scenario.screens.map((screen) => screen.id);
  const screens: LaidScreen[] = scenario.screens.map((screen, index) => ({
    id: screen.id,
    title: screen.title,
    x: FIRST_X + index * (CARD_WIDTH + GAP),
    y: TOP,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    at: scenario.placements.find(({ screen: id }) => id === screen.id)?.at ?? 0,
  }));
  const screenById = new Map(screens.map((screen) => [screen.id, screen]));
  const sourceById = new Map(
    scenario.screens.map((screen) => [screen.id, screen]),
  );

  const lanes = new Map<string, number>();
  const edges: LaidEdge[] = scenario.edges.map((edge, index) => {
    const from = screenById.get(edge.from);
    const to = screenById.get(edge.to);
    const element = sourceById
      .get(edge.from)
      ?.elements.find(({ id }) => id === edge.element);
    if (!from || !to || !element) {
      throw new Error(
        `Edge "${edge.id}" points at a screen or element that does not exist.`,
      );
    }

    const ring: Frame = {
      x: from.x + BEZEL + element.frame.x * SCREEN_SCALE,
      y: from.y + BEZEL + element.frame.y * SCREEN_SCALE,
      w: element.frame.w * SCREEN_SCALE,
      h: element.frame.h * SCREEN_SCALE,
    };
    const centerX = ring.x + ring.w / 2;
    const centerY = ring.y + ring.h / 2;
    const bottomExit =
      element.frame.y + element.frame.h / 2 > SCREEN_HEIGHT * BOTTOM_BAND ||
      order.indexOf(edge.to) !== order.indexOf(edge.from) + 1;

    if (bottomExit) {
      const key = laneKey(edge);
      if (!lanes.has(key)) lanes.set(key, lanes.size);
      const lane = lanes.get(key) ?? 0;
      const laneY = from.y + CARD_HEIGHT + LANE_FIRST + lane * LANE_STEP;
      const endX = to.x + CARD_WIDTH / 2 + ((lane % 3) - 1) * 22;
      const startY = from.y + CARD_HEIGHT - BEZEL;
      const endY = to.y + CARD_HEIGHT + 4;
      return {
        id: edge.id,
        index,
        d: roundedPath([
          { x: centerX, y: startY },
          { x: centerX, y: laneY },
          { x: endX, y: laneY },
          { x: endX, y: endY },
        ]),
        arrow: arrowHead({ x: endX, y: endY }, { x: 0, y: -1 }),
        pill: { x: (centerX + endX) / 2, y: laneY },
        ring,
        anchor: { x: centerX, y: centerY },
        label: edge.label,
        tone: edge.tone,
        at: edge.at,
        until: edge.until,
        prerequisite: edge.prerequisite ?? false,
        state: edge.state,
      };
    }

    const startX = ring.x + ring.w;
    const endX = to.x;
    const middle = from.x + CARD_WIDTH + GAP / 2;
    return {
      id: edge.id,
      index,
      d: roundedPath([
        { x: startX, y: centerY },
        { x: middle, y: centerY },
        { x: endX - 2, y: centerY },
      ]),
      arrow: arrowHead({ x: endX, y: centerY }, { x: 1, y: 0 }),
      pill: { x: middle, y: centerY },
      ring,
      anchor: { x: startX - 6, y: centerY },
      label: edge.label,
      tone: edge.tone,
      at: edge.at,
      until: edge.until,
      prerequisite: edge.prerequisite ?? false,
      state: edge.state,
    };
  });

  const first = screens[0];
  const last = screens[screens.length - 1];
  const start: Point = { x: first.x - 62, y: first.y + CARD_HEIGHT * 0.5 };
  const laneCount = lanes.size;
  const width = last.x + CARD_WIDTH + 70;
  const height =
    TOP +
    CARD_HEIGHT +
    (laneCount > 0 ? LANE_FIRST + laneCount * LANE_STEP : 0) +
    56;

  const beats = Math.max(
    ...scenario.transcript.map((item) => item.at),
    ...scenario.placements.map((placement) => placement.at),
    ...scenario.edges.map((edge) => edge.at),
  );
  const cameras: Camera[] = [];
  for (let beat = 0; beat <= beats; beat += 1) {
    const shown = screens.filter((screen) => screen.at <= beat);
    const reachable = shown.length > 0 ? shown : [first];
    // The start marker stays in view, so the board only ever grows.
    const box: Box = {
      x1: start.x - 40,
      x2: Math.max(...reachable.map((screen) => screen.x + CARD_WIDTH)),
      y1: TOP - 74,
      y2: TOP + CARD_HEIGHT,
    };
    edges
      .filter((edge) => edge.at <= beat && beat < (edge.until ?? Infinity))
      .forEach((edge) => {
        // Only the lane's depth matters for the camera.
        const matches = edge.d.match(/[\d.]+ [\d.]+/g) ?? [];
        matches.forEach((pair) => {
          const [, y] = pair.split(" ").map(Number);
          box.y2 = Math.max(box.y2, y + 28);
        });
      });
    cameras.push(cameraFor(box));
  }
  // The last beat shows the whole board.
  cameras[cameras.length - 1] = cameraFor({
    x1: start.x - 40,
    y1: TOP - 74,
    x2: last.x + CARD_WIDTH,
    y2: height - 40,
  });

  return {
    width,
    height,
    screens,
    edges,
    start,
    bracket: { x1: first.x, x2: last.x + CARD_WIDTH, y: TOP - 52 },
    cameras,
  };
}

export const CARD = {
  scale: SCREEN_SCALE,
  bezel: BEZEL,
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
} as const;
