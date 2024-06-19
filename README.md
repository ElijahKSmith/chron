# chron

Tracking for video game resets

## Table of Contents

- [What is chron?](#what-is-chron)
- [Installation guide](#installation-guide)
- [How to support the project](#how-to-support-the-project)

## What is chron?

chron is a tool to help you track your resets in different video games.

A reset is the designated date and time that an activity in a game is either doable again or allowed to reward you again. Most games with these types of activities will typically follow a daily and weekly reset system, for example login rewards or raid bosses.

Resets are not standardized across games and differ depending on a variety of factors such as the server region and content release schedule. The problem is, it can be difficult to track what you've already done before the next reset occurs, especially if you play several games.

Enter chron, a solution to that problem. chron allows you to input your tasks and track their completion status, which will reset at that game's specified reset intervals. Gone are the days of forgetting your dailies!

## Installation guide

Prior to release 1.0, chron must be built from source.

### Building from source

1. Install the prerequisites:
   1. [NodeJS](https://nodejs.org/en/download/)
   2. [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)
2. Clone the repository. Change directory into the repository root.
3. Install the dependencies:

```bash
npm install
```

4. Build the application:

```bash
npm run tauri build
```

## How to support the project

If you like chron, consider starring the repo and sharing it with your friends!

If you want to contribute to chron, please review the [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md) before making a pull request.
