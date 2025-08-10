import Entity from "../../entity";

export type OffsetPositioning = {
  x: () => number;
  y: () => number;
  rot: () => number;
  delay:()=>number
};
export class Sword extends Entity {
  source: Entity;
  offsetPositioning: OffsetPositioning;
  constructor(
    source: Entity,
    offsetPositioning: OffsetPositioning = {
      x: () => 0,
      y: () => 0,
      rot: () => 0,
      delay:()=>12
    }
  ) {
    super(source.x, source.y);
    this.rot = source.rot;
    this.w = 1;
    this.h = 1;
    this.source = source;
    this.offsetPositioning = offsetPositioning;
    this.setAnimation("idle", [4], [0]);
    this.setAnimation("attack", [4], [1]);
    this.setAnimation("defend", [4], [2]);
  }
  //Math.cos(this.source.rot+1.5)
  //Math.sin(this.source.rot+1.5)
  follow(deltaTime: number) {
    const relativePositioning = {
      x: this.source.x + this.offsetPositioning.x(),
      y: this.source.y + this.offsetPositioning.y(),
    };
    this.x +=
      ((relativePositioning.x + this.source.w / 2 - this.w / 2 - this.x) / this.offsetPositioning.delay()) *
      deltaTime;

    this.y +=
      ((relativePositioning.y + this.source.h / 2 - this.h / 2 - this.y) / this.offsetPositioning.delay()) *
      deltaTime;
    // Handle the case when the rot is back to 0
    // 3.14 / -3.14
    // add +1
    const target = this.source.rot + this.offsetPositioning.rot();
    if (target - this.rot > Math.PI) {
      this.rot += Math.PI * 2;
    } else if (target - this.rot < -Math.PI) {
      this.rot -= Math.PI * 2;
    } else {
      this.rot += ((target - this.rot) / this.offsetPositioning.delay()) * deltaTime;
    }
  }
  attack() {}
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    }
  ) {
    const pivot = { x: this.w / 2, y: this.h / 2 };
    this.renderSprite(context, tilesize, ratio, camera, pivot);
  }
}

export default Sword;
