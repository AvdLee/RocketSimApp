import type { ImageMetadata } from "astro";

import cliAgentSettings from "@/assets/tutorials/cli-agent-settings.png";
import flowsTourAnnotated from "@/assets/tutorials/flows-tour-annotated.webp";

/**
 * Tutorials for agentic development with RocketSim. They are written for the
 * developer who prompts an agent, not for someone typing CLI commands: every
 * step says what to ask, and shows what the agent runs. Text fields are
 * inline Markdown. Keep commands and claims in step with the CLI and
 * Navigation Flows docs, and never invent command output: show real output
 * from the docs, or describe what the reader should see.
 */

export type TutorialTrack = "agents" | "flows";

type TutorialBlock =
  | {
      type: "terminal";
      label: string;
      commands: { note?: string; command: string }[];
    }
  | { type: "snippet"; label: string; text: string }
  | { type: "image"; image: ImageMetadata; alt: string }
  | { type: "note"; text: string }
  // The simulator-use benchmark figures, with where they come from.
  | { type: "benchmark" };

interface TutorialStep {
  title: string;
  text: string;
  blocks?: TutorialBlock[];
  /** What the reader should see once the step worked. */
  result?: string;
}

export interface Tutorial {
  slug: string;
  track: TutorialTrack;
  /** Title of the card and the h1. */
  title: string;
  /** SEO title, without the site suffix. Defaults to `title`. */
  metaTitle?: string;
  description: string;
  /** The answer-first opening paragraph. Names RocketSim. */
  intro: string;
  minutes: number;
  level: "Beginner" | "Intermediate";
  steps: TutorialStep[];
  /** The outcome shown on the card. */
  summary: string;
}

// AI Fundamentals explains the concepts behind the tutorials, such as Agent
// Skills, AGENTS.md, and context. The UTM tags keep the referrals attributable.
export const aiFundamentals = (article: string) =>
  `https://aifundamentals.dev/articles/${article}/?utm_source=rocketsim&utm_medium=referral&utm_campaign=tutorials`;

export const tracks: Record<
  TutorialTrack,
  {
    id: TutorialTrack;
    name: string;
    // A short name for tight spaces, such as the learning path.
    shortName: string;
    color: string;
    version?: string;
    eyebrow: string;
    title: string;
    intro: string;
  }
> = {
  agents: {
    id: "agents",
    name: "Agentic Development",
    shortName: "Agents",
    color: "var(--color-chapter-network)",
    eyebrow: "Agentic development",
    title: "Give your agent hands.",
    intro:
      "Set RocketSim up once, and your AI coding agent navigates the iOS Simulator by itself.",
  },
  flows: {
    id: "flows",
    name: "Flows",
    shortName: "Flows",
    color: "var(--color-chapter-agents)",
    version: "RocketSim 17",
    eyebrow: "Flows",
    title: "Walk it once. Replay it forever.",
    intro:
      "Your agent saves a Simulator path as a few lines of text, replays it with one command, and keeps it healthy as your UI changes.",
  },
};

