import { Action } from "../Action";

export type State = "KEYBOARD" | "GAMEPAD";

export function initialState(): State {
  return localStorage.inputMode || "KEYBOARD";
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOCAL_SET_INPUT_MODE": {
      const { mode } = action;
      localStorage.inputMode = mode;
      return mode;
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state: State) => ({
  getInputMode: (): State => state,
});
