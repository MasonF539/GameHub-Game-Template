# GameHub Game Package Template

This private workspace is the default starting point for a new, independently
versioned GameHub game. It is a complete working score-race example, not a
second game enabled in this GameHub installation.

GameHub supplies the page shell, lobby, room membership, networking,
spectators, shared settings, and mounting lifecycle. The package owns its
authoritative rules and state, public viewer state, browser markup and styles,
game actions, game-specific assets, and tests. It does not need its own
`index.html` or Socket.IO connection.

## Game design

Fill in [docs/design.md](docs/design.md) before replacing the starter game.
Replace its square-bracketed placeholders, including the brackets, with your
answers. Longer placeholders explain what to describe; italic group notes can
be removed after completing their fields. The
document follows Egyptian War's game-focused structure: overview, mechanics,
information visibility, settings, offline behavior, scores, layout, and pacing.
Fill in [docs/implementation.md](docs/implementation.md) as technical decisions
are made. It provides bracketed prompts for source responsibilities, internal
state, actions, timers, reconnects, SDK services, cleanup, and verification.
The final playtest section of the design document is optional; detailed
playtest results belong in separate notes.
Keep it current as the game is implemented; distinguish intended behavior from
verified features. Both documents are copied with this template and included
in the package's `docs` directory when packed.

## Create a game

1. Copy this directory into a new repository without its `.git` directory or
   generated `dist`, `dist-test`, and `node_modules` directories.
2. Replace `@masonf539/game-package-template`, `starter-game`, `Starter Game`,
   and the example descriptions with the real package and game identity.
3. Change both the package version and `packageVersion` in
   `src/definition.ts`; the included test prevents them from drifting apart.
4. Replace the score-race implementation while keeping the server
   authoritative. Never send hidden state from `getPublicState()`.
5. Keep all browser queries inside `context.root`, namespace every CSS rule,
   and remove listeners, timers, and subscriptions in `destroy()`.
6. Add package-owned preview media and audio when needed. Picker preview paths
   must live below `/games/<game-id>/`.
7. Keep `private: true` until names, metadata, tests, and package contents are
   ready. Remove it only when intentionally publishing.

## Develop and verify

```powershell
npm install
npm run check
npm test
npm pack --dry-run
```

The example covers:

- a validated manifest, settings, rules, and a named keybind action;
- an authoritative `GameSession` with pause/resume and completion;
- viewer-safe state for players and spectators;
- scoped markup, styles, and a browser module using GameHub services;
- server-rule, lifecycle, and package-version tests.

## Install into GameHub

After publishing an exact version:

```powershell
npm install --save-exact @your-scope/your-game@1.0.0
```

Then add the package name to `gamehub.config.json`. GameHub validates the
manifest and declared files during startup and its Docker package check.


## Starter lifecycle and SDK compatibility

The placeholder score race preserves points when reconnecting changes a player's
socket ID and rejects scoring from disconnected members. Its browser client
ignores action replies after unmount and disables the reused action button until
the first state snapshot arrives. Server and browser regression tests cover these
cases. Disposed sessions cannot advertise scoring or accept pause/resume.
These checks verify the starter implementation, not planned game rules.

The SDK is a compatible peer dependency, so an installed game shares GameHub's
SDK instead of installing its own runtime copy. SDK 1.0.1 remains pinned as a
development dependency for standalone type checks and tests. The peer range also
accepts GameHub's current 1.1.0 prerelease; newer optional services must be checked
before use.
