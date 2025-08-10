import Meta from "modules/meta";
import { CameraLike } from "modules/mouse";

class Debug {
  div: HTMLDivElement;
  activateButton: HTMLButtonElement;
  window: Window | null;
  active: boolean;
  times: number[];
  drawLater: (ColoredPoint | ColoredRect | ColoredLine)[];
  constructor() {
    this.div = this.createDiv();
    this.active = false;
    this.times = [];
    this.drawLater = [];
    this.window = null;
    this.activateButton = this.createActivateButton();
    // this.activate();
  }
  drawRect = (rect: Rect, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({
      color,
      type: "rect",
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
    });
  };
  drawPoint = (point: Point, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({
      color,
      type: "point",
      x: point.x - 0.1,
      y: point.y - 0.1,
      w: 0.2,
      h: 0.2,
    });
  };
  drawLine = (pointA: Point, pointB: Point, color = "red") => {
    if (!this.active) return;
    this.drawLater.push({
      color,
      type: "line",
      x1: pointA.x,
      y1: pointA.y,
      x2: pointB.x,
      y2: pointB.y,
    });
  };
  render = (
    context: CanvasRenderingContext2D,
    tilesize: number,
    ratio: number,
    camera: CameraLike,
  ) => {
    if (!this.active) return;
    for (let draw of this.drawLater) {
      context.beginPath();
      context.strokeStyle = draw.color;
      switch (draw.type) {
        case "point":
        case "rect":
          context.save();
          context.translate(
            (camera.x+draw.x+draw.w/2) * tilesize * ratio,
            (camera.y+draw.y+draw.h/2) * tilesize * ratio
          );
          context.rotate(camera.rot);
          context.rect(
            (-draw.w/2) * tilesize * ratio,
            (-draw.h/2) * tilesize * ratio,
            draw.w * tilesize * ratio,
            draw.h * tilesize * ratio
          );
          context.closePath();
          context.stroke();
          context.restore();
          break;
        case "line":
          context.save();
          context.translate(
            (camera.x+draw.x1) * tilesize * ratio,
            (camera.y+draw.y1) * tilesize * ratio
          );
          context.rotate(camera.rot);
          context.moveTo(
            (0) * tilesize * ratio,
            (0) * tilesize * ratio
          );
          context.lineTo(
            (draw.x2 -draw.x1+0.5) * tilesize * ratio,
            (draw.y2 -draw.y1+0.5) * tilesize * ratio
          );
          context.closePath();
          context.stroke();
          context.restore();
          break;
      }
    }
    this.drawLater.length = 0;
  };
  printTime = () => {
    if (!this.active) return;
    this.div.innerHTML = `Function time: ${this.averageTime().toFixed(4)}ms`;
    this.times.length = 0;
  };
  /** Used to view the content of an object in the debugger window */
  inspect = (obj: object) => {
    if (!this.active) return;
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
    this.window = null;
    this.active = false;
    this.activateButton.onclick = this.activate;
    this.activateButton.innerText = "ACTIVATE DEBUG";
  };
  private averageTime = () => {
    let sum = 0;
    for (let time of this.times) {
      sum += time;
    }
    return sum / this.times.length;
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
export default debug;
