import { Entity } from "../../entity";
import { Controls } from "../../controls";
import { Mouse, MetaLike, CameraLike } from "../../mouse";
import debug from "modules/debug";
import Camera from "modules/camera";
export class Player extends Entity {
  controls: Controls;
  mouse: Mouse;
  camera: Camera;
  constructor(
    x: number,
    y: number,
    canvas: HTMLCanvasElement,
    meta: MetaLike,
    camera: Camera
  ) {
    super(x, y);
    this.mouse = new Mouse(canvas, meta, camera);
    this.controls = new Controls();
    this.camera = camera;
    this.w = 1;
    this.h = 1;
  }
  resolveInputs = () => {
    // Moves
    if (this.controls.up && !this.controls.down) {
      this.xVel = Math.cos(-this.rot+Math.PI/2) * -this.speed;
      this.yVel = Math.sin(-this.rot+Math.PI/2) * -this.speed;
    }
    if (this.controls.down && !this.controls.up) {
      this.xVel = Math.cos(-this.rot+Math.PI/2) * this.speed;
      this.yVel = Math.sin(-this.rot+Math.PI/2) * this.speed;
    }
    if (!this.controls.up&&!this.controls.down) {
      this.xVel = 0;
      this.yVel = 0;
    }
  };
  compute = (deltaTime: number) => {
    this.mouse.updatePos();
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
    debug.drawPoint(this.mouse, "green");
  };
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera?: {
      x: number;
      y: number;
    },
    pivot: { x: number; y: number } = { x: this.w / 2, y: this.h / 2 }
  ) => {
    const rot = this.rot;
    this.rot = 0;
    this.renderSquare(context, tilesize, ratio, camera, pivot);
    this.rot = rot;
    context.fillStyle = "red";
    context.fillStyle = "black";
  };
}
export default Player;
