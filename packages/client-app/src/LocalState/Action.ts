import { Action as GameAction } from "@multi/game-state";
import { Vec2 } from "@multi/models";

// ALL LOCAL ACTION TYPES MUST START WITH "LOCAL"-
// that's how we know not to send them to the server.
export type LocalAction = {
  type: "LOCAL_MOVE_CAMERA";
  payload: Vec2;
};

export type Action = GameAction | LocalAction;
