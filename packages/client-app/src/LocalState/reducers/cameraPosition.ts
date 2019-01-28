import {
  Position,
  makePosition,
  addPosition,
  vectorToPosition,
} from "@multi/game-state";
import { Action } from "../Action";

export type State = Position;

export function initialState(): State {
  return makePosition(0, 0);
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOCAL_MOVE_CAMERA": {
      return addPosition(state, vectorToPosition(action.movement));
    }
    case "LOCAL_TELEPORT_CAMERA": {
      return action.position;
    }
    case "PLAYER_MOVE": {
      // if (action.clientId === localStorage.clientId) {
      //   return addPosition(state, vectorToPosition(action.movement));
      // } else {
      return state;
      // }
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state: State) => ({
  getCameraPosition: (): Position => state,
});
