import { Vec2, makeVec2 } from "@multi/models";
import { Action } from "../Action";

export type State = Vec2;

export function initialState(): State {
  return makeVec2(0, 0);
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
  getCameraPosition: (): Vec2 => state,
});
