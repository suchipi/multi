import { ClientID } from "../ClientID";
import { Point, makePoint } from "./Point";
import { Angle } from "./Angle";

export type Entity = {
  components: {
    position?: Point;
    color?: string;
    player?: ClientID;
    direction?: Angle;
  };
};

export function makeEntity(): Entity {
  return {
    components: {
      position: makePoint(0, 0),
    },
  };
}
