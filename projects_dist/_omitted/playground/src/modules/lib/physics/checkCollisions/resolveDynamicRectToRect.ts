import { Entity } from "modules/entity";
import { isDynamicRectToRect } from "./isDynamicRectToRect";

export function resolveDynamicRectToRect(
    obj: Entity,
    deltaTime: number,
    rectB: Entity
  ) {
    let contactPoint = { x: 0, y: 0 };
    let contactNormal = { x: 0, y: 0 };
    let contactTime = { value: 0.0 };
    let velocitiesX = obj.xVel + obj.xVelExt;
    let velocitiesY = obj.yVel + obj.yVelExt;
  
    let objHitbox1 = obj.hitbox ? obj.hitbox : obj;
    let objHitbox2 = rectB.hitbox ? rectB.hitbox : rectB;
    //debug.drawRect(objHitbox2, 'cyan')
    if (
        isDynamicRectToRect(
        objHitbox1,
        objHitbox2,
        velocitiesX,
        velocitiesY,
        deltaTime,
        contactPoint,
        contactNormal,
        contactTime
      )
    ) {
      let overlapFixMultiplier = 1.001;
      obj.xVel +=
        contactNormal.x *
        Math.abs(obj.xVel) *
        (1.0 - contactTime.value) *
        overlapFixMultiplier;
      obj.yVel +=
        contactNormal.y *
        Math.abs(obj.yVel) *
        (1.0 - contactTime.value) *
        overlapFixMultiplier;
      obj.xVelExt +=
        contactNormal.x *
        Math.abs(obj.xVelExt) *
        (1.0 - contactTime.value) *
        overlapFixMultiplier;
      obj.yVelExt +=
        contactNormal.y *
        Math.abs(obj.yVelExt) *
        (1.0 - contactTime.value) *
        overlapFixMultiplier;
      return true;
    }
    return false;
  }