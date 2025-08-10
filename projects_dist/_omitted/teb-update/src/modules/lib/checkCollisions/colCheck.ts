import { Entity } from "@modules/types";

type CollisionDirection = "L" | "R" | "T" | "B";

type ReturnType = [false] | [CollisionDirection, number];
/**
 * Checks collisions taking direction into account.
 * NOTE: Modifies the `entity.col` object.
 * @returns The collision direction or `false`
 */
export function colCheck(
  _entity: Entity,
  _collider: Entity
): ReturnType {
  const entity = _entity.hitbox || _entity;
  const collider = _collider.hitbox || _collider;
  // get the vectors to check against
  const xDelta = entity.x + entity.w / 2 - (collider.x + collider.w / 2);
  const yDelta = entity.y + entity.h / 2 - (collider.y + collider.h / 2);
  // add the half widths and half heights of the objects
  const halfWidths = entity.w / 2 + collider.w / 2;
  const halfHeights = entity.h / 2 + collider.h / 2;

  // If the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  const hasCollision =
    Math.abs(xDelta) < halfWidths && Math.abs(yDelta) < halfHeights;
  if (!hasCollision) return [false];
  // figures out on which side we are colliding (top, bottom, left, or right)
  const xCol = halfWidths - Math.abs(xDelta);
  const yCol = halfHeights - Math.abs(yDelta);

  const TRESHOLD = 0;

  const side = xCol >= yCol ? (yDelta > 0 ? "T" : "B") : xDelta > 0 ? "L" : "R";
  const amount = Math.max(xCol, yCol) > TRESHOLD ? Math.min(xCol, yCol) : 0;
  // Returns the biggest collision
  // `amount` should be added to the `side` in the entity col object
  return [side, amount];
}
