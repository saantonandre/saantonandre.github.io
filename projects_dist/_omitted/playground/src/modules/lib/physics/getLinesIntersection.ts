import { Line, Point } from "modules/types/shapes";

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
