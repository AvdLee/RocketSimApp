// RocketSim: the `rocketsim` command line (rs/1), used the way its bundled agent skill says. Copy to bench/tools/rocketsim.mjs
// in a checkout of NoMac-app/simulator-use. One process per call, timed from spawn to exit, and what it prints is what the
// agent reads. RocketSim.app must be running (the server behind the command line); see RUNBOOK.md.
//   read : `elements --agent --agent-mode nav`, the compact screen the skill tells agents to start with. The skill says to
//          use `act` for values and state, so the read right after typing (to see the field's text) and the final read
//          (to see the status text, which `nav` hides) use `act`.
//   tap  : `interact tap --identifier ... --screen latest`, a selector guarded against a stale screen. The demo's text
//          fields have no label (only the ids `email` and `password`, which `elements` lists as `!identifier` rows), so
//          every target is chosen by its exact accessibility identifier, as the skill describes.
//   type : one fused `interact type '...' --identifier <field> --screen latest` call (no `do` wrapper for a single step),
//          which focuses the field, waits for the focus to show, and types (one answer, no separate focus read).
//          `--settle quick` on the typing is faster still but made the next relaunch-and-focus fail with
//          element_not_found in about 1 of 5 tries on the Mac (November 18, 2026), so it is not used here.
//   batch: one `do --refresh-policy smart` call with every step of the sign-in (the skill's batch form); `interact` settles by itself, so there
//          is no extra wait or read between the steps.
//   reset: relaunch the app (after a pause, see the comment there), `wait element` until the screen is readable, as the skill advises after
//          a launch. Untimed, like the harness's own reset.
import { execFileSync } from "node:child_process";

const BIN = process.env.ROCKETSIM_BIN ?? "rocketsim";
const APP = process.env.ROCKETSIM_APP ?? "/Applications/RocketSim.app";
const udid = (ctx) => ["--udid", ctx.udid];
const target = (what) => ["--identifier", what, "--screen", "latest"];

export default {
  id: "rocketsim", name: "RocketSim", kind: "cli",
  notes: [
    "RocketSim has no MCP server: each step is one `rocketsim` process talking to the running RocketSim app, timed from spawn to exit; its output is what the agent reads.",
    "Targets are chosen by accessibility identifier with `--screen latest`, as the bundled skill advises; a batch is `rocketsim do --step ...`.",
    "After each app relaunch the harness's untimed reset also runs `rocketsim wait element`, because the first seconds after a launch read as an empty screen.",
  ],
  version: () => {
    const plist = `${APP}/Contents/Info.plist`;
    const read = (key) => execFileSync("/usr/bin/defaults", ["read", plist, key], { encoding: "utf8" }).trim();
    // The pre-release build is the 17.0.0 line but still carries the previous version string; BUILD_LABEL says which.
    const label = process.env.ROCKETSIM_BUILD_LABEL ? ` ${process.env.ROCKETSIM_BUILD_LABEL}` : "";
    return `${read("CFBundleShortVersionString")} (${read("CFBundleVersion")})${label}`;
  },
  async read(ctx) {
    const mode = ctx.state.checkValues ? "act" : "nav";
    ctx.state.checkValues = false;
    await ctx.cli(BIN, ["elements", "--agent", "--agent-mode", mode, ...udid(ctx)]);
  },
  async finalRead(ctx) { ctx.state.checkValues = false; await ctx.cli(BIN, ["elements", "--agent", "--agent-mode", "act", ...udid(ctx)]); },
  async tap(ctx, what) { await ctx.cli(BIN, ["interact", "tap", ...target(what), ...udid(ctx)]); },
  async type(ctx, field, text) {
    ctx.state.checkValues = true;
    await ctx.cli(BIN, ["interact", "type", text, "--identifier", field, "--screen", "latest", ...udid(ctx)]);
  },
  async batch(ctx, list) {
    ctx.state.checkValues = true;
    const steps = list.flatMap(([what, field, value]) =>
      what === "type" ? [`interact type '${value}' --identifier ${field} --screen latest`] : [`interact tap --identifier ${field} --screen latest`]);
    await ctx.cli(BIN, ["do", "--refresh-policy", "smart", ...udid(ctx), ...steps.flatMap((s) => ["--step", s])]);
  },
  async reset(ctx) {
    ctx.state.checkValues = false;
    try { execFileSync("xcrun", ["simctl", "terminate", ctx.udid, ctx.bundleId], { stdio: "ignore" }); } catch { /* not running */ }
    // A launch right after a terminate can attach to the dying process on a slow cloud Mac and leave no app, and
    // `wait element` can then answer from the previous run's stored screen. So pause, launch, wait, and make sure the
    // signed-out screen of the new process is what a read shows. All of it is untimed.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    execFileSync("xcrun", ["simctl", "launch", ctx.udid, ctx.bundleId], { stdio: "ignore" });
    await ctx.cli(BIN, ["wait", "element", "--identifier", "signIn", "--timeout", "15", ...udid(ctx)]);
    for (let attempt = 0; attempt < 30; attempt++) {
      let text = "";
      try { text = execFileSync(BIN, ["elements", "--agent", "--agent-mode", "act", ...udid(ctx)], { encoding: "utf8" }); } catch { /* retry */ }
      if (text.includes("Not signed in")) return;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  },
};
