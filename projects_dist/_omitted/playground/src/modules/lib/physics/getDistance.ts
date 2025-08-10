import { Point } from "modules/types/shapes";

/**
 * Measures the absolute distance between two points
 * @param a
 * @param b
 */
export function getDistance(a: Point, b: Point) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}
