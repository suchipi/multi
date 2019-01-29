export type Position = {
  x: number;
  y: number;
};

export function makePosition(x: number, y: number): Position {
  return { x, y };
}

export function addPosition(first: Position, second: Position) {
  return {
    x: first.x + second.x,
    y: first.y + second.y,
  };
}

export function subtractPosition(first: Position, second: Position) {
  return {
    x: first.x - second.x,
    y: first.y - second.y,
  };
}

export function equalsPosition(first: Position, second: Position) {
  return first.x === second.x && first.y === second.y;
}

// Calculate the distance between two positions.
export function distance(first: Position, second: Position) {
  return Math.sqrt(
    Math.pow(second.x - first.x, 2) + Math.pow(second.y - first.y, 2)
  );
}
