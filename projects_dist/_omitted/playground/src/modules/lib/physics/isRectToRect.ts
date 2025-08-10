import { Rect } from "modules/types/shapes";

/** Checks if two rectangles are colliding */
export function isRectToRect(a: Rect, b: Rect) {
  if (a.x > b.x + b.w) return false;
  if (a.x + a.w < b.x) return false;
  if (a.y > b.y + b.h) return false;
  if (a.y + a.h < b.y) return false;
  return true;
}
