import { Position, makePosition } from "./Position";
import { Angle, makeAngle, degreesToRadians } from "./Angle";

export type Vector = {
  angle: Angle;
  magnitude: number;
};

export function makeVector(angle: Angle | number, magnitude: number): Vector {
  if (typeof angle === "number") {
    return {
      angle: makeAngle(angle),
      magnitude,
    };
  } else {
    return {
      angle,
      magnitude,
    };
  }
}

export function vectorToPosition(vector: Vector): Position {
  const x = vector.magnitude * Math.cos(degreesToRadians(vector.angle.degrees));
  const y = vector.magnitude * Math.sin(degreesToRadians(vector.angle.degrees));
  return makePosition(x, y);
}
