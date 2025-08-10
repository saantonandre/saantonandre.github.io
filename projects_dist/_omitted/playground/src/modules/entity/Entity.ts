import { checkCollisions } from "../lib/physics/checkCollisions/checkCollisions";
import { Sprite } from "./Sprite";
import { vfxManager } from "../vfxManager";
import { soundManager } from "../soundManager";
import { View } from "modules/View";
import { Rect } from "modules/types/shapes";


export type Behaviour = (
  entity: Entity,
  environment: Entity[],
  deltaTime: number
) => void;

const idGenerator = () => {
  let count = 0;
  const generate = () => count++;
  return generate;
};
const getId = idGenerator();

export type EntityLike = {
  compute: (deltaTime: number) => void;
  render: (view: View) => void;
};
export class Entity extends Sprite {
  xVel: number = 0;
  yVel: number = 0;
  // External velocities (velocities acquired from external sources, like a strong hit)
  xVelExt: number = 0;
  yVelExt: number = 0;
  speed: number = 0.1;
  friction: number = 0;
  type: string = "entity";
  state: string = "idle";
  sounds = soundManager.sounds;
  playRandom = soundManager.playRandom;
  stats: Stats = new Stats();
  /** Defines whether this entity has low rendering order priority */
  background: boolean = false;
  /** Defines whether this entity is attached to the ground*/
  grounded: boolean = false;
  damaged: number = 0;
  shadow: boolean = false;
  solid: boolean = true;

  /** Ignores computing and rendering of this entity */
  removed: boolean = false;

  /** Cannot be moved by other entities */
  immovable: boolean = false;

  /** The id of the room where this entity is stored */
  // currentRoom: number = -1;

  drops: any[] = [];
  offsetX: number = 0;
  offsetY: number = 0;
  hasHpBar: boolean = false;
  hasDisplayName: boolean = false;
  id: string;
  /** Object containing the collisions amounts */
  col: {
    L: number; // Left side
    R: number; // Right side
    T: number; // Top side
    B: number;
  } = { L: 0, R: 0, T: 0, B: 0 };
  /** Object representing the hitbox used for collision computations */
  hitbox = new Rect();
  /** Represents the offsets of the hitbox, which may change based on current animation/state */
  hitboxOffset = new Rect();
  behaviours: Behaviour[] = [];
  createVfx: (vfxName: any, source: any) => any = vfxManager.create;
  checkCollisions: (
    obj: any,
    entities: any,
    deltaTime?: number
  ) => false | undefined = checkCollisions;
  constructor(x: number = 0, y: number = 0) {
    super(x, y);
    this.id = "creature-" + getId();
    this.updateHitbox();
  }
  /** Returns the stats.atk value */
  get atk() {
    return this.stats.atk;
  }

  /** Returns the stats.hp value */
  get hp() {
    return this.stats.hp;
  }

  /** Returns the stats.maxHp value */
  set hp(value) {
    this.stats.hp = value;
  }

  get centerX() {
    return this.x + this.w / 2;
  }
  get centerY() {
    return this.y + this.h / 2;
  }
  get centerPoint() {
    return { x: this.centerX, y: this.centerY };
  }

  /** Updates the hitbox's positions and size, relative to this absolute properties and the hitboxOffset properties */
  updateHitbox() {
    this.hitbox.x = this.x + this.hitboxOffset.x;
    this.hitbox.y = this.y + this.hitboxOffset.y;
    this.hitbox.w = this.w + this.hitboxOffset.w;
    this.hitbox.h = this.h + this.hitboxOffset.h;
  }
  /** Updates the hitbox's positions and size, relative to this absolute properties and the hitboxOffset properties
   * @param {Entity} collider A reference to the entity collided to this one
   */
  onCollision(collider: Entity) {
    // Collision events gets defined by children classes
  }

