import { Point, Rect } from "modules/types/shapes";

/** Checks if a point is colliding with a rectangle */
export function isPointToRect(point: Point, rect: Rect) {
  if (point.x < rect.x) return false;
  if (point.x > rect.x + rect.w) return false;
  if (point.y < rect.y) return false;
  if (point.y > rect.y + rect.h) return false;
  return true;
}
