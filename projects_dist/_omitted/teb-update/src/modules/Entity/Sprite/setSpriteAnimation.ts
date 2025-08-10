import { SpriteAnimation } from "@modules/Entity/Sprite/Animation";
import {  SpriteT } from "@modules/Entity/Sprite/Sprite";
import { Point } from "@modules/lib/shapes";


type Config = Partial<{
  xFrames: number[];
  yFrames: number[];
  left: 0 | 1;
  offset: Point;
  rot: number;
}>;

export function setSpriteAnimation(
  this: SpriteT,
  label: string,
  config?: Config
) {
  if (config?.xFrames && config?.yFrames) {
    const deltaLen = config.xFrames.length - config.yFrames.length;
    if (deltaLen > 0) {
      const startIndex = config.yFrames.length - 1;
      for (let i = 0; i < deltaLen; i++) {
        config.yFrames.push(config.yFrames[startIndex]);
      }
    }
    if (deltaLen < 0) {
      const startIndex = config.xFrames.length - 1;
      for (let i = 0; i < Math.abs(deltaLen); i++) {
        config.xFrames.push(config.xFrames[startIndex]);
      }
    }
  }

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
  return animation;
}
