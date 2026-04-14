# RocketSim Agent Skill

RocketSim enhances the iOS Simulator with powerful developer tooling for testing, debugging, captures, accessibility, app actions, and more.

This repository also ships the public `Agent-Skill`, a lightweight discovery skill for AI coding agents. Its job is simple: locate a valid RocketSim installation on disk, resolve the bundled in-app skill, and hand off simulator interaction to the RocketSim CLI that ships with the installed app.

## How It Works

The public skill in this repository stays intentionally small and stable:

- `Agent-Skill/SKILL.md` discovers a valid RocketSim app bundle.
- It resolves the bundled in-app skill and CLI from the installed app.
- The bundled skill contains the version-matched CLI guidance for interacting with the simulator.

This split keeps the public discovery layer easy to maintain while letting the installed RocketSim app define the exact simulator automation capabilities for that version.

## Install The Public Skill

Clone this repository and symlink the public skill into your agent skills directory:

```bash
git clone --depth 1 https://github.com/AvdLee/RocketSimApp.git ~/.rocketsim-skill
mkdir -p .cursor/skills
ln -s ~/.rocketsim-skill/Agent-Skill .cursor/skills/rocketsim
```

Once installed, agents can use the skill to discover RocketSim and delegate simulator interaction to the bundled CLI.

## Learn More

If you want to learn more about RocketSim itself, use the canonical product resources:

- [RocketSim website](https://www.rocketsim.app)
- [RocketSim documentation](https://www.rocketsim.app/docs)
- [RocketSim on the Mac App Store](https://apps.apple.com/us/app/rocketsim-for-xcode-simulator/id1504940162)

## Support And Feedback

- Open a GitHub issue for bugs or feature requests related to RocketSim or this public skill.
- Use the documentation site for feature guides and setup help.

RocketSim is developed by [Antoine van der Lee](https://www.avanderlee.com) and built by SwiftLee.
