import { Point } from "modules/types/shapes";

export const getPointsSum = (...points: Point[]): Point => {
  return points.reduce(
    (acc, curr) => ({ x: acc.x + curr.x, y: acc.y + curr.y }),
    { x: 0, y: 0 }
  );
};
