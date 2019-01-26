import { getEnv } from "@multi/env";
import { Entity } from "./entity";

export type State = {
  entities: Array<Entity>;
};

export type Action = {
  type: "CREATE_ENTITY";
  entity: Entity;
};

export function initialState(): State {
  return {
    entities: [],
  };
}

export default function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CREATE_ENTITY": {
      return {
        entities: [...state.entities, action.entity],
      };
    }
    default: {
      return state;
    }
  }
}
