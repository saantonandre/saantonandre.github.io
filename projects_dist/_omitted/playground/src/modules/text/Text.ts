import { View } from "modules/View";

export class Text {
  content: string | string[] = "";
  x: number;
  y: number;
  color: string;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
  fontSize = 7;
  font = "Consolas, monaco, monospace";
  shadow = false;
  shadowColor = "#14182e";
  strokeWidth = 0.3;
  stroke: boolean;
  strokeColor: string | CanvasGradient | CanvasPattern;
  constructor(
    x: number,
    y: number,
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
    this.strokeColor = "#ffffff";
  }
  get shadowOffsetX() {
    return this.fontSize / 200;
  }
  get shadowOffsetY() {
    return this.fontSize / 200;
  }
  canvasFont(ratio: number) {
    return "bold " + Math.round(this.fontSize * ratio) + "px " + this.font;
  }
  render(view: View) {
    if (this.stroke) {
      view.context.lineWidth = this.strokeWidth * view.ratio;
      view.context.strokeStyle = this.strokeColor;
    }
    view.context.textBaseline = this.baseline;
    view.context.textAlign = this.align;
    view.context.fillStyle = this.color;
    view.context.font = this.canvasFont(view.ratio);
    if (typeof this.content !== "string") {
      // Content is split into an array of lines
      for (let i = 0; i < this.content.length; i++) {
        if (this.stroke) {
          view.context.strokeText(
            this.content[i],
            ...view.parsePoint(this, { offset: { y: this.fontSize * i } })
          );
        }
        if (this.shadow) {
          view.context.fillStyle = this.shadowColor;
          view.context.fillText(
            this.content[i],
            ...view.parsePoint(this, {
              offset: {
                x: this.shadowOffsetX,
                y: this.shadowOffsetY + this.fontSize * i,
              },
            })
          );
        }
        view.context.fillStyle = this.color;
        view.context.fillText(
          this.content[i],
          ...view.parsePoint(this, { offset: { y: this.fontSize * i } })
        );
      }
    } else {
      /** Stroke rendering */
      if (this.stroke) {
        view.context.strokeText(this.content, ...view.parsePoint(this));
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
          })
        );
      }
      /** Fill rendering */
      view.context.fillStyle = this.color;
      view.context.fillText(this.content, ...view.parsePoint(this));
    }
  }
}
