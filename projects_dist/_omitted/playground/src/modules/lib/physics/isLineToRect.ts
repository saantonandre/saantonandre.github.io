import { Line, Rect } from "modules/types/shapes";
import { getLinesIntersection } from "./getLinesIntersection";
import { getRectSides } from "./getRectSides";

/** Checks if a line is colliding with a rectangle */
export function isLineToRect(line: Line, rect: Rect) {
  const sides = getRectSides(rect);
  for (const side of sides) {
    if (getLinesIntersection(line, side)) return true;
  }
  return false;
}
