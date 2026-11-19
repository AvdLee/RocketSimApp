import type { MockElement, Screen } from "./types.ts";

// The sample app's screens, as simple accessibility-element lists. The stage
// draws each element as app UI, and the tapped element's frame anchors the
// arrow leaving it, so a screen and its arrows always agree.

const TAB_WIDTH = 97.5;

function tabBar(active: string, accountLabel = "Account"): MockElement[] {
  const tabs = [
    ["tab.watchlist", "Watchlist"],
    ["tab.stats", "Stats"],
    ["tab.explore", "Explore"],
    ["tab.account", accountLabel],
  ] as const;
  return tabs.map(([id, label], index) => ({
    id,
    kind: "tab",
    label,
    active: id === active,
    frame: { x: index * TAB_WIDTH, y: 770, w: TAB_WIDTH, h: 74 },
  }));
}

export const loginScreen: Screen = {
  id: "login",
  title: "Sign In",
  elements: [
    {
      id: "logo",
      kind: "title",
      label: "Stock Analyzer",
      frame: { x: 32, y: 170, w: 326, h: 48 },
    },
    {
      id: "intro",
      kind: "text",
      label: "Sign in to sync your watchlists.",
      frame: { x: 32, y: 226, w: 326, h: 28 },
    },
    {
      id: "email",
      kind: "field",
      label: "Email",
      value: "alice@example.com",
      frame: { x: 32, y: 300, w: 326, h: 54 },
    },
    {
      id: "password",
      kind: "field",
      label: "Password",
      value: "••••••••",
      secure: true,
      frame: { x: 32, y: 366, w: 326, h: 54 },
    },
    {
      id: "signin",
      kind: "button",
      label: "Sign In",
      frame: { x: 32, y: 446, w: 326, h: 54 },
    },
  ],
};

function symbolsScreen(id: string, accountLabel = "Account"): Screen {
  const rows: [string, string, string, string, "up" | "down"][] = [
    ["ddog", "DDOG", "Datadog, Inc.", "129,32", "up"],
    ["amzn", "AMZN", "Amazon.com, Inc.", "239,30", "down"],
    ["aapl", "AAPL", "Apple Inc.", "259,48", "up"],
    ["tsla", "TSLA", "Tesla, Inc.", "430,41", "up"],
    ["nvda", "NVDA", "NVIDIA Corporation", "191,13", "down"],
  ];
  return {
    id,
    title: "All Symbols",
    elements: [
      {
        id: "heading",
        kind: "title",
        label: "All Symbols",
        frame: { x: 20, y: 84, w: 300, h: 48 },
      },
      ...rows.map(
        ([key, label, detail, value, tone], index): MockElement => ({
          id: `row.${key}`,
          kind: "row",
          label,
          detail,
          value,
          tone,
          frame: { x: 16, y: 156 + index * 88, w: 358, h: 78 },
        }),
      ),
      ...tabBar("tab.watchlist", accountLabel),
    ],
  };
}

export const symbolsScreenDefault = symbolsScreen("symbols");
export const symbolsScreenRenamed = symbolsScreen("symbols", "Profile");

export const detailScreen: Screen = {
  id: "detail",
  title: "AAPL",
  elements: [
    {
      id: "symbol",
      kind: "text",
      label: "AAPL",
      frame: { x: 140, y: 78, w: 110, h: 30 },
    },
    {
      id: "name",
      kind: "title",
      label: "Apple Inc.",
      frame: { x: 20, y: 124, w: 230, h: 44 },
    },
    {
      id: "price",
      kind: "title",
      label: "356,27",
      tone: "up",
      frame: { x: 250, y: 124, w: 124, h: 44 },
    },
    {
      id: "market",
      kind: "text",
      label: "NASDAQ · Technology",
      frame: { x: 20, y: 172, w: 220, h: 26 },
    },
    {
      id: "watchlist",
      kind: "chip",
      label: "Watchlist",
      frame: { x: 262, y: 176, w: 112, h: 36 },
    },
    {
      id: "chart",
      kind: "chart",
      frame: { x: 16, y: 240, w: 358, h: 250 },
    },
    {
      id: "summary",
      kind: "card",
      label: "Analysis Summary",
      detail: "AI analyses the current metrics. Their grades remain unchanged.",
      frame: { x: 16, y: 520, w: 358, h: 170 },
    },
    {
      id: "generate",
      kind: "button",
      label: "Generate Summary",
      frame: { x: 32, y: 628, w: 326, h: 46 },
    },
    ...tabBar("tab.watchlist"),
  ],
};

export const statsScreen: Screen = {
  id: "stats",
  title: "Stats",
  elements: [
    {
      id: "heading",
      kind: "title",
      label: "Stats",
      frame: { x: 20, y: 84, w: 300, h: 48 },
    },
    {
      id: "indexes",
      kind: "text",
      label: "Major Indexes",
      frame: { x: 20, y: 150, w: 300, h: 30 },
    },
    {
      id: "sp500",
      kind: "card",
      label: "S&P 500",
      value: "6.939,03",
      detail: "+0,43%",
      tone: "up",
      frame: { x: 16, y: 192, w: 172, h: 104 },
    },
    {
      id: "nasdaq",
      kind: "card",
      label: "NASDAQ 100",
      value: "25.552,39",
      detail: "-1,28%",
      tone: "down",
      frame: { x: 202, y: 192, w: 172, h: 104 },
    },
    {
      id: "performance",
      kind: "card",
      label: "Watchlist Performance",
      frame: { x: 16, y: 320, w: 358, h: 250 },
    },
    {
      id: "performance.bars",
      kind: "bars",
      frame: { x: 32, y: 372, w: 326, h: 176 },
    },
    ...tabBar("tab.stats"),
  ],
};

export const accountScreen: Screen = {
  id: "account",
  title: "Account",
  elements: [
    {
      id: "heading",
      kind: "title",
      label: "Account",
      frame: { x: 20, y: 84, w: 300, h: 48 },
    },
    {
      id: "pro",
      kind: "card",
      label: "Stock Analyzer Pro",
      detail:
        "Unlock every stock, advanced insights, and the complete experience.",
      tone: "accent",
      frame: { x: 16, y: 156, w: 358, h: 150 },
    },
    {
      id: "pro.button",
      kind: "chip",
      label: "Become Pro",
      tone: "accent",
      frame: { x: 32, y: 248, w: 124, h: 38 },
    },
    {
      id: "notifications.earnings",
      kind: "row",
      label: "Earnings Notifications",
      frame: { x: 16, y: 340, w: 358, h: 58 },
    },
    {
      id: "notifications.price",
      kind: "row",
      label: "Price Notifications",
      frame: { x: 16, y: 398, w: 358, h: 58 },
    },
    {
      id: "roadmap",
      kind: "row",
      label: "Roadmap",
      frame: { x: 16, y: 480, w: 358, h: 58 },
    },
    {
      id: "report",
      kind: "row",
      label: "Report an Issue",
      frame: { x: 16, y: 538, w: 358, h: 58 },
    },
    {
      id: "review",
      kind: "row",
      label: "Write a Review",
      frame: { x: 16, y: 596, w: 358, h: 58 },
    },
    ...tabBar("tab.account"),
  ],
};
