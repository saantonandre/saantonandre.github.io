// Default spritesheet

import { SpriteAnimation } from "./Animation";
import { renderSpriteImage, renderSpriteRect } from "./renderSprite";
import { setSpriteAnimation } from "./setSpriteAnimation";
import { ViewInterface, Rect } from "./Interfaces";
import default_sheet from "./defaultSheet.png";
const defaultSheet = new Image();
defaultSheet.src = default_sheet;
export type SpriteT = Sprite;
/**
 * Class representing a sprite,
 * i.e. an object capable of iterating through a set of image frames, creating the illusion of animation.
 */
export class Sprite {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Each entity has the same spritesheet by default, but it can be changed */
  sheet: HTMLImageElement = defaultSheet;
  /** The animation currently rendering (defaults to 'idle') */
  animation: string = "idle";
  /** Whenever a new animation is created, it will end up here */
  animations: Record<string, SpriteAnimation | undefined> = {};
  /** Toggle used to skip this entity's rendering, for a reason or another */
  display: boolean = true;
  /** Defines if this sprite is facing to the left */
  left: number = 0;
  /** Represents the current frame of the current sprite animation */
  frame: number = 0;
  /** Counts the amount of rendering iterations since the last animation frame change */
  frameCounter: number = 0;
  /** The fillColor to be appplied for this entity fillRect (renderRect) */
  fillColor: string = "#f0eceb";
  /** Wether it should never take into account the camera position */
  absolute: boolean = false;
  /** Wether it should never take into account the camera position */
  defaultAnimation = new SpriteAnimation(this);
  private _rot: number = 0;
  /** Returns the current rot (number between 0 and 6.28) */
  get rot() {
    return this._rot % (Math.PI * 2);
  }
  /** Sets the current rot (gets automatically normalized as a value between 0 and 6.28) */
  set rot(rot: number) {
    this._rot = rot % (Math.PI * 2);
  }
  /**
   * Creates a new Sprite object at the given coordinates and of the specified size.
   * Commonly used as an extension to children classes, like entities or visual effects.
   *
   * *Note: Coordinates and sizes are expressed in tilesize units*
   */
  constructor(x = 0, y = 0, w = 1, h = 1) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // eg. setting an animation:
    //this.setAnimation("idle", [0], [0]);
  }
  render(view: ViewInterface) {}
  /** Used to redefine the render function */
  setRender(render: typeof this.render) {
    this.render = render;
  }
  onAnimationEnd() {
    /**
     * Example code inside this function:
     *
     *  switch(this.animation){
     *      case 'death':
     *          this.removed=true;
     *          break;
     *      case 'attack':
     *          this.loadAnimation('idle');
     *          break;
     *  }
     *
     */
  }
  /** Used to redefine the onAnimationEnd function
   *
   * What happens after the current animation ends.
   * Entities/vfxs will overwrite this function when needed, to add functionalities.
   * If no actions are specified, then the current animation will loop endlessly.
   *
   */
  setOnAnimationEnd(onAnimationEnd: typeof this.onAnimationEnd) {
    this.onAnimationEnd = onAnimationEnd;
  }
  /** Returns true if the animation has changed, false otherwise
   *  Usage example: this.loadAnimation('attack')
   */
  loadAnimation(label: string) {
    if (this.animation === label) {
      return false;
    }
    this.frameCounter = 0;
    this.frame = 0;
    this.animation = label;
    return true;
  }

  toObject() {
    const object: Record<string, (typeof this)[keyof typeof this]> = {};
    for (const key in this) {
      object[key] = this[key];
    }
  }
  /** Renders the base sprite, not animated, as a static icon in a specific location */
  renderItem(view: ViewInterface, pos: Rect) {
    const animation = this.animations["idle"] || this.defaultAnimation;
    view.context.drawImage(
      this.sheet, // source of the sprite
      animation.xFrames[0][0] * view.tilesize, // x pos of the sprite
      animation.yFrames[0][0] * view.tilesize, // y pos of the sprite
      animation.w * view.tilesize, // width of the sprite
      animation.h * view.tilesize, // height of the sprite
      ...view.parseRect(pos)
    );
  }
  /** Progresses the sprite animation
   * @param {Number} deltaTime Time multiplier
   */
  updateSprite(deltaTime: number = 1) {
    const animation = this.animations[this.animation] || this.defaultAnimation;

    this.frameCounter += deltaTime;
    if (this.frameCounter >= animation.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    // If the current frame exceeded the current animation's length:
    if (this.frame >= animation.xFrames[this.left].length) {
      this.frame = 0;
      this.frameCounter = 0;
      this.onAnimationEnd();
    }
  }
  /** Adds or overwrites an animation
   *
   * @param {String} label The name of the animation (using an already existing name will overwrite the animation)
   * @example
   */
  setAnimation = setSpriteAnimation;
  getFrame(view: ViewInterface) {
    const animation = this.animations[this.animation] || this.defaultAnimation;
    return [
      this.sheet, // source of the sprite,
      animation.xFrames[this.left][this.frame] * view.tilesize, // x pos of the sprite
      animation.yFrames[this.left][this.frame] * view.tilesize, // y pos of the sprite
      animation.w * view.tilesize, // width of the sprite
      animation.h * view.tilesize, // height of the sprite
    ] as const;
  }
  /**
   * Renders this sprite current animation, at the given coordinates
   */
  renderSprite = renderSpriteImage;
  /**
   * Disregards the animation and renders an entity as a filled rect,
   * can be used for gameDebugging or as a placeholder.
   */
  renderRect = renderSpriteRect;
  applyProperty<T extends keyof this, V extends this[T]>(key: T, value: V) {
    this[key] = value;
    return this;
  }
  setProperties(props: Partial<this>) {
    for (const key in props) {
      this.applyProperty(key, props[key]!);
    }
    return this;
  }
  /** Can be used during initialization to configure the sprite/entity properties in a functional way */
  setup(initCallback: (obj: this) => void) {
    initCallback(this);
    return this;
  }
}
