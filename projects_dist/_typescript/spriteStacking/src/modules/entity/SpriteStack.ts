import Entity from "modules/entity/Entity";
import { Sprite } from "modules/entity/Sprite";

export class SpriteStack extends Sprite {
  offset: number = 0;
  constructor(x: number, y: number, offset: number = 0) {
    super(x, y);
    this.offset = offset;
  }
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number; rot: number } = { x: 0, y: 0, rot: 0 },
    pivot: { x: number; y: number } = { x: this.w / 2, y: this.h / 2 }
  ) => {
    if (!this.display) {
      // Skips rendering
      return;
    }
    if (this.removed) {
      //console.log('rendering a removed entity!!!')
    }
    /** Rotated Rendering */
    context.save();
    context.translate(
      ((pivot.x+this.x+this.w/2+camera.x) *
        tilesize *
        ratio) |
        0,
      ((pivot.y+this.y+this.h/2+camera.y ) *
        tilesize *
        ratio) |
        0
    );
    context.rotate(camera.rot);
    context.drawImage(
      this.sheet, // source of the sprite
      this.animations[this.animation].keyframesX[this.left][this.frame] *
        tilesize, // x pos of the sprite
      this.animations[this.animation].keyframesY[this.left][this.frame] *
        tilesize, // y pos of the sprite
      this.animations[this.animation].w * tilesize, // width of the sprite
      this.animations[this.animation].h * tilesize, // height of the sprite
      (-pivot.x * tilesize * ratio) | 0, // x of the entity
      (-pivot.y * tilesize * ratio) | 0, // y of the entity
      (this.animations[this.animation].w * tilesize * ratio) | 0, // width of the entity
      (this.animations[this.animation].h * tilesize * ratio) | 0 // height of the entity
    );
    context.restore();
  };
}
