# Agent Skill Benchmark - 2026-11-20

- Device: Scenario iPhone 17 Pro (27.2), UDID `6E124D2F-4035-471B-9B0C-23E8C31DC08C`
- Host: macOS 26.6.2; Xcode 27.2 (Build version 27B52)
- Repository revision: `unknown`
- rs1: 16.8.0 (339); binary: `/Applications/RocketSim.app/Contents/Resources/CLI/rocketsim` (SHA-256 `a3452ce017bff17225d2fbdd8e068c8155ecbf333f636c9421b01506d7d189bc`); skill: `~/drive/src/nomac-lead-9/repo/RocketSim/RocketSim/Resources/Agent-Skill/rocketsim/SKILL.md` (SHA-256 `c109d05fb430eb610d245329b6a7dc02ff5953857d69ccdc7f07557e2639180a`)

## Per-Scenario Results

| Round | Scenario | Goal | Tool | turns | bytes | tokens_estimated | elapsed_ms | wrong_taps | unexpected_failures |
|---:|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | A1 | Files -> Team Docs -> Quarterly Plan | rs1 | 3 | 375 | 5679 | 771 | 1 | 0 |
| 1 | A10 | Batch nested navigation | rs1 | 2 | 405 | 5689 | 2457 | 0 | 0 |
| 1 | A11 | Swipe stateful target | rs1 | 10 | 2427 | 6199 | 6379 | 0 | 0 |
| 1 | A12 | Long-press stateful target | rs1 | 10 | 2432 | 6202 | 7145 | 0 | 0 |
| 1 | A13 | Type into stateful text field | rs1 | 10 | 2317 | 6170 | 8479 | 0 | 0 |
| 1 | A14 | Deliver two-finger touch | rs1 | 10 | 2440 | 6204 | 6447 | 0 | 0 |
| 1 | A15 | Press HOME and resume fixture | rs1 | 12 | 2618 | 6248 | 12355 | 0 | 0 |
| 1 | A16 | Audit intentionally inaccessible screen | rs1 | 8 | 5813 | 7041 | 5437 | 0 | 0 |
| 1 | A2 | Choose team account among duplicate Continue buttons | rs1 | 5 | 1371 | 5926 | 3695 | 0 | 0 |
| 1 | A3 | Tap the visual bunny photo | rs1 | 8 | 1752 | 6021 | 4394 | 0 | 0 |
| 1 | A4 | Complete web login in WKWebView | rs1 | 12 | 4778 | 6785 | 11027 | 0 | 0 |
| 1 | A5 | Hybrid Account -> Web Auth flow | rs1 | 11 | 4529 | 6723 | 9237 | 0 | 0 |
| 1 | A6 | Activate hidden debug menu | rs1 | 6 | 1238 | 5899 | 4491 | 0 | 0 |
| 1 | A7 | Complete Face ID prompt | rs1 | 13 | 2396 | 6185 | 10122 | 0 | 0 |
| 1 | A8 | Tap upside-down bottom-right target | rs1 | 12 | 2124 | 6120 | 8901 | 0 | 0 |
| 1 | A9 | Tap visual fish photo | rs1 | 7 | 1224 | 5903 | 4018 | 0 | 0 |

## Per-Scenario Timing Distribution

| Scenario | Tool | rounds | median_ms | min_ms | max_ms |
|---|---|---:|---:|---:|---:|
| A1 | rs1 | 1 | 771 | 771 | 771 |
| A10 | rs1 | 1 | 2457 | 2457 | 2457 |
| A11 | rs1 | 1 | 6379 | 6379 | 6379 |
| A12 | rs1 | 1 | 7145 | 7145 | 7145 |
| A13 | rs1 | 1 | 8479 | 8479 | 8479 |
| A14 | rs1 | 1 | 6447 | 6447 | 6447 |
| A15 | rs1 | 1 | 12355 | 12355 | 12355 |
| A16 | rs1 | 1 | 5437 | 5437 | 5437 |
| A2 | rs1 | 1 | 3695 | 3695 | 3695 |
| A3 | rs1 | 1 | 4394 | 4394 | 4394 |
| A4 | rs1 | 1 | 11027 | 11027 | 11027 |
| A5 | rs1 | 1 | 9237 | 9237 | 9237 |
| A6 | rs1 | 1 | 4491 | 4491 | 4491 |
| A7 | rs1 | 1 | 10122 | 10122 | 10122 |
| A8 | rs1 | 1 | 8901 | 8901 | 8901 |
| A9 | rs1 | 1 | 4018 | 4018 | 4018 |

