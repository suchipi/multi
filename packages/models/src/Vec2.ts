export type Vec2 = {
  x: number;
  y: number;
};

export function makeVec2(x: number, y: number): Vec2 {
  return { x, y };
}

export function addVec2(first: Vec2, second: Vec2) {
  return {
    x: first.x + second.x,
    y: first.y + second.y,
  };
}

export function subtractVec2(first: Vec2, second: Vec2) {
  return {
    x: first.x - second.x,
    y: first.y - second.y,
  };
}
