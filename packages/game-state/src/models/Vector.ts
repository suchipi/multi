import { Position, makePosition, distance } from "./Position";
import { Angle, positionsToAngle } from "./Angle";

export type Vector = {
  angle: Angle;
  magnitude: number;
};

export function makeVector(angle: Angle, magnitude: number): Vector {
  return {
    angle,
    magnitude,
  };
}

// Place a vector at the origin, and return the position of where its head is.
export function vectorToPosition(vector: Vector): Position {
  const x = vector.magnitude * Math.cos(vector.angle.radians);
  const y = vector.magnitude * Math.sin(vector.angle.radians);
  return makePosition(x, y);
}

// Create a vector with tail at `first` and head at `second`.
export function positionsToVector(first: Position, second: Position): Vector {
  const angle = positionsToAngle(first, second);
  const magnitude = distance(first, second);
  return makeVector(angle, magnitude);
}
