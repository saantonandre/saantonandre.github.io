interface Point {
  x: number;
  y: number;
}
interface Rect extends Point {
  w: number;
  h: number;
}
export class SpriteAnimation {
  /** `x` positions on the spritesheet */
  xFrames: number[][];
  /** `y` positions on the spritesheet */
  yFrames: number[][];
  /** Defines how many game-frames should be skipped before each next animation-frame */
  slowness = 6;
  rot = 0;
  w = 1;
  h = 1;
  offset: Point;
  constructor(reference: Rect) {
    this.xFrames = [[], []];
    this.yFrames = [[], []];
    this.offset = { x: 0, y: 0 };

    this.w = reference.w;
    this.h = reference.h;
  }
}
