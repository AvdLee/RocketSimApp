Tokens: characters / 4 (no ANTHROPIC_API_KEY was set). Images: width * height / 750 after scaling to at most 2576 px on the long edge and about 4784 tokens.

| Tool | Mac | Sign-in flow (median) | Flow tokens | Flow ok | Read median | Read p90 | Read tokens | Tap median | Tap p90 | Tap reports change | Type median | Tool list tokens |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RocketSim 17.0.0 (341) 17.0.0 pre-release |  | 2.74 s | 161 | 10/10 | 34 ms | 47 ms | 51 | 355 ms | 368 ms | 20/20 | 1.49 s | 0 |
| RocketSim 17.0.0 (341) 17.0.0 pre-release |  | 2.77 s | 161 | 10/10 | 32 ms | 46 ms | 51 | 348 ms | 368 ms | 20/20 | 1.45 s | 0 |
| simulator-use 0.15.3 |  | 4.26 s | 194 | 10/10 | 378 ms | 703 ms | 72 | 711 ms | 729 ms | 20/20 | 1.29 s | 2,443 |

Batched flow (where the tool has a batch or sequence call):

| Tool | Batched flow (median) | Tokens | ok |
|---|---|---|---|
| RocketSim (Mac null) | 2.47 s | 160 | 10/10 |
| RocketSim (Mac null) | 2.48 s | 160 | 10/10 |
| simulator-use (Mac null) | 3.58 s | 179 | 10/10 |

Failures:

