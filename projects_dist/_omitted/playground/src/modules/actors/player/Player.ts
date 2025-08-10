import { Entity } from "../../entity";
import { Controls } from "../../controls";
import { Mouse, MetaLike, CameraLike } from "../../mouse";
import { debug } from "modules/debug";
import { getAngle } from "modules/lib/physics/getAngle";
import { View } from "modules/View";
export class Player extends Entity {
  controls: Controls;
  constructor(
    x: number,
    y: number,
  ) {
    super(x, y);
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
    if (this.controls.rClickDown) {
      this.yVel = 2;
    }
  };
  compute = (environment: Entity[] = [], deltaTime: number = 1) => {
    this.resolveInputs();
    this.updateVelocities(deltaTime);
    this.updatePosition(deltaTime);
    this.updateHitbox();
    debug.inspect(this);
    debug.drawPoint(this.centerPoint);
  };
  render = (view: View) => {
    this.renderSquare(view);
    view.context.fillStyle = "red";
    view.context.fillStyle = "black";
  };
}
