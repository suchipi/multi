import Client from "./Client";
import { makeVector, equalsPoint } from "@multi/game-state";

export default class Updater {
  update(client: Client, elapsedTime: number) {
    client.controls.update();

    const leftStick = client.controls.leftStick();

    if (leftStick.magnitude != 0) {
      client.dispatch({
        type: "PLAYER_MOVE",
        clientId: client.id,
        movement: makeVector(
          leftStick.angle,
          (leftStick.magnitude * elapsedTime) / 10
        ),
      });
    }

    const rightStick = client.controls.rightStick();
    if (rightStick.magnitude != 0) {
      client.dispatch({
        type: "LOCAL_MOVE_CAMERA",
        movement: makeVector(
          rightStick.angle,
          (rightStick.magnitude * elapsedTime) / 10
        ),
      });
    }

    if (client.controls.resetCameraPressed()) {
      const cameraPosition = client.selectors.local.getCameraPosition();
      const player = client.selectors.game.getPlayer(localStorage.clientId);
      if (!player) return;
      const { position: playerPosition } = player;
      if (!playerPosition) return;

      if (!equalsPoint(cameraPosition, playerPosition)) {
        client.dispatch({
          type: "LOCAL_TELEPORT_CAMERA",
          position: playerPosition,
        });
      }
    }
  }
}
