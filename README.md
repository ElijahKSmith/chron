# chron

Tracking for your video game resets

## Table of Contents

- [What is chron?](#what-is-chron)
- [Installation guide](#installation-guide)
- [How to support the project](#how-to-support-the-project)

## What is chron?

chron is a tool to help you track your resets across multiple video games.

A reset is the server-side time that activities in a game are either completable or can reward you again. Most games with these types of activities will typically follow a daily and weekly reset system, for example login rewards or raid bosses.

Resets are not standardized across games and may differ heavily depending on a variety of factors such as the server region and content release schedule. The problem is, it can be difficult to track what you've already done before the next reset occurs, especially if you play several games.

Enter chron, the solution to that problem. chron allows you to input your tasks and track their completion status, which will reset at that game's specified reset intervals. Gone are the days of forgetting your dailies!

## Installation guide

You can download a prebuilt installer for chron on the [releases page](https://github.com/ElijahKSmith/chron/releases) or build it from source yourself.

### Building from source

1. Install the prerequisites:
   1. [NodeJS 20](https://nodejs.org/en/download/)
   2. [Tauri 2.0](https://tauri.app/start/prerequisites/)
2. Clone the repository. Change directory into the repository root.
3. Install the dependencies:

```bash
npm install
```

Your build target may have additional dependencies not included in this repository. Check out the specific requirements on the [Tauri docs](https://tauri.app/distribute/).

4. Build the application:

```bash
npm run tauri build
```

## How to support the project

If you like chron, consider starring the repo and sharing it with your friends!

If you want to contribute to chron, please review the [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md) before making a pull request.
