import { gameDebug } from "@modules/Debug";
import { getRectsSum, isRectToRect } from "@modules/lib/geometry";
import { Mouse } from "@modules/Mouse";
import { SoundManager } from "@modules/SoundManager";
import { Timing } from "@modules/Timing";
import { View } from "@modules/View";
import { Point, Rect } from "@modules/lib/shapes";
import { audioIndex } from "../../assets/audio";
import { Sprite } from "./Sprite";

export type ComputeProps = {
  /** List of entities to be computed */
  ents: Entity[];
  /**  (data about what the screen is doing) */
  view: View;
  /**  Plays sounds */
  sound: SoundManager<typeof audioIndex, keyof typeof audioIndex>;
  /** Time controls */
  time: Timing;
  /** Current delta time */
  dt: number;
  /** Mouse data */
  mouse: Mouse;
};
export type Behavior<T extends Entity = Entity> = (
  entity: T,
  props: Parameters<T["compute"]>[0]
) => boolean;

const idGenerator = () => {
  let count = 0;
  const generate = () => count++;
  return generate;
};
const getId = idGenerator();

export class Entity extends Sprite {
  type = "entity";
  id: number = getId();
  prevPos: Point;
  xVel: number = 0;
  yVel: number = 0;
  xVelExt: number = 0;
  yVelExt: number = 0;
  rotVel: number = 0;
  rotVelExt: number = 0;
  /** coyote jump frame */
  coyote = 0;
  jumping = false;
  /** Number between 0 and 1 */
  friction: number = 1;
  /** Number between 0 and 1 */
  rotFriction: number = 0.98;
  speed: number = 0.1;
  maxSpeed: number = 1;
  states: string[] = ["idle"];
  state: string = "idle";
  /** Defines whether this entity has low rendering order priority */
  background: boolean = false;
  /** Defines whether this entity is attached to the ground*/
  grounded: boolean = false;
  damaged: number = 0;
  shadow: boolean = false;
  solid: boolean = true;
  /** Ignores computing and rendering of this entity */
  removed: boolean = false;
  /** Object containing the collisions amounts */
  col = new CollisionObject();
  /** Represents the offsets of the hitbox, which may change based on current animation/state */
  hitboxOffset = new Rect();
  /** Components tied with this entity */
  components: Entity[] = [];
  behaviors: Behavior<any>[] = [];
  constructor(x = 0, y = 0, w = 1, h = 1) {
    super(x, y, w, h);
    this.prevPos = new Point(x, y);
  }
  get xCenter() {
    return this.x + this.w / 2;
  }
  get yCenter() {
    return this.y + this.h / 2;
  }
  get center() {
    return { x: this.xCenter, y: this.yCenter };
  }

  /** Object representing the hitbox used for collision computations */
  get hitbox() {
    return getRectsSum(this, this.hitboxOffset);
  }
  maxSpeedHandler() {
    if (Math.abs(this.xVel) > this.maxSpeed) {
      const sign = Math.sign(this.xVel);
      this.xVel = this.maxSpeed * sign;
    }
  }
  coyoteHandler(dt: number) {
    this.grounded ? (this.coyote = 8) : (this.coyote -= dt);
    if (this.jumping) this.coyote = 0;
    if (this.coyote < 0) this.coyote = 0;
  }
  applyFriction(value: number, friction: number, deltaTime: number) {
    if (!value) return value;
    const slipperiness = 1 - friction;
    const min = 0.001;
    const newValue = value * slipperiness ** deltaTime;
    if (Math.abs(newValue) < min) return 0;
    return newValue;
  }
  /** Updates the hitbox's positions and size, relative to this absolute properties and the hitboxOffset properties
   * @param {Entity} collider A reference to the entity collided to this one
   */
  onCollision(collider: Entity) {
    // Collision events gets defined by children classes
  }
  onOutOfBounds(props: ComputeProps) {}

