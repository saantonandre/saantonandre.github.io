import { Circle, Line, Point, Rect } from "modules/types/shapes";

/** Checks if a line is colliding with a rectangle */
export function isLineToCircle([a, b]: Line, c: Circle) {
  const ac = Point.sub(c, a);
  const ab = Point.sub(b, a);
  const d = Point.add(Point.proj(ac, ab), a);
  const ad = Point.sub(d, a);
  const k = Math.abs(ab.x) > Math.abs(ab.y) ? ad.x / ab.x : ad.y / ab.y;
  const abc =
    k <= 0
      ? Math.sqrt(Point.hypot2(c, a))
      : k >= 1
      ? Math.sqrt(Point.hypot2(c, b))
      : Math.sqrt(Point.hypot2(c, d));

  return abc <= c.radius;
}
