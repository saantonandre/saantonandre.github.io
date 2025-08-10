
import { defaultMapEditorConfig } from "../defaultConfig";
import { editorEvents } from "./events";
import { renderGrid } from "./renderGrid";
import { MapEditorControls } from "./MapEditorControls";
import { MapEditorLevel } from "./MapEditorLevel";
import { TypedRect } from "./rectUtils";
/*
const bc = new BroadcastChannel("editor") 
bc.addEventListener("message",(e)=>{e.data.type&&console.log(e.data.type)},false)
*/

type TileMap = Readonly<Readonly<[number, number]>[]>;
// type DisplayMode = "displayed" | "hitboxes" | "camera";
export type MapEditorConfig = {
  tiles: TileMap;
  sheet: string;
  tilesize: number;
};
const sheet = new Image();
sheet.src = defaultMapEditorConfig.sheet;
export class MapEditor {
  readonly MAX_RATIO = 5;
  readonly MIN_RATIO = 0.0001;
  private renderRequests = 0;
  sheet = new Image();
  tileMap: TileMap = [];
  private _setSpawnPoint = false;
  get setSpawnPoint() {
    return this._setSpawnPoint;
  }
  set setSpawnPoint(value) {
    this._setSpawnPoint = value;
    editorEvents.pub(value ? "spawnpoint-selection-start" : "spawnpoint-selection-end")

    editorEvents.pub("spawnpoint-changed", {
      x: this.levels[this.currentLevel].spawnPoint.x,
      y: this.levels[this.currentLevel].spawnPoint.x,
    });
  }
  tilePatterns: CanvasPattern[] = [];
  private _canvas: HTMLCanvasElement = document.createElement("canvas");
  log = (string: string) => {
    //@ts-ignore
    console.info(`%c[MapEditor] ${string}`, "color:lightgreen;");
  };
  get canvas() {
    return this._canvas;
  }
  set canvas(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.context.imageSmoothingEnabled = false;
    this.resizeCanvas();
    editorEvents.pub("canvas-changed");
    this.controls.setupListeners(this);
    this.updateCamera();
    this.log("canvas changed");
  }
  context: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
  tilesRendered: number = 0;
  tilesize = 16;
  timeToDraw = 0;
  controls = new MapEditorControls();
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  levels: MapEditorLevel[] = [new MapEditorLevel()];
  private _hoveredRect: TypedRect | undefined;
  set hoveredRect(rect: TypedRect | undefined) {
    if (this._hoveredRect === rect) return;
    this._hoveredRect = rect;
    editorEvents.pub("hover-rect");
  }
  get hoveredRect() {
    return this._hoveredRect;
  }
  private _showGrid: boolean = true;
  get showGrid() {
    return this._showGrid;
  }
  set showGrid(value) {
    this._showGrid = value;
    this.requestRender();
    editorEvents.pub("grid-toggled");
  }
  private _showInfo: boolean = true;
  get showInfo() {
    return this._showInfo;
  }
  set showInfo(value) {
    this._showInfo = value;
    editorEvents.pub("info-toggled");
  }
  private _tileType = 0;
  get tileType() {
    return this._tileType;
  }
  set tileType(value) {
    this._tileType = value;
    editorEvents.pub("tile-selected");
  }
  private _ratio = 1;
  get ratio() {
    return this._ratio;
  }
  set ratio(value) {
    let finalValue = value;
    if (value > this.MAX_RATIO) finalValue = this.MAX_RATIO;
    if (value < this.MIN_RATIO) finalValue = this.MIN_RATIO;
    this._ratio = finalValue;
    this.updateCamera();
    editorEvents.pub("ratio-change");
  }
  private _center = { x: 0, y: 0 };
  get center() {
    return this._center;
  }
  private set center({ x, y }) {
    this._center.x = x;
    this._center.y = y;
    this.updateCamera();
  }
  private _currentLevel = 0;
  get currentLevel() {
    return this._currentLevel;
  }
  set currentLevel(level) {
    this._currentLevel = level;
    this.requestRender();
    editorEvents.pub("level-changed");
  }
  constructor(
    mapEditorConfig: Partial<MapEditorConfig> = defaultMapEditorConfig
  ) {
    const config = { ...defaultMapEditorConfig, ...mapEditorConfig };
    this.importSheet(config.sheet, config.tiles, this.tilesize).then(() => {
      this.log("initialized");
      this.renderLoop();
      addEventListener("resize", this.resizeCanvas);
      console.log("aooooo")
      editorEvents.pub("initialized");
    });
  }
  /** Renders everything */
  private render = () => {
    this.tilesRendered = 0;
    const t0 = performance.now();
    this.clearContext();
    this.levels[this.currentLevel].render(this);
    this.showGrid && this.renderGrid();
    this.levels[this.currentLevel].renderSpawnPoint(this);
    this.timeToDraw = performance.now() - t0;
  };
  setCenter = (newCenter: { x: number; y: number }) => {
    this.center = newCenter;
    editorEvents.pub("camera-move")
  };
  renderLoop = () => {
    if (this.renderRequests) {
      this.log(`render (${this.renderRequests} requests)`);
      this.render();
      this.renderRequests = 0;
    }
    requestAnimationFrame(this.renderLoop);
  };
  /** Requests the map editor to rerender. Will render at max ONCE per animation frame. */
  requestRender = () => {
    this.renderRequests++;
  };
  /** Imports a tilesheet and creates */
  importSheet = async (
    sheetSrc: string,
    tileMap: MapEditorConfig["tiles"],
    tilesize: number
  ) => {
    this.tilesize = tilesize;
    this.tileMap = tileMap;
    const sheetLoadPromise = new Promise((resolve) => {
      this.sheet.addEventListener("load", () => resolve(true), { once: true });
    });
    this.sheet.src = sheetSrc;
    await sheetLoadPromise;
    this.log("Sheet loaded");
    this.tilePatterns = this.createTilePatterns();
    this.requestRender();
  };

  /** Readjusts the camera. Has to be called whenever ratio/tilesize or canvas siezes are changed */
  updateCamera = () => {
    this.w = this.canvas.width / this.ratio / this.tilesize;
    this.h = this.canvas.height / this.ratio / this.tilesize;
    const center = this.center;
    this.x = center.x - this.w / 2;
    this.y = center.y - this.h / 2;
    this.requestRender();
  };
  resizeCanvas = () => {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.updateCamera();
  };
  private createTilePatterns = () => {
    this.log("creating tiles patterns");
    const offCanvas = new OffscreenCanvas(this.tilesize, this.tilesize);
    const offContext = offCanvas.getContext("2d")!;
    offContext.imageSmoothingEnabled = false;
    const tilePatterns = [];
    for (const [x, y] of this.tileMap) {
      offContext?.drawImage(
        this.sheet,
        x * this.tilesize,
        y * this.tilesize,
        this.tilesize,
        this.tilesize,
        0,
        0,
        this.tilesize,
        this.tilesize
      );
      const data = offCanvas.transferToImageBitmap();
      tilePatterns.push(offContext.createPattern(data, "repeat")!);
    }
    return tilePatterns;
  };
  addLevel = () => {
    this.levels.push(new MapEditorLevel());
    this.requestRender();
    editorEvents.pub("level-added");
  };
  removeLevel = (level: number) => {
    if (this.levels.length === 1) return;
    this.levels.splice(level, 1);
    if (this.currentLevel > this.levels.length - 1) {
      this.currentLevel = this.levels.length - 1;
    }
    this.requestRender();
    editorEvents.pub("level-removed");
  };
  /** Clears the canvas */
  private clearContext = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  renderGrid = renderGrid;
}
