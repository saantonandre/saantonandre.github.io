import { imagesIndex } from "assets/images";
import { Player } from "game/entities/game/Player/Player";
import { Sprite } from "modules/Entity";
import { ComputeProps } from "modules/Entity/Entity";
import { View } from "modules/View";
import { Point } from "modules/types/shapes";

const monoSheet = new Image();
monoSheet.src = imagesIndex._sheet3_png;
export class ShadowClone extends Sprite {
  arm = new Sprite(0, 0);
  opacity = 0;
  scale = 1;
  x0: number = 0;
  y0: number = 0;
  w0: number = 0;
  h0: number = 0;
  x0Arm: number = 0;
  y0Arm: number = 0;
  w0Arm: number = 0;
  h0Arm: number = 0;
  w = 3;
  h = 5;
  hue = Math.random() * 360;
  constructor() {
    super();
    const left = 1;
    this.sheet = monoSheet;
    this.arm.sheet = monoSheet;
    this.arm.w = 2;
    this.arm.h = 1;
    this.setAnimation("idle", { xFrames: [0], yFrames: [0] });
    this.setAnimation("idle", { xFrames: [3], yFrames: [0], left });
    this.setAnimation("punch", { xFrames: [12], yFrames: [0] });
    this.setAnimation("punch", { xFrames: [15], yFrames: [0], left });
    this.setAnimation("damaged", { xFrames: [0], yFrames: [5] });
    this.setAnimation("damaged", { xFrames: [3], yFrames: [5], left });
    const offset = { ...new Point(0, -this.h / 2), rot: 0 };
    this.arm.setAnimation("idle", { xFrames: [0], yFrames: [13] });
    this.arm.setAnimation("idle", { xFrames: [2], yFrames: [13], left });
    this.arm.animations["idle"]!.offset = offset;
  }
  init(player: Player) {
    this.opacity = 0.7;
    this.scale = 1;
    this.hue = Math.random() * 360;
    this.w = 3;
    this.h = 5;
    this.arm.w = 2;
    this.arm.h = 1;

    this.animation = player.animation;
    this.left = player.left;
    this.arm.x = player.arm.x;
    this.arm.y = player.arm.y + 2;
    this.arm.animation = player.arm.animation;
    this.arm.left = player.arm.left;
    this.arm.rot = player.arm.rot;
    this.x = player.x;
    this.y = player.y;
    this.x0 = this.x;
    this.y0 = this.y;
    this.w0 = this.w;
    this.h0 = this.h;
    this.x0Arm = this.arm.x;
    this.y0Arm = this.arm.y;
    this.w0Arm = this.arm.w;
    this.h0Arm = this.arm.h;
  }
  compute({ dt }: ComputeProps) {
    if (this.opacity <= 0) return;
    this.opacity -= dt / 30;
    this.scale += dt / 50;
    const wIncrease = this.w0 * this.scale - this.w0;
    const hIncrease = this.h0 * this.scale - this.h0;
    this.x = this.x0 - wIncrease / 2;
    this.y = this.y0 - hIncrease / 2;
    this.w = this.w0 + wIncrease;
    this.h = this.h0 + hIncrease;

    const xOffset = this.x0Arm - this.x0;
    this.arm.x = this.x + xOffset * this.scale;
    this.arm.y = this.y0Arm - hIncrease / 4;
    this.arm.w = this.w0Arm * this.scale;
    this.arm.h = this.h0Arm * this.scale;
  }
  render(view: View) {
    if (this.opacity <= 0) return;
    const prevAlpha = view.context.globalAlpha;
    view.context.globalAlpha = this.opacity;
    view.context.filter = `hue-rotate(${this.hue}deg)`;
    this.renderSprite(view);
    this.arm.renderSprite(view, new Point(0, this.arm.h / 2));
    view.context.globalAlpha = prevAlpha;
    view.context.filter = "none";
  }
}
