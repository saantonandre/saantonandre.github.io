import { View } from "modules/View";
import { Rect } from "modules/types/shapes";

export class GameText {
  content: string = "";
  x: number;
  y: number;
  color: string;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  fontSize = 7;
  opacity = 1;
  font = "Consolas, monaco, monospace";
  shadow = false;
  shadowColor = "#ff818f";
  strokeWidth = 0.3;
  absolute: boolean = false;
  stroke: boolean;
  strokeColor: string | CanvasGradient | CanvasPattern;
  constructor(
    x: number = 0,
    y: number = 0,
    color = "#ad2f45",
    align = "center" as CanvasTextAlign,
    baseline = "middle" as CanvasTextBaseline
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.align = align;
    this.stroke = false;
    this.baseline = baseline;
    this.strokeColor = "#f0eceb";
  }
  get shadowOffsetX() {
    return this.fontSize / 200;
  }
  get shadowOffsetY() {
    return this.fontSize / 200;
  }
  getHitbox(view: View) {
    this.configureContext(view);
    const tempRect = Rect.temp();
    const textSize = view.context.measureText(this.content);
    const textWidth = textSize.width / view.tilesize / view.ratio;
    const xOffset = textSize.actualBoundingBoxLeft / view.tilesize / view.ratio;
    const yOffsetTop =
      textSize.actualBoundingBoxAscent / view.tilesize / view.ratio;
    const yOffsetBottom =
      textSize.actualBoundingBoxDescent / view.tilesize / view.ratio;
    tempRect.x = this.x - xOffset;
    tempRect.y = this.y - yOffsetTop;
    tempRect.w = textWidth;
    tempRect.h = yOffsetBottom + yOffsetTop;
    return tempRect;
  }
  canvasFont(ratio: number) {
    return "bold " + Math.round(this.fontSize * ratio) + "px " + this.font;
  }
  configureContext(view: View) {
    if (this.stroke) {
      view.context.lineWidth = this.strokeWidth * view.ratio;
      view.context.strokeStyle = this.strokeColor;
    }
    view.context.textBaseline = this.baseline;
    view.context.textAlign = this.align;
    view.context.fillStyle = this.color;
    view.context.textRendering = "optimizeLegibility";
    view.context.font = this.canvasFont(view.ratio);
  }
  render(view: View) {
    const prevOpacity = view.context.globalAlpha;
    this.configureContext(view);
    view.context.globalAlpha = this.opacity * view.context.globalAlpha;
    /** Stroke rendering */
    if (this.stroke) {
      view.context.strokeText(
        this.content,
        ...view.parsePoint(this, { absolute: this.absolute })
      );
    }
    /** Shadow rendering */
    if (this.shadow) {
      view.context.fillStyle = this.shadowColor;
      view.context.fillText(
        this.content,
        ...view.parsePoint(this, {
          offset: {
            x: this.shadowOffsetX,
            y: this.shadowOffsetY,
          },
          absolute: this.absolute,
        })
      );
    }
    /** Fill rendering */
    view.context.fillStyle = this.color;
    view.context.fillText(
      this.content,
      ...view.parsePoint(this, {
        absolute: this.absolute,
      })
    );
    view.context.globalAlpha = prevOpacity;
  }
  /** Can be used during initialization to configure the sprite/entity properties in a functional way */
  setup(initCallback: (obj: this) => void) {
    initCallback(this);
    return this;
  }
}
