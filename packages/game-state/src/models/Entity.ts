import { ClientID } from "../ClientID";
import { Point, makePoint } from "./Point";
import { Angle } from "./Angle";

export type Entity = {
  position?: Point;
  color?: string;
  player?: ClientID;
  direction?: Angle;
};

export function makeEntity(): Entity {
  return {
    position: makePoint(0, 0),
  };
}
