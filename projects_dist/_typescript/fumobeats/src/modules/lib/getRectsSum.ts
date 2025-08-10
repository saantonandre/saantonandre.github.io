import { Rect } from "modules/types/shapes";

export const getRectsSum = (...rects: Rect[]): Rect => {
  return rects.reduce(
    (acc, curr) => ({
      x: acc.x + curr.x,
      y: acc.y + curr.y,
      w: acc.w + curr.w,
      h: acc.h + curr.h,
    }),
    { x: 0, y: 0, w: 0, h: 0 }
  );
};
