import { Vector, makeVector, radiansToDegrees } from "@multi/game-state";

const deadzone = 0.1;
function stickToVector(x, y) {
  const angle = radiansToDegrees(Math.atan2(y, x));
  let magnitude = Math.sqrt(x ** 2 + y ** 2);
  if (Math.abs(magnitude) < deadzone) {
    magnitude = 0;
  }
  return makeVector(angle, magnitude);
}

const buttonNames = {
  0: "cross",
  1: "circle",
  2: "square",
  3: "triangle",
  4: "l1",
  5: "r1",
  6: "l2",
  7: "r2",
  8: "select",
  9: "start",
  10: "l3",
  11: "r3",
  12: "up",
  13: "down",
  14: "left",
  15: "right",
  16: "home",
};
function buttonName(index: number) {
  return buttonNames[index] || "unknown button";
}

export default class GamepadListener {
  leftStick: Vector = makeVector(0, 0);
  rightStick: Vector = makeVector(0, 0);
  pressed: Set<string> = new Set();
  present: boolean = false;

  update() {
    const gamepad = navigator.getGamepads()[0];
    if (gamepad == null) {
      return;
    }
    this.present = true;

    this.leftStick = stickToVector(gamepad.axes[0], gamepad.axes[1]);
    this.rightStick = stickToVector(gamepad.axes[2], gamepad.axes[3]);

    gamepad.buttons.forEach((button, index) => {
      const name = buttonName(index);
      if (button.pressed) {
        this.pressed.add(name);
      } else {
        this.pressed.delete(name);
      }
    });
  }
}
