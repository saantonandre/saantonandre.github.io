import { Rect, Point, Line, Circle, Cone } from "@modules/lib/shapes";

export function isPointToCircle(point: Point, circle: Circle) {
  const distance = getDistance(point, circle);
  return distance <= circle.radius;
}

/** Checks if two rectangles are colliding */
export function isRectToRect(a: Rect, b: Rect) {
  if (a.x > b.x + b.w) return false;
  if (a.x + a.w < b.x) return false;
  if (a.y > b.y + b.h) return false;
  if (a.y + a.h < b.y) return false;
  return true;
}

export function isCircleToCircle(a: Circle, b: Circle) {
  return getDistance(a, b) < a.radius + b.radius;
}

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

/** Checks if a line is colliding with a rectangle */
export function isLineToRect(line: Line, rect: Rect, rot?: number) {
  const sides = getRectSides(rect, rot);
  for (const side of sides) {
    const intersec = getLinesIntersection(line, side);
    if (intersec) return intersec;
  }
  return false;
}

/** Checks if a cone is colliding with a point */
export function isConeToPoint(cone: Cone, point: Point) {
  const { origin, rotation, angle, radius } = cone;
  if (getDistance(origin, point) > radius) return false;
  const delta = Math.abs(getAngle(origin, point) - rotation) % (Math.PI * 2);
  const smallerSlice = delta > Math.PI ? Math.PI * 2 - delta : delta;
  return angle / 2 > smallerSlice;
}

/** Checks if a point is colliding with a rectangle */
export function isPointToRect(point: Point, rect: Rect) {
  if (point.x < rect.x) return false;
  if (point.x > rect.x + rect.w) return false;
  if (point.y < rect.y) return false;
  if (point.y > rect.y + rect.h) return false;
  return true;
}

/**
 * Measures the absolute distance between two points
 * @param a
 * @param b
 */
export function getDistance(a: Point, b: Point) {
  const deltaX = a.x - b.x;
  const deltaY = a.y - b.y;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
}

/** Returns the angle in radians between two points */
export function getAngle(a: Point, b: Point) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/** Checks for an intersection between 2 lines */
export function getLinesIntersection(a: Line, b: Line): Point | undefined {
  const [[a1, a2], [b1, b2]] = [a, b];

  if (a1.x === a2.x && a1.y === a2.y) return undefined;

  if (b1.x === b2.x && b1.y === b2.y) return undefined;

  const d = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

  if (!d) return undefined;

  const ua =
    ((b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x)) / d;
  const ub =
    ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x)) / d;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return undefined;

  let x = a1.x + ua * (a2.x - a1.x);
  let y = a1.y + ua * (a2.y - a1.y);
  return { x, y };
}

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

/**
 * Destructures the rectangle into four lines
 * @returns {Line[]} Rectangle sides as lines, clockwise from the top side.
 */
export function getRectSides(
  rect: Rect,
  rot?: number
): [Line, Line, Line, Line] {
  const [tl, tr, br, bl] = getRectCorners(rect, rot);
  return [
    [tl, tr],
    [tr, br],
    [br, bl],
    [bl, tl],
  ];
}

export function getRectsSum(...rects: Rect[]): Rect {
  return rects.reduce(
    (acc, curr) => ({
      x: acc.x + curr.x,
      y: acc.y + curr.y,
      w: acc.w + curr.w,
      h: acc.h + curr.h,
    }),
    { x: 0, y: 0, w: 0, h: 0 }
  );
}

export function getPointsSum(...points: Point[]): Point {
  return points.reduce(
    (acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }),
    { x: 0, y: 0 }
  );
}

export function getPointOpposite(point: Point): Point {
  return new Point(point.x * -1, point.y * -1);
}
