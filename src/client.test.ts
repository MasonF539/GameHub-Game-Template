import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

type Instance = { receiveState(state: unknown): void; destroy(): void };
type ClientModule = { mount(context: unknown): Instance };

function createClient() {
  const element = () => ({
    textContent: "", className: "", disabled: false,
    append(..._children: unknown[]) {}, replaceChildren() {},
    addEventListener() {}, removeEventListener() {}
  });
  const status = element(), scores = element(), button = element();
  let gameModule!: ClientModule;
  let action!: () => Promise<void>;
  const notifications: string[] = [];
  let reply!: (result: { success: boolean; message: string }) => void;
  runInNewContext(readFileSync(path.join(__dirname, "../public/client.js"), "utf8"), {
    window: { GameHubRegisterGameClientModule: (_id: string, module: ClientModule) => { gameModule = module; } },
    document: { createElement: element }
  });
  const context = {
    root: { querySelector: (selector: string) => selector.endsWith("status]") ? status : selector.endsWith("scores]") ? scores : button },
    input: { onAction: (_id: string, handler: () => Promise<void>) => { action = handler; return () => {}; } },
    submitAction: () => new Promise(resolve => { reply = resolve; }),
    notify: (message: string) => notifications.push(message)
  };
  const mount = () => gameModule.mount(context);
  const state = { scores: [], targetScore: 3, winnerId: null, isPaused: false, canScore: true };
  return { mount, state, button, notifications, score: () => action(), reply: (result: { success: boolean; message: string }) => reply(result) };
}

test("mount disables the reused action button until a snapshot arrives", () => {
  const view = createClient();
  const instance = view.mount();
  assert.equal(view.button.disabled, true);
  instance.receiveState(view.state);
  assert.equal(view.button.disabled, false);
  instance.destroy();
});

for (const stale of [false, true]) {
  test(`${stale ? "destroyed" : "current"} client action replies ${stale ? "cannot notify a replacement game" : "still report failures"}`, async () => {
    const view = createClient();
    const first = view.mount();
    first.receiveState(view.state);
    const pending = view.score();
    assert.equal(view.button.disabled, true);
    let replacement: Instance | undefined;
    if (stale) {
      first.destroy();
      replacement = view.mount();
      replacement.receiveState(view.state);
    }
    view.reply({ success: false, message: "Action failed." });
    await pending;
    assert.deepEqual(view.notifications, stale ? [] : ["Action failed."]);
    assert.equal(view.button.disabled, false);
    (replacement ?? first).destroy();
  });
}
