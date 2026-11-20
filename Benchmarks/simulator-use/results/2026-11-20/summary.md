Tokens: characters / 4 (no ANTHROPIC_API_KEY was set). Images: width * height / 750 after scaling to at most 2576 px on the long edge and about 4784 tokens.

| Tool | Mac | Sign-in flow (median) | Flow tokens | Flow ok | Read median | Read p90 | Read tokens | Tap median | Tap p90 | Tap reports change | Type median | Tool list tokens |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RocketSim 17.0.0 (341) 17.0.0 pre-release |  | 3.22 s | 164 | 10/10 | 36 ms | 44 ms | 51 | 397 ms | 421 ms | 20/20 | 1.43 s | 0 |
| RocketSim 17.0.0 (341) 17.0.0 pre-release |  | 3.23 s | 164 | 10/10 | 33 ms | 53 ms | 51 | 403 ms | 432 ms | 20/20 | 1.46 s | 0 |
| simulator-use 0.15.3 |  | 3.37 s | 194 | 10/10 | 222 ms | 250 ms | 72 | 623 ms | 646 ms | 20/20 | 1.09 s | 2,443 |

Batched flow (where the tool has a batch or sequence call):

| Tool | Batched flow (median) | Tokens | ok |
|---|---|---|---|
| RocketSim (Mac null) | 3.17 s | 165 | 10/10 |
| RocketSim (Mac null) | 3.19 s | 165 | 10/10 |
| simulator-use (Mac null) | 2.47 s | 179 | 10/10 |

Failures:

