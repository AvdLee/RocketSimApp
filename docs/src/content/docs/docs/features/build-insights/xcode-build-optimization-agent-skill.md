---
title: "Agent Skill"
description: "Use the open-source Xcode Build Optimization Agent Skill alongside RocketSim Build Insights to analyze slow builds, generate optimization plans, and verify improvements over time."
sidebar:
  order: 3
---

RocketSim helps you understand how your builds behave over time. The [Xcode Build Optimization Agent Skill](https://github.com/AvdLee/Xcode-Build-Optimization-Agent-Skill) helps you improve them.

Together, they make a strong workflow:

- Use **RocketSim Build Insights** to monitor clean and incremental build times across days, Xcode versions, and machines
- Use the **agent skill** to investigate why builds are slow and generate a concrete optimization plan
- Use **RocketSim** again afterwards to verify whether your changes actually improved the build loop over time

## What the agent skill offers

The open-source skill package gives AI coding tools a structured workflow for Xcode build optimization. Its orchestrator benchmarks your project, runs specialist analyzers, and produces a plan before applying any changes.

It covers:

- **Clean and incremental build benchmarking**
- **Compile hotspot analysis**
- **Project settings and script phase review**
- **Swift Package Manager dependency analysis**
- **Recommend-first optimization plans**
- **Re-benchmarking after approved fixes**

That makes it especially useful when RocketSim shows a regression and you want help narrowing down the likely cause.

## How it works with RocketSim

RocketSim and the skill solve different parts of the same problem.

### RocketSim Build Insights

RocketSim tells you:

- Whether build times are getting slower or faster
- How clean builds compare to incremental builds
- Which schemes are affected
- How performance changes across Xcode versions, macOS versions, and machines

See [Build Insights](/docs/features/build-insights/build-insights) and [Team Build Insights](/docs/features/build-insights/team-build-insights).

### Xcode Build Optimization Agent Skill

The agent skill helps you answer:

- What changed in the project that might be slowing down builds
- Whether script phases, compiler settings, or package structure are contributing
- Which optimizations are worth trying first
- Whether the approved changes actually improved benchmark results

In short: **RocketSim is your monitor, the agent skill is your optimization assistant.**

## Recommended workflow

1. Use RocketSim Build Insights to spot a slowdown or a consistently slow edit-build-run loop.
2. Run the `xcode-build-orchestrator` skill in your AI coding tool.
3. Review the generated optimization plan and approve the changes you want.
4. Apply the approved fixes and re-benchmark.
5. Keep RocketSim running over the next days or weeks to confirm the improvement holds up in real usage.

This workflow works especially well for teams: RocketSim gives ongoing visibility, while the agent skill gives a repeatable way to investigate and improve build performance when issues show up.

## Quick start

Install the skill package:

```bash
npx skills add https://github.com/avdlee/xcode-build-optimization-agent-skill
```

Then ask your AI coding tool:

```text
Use the /xcode-build-orchestrator skill to analyze build performance and come up with a plan for improvements.
```

The skill benchmarks your project, runs multiple analyzers, and produces an optimization plan before making any project changes.

## When to use which tool

Use **RocketSim** when you want:

- Passive monitoring over time
- Visibility into trends and regressions
- Team-wide comparisons across machines and Xcode versions

Use the **agent skill** when you want:

- A focused optimization session
- A plan for build performance improvements
- Concrete next steps for fixing build bottlenecks

Use both when you want a complete workflow from **detecting a build problem** to **fixing it** and **proving the result**.

## Learn more

- [Xcode Build Optimization Agent Skill on GitHub](https://github.com/AvdLee/Xcode-Build-Optimization-Agent-Skill)
- [Build Insights](/docs/features/build-insights/build-insights)
- [Team Build Insights](/docs/features/build-insights/team-build-insights)

## See Also My Other Skills

- [Swift Concurrency Expert](https://github.com/AvdLee/Swift-Concurrency-Agent-Skill) - Diagnose data races, modernize async code, and improve actor isolation and Sendable usage.
- [SwiftUI Expert](https://github.com/AvdLee/SwiftUI-Agent-Skill) - Improve SwiftUI architecture, state handling, performance, and platform-specific UI patterns.
- [Core Data Expert](https://github.com/AvdLee/Core-Data-Agent-Skill) - Help with Core Data stack setup, fetch performance, migrations, threading, and CloudKit sync.
- [Swift Testing Expert](https://github.com/AvdLee/Swift-Testing-Agent-Skill) - Write and improve Swift Testing suites using `#expect`, traits, parameterized tests, and modern test patterns.

To explore all our Agent Skills, go to [skills.sh](https://skills.sh/?q=avdlee).
