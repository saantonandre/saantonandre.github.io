import { Entity } from "modules/Entity";

/**
 * Checks collisions taking direction into account.
 *  Has side effects.
 *  - Modifies the `shapeA.col` object.
 * @param shapeA 
 * @param shapeB 
 * @returns 
 */
export function colCheck(
    shapeA: Entity,
    shapeB: Entity
  ) {
    if (shapeA == null || shapeB == null) {
      return true;
    }
    // get the vectors to check against
    var shapeAA = shapeA.hitbox || shapeA,
      shapeBB = shapeB.hitbox || shapeB;
    var vX = shapeAA.x + shapeAA.w / 2 - (shapeBB.x + shapeBB.w / 2),
      vY = shapeAA.y + shapeAA.h / 2 - (shapeBB.y + shapeBB.h / 2),
      // add the half widths and half heights of the objects
      hWidths = shapeAA.w / 2 + shapeBB.w / 2,
      hHeights = shapeAA.h / 2 + shapeBB.h / 2,
      colDir = "";
  
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          if (shapeA.col.T < oY) {
            if (oY > 0.01) shapeA.col.T += oY;
          }
        } else {
          colDir = "b";
          if (shapeA.col.B < oY) {
            if (oY > 0.01) shapeA.col.B += oY;
          }
        }
      } else {
        if (vX > 0) {
          colDir = "l";
          if (shapeA.col.L < oX) {
            if (oX > 0.01) shapeA.col.L += oX;
          }
        } else {
          colDir = "r";
          if (shapeA.col.R < oX) {
            if (oX > 0.01) shapeA.col.R += oX;
          }
        }
      }
    }
  
    return colDir;
  }