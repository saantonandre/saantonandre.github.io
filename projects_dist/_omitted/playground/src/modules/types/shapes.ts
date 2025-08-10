export class Point {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
export class Rect extends Point {
  w: number;
  h: number;
  constructor(x = 0, y = 0, h = 0, w = 0) {
    super(x, y);
    this.w = w;
    this.h = h;
  }
}
export type Line = [Point, Point];
export type Cone = {
  origin: Point;
  rotation: number;
  radius: number;
  angle: number;
};
