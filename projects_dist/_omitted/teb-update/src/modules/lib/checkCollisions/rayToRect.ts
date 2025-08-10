import { Point, Rect } from "../shapes";

export function rayToRect(
    origin: Point,
    direction: Point,
    target: Rect,
    contactPoint: Point,
    contactNormal: Point,
    timeHitNear: { value: number }
  ) {
    contactPoint.x = 0;
    contactPoint.y = 0;

    contactNormal.x = 0;
    contactNormal.y = 0;
  
    // Cache division
    let inverseDir = {
      x: 1 / direction.x,
      y: 1 / direction.y,
    };
    // Calculate intersections with rectangle bounding axes
    let timeNear = {
      x: (target.x - origin.x) * inverseDir.x,
      y: (target.y - origin.y) * inverseDir.y,
    };
    let timeFar = {
      x: (target.x + target.w - origin.x) * inverseDir.x,
      y: (target.y + target.h - origin.y) * inverseDir.y,
    };
    if (isNaN(timeFar.y) || isNaN(timeFar.x)) {
      return false;
    }
    if (isNaN(timeNear.y) || isNaN(timeNear.x)) {
      return false;
    }
  
    // Sort distances
    if (timeNear.x > timeFar.x) {
      let temp = timeNear.x;
      timeNear.x = timeFar.x;
      timeFar.x = temp;
    }
    if (timeNear.y > timeFar.y) {
      let temp = timeNear.y;
      timeNear.y = timeFar.y;
      timeFar.y = temp;
    }
  
    // Early rejection
    if (timeNear.x > timeFar.y || timeNear.y > timeFar.x) {
      return false;
    }
  
    // Closest 'time' will be the first contact
    timeHitNear.value = Math.max(timeNear.x, timeNear.y);
  
    // Furthest 'time' is contact on opposite side of target
    let timeHitFar = Math.min(timeFar.x, timeFar.y);
  
    // Reject if ray direction is pointing away from object
    if (timeHitFar < 0) {
      return false;
    }
  
    // Contact point of collision from parametric line equation
    contactPoint.x = origin.x + timeHitNear.value * direction.x;
    contactPoint.y = origin.y + timeHitNear.value * direction.y;
  
    if (timeNear.x > timeNear.y) {
      if (inverseDir.x < 0) {
        contactNormal.x = 1;
        contactNormal.y = 0;
      } else {
        contactNormal.x = -1;
        contactNormal.y = 0;
      }
    } else if (timeNear.x < timeNear.y) {
      if (inverseDir.y < 0) {
        contactNormal.x = 0;
        contactNormal.y = 1;
      } else {
        contactNormal.x = 0;
        contactNormal.y = -1;
      }
    }
    return true;
  }