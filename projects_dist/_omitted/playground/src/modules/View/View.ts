import { Rect, Point } from "modules/types/shapes";
import { computeCamera } from "./computeCamera";

type ViewConfig = {
  canvas: HTMLCanvasElement;
  focus?: Rect;
  ratio?: number;
  tilesize?: number;
};
/**
 * A view has the following
 */
export class View {
  focus: Rect;
  lockedBounds = false;
  zoom = false;
  x: number;
  y: number;
  shake = 0;
  /** The rendering's unit of measurement, expressed in pixels */
  tilesize: number;
  /** Ratio at which  */
  baseRatio: number;
  /** Acts on the size of each pixel */
  ratio: number;
  baseTilesWidth: number;
  baseTilesHeight: number;
  /** Number of tiles displayed on screen (width) */
  tilesWidth: number;
  /** Number of tiles displayed on screen (height) */
  tilesHeight: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor(config: ViewConfig) {
    this.focus = config.focus ?? new Rect();
    this.x = this.focus.x;
    this.y = this.focus.y;
    this.tilesize = config.tilesize ?? 16;
    this.baseRatio = config.ratio ?? 1;
    this.ratio = this.baseRatio;
    this.baseTilesWidth = config.canvas.width / this.tilesize / this.ratio;
    this.tilesWidth = this.baseTilesWidth;
    this.baseTilesHeight = config.canvas.height / this.tilesize / this.ratio;
    this.tilesHeight = this.baseTilesHeight;
    this.canvas = config.canvas;
    this.context = config.canvas.getContext("2d")!;
  }
  /**
   * Returns the on-screen effective position of a point, by accounting ratio, tilesize and camera position.
   * @returns [x, y]
   */
  parsePoint = (
    point: Point,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
    }
  ) => {
    const x =
      (point.x + (config?.absolute ? 0 : this.x) + (config?.offset?.x || 0)) *
      this.tilesize *
      this.ratio;
    const y =
      (point.y + (config?.absolute ? 0 : this.y) + (config?.offset?.y || 0)) *
      this.tilesize *
      this.ratio;
    return [Math.floor(x), Math.floor(y)] as const;
  };
  /**
   * Returns the on-screen effective position and size of a rect, by accounting ratio, tilesize and camera position.
   * @returns [x, y, w, h]
   */
  parseRect = (
    rect: Rect,
    config?: {
      absolute?: boolean;
      offset?: Partial<Point>;
    }
  ) => {
    const [x, y] = this.parsePoint(rect, config);
    const w = rect.w * this.tilesize * this.ratio;
    const h = rect.h * this.tilesize * this.ratio;
    return [x, y, Math.floor(w), Math.floor(h)] as const;
  };
  changeFocus = (actor: Rect, smoothly = false) => {
    this.focus = actor;
    if (!smoothly) {
      this.x = -this.focus.x;
      this.y = -this.focus.y;
    }
  };
  changeBaseRatio = (newValue: number) => {
    this.baseRatio = newValue;
    this.baseTilesWidth = window.innerWidth / this.tilesize / this.ratio;
    this.baseTilesHeight = window.innerHeight / this.tilesize / this.ratio;
  };
  changeRatio = (newValue: number) => {
    this.ratio = newValue;
    this.tilesWidth = window.innerWidth / this.tilesize / this.ratio;
    this.tilesHeight = window.innerHeight / this.tilesize / this.ratio;
  };
  compute = (deltaTime: number) => {
    computeCamera(this, deltaTime);
  };
}
