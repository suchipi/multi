import { addPosition, makePosition, makeVector } from "@multi/game-state";
import KeyListener from "./KeyListener";
import Client from "./Client";

export default function setupControls(client: Client): KeyListener {
  const controls = new KeyListener();

  const moveCamera = (x: number, y: number) => {
    const cameraPosition = client.selectors.client.getCameraPosition();
    return addPosition(cameraPosition, makePosition(x, y));
  };

  controls.keydown.on("ArrowUp", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(0, -1),
    });
  });

  controls.keydown.on("ArrowDown", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(0, 1),
    });
  });

  controls.keydown.on("ArrowLeft", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(-1, 0),
    });
  });

  controls.keydown.on("ArrowRight", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(1, 0),
    });
  });

  const movePlayer = (angle) => {
    client.dispatch({
      type: "PLAYER_MOVE",
      clientId: client.id,
      movement: makeVector(angle, 10),
    });
  };

  controls.keydown.on("w", () => movePlayer(90));
  controls.keydown.on("s", () => movePlayer(270));
  controls.keydown.on("a", () => movePlayer(180));
  controls.keydown.on("d", () => movePlayer(0));

  const stop = () => {
    if (controls.heldKeys.has("w")) {
      movePlayer(90);
    } else if (controls.heldKeys.has("s")) {
      movePlayer(270);
    } else if (controls.heldKeys.has("a")) {
      movePlayer(180);
    } else if (controls.heldKeys.has("d")) {
      movePlayer(0);
    } else {
      const player = client
        .getState()
        .game.entities.find(
          (entity) =>
            entity.components.player &&
            entity.components.player.clientId === client.id
        );
      const currentAngle =
        (player &&
          player.components.player &&
          player.components.player.movement.angle) ||
        270;

      client.dispatch({
        type: "PLAYER_MOVE",
        clientId: client.id,
        movement: makeVector(currentAngle, 0),
      });
    }
  };

  controls.keyup.on("w", stop);
  controls.keyup.on("s", stop);
  controls.keyup.on("a", stop);
  controls.keyup.on("d", stop);

  return controls;
}
