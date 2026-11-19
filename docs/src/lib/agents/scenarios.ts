import {
  accountScreen,
  detailScreen,
  loginScreen,
  statsScreen,
  symbolsScreenDefault,
  symbolsScreenRenamed,
} from "./screens.ts";
import type { Scenario } from "./types.ts";

// The sessions the agent stage replays. Commands, flags and reply shapes
// follow the RocketSim CLI and the Navigation Flows docs; the output sizes
// are illustrative. Every beat is one agent step, and the board shows what
// the step added.

/** An agent reads the screen, taps through four screens, then saves a flow. */
const tour: Scenario = {
  id: "tour",
  summary:
    "An AI agent reads the Simulator screen as text, taps through four screens, and saves the path as a flow. The flow page builds up beside it, with an arrow from each tapped element to the next screen.",
  flowName: "open-stock-detail",
  screens: [symbolsScreenDefault, detailScreen, statsScreen, accountScreen],
  placements: [
    { screen: "symbols", at: 0 },
    { screen: "detail", at: 1 },
    { screen: "stats", at: 2 },
    { screen: "account", at: 3 },
  ],
  edges: [
    {
      id: "tap-aapl",
      from: "symbols",
      element: "row.aapl",
      to: "detail",
      label: "AAPL",
      tone: 0,
      at: 1,
    },
    {
      id: "tap-stats",
      from: "detail",
      element: "tab.stats",
      to: "stats",
      label: "Stats",
      tone: 1,
      at: 2,
    },
    {
      id: "tap-account",
      from: "stats",
      element: "tab.account",
      to: "account",
      label: "Account",
      tone: 2,
      at: 3,
    },
  ],
  bracketAt: 4,
  replayAt: 5,
  beatLabels: [
    "Read the screen",
    "Tap a row",
    "Switch tab",
    "Switch tab",
    "Save the path",
    "Replay it",
  ],
  transcript: [
    {
      kind: "user",
      at: 0,
      text: "Check the AAPL detail, then the Stats and Account tabs.",
    },
    { kind: "note", at: 0, text: "Reading the screen as text first." },
    {
      kind: "cmd",
      at: 0,
      command: "rocketsim elements --agent",
      output: "All Symbols\n3|row|AAPL\n9|tab|Stats\n10|tab|Account",
      bytes: 412,
    },
    {
      kind: "cmd",
      at: 1,
      command: 'rocketsim interact tap --label "AAPL"',
      output: "ok · AAPL",
      bytes: 96,
    },
    {
      kind: "cmd",
      at: 2,
      command: 'rocketsim interact tap --label "Stats"',
      output: "ok · Stats",
      bytes: 96,
    },
    {
      kind: "cmd",
      at: 3,
      command: 'rocketsim interact tap --label "Account"',
      output: "ok · Account",
      bytes: 98,
    },
    {
      kind: "note",
      at: 4,
      text: "I will need this path again. Saving it.",
    },
    {
      kind: "cmd",
      at: 4,
      command: "rocketsim flow save --name open-stock-detail --last 3",
      output:
        "saved · 3 steps\nFlow review: 127.0.0.1:4995/flow/open-stock-detail",
      bytes: 240,
    },
    {
      kind: "note",
      at: 5,
      text: "Next task: replay instead of rediscovering.",
    },
    {
      kind: "cmd",
      at: 5,
      command: "rocketsim flow open-stock-detail",
      bytes: 0,
    },
    {
      kind: "result",
      at: 5,
      text: '{"status":"ok","flow":"open-stock-detail",\n"steps_run":3}',
      bytes: 118,
    },
    { kind: "reply", at: 5, text: "Back on Account in one command." },
  ],
};

