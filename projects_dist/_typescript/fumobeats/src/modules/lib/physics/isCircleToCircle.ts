import { getDistance } from "modules/lib/physics/getDistance";
import { getRectSides } from "modules/lib/physics/getRectSides";
import { isLineToCircle } from "modules/lib/physics/isLineToCircle";
import { Circle, Rect } from "modules/types/shapes";

export function isCircleToCircle(a: Circle, b: Circle) {
  return getDistance(a, b) < a.radius + b.radius;
}
