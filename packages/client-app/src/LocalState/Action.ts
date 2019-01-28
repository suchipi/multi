import { Action as GameAction, Position } from "@multi/game-state";

// ALL LOCAL ACTION TYPES MUST START WITH "LOCAL"-
// that's how we know not to send them to the server.
export type LocalAction = {
  type: "LOCAL_MOVE_CAMERA";
  payload: Position;
};

export type Action = GameAction | LocalAction;
