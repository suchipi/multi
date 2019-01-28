import { addPosition, makePosition } from "@multi/game-state";
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
      payload: moveCamera(0, -10),
    });
  });

  controls.keydown.on("ArrowDown", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(0, 10),
    });
  });

  controls.keydown.on("ArrowLeft", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(-10, 0),
    });
  });

  controls.keydown.on("ArrowRight", () => {
    client.dispatch({
      type: "LOCAL_MOVE_CAMERA",
      payload: moveCamera(10, 0),
    });
  });

  return controls;
}
