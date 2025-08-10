declare global {
  type Point = {
    x: number;
    y: number;
  };
  type Rect = Point & {
    w: number;
    h: number;
  };
  type ColoredPoint = Point & {
    color: string;
    type: "point";
    w: number;
    h: number;
  };
  type ColoredRect = Rect & {
    color: string;
    type: "rect";
  };
  type ColoredLine = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    type: "line";
  };
  type EntityLike = {
    compute: (deltaTime: number) => void;
    render: (
      context: CanvasRenderingContext2D,
      tilesize: number,
      ratio: number,
      camera: { x: number; y: number }
    ) => void;
  };
}
export {};
