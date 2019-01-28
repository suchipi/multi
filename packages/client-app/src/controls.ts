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

  let angle;
  const movePlayer = () => {
    let magnitude = 10;
    if (controls.heldKeys.has("w") && controls.heldKeys.has("d")) {
      // up right
      angle = 45;
    } else if (controls.heldKeys.has("w") && controls.heldKeys.has("a")) {
      // up left
      angle = 180 - 45;
    } else if (controls.heldKeys.has("s") && controls.heldKeys.has("d")) {
      // down right
      angle = 360 - 45;
    } else if (controls.heldKeys.has("s") && controls.heldKeys.has("a")) {
      // down left
      angle = 180 + 45;
    } else if (controls.heldKeys.has("w") && !controls.heldKeys.has("s")) {
      // up
      angle = 90;
    } else if (controls.heldKeys.has("s") && !controls.heldKeys.has("w")) {
      // down
      angle = 270;
    } else if (controls.heldKeys.has("a") && !controls.heldKeys.has("d")) {
      // left
      angle = 180;
    } else if (controls.heldKeys.has("d") && !controls.heldKeys.has("a")) {
      // right
      angle = 0;
    } else {
      magnitude = 0;
    }

    client.dispatch({
      type: "PLAYER_MOVE",
      clientId: client.id,
      movement: makeVector(angle, magnitude),
    });
  };

  controls.keydown.on("w", movePlayer);
  controls.keydown.on("s", movePlayer);
  controls.keydown.on("a", movePlayer);
  controls.keydown.on("d", movePlayer);
  controls.keyup.on("w", movePlayer);
  controls.keyup.on("s", movePlayer);
  controls.keyup.on("a", movePlayer);
  controls.keyup.on("d", movePlayer);

  return controls;
}
