import { isPointToRect } from "@modules/lib/geometry";
import { isIncluded } from "@modules/utils/isIncluded";
import { editorEvents } from "./events";
import { MapEditor } from "./MapEditor";

type Point = { x: number; y: number };

type Handler = (this: HTMLElement, ev: MouseEvent | WheelEvent) => void;
export class MapEditorControls {
  session: MouseSession | undefined;
  currPos = { x: 0, y: 0 };
  listeners: [
    HTMLCanvasElement,
    "wheel" | "mousemove" | "mousedown" | "mouseup",
    Handler
  ][] = [];
  constructor() {
    console.info("[MapEditorControls] initialized");
  }
  setupListeners(editor: MapEditor) {
    if (this.listeners.length) this.clearListeners();
    const canvas = editor.canvas;

    const mousemoveHandler: Handler = (e) => {
      this.mouseMoveHandler(e, editor);
      this.checkMouseCollisions(e, editor);
    };
    this.listeners.push([canvas, "mousemove", mousemoveHandler]);

    const mousedownHandler: Handler = (e) => {
      if (editor.setSpawnPoint && e.button === 0) {
        editor.levels[editor.currentLevel].setSpawnPoint({
          x: Math.floor(this.currPos.x),
          y: Math.floor(this.currPos.y),
        });
        editor.setSpawnPoint = false;
        editor.requestRender();
        return;
      }
      this.openSession(e, editor);
      this.checkMouseCollisions(e, editor);
    };
    this.listeners.push([canvas, "mousedown", mousedownHandler]);

    const mouseupHandler: Handler = (e) => {
      this.closeSession(e, editor);
      this.checkMouseCollisions(e, editor);
    };
    this.listeners.push([canvas, "mouseup", mouseupHandler]);

    const wheelHandler: Handler = (e) => {
      this.handleZoom(e as WheelEvent, editor);
      this.checkMouseCollisions(e, editor);
    };
    this.listeners.push([canvas, "wheel", wheelHandler]);

    for (const [c, ev, fn] of this.listeners) {
      c.addEventListener(ev, fn);
    }
  }
  private clearListeners() {
    for (const [c, ev, fn] of this.listeners) {
      c.removeEventListener(ev, fn);
    }
    this.listeners.length = 0;
  }
  checkMouseCollisions(e: MouseEvent | WheelEvent, editor: MapEditor) {
    e.preventDefault();
    const { offsetX, offsetY } = e;
    this.currPos.x = offsetX / editor.tilesize / editor.ratio + editor.x;
    this.currPos.y = offsetY / editor.tilesize / editor.ratio + editor.y;
    let hoveredRect = undefined;
    if (this.session) return;
    const map = editor.levels[editor.currentLevel].map;
    for (let i = map.length - 1; i >= 0; i--) {
      if (isPointToRect(this.currPos, map[i])) {
        hoveredRect = map[i];
        break;
      }
    }
    editor.hoveredRect = hoveredRect;
  }
  openSession(e: MouseEvent, editor: MapEditor) {
    e.preventDefault();
    if (this.session) return;
    const pressedButton = buttonName[e.button];
    const allowedButtons = ["left", "right"] as const;
    if (!isIncluded(pressedButton, allowedButtons)) return;
    const pos = {
      x: Math.round(e.offsetX / editor.ratio / editor.tilesize + editor.x),
      y: Math.round(e.offsetY / editor.ratio / editor.tilesize + editor.y),
    };
    this.session = new MouseSession(pressedButton, [pos, { ...pos }]);
  }
  closeSession(e: MouseEvent, editor: MapEditor) {
    e.preventDefault();
    if (!this.session) return;
    const releasedButton = buttonName[e.button];
    if (releasedButton !== this.session.type) return;
    const sessionRect = { ...this.session.toRect(), type: editor.tileType };
    if (this.session.type === "left") {
      if (sessionRect.w && sessionRect.h) {
        editor.levels[editor.currentLevel].addRect(sessionRect);
      } else if (!sessionRect.w && !sessionRect.h) {
        const pointRect = {
          x: Math.floor(this.currPos.x),
          y: Math.floor(this.currPos.y),
          h: 1,
          w: 1,
          type: sessionRect.type,
        };
        editor.levels[editor.currentLevel].addRect(pointRect);
      }
    }
    if (this.session.type === "right") {
      if (sessionRect.w * sessionRect.h < 1) {
        editor.levels[editor.currentLevel].removeAtPoint(this.currPos);
      } else {
        editor.levels[editor.currentLevel].clearArea(sessionRect);
      }
    }
    this.session = undefined;
    editorEvents.pub("area-selection");
    editorEvents.pub(
      "level-modified",
      editor.levels[editor.currentLevel].export()
    );
    editor.requestRender();
  }
  handleZoom(e: WheelEvent, editor: MapEditor) {
    e.preventDefault();
    const initWidth = editor.w;
    const initHeight = editor.h;
    editor.ratio += e.deltaY / ((1 / editor.ratio) * 1000);
    const center = editor.center;
    const { offsetX, offsetY } = e;
    const widthDelta = editor.w - initWidth;
    const heightDelta = editor.h - initHeight;
    const xRatio = offsetX / editor.canvas.width - 0.5;
    const yRatio = offsetY / editor.canvas.height - 0.5;
    editor.setCenter({
      x: center.x - widthDelta * xRatio,
      y: center.y - heightDelta * yRatio,
    });
  }
  mouseMoveHandler(e: MouseEvent, editor: MapEditor) {
    e.preventDefault();
    if (isMouseButtonPressed(e, "wheel")) {
      const { movementX, movementY } = e;
      const center = {
        x: editor.center.x - movementX / editor.ratio / editor.tilesize,
        y: editor.center.y - movementY / editor.ratio / editor.tilesize,
      };
      editor.setCenter(center);
      editor.requestRender();
    }
    if (!this.session) return;
    this.session.pos[1].x = Math.round(this.currPos.x);
    this.session.pos[1].y = Math.round(this.currPos.y);
    editorEvents.pub("area-selection");
  }
}
const buttonName = ["left", "wheel", "right"] as const;
const buttonsNames = ["left", "right", "wheel", "back", "forward"] as const;
export function isMouseButtonPressed(
  event: MouseEvent,
  buttonName: (typeof buttonsNames)[number]
) {
  // Use binary `&` with the relevant power of 2 to check if a given button is pressed
  return Boolean(event.buttons & (1 << buttonsNames.indexOf(buttonName)));
}
class MouseSession {
  type: "left" | "right";
  pos: [Point, Point];
  constructor(type: "left" | "right", pos: [Point, Point]) {
    this.type = type;
    this.pos = pos;
  }
  toRect() {
    const x0 = Math.min(this.pos[0].x, this.pos[1].x);
    const y0 = Math.min(this.pos[0].y, this.pos[1].y);
    const x1 = Math.max(this.pos[0].x, this.pos[1].x);
    const y1 = Math.max(this.pos[0].y, this.pos[1].y);
    const sessionRect = {
      x: x0,
      y: y0,
      w: Math.abs(x0 - x1),
      h: Math.abs(y0 - y1),
    };
    return sessionRect;
  }
}
