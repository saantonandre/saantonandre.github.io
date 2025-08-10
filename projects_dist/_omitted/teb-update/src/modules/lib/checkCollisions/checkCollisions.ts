import { isRectToRect } from "../geometry";
import { isDynamicRectToRect } from "./isDynamicRectToRect";
import { resolveDynamicRectToRect } from "./resolveDynamicRectToRect";
import { colCheck } from "./colCheck";
import { type Entity } from "@modules/types";

interface Point {
  x: number;
  y: number;
}
interface Rect extends Point {
  w: number;
  h: number;
}

/** Bigger hitbox for the broad phase */
const BROAD_HITBOX: Rect = { x: 0, y: 0, w: 0, h: 0 };
/** Contact Time */
const ct = { value: 0.0 };
/** Contact Point */
const cp: Point = { x: 0, y: 0 };
/** Contact normal */
const cn: Point = { x: 0, y: 0 };

/**
 * Should get called after the velocities have been set
 *
 * Contains my own javascript implementation of the SWEPT AABB algorithm, after taking to account many resources on the matter:
 * @link https://www.youtube.com/watch?v=8JJ-4JgR7Dg
 * @link https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
 * @link https://blog.hamaluik.ca/posts/swept-aabb-collision-using-minkowski-difference/
 */

export function checkCollisions(
  entity: Entity,
  entities: Entity[],
  deltaTime = 1,
  idExceptions?: number[]
) {
  // Decides if the col should be checked normally, without vectors
  simpleCollisionCheck(entity, entities, idExceptions);
  if (entity.xVel + entity.xVelExt + entity.yVel + entity.yVelExt === 0) {
    return;
  }

  // Broad Phase
  // Step 1: Create a broad hitbox with the added size of the velocities
  let velocitiesX = entity.xVel + entity.xVelExt;
  let velocitiesY = entity.yVel + entity.yVelExt;

  /** If the object has an hitbox property, check collision with that */
  let objHitbox = entity.hitbox ? entity.hitbox : entity;
  const toLeft = velocitiesX <= 0;
  const toUp = velocitiesY <= 0;

  const broadHitbox = BROAD_HITBOX;
  broadHitbox.x = objHitbox.x + (toLeft ? velocitiesX * deltaTime : 0);
  broadHitbox.y = objHitbox.y + (toUp ? velocitiesY * deltaTime : 0);
  broadHitbox.w = objHitbox.w + Math.abs(velocitiesX) * deltaTime;
  broadHitbox.h = objHitbox.h + Math.abs(velocitiesY) * deltaTime;

  /** gameDebug player dir*/
  // gameDebug.drawLine(
  //   [
  //     entity.center,
  //     Point.temp(
  //       entity.xCenter + velocitiesX * deltaTime,
  //       entity.yCenter + velocitiesY * deltaTime
  //     ),
  //   ],
  //   "#f0eceb"
  // );
  /** gameDebug broadHitbox*/
  // gameDebug.drawRect(broadHitbox, "cyan");

  /** Vector containing pairs of (ID, contactTime) */
  let colPointsVector = [];

  // Reset values
  ct.value = 0.0;

  cp.x = 0;
  cp.y = 0;

  cn.x = 0;
  cn.y = 0;

  // Step 2:
  for (let i = 0; i < entities.length; i++) {
    const collider = entities[i];
    // Skip collision exceptions
    if (isCollisionException(entity, collider, idExceptions)) {
      continue;
    }
    // BROAD
    // Checks broad hitbox collisions with entities
    if (isRectToRect(broadHitbox, collider.hitbox || collider)) {
      // Checks corner points collisions

      // NARROW
      // If the entity has an hitbox, use it instead
      // Swept collision check
      if (
        isDynamicRectToRect(
          objHitbox,
          collider.hitbox || collider,
          velocitiesX,
          velocitiesY,
          deltaTime,
          cp,
          cn,
          ct
        )
      ) {
        // Handles eventual collision events
        if (entity.onCollision) {
          entity.onCollision(collider);
        }
        // Skip resolve exceptions
        if (resolveException(entity, collider)) {
          continue;
        }
        colPointsVector.push({ id: i, ct: ct.value });

        // Compute point colliders
      }
    }
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
    resolveDynamicRectToRect(entity, deltaTime, entities[rect.id]);
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
  entity: Entity,
  entities: Entity[],
  idExceptions?: number[]
) {
  for (const collider of entities) {
    if (isCollisionException(entity, collider, idExceptions)) {
      continue;
    }
    if (isRectToRect(entity.hitbox || entity, collider.hitbox || collider)) {
      // gameDebug.drawRect(collider.hitbox, "cyan");
      entity.onCollision?.(collider);
      collider.onCollision?.(entity);
      if (resolveException(entity, collider)) {
        continue;
      }
      const [dir, amount] = colCheck(entity, collider);
      if (dir) entity.col[dir] += amount;
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
