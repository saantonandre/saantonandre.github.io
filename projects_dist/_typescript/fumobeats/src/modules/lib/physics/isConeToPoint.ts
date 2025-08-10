import { Cone, Point } from "modules/types/shapes";
import { getAngle } from "./getAngle";
import { getDistance } from "./getDistance";

/** Checks if a cone is colliding with a point */
export function isConeToPoint(cone: Cone, point: Point) {
  const { origin, rotation, angle, radius } = cone;
  if (getDistance(origin, point) > radius) return false;
  const delta = Math.abs(getAngle(origin, point) - rotation) % (Math.PI * 2);
  const smallerSlice = delta > Math.PI ? Math.PI * 2 - delta : delta;
  return angle / 2 > smallerSlice;
}
