import { isPointToRect, isRectToRect } from "@modules/lib/geometry";
import { Point } from "@modules/lib/shapes";
import { MapEditor } from "./MapEditor";
import { TypedRect, isRectInRect } from "./rectUtils";


export type MapEditorLevelExport = {
  map: TypedRect[];
  camBoxes: TypedRect[];
  spawnPoint: { x: number; y: number };
};
const wow = {};

export class MapEditorLevel {
  map: TypedRect[] = [];
  camBoxes: TypedRect[] = [];
  spawnPoint = { x: 0, y: 0 };
  toJSON = () => {
    return JSON.stringify({
      map: this.map,
      camBoxes: this.camBoxes,
      spawnPoint: this.spawnPoint,
    });
  };
  export(): MapEditorLevelExport {
    return {
      map: this.map,
      camBoxes: this.camBoxes,
      spawnPoint: this.spawnPoint,
    };
  }
  clear() {
    this.map.length = 0;
    this.camBoxes.length = 0;
    this.spawnPoint = { x: 0, y: 0 };
  }
  addRect(rect: TypedRect) {
    this.map.push(rect);
  }
  removeAtPoint(point: Point) {
    for (let i = this.map.length - 1; i >= 0; i--) {
      const rect = this.map[i];
      if (isPointToRect(point, rect)) {
        this.removeRect(rect);
        break;
      }
    }
  }
  setSpawnPoint = (point: Point) => {
    this.spawnPoint.x = point.x;
    this.spawnPoint.y = point.y;
  };
  clearArea(clearRect: TypedRect) {
    for (let i = this.map.length - 1; i >= 0; i--) {
      const rect = this.map[i];
      if (isRectInRect(rect, clearRect)) {
        this.removeRect(rect);
      }
    }
  }
  removeRect = (rect: TypedRect) => {
    this.map.splice(this.map.indexOf(rect), 1);
  };
  render = (editor: MapEditor) => {
    const mult = editor.tilesize * editor.ratio;
    for (const rect of this.map) {
      if (!isRectToRect(rect, editor)) continue;
      editor.tilesRendered += rect.w * rect.h;
      const xOffset = editor.x % 1;
      const yOffset = editor.y % 1;
      editor.context.fillStyle = editor.tilePatterns[rect.type];
      editor.context.save();
      editor.context.translate(-xOffset * mult, -yOffset * mult);
      editor.context.scale(editor.ratio, editor.ratio);
      editor.context.fillRect(
        (rect.x - editor.x + xOffset) * editor.tilesize,
        (rect.y - editor.y + yOffset) * editor.tilesize,
        rect.w * editor.tilesize,
        rect.h * editor.tilesize
      );
      editor.context.restore();
    }
  };
  renderSpawnPoint = (editor: MapEditor) => {
    const mult = editor.tilesize * editor.ratio;
    editor.context.strokeStyle = "#ffffff";
    editor.context.lineWidth = 2;
    editor.context.strokeRect(
      (this.spawnPoint.x - editor.x) * mult,
      (this.spawnPoint.y - editor.y) * mult,
      1 * mult,
      1 * mult
    );
    editor.context.fillStyle = "#0000ff";
    editor.context.fillRect(
      (this.spawnPoint.x - editor.x) * mult,
      (this.spawnPoint.y - editor.y) * mult,
      1 * mult,
      1 * mult
    );
    editor.context.textAlign = "center";
    editor.context.fillStyle = "white";
    editor.context.fillText(
      "PLAYER",
      (this.spawnPoint.x + 0.5 - editor.x) * mult,
      (this.spawnPoint.y - 0.5 - editor.y) * mult
    );
    editor.context.lineWidth = 1;
    editor.context.strokeStyle = "#fff8";
    editor.context.beginPath();
    editor.context.moveTo(
      (this.spawnPoint.x + 0.5 - editor.x) * mult,
      (this.spawnPoint.y - 0.3 - editor.y) * mult
    );
    editor.context.lineTo(
      (this.spawnPoint.x + 0.5 - editor.x) * mult,
      (this.spawnPoint.y + 0.5 - editor.y) * mult
    );
    editor.context.stroke();
    editor.context.closePath();
  };
}
