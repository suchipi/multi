import { ClientID } from "../ClientID";
import { Position, makePosition } from "./Position";
import { Vector } from "./Vector";

export type Entity = {
  components: {
    position?: void | Position;
    color?: void | string;
    player?: void | {
      clientId: ClientID;
      movement: Vector;
    };
  };
};

export function makeEntity(): Entity {
  return {
    components: {
      position: makePosition(0, 0),
    },
  };
}
