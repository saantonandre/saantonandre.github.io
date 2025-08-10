import { Sprite, Entity } from "../entity";
import { Text } from "../text";
/**
 * Basic vfx class
 */
export class SpriteVfx extends Sprite {
  source: Entity;
  type = "vfx";
  name = "proto";
  removed = false;
  randomPos = false;
  randomAmount = 0.5;
  /**
   * @param {Entity} source The entity to which this vfx is attached
   */
  constructor(source: Entity) {
    super(source.centerX, source.centerY);
    this.source = source;
  }
  resolveCollisions() {}
  renderShadow() {}
  /** Moves this vfx coordinates in a random direction within a range defined by this.randomAmount */
  randomizePos() {
    this.x += Math.random() * this.randomAmount - this.randomAmount / 2;
    this.y += Math.random() * this.randomAmount - this.randomAmount / 2;
  }
  /** Returns the vfx to its original state
   *
   * @param {Entity} source Defines the entity to which this vfx is related to
   */
  reset(source: Entity) {
    this.source = source;
    this.moveAtSource();

    if (this.randomPos) {
      this.randomizePos();
    }
    this.removed = false;
    this.frame = 0;
    this.frameCounter = 0;
    this.additionalResetOperations();
  }
  /** Each vfx may have different reset options */
  additionalResetOperations() {}
  moveAtSource() {
    this.x = this.source.centerX - this.w / 2;
    this.y = this.source.centerY - this.h / 2;
  }
  compute(deltaTime: number) {
    this.updateSprite(deltaTime);
  }
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: number; y: number }
  ) {
    this.renderSprite(context, tilesize, ratio, camera);
  }
  onAnimationEnd() {
    this.removed = true;
  }
}
/** DmgVfxs have 4 random animations and 4 random rotations */
export class DmgVfx extends SpriteVfx {
  constructor(source: Entity) {
    super(source);
    this.name = "DmgVfx";
    this.w = 1;
    this.h = 1;
    this.randomPos = true;
    this.randomizePos();
    this.setAnimation("boom", [17, 17, 17, 17], [0, 1, 2, 3]);
    this.setAnimation("cut", [18, 18, 18, 18], [0, 1, 2, 3]);
    this.setAnimation("cut_long", [20, 20, 20, 20], [0, 1, 2, 3]);
    this.animations["cut_long"].w = 2;
    this.additionalResetOperations();
  }
  additionalResetOperations() {
    let animations = Object.entries(this.animations);
    /** Assign a random animation */
    this.animation = animations[(Math.random() * animations.length) | 0][0];
    let rotations = [0, 90, 180, -90];
    this.rot = rotations[(Math.random() * rotations.length) | 0];
  }
}
/** Represents a single particle */
class Particle extends Sprite {
  verticalSpeed = -0.03;
  x: number;
  y: number;
  source: Entity;
  lifeCycles: number;
  remainingCycles: number;
  constructor(source: Entity, particleDuration = 5) {
    super(source.x, source.y);
    this.setAnimation("idle", [19, 19, 19, 19], [0, 1, 2, 3]);
    this.source = source;
    this.lifeCycles = particleDuration;
    this.remainingCycles = this.lifeCycles;
    this.x = source.x + source.w / 2 + Math.random() * 1.5 - 0.75 - this.w / 2;
    this.y = source.y + source.h / 2 + Math.random() * 1.5 - 0.75 - this.h / 2;
    this.x -= this.w / 2;
    this.y -= this.h / 2;
  }
  get randomX() {
    return (
      this.source.x +
      this.source.w / 2 +
      Math.random() * 1.5 -
      0.75 -
      this.w / 2
    );
  }
  get randomY() {
    return (
      this.source.y +
      this.source.h / 2 +
      Math.random() * 1.5 -
      0.75 -
      this.h / 2
    );
  }
  reset(source: Entity, lifeCycles: number) {
    this.source = source;
    this.x = this.randomX;
    this.y = this.randomY;
    this.removed = false;
    this.remainingCycles = lifeCycles || this.lifeCycles;
  }
  onAnimationEnd() {
    this.remainingCycles--;
    if (this.remainingCycles <= 0) {
      this.removed = true;
      return;
    }
    this.x = this.randomX;
    this.y = this.randomY;
  }
  compute(deltaTime: number) {
    this.y += this.verticalSpeed * deltaTime;
    this.updateSprite(deltaTime);
  }
  render(
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: { x: 0; y: 0 }
  ) {
    this.renderSprite(context, tilesize, ratio, camera);
  }
}
/** Holds multiple Particle objects, which on death respawns for a said amount of times */
export class ParticlesVfx extends SpriteVfx {
  particlesDuration = 5;
  /** The numbers of particles */
  particlesAmount = 5;
  particles:Particle[] = [];
  constructor(source: Entity) {
    super(source);
    this.name = "ParticlesVfx";
    /** Amount of particles lifetime */
    this.particlesDuration = 5;
    /** The numbers of particles */
    this.particlesAmount = 5;
    this.particles = [];
    this.initialize();
  }
  initialize() {
    /** Creates the particles */
    for (let i = 0; i < this.particlesAmount; i++) {
      this.particles.push(new Particle(this.source, this.particlesDuration));
    }
  }
  additionalResetOperations() {
    for (let particle of this.particles) {
      particle.reset(this.source, this.particlesDuration);
    }
  }
  compute(deltaTime:number) {
    let removedCount = 0;
    for (let particle of this.particles) {
      if (particle.removed) {
        removedCount++;
        continue;
      }
      particle.compute(deltaTime);
    }
    if (removedCount === this.particles.length) {
      this.removed = true;
    }
  }
  render(context:CanvasRenderingContext2D, tilesize:number, ratio:number, camera:{x:0,y:0}) {
    for (let particle of this.particles) {
      if (particle.removed) {
        continue;
      }
      particle.render(context, tilesize, ratio, camera);
    }
  }
}
/**
 * Displays text in the form of a vfx
 */
export class TextVfx extends SpriteVfx {
    name = "TextVfx";
    text = new Text(0, 0);
    progress = 0;
  /**
   * @param {Entity} source The entity to which this vfx attaches
   */
  constructor(source:Entity) {
    super(source);
    this.text.content = "";
    // Red by default
    this.text.color = "#ad2f45";
    this.text.shadow = true;
    this.text.fontSize = 10;
  }
  reset(source:Entity, content = "") {
    this.removed = false;
    this.progress = 0;
    this.text.content = content;
    this.source = source;
  }
  compute(deltaTime:number) {
    this.progress += (Math.PI / 60) * deltaTime;
    if (this.progress >= Math.PI) {
      this.removed = true;
      return;
    }
    this.x = this.source.centerX + this.progress / 10;
    this.y = this.source.centerY - Math.sin(this.progress);
    this.text.x = this.x;
    this.text.y = this.y;
  }
  render(context:CanvasRenderingContext2D, tilesize:number, ratio:number, camera:{x:0,y:0}) {
    this.text.render(context, tilesize, ratio, camera);
  }
}
