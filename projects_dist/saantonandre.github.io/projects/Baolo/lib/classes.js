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

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.sheet = id("sheet");
    this.actionX = [
      [4],
      [5],
      [4, 4],
      [5, 5]
    ];
    this.actionY = [
      [0],
      [0],
      [0, 1],
      [0, 1]
    ];
    this.speed = 0.1;
    this.left = 0;

  }
  computeControls() {
    let left = controls.left;
    let right = controls.right;
    let up = controls.up;
    let down = controls.down;

    if (left) {
      this.xVel = -this.speed;
      this.left = 1;
    }
    if (right) {
      this.xVel = this.speed;
      this.left = 0;
    }

    if (!left && !right) {
      this.xVel = 0;
    }
    if (!up && !down) {
      this.yVel = 0;
    }

    if (up) {
      this.yVel = -this.speed;
    }
    if (down) {
      this.yVel = this.speed;
    }
  }
  computeAction() {
    if (this.xVel != 0 || this.yVel != 0) {
      this.action = 2;
    } else {
      this.action = 0;
    }
  }
  compute() {
    this.computeControls();
    this.computeAction();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
    }
    c.drawImage(
      this.sheet,
      this.actionX[this.action + this.left][this.frame] * meta.tileSize,
      this.actionY[this.action + this.left][this.frame] * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      this.x * meta.ratio * meta.tileSize,
      this.y * meta.ratio * meta.tileSize,
      this.w * meta.ratio * meta.tileSize,
      this.h * meta.ratio * meta.tileSize
    )
  }

}
class Baolo extends Entity {
  constructor(x, y) {
    super(x, y);
    this.sheet = id("sheet");
    this.actionX = [
      [0],
      [2],
      [0, 0, 0, 0],
      [2, 2, 2, 2]
    ];
    this.actionY = [
      [0],
      [0],
      [0, 2, 4, 6],
      [0, 2, 4, 6]
    ];
    this.w = 2;
    this.h = 2;
    this.speed = 0.06;
    this.left = 0;

  }
  computeAI() {
    let left = player.x + player.w < this.x;
    let right = player.x > this.x + this.w;
    let up = player.y + player.h < this.y;
    let down = player.y > this.y + this.h;
    if (left) {
      this.xVel = -this.speed;
      this.left = 1;
    }
    if (right) {
      this.xVel = this.speed;
      this.left = 0;
    }


    if (up) {
      this.yVel = -this.speed;
    }
    if (down) {
      this.yVel = this.speed;
    }
    if (!left && !right) {
      this.xVel = 0;
    }
    if (!up && !down) {
      this.yVel = 0;
    }
  }
  computeAction() {
    if (this.xVel != 0 || this.yVel != 0) {
      this.action = 2;
    } else {
      this.action = 0;
    }
  }
  compute() {
    this.computeAI();
    this.computeAction();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
    }
    c.drawImage(
      this.sheet,
      this.actionX[this.action + this.left][this.frame] * meta.tileSize,
      this.actionY[this.action + this.left][this.frame] * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      this.x * meta.ratio * meta.tileSize,
      this.y * meta.ratio * meta.tileSize,
      this.w * meta.ratio * meta.tileSize,
      this.h * meta.ratio * meta.tileSize
    )
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