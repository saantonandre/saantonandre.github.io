import Entity from "modules/entity/Entity";
import { SpriteStack } from "modules/entity/SpriteStack";

export class Stacked extends Entity {
  offSet: number = 2;
  stacks: SpriteStack[] = [];
  constructor(x: number, y: number) {
    super(x, y);
    this.stacks.push(
      ...[0, 0.2, 0.4, 0.6, 0.8, 1].map((offset, i) => {
        const stack = new SpriteStack(this.x, this.y, offset);
        stack.setAnimation("idle", [0], [i]);
        return stack;
      })
    );
  }
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number; rot: number } = { x: 0, y: 0, rot: 0 },
    pivot: { x: number; y: number } = { x: this.w / 2, y: this.h / 2 }
  ) => {
    this.stacks.forEach((stack) => {
      stack.x = this.x;
      stack.y = this.y-stack.offset;
      stack.render(context, tilesize, ratio, camera,pivot);
    });
  };
}
