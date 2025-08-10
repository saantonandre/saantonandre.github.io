import { Entity } from "../../entity";
import { Controls } from "../../controls";
import { Mouse, MetaLike, CameraLike } from "../../mouse";
import debug from "modules/debug";
export class Player extends Entity {
  controls: Controls;
  mouse: Mouse;
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
  }
  resolveInputs = () => {
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
    if(this.controls.rClickDown){
      this.yVel=2;
    }
  };
  compute = (deltaTime: number) => {
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
    debug.inspect(this);
    debug.drawPoint(this.centerPoint);
    debug.drawPoint(this.mouse,"green");
    debug.drawLine(this.centerPoint,this.mouse,"pink");
  };
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    }
  ) => {
    this.renderSquare(context, tilesize, ratio, camera);
    context.fillStyle = "red";
    context.fillStyle = "black";
  };
}
export default Player;
