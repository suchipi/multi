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
