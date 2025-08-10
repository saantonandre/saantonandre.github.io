type PointTemp = Point;

export class Point {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  static temp(x = 0, y = 0): PointTemp {
    return Point.set(tempPoint, x, y);
  }
  static set(point: Point, x = 0, y = 0) {
    point.x = x;
    point.y = y;
    return point;
  }
  static add(a: Point, b: Point) {
    return new Point(a.x + b.x, a.y + b.y);
  }
  static sub(a: Point, b: Point) {
    return new Point(a.x - b.x, a.y - b.y);
  }
  static dot(a: Point, b: Point) {
    return a.x * b.x - a.y * b.y;
  }
  static hypot2(a: Point, b: Point) {
    return Point.dot(Point.sub(a, b), Point.sub(a, b));
  }
  static proj(a: Point, b: Point) {
    const k = Point.dot(a, b) / Point.dot(b, b);
    return new Point(k * b.x, k * b.y);
  }
}

export class Circle extends Point {
  radius: number;
  constructor(x = 0, y = 0, radius = 0) {
    super(x, y);
    this.radius = radius;
  }
}

export class Rect extends Point {
  w: number;
  h: number;
  constructor(x = 0, y = 0, w = 0, h = 0) {
    super(x, y);
    this.w = w;
    this.h = h;
  }
  static temp(x = 0, y = 0, w = 0, h = 0) {
    return Rect.set(tempRect, x, y, w, h);
  }
  static set(rect: Rect, x = 0, y = 0, w = 0, h = 0) {
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    return rect;
  }
  static add(a: Rect, b: Rect) {
    return new Rect(a.x + b.x, a.y + b.y, a.w + b.w, a.h + b.h);
  }
  static sub(a: Rect, b: Rect) {
    return new Rect(a.x - b.x, a.y - b.y, a.w - b.w, a.h - b.h);
  }
}

const tempPoint = new Point();
const tempRect = new Rect();

export type Line = [Point, Point];

export type Cone = {
  origin: Point;
  rotation: number;
  radius: number;
  angle: number;
};
