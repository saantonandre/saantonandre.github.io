import { Rect, Point } from "modules/types/shapes";

/**
 * Destructures the rectangle into four points
 * @returns {Point[]} Rectangle corners as points, clockwise from the top-left.
 */
export function getRectCorners(rect: Rect): [Point, Point, Point, Point] {
  const { w, h, x, y } = rect;
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ];
}
