import { Controls } from "./Controls";
import { Entity } from "./Entity";
import { type World } from "./Game";

export class Player extends Entity {
  constructor() {
    super({ x: 2, y: 1 });
  }
  actions: Record<string, (w: World) => void> = {
    "w": (w) => (this.yVel -= this.speed * w.dt),
    "a": (w) => (this.xVel -= this.speed * w.dt),
    "s": (w) => (this.yVel += this.speed * w.dt),
    "d": (w) => (this.xVel += this.speed * w.dt),
    /** Mouse left */
    "0": (w) => this.shoot(w),
  };
  compute(w: World) {
    for (const key in this.actions) {
      Controls.has(key) && this.actions[key](w);
    }
    this.defaultCompute(w);
  }
  shoot(w: World) {
    console.log("Shooting!");
    // Get the cos and sin between the player and the mouse pointer
    const atan2 = Math.atan2(
      w.view.mouseX - this.centerX,
      w.view.mouseY - this.centerY
    );
    const cos = Math.cos(atan2);
    const sin = Math.sin(atan2);
    const projectile = new Projectile();
    projectile.xVel = sin;
    projectile.yVel = cos;
    projectile.x = this.centerX;
    projectile.y = this.centerY;
    w.entities.push(projectile);
  }
  override render(w: World) {
    this.defaultRender(w);
  }
}

export class Projectile extends Entity {
  constructor(props: Partial<Projectile> = {}) {
    super();
    Object.assign(this, props);
    this.w = 0.6;
    this.h = 0.4;
  }
  compute(w: World) {
    // console.log("hey")
    if (
      this.x > w.view.width ||
      this.x < 0 ||
      this.y > w.view.height ||
      this.y < 0
    ) {
      this.removed = true;
    }
    this.defaultCompute(w);
  }
}
