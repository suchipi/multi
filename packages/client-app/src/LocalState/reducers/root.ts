import {
  State as CameraPositionState,
  reducer as cameraPositionReducer,
  initialState as cameraPositionInitialState,
  selectors as cameraPositionSelectors,
} from "./cameraPosition";
import { Action } from "../Action";

export type State = {
  cameraPosition: CameraPositionState;
};

export function initialState(): State {
  return {
    cameraPosition: cameraPositionInitialState(),
  };
}

export function reducer(state: State, action: Action): State {
  return {
    cameraPosition: cameraPositionReducer(state.cameraPosition, action),
  };
}

export const selectors = (state: State) => ({
  getCameraPosition: () =>
    cameraPositionSelectors(state.cameraPosition).getCameraPosition(),
});
