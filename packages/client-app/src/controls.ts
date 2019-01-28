import { Vector, makeVector } from "@multi/game-state";
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
    // TODO: this is supposed to be up, down, left, right
    // but canvas y-down is messing me up
    downKey: string,
    upKey: string,
    leftKey: string,
    rightKey: string
  ): Vector {
    const pressedKeys = this.keyboard.pressed;
    let angle = 0;
    let magnitude = 1;

    if (pressedKeys.has(upKey) && pressedKeys.has(rightKey)) {
      // up right
      angle = 45;
    } else if (pressedKeys.has(upKey) && pressedKeys.has(leftKey)) {
      // up left
      angle = 180 - 45;
    } else if (pressedKeys.has(downKey) && pressedKeys.has(rightKey)) {
      // down right
      angle = 360 - 45;
    } else if (pressedKeys.has(downKey) && pressedKeys.has(leftKey)) {
      // down left
      angle = 180 + 45;
    } else if (pressedKeys.has(upKey) && !pressedKeys.has(downKey)) {
      // up
      angle = 90;
    } else if (pressedKeys.has(downKey) && !pressedKeys.has(upKey)) {
      // down
      angle = 270;
    } else if (pressedKeys.has(leftKey) && !pressedKeys.has(rightKey)) {
      // left
      angle = 180;
    } else if (pressedKeys.has(rightKey) && !pressedKeys.has(leftKey)) {
      // right
      angle = 0;
    } else {
      magnitude = 0;
    }

    return makeVector(angle, magnitude);
  }
}
