export type Angle = {
  degrees: number;
};

// Degrees from the right, counter-clockwise
export function makeAngle(degrees: number): Angle {
  return {
    degrees,
  };
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
