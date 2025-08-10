/** Checks if two rectangles are colliding */
export function isRectToRect(a: Rect, b: Rect) {
  if (a.x > b.x + b.w) return false;
  if (a.x + a.w < b.x) return false;
  if (a.y > b.y + b.h) return false;
  if (a.y + a.h < b.y) return false;
  return true;
}
/** Checks if a rect is inside another rect */
export function isRectInRect(a: Rect, b: Rect) {
  if (a.x < b.x) return false;
  if (a.y < b.y) return false;
  if (a.x + a.w > b.x + b.w) return false;
  if (a.y + a.h > b.y + b.h) return false;
  return true;
}
export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};
export type TypedRect = Rect & {
  type: number;
};
