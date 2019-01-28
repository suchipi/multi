import {
  State as EntitiesState,
  reducer as entitiesReducer,
  initialState as entitiesInitialState,
  selectors as entitiesSelectors,
} from "./entities";
import { Action } from "../Action";
import { ClientID } from "../ClientID";

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
  getPlayer: (clientId: ClientID) =>
    entitiesSelectors(state.entities).getPlayer(clientId),
  getEntities: () => entitiesSelectors(state.entities).getEntities(),
});
