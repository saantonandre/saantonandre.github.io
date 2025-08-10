import { Entity } from "modules/Entity";
import { isRectToRect } from "../isRectToRect";
import { isDynamicRectToRect } from "./isDynamicRectToRect";
import { resolveDynamicRectToRect } from "./resolveDynamicRectToRect";
import { colCheck } from "./colCheck";
import { Rect } from "modules/types/shapes";

/** Bigger hitbox for the broad phase */
const broadHitbox = new Rect();

/** Gets called after the velocities have been set
 *
 * Contains my own javascript implementation of the SWEPT AABB algorithm, after taking to account many resources on the matter:
 * @link https://www.youtube.com/watch?v=8JJ-4JgR7Dg
 * @link https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
 * @link https://blog.hamaluik.ca/posts/swept-aabb-collision-using-minkowski-difference/
 */

export function checkCollisions(
  obj: Entity,
  entities: Entity[],
  deltaTime = 1,
  idExceptions?: number[]
) {
  if (!obj.solid) {
    // return false if the object calling this function is not solid
    return false;
  }
  // Decides if the col should be checked normally, without vectors
  simpleCollisionCheck(obj, entities, idExceptions);
  if (obj.xVel + obj.xVelExt + obj.yVel + obj.yVelExt === 0) {
    return;
  }

  // Broad Phase
  // Step 1: Create a broad hitbox with the added size of the velocities
  let velocitiesX = obj.xVel + obj.xVelExt;
  let velocitiesY = obj.yVel + obj.yVelExt;

  /** If the object has an hitbox property, check collision with that */
  let objHitbox = obj.hitbox ? obj.hitbox : obj;

  broadHitbox.x = objHitbox.x;
  broadHitbox.y = objHitbox.y;
  broadHitbox.w = objHitbox.w + velocitiesX * deltaTime;
  broadHitbox.h = objHitbox.h + velocitiesY * deltaTime;
  if (velocitiesX <= 0) {
    broadHitbox.x += velocitiesX * deltaTime;
    broadHitbox.w -= velocitiesX * deltaTime * 2;
  }
  if (velocitiesY <= 0) {
    broadHitbox.y += velocitiesY * deltaTime;
    broadHitbox.h -= velocitiesY * deltaTime * 2;
  }

  /** gameDebug player dir*/
  //gameDebug.drawLine({ x: obj.centerX, y: obj.centerY }, { x: obj.centerX + velocitiesX * deltaTime, y: obj.centerY + velocitiesY * deltaTime }, "#f0eceb")
  /** gameDebug broadHitbox*/
  //gameDebug.drawRect(broadHitbox, "cyan")

  /** Vector containing pairs of (ID, contactTime) */
  let colPointsVector = [];
  /** Contact Time */
  const ct = { value: 0.0 };
  /** Contact Point */
  const cp = { x: 0, y: 0 };
  /** Contact normal */
  const cn = { x: 0, y: 0 };

  /** Defines if the level has been changed */
  let levelChange = false;
  // Step 2:
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    // Skip collision exceptions
    if (isCollisionException(obj, entity, idExceptions)) {
      continue;
    }
    // BROAD
    // Checks broad hitbox collisions with entities
    if (isRectToRect(broadHitbox, entity.hitbox)) {
      // Checks corner points collisions

      // NARROW
      // If the entity has an hitbox, use it instead
      let entityHitbox = entity.hitbox ? entity.hitbox : entity;
      // Swept collision check
      if (
        isDynamicRectToRect(
          objHitbox,
          entityHitbox,
          velocitiesX,
          velocitiesY,
          deltaTime,
          cp,
          cn,
          ct
        )
      ) {
        // Handles eventual collision events
        if (obj.onCollision) {
          obj.onCollision(entity);
        }
        // Skip resolve exceptions
        if (resolveException(obj, entity)) {
          continue;
        }
        colPointsVector.push({ id: i, ct: ct.value });

        // Compute point colliders
      }
    }
  }
  if (levelChange) {
    // Entities are changed, no point in resolving
    return;
  }
  if (colPointsVector.length === 0) {
    //console.log('No colliders were found, obj xVel = ', obj.xVel)
    return;
  }
  // Do the sort
  colPointsVector.sort((a, b) => {
    return a.ct - b.ct;
  });
  // Now resolve the collision in correct order
  for (let rect of colPointsVector) {
    resolveDynamicRectToRect(obj, deltaTime, entities[rect.id]);
  }

  /**
   * Fixes slide direction change in case velocities were initially diagonal
   * (Its' implied that at least one of the velocities isn't 0)
   * (Its' also implied there has been a collision at this point)
   *
   */
  if (velocitiesX !== 0 && velocitiesY !== 0) {
    //console.log("Recursion happened");
    // checkCollisions(obj, entities, deltaTime);
  }
}
/** Gets called if a more advanced colcheck is not necessary */
export function simpleCollisionCheck(
  obj: Entity,
  entities: Entity[],
  idExceptions?: number[]
) {
  for (let entity of entities) {
    if (isCollisionException(obj, entity, idExceptions)) {
      continue;
    }
    if (isRectToRect(obj, entity)) {
      if (obj.onCollision) {
        obj.onCollision(entity);
      }
      if (entity.onCollision) {
        entity.onCollision(obj);
      }
      if (resolveException(obj, entity)) {
        continue;
      }
      colCheck(obj, entity);
    }
  }
}

/** Defines whether the collision check is unnecessary */
function isCollisionException(
  obj: Entity,
  entity: Entity,
  idExceptions?: number[]
) {
  if (
    entity.removed ||
    entity.id === obj.id ||
    idExceptions?.includes(entity.id)
  ) {
    return true;
  }
  return false;
}
/** Defines whether the collision resolve should be avoided */
function resolveException(obj: Entity, entity: Entity) {
  if (
    !entity.solid ||
    entity.removed ||
    entity.id === obj.id ||
    (entity.grounded && !obj.grounded)
  ) {
    return true;
  }
  return false;
}
