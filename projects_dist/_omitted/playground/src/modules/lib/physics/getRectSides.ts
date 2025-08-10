import { getRectCorners } from "modules/lib/physics/getRectCorners";
import { Rect, Line } from "modules/types/shapes";

/**
 * Destructures the rectangle into four lines
 * @returns {Line[]} Rectangle sides as lines, clockwise from the top side.
 */
export function getRectSides(rect: Rect): [Line, Line, Line, Line] {
  const [tl, tr, br, bl] = getRectCorners(rect);
  return [
    [tl, tr],
    [tr, br],
    [br, bl],
    [bl, tl],
  ];
}
