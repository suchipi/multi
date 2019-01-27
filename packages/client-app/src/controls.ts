import { addVec2, makeVec2 } from "@multi/models";
import KeyListener from "./KeyListener";
import Client from "./Client";

export default function setupControls(client: Client): KeyListener {
  const controls = new KeyListener();

  const move = (x: number, y: number) => {
    const cameraPosition = client.selectors.client.getCameraPosition();
    return addVec2(cameraPosition, makeVec2(x, y));
  };

  controls.keydown.on("ArrowUp", () => {
    client.dispatch({
      type: "MOVE_CAMERA",
      payload: move(0, -1),
    });
  });

  controls.keydown.on("ArrowDown", () => {
    client.dispatch({
      type: "MOVE_CAMERA",
      payload: move(0, 1),
    });
  });

  controls.keydown.on("ArrowLeft", () => {
    client.dispatch({
      type: "MOVE_CAMERA",
      payload: move(-1, 0),
    });
  });

  controls.keydown.on("ArrowRight", () => {
    client.dispatch({
      type: "MOVE_CAMERA",
      payload: move(1, 0),
    });
  });

  return controls;
}
