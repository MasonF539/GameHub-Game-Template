import path from "node:path";
import type { GamePluginPackage, GameServerPlugin } from "@masonf539/game-sdk";
import { starterGameManifest } from "./definition.js";
import { StarterGameSession } from "./session.js";

const server = {
  manifest: starterGameManifest,
  createSession(context, settings) {
    return new StarterGameSession(context, settings);
  }
} satisfies GameServerPlugin;

export const gameHubPlugin = {
  manifest: starterGameManifest,
  publicDirectory: path.join(__dirname, "..", "public"),
  server
} satisfies GamePluginPackage;

export { starterGameDefinition, starterGameManifest } from "./definition.js";
export { StarterGameSession, type StarterGamePublicState } from "./session.js";
