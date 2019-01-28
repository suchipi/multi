import Client from "./Client";
import { makeVector } from "@multi/game-state";

export default class Updater {
  update(client: Client, elapsedTime: number) {
    const heldKeys = client.controls.heldKeys;

    let angle = 0;
    let magnitude = (10 * elapsedTime) / 100;

    if (heldKeys.has("w") && heldKeys.has("d")) {
      // up right
      angle = 45;
    } else if (heldKeys.has("w") && heldKeys.has("a")) {
      // up left
      angle = 180 - 45;
    } else if (heldKeys.has("s") && heldKeys.has("d")) {
      // down right
      angle = 360 - 45;
    } else if (heldKeys.has("s") && heldKeys.has("a")) {
      // down left
      angle = 180 + 45;
    } else if (heldKeys.has("w") && !heldKeys.has("s")) {
      // up
      angle = 90;
    } else if (heldKeys.has("s") && !heldKeys.has("w")) {
      // down
      angle = 270;
    } else if (heldKeys.has("a") && !heldKeys.has("d")) {
      // left
      angle = 180;
    } else if (heldKeys.has("d") && !heldKeys.has("a")) {
      // right
      angle = 0;
    } else {
      magnitude = 0;
    }

    if (magnitude != 0) {
      client.dispatch({
        type: "PLAYER_MOVE",
        clientId: client.id,
        movement: makeVector(angle, magnitude),
      });
    }
  }
}
