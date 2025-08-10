import { getRectSides } from "modules/lib/physics/getRectSides";
import { isLineToCircle } from "modules/lib/physics/isLineToCircle";
import { Circle, Rect } from "modules/types/shapes";

/** Checks if a line is colliding with a rectangle 
 * @deprecated
*/
export function isCircleToRect(circle: Circle, rect: Rect, rot?: number) {
  const sides = getRectSides(rect, rot);
  for (const side of sides) {
    const intersec = isLineToCircle(side, circle);
    if (intersec) return true;
  }
  return false;
}
