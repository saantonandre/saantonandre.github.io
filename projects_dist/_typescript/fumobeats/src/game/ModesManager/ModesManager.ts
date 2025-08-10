import { Controls } from "modules/Controls";
import { gameDebug } from "modules/Debug";
import { Mouse } from "modules/Mouse";
import { Timing } from "modules/Timing";
import { View } from "modules/View";
import { othersIndex } from "assets/others";
import { eventStream } from "game/gameEvents";
import { SoundManager } from "modules/SoundManager";
import { audioIndex } from "assets/audio";
import { FilesHandler } from "game/FilesHandler";
import { GameOverlay } from "game/ModesManager/GameOverlay";
import { PlaylistMode } from "game/Modes/PlaylistMode/PlaylistMode";
import { BeatsMode } from "game/Modes/BeatsMode/BeatsMode";
import { EditorMode } from "game/Modes/EditorMode/EditorMode";
import { InfiniteMode } from "game/Modes/InfiniteMode/InfiniteMode";
import { MainMenu } from "game/Modes/MainMenu/MainMenu";
import { Sandbox } from "game/Modes/Sandbox";
import { FumobeatsStorage } from "game/FumobeatsStorage/FumobeatsStorage";

export const firstCoffee = new FontFace(
  "FirstCoffee",
  `url(${othersIndex._first_coffee_ttf})`
);
document.fonts.add(firstCoffee);
await firstCoffee.load();
export type GameModes = keyof ModesManager["modes"];
const ratio = 2;
const width = 360 * ratio;
const height = 240 * ratio;
export class ModesManager {
  private view = new View({ ratio, width, height });
  private mouse = new Mouse(this.view);
  // mouseSprite = createMouseSprite(this.mouse,this.view);
  private timing = new Timing();
  private resume: boolean = false;
  private stopped: boolean = false;
  private soundManager = new SoundManager(audioIndex, 1);
  private filesHandler = new FilesHandler(this.view.canvas);
  private fumoStorage = new FumobeatsStorage("fumobeats-db", "fumobeats-db");
  private _props = {
    mouse: this.mouse,
    view: this.view,
    sound: this.soundManager,
  };
  modes = {
    menu: new MainMenu(this._props),
    arcade: new InfiniteMode(this._props),
    editor: new EditorMode(this._props),
    playlist: new PlaylistMode({
      ...this._props,
      fumobeatsDB: this.fumoStorage.fumobeats,
    }),
    beats: new BeatsMode(this._props),
    sandbox: new Sandbox(this._props),
  };
  mode: GameModes = "menu";
  private overlay = new GameOverlay(this._props);
  togglePause = (value?: "resume" | "pause") => {
    if (value === "pause" && this.stopped) return;
    if (value === "resume" && !this.stopped) return;
    eventStream.post(this.stopped ? "game-resume" : "game-pause");
    this.resume = this.stopped;
    this.soundManager.speed = this.stopped ? 1 : 0;
    this.stopped = !this.stopped;
    if (!this.stopped) this.loop();
  };
  init() {
    this.loop();
    gameDebug.createVolumeInput(this.soundManager);
    window.addEventListener("keydown", ({ key }) => {
      if (key === "2") {
        this.togglePause();
      }
      if (key === "Escape") {
        eventStream.post("switch-mode", { mode: "menu" });
      }
    });
    document.addEventListener("visibilitychange", (e) => {
      this.togglePause(document.hidden ? "pause" : "resume");
    });
    window.addEventListener("scroll", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      eventStream.post("scroll", { direction: Math.sign(e.deltaY) });
    });
  }
  private loop = () => {
    if (this.stopped) return;
    eventStream.compute();
    this.filesHandler.compute(this.mode);
    this.fumoStorage.compute();
    eventStream.read("switch-mode", ({ mode }) => {
      this.switchMode(mode);
    });
    if (Controls.hasNew("Escape")) {
      this.switchMode("menu");
    }

    this.view.canvas.clear();
    this.timing.compute();
    this.view.compute(this.timing.deltaTime);
    this.mouse.updatePos();
    this.modes[this.mode].compute(this.consumeResumeToken());
    this.overlay.compute();
    gameDebug.render(this.view);
    Controls.resetNew();
    requestAnimationFrame(this.loop);
  };
  private switchMode = (mode: (typeof this)["mode"]) => {
    if (!this.modes[mode]) {
      alert(
        `Trying to switch to an unexisting mode "${mode}". Available mods are ${Object.keys(
          this.modes
        )}`
      );
      return;
    }
    this.modes[this.mode].onSwitchOut();
    this.mode = mode;
    this.resume = true;
  };
  private consumeResumeToken() {
    if (this.resume) {
      this.resume = false;
      return true;
    }
    return false;
  }
}
