import { Action as GameAction, Vector, Point } from "@multi/game-state";

// ALL LOCAL ACTION TYPES MUST START WITH "LOCAL"-
// that's how we know not to send them to the server.
export type LocalAction =
  | {
      type: "LOCAL_MOVE_CAMERA";
      movement: Vector;
    }
  | {
      type: "LOCAL_TELEPORT_CAMERA";
      position: Point;
    }
  | {
      type: "LOCAL_SET_INPUT_MODE";
      mode: "KEYBOARD" | "GAMEPAD";
    };

export type Action = GameAction | LocalAction;
