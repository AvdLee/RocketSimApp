Tokens: characters / 4 (no ANTHROPIC_API_KEY was set). Images: width * height / 750 after scaling to at most 2576 px on the long edge and about 4784 tokens.

| Tool | Mac | Sign-in flow (median) | Flow tokens | Flow ok | Read median | Read p90 | Read tokens | Tap median | Tap p90 | Tap reports change | Type median | Tool list tokens |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| simulator-use 0.15.3 |  | 2.79 s | 194 | 10/10 | 234 ms | 319 ms | 72 | 533 ms | 556 ms | 20/20 | 930 ms | 2,443 |
| RocketSim 16.8.0 (339) 17.0.0 pre-release |  | 3.00 s | 164 | 10/10 | 260 ms | 417 ms | 51 | 489 ms | 513 ms | 20/20 | 1.37 s | 0 |
| RocketSim 16.8.0 (339) 17.0.0 pre-release |  | 3.05 s | 164 | 10/10 | 261 ms | 440 ms | 51 | 497 ms | 518 ms | 20/20 | 1.45 s | 0 |

Batched flow (where the tool has a batch or sequence call):

| Tool | Batched flow (median) | Tokens | ok |
|---|---|---|---|
| simulator-use (Mac null) | 1.90 s | 179 | 10/10 |
| RocketSim (Mac null) | 2.74 s | 165 | 10/10 |
| RocketSim (Mac null) | 2.75 s | 165 | 10/10 |

Failures:

