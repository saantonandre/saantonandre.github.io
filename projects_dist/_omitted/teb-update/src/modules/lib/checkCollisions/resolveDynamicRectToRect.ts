import { isDynamicRectToRect } from "./isDynamicRectToRect";
import { Entity } from "@modules/types";

export function resolveDynamicRectToRect(
  entity: Entity,
  deltaTime: number,
  collider: Entity
) {
  let contactPoint = { x: 0, y: 0 };
  let contactNormal = { x: 0, y: 0 };
  let contactTime = { value: 0.0 };
  let velocitiesX = entity.xVel + entity.xVelExt;
  let velocitiesY = entity.yVel + entity.yVelExt;

  let entityHitbox = entity.hitbox ? entity.hitbox : entity;
  let colliderHitbox = collider.hitbox ? collider.hitbox : collider;
  //gameDebug.drawRect(colliderHitbox, 'cyan')
  if (
    isDynamicRectToRect(
      entityHitbox,
      colliderHitbox,
      velocitiesX,
      velocitiesY,
      deltaTime,
      contactPoint,
      contactNormal,
      contactTime
    )
  ) {
    let overlapFixMultiplier = 1.0001;
    entity.xVel +=
      contactNormal.x *
      Math.abs(entity.xVel) *
      (1.0 - contactTime.value) *
      overlapFixMultiplier;
    entity.yVel +=
      contactNormal.y *
      Math.abs(entity.yVel) *
      (1.0 - contactTime.value) *
      overlapFixMultiplier;

    entity.xVelExt +=
      contactNormal.x *
      Math.abs(entity.xVelExt) *
      (1.0 - contactTime.value) *
      overlapFixMultiplier;
    entity.yVelExt +=
      contactNormal.y *
      Math.abs(entity.yVelExt) *
      (1.0 - contactTime.value) *
      overlapFixMultiplier;
    return true;
  }
  return false;
}
