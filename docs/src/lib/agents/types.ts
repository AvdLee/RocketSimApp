// The data behind the agent stage (src/components/agents/AgentFlowStage.astro):
// a scripted agent session on the left and the flow page it builds on the
// right. Everything the stage shows comes from a `Scenario`, so the screens,
// the arrows and the transcript cannot drift apart.

/** A phone screen is drawn in a 390 x 844 point space, like an iPhone. */
export const SCREEN_WIDTH = 390;
export const SCREEN_HEIGHT = 844;

export interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
}

type ElementKind =
  | "title"
  | "text"
  | "row"
  | "button"
  | "field"
  | "tab"
  | "card"
  | "chart"
  | "chip"
  | "bars";

type Tone = "up" | "down" | "accent" | "neutral";

/** One accessibility element of a screen, drawn as simple app UI. */
export interface MockElement {
  id: string;
  kind: ElementKind;
  frame: Frame;
  label?: string;
  detail?: string;
  value?: string;
  tone?: Tone;
  /** A tab bar item that is selected. */
  active?: boolean;
  /** A field whose value is hidden. */
  secure?: boolean;
}

export interface Screen {
  id: string;
  title: string;
  elements: MockElement[];
}

/** Which color an arrow takes, in the order the flow page cycles them. */
type EdgeTone = 0 | 1 | 2;

export interface Edge {
  id: string;
  from: string;
  /** The tapped element on the `from` screen. */
  element: string;
  to: string;
  label: string;
  tone: EdgeTone;
  /** The beat the arrow draws in. */
  at: number;
  /** The beat the arrow goes away again. */
  until?: number;
  /** Steps that only run when a prerequisite flow has to run. */
  prerequisite?: boolean;
  /** An arrow that stands for a failed or healed step. */
  state?: "stale" | "fixed";
}

type TranscriptItem =
  | { kind: "user"; at: number; text: string }
  | { kind: "note"; at: number; text: string }
  | {
      kind: "cmd";
      at: number;
      command: string;
      output?: string;
      /** The size of the command's output, shown in the context meter. */
      bytes: number;
    }
  /** A line of progress a running flow prints, such as a passed checkpoint. */
  | { kind: "step"; at: number; text: string }
  /** The one compact reply a command ends with. */
  | { kind: "result"; at: number; text: string; bytes: number }
  | { kind: "reply"; at: number; text: string };

interface ScreenPlacement {
  screen: string;
  /** The beat the screen appears. */
  at: number;
}

export interface Scenario {
  id: string;
  /** Read by screen readers instead of the animation. */
  summary: string;
  flowName: string;
  /** Screens in first-visit order, as on the flow page. */
  screens: Screen[];
  placements: ScreenPlacement[];
  edges: Edge[];
  transcript: TranscriptItem[];
  /** The beat that brackets the screens under the flow's name. */
  bracketAt?: number;
  /** The beat the agent replays the saved flow. */
  replayAt?: number;
  /** The text of the first beat's caption, for each beat. */
  beatLabels: string[];
}
