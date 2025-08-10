import Controls from "modules/controls";
import debug from "modules/debug";
import Entity, { Sprite } from "modules/entity";
import Mouse, { MetaLike, CameraLike } from "modules/mouse";

export class Neuro extends Entity {
  controls: Controls;
  mouse: Mouse;
  head: Sprite;
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
    this.w = 2;
    this.h = 2;
    this.setAnimation("idle", [0], [0]);
    this.animations["idle"].offsetRot = Math.PI / 2;
    this.setAnimation("boost", [0, 0, 0, 0], [2, 4, 6, 8]);
    this.animations["boost"].offsetRot = Math.PI / 2;
    this.head = new Sprite(x, y, 2, 2);
    this.head.setAnimation("idle", [0], [12]);
    this.head.animations["idle"].offsetRot = Math.PI / 2;
  }
  resolveInputs = (deltaTime: number) => {
    // Moves
    const accelleration = this.speed * 0.1 * deltaTime;
    if (!this.controls.lClickDown) {
      if (this.animation !== "idle") this.animation = "idle";
      this.xVel *= 0.95 * deltaTime;
      this.yVel *= 0.95 * deltaTime;
    } else {
      if (this.animation !== "boost") this.animation = "boost";
      this.xVel += Math.cos(this.rot) * accelleration;
      this.yVel += Math.sin(this.rot) * accelleration;
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
    this.resolveInputs(deltaTime);
    this.updateVelocities(deltaTime);
    this.updatePosition(deltaTime);
    this.updateHitbox();
    this.updateSprite(deltaTime);
    debug.inspect(this);
    debug.drawPoint(this.centerPoint);
    debug.drawPoint(this.mouse, "green");
    debug.drawLine(this.centerPoint, this.mouse, "pink");
    this.head.x = this.x;
    this.head.y = this.y-0.2;
    this.head.rot = this.rot;
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
    this.renderSprite(context, tilesize, ratio, camera);
    this.head.renderSprite(context, tilesize, ratio, camera, {
      x: this.w / 2,
      y: 1.2,
    });
    context.fillStyle = "red";
    context.fillStyle = "black";
  };
}
