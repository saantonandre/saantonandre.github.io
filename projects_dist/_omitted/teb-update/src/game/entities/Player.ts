import { Controls } from "@modules/Controls";
import { Entity } from "@modules/Entity";
import { ComputeProps } from "@modules/Entity/Entity";
import { checkCollisions } from "@modules/lib/checkCollisions";
import { View } from "@modules/View";
import { Rect } from "@modules/lib/shapes";


const GRAVITY = 0.025;
const TERMINAL_VELOCITY = 1;

export class Player extends Entity {
  fillColor = "red";
  speed = 0.13;
  maxSpeed = 0.35;
  friction = 0.4;
  terminalVel = 0.5;
  hitboxOffset = new Rect(0.2, 0, -0.4, 0);
  constructor(x = 0, y = 0, w = 1, h = 1) {
    super(x, y, w, h);
    this.setAnimation("idle", { xFrames: [0], yFrames: [0] });
    this.setAnimation("idle", { xFrames: [1], yFrames: [0], left: 1 });
    this.setAnimation("jumping", { xFrames: [2], yFrames: [0, 1, 2, 3] });
    this.setAnimation("jumping", {
      xFrames: [3],
      yFrames: [0, 1, 2, 3],
      left: 1,
    });
    this.setAnimation("running", { xFrames: [0], yFrames: [1, 2, 3, 0] });
    this.setAnimation("running", {
      xFrames: [1],
      yFrames: [1, 2, 3, 0],
      left: 1,
    });
    this.setAnimation("run-up", { xFrames: [4], yFrames: [1, 2, 3, 0] });
    this.setAnimation("run-up", {
      xFrames: [5],
      yFrames: [1, 2, 3, 0],
      left: 1,
    });
    this.setAnimation("run-down", { xFrames: [6], yFrames: [0, 1] });
    this.setAnimation("run-down", {
      xFrames: [7],
      yFrames: [0, 1],
      left: 1,
    });
  }
  compute(props: ComputeProps) {
    this.handleControls(props);
    this.xVel = this.applyFriction(this.xVel, this.friction, props.dt);
    if (this.xVel > 0) this.left = 0;
    if (this.xVel < 0) this.left = 1;
    this.maxSpeedHandler();
    this.coyoteHandler(props.dt);
    this.jumpHandler(props.dt);
    checkCollisions(this, props.ents, props.dt);
    this.grounded = this.isGrounded(props);
    this.defaultCompute(props);
    if (!this.grounded) {
      const { left, right } = this.getSideCollisions(props);
      const WALL_RUN_MULTIPLIER = 0.65;
      if ((left && this.left) || (right && !this.left)) {
        this.loadAnimation(this.yVel > 0 ? "run-down" : "run-up");
        this.animations[this.animation]!.slowness = 0.5 / this.speed;
        this.yVel =
          this.yVel < 0
            ? this.yVel + GRAVITY * props.dt * WALL_RUN_MULTIPLIER
            : GRAVITY*10;
      } else {
        this.loadAnimation("jumping");
        this.yVel += GRAVITY * props.dt;
      }
      this.yVel > TERMINAL_VELOCITY && (this.yVel = TERMINAL_VELOCITY);
    }
  }
  handleControls(props: ComputeProps) {
    const accelleration = this.speed * props.dt;
    if (Controls.has("a")) {
      this.grounded && this.loadAnimation("running");
      this.xVel -= accelleration;
    }
    if (Controls.has("d")) {
      this.grounded && this.loadAnimation("running");
      this.xVel += accelleration;
    }
    if (!(Controls.has("a") || Controls.has("d"))) {
      this.grounded && this.loadAnimation("idle");
    }
    if (Controls.hasNew(" ")) {
      const direction = Controls.has("l")
        ? "l"
        : Controls.has("r")
        ? "r"
        : this.left
        ? "l"
        : "r";
      const isLeft = direction === "l";
      this.xVelExt += this.speed * 15 * props.dt * (isLeft ? -1 : 1);
      this.xVelExt += this.speed * 2 * props.dt * (isLeft ? -1 : 1);
      props.ents.push(
        new SlashVfx().setProperties({
          animation: direction,
          x: this.x + (isLeft ? this.w : -this.w),
          y: this.y,
          xVel: this.xVel + (isLeft ? -this.speed : this.speed),
        })
      );
    }
  }
  jumpHandler(dt: number) {
    if (this.coyote && Controls.hasNew("w")) {
      this.jumping = true;
      this.yVel = -this.speed * 4;
    }
    if (this.jumping && !Controls.has("w")) {
      this.yVel += (this.speed / 2) * dt;
    }
    if (this.yVel >= 0) this.jumping = false;
  }
  render(view: View) {
    this.defaultRender(view);
  }
}

class SlashVfx extends Entity {
  solid = false;
  constructor() {
    super();
    this.setAnimation("r", { xFrames: [0], yFrames: [4, 5, 6, 7] });
    this.setAnimation("t", { xFrames: [1], yFrames: [4, 5, 6, 7] });
    this.setAnimation("l", { xFrames: [2], yFrames: [4, 5, 6, 7] });
    this.setAnimation("b", { xFrames: [3], yFrames: [4, 5, 6, 7] });
  }
  onAnimationEnd() {
    this.removed = true;
  }
}
