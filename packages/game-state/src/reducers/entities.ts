import produce from "immer";
import {
  Entity,
  makeEntity,
  addPosition,
  makeAngle,
  vectorToPosition,
} from "../models";
import { Action } from "../Action";
import { ClientID } from "../ClientID";

export type State = Array<Entity>;

export function initialState(): State {
  return [];
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAYER_JOIN": {
      const { clientId } = action;
      if (state.find((entity) => entity.components.player === clientId)) {
        return state;
      }
      const entity = makeEntity();
      entity.components.player = clientId;
      entity.components.color = "red";
      entity.components.direction = makeAngle(270); // facing down by default
      return produce(state, (draft) => {
        draft.push(entity);
      });
    }
    case "PLAYER_MOVE": {
      const { clientId, movement } = action;
      return produce(state, (draft) => {
        const player = draft.find(
          (entity) => entity.components.player === clientId
        );
        if (!player) return;
        player.components.direction = movement.angle;

        const { position } = player.components;
        if (!position) return;
        const newPosition = addPosition(position, vectorToPosition(movement));
        player.components.position = newPosition;
      });
    }
    case "PLAYER_LEAVE": {
      const { clientId } = action;
      return state.filter(
        (entity) =>
          !entity.components.player || entity.components.player !== clientId
      );
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state) => ({
  getPlayer: (clientId: ClientID): Entity =>
    state.find((entity) => entity.components.player === clientId),
  getEntities: (): Array<Entity> => state,
});
