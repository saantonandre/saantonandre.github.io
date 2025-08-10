import { debug } from "modules/debug";

export class Timing {
  config = {
    /** Target interval per frame */
    targetTime: 1000 / 60,
    maxDeltaTime: 2,
  };
  /** Frames per second */
  fps = 0;
  /** Game time multiplier */
  deltaTime = 1;
  /** Last iteration's timestamp */
  private previousTime = Date.now();
  /** Current iteration's timestamp */
  private currentTime = Date.now();
  constructor(config?: Partial<Timing["config"]>) {
    this.config = { ...this.config, ...config };
    setInterval(() => {
      debug.showFps(this.fps)
      this.fps = 0;
    }, 1000);
  }
  /** Updates deltaTime and the fps counter */
  compute = () => {
    this.previousTime = this.currentTime;
    this.currentTime = Date.now();
    this.deltaTime =
      (this.currentTime - this.previousTime) / this.config.targetTime;

    // Forces the time multiplication to be at max two times the norm
    if (this.deltaTime > this.config.maxDeltaTime) {
      this.deltaTime = this.config.maxDeltaTime;
    }
    this.fps++;
  };
}
