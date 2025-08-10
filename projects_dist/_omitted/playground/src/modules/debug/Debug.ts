import { View } from "modules/View";
import { DrawCallback, DrawShape } from "modules/debug/types";
import { Rect, Point, Line } from "modules/types/shapes";

export class Debug {
  div: HTMLDivElement;
  activateButton: HTMLButtonElement;
  window: Window | null;
  active: boolean;
  times: number[];
  drawLater: (DrawShape & { color: string })[];
  fpsSpan?: HTMLSpanElement;
  constructor() {
    this.div = this.createDiv();
    this.active = false;
    this.times = [];
    this.drawLater = [];
    this.window = null;
    this.activateButton = this.createActivateButton();
  }
  drawRect = (rect: Rect, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({ type: "rect", shape: rect, color });
  };
  drawPoint = (point: Point, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({ type: "point", shape: point, color });
  };
  drawLine = (line: Line, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({ type: "line", shape: line, color });
  };
  drawCustom = (callback: DrawCallback, color: string = "red") => {
    if (!this.active) return;
    this.drawLater.push({
      type: "custom",
      callback,
      color,
    });
  };
  render = (view: View) => {
    if (!this.active) return;
    const pointSize = 0.2;
    for (let draw of this.drawLater) {
      view.context.beginPath();
      view.context.strokeStyle = draw.color;
      switch (draw.type) {
        case "point":
          const square = {
            x: draw.shape.x - pointSize / 2,
            y: draw.shape.y - pointSize / 2,
            w: pointSize,
            h: pointSize,
          };
          view.context.rect(...view.parseRect(square));
          break;
        case "rect":
          view.context.rect(...view.parseRect(draw.shape));
          break;
        case "line":
          view.context.moveTo(...view.parsePoint(draw.shape[0]));
          view.context.lineTo(...view.parsePoint(draw.shape[1]));
          break;
        case "custom":
          draw.callback(view);
          continue;
      }
      view.context.closePath();
      view.context.stroke();
    }
    this.drawLater.length = 0;
  };
  private createFpsSpan = () => {
    const span = document.createElement("span");
    this.fpsSpan = span;
    document.body.appendChild(span);
    span.style.position = "absolute";
    span.style.fontSize = "32px";
    span.style.color = "white";
    span.style.fontFamily="Consolas"
  };
  showFps(fps: number) {
    if (this.fpsSpan) {
      this.fpsSpan.innerHTML = `${fps}`;
    } else {
      this.createFpsSpan();
    }
  }
  /** Used to view the content of an object in the debugger window */
  inspect = (obj: object) => {
    if (!this.active) return;
    console.log("inspecting")
    this.div.innerHTML = `<table style="color:white;">
        ${Object.entries(obj).reduce<string>((acc, [name, value]) => {
          if (["object", "function"].includes(typeof value)) return acc;
          return acc + `<tr><td>${name}</td><td>${value}</td></tr>`;
        }, "")}
      </table>
      `;
  };
  // Measures the time a function takes to complete(ms)
  measureTime = (callback: Function, ...args: any[]) => {
    if (!this.active) return;
    if (!this.active) {
      this.activate();
    }
    let start = performance.now();
    callback(...args);
    this.times.push(performance.now() - start);
  };
  private activate = () => {
    this.createWindow(600, 600);
    this.active = true;
    this.activateButton.onclick = this.deactivate;
    this.activateButton.innerText = "DEACTIVATE DEBUG";
  };
  private deactivate = () => {
    this.window?.close();
    this.window = null;
    this.active = false;
    this.activateButton.onclick = this.activate;
    this.activateButton.innerText = "ACTIVATE DEBUG";
  };
  /** Creates a window attached to this Debug instance */
  private createWindow = (width: number, height: number) => {
    this.window = window.open(
      "",
      "targetWindow",
      `noopener=false,noreferrer=false,popup,width=${width},height=${height}`
    );
    if (this.window) {
      this.active = true;
      this.window.document.body.style.margin = "0";
      this.window.document.body.style.padding = "0";
      this.window.window.document.body.style.boxSizing = "border-box";
      this.window.window.document.body.style.backgroundColor = "black";
      this.window.window.document.body.style.color = "white";
      this.window.window.document.body.style.padding = "10px";
      this.window.document.title = "debugger";
      this.window.document.body.innerHTML = "";
      this.window.document.body.appendChild(this.div);
      this.window.onbeforeunload = this.deactivate;
      this.window.addEventListener("keydown", (e) => {
        if (e.key === "F2") {
          this.window?.close();
        }
      });
    }
  };
  /** Creates a div which will eventually display data */
  private createDiv = () => {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.inset = "0";
    div.style.fontFamily = '"Lucida Console", "Courier New", monospace';
    return div;
  };
  /** Creates a button used to activate/deactivate debug mode */
  private createActivateButton = () => {
    let button = document.createElement("button");
    button.innerText = "ACTIVATE DEBUG";
    button.style.position = "absolute";
    button.style.top = "20px";
    button.style.right = "20px";
    button.onclick = () => this.activate();
    window.document.body.appendChild(button);
    window.addEventListener("keydown", (e) => {
      if (e.key === "F2") {
        const clickEvent = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        button.dispatchEvent(clickEvent);
      }
    });
    return button;
  };
}

export const debug = new Debug();
