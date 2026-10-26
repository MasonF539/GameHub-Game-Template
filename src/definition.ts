import {
  gameHubGameApiVersion,
  type GameDefinition,
  type GamePluginManifest
} from "@masonf539/game-sdk";

export const packageVersion = "0.1.0";

export const starterGameDefinition = {
  id: "starter-game",
  name: "Starter Game",
  description: "A small score race demonstrating the complete GameHub package boundary.",
  isPlayable: true,
  chatEnabled: false,
  rules: [
    "Players score points using the Score point action.",
    "The first player to reach the target score wins.",
    "Spectators can follow the score but cannot submit actions."
  ],
  minPlayers: 2,
  maxPlayers: 8,
  settings: [
    {
      type: "number",
      key: "targetScore",
      label: "Target score",
      description: "Points needed to win the game.",
      defaultValue: 5,
      options: [3, 5, 10],
      unit: "points"
    }
  ],
  keybinds: [
    {
      id: "score-point",
      label: "Score point",
      description: "Submit the starter game's primary action.",
      defaultKey: "Space"
    }
  ]
} satisfies GameDefinition;

export const starterGameManifest = {
  apiVersion: gameHubGameApiVersion,
  packageVersion,
  definition: starterGameDefinition,
  client: {
    delivery: "embedded",
    markupPath: "template.html",
    entryPaths: ["client.js"],
    stylePaths: ["style.css"]
  }
} satisfies GamePluginManifest;
