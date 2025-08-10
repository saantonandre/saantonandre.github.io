import Entity from "modules/entity";
import { Meta } from "modules/meta";
export class Camera {
  focus: Rect | Entity;
  lockedAngles = true;
  zoom = true;
  x: number;
  y: number;
  shake = 0;
  constructor(focus = { x: 0, y: 0, w: 0, h: 0 }) {
    this.focus = focus;
    this.x = focus.x;
    this.y = focus.y;
  }
  changeFocus(actor: Rect, smoothly = false) {
    this.focus = actor;
    if (!smoothly) {
      this.x = -this.focus.x;
      this.y = -this.focus.y;
    }
  }
  /**
   * Updates the camera position
   *
   * @param {MetaLike} meta
   * @param {Object} boundingSq A square defining the map boundaries
   */
  compute(meta: Meta, boundingSq: Rect) {
    let boundingBox = boundingSq;
    if (boundingBox.w < meta.tilesWidth + 1) {
      boundingBox.x -= (meta.tilesWidth + 1 - boundingBox.w) / 2;
      boundingBox.w = meta.tilesWidth + 1;
    }
    if (boundingBox.h < meta.tilesHeight + 1) {
      boundingBox.y -= (meta.tilesHeight + 1 - boundingBox.h) / 2;
      boundingBox.h = meta.tilesHeight + 1;
    }
    // Compute the ratio
    if (this.zoom) {
      meta.changeRatio(
        meta.ratio + ((meta.baseRatio - meta.ratio) / 22) * meta.deltaTime
      );
    } else {
      /*
      if (meta.ratio !== meta.baseRatio) {
        meta.ratio = meta.baseRatio;
        meta.tilesWidth = meta.baseTilesWidth;
        meta.tilesHeight = meta.baseTilesHeight;
      }
      */
    }
    // Updates meta pos

    /** Target new x position */
    let xx = 0;
    /** Target new y position */
    let yy = 0;
    if (this.focus) {
      xx = -(this.focus.x + this.focus.w / 2 - meta.tilesWidth / 2);
      yy = -(this.focus.y + this.focus.h / 2 - meta.tilesHeight / 2);
      this.x += ((xx - this.x) / 15) * meta.deltaTime;
      this.y += ((yy - this.y) / 15) * meta.deltaTime;
    }
    if (this.lockedAngles) {
      // left boundary
      let xChanged = false;
      let yChanged = false;
      if (-this.x < boundingBox.x) {
        xx = -boundingBox.x;
        xChanged = true;
      }
      // top boundary

      if (-this.y < boundingBox.y) {
        yy = -boundingBox.y;
        yChanged = true;
      }

      // Right boundary
      if (-this.x > boundingBox.x + boundingBox.w - meta.tilesWidth) {
        xx = -(boundingBox.x + boundingBox.w - meta.tilesWidth);
        xChanged = true;
      }
      // Down boundary
      if (-this.y > boundingBox.y + boundingBox.h - meta.tilesHeight) {
        yy = -(boundingBox.y + boundingBox.h - meta.tilesHeight);
        yChanged = true;
      }
      /* Describe what does this do
      if (xChanged) {
        this.x += ((xx - this.x) / 6) * meta.deltaTime;
      }
      if (yChanged) {
        this.y += ((yy - this.y) / 6) * meta.deltaTime;
      }
      */
    }

    if (this.shake > 0) {
      this.x += Math.random() / 2 - 0.25;
      this.y += Math.random() / 2 - 0.25;
      this.shake -= meta.deltaTime;
    }
  }
}

export default Camera;
