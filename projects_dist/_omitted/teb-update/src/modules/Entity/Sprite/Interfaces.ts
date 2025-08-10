export interface Point {
  x: number;
  y: number;
}
export interface Rect extends Point {
  w: number;
  h: number;
}
export interface ViewInterface {
  context: CanvasRenderingContext2D;
  tilesize: number;
  ratio: number;
  parseRect: (
    rect: Rect,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
      ratio?: number;
    }
  ) => readonly [number, number, number, number];
  parsePoint: (
    point: Point,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
      ratio?: number;
    }
  ) => readonly [number, number];
}
