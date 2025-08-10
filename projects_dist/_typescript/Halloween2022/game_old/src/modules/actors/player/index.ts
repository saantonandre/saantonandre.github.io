import { Entity, Sprite } from "../../entity";
import { Controls } from "../../controls";
import { Mouse, MetaLike, CameraLike } from "../../mouse";
import { Scythe } from "./scythe";
export class Player extends Entity {
  controls: Controls;
  mouse: Mouse;
  scythe: Scythe;
  mantle: Sprite;
  constructor(
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    meta: MetaLike,
    camera: CameraLike
  ) {
    super(x, y);
    this.mouse = new Mouse(canvas, meta, camera);
    this.controls = new Controls();
    this.w = 1;
    this.h = 1;
    this.setAnimation("idle", [0], [0]);

    this.scythe = new Scythe(this);

    this.mantle = new Sprite(this.x, this.y);
    this.mantle.w=2;
    this.mantle.h=2;
    this.mantle.setAnimation("idle", [0,0,0,0], [1, 3, 5, 7]);

  }
  resolveInputs() {
    // Moves
    if (this.controls.left && !this.controls.right && !this.col.L) {
      this.xVel = -this.speed;
      this.left = 1;
    } else if (this.xVel < 0) {
      this.xVel = 0;
    }
    if (this.controls.right && !this.controls.left && !this.col.R) {
      this.xVel = this.speed;
      this.left = 0;
    } else if (this.xVel > 0) {
      this.xVel = 0;
    }
    if (this.controls.up && !this.controls.down && !this.col.B) {
      this.yVel = -this.speed;
    } else if (this.yVel < 0) {
      this.yVel = 0;
    }
    if (this.controls.down && !this.controls.up && !this.col.T) {
      this.yVel = this.speed;
    } else if (this.yVel > 0) {
      this.yVel = 0;
    }
    if (
      !this.controls.left &&
      !this.controls.right &&
      !this.controls.up &&
      !this.controls.down
    ) {
      this.xVel = 0;
      this.yVel = 0;
    }
    if (
      +this.controls.left +
        +this.controls.right +
        +this.controls.up +
        +this.controls.down >
      1
    ) {
      this.xVel /= 1.42;
      this.yVel /= 1.42;
    }
  }
  compute(deltaTime: number) {
    this.rot =
      this.Physics.getAngle({
        x1: this.x + this.w / 2,
        y1: this.y + this.h / 2,
        x2: this.mouse.x,
        y2: this.mouse.y,
      }) +
      Math.PI * 2;
    this.resolveInputs();
    this.updateVelocities(deltaTime);
    this.updatePosition(deltaTime);
    this.updateHitbox();
    
    this.scythe.follow(deltaTime);
    this.mantle.updateSprite(deltaTime);
    this.mantle.x += ((this.x + this.w / 2 - this.mantle.w / 2)-this.mantle.x)/5 * deltaTime;
    this.mantle.y += ((this.y + this.h / 2 - this.mantle.h / 2)-this.mantle.y)/5 * deltaTime;
    this.mantle.rot=this.rot;
  }
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    }
  ) {
    this.mantle.renderSprite(context, tilesize, ratio, camera);
    this.scythe.render(context, tilesize, ratio, camera);
    this.renderSprite(context, tilesize, ratio, camera);
  }
}
export default Player;
