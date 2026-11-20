# Agent Skill Benchmark - 2026-11-20

- Device: Scenario iPhone 17 Pro (27.2), UDID `6E124D2F-4035-471B-9B0C-23E8C31DC08C`
- Host: macOS 26.6.2; Xcode 27.2 (Build version 27B52)
- Repository revision: `unknown`
- rs1: 16.8.0 (339); binary: `/Applications/RocketSim.app/Contents/Resources/CLI/rocketsim` (SHA-256 `a3452ce017bff17225d2fbdd8e068c8155ecbf333f636c9421b01506d7d189bc`); skill: `~/drive/src/nomac-lead-9/repo/RocketSim/RocketSim/Resources/Agent-Skill/rocketsim/SKILL.md` (SHA-256 `c109d05fb430eb610d245329b6a7dc02ff5953857d69ccdc7f07557e2639180a`)

## Per-Scenario Results

| Round | Scenario | Goal | Tool | turns | bytes | tokens_estimated | elapsed_ms | wrong_taps | unexpected_failures |
|---:|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | S1 | Tap General from Settings root | rs1 | 4 | 999 | 5830 | 3939 | 0 | 0 |
| 1 | S2 | Apple Account sign-in manually type email | rs1 | 4 | 573 | 5726 | 4555 | 1 | 0 |
| 1 | S3 | Accessibility Hover Text flip toggle | rs1 | 10 | 13182 | 8877 | 10851 | 0 | 0 |
| 1 | S4 | Scroll Settings root to off-screen Apps | rs1 | 6 | 2377 | 6174 | 6846 | 0 | 0 |
| 1 | S5 | Recover from stale snapshot after out-of-band navigation | rs1 | 8 | 4184 | 6630 | 7062 | 0 | 0 |

## Per-Scenario Timing Distribution

| Scenario | Tool | rounds | median_ms | min_ms | max_ms |
|---|---|---:|---:|---:|---:|
| S1 | rs1 | 1 | 3939 | 3939 | 3939 |
| S2 | rs1 | 1 | 4555 | 4555 | 4555 |
| S3 | rs1 | 1 | 10851 | 10851 | 10851 |
| S4 | rs1 | 1 | 6846 | 6846 | 6846 |
| S5 | rs1 | 1 | 7062 | 7062 | 7062 |

## Aggregate Totals

| Tool | rounds | turns | bytes | tokens_estimated | elapsed_ms | wrong_taps | unexpected_failures |
|---|---:|---:|---:|---:|---:|---:|---:|
| rs1 | 5 | 32 | 21315 | 33237 | 33253 | 1 | 0 |

## Correctness Failures

| Scenario | Tool | failed rounds | wrong_taps | unexpected_failures |
|---|---|---:|---:|---:|
| S2 | rs1 | 1 | 1 | 0 |

These failures remain in the results rather than being normalized away. S-series scripts are frozen historical scenarios, so current Settings UI drift and tool recovery failures stay visible.

## Measurement Notes

- `tokens_estimated` uses `(skill bytes + scenario prompt bytes + stdout/stderr bytes) / 4`; `actual_tokens` is `null` because Cursor session token accounting is not exposed to this script.
- The estimate charges the complete skill once per scenario. Real clients may load it once per session or reuse cached context, so this is a reproducible proxy rather than an API billing measurement.
- Screenshots and annotated snapshots are saved as artifacts, but binary image payloads redirected to files are not counted as prompt tokens.
- A-series web and visual scenarios intentionally use screenshot/coordinate fallback when the accessibility tree is sparse or semantically ambiguous.
- XcodeBuildMCP `bytes` counts the UTF-8 size of the compact JSON serialization of each JSON-RPC `result` payload (content blocks plus `structuredContent`/`isError`), excluding the `jsonrpc`/`id` transport envelope — the fair MCP equivalent of captured stdout/stderr. `content_text_bytes` records the rendered text blocks alone for a stricter reading.
- `tool_catalog_bytes` is the compact JSON size of the MCP `tools/list` result (tool names, descriptions, and input schemas). It is charged once per scenario in `tokens_estimated` for MCP tools, exactly like the skill file; CLI tools carry no tool catalog, so it is 0 for rs1 and axe.
- XcodeBuildMCP server startup, `tools/list`, and `session_set_defaults` (pointing the session at the benchmark simulator) are uncounted harness plumbing, mirroring the free `--udid` flags of the CLI tools.
- Before each XcodeBuildMCP scenario the harness polls `snapshot_ui` (uncounted, charged to `setup_elapsed_ms`) until the simulator's accessibility bridge answers; the orientation reset after A8 leaves it unresponsive for tens of seconds, which is environment recovery rather than agent work.
