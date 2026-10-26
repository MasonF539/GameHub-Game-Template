import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import type {
  GameCompletion,
  GameEvent,
  GameMember,
  GameSessionContext
} from "@masonf539/game-sdk";
import { validateGamePluginManifest } from "@masonf539/game-sdk";
import { packageVersion, starterGameManifest } from "./definition.js";
import { StarterGameSession } from "./session.js";

const members: GameMember[] = [
  {
    id: "player-1",
    name: "Player One",
    avatar: "🐢",
    isConnected: true,
    role: "player"
  },
  {
    id: "player-2",
    name: "Player Two",
    avatar: "🐧",
    isConnected: true,
    role: "player"
  },
  {
    id: "viewer-1",
    name: "Viewer",
    avatar: "🐨",
    isConnected: true,
    role: "spectator"
  }
];

function createHarness(targetScore = 3): {
  session: StarterGameSession;
  events: GameEvent[];
  completions: GameCompletion[];
  broadcasts: () => number;
  members: GameMember[];
} {
  const currentMembers = members.map(member => ({ ...member }));
  const events: GameEvent[] = [];
  const completions: GameCompletion[] = [];
  let broadcastCount = 0;
  const context: GameSessionContext = {
    roomCode: "ABC123",
    members: () => currentMembers,
    broadcastState: () => { broadcastCount += 1; },
    emitEvent: (event) => { events.push(event); },
    finish: (completion) => { completions.push(completion); },
    now: () => 0,
    randomInteger: () => 0
  };
  return {
    session: new StarterGameSession(context, { targetScore }),
    events,
    completions,
    members: currentMembers,
    broadcasts: () => broadcastCount
  };
}

test("keeps the package and manifest versions synchronized", () => {
  const packageJson = JSON.parse(readFileSync(
    path.join(__dirname, "..", "package.json"),
    "utf8"
  )) as { version: string };
  assert.equal(packageVersion, packageJson.version);
  assert.equal(starterGameManifest.packageVersion, packageJson.version);
  assert.doesNotThrow(() => validateGamePluginManifest(starterGameManifest));
});

test("scores authoritative actions and completes at the configured target", () => {
  const { session, events, completions, broadcasts } = createHarness();

  assert.equal(
    session.handleAction("viewer-1", { type: "score-point" }).success,
    false
  );
  assert.equal(
    session.handleAction("player-1", { type: "unknown" }).success,
    false
  );
  for (let index = 0; index < 3; index += 1) {
    assert.equal(
      session.handleAction("player-1", { type: "score-point" }).success,
      true
    );
  }

  assert.equal(events.length, 3);
  assert.equal(broadcasts(), 3);
  assert.deepEqual(completions, [{
    winnerId: "player-1",
    reason: "Player One reached 3 points."
  }]);
  const playerState = session.getPublicState({
    memberId: "player-1",
    role: "player"
  });
  const spectatorState = session.getPublicState({
    memberId: "viewer-1",
    role: "spectator"
  });
  assert.equal(playerState.winnerId, "player-1");
  assert.equal(playerState.canScore, false);
  assert.equal(spectatorState.canScore, false);
});

test("supports the shared pause lifecycle", () => {
  const { session } = createHarness(10);
  assert.equal(session.pause().success, true);
  assert.equal(session.getLifecycleState().isPaused, true);
  assert.equal(
    session.handleAction("player-1", { type: "score-point" }).success,
    false
  );
  assert.equal(session.resume().success, true);
  assert.equal(session.getLifecycleState().isPaused, false);
});

test("reconnecting with a new id preserves points and retires the old id", () => {
  const { session, members } = createHarness(10);
  assert.equal(session.handleAction("player-1", { type: "score-point" }).success, true);
  const member = members.find(member => member.id === "player-1")!;
  member.isConnected = false;
  session.memberDisconnected();
  member.id = "returned-player";
  member.isConnected = true;
  session.memberReconnected("returned-player", "player-1");
  const state = session.getPublicState({ memberId: member.id, role: "player" });
  assert.equal(state.scores.find(player => player.id === member.id)?.score, 1);
  assert.equal(session.handleAction("player-1", { type: "score-point" }).success, false);
  assert.equal(session.handleAction(member.id, { type: "score-point" }).success, true);
  session.memberReconnected(member.id);
  assert.equal(session.getPublicState({ memberId: member.id, role: "player" })
    .scores.find(player => player.id === member.id)?.score, 2);
});

test("disconnected players cannot score", () => {
  const { session, members, events } = createHarness();
  members.find(member => member.id === "player-1")!.isConnected = false;
  assert.equal(session.getPublicState({ memberId: "player-1", role: "player" }).canScore, false);
  assert.equal(session.handleAction("player-1", { type: "score-point" }).success, false);
  assert.equal(events.length, 0);
});

test("disposed sessions cannot advertise scoring or change pause state", () => {
  const { session, broadcasts } = createHarness();
  session.dispose();
  const before = broadcasts();
  assert.equal(session.getPublicState({ memberId: "player-1", role: "player" }).canScore, false);
  assert.equal(session.pause().success, false);
  assert.equal(session.resume().success, false);
  assert.equal(broadcasts(), before);
});
