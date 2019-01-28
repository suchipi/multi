import {
  State as CameraPositionState,
  reducer as cameraPositionReducer,
  initialState as cameraPositionInitialState,
  selectors as cameraPositionSelectors,
} from "./cameraPosition";
import {
  State as InputModeState,
  reducer as inputModeReducer,
  initialState as inputModeInitialState,
  selectors as inputModeSelectors,
} from "./inputMode";
import { Action } from "../Action";

export type State = {
  cameraPosition: CameraPositionState;
  inputMode: InputModeState;
};

export function initialState(): State {
  return {
    cameraPosition: cameraPositionInitialState(),
    inputMode: inputModeInitialState(),
  };
}

export function reducer(state: State, action: Action): State {
  return {
    cameraPosition: cameraPositionReducer(state.cameraPosition, action),
    inputMode: inputModeReducer(state.inputMode, action),
  };
}

export const selectors = (state: State) => ({
  getCameraPosition: () =>
    cameraPositionSelectors(state.cameraPosition).getCameraPosition(),
  getInputMode: () => inputModeSelectors(state.inputMode).getInputMode(),
});