export const tutorials: Tutorial[] = [
  {
    slug: "set-up-rocketsim-for-your-agent",
    track: "agents",
    title: "Set up RocketSim for your agent",
    metaTitle: "Set Up RocketSim for Your AI Coding Agent",
    description:
      "Install the RocketSim CLI and Agent Skill once, so Cursor, Codex, Claude Code, or Xcode can navigate the iOS Simulator by themselves.",
    intro:
      "RocketSim gives your AI coding agent the fastest way to navigate the iOS Simulator. You install the command line tool and the Agent Skill once from RocketSim's settings, and your agent runs every command for you.",
    minutes: 3,
    level: "Beginner",
    summary:
      "Install the CLI and the Agent Skill once. Your agent does the rest.",
    steps: [
      {
        title: "Open the CLI & Agent settings",
        text: "In RocketSim, open **Settings → CLI & Agent**. The command line tool and the Agent Skill are installed from this one screen.",
        blocks: [
          {
            type: "image",
            image: cliAgentSettings,
            alt: "RocketSim's CLI & Agent settings with the Command Line Tool and Agent Skill installers",
          },
        ],
      },
      {
        title: "Install the command line tool",
        text: "In **Command Line Tool**, click **Install Command Line Tool**. Keep the default folder if it is on your `PATH`, or pick one such as `/opt/homebrew/bin` or `/usr/local/bin`, then confirm. This is the command your agent runs. You do not need to learn it.",
        blocks: [
          {
            type: "note",
            text: "RocketSim creates a `rocketsim` symlink. The real executable stays inside `RocketSim.app`, so every App Store update keeps it current.",
          },
        ],
      },
      {
        title: "Install the Agent Skill",
        text: "An **Agent Skill** is a folder of instructions that an agent loads when a task needs it. RocketSim's skill teaches your agent the commands, when to read the screen, and how to recover when a screen changes. Choose **General Agents** for Cursor, Codex, and Claude Code, or **Agentic Coding in Xcode** for Xcode's built-in assistant, then click **Install**.",
        blocks: [
          {
            type: "note",
            text: `New to skills? [How to write an AGENTS.md](${aiFundamentals("how-to-write-agents-md")}) on AI Fundamentals explains how project instructions and skills work together. Restart your coding tool if it does not discover the skill right away. Like the command, the skill is a symlink into the app, so it updates with RocketSim.`,
          },
        ],
      },
      {
        title: "Ask your agent to check the setup",
        text: "Open a new chat in your coding tool and ask it to run the health check. This confirms that the agent finds the command, the RocketSim app, and a booted Simulator.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Run rocketsim doctor and tell me if RocketSim is ready for iOS Simulator navigation.",
          },
          {
            type: "terminal",
            label: "The health check your agent runs",
            commands: [{ command: "rocketsim doctor" }],
          },
        ],
        result:
          "A result for every check. When something is missing, `doctor` names it and prints the command that fixes it, and your agent can run that command for you.",
      },
    ],
  },
  {
    slug: "agents-md-rocketsim-skill",
    track: "agents",
    title: "Tell your agent to use RocketSim",
    metaTitle: "Tell Agents to Use RocketSim in AGENTS.md",
    description:
      "Update your AGENTS.md so every coding agent uses the RocketSim Agent Skill for iOS Simulator navigation, instead of guessing from screenshots.",
    intro:
      "Add a few lines to your AGENTS.md, and every coding agent in your project uses the RocketSim Agent Skill for iOS Simulator navigation. The skill is available to your agent, and AGENTS.md makes it the rule.",
    minutes: 4,
    level: "Beginner",
    summary:
      "Add a short rule to AGENTS.md so agents always reach for RocketSim.",
    steps: [
      {
        title: "Know what AGENTS.md is for",
        text: `AGENTS.md is a Markdown file in your repository that gives agents project instructions. Most agents load it at the start of every session, so it is where a decision such as "use RocketSim for the Simulator" belongs. The skill carries the detail, so the rule itself stays short. [How to write an AGENTS.md that agents follow](${aiFundamentals("how-to-write-agents-md")}) covers what belongs in the file and what to leave out.`,
        blocks: [
          {
            type: "note",
            text: "Codex and Cursor read `AGENTS.md`. Claude Code reads `CLAUDE.md`, so add the same rule there if your project has one.",
          },
        ],
      },
      {
        title: "Ask your agent to add the rule",
        text: "The quickest way is to let the agent write it. Keep the request specific, and ask for a short section.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Add a short iOS Simulator section to AGENTS.md. Tell agents to use the RocketSim Agent Skill for all Simulator navigation and UI checks. Keep it under five lines.",
          },
        ],
      },
      {
        title: "Review what it wrote",
        text: "Check that the section says three things: use the RocketSim skill, do not tap from screenshots when RocketSim is available, and what to do when the command is missing. Edit it by hand if you prefer your own wording.",
        blocks: [
          {
            type: "snippet",
            label: "A section for AGENTS.md",
            text: "## iOS Simulator\n- Use the RocketSim Agent Skill for all iOS Simulator navigation and UI checks: reading the screen, tapping, typing, and screenshots.\n- Do not guess coordinates from screenshots when RocketSim is available.\n- If the `rocketsim` command is not found, run `rocketsim doctor` and report what it says.",
          },
          {
            type: "note",
            text: "Using Flows with RocketSim 17? Add one more line: save the paths you navigate as RocketSim flows, and replay them instead of navigating again.",
          },
        ],
      },
      {
        title: "Start a fresh session and test it",
        text: "Agents read AGENTS.md when a session starts, so open a new chat. Ask for a task that needs the Simulator, and watch which tool the agent reaches for.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Open Settings in the app and tell me which screen you land on.",
          },
        ],
        result:
          "The agent loads the RocketSim skill and runs `rocketsim` commands. If it takes screenshots instead, the rule is missing, or the session started before you saved the file.",
      },
    ],
  },
  {
    slug: "let-your-agent-use-the-simulator",
    track: "agents",
    title: "Let your agent drive the Simulator",
    metaTitle: "Let Your AI Agent Drive the iOS Simulator",
    description:
      "Give your AI coding agent a first Simulator task, see the read, act, and verify loop it runs with RocketSim, and ask it for proof.",
    intro:
      "With RocketSim set up, your AI coding agent reads the iOS Simulator screen, taps by label, and verifies each result without screenshots or guessing. You describe the outcome, and the agent runs the loop.",
    minutes: 5,
    level: "Beginner",
    summary: "Give your agent a first task and see the loop it runs.",
    steps: [
      {
        title: "Run your app",
        text: "Ask your agent to build and run your app with your usual tooling, or run it from Xcode yourself. RocketSim does not build or launch apps. It navigates the Simulator UI that is already on screen.",
      },
      {
        title: "Give it a task",
        text: "Describe the outcome, and mention RocketSim by name. That is how the agent knows to use the skill, unless your AGENTS.md already says so.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Use RocketSim to sign in with the test account, open Settings, and change the display name. Tell me what you see on each screen.",
          },
          { type: "benchmark" },
        ],
        result:
          "The agent reads the screen, taps by label, and verifies each result. You can watch the Simulator follow along.",
      },
      {
        title: "See the loop it runs",
        text: "Every run follows the same three moves. The agent reads the screen as a short list of elements, acts on one by its label, and verifies the outcome. It never has to type coordinates or look at pixels.",
        blocks: [
          {
            type: "terminal",
            label: "The read, act, verify loop",
            commands: [
              { note: "Read", command: "rocketsim elements --agent" },
              {
                note: "Act",
                command: 'rocketsim interact tap --label "Continue"',
              },
              { note: "Verify", command: "rocketsim wait screen-changed" },
            ],
          },
        ],
        result:
          "After every action the agent gets the new screen and only what changed on it, such as text that appeared or an error message.",
      },
      {
        title: "Ask for proof",
        text: `A navigation run is a validation loop: a check the agent runs on its own work, so you can trust the result. Ask for evidence, such as a screenshot, instead of taking "it works" at its word. [Validation loops](${aiFundamentals("validation-loops-for-agent-written-code")}) explains how to wire this into any task.`,
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Capture a screenshot of the Settings screen after the change, and describe what it shows.",
          },
        ],
      },
      {
        title: "When it gets stuck",
        text: "Ask the agent to run `rocketsim doctor`. Agent shells can use a different `PATH` than Terminal, so the skill also knows to check `/opt/homebrew/bin`, `/usr/local/bin`, and `~/.local/bin` before it reports the command as missing.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "RocketSim does not respond. Run rocketsim doctor and fix what it reports.",
          },
        ],
      },
    ],
  },
  {
    slug: "save-your-first-flow",
    track: "flows",
    title: "Save your first flow",
    metaTitle: "Save Your First iOS Simulator Flow",
    description:
      "Have your agent save a repeatable iOS Simulator path as a RocketSim flow, replay it with one command, and review the run on the live flow page.",
    intro:
      "A RocketSim flow saves a path through your app as a few lines of text, so your agent replays it with one command instead of rediscovering the same taps every task. Your agent walks the path once, saves it, and replays it whenever you need it.",
    minutes: 5,
    level: "Beginner",
    summary: "Your agent walks a path once, saves it, and replays it.",
    steps: [
      {
        title: "Ask your agent to walk the path",
        text: "Describe the path, and mention flows. Naming flows in the prompt makes the agent record and replay them more eagerly.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Use RocketSim flows to sign in and open Settings. Save each part as a flow so we can replay it later, and share the review link when you are done.",
          },
          { type: "benchmark" },
        ],
      },
      {
        title: "The agent saves the steps",
        text: "After a successful run, your agent saves the last steps under a name and a one-line summary. Without `--last`, RocketSim saves the last five successful steps.",
        blocks: [
          {
            type: "terminal",
            label: "Saving a flow",
            commands: [
              {
                command:
                  'rocketsim flow save --name login --about "Sign in with the test account" --last 3',
              },
            ],
          },
        ],
      },
      {
        title: "Read what it saved",
        text: "RocketSim writes the shortest selector for each tap, adds an `expect` checkpoint after every screen change, and never stores a secret. Only a placeholder is saved. You rarely open this file, but it helps to know what your agent replays.",
        blocks: [
          {
            type: "snippet",
            label: "A saved login flow",
            text: "name: login\nabout: Sign in with the test account\nparam: user = $TEST_USER\nparam: password secret = $TEST_PASSWORD\ntap --identifier login.email\ntype '{user}'\ntap --identifier login.password\ntype '{password}'\ntap --label 'Sign In'\nexpect --label 'Home'",
          },
        ],
      },
      {
        title: "Replay it in any task",
        text: "From now on, ask for the flow by name. The agent replays the whole path with one command instead of reading and tapping screen by screen.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Replay the login flow with RocketSim, then check that the Home screen shows the new badge.",
          },
          {
            type: "terminal",
            label: "Listing and replaying a flow",
            commands: [
              {
                note: "What is saved for this app?",
                command: "rocketsim flow list",
              },
              { note: "Replay it", command: "rocketsim flow login" },
            ],
          },
        ],
        result:
          "A status and a step count. When a step fails, the reply names the step, the reason, and the nearest element.",
      },
      {
        title: "Review the run",
        text: "Ask for the review link. It opens the flow as a board: each screen once, with arrows from the tapped element to the next screen. Keep the tab open while your agent works. It refreshes by itself.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Share the RocketSim review link for the login flow.",
          },
          {
            type: "terminal",
            label: "Opening the flow review page",
            commands: [{ command: "rocketsim flow open login" }],
          },
          {
            type: "image",
            image: flowsTourAnnotated,
            alt: "A RocketSim flow on the review page, with accessibility overlays and arrows between screens",
          },
        ],
      },
    ],
  },
  {
    slug: "flow-secrets-and-prerequisites",
    track: "flows",
    title: "Use secrets and prerequisites in flows",
    metaTitle: "Flow Secrets and Prerequisites in RocketSim",
    description:
      "Keep passwords out of flow files and chain flows with prerequisites, so your agent signs in only when it is needed.",
    intro:
      "RocketSim flows take parameters, keep secrets out of every file and log, and start with other flows as prerequisites. One login flow then serves every flow that needs a signed-in app, without your agent signing in twice.",
    minutes: 6,
    level: "Intermediate",
    summary:
      "Keep secrets out of files and chain flows without signing in twice.",
    steps: [
      {
        title: "Ask for a secret parameter",
        text: "A parameter lives in the flow header. A secret reads from an environment variable at run time, and its value is never written to the flow, a log, or a failure reply.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Save the login as a flow. Make the email a parameter and the password a secret parameter read from $TEST_PASSWORD.",
          },
          {
            type: "snippet",
            label: "Parameter declarations",
            text: "param: user                             # required\nparam: user = default                   # literal default\nparam: user = $ENV_VAR                  # default from the environment\nparam: password secret = $TEST_PASSWORD # secret, never persisted",
          },
        ],
        result:
          "Steps use `{name}`, such as `type '{password}'`. RocketSim resolves each value from `--param`, then the environment, then the default.",
      },
      {
        title: "Set the values in your shell",
        text: "This is the one step you do yourself. Export the values where your agent runs, so a secret never lands in a transcript. The agent then passes them by shell expansion.",
        blocks: [
          {
            type: "terminal",
            label: "Setting values and replaying a flow with parameters",
            commands: [
              { note: "You set these", command: "export TEST_USER=alice" },
              {
                note: "The agent replays with them",
                command:
                  "rocketsim flow login --param user=$TEST_USER --param password=$TEST_PASSWORD",
              },
            ],
          },
        ],
      },
      {
        title: "Chain flows with a prerequisite",
        text: "Leading `flow` lines before the first real step are prerequisites. Ask your agent to build the next flow on top of the login.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Save a flow that opens the Settings screen. It should start with the login flow.",
          },
          {
            type: "snippet",
            label: "A flow with a prerequisite",
            text: "name: open-settings\nabout: Open the settings screen from home\nflow login\ntap --label 'Settings'\nexpect --identifier settings.title",
          },
        ],
      },
      {
        title: "Replay without signing in twice",
        text: "Ask for the flow. RocketSim skips the prerequisite when that flow's final check already holds, such as being on the home screen after sign-in.",
        blocks: [
          {
            type: "terminal",
            label: "Replaying a flow with a prerequisite",
            commands: [{ command: "rocketsim flow open-settings" }],
          },
        ],
        result:
          "Login runs only when you are signed out. Any `flow` line after the first real step always runs.",
      },
      {
        title: "Share flows with your team",
        text: "Keep the `.rsflow` files in your repository, and tell your agent to load them in a fresh checkout or a new worktree. The sync skips flows that did not change. Put the instruction in your AGENTS.md, so every agent follows it.",
        blocks: [
          {
            type: "snippet",
            label: "A line for AGENTS.md",
            text: "- At the start of a task, run `rocketsim flow sync --dir flows` to load the project's flows into RocketSim.",
          },
        ],
      },
    ],
  },
  {
    slug: "fix-a-stale-flow",
    track: "flows",
    title: "Keep flows working when your UI changes",
    metaTitle: "Fix a Stale RocketSim Flow When Your UI Changes",
    description:
      "Have your agent catch flow drift with rocketsim flow verify, repair a stale flow with flow fix, and resume after an interruption.",
    intro:
      "When your UI changes, a RocketSim flow stops at the step that no longer matches and tells your agent why. The agent finishes the step, runs `flow fix`, and the next run passes. You can also verify flows before a task starts, to catch drift early.",
    minutes: 5,
    level: "Intermediate",
    summary:
      "Catch drift early, repair a stale flow, and resume after a blocker.",
    steps: [
      {
        title: "Verify before you start",
        text: "Ask your agent to replay one flow, or all of them, before a task. A flow that drifted shows up now instead of halfway through the work.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Verify the RocketSim flows for this app before you start, and tell me which ones fail.",
          },
          {
            type: "terminal",
            label: "Verifying flows",
            commands: [
              {
                note: "One flow",
                command: "rocketsim flow verify open-settings",
              },
              {
                note: "Every flow for this app",
                command: "rocketsim flow verify",
              },
            ],
          },
        ],
      },
      {
        title: "Know what the agent sees",
        text: "A failed run stops at the first bad step and returns one compact reply, with the current screen in the same payload. It names the step, the reason, and the closest elements, so the agent continues from the screen it is on instead of restarting the app.",
        result:
          "The flow is marked `(stale)` in the flow list until it is repaired.",
      },
      {
        title: "Tell drift from an interruption",
        text: "Drift means the UI changed. An environmental blocker means something got in the way, such as an alert, the wrong app in front, or a dismissed sheet. When a step lands on a different screen than expected, the failure names the `expected_screen`, so the agent can tell the two apart.",
      },
      {
        title: "Let the agent repair a drifted flow",
        text: "Tell the agent what changed. It navigates the corrected path, then merges its steps into the file. RocketSim can also heal an unambiguous single-element rename by itself, and it saves the fix only if the rest of the run still passes.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "The Settings tab is now called Preferences. Finish the open-settings flow by hand, then fix the flow.",
          },
          {
            type: "terminal",
            label: "Repairing a stale flow",
            commands: [{ command: "rocketsim flow fix open-settings" }],
          },
        ],
      },
      {
        title: "Resume after a blocker",
        text: "For an interruption, clear the blocker and continue from the failing step. Step numbers stay stable when prerequisites are skipped.",
        blocks: [
          {
            type: "snippet",
            label: "Prompt",
            text: "Dismiss the alert, then resume the open-settings flow from step 3.",
          },
          {
            type: "terminal",
            label: "Resuming a flow from a step",
            commands: [
              { command: "rocketsim flow open-settings --from 3" },
              {
                note: "Retry a flow marked stale anyway",
                command: "rocketsim flow open-settings --force",
              },
            ],
          },
        ],
        result: "The flow passes again, and it is no longer marked stale.",
      },
    ],
  },
];

export const tutorialsInTrack = (track: TutorialTrack) =>
  tutorials.filter((tutorial) => tutorial.track === track);

/** The tutorial after this one, across tracks, for the "Up next" card. */
export const nextTutorial = (slug: string) => {
  const index = tutorials.findIndex((tutorial) => tutorial.slug === slug);
  return tutorials[index + 1];
};

export const tutorialPath = (slug: string) => `/tutorials/${slug}/`;
