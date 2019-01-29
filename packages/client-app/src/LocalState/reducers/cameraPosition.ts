import { Point, makePoint, addPoint, vectorToPoint } from "@multi/game-state";
import { Action } from "../Action";

export type State = Point;

export function initialState(): State {
  return makePoint(0, 0);
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOCAL_MOVE_CAMERA": {
      return addPoint(state, vectorToPoint(action.movement));
    }
    case "LOCAL_TELEPORT_CAMERA": {
      return action.position;
    }
    case "PLAYER_MOVE": {
      // if (action.clientId === localStorage.clientId) {
      //   return addPoint(state, vectorToPoint(action.movement));
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
  getCameraPosition: (): Point => state,
});
