import { ClientID } from "../ClientID";
import { Position, makePosition } from "./Position";
import { Angle } from "./Angle";

export type Entity = {
  components: {
    position?: void | Position;
    color?: void | string;
    player?: ClientID;
    direction?: void | Angle;
  };
};

export function makeEntity(): Entity {
  return {
    components: {
      position: makePosition(0, 0),
    },
  };
}
