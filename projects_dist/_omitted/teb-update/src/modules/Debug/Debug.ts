import { DrawCallback, DrawShape } from "./types";
import { Rect, Point, Line, Circle } from "@modules/lib/shapes";
import { type View } from "@modules/View"; // view type
import { type Timing } from "@modules/Timing"; // timing type
import { type SoundManager } from "@modules/SoundManager";
import { openEditor } from "@Editor/openEditor";

export class Debug {
  div: HTMLDivElement = document.createElement("div");
  activateButton: HTMLButtonElement = document.createElement("button");
  debugWindow: Window | null = null;
  active: boolean = false;
  assignedKeys: string[] = [];
  times: number[] = [];
  private drawLater: (DrawShape & { color: string })[] = [];
  fpsSpan?: HTMLSpanElement;
  deltaInput?: HTMLInputElement;
  constructor() {}
  initialize = () => {
    this.div = this.createDiv();
    this.active = false;
    this.times = [];
    this.drawLater = [];
    this.debugWindow = null;
    this.activateButton = this.createActivateButton();
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "F2":
          e.preventDefault();
          this.toggleWindow();
          break;
        case "F4":
          openEditor();
          break;
      }
    });
  };
  toggleWindow = () => {
    if (!this.debugWindow) {
      this.createWindow(600, 600);
    } else {
      this.debugWindow?.close();
      this.debugWindow = null;
    }
  };
  drawRect(rect: Rect, color = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({ type: "rect", shape: rect, color, absolute });
  }
  drawPoint(point: Point, color = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({ type: "point", shape: point, color, absolute });
  }
  drawCircle(circle: Circle, color = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({ type: "circle", shape: circle, color, absolute });
  }
  drawText(text: string, point: Point, color = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({ type: "text", text, shape: point, color, absolute });
  }
  drawLine(line: Line, color = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({ type: "line", shape: line, color, absolute });
  }
  drawCustom(callback: DrawCallback, color: string = "red", absolute = false) {
    if (!this.active) return;
    this.drawLater.push({
      type: "custom",
      callback,
      color,
      absolute,
    });
  }

  renderGrid(view: View) {
    const DRAW_COORDS = false;
    view.context.beginPath();
    view.context.lineWidth = 1;
    view.context.strokeStyle = "#f0eceb44";
    const gridSize = 1;
    const xOffset = -view.x % gridSize;
    const yOffset = -view.y % gridSize;
    const wLines = view.w / gridSize + 1;
    const hLines = view.h / gridSize + 1;

    for (let i = 0; i < wLines; i++) {
      // vertical lines
      const x = (xOffset + i * gridSize) * view.tilesize * view.ratio;
      view.context.moveTo(x, 0);
      view.context.lineTo(x, view.h * view.tilesize * view.ratio);
      if (!DRAW_COORDS) continue;
      for (let j = 0; j < hLines; j++) {
        const y = (yOffset + j * gridSize) * view.tilesize * view.ratio;
        view.context.fillStyle = "gray";
        view.context.textAlign = "center";
        view.context.fillText(
          `${(i * gridSize + view.x + 1) | 0},${
            (j * gridSize + view.y + 1) | 0
          }`,
          x,
          y
        );
      }
    }
    for (let i = 0; i < hLines; i++) {
      // horizontal lines
      const y = (yOffset + i * gridSize) * view.tilesize * view.ratio;
      view.context.moveTo(0, y);
      view.context.lineTo(view.w * view.tilesize * view.ratio, y);
    }
    view.context.closePath();
    view.context.stroke();
  }
  render(view: View) {
    if (!this.active) return;
    gameDebug.renderGrid(view);
    const pointSize = 0.2;
    for (let draw of this.drawLater) {
      view.context.beginPath();
      view.context.strokeStyle = draw.color;
      view.context.fillStyle = draw.color;
      switch (draw.type) {
        case "point":
          const square = {
            x: draw.shape.x - pointSize / 2,
            y: draw.shape.y - pointSize / 2,
            w: pointSize,
            h: pointSize,
          };
          view.context.rect(
            ...view.parseRect(square, { absolute: draw.absolute })
          );
          break;
        case "circle":
          view.context.arc(
            ...view.parsePoint(draw.shape, { absolute: draw.absolute }),
            draw.shape.radius * view.tilesize * view.ratio,
            0,
            2 * Math.PI
          );
          break;
        case "rect":
          view.context.rect(
            ...view.parseRect(draw.shape, { absolute: draw.absolute })
          );
          break;
        case "line":
          view.context.moveTo(
            ...view.parsePoint(draw.shape[0], { absolute: draw.absolute })
          );
          view.context.lineTo(
            ...view.parsePoint(draw.shape[1], { absolute: draw.absolute })
          );
          break;
        case "text":
          view.context.textAlign = "center";
          view.context.fillText(
            draw.text,
            ...view.parsePoint(draw.shape, { absolute: draw.absolute })
          );
          break;
        case "custom":
          draw.callback(view);
          continue;
      }
      view.context.closePath();
      view.context.stroke();
    }
    this.drawLater.length = 0;
  }
  private createFpsSpan() {
    const span = document.createElement("span");
    this.fpsSpan = span;
    document.body.appendChild(span);
    span.style.position = "absolute";
    span.style.fontSize = "32px";
    span.style.color = "#f0eceb";
    span.style.fontFamily = "Consolas";
  }
  showFps(fps: number) {
    if (this.fpsSpan) {
      this.fpsSpan.innerHTML = `${fps}`;
    } else {
      this.createFpsSpan();
    }
  }
  /** Used to view the content of an object in the gameDebugger window */
  inspect(obj: object) {
    if (!this.active) return;
    if (!this.debugWindow) return;
    this.div.innerHTML = `<pre style="color:#f0eceb;">${JSON.stringify(
      obj,
      null,
      2
    )}</pre>`;
  }
  // Measures the time a function takes to complete(ms)
  measureTime(callback: Function, ...args: any[]) {
    if (!this.active) return;
    let start = performance.now();
    callback(...args);
    this.times.push(performance.now() - start);
  }
  logKey(key: string, ...logParams: Parameters<typeof console.log>) {
    if (this.assignedKeys.includes(key)) return;
    this.assignedKeys.push(key);
    window.addEventListener(
      "keydown",
      (e) => e.key === key && console.log(...logParams)
    );
  }
  activate() {
    this.active = true;
    this.activateButton.onclick = () => this.deactivate();
    this.activateButton.innerText = "DEACTIVATE DEBUG";
  }
  deactivate() {
    this.active = false;
    this.activateButton.onclick = () => this.activate();
    this.activateButton.innerText = "ACTIVATE DEBUG";
  }
  /** Creates a window attached to this Debug instance */
  private createWindow = (width: number, height: number) => {
    this.debugWindow = window.open(
      "",
      "targetWindow",
      `noopener=false,noreferrer=false,popup,width=${width},height=${height}`
    );
    if (this.debugWindow) {
      this.debugWindow.document.body.style.margin = "0";
      this.debugWindow.document.body.style.padding = "0";
      this.debugWindow.window.document.body.style.boxSizing = "border-box";
      this.debugWindow.window.document.body.style.backgroundColor = "black";
      this.debugWindow.window.document.body.style.color = "#f0eceb";
      this.debugWindow.window.document.body.style.padding = "10px";
      this.debugWindow.document.title = "gameDebugger";
      this.debugWindow.document.body.innerHTML = "";
      this.debugWindow.document.body.appendChild(this.div);
      this.debugWindow.addEventListener("keydown", (e) => {
        if (e.key !== "F2") return;
        this.toggleWindow();
      });
    }
  };
  /** Creates a div which will eventually display data */
  private createDiv() {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.inset = "0";
    div.style.fontFamily = '"Lucida Console", "Courier New", monospace';
    return div;
  }
  /** Creates a button used to activate/deactivate gameDebug mode */
  private createActivateButton() {
    let button = document.createElement("button");
    button.innerText = "ACTIVATE DEBUG";
    button.style.position = "absolute";
    button.style.top = "20px";
    button.style.right = "20px";
    button.style.zIndex = "10";
    button.onclick = () => this.activate();
    window.document.body.appendChild(button);
    return button;
  }
  /** Creates an input used to change game speed */
  createDeltaInput(timing: Timing) {
    let input = document.createElement("input");
    input.type = "number";
    input.max = "10";
    input.min = "0.1";
    input.step = "0.1";
    input.defaultValue = "1";
    input.style.position = "absolute";
    input.style.top = "40px";
    input.style.right = "20px";
    input.style.zIndex = "10";
    window.document.body.appendChild(input);
    input.addEventListener("change", (e) => {
      const value = Number(input.value);
      timing.gameTimeRate = value;
    });
    return input;
  }
  /** Creates an input used to change game speed */
  createVolumeInput(soundManager: SoundManager<any, any>) {
    let input = document.createElement("input");
    input.type = "range";
    input.max = "1";
    input.min = "0";
    input.step = "0.05";
    input.defaultValue = Math.sqrt(soundManager.volume).toString();
    input.style.position = "absolute";
    input.style.zIndex = "10";
    input.style.top = "20px";
    input.style.right = "150px";
    input.style.right = "150px";
    window.document.body.appendChild(input);
    input.addEventListener("change", (e) => {
      const value = Number(input.value);
      soundManager.volume = value * value;
    });
    return input;
  }
}

export const gameDebug = new Debug();
