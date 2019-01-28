import produce from "immer";
import {
  Entity,
  makeEntity,
  addPosition,
  makeVector,
  vectorToPosition,
} from "../models";
import { Action } from "../Action";

export type State = Array<Entity>;

export function initialState(): State {
  return [];
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLAYER_JOIN": {
      const { clientId } = action;
      if (
        state.find(
          (entity) =>
            entity.components.player &&
            entity.components.player.clientId === clientId
        )
      ) {
        return state;
      }
      const entity = makeEntity();
      entity.components.player = {
        clientId: clientId,
        movement: makeVector(270, 0), // facing down, not moving
      };
      entity.components.color = "red";
      return produce(state, (draft) => {
        draft.push(entity);
      });
    }
    case "PLAYER_MOVE": {
      const { clientId, movement } = action;
      return produce(state, (draft) => {
        const player = draft.find(
          (entity) =>
            entity.components.player &&
            entity.components.player.clientId === clientId
        );
        if (player && player.components.player) {
          player.components.player.movement = movement;
        }
      });
    }
    case "PLAYER_LEAVE": {
      const { clientId } = action;
      return state.filter(
        (entity) =>
          !entity.components.player ||
          (entity.components.player &&
            entity.components.player.clientId !== clientId)
      );
    }
    case "TICK": {
      const { elapsedTime } = action;
      return produce(state, (draft) => {
        draft.forEach((entity) => {
          const { player, position } = entity.components;
          if (!player || !position) return;
          if (player.movement.magnitude === 0) return;

          const distance = (elapsedTime * player.movement.magnitude) / 100;

          const newPosition = addPosition(
            position,
            vectorToPosition(makeVector(player.movement.angle, distance))
          );
          entity.components.position = newPosition;
        });
      });
    }
    default: {
      return state;
    }
  }
}

export const selectors = (state) => ({
  getEntities: (): Array<Entity> => state,
});
