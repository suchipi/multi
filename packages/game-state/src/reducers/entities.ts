import produce from "immer";
import {
  Entity,
  makeEntity,
  addPoint,
  makeAngle,
  vectorToPoint,
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
      if (state.find((entity) => entity.player === clientId)) {
        return state;
      }
      const entity = makeEntity();
      entity.player = clientId;
      entity.color = "red";
      entity.direction = makeAngle(270); // facing down by default
      return produce(state, (draft) => {
        draft.push(entity);
      });
    }
    case "PLAYER_MOVE": {
      const { clientId, movement } = action;
      return produce(state, (draft) => {
        const player = draft.find((entity) => entity.player === clientId);
        if (!player) return;
        player.direction = movement.angle;

        const { position } = player;
        if (!position) return;
        const newPoint = addPoint(position, vectorToPoint(movement));
        player.position = newPoint;
      });
    }
    case "PLAYER_LEAVE": {
      const { clientId } = action;
      return state.filter(
        (entity) => !entity.player || entity.player !== clientId
      );
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state) => ({
  getPlayer: (clientId: ClientID): Entity =>
    state.find((entity) => entity.player === clientId),
  getEntities: (): Array<Entity> => state,
});
