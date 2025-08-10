/*
  CLASS LIST:

  class Meta

  class Mouse

 */

//const SHEET = id("sheet");
class Meta {
  constructor() {
    this.fps = 0;
    this.loopType = 0;
    this.ratio = 2;
    this.deltaTime = 1;
    this.targetFrames = 60;
    this.tileSize = 16;
    this.tilesWidth = 32;
    this.tilesHeight = 20;
    this.terminalVel = 0.5;
    // Delta Time Computing
    this.perfectFrameTime = 1000 / this.targetFrames;
    this.lastTimestamp = Date.now();
    this.timestamp = Date.now();
    this.bulletTime = false;
  }
  updateDeltaTime() {
    this.lastTimestamp = this.timestamp;
    this.timestamp = Date.now();
    this.deltaTime =
      (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

    // Forces the max slowness as half the fps target
    if (this.deltaTime > 2) {
      this.deltaTime = 2;
    }
  }
}
class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.w = 1;
    this.h = 1;
    this.type = "null";
    this.immovable = false;
    this.damaged = false;
    this.state = IDLE;

    this.notSolid = false;
    this.removed = false;
    this.left = 0;

    this.sheet = id("sheet");
    this.action = 0;
    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;

    this.col = {
      L: 0,
      R: 0,
      T: 0,
      B: 0,
    };
    this.col = {
      L: 0,
      R: 0,
      T: 0,
      B: 0,
    };
  }
  compute() {}
  render() {
    /*

        this.frameCounter += meta.deltaTime;
        if (this.frameCounter >= this.slowness) {
          this.frame++;
          this.frameCounter = 0;
        }
        if (this.frame >= this.actionX[this.action].length) {
          this.frame = 0;
        }

        c.save();
        c.translate((this.x + this.w / 2) * meta.ratio * meta.tileSize,
          (this.y + this.h / 2) * meta.ratio * meta.tileSize);
        c.rotate(this.rot + Math.PI / 2)
        c.drawImage(
          this.sheet,
          this.actionX[this.action][this.frame] * meta.tileSize,
          this.actionY[this.action][this.frame] * meta.tileSize,
          this.w * meta.tileSize,
          this.h * meta.tileSize,
          -this.w / 2 * meta.ratio * meta.tileSize,
          -this.h / 2 * meta.ratio * meta.tileSize,
          this.w * meta.ratio * meta.tileSize,
          this.h * meta.ratio * meta.tileSize
        )
        c.restore();
    */

  }
}
class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    document.addEventListener("mousemove", this.update);
    document.addEventListener("click", this.onClick);
  }
  update(event) {
    this.x = event.clientX - canvas.offsetLeft;
    this.y = event.clientY - canvas.offsetTop;
  }
  onClick() {}
}