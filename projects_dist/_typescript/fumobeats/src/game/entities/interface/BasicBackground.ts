import { imagesIndex } from "assets/images";
import { InterfaceEntity } from "game/entities/interface/InterfaceEntity";
import { ComputeProps } from "modules/Entity/Entity";

const bgImages = [
  imagesIndex._bg_1_png,
  imagesIndex._bg_1a_png,
  imagesIndex._bg_1b_png,
  imagesIndex._bg_1c_png,
  imagesIndex._bg_2_png,
].map((src) => {
  const image = new Image();
  image.src = src;
  return image;
});
export class BasicBackground extends InterfaceEntity {
  constructor(type: number, w: number, h: number) {
    super(0, 0, w, h);
    this.sheet = bgImages[type];
    this.setAnimation("idle", { xFrames: [0], yFrames: [0] });
  }
  compute({view}:ComputeProps) {
    this.animations["idle"]!.offset=view.shakeOffset
  }
}