  /** Adjusts this entity's velocities according to collisions */
  resolveCollisions() {
    // Checks wether the entity is traveling against eventual colliding sides
    if (this.col.L && this.xVel + this.xVelExt < 0) {
      this.xVel = 0;
      this.xVelExt = 0;
    }
    if (this.col.R && this.xVel + this.xVelExt > 0) {
      this.xVel = 0;
      this.xVelExt = 0;
    }
    if (this.col.T && this.yVel + this.yVelExt < 0) {
      this.yVel = 0;
      this.yVelExt = 0;
    }
    if (this.col.B && this.yVel + this.yVelExt > 0) {
      this.yVel = 0;
      this.yVelExt = 0;
    }
    // Resets the collision properties
    this.col.L = 0;
    this.col.R = 0;
    this.col.T = 0;
    this.col.B = 0;
  }
  /**
   * Similar to the *onCollision* method, gets called whenever this entity collides with a damaging Entity,
   * which could be a spell, an attack, or an obstacle
   * @param {Entity} source The source of the attack
   */
  onHit(source: Entity) {
    this.xVelExt = source.xVel;
    this.yVelExt = source.yVel;
  }
  /**
   * Updates the external velocities according to the friction
   * @param {Number} deltaTime Time multiplier
   */
  updateVelocities(deltaTime: number) {
    if (this.xVelExt !== 0) {
      this.xVelExt *= Math.pow(this.friction, deltaTime);
      if (Math.abs(this.xVelExt) < 0.001) {
        this.xVelExt = 0;
      }
    }
    if (this.yVelExt !== 0) {
      this.yVelExt *= Math.pow(this.friction, deltaTime);
      if (Math.abs(this.yVelExt) < 0.001) {
        this.yVelExt = 0;
      }
    }
  }
  /** Moves this entity according to its velocities
   * @param {Number} deltaTime Time multiplier
   */
  updatePosition(deltaTime: number) {
    this.resolveCollisions();
    this.x += (this.xVel + this.xVelExt) * deltaTime;
    this.y += (this.yVel + this.yVelExt) * deltaTime;
  }

  /**
   * Handles the computational aspects of the entity
   */
  compute(environment: Entity[] = [], deltaTime: number = 1) {}

  /**
   * Handles the rendering of this entity and eventual renderable children (e.g. Equipment, Shadow, etc..)
   *
   */
  render(view: View) {
    //this.renderSprite(context, tilesize, ratio, camera);
    this.renderSprite(view);
  }

  /**
   * Used for debugging, displays the entity's hitbox
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
    // Provisional shadow rendering
    view.context.fillStyle = "#14182e";
    view.context.globalAlpha = 0.6;
    view.context.strokeStyle = "#ffffff";
    view.context.beginPath();
    const { x, y, w, h } = this;
    const shadow = new Rect(x + w / 2, y + h, w / 2, h / 2);
    view.context.ellipse(...view.parseRect(shadow), 0, 0, 2 * Math.PI);
    view.context.closePath();
    view.context.fill();
    view.context.globalAlpha = 1;
  }
}

/** Class representing the basic stats of an entity */
class Stats {
  lv: number;
  maxHp: number;
  hp: any;
  maxExp: number;
  exp: number;
  maxMana: number;
  mana: any;
  atk: number;
  atkSpeed: number;
  expValue: number;
  constructor() {
    /* The current level, level augments every other stat */
    this.lv = 1;
    /* Maximum hit points */
    this.maxHp = 10;
    /* Current hit points, hp <= 0 will result in an entity's death  */
    this.hp = this.maxHp;
    /* Threshold experience */
    this.maxExp = 10;
    /* Current experience, reaching the threshold will result in a level up */
    this.exp = 0;
    /* Maximum mana */
    this.maxMana = 15;
    /* Current mana, the mana is a currency used to cast spells/perform special actions */
    this.mana = this.maxMana;

    /* The attack stat, represents how many hit points will get subtracted to other entities when getting attacked by this one */
    this.atk = 1;
    /* Multiplier of the rate at which this entity attacks, the higher it is, the lower the intervals */
    this.atkSpeed = 1;
    /* The experience value that this entity will transfer to the killer entity */
    this.expValue = 1;
  }
}
