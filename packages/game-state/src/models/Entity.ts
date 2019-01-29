import { ClientID } from "../ClientID";
import { Point, makePoint } from "./Point";
import { Angle } from "./Angle";

export type Entity = {
  components: {
    position?: void | Point;
    color?: void | string;
    player?: ClientID;
    direction?: void | Angle;
  };
};

export function makeEntity(): Entity {
  return {
    components: {
      position: makePoint(0, 0),
    },
  };
}