  /** Adjusts this entity's velocities according to collisions */
  resolveCollisions() {
    const { L, R, T, B } = this.col;
    if (L) {
      this.x += L;
      if (this.xVel < 0) {
        this.xVel = 0;
        this.xVelExt = 0;
      }
    }
    if (R) {
      this.x -= R;
      if (this.xVel > 0) {
        this.xVel = 0;
        this.xVelExt = 0;
      }
    }
    if (T) {
      this.y -= T;
      if (this.yVel < 0) {
        this.yVel = 0;
        this.yVelExt = 0;
      }
    }
    if (B) {
      this.y -= B;
      if (this.yVel > 0) {
        this.yVel = 0;
        this.yVelExt = 0;
      }
    }
    this.col.reset();
  }
  /**
   * Similar to the *onCollision* method, gets called whenever this entity collides with a damaging Entity,
   * which could be a spell, an attack, or an obstacle
   */
  onHit(props: ComputeProps, collider: Entity) {}
  /**
   * Updates the external velocities according to the slipperiness
   */
  updateVelocities(dt: number) {
    this.xVelExt = this.applyFriction(this.xVelExt, this.friction, dt);
    this.yVelExt = this.applyFriction(this.yVelExt, this.friction, dt);
    this.rotVelExt = this.applyFriction(this.rotVelExt, this.rotFriction, dt);
  }
  /** Moves this entity according to its velocities
   * @param {Number} deltaTime Time multiplier
   */
  updatePosition(deltaTime: number) {
    this.resolveCollisions();
    this.x += (this.xVel + this.xVelExt) * deltaTime;
    this.y += (this.yVel + this.yVelExt) * deltaTime;
    this.rot += (this.rotVel + this.rotVelExt) * deltaTime;
  }

  computeBehaviors(props: ComputeProps) {
    /** To be removed */
    const tbr: number[] = [];
    for (let i = 0; i < this.behaviors.length; i++) {
      const repeat = this.behaviors[i](this, props);
      if (!repeat) tbr.push(i);
    }
    for (let i = tbr.length - 1; i >= 0; i--) {
      this.behaviors.splice(tbr[i], 1);
    }
  }
  defaultCompute(props: ComputeProps) {
    this.prevPos.x = this.x;
    this.prevPos.y = this.y;
    this.computeBehaviors(props);
    this.updateVelocities(props.dt);
    this.updatePosition(props.dt);
    this.updateSprite(props.dt);
    for (const component of this.components) {
      component.compute(props);
    }
  }
  /**
   * Handles the computational aspects of the entity
   * --- WARNING ---
   * Could get overwrited
   */
  compute(props: ComputeProps) {
    this.defaultCompute(props);
  }

  defaultRender(view: View) {
    this.renderSprite(view);
    for (const component of this.components) {
      component.render(view);
    }
  }
  render(view: View){
    this.defaultRender(view)
  }

  isGrounded(props: ComputeProps) {
    const groundedHeight = 0.2;
    const hitRect = new Rect(
      this.hitbox.x,
      this.hitbox.y + this.hitbox.h,
      this.hitbox.w,
      groundedHeight
    );
    gameDebug.drawRect(hitRect);
    for (const ent of props.ents) {
      if (ent === this) continue;
      if (isRectToRect(hitRect, ent.hitbox)) {
        return true;
      }
    }
    return false;
  }
  getSideCollisions(props: ComputeProps) {
    const sideWidth = 0.2;
    const x = this.hitbox.x,
      y = this.hitbox.y,
      w = sideWidth,
      h = this.hitbox.h;
    const hitRectLeft = new Rect(x - sideWidth, y, w, h);
    const hitRectRight = new Rect(x + this.hitbox.w, y, w, h);

    gameDebug.drawRect(hitRectLeft, "pink");
    gameDebug.drawRect(hitRectRight, "green");
    const cols = {
      left: false,
      right: false,
    };
    for (const ent of props.ents) {
      if (ent === this) continue;
      if (isRectToRect(hitRectLeft, ent.hitbox)) {
        cols.left = true;
      }
      if (isRectToRect(hitRectRight, ent.hitbox)) {
        cols.right = true;
      }
    }
    return cols;
  }
  /**
   * Used for gameDebugging, displays the entity's hitbox
   */
  renderHitbox(view: View) {
    view.context.strokeStyle = "red";
    view.context.beginPath();
    view.context.strokeRect(...view.parseRect(this.hitbox));
    view.context.closePath();
    view.context.stroke();
  }

  /**
   * Casts an elliptical shadow just below this entity
   */
  renderShadow(view: View) {
    if (!this.shadow || this.removed) {
      return;
    }
    // Temporary shadow rendering
    view.context.fillStyle = "#14182e";
    view.context.globalAlpha = 0.6;
    view.context.strokeStyle = "#f0eceb";
    view.context.beginPath();
    const { x, y, w, h } = this;
    const shadow = new Rect(x + w / 2, y + h, w / 2, h / 2);
    view.context.ellipse(...view.parseRect(shadow), 0, 0, 2 * Math.PI);
    view.context.closePath();
    view.context.fill();
    view.context.globalAlpha = 1;
  }
}
class CollisionObject {
  L = 0; // Left
  R = 0; // Right
  T = 0; // Top
  B = 0; // Bottom
  constructor() {}
  reset() {
    this.L = 0;
    this.R = 0;
    this.T = 0;
    this.B = 0;
  }
}
