import { getEnv } from "@multi/env";

export type State = {
  count: number;
};

export type Action = {
  type: "INCREASE";
};

export function initialState(): State {
  return {
    count: 0,
  };
}

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case "INCREASE": {
      return {
        count: state.count + 1,
      };
    }
    default: {
      return state;
    }
  }
}
