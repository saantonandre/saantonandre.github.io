import { Point } from "modules/types/shapes";

export const getPointOpposite = (point: Point): Point => {
  return new Point(point.x * -1, point.y * -1);
};
