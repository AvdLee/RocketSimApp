/**
 * The benchmark figures the agentic pages show, in one place. When new
 * results land, change this file only: the bars, the stats and the sentences
 * on /features/agentic-development/ are all computed from it.
 *
 * Current figures: the public leaderboard at simulator-use.dev/benchmarks
 * (run on 6 Nov 2026), with RocketSim's own row (17.0 pre-release, measured
 * on 21 Nov 2026 through the same open-source harness on a different Mac; on that
 * same Mac simulator-use 0.15.3 read 194 tokens and took 4.26 s). The benchmark's
 * author estimates tokens as characters divided by 4.
 */
interface BenchmarkRow {
  tool: string;
  /** A version, or a note such as "round three". */
  detail: string;
  /** Tokens read over a whole sign-in. Fewer is better. */
  tokens: number;
  /** Seconds for the step-by-step sign-in. Fewer is better. */
  signInSeconds: number;
}

export const benchmarkSource = {
  label: "simulator-use.dev/benchmarks",
  href: "https://simulator-use.dev/benchmarks",
  /** RocketSim's write-up of the method. */
  articleHref: "/blog/testing-ai-agents-ios-simulator/",
  ranDate: "6 Nov 2026",
};

/** The tool the pages are about. Must match a row's `tool`. */
export const OWN_TOOL = "RocketSim";

/** Ranked by tokens read, as the benchmark ranks them. */
export const benchmarkRows: BenchmarkRow[] = [
  {
    tool: "RocketSim",
    detail: "17.0 pre-release",
    tokens: 161,
    signInSeconds: 2.7,
  },
  { tool: "simulator-use", detail: "0.15.1", tokens: 194, signInSeconds: 4.28 },
  { tool: "agent-device", detail: "0.21.36", tokens: 664, signInSeconds: 7.62 },
  { tool: "mobile-mcp", detail: "1.0.16", tokens: 980, signInSeconds: 6.32 },
  {
    tool: "MobileBuildMCP",
    detail: "2.7.1, formerly XcodeBuildMCP",
    tokens: 1560,
    signInSeconds: 17.58,
  },
  { tool: "Maestro MCP", detail: "2.12.1", tokens: 2987, signInSeconds: 10.21 },
  {
    tool: "ios-simulator-mcp",
    detail: "2.2.0",
    tokens: 5248,
    signInSeconds: 2.08,
  },
  { tool: "Argent", detail: "0.32.0", tokens: 7061, signInSeconds: 6.98 },
  { tool: "Xcode MCP", detail: "27.0", tokens: 12732, signInSeconds: 4.18 },
];

/**
 * Tools on the leaderboard, plus RocketSim. One more tool (130,766 tokens, 5.9 s) is counted
 * but not drawn: its bar would flatten every other bar in the chart.
 */
export const benchmarkToolCount = benchmarkRows.length + 1;

const own = benchmarkRows.find((row) => row.tool === OWN_TOOL);
if (!own) throw new Error(`benchmark.ts has no row for ${OWN_TOOL}`);
const ownRow: BenchmarkRow = own;

const rankBy = (key: "tokens" | "signInSeconds") =>
  [...benchmarkRows].sort((a, b) => a[key] - b[key]).indexOf(ownRow) + 1;

const ordinals = ["first", "second", "third", "fourth", "fifth", "sixth"];
const ordinal = (rank: number) => ordinals[rank - 1] ?? `${rank}th`;
const lowest = (rank: number) =>
  rank === 1 ? "the lowest" : `the ${ordinal(rank)} lowest`;
const fastest = (rank: number) =>
  rank === 1 ? "the fastest" : `${ordinal(rank)} fastest`;

/** How many times fewer tokens RocketSim reads than another tool. */
export function tokenRatioAgainst(tool: string): number {
  const other = benchmarkRows.find((row) => row.tool === tool);
  if (!other) throw new Error(`benchmark.ts has no row for ${tool}`);
  return other.tokens / ownRow.tokens;
}

/** A ratio as a stat reads: 28×, 3.5×. */
export function formatRatio(ratio: number): string {
  return `${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}×`;
}

/** Seconds for RocketSim's tap on the same benchmark. The only other taps that report the result take 0.72 s or more. */
const ownTapSeconds = 0.4;

export const tokenRank = rankBy("tokens");
const signInRank = rankBy("signInSeconds");

/** One plain sentence for the section's intro. */
export const benchmarkSummary =
  `On the public simulator-use.dev benchmark, RocketSim reads ` +
  `${ownRow.tokens} tokens to sign in, ${lowest(tokenRank)} of ` +
  `${benchmarkToolCount} tools, and finishes the sign-in in ` +
  `${ownRow.signInSeconds.toFixed(1)} s, ${fastest(signInRank)}. ` +
  `Its tap takes ${ownTapSeconds.toFixed(2)} s, the quickest of the tools whose tap reports the result.`;
