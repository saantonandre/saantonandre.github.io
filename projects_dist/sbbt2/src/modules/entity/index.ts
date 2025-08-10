import { checkCollisions } from "../physics/checkCollisions";
import * as Physics from "../physics";
import { Sprite } from "./sprite";
import { vfxManager } from "../vfxManager";
import { soundManager } from "../soundManager";
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
  sounds: { playRandom: (soundsArray: any[]) => void } = soundManager.sounds;
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
  currentRoom: number = -1;

  drops: any[] = [];
  offsetX: number = 0;
  offsetY: number = 0;
  Physics: typeof Physics = Physics;
  hasHpBar: boolean = false;
  hasDisplayName: boolean = false;
  /** Object containing the collisions amounts */
  col: {
    L: number; // Left side
    R: number; // Right side
    T: number; // Top side
    B: number;
  } = { L: 0, R: 0, T: 0, B: 0 };
  /** Object representing the hitbox used for collision computations */
  hitbox: { x: number; y: number; w: number; h: number } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  /** Represents the offsets of the hitbox, which may change based on current animation/state */
  hitboxOffset: { x: number; y: number; w: number; h: number } = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  createVfx: (vfxName: any, source: any) => any = vfxManager.create;
  checkCollisions: (
    obj: any,
    entities: any,
    deltaTime?: number
  ) => false | undefined = checkCollisions;
  constructor(x: number = 0, y: number = 0) {
    super(x, y);

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
   * @param {Number} deltaTime Time multiplier
   * @param {Entity[]} deltaTime Time multiplier
   */
  compute(deltaTime: number, environment:Entity[]=[]) {}

  /**
   * Handles the rendering of this entity and eventual renderable children (e.g. Equipment, Shadow, etc..)
   *
   * @param {CanvasRenderingContext2D} context The canvas drawing context
   * @param {Number} tilesize  The size of a single tile
   * @param {Number} ratio The scaling of each pixel
   * @param {object} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
   */
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    //this.renderSprite(context, tilesize, ratio, camera);
    this.renderSprite(context, tilesize, ratio, camera);
  }

  /** Used for debugging, displays the entity's hitbox
   *
   * @param {CanvasRenderingContext2D} context The canvas drawing context
   * @param {Number} tilesize  The size of a single tile
   * @param {Number} ratio The scaling of each pixel
   * @param {obj} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
   */
  renderHitbox(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    context.strokeStyle = "red";
    context.beginPath();
    context.strokeRect(
      (this.hitbox.x + camera.x) * tilesize * ratio,
      (this.hitbox.y + camera.y) * tilesize * ratio,
      this.hitbox.w * tilesize * ratio,
      this.hitbox.h * tilesize * ratio
    );
    context.closePath();
    context.stroke();
  }

  /** Casts an elliptical shadow just below this entity
   *
   * @param {CanvasRenderingContext2D} context The canvas drawing context
   * @param {Number} tilesize  The size of a single tile
   * @param {Number} ratio The scaling of each pixel
   * @param {obj} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
   */
  renderShadow(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    if (!this.shadow || this.removed) {
      return;
    }
    // Provisional shadow rendering
    context.fillStyle = "#14182e";
    context.globalAlpha = 0.6;
    context.strokeStyle = "#ffffff";
    context.beginPath();
    context.ellipse(
      (this.x + camera.x + this.w / 2) * tilesize * ratio,
      (this.y + this.h + camera.y) * tilesize * ratio,
      (this.w / 2) * tilesize * ratio,
      (this.w / 4) * tilesize * ratio,
      0,
      0,
      2 * Math.PI
    );
    context.closePath();
    context.fill();
    context.globalAlpha = 1;
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
export { Sprite };
export default Entity;
