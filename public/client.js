(function registerStarterGame() {
  window.GameHubRegisterGameClientModule("starter-game", {
    mount(context) {
      const status = context.root.querySelector("[data-starter-status]");
      const scores = context.root.querySelector("[data-starter-scores]");
      const actionButton = context.root.querySelector("[data-starter-action]");
      if (!status || !scores || !actionButton) {
        throw new Error("Starter Game markup is incomplete.");
      }

      let latestState = null;
      let isSubmitting = false;
      let isDestroyed = false;
      actionButton.disabled = true;

      function render() {
        if (!latestState) return;
        scores.replaceChildren();
        for (const player of latestState.scores) {
          const item = document.createElement("li");
          item.className = "starter-game__score";
          const identity = document.createElement("span");
          identity.textContent = `${player.avatar} ${player.name}`;
          const value = document.createElement("strong");
          value.textContent = `${player.score} / ${latestState.targetScore}`;
          item.append(identity, value);
          scores.appendChild(item);
        }

        const winner = latestState.scores.find(
          (player) => player.id === latestState.winnerId
        );
        status.textContent = winner
          ? `${winner.avatar} ${winner.name} wins!`
          : latestState.isPaused
            ? "Game paused"
            : `First to ${latestState.targetScore} points wins.`;
        actionButton.disabled = !latestState.canScore || isSubmitting;
      }

      async function scorePoint() {
        if (isDestroyed || actionButton.disabled) return;
        isSubmitting = true;
        render();
        const result = await context.submitAction({ type: "score-point" });
        if (isDestroyed) return;
        isSubmitting = false;
        if (!result.success && result.message) context.notify(result.message);
        render();
      }

      actionButton.addEventListener("click", scorePoint);
      const unsubscribe = context.input.onAction("score-point", scorePoint);

      return {
        receiveState(state) {
          latestState = state;
          render();
        },
        receiveEvent(event) {
          if (event.type === "point-scored" && event.payload?.playerName) {
            status.textContent = `${event.payload.playerName} scored a point.`;
          }
        },
        setPaused(isPaused) {
          if (!latestState) return;
          latestState = { ...latestState, isPaused };
          render();
        },
        destroy() {
          isDestroyed = true;
          unsubscribe();
          actionButton.removeEventListener("click", scorePoint);
          scores.replaceChildren();
          latestState = null;
        }
      };
    }
  });
})();
