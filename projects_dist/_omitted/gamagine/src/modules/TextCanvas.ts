import { Sprite } from "../interfaces/Sprite";
import { Box } from "./Box";

export class TextCanvas {
  target;
  matrix;
  width = new Box(0, (v) => (this.target.style.width = `${v}ch`));
  height = new Box(0);
  EMPTY_CHAR = " ";
  constructor(target = TextCanvas.createTarget()) {
    this.target = target;
    this.width.value = 100;
    this.height.value = 30;
    this.matrix = this.createMatrix();
  }
  static createTarget() {
    const el = document.createElement("pre");
    Object.assign(el.style, {
      border: "1px solid white",
      margin: "auto",
      heigth: "fit-content",
      width: "fit-content",
      fontFamily: "monospace",
    });
    return el;
  }
  private createMatrix() {
    return Array.from({
      length: this.width.value * this.height.value,
    }).fill(this.EMPTY_CHAR);
  }
  render() {
    let renderable = "";
    for (let i = 0; i < this.matrix.length; i++) {
      if (i !== 0 && i % this.width.value === 0) {
        renderable += "\n";
      }
      renderable += this.matrix[i];
    }
    this.target.innerHTML = renderable;
  }
  clear() {
    this.matrix.fill(this.EMPTY_CHAR);
  }
  drawAt(sprite: Sprite, x: number, y: number) {
    for (let i = 0; i < sprite.text.length; i++) {
      const sx = i % sprite.width;
      const sy = Math.floor(i / sprite.width);
      const xTotal = sx + x;
      const yTotal = (sy + y);
      if (xTotal >= this.width.value || xTotal < 0) continue;
      if (yTotal >= this.height.value || yTotal < 0) continue;
      this.matrix[yTotal * this.width.value + xTotal] = sprite.text[i];
    }
  }
}
