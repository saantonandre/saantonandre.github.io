import { Circle, Point } from "modules/types/shapes";
import { getDistance } from "modules/lib/physics/getDistance";

export function isPointToCircle(point: Point, circle: Circle) {
  const distance = getDistance(point, circle);
  return distance <= circle.radius;
}
