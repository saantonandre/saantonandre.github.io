import { gameDebug } from "modules/Debug";

const BASE_RATE = 1000 / 60;

export class Timing {
  onRateChange: (rate: number) => void;
  private _gameTimeRate = BASE_RATE;
  set gameTimeRate(rate: number) {
    this._gameTimeRate = BASE_RATE / rate;
    this.onRateChange?.(rate);
    console.log("rate change")
  }
  get gameTimeRate() {
    return this._gameTimeRate;
  }
  maxDeltaTime = Infinity;
  /** Frames per second */
  fps = 0;
  totalFrames = 0;
  /** [countdown, Callback] game time setTimeout functions to be called. */
  private callbacks: [number, Function][] = [];
  /** Total game time. */
  gameTime = 0;
  /** Game time multiplier */
  deltaTime = 1;
  /** Last iteration's timestamp */
  private previousTime = Date.now();
  /** Current iteration's timestamp */
  private currentTime = Date.now();

  updateCurrentTime() {
    this.currentTime = Date.now();
  }
  constructor({
    onRateChange = (rate: number) => {},
    onFpsCycle = (fps: number) => {},
  } = {}) {
    this.onRateChange = onRateChange;
    setInterval(() => {
      if (this.fps === 0) return; // Do not trigger if paused
      onFpsCycle(this.fps);
      this.fps = 0;
    }, 1000);
  }
  /** Updates deltaTime and the fps counter */
  compute() {
    this.previousTime = this.currentTime;
    this.currentTime = Date.now();
    const delta = this.currentTime - this.previousTime;
    this.deltaTime = delta / this.gameTimeRate;

    // Forces the time multiplication to be at max two times the norm
    if (this.deltaTime > this.maxDeltaTime) {
      this.deltaTime = this.maxDeltaTime;
    }
    for (let i = this.callbacks.length - 1; i >= 0; i--) {
      this.callbacks[i][0] -= this.deltaTime * BASE_RATE;
      if (this.callbacks[i][0] > 0) continue;
      this.callbacks[i][1]();
      this.callbacks.splice(i, 1);
    }
    this.fps++;
    this.totalFrames++;
    this.gameTime += this.deltaTime;
  }
  /** Like `setTimeout` but "game time" aware */
  deltaTimeout(callback: Function, timeout: number) {
    this.callbacks.push([timeout, callback]);
  }
  /** Like `setTimeout` but "game time" aware */
  clearTimeouts() {
    this.callbacks.length = 0;
  }
}
