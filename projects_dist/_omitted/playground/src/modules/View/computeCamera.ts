import { Rect } from "modules/types/shapes";
import { View } from "./View";

/**
 * Updates the camera position of a view
 * @param deltaTime
 */
export function computeCamera(view: View, deltaTime: number) {
  const boundingBox = {
    x: -100,
    y: -100,
    w: 100,
    h: 100,
  };
  if (boundingBox.w < view.tilesWidth + 1) {
    boundingBox.x -= (view.tilesWidth + 1 - boundingBox.w) / 2;
    boundingBox.w = view.tilesWidth + 1;
  }
  if (boundingBox.h < view.tilesHeight + 1) {
    boundingBox.y -= (view.tilesHeight + 1 - boundingBox.h) / 2;
    boundingBox.h = view.tilesHeight + 1;
  }
  if (view.zoom) {
    view.changeRatio(
      view.ratio + ((view.baseRatio - view.ratio) / 22) * deltaTime
    );
  }
  /** Target new x position */
  let xx = 0;
  /** Target new y position */
  let yy = 0;
  if (view.focus) {
    xx = -(view.focus.x + view.focus.w / 2 - view.tilesWidth / 2);
    yy = -(view.focus.y + view.focus.h / 2 - view.tilesHeight / 2);
    view.x += ((xx - view.x) / 15) * deltaTime;
    view.y += ((yy - view.y) / 15) * deltaTime;
  }
  if (view.lockedBounds) {
    let xChanged = false;
    let yChanged = false;
    if (-view.x < boundingBox.x) {
      xx = -boundingBox.x;
      xChanged = true;
    }
    if (-view.y < boundingBox.y) {
      yy = -boundingBox.y;
      yChanged = true;
    }

    if (-view.x > boundingBox.x + boundingBox.w - view.tilesWidth) {
      xx = -(boundingBox.x + boundingBox.w - view.tilesWidth);
      xChanged = true;
    }
    if (-view.y > boundingBox.y + boundingBox.h - view.tilesHeight) {
      yy = -(boundingBox.y + boundingBox.h - view.tilesHeight);
      yChanged = true;
    }
    if (xChanged) {
      view.x += ((xx - view.x) / 6) * deltaTime;
    }
    if (yChanged) {
      view.y += ((yy - view.y) / 6) * deltaTime;
    }
  }

  if (view.shake > 0) {
    view.x += Math.random() / 2 - 0.25;
    view.y += Math.random() / 2 - 0.25;
    view.shake -= deltaTime;
  }
}
