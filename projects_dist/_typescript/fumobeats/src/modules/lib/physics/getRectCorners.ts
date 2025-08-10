import { gameDebug } from "modules/Debug";
import { getAngle } from "modules/lib/physics/getAngle";
import { getDistance } from "modules/lib/physics/getDistance";
import { Rect, Point } from "modules/types/shapes";

/**
 * Destructures the rectangle into four points
 * @returns {Point[]} Rectangle corners as points, clockwise from the top-left.
 */
export function getRectCorners(
  rect: Rect,
  rot?: number
): [Point, Point, Point, Point] {
  const { w, h, x, y } = rect;
  const corners: [Point, Point, Point, Point] = [
    new Point(x, y),
    new Point(x + w, y),
    new Point(x + w, y + h),
    new Point(x, y + h),
  ];
  if (rot) {
    const center = new Point(rect.x + rect.w / 2, rect.y + rect.h / 2);
    const ray = Math.sqrt(rect.w ** 2 + rect.h ** 2) / 2;
    corners.forEach((corner) => {
      const angle = getAngle(center, corner);
      corner.x = center.x + ray * Math.cos(rot + angle);
      corner.y = center.y + ray * Math.sin(rot + angle);
    });
  }
  return corners;
}
