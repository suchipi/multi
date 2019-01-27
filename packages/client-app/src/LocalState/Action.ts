import { Action as GameAction } from "@multi/game-state";
import { Vec2 } from "@multi/models";

export type LocalAction = {
  type: "MOVE_CAMERA";
  payload: Vec2;
};

export type Action = GameAction | LocalAction;
