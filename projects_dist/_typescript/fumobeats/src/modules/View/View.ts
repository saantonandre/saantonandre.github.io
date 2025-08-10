import { Rect, Point } from "modules/types/shapes";
import { computeCamera } from "./computeCamera";
import { GameCanvas } from "modules/View/GameCanvas";

type ViewConfig = {
  focus?: Point;
  ratio?: number;
  tilesize?: number;
  /** Width of the canvas, in pixels */
  width: number;
  /** Height of the canvas, in pixels */
  height: number;
};
type ViewFocus = Point | Rect | (() => Point);
/**
 * A view has the following
 */
export class View {
  // Camera variables
  private focus: ViewFocus;
  boundingBox?: Rect;
  transitionSpeed = 0.1;
  shake = 0;
  shakeOffset = new Point(0, 0);
  x: number;
  y: number;
  w: number = 10;
  h: number = 10;
  get xCenter() {
    return this.x + this.w / 2;
  }
  get yCenter() {
    return this.y + this.h / 2;
  }
  get center() {
    return { x: this.xCenter, y: this.yCenter };
  }
  /** The rendering's unit of measurement, expressed in pixels */
  tilesize: number;
  /** Ratio at which  */
  baseRatio: number;
  /** Acts on the size of each pixel */
  private _ratio: number = 1;
  get ratio() {
    return this._ratio;
  }
  set ratio(value: number) {
    this._ratio = value;
    this.w = this.canvas.width / this.tilesize / value;
    this.h = this.canvas.height / this.tilesize / value;
    const xCenter = this.x + this.w / 2;
    const yCenter = this.y + this.h / 2;
    this.x = xCenter - this.w / 2;
    this.y = yCenter - this.h / 2;
  }
  basew: number = 10;
  baseh: number = 10;
  canvas: GameCanvas;
  context: CanvasRenderingContext2D;
  constructor(config: ViewConfig) {
    this.tilesize = config.tilesize ?? 16;
    this.baseRatio = config.ratio ?? 1;
    this.canvas = new GameCanvas(config.width, config.height);
    this.ratio = this.baseRatio;
    this.context = this.canvas.getContext("2d")!;
    this.x = config.focus ? config.focus.x - this.w / 2 : 0;
    this.y = config.focus ? config.focus.y - this.h / 2 : 0;
    this.focus = config.focus || {
      x: 0,
      y: 0,
    };
  }
  /**
   * Returns the on-screen effective position of a point, by accounting ratio, tilesize and camera position.
   * @returns [x, y]
   */
  parsePoint(
    point: Point,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
      ratio?: number;
    }
  ) {
    const x =
      (point.x + (config?.absolute ? 0 : -this.x) + (config?.offset?.x || 0)) *
      this.tilesize *
      (config?.ratio || this.ratio);
    const y =
      (point.y + (config?.absolute ? 0 : -this.y) + (config?.offset?.y || 0)) *
      this.tilesize *
      (config?.ratio || this.ratio);
    return [Math.floor(x), Math.floor(y)] as const;
  }
  /**
   * Returns the on-screen effective position and size of a rect, by accounting ratio, tilesize and camera position.
   * @returns [x, y, w, h]
   */
  parseRect(
    rect: Rect,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
      ratio?: number;
    }
  ) {
    const [x, y] = this.parsePoint(rect, config);
    const w = rect.w * this.tilesize * (config?.ratio || this.ratio);
    const h = rect.h * this.tilesize * (config?.ratio || this.ratio);
    return [x, y, Math.floor(w), Math.floor(h)] as const;
  }
  getFocus() {
    return this.focus;
  }
  getPan(xPos: number) {
    const value = (xPos - this.x) / this.w - 0.5;
    return value;
  }
  getFocusPoint() {
    const focus = this.focus instanceof Function ? this.focus() : this.focus;
    const focusPoint = new Point(focus.x, focus.y);
    if (focusPoint instanceof Rect) {
      focusPoint.x += focusPoint.w / 2;
      focusPoint.y += focusPoint.h / 2;
    }
    return focusPoint;
  }
  changeFocus(newFocus: ViewFocus, smoothly = false) {
    this.focus = newFocus;
    const focusPoint = this.getFocusPoint();
    if (smoothly) return;
    this.x = focusPoint.x - this.w / 2;
    this.y = focusPoint.y - this.h / 2;
  }
  compute(deltaTime: number) {
    computeCamera(this, deltaTime);
  }
}
