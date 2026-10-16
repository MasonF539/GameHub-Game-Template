# GameHub Game Package Template

This private workspace is the default starting point for a new, independently
versioned GameHub game. It is a complete working score-race example, not a
second game enabled in this GameHub installation.

GameHub supplies the page shell, lobby, room membership, networking,
spectators, shared settings, and mounting lifecycle. The package owns its
authoritative rules and state, public viewer state, browser markup and styles,
game actions, game-specific assets, and tests. It does not need its own
`index.html` or Socket.IO connection.

## Create a game

1. Copy this directory into a new repository without its generated `dist`,
   `dist-test`, or `node_modules` directories.
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
