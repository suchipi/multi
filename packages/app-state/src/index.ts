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
      assertNever(
        action.type,
        `app-state reducer received unexpected action type: ${action.type}`
      );
    }
  }
}

function assertNever(obj: never, message: string): never {
  throw new Error(message);
}
