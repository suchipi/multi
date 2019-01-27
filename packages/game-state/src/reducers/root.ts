import {
  State as EntitiesState,
  reducer as entitiesReducer,
  initialState as entitiesInitialState,
  selectors as entitiesSelectors,
} from "./entities";
import { Action } from "../Action";

export type State = {
  entities: EntitiesState;
};

export function initialState(): State {
  return {
    entities: entitiesInitialState(),
  };
}

export function reducer(state: State, action: Action): State {
  return {
    entities: entitiesReducer(state.entities, action),
  };
}

export const selectors = (state) => ({
  getEntities: () => entitiesSelectors(state.entities).getEntities(),
});