## Aggregate Totals

| Tool | rounds | turns | bytes | tokens_estimated | elapsed_ms | wrong_taps | unexpected_failures |
|---|---:|---:|---:|---:|---:|---:|---:|
| rs1 | 16 | 139 | 38239 | 98994 | 105355 | 1 | 0 |

## Capability Scenarios

| Round | Scenario | Tool | wrong_taps | unexpected_failures |
|---:|---|---|---:|---:|
| 1 | A7 | rs1 | 0 | 0 |
| 1 | A14 | rs1 | 0 | 0 |
| 1 | A16 | rs1 | 0 | 0 |

## Correctness Failures

| Scenario | Tool | failed rounds | wrong_taps | unexpected_failures |
|---|---|---:|---:|---:|
| A1 | rs1 | 1 | 1 | 0 |

These failures remain in the results rather than being normalized away. S-series scripts are frozen historical scenarios, so current Settings UI drift and tool recovery failures stay visible.

## Unsupported Coverage

| Scenario | Supported tools | Unsupported interaction |
|---|---|---|
| A4 | rs1, axe | XcodeBuildMCP 2.7.0 does not expose WKWebView content in its runtime UI snapshot and has no coordinate tap fallback, so the in-web Continue press cannot be issued. |
| A5 | rs1, axe | XcodeBuildMCP 2.7.0 does not expose WKWebView content in its runtime UI snapshot and has no coordinate tap fallback, so the in-web Continue press cannot be issued. |
| A7 | rs1 | AXe 1.8.0 has no biometric simulation command. XcodeBuildMCP 2.7.0 exposes no biometric simulation tool. |
| A10 | rs1, axe | XcodeBuildMCP 2.7.0 batch accepts only same-screen elementRef tap steps, so the single-batch cross-screen navigation cannot be expressed. |
| A11 | rs1, axe | XcodeBuildMCP 2.7.0 `swipe` accepts only scroll-container refs (swipeWithin) and has no coordinate swipe, so the stateful non-scroll swipe target cannot receive the gesture. |
| A14 | rs1 | AXe 1.8.0 exposes only single-contact touch events. XcodeBuildMCP 2.7.0 tap/touch tools are single-contact only. |
| A16 | rs1 | AXe and XcodeBuildMCP do not expose a structured accessibility audit command. |

## Measurement Notes

- `tokens_estimated` uses `(skill bytes + scenario prompt bytes + stdout/stderr bytes) / 4`; `actual_tokens` is `null` because Cursor session token accounting is not exposed to this script.
- The estimate charges the complete skill once per scenario. Real clients may load it once per session or reuse cached context, so this is a reproducible proxy rather than an API billing measurement.
- Screenshots and annotated snapshots are saved as artifacts, but binary image payloads redirected to files are not counted as prompt tokens.
- A-series web and visual scenarios intentionally use screenshot/coordinate fallback when the accessibility tree is sparse or semantically ambiguous.
- XcodeBuildMCP `bytes` counts the UTF-8 size of the compact JSON serialization of each JSON-RPC `result` payload (content blocks plus `structuredContent`/`isError`), excluding the `jsonrpc`/`id` transport envelope — the fair MCP equivalent of captured stdout/stderr. `content_text_bytes` records the rendered text blocks alone for a stricter reading.
- `tool_catalog_bytes` is the compact JSON size of the MCP `tools/list` result (tool names, descriptions, and input schemas). It is charged once per scenario in `tokens_estimated` for MCP tools, exactly like the skill file; CLI tools carry no tool catalog, so it is 0 for rs1 and axe.
- XcodeBuildMCP server startup, `tools/list`, and `session_set_defaults` (pointing the session at the benchmark simulator) are uncounted harness plumbing, mirroring the free `--udid` flags of the CLI tools.
- Before each XcodeBuildMCP scenario the harness polls `snapshot_ui` (uncounted, charged to `setup_elapsed_ms`) until the simulator's accessibility bridge answers; the orientation reset after A8 leaves it unresponsive for tens of seconds, which is environment recovery rather than agent work.
