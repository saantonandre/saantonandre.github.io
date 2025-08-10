import { Line, Rect } from "modules/types/shapes";
import { getLinesIntersection } from "./getLinesIntersection";
import { getRectSides } from "./getRectSides";

/** Checks if a line is colliding with a rectangle */
export function isLineToRect(line: Line, rect: Rect, rot?: number) {
  const sides = getRectSides(rect, rot);
  for (const side of sides) {
    const intersec = getLinesIntersection(line, side);
    if (intersec) return intersec;
  }
  return false;
}
