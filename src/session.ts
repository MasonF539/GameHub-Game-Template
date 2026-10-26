import type {
  GameActionEnvelope,
  GameActionResult,
  GameLifecycleState,
  GameSession,
  GameSessionContext,
  GameSettingValue,
  GameViewer
} from "@masonf539/game-sdk";

type PublicScore = {
  id: string;
  name: string;
  avatar: string;
  isConnected: boolean;
  score: number;
};

export type StarterGamePublicState = {
  targetScore: number;
  scores: PublicScore[];
  winnerId: string | null;
  isPaused: boolean;
  canScore: boolean;
};

export class StarterGameSession implements GameSession {
  readonly #context: GameSessionContext;
  readonly #targetScore: number;
  readonly #scores = new Map<string, number>();
  #winnerId: string | null = null;
  #isPaused = false;
  #isDisposed = false;

  constructor(
    context: GameSessionContext,
    settings: Readonly<Record<string, GameSettingValue>>
  ) {
    this.#context = context;
    const configuredTarget = settings.targetScore;
    this.#targetScore = typeof configuredTarget === "number"
      ? configuredTarget
      : 5;
    for (const member of context.members()) {
      if (member.role === "player") this.#scores.set(member.id, 0);
    }
  }

  start(): void {
    this.#context.broadcastState();
  }

  getPublicState(viewer: GameViewer): StarterGamePublicState {
    const members = this.#context.members();
    return {
      targetScore: this.#targetScore,
      scores: members
        .filter((member) => member.role === "player")
        .map((member) => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar,
          isConnected: member.isConnected,
          score: this.#scores.get(member.id) ?? 0
        })),
      winnerId: this.#winnerId,
      isPaused: this.#isPaused,
      canScore:
        viewer.role === "player" &&
        !this.#isDisposed &&
        this.#winnerId === null &&
        !this.#isPaused &&
        members.some(
          (member) =>
            member.id === viewer.memberId &&
            member.role === "player" &&
            member.isConnected
        )
    };
  }

  getLifecycleState(): GameLifecycleState {
    return { isPaused: this.#isPaused, isBusy: false };
  }

  handleAction(
    memberId: string,
    action: GameActionEnvelope
  ): GameActionResult {
    if (this.#isDisposed || this.#winnerId !== null) {
      return { success: false, message: "This game has already finished." };
    }
    if (this.#isPaused) {
      return { success: false, message: "The game is paused." };
    }
    if (action.type !== "score-point") {
      return { success: false, message: "That action is not supported." };
    }

    const player = this.#context.members().find(
      (member) => member.id === memberId && member.role === "player" && member.isConnected
    );
    if (!player) {
      return { success: false, message: "Only active players can score." };
    }

    const score = (this.#scores.get(memberId) ?? 0) + 1;
    this.#scores.set(memberId, score);
    this.#context.emitEvent({
      type: "point-scored",
      payload: { playerId: memberId, playerName: player.name, score }
    });

    if (score >= this.#targetScore) {
      this.#winnerId = memberId;
      this.#context.broadcastState();
      this.#context.finish({
        winnerId: memberId,
        reason: `${player.name} reached ${this.#targetScore} points.`
      });
      return { success: true };
    }

    this.#context.broadcastState();
    return { success: true };
  }

  pause(): GameActionResult {
    if (this.#isDisposed || this.#winnerId !== null) {
      return { success: false, message: "This game has already finished." };
    }
    this.#isPaused = true;
    this.#context.broadcastState();
    return { success: true };
  }

  resume(): GameActionResult {
    if (this.#isDisposed || this.#winnerId !== null) {
      return { success: false, message: "This game has already finished." };
    }
    this.#isPaused = false;
    this.#context.broadcastState();
    return { success: true };
  }

  memberDisconnected(): void {
    this.#context.broadcastState();
  }

  memberReconnected(memberId: string, previousMemberId = memberId): void {
    if (previousMemberId !== memberId && this.#scores.has(previousMemberId)) {
      this.#scores.set(memberId, this.#scores.get(previousMemberId)!);
      this.#scores.delete(previousMemberId);
      if (this.#winnerId === previousMemberId) this.#winnerId = memberId;
    }
    this.#context.broadcastState();
  }

  memberRemoved(memberId: string): GameActionResult {
    this.#scores.delete(memberId);
    this.#context.broadcastState();
    return { success: true };
  }

  dispose(): void {
    this.#isDisposed = true;
    this.#scores.clear();
  }
}
