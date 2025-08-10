// Default spritesheet
import spritesheet from "assets/sheet.png";
import { View } from "modules/View";
import { Rect, Point } from "modules/types/shapes";
const sheet = new Image();
sheet.src = spritesheet;

/** Class representing a sprite,
 * i.e. an object capable of iterating through a set of image frames, creating the illusion of animation.
 */
export class Sprite extends Rect {
  /** Each entity has the same spritesheet by default, but it can be changed */
  sheet: HTMLImageElement = sheet;
  /** The animation currently rendering (defaults to 'idle') */
  animation: string = "idle";
  /** Whenever a new animation is created, it will end up here */
  animations: Record<string, Animation> = {};
  /** Toggle used to skip this entity's rendering, for a reason or another */
  display: boolean = true;
  /** Defines if this sprite is facing to the left */
  left: number = 0;
  /** Represents the current frame of the current sprite animation */
  frame: number = 0;
  /** Counts the amount of rendering iterations since the last animation frame change */
  frameCounter: number = 0;
  /** The fillColor to be appplied for this entity fillRect (renderSquare) */
  fillColor: string = "white";
  removed: boolean = false;
  rot: number = 0;
  /**
   * Creates a new Sprite object at the given coordinates and of the specified size.
   * Commonly used as an extension to children classes, like entities or visual effects.
   *
   * *Note: Coordinates and sizes are expressed in tilesize units*
   * @param {Number} x Horizontal coordinate relative to the drawing environment
   * @param {Number} y Vertical coordinate relative to the drawing environment
   * @param {Number} w Width
   * @param {Number} h Height
   */
  constructor(x: number, y: number, w: number = 1, h: number = 1) {
    super(x, y, w, h);
    // eg. setting an animation:
    //this.setAnimation("idle", [0], [0]);
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
  /**
   * What happens after the current animation ends.
   * Entities/vfxs will overwrite this function when needed, to add functionalities.
   * If no actions are specified, then the current animation will loop endlessly.
   *
   */
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

  renderHitbox(view: View): void {}
  /** Renders the base sprite, not animated, as a static icon in a specific location */
  renderItem(view: View, pos: Rect) {
    view.context.drawImage(
      this.sheet, // source of the sprite
      this.animations["idle"].keyframesX[0][0] * view.tilesize, // x pos of the sprite
      this.animations["idle"].keyframesY[0][0] * view.tilesize, // y pos of the sprite
      this.animations["idle"].w * view.tilesize, // width of the sprite
      this.animations["idle"].h * view.tilesize, // height of the sprite
      ...view.parseRect(pos)
    );
  }
  /** Progresses the sprite animation
   * @param {Number} deltaTime Time multiplier
   */
  updateSprite(deltaTime: number = 1) {
    this.frameCounter += deltaTime;
    if (this.frameCounter >= this.animations[this.animation].slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    // If the current frame exceeded the current animation's length:
    if (
      this.frame >= this.animations[this.animation].keyframesX[this.left].length
    ) {
      this.frame = 0;
      this.frameCounter = 0;
      this.onAnimationEnd();
    }
  }
  /** Adds or overwrites an animation
   *
   * @param {String} label The name of the animation (using an already existing name will overwrite the animation)
   * @param {Number[]} keyframesX The positions of the sprite frames in the spritesheet (horizontal), expressed in tilesize
   * @param {Number[]} keyframesY The positions of the sprite frames in the spritesheet (vertical), expressed in tilesize
   * @param {0 | 1} left If set to 1 it will create a different animation whenever this object is facing to the left (has this.left = 1)
   *
   * @example
   * this.setAnimation('attack',[0,0,0],[1,2,3])  // Creates an animation labeled 'attack' composed of 3 animation frames
   *
   * this.setAnimation('attack',[1,1,1],[1,2,3], 1) // Sets a different animation for whenever the sprite faces to the left (optional)
   *
   */
  setAnimation(
    label: string,
    keyframesX: number[],
    keyframesY: number[],
    left: 0 | 1 = 0
  ) {
    if (!this.animations[label]) {
      this.animations[label] = new Animation(this);
    }
    if (left) {
      this.animations[label].keyframesX[1] = keyframesX;
      this.animations[label].keyframesY[1] = keyframesY;
    } else {
      /** If left-facing animation was not specified use the keyframes for both ways */
      this.animations[label].keyframesX[0] = keyframesX;
      this.animations[label].keyframesY[0] = keyframesY;

      this.animations[label].keyframesX[1] = keyframesX;
      this.animations[label].keyframesY[1] = keyframesY;
    }
  }
  getFrame = (view: View) => {
    return [
      this.sheet, // source of the sprite,
      this.animations[this.animation].keyframesX[this.left][this.frame] *
        view.tilesize, // x pos of the sprite
      this.animations[this.animation].keyframesY[this.left][this.frame] *
        view.tilesize, // y pos of the sprite
      this.animations[this.animation].w * view.tilesize, // width of the sprite
      this.animations[this.animation].h * view.tilesize, // height of the sprite
    ] as const;
  };
  /**
   * Renders this sprite current animation, at the given coordinates
   */
  renderSprite = (view: View, pivot?: Point) => {
    const rotation = this.rot + this.animations[this.animation].offset.rot;
    if (!this.display) {
      // Skips rendering
      return;
    }
    if (this.removed) {
      //console.log('rendering a removed entity!!!')
    }

    if (rotation) {
      const positivePivot = new Point(
        pivot?.x ?? this.w / 2,
        pivot?.y ?? this.h / 2
      );
      const negativePivot = new Point(-positivePivot.x, -positivePivot.y);
      /** Rotated Rendering */
      view.context.save();
      view.context.translate(
        ...view.parsePoint(
          {
            x: positivePivot.x + this.x,
            y: positivePivot.y + this.y,
          },
          {
            offset: this.animations[this.animation].offset,
          }
        )
      );
      view.context.rotate(rotation);
      view.context.drawImage(
        ...this.getFrame(view),
        ...view.parseRect(
          {
            ...this.animations[this.animation],
            ...negativePivot,
          },
          { absolute: true }
        )
      );
      view.context.restore();
    } else {
      /** Default Rendering */
      view.context.drawImage(
        ...this.getFrame(view),
        ...view.parseRect(this.animations[this.animation])
      );
    }
  };
  /**
   * Disregards the animation and renders an entity as a filled square,
   * can be used for debugging or as a placeholder.
   */
  renderSquare(view: View, pivot?: Point) {
    if (!this.display) {
      // Skips rendering
      return;
    }
    if (this.removed) {
      console.log("rendering a removed entity!!!");
    }
    view.context.fillStyle = this.fillColor;
    if (this.rot) {
      const positivePivot = new Point(
        pivot?.x ?? this.w / 2,
        pivot?.y ?? this.h / 2
      );
      const negativePivot = new Point(-positivePivot.x, -positivePivot.y);
      // Rotated Rendering
      view.context.save();
      view.context.translate(
        ...view.parsePoint({
          x: positivePivot.x + this.x,
          y: positivePivot.y + this.y,
        })
      );
      view.context.rotate(this.rot);
      view.context.fillRect(
        ...view.parseRect(
          { ...negativePivot, w: this.w, h: this.h },
          { absolute: true }
        )
      );
      view.context.restore();
    } else {
      view.context.fillRect(...view.parseRect(this));
    }
  }
}
class Animation {
  /** `x` positions on the spritesheet */
  keyframesX: number[][];
  /** `y` positions on the spritesheet */
  keyframesY: number[][];
  /** Defines how many game-frames should be skipped before each next animation-frame */
  slowness: number;
  w: number;
  h: number;
  get x() {
    return this.reference.x;
  }
  get y() {
    return this.reference.x;
  }
  reference: Rect;
  offset: Point & { rot: number };
  constructor(reference: Rect) {
    this.reference = reference;
    this.keyframesX = [[], []];
    this.keyframesY = [[], []];
    this.slowness = 6;
    this.offset = { x: 0, y: 0, rot: 0 };
    this.w = reference.w;
    this.h = reference.h;
  }
}
