import { Rect, Point } from "modules/types/shapes";
import { rayToRect } from "./rayToRect";

/** Swaps 2 values */
export function isDynamicRectToRect(
    rectA: Rect,
    rectB: Rect,
    xVel: number,
    yVel: number,
    deltaTime: number,
    contactPoint: Point,
    contactNormal: Point,
    contactTime: { value: any }
  ) {
    // Check if dynamic rectangle is actually moving
    // we assume rectangles are NOT in collision to start
    if (xVel == 0 && yVel == 0) {
      return false;
    }
    contactTime.value = 0;
    // Expand target rectangle by source dimensions
    let expanded = {
      x: rectB.x - rectA.w / 2,
      y: rectB.y - rectA.h / 2,
      w: rectB.w + rectA.w,
      h: rectB.h + rectA.h,
    };
    /** debug broadHitbox*/
    //debug.drawRect(expanded, "orange")
    let centerRectA = {
      x: rectA.x + rectA.w / 2,
      y: rectA.y + rectA.h / 2,
    };
    let direction = {
      x: xVel * deltaTime,
      y: yVel * deltaTime,
    };
    if (
      rayToRect(
        centerRectA,
        direction,
        expanded,
        contactPoint,
        contactNormal,
        contactTime
      )
    ) {
      //console.log('ray v rect returned ct', contactTime.value)
      return contactTime.value >= 0 && contactTime.value < 1;
    } else {
      //console.log('ray v rect returned false')
      return false;
    }
  }
  