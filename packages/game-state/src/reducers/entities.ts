import { Entity } from "@multi/models";
import { Action } from "../Action";

export type State = Array<Entity>;

export function initialState(): State {
  return [];
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CREATE_ENTITY": {
      return [...state, action.entity];
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state) => ({
  getEntities: (): Array<Entity> => state,
});
