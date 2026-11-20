# RocketSim on the public simulator-use benchmark

[simulator-use](https://simulator-use.dev/benchmarks) publishes an open-source harness
([`NoMac-app/simulator-use`](https://github.com/NoMac-app/simulator-use), folder `bench/`) and a leaderboard that signs in to the
same demo app with nine iOS Simulator tools, each driven the way its README describes. This folder holds what we ran to put
RocketSim through the same harness, so anyone can check or repeat it. The article
[Testing AI agents for the iOS Simulator](https://www.rocketsim.app/blog/testing-ai-agents-ios-simulator/) explains the results.

We did not submit this to the leaderboard. It is our own run with the author's harness, not a published entry.

## What is here

| Path | Contents |
| --- | --- |
| `rocketsim.mjs` | The adapter: goes to `bench/tools/rocketsim.mjs` in a checkout of the harness. Its comments say why each step is driven the way it is. |
| `results/2026-11-20/` | The harness's own output for the run below: `summary.md`, `summary.json` and one JSON per run (`rocketsim.json`, `rocketsim.last.json`, `simulator-use.json`). |

## The run (November 20, 2026)

| | |
| --- | --- |
| Harness | `NoMac-app/simulator-use` at commit `d75ef5e` (`bench/run.mjs`, `bench/summarize.mjs`), unmodified except for the added adapter |
| Mac | One [NoMac](https://nomac.app) cloud Mac (virtual Mac, macOS 26.6.2, Xcode 27.2) that had been running for about 70 minutes, nothing else running |
| Simulator | iPhone 17 Pro, iOS 27.2, created fresh; the harness's demo app `dev.simtap.demo` (`examples/swiftui-demo`) |
| RocketSim | 17.0.0 (341), a Developer ID signed pre-release build of what ships as RocketSim 17.0 (`ROCKETSIM_BUILD_LABEL` records "17.0.0 pre-release"); Pro licence; started headless |
| simulator-use | 0.15.3, the version preinstalled on that Mac, run on the same Mac in the same session |
| Order | `rocketsim`, `rocketsim.last` (a second RocketSim run), then `simulator-use`. simulator-use runs last because the Simulator's accessibility service sometimes stops answering after it, which broke the run after it |
| Samples | Medians of 20 reads, 20 taps, 10 typings, 10 step-by-step sign-ins and 10 batched sign-ins |
| Tokens | The harness's estimate, characters divided by four (no API key set); they do not depend on the Mac |

How RocketSim is driven: it has no MCP server, so each step is one `rocketsim` command line process, timed from spawn to exit,
and what it prints is what the agent reads. Reads use `elements --agent --agent-mode nav` (`act` where the step has to see a
typed value or status text), taps and typing use `interact` by accessibility identifier with `--screen latest`, the batched
sign-in is one `do` call, and after each relaunch an untimed `wait element` waits for the screen, as RocketSim's bundled agent
skill advises.

### Results

| | simulator-use 0.15.3 | RocketSim run 1 | RocketSim run 2 |
| --- | --- | --- | --- |
| Tokens, sign in (step by step) | 194 | 164 | 164 |
| Tokens, sign in (batched) | 179 | 165 | 165 |
| Tokens, read the screen | 72 | 51 | 51 |
| Tool list tokens | 2,443 | 0 | 0 |
| Tap Sign In | 623 ms | 397 ms | 403 ms |
| Read the screen | 222 ms | 36 ms | 33 ms |
| Type into Email | 1.09 s | 1.43 s | 1.46 s |
| Sign in, step by step | 3.37 s | 3.22 s | 3.23 s |
| Sign in, batched | 2.47 s | 3.17 s | 3.19 s |
| Steps that worked | 10/10 flows, 20/20 taps | 10/10, 20/20 | 10/10, 20/20 |

RocketSim reads fewer tokens in every measure, reads and taps faster, and signs in a little faster on this Mac.
simulator-use is faster at typing and at the batched sign-in. In our earlier run on another Mac simulator-use signed in
faster (2.79 s against 3.00 s), so the whole sign-in is level. Times are only comparable inside a run; the leaderboard's
times come from another Mac.

## Repeat it

1. On a Mac with Xcode and an iPhone Simulator, clone `NoMac-app/simulator-use`, check out `d75ef5e`, and run its `bench/setup.sh`.
2. Install RocketSim (the 17.0 release once it ships), open it once, select Xcode, activate a Pro licence (without one the
   command line answers `quota_exceeded` after its free daily allowance), and start it headless so it never activates
   Simulator.app: `open -g /Applications/RocketSim.app --args -suppress_simulator_host_activation 1`.
3. Put `rocketsim` on `PATH` (RocketSim, Settings, CLI & Agent) and check it with `rocketsim doctor`.
4. Copy `rocketsim.mjs` to `bench/tools/rocketsim.mjs`, then `node bench/run.mjs --tool rocketsim --udid <simulator udid>` and
   `node bench/summarize.mjs bench/results/<folder>`.

Keep the Mac otherwise idle while it runs: clicks and focus changes move the timings.