/** A flow with a prerequisite: the second run skips the sign-in. */
const flows: Scenario = {
  id: "flows",
  summary:
    "An agent lists saved flows, runs one that signs in first, then replays it. The second run skips the sign-in prerequisite because the app is already signed in.",
  flowName: "open-account",
  screens: [loginScreen, symbolsScreenDefault, accountScreen],
  placements: [
    { screen: "login", at: 1 },
    { screen: "symbols", at: 1 },
    { screen: "account", at: 2 },
  ],
  edges: [
    {
      id: "sign-in",
      from: "login",
      element: "signin",
      to: "symbols",
      label: "Sign In",
      tone: 0,
      at: 1,
      prerequisite: true,
    },
    {
      id: "tap-account",
      from: "symbols",
      element: "tab.account",
      to: "account",
      label: "Account",
      tone: 1,
      at: 2,
    },
  ],
  bracketAt: 2,
  replayAt: 3,
  beatLabels: ["Discover", "Run with its prerequisite", "Arrive", "Replay"],
  transcript: [
    {
      kind: "user",
      at: 0,
      text: "Open the Account screen and check the notification rows.",
    },
    { kind: "note", at: 0, text: "Checking the saved flows first." },
    {
      kind: "cmd",
      at: 0,
      command: "rocketsim flow list",
      output:
        "login  Sign in with the test account\nopen-account (login)  Open Account from home",
      bytes: 164,
    },
    {
      kind: "cmd",
      at: 1,
      command: "rocketsim flow open-account",
      bytes: 0,
    },
    {
      kind: "step",
      at: 1,
      text: 'flow login ✓ · expect "All Symbols"',
    },
    {
      kind: "step",
      at: 2,
      text: 'tap "Account" ✓ · expect "Account"',
    },
    {
      kind: "result",
      at: 2,
      text: '{"status":"ok","flow":"open-account",\n"steps_run":8}',
      bytes: 98,
    },
    {
      kind: "reply",
      at: 2,
      text: "On Account. Flow review: 127.0.0.1:4995/flow/open-account",
    },
    { kind: "note", at: 3, text: "Same task later. Already signed in." },
    {
      kind: "cmd",
      at: 3,
      command: "rocketsim flow open-account",
      bytes: 0,
    },
    {
      kind: "result",
      at: 3,
      text: '{"status":"ok","flow":"open-account",\n"steps_run":2,"skipped":["login"]}',
      bytes: 112,
    },
    { kind: "reply", at: 3, text: "Two steps instead of eight." },
  ],
};

/** The UI changed: the run fails once, the agent heals the flow. */
const drift: Scenario = {
  id: "drift",
  summary:
    "A saved flow fails because the app renamed the Account tab to Profile. The agent taps the new tab itself, runs flow fix, and the next run passes.",
  flowName: "open-account",
  screens: [symbolsScreenRenamed, accountScreen],
  placements: [
    { screen: "symbols", at: 0 },
    { screen: "account", at: 1 },
  ],
  edges: [
    {
      id: "tap-account-stale",
      from: "symbols",
      element: "tab.account",
      to: "account",
      label: "Account ✕",
      tone: 0,
      at: 0,
      until: 2,
      state: "stale",
    },
    {
      id: "tap-account-fixed",
      from: "symbols",
      element: "tab.account",
      to: "account",
      label: "Profile",
      tone: 1,
      at: 2,
      state: "fixed",
    },
  ],
  replayAt: 3,
  beatLabels: [
    "The run fails",
    "Navigate by hand",
    "Heal the flow",
    "Run again",
  ],
  transcript: [
    {
      kind: "cmd",
      at: 0,
      command: "rocketsim flow open-account",
      bytes: 0,
    },
    {
      kind: "result",
      at: 0,
      text: '{"status":"failed","step":2,\n"reason":"element_not_found",\n"nearest":"Profile"}',
      bytes: 210,
    },
    { kind: "note", at: 1, text: "The tab was renamed. Tapping it myself." },
    {
      kind: "cmd",
      at: 1,
      command: 'rocketsim interact tap --label "Profile"',
      output: "ok · Account",
      bytes: 98,
    },
    {
      kind: "cmd",
      at: 2,
      command: "rocketsim flow fix open-account",
      bytes: 0,
    },
    {
      kind: "result",
      at: 2,
      text: '{"status":"ok","healed":"tap --label \'Profile\'"}',
      bytes: 86,
    },
    {
      kind: "cmd",
      at: 3,
      command: "rocketsim flow open-account",
      bytes: 0,
    },
    {
      kind: "result",
      at: 3,
      text: '{"status":"ok","flow":"open-account",\n"steps_run":2}',
      bytes: 94,
    },
    { kind: "reply", at: 3, text: "Healed once. Green again." },
  ],
};

export const scenarios = { tour, flows, drift } as const;
export type ScenarioId = keyof typeof scenarios;

/** The number of beats in a scenario. */
export function beatCount(scenario: Scenario): number {
  const beats = [
    ...scenario.transcript.map((item) => item.at),
    ...scenario.placements.map((placement) => placement.at),
    ...scenario.edges.map((edge) => edge.at),
  ];
  return Math.max(...beats) + 1;
}

/** Tool output the agent has read after a beat, in bytes. */
export function outputBytesThrough(scenario: Scenario, beat: number): number {
  return scenario.transcript.reduce(
    (total, item) =>
      "bytes" in item && item.at <= beat ? total + item.bytes : total,
    0,
  );
}
