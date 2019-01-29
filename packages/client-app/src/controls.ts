import { Vector, makeVector, makeAngle } from "@multi/game-state";
import Client from "./Client";
import KeyListener from "./KeyListener";
import GamepadListener from "./GamepadListener";

export default class Controls {
  client: Client;
  keyboard: KeyListener;
  gamepad: GamepadListener;

  constructor(client: Client) {
    this.client = client;
    this.keyboard = new KeyListener();
    this.keyboard.bindListeners();
    this.gamepad = new GamepadListener();
  }

  update() {
    this.gamepad.update();
  }

  inputMode() {
    return this.client.selectors.local.getInputMode();
  }

  leftStick(): Vector {
    if (this.inputMode() === "GAMEPAD") {
      return this.gamepad.leftStick;
    } else {
      return this.vectorFromKeys("w", "s", "a", "d");
    }
  }

  rightStick(): Vector {
    if (this.inputMode() === "GAMEPAD") {
      return this.gamepad.rightStick;
    } else {
      return this.vectorFromKeys(
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
      );
    }
  }

  resetCameraPressed(): boolean {
    if (this.inputMode() === "GAMEPAD") {
      return this.gamepad.pressed.has("r3");
    } else {
      return this.keyboard.pressed.has("c");
    }
  }

  vectorFromKeys(
    upKey: string,
    downKey: string,
    leftKey: string,
    rightKey: string
  ): Vector {
    const pressedKeys = this.keyboard.pressed;
    let angle = 0;
    let magnitude = 1;

    const half = Math.PI;
    const quarter = Math.PI / 2;
    const eighth = Math.PI / 4;

    if (pressedKeys.has(upKey) && pressedKeys.has(rightKey)) {
      // up right
      angle = -eighth;
    } else if (pressedKeys.has(upKey) && pressedKeys.has(leftKey)) {
      // up left
      angle = half + eighth;
    } else if (pressedKeys.has(downKey) && pressedKeys.has(rightKey)) {
      // down right
      angle = eighth;
    } else if (pressedKeys.has(downKey) && pressedKeys.has(leftKey)) {
      // down left
      angle = quarter + eighth;
    } else if (pressedKeys.has(upKey) && !pressedKeys.has(downKey)) {
      // up
      angle = -quarter;
    } else if (pressedKeys.has(downKey) && !pressedKeys.has(upKey)) {
      // down
      angle = quarter;
    } else if (pressedKeys.has(leftKey) && !pressedKeys.has(rightKey)) {
      // left
      angle = half;
    } else if (pressedKeys.has(rightKey) && !pressedKeys.has(leftKey)) {
      // right
      angle = 0;
    } else {
      magnitude = 0;
    }

    return makeVector(makeAngle(angle), magnitude);
  }
}
