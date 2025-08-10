import { Sprite } from "modules/Entity";
import { SpriteAnimation } from "modules/Entity/Sprite/Animation";
import { Point } from "modules/types/shapes";

type Config = Partial<{
  xFrames: number[];
  yFrames: number[];
  left: 0 | 1;
  offset: Point;
  rot: number;
}>;

export function setSpriteAnimation(
  this: Sprite,
  label: string,
  config?: Config
) {
  const { xFrames, yFrames, left, offset } = {
    xFrames: [],
    yFrames: [],
    left: 0,
    offset: new Point(),
    ...config,
  };

  if (!this.animations[label]) {
    this.animations[label] = new SpriteAnimation(this);
  }
  const animation = this.animations[label]!;
  animation.offset = offset;
  if (left) {
    animation.xFrames[1] = xFrames;
    animation.yFrames[1] = yFrames;
    return animation;
  }
  /** If left-facing animation was not specified use the keyframes for both ways */
  animation.xFrames[0] = xFrames;
  animation.yFrames[0] = yFrames;
  return animation
}
