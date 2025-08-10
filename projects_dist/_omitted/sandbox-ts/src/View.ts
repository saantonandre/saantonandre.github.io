import { Prop } from "Prop";

export class View {
  width = new Prop(0, (w) => (this.canvas.width = w));
  height = new Prop(0, (h) => (this.canvas.height = h));
  constructor(width = 720, height = 480) {
    this.width.value = width;
    this.height.value = height;
  }
  canvas = (() => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    document.body.appendChild(container);
    canvas.width = this.width.value;
    canvas.height = this.height.value;
    canvas.style.margin = "auto";
    canvas.style.outline = "1px solid white";
    return canvas;
  })();
  context = this.canvas.getContext("2d");
}
