import { Point } from "modules/types/shapes";

/** Returns the angle in radians between two points */
export function getAngle(a: Point, b: Point) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}
