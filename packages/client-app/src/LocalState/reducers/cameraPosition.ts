import { Position, makePosition } from "@multi/game-state";
import { Action } from "../Action";

export type State = Position;

export function initialState(): State {
  return makePosition(0, 0);
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOCAL_MOVE_CAMERA": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state: State) => ({
  getCameraPosition: (): Position => state,
});
