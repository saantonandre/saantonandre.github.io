import { Controls } from "@modules/Controls";
import { gameDebug } from "@modules/Debug";
import { Mouse } from "@modules/Mouse";
import { Recorder } from "@modules/Recorder";
import { SoundManager } from "@modules/SoundManager";
import { Timing } from "@modules/Timing";
import { View } from "@modules/View";
import { audioIndex } from "../assets/audio";
import { eventStream } from "./gameEvents";
import { SandboxMode } from "./SandboxMode";


const ratio = 3;
const width = 360 * ratio * (2 / 3);
const height = 240 * ratio * (2 / 3);
const tilesize = 8;
export type GameMode = keyof Game["modes"];
export type GameModeProps = Game["_props"];
// gameDebug.activate();
export class Game {
  private view = new View({ ratio, width, height, tilesize });
  private mouse = new Mouse(this.view);
  // mouseSprite = createMouseSprite(this.mouse,this.view);
  private timing = new Timing({ onFpsCycle: (fps) => gameDebug.showFps(fps) });
  private soundManager = new SoundManager(audioIndex, 1);
  private _props = {
    mouse: this.mouse,
    view: this.view,
    sound: this.soundManager,
  };
  modes = {
    test: new SandboxMode(this._props),
  };
  mode: GameMode = "test";
  private _paused = false;
  private pauseTimestamp = Date.now();
  get paused() {
    return this._paused;
  }
  set paused(value) {
    if (value === this._paused) return;
    this._paused = value;
    if (value) {
      this.pauseTimestamp = Date.now();
      eventStream.post("pause-start", this.pauseTimestamp);
    } else {
      eventStream.post("pause-end", Date.now() - this.pauseTimestamp);
    }
  }
  init() {
    this.loop();
    //@ts-ignore
    window.game = this;
    Recorder.init(this.view.canvas);
    addEventListener("visibilitychange", () => {
      this.paused = document.hidden;
    });
  }
  private loop = (paused = false): void => {
    eventStream.compute();
    eventStream.readMulti(["pause-start", "pause-end"], ({ type }) => {
      paused = type === "pause-start";
      console.log(type);
    });
    if (paused) {
      requestAnimationFrame(() => this.loop(true));
      return;
    }
    Controls.hasNew("1") && Recorder.start();
    Controls.hasNew("2") && Recorder.stop();
    this.timing.compute();
    this.view.compute(this.timing.deltaTime);
    this.mouse.updatePos();
    this.view.canvas.clear();
    this.modes[this.mode].compute();
    gameDebug.render(this.view);
    Controls.resetNew();
    requestAnimationFrame(() => this.loop());
  };
}
