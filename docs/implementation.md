# [Game Name] Implementation Notes

Use this document for technical decisions supporting [the game design](design.md).
Replace each whole square-bracketed prompt, including the brackets, with your
answer. Fill sections in as implementation decisions are made, and use "Not
needed" where appropriate. Keep planned work distinct from implemented behavior;
the template's starter example is not an implementation of your new game.

Shared GameHub procedures belong in the platform architecture guide. Record
only the services and constraints that affect this game's implementation here.

## Implementation scope

[Describe what is implemented, what is planned, and which version or working
checkout these notes cover. Identify any unpublished changes.]

## Source map

The template starts with these files; update this map as the code changes.

| Responsibility | Source |
| --- | --- |
| Identity, rules, settings, keybinds, and manifest | [src/definition.ts](../src/definition.ts) |
| Authoritative session, actions, state, and lifecycle | [src/session.ts](../src/session.ts) |
| Package exports and plugin registration | [src/index.ts](../src/index.ts) |
| Browser controller and rendering | [public/client.js](../public/client.js) |
| Game markup | [public/template.html](../public/template.html) |
| Game styles | [public/style.css](../public/style.css) |
| Server behavior tests | [src/session.test.ts](../src/session.test.ts) |

[Describe additional files, extracted modules, assets, or tests and the
responsibility of each.]

## Authoritative state and phases

[Describe the server's state fields and invariants, including resources,
ownership, turn order, phases, pending decisions, and completion state.]

[Explain how actions move between phases and how invalid transitions are
prevented. Separate presentation-only animations from authoritative transitions.]

## Viewer-safe state and events

[Describe what getPublicState returns for an active player, another player,
an eliminated player, and a spectator. Identify fields that must never be sent
to an unauthorized viewer.]

[Describe game events, their payloads and intended viewers, and when they are
emitted relative to state updates. Record any private-delivery requirement that
needs additional platform support.]

## Actions and validation

Duplicate the following action block for each action the game accepts.

### Action: [Action ID]

[Describe the payload and validate its types, allowed values, and required fields.]

[Explain membership, role, turn, phase, resource, cooldown, pause, and completion
checks that apply before the action changes state.]

[Describe state changes, emitted events, broadcasts, and the success or failure
reply. Explain handling for repeated, stale, or simultaneous requests.]

## Timers, pauses, and synchronization

[Record authoritative timer durations, their configuration or source constants,
and when each timer starts, pauses, resumes, expires, or is cancelled.]

[Describe concurrent-action arbitration, deadline comparisons, ordering, and any
version counters used to reject or forgive stale actions. Identify which clocks
are trusted and how clients display remaining time.]

[Explain animation/input locks and how presentation timing stays consistent
with authoritative decisions, including reduced-motion behavior.]

## Reconnects, removal, and ownership changes

[Describe how returning players are matched to existing state, including remapping
changed socket IDs and restoring their view without changing hidden resources.]

[Explain how offline timers, autoplay, voluntary departure, and removal affect
pending actions, turn ownership, and resources. Include several missing players.]

[Describe which game-specific permissions and controls refresh when hosting
changes, and how the match continues without remounting or resetting state.]

## Browser lifecycle and cleanup

[Describe how the client mounts inside context.root, renders snapshots and events,
and subscribes to input or other platform services. Identify game-owned DOM state.]

[Explain cleanup of listeners, subscriptions, observers, timers, animations, and
pending work on unmount or failed mount. Describe how late async replies are
prevented from touching a destroyed or replacement game instance.]

## SDK and platform integration

[Record the SDK version or compatible range the game targets and which platform
services it uses. Check optional capabilities against that version before relying
on them.]

[Describe any scoreboard column IDs and authoritative increment conditions,
settings validation, display preference handling, input action IDs, or audio
registration that this game implements. Use "Not needed" for unused services.]

[Record missing platform support, compatibility assumptions, and any proposed
SDK changes. Do not assume private events, isolated spectator chat, or a shared
turn-timer implementation is available.]

## Verification

The template provides `npm run check`, `npm test`, and `npm run build`.
Use `npm pack --dry-run` to inspect package contents before release.

[Describe tests for rules, invalid actions, information visibility, timers,
reconnects, ownership changes, cleanup, and multiplayer integration. Identify
which source files hold those tests.]

[Record commands actually run, their results, and checks still pending. Keep
manual gameplay observations in separate playtest notes.]

[Explain how to test this package in GameHub before publication, verify a clean
installation, and check that runtime code and declared assets are packaged.]

## Known limitations and unresolved decisions

[Describe implementation limitations, unsupported scenarios, unresolved choices,
and the next technical work needed. Do not mark a requirement complete solely
because it is documented here.]
