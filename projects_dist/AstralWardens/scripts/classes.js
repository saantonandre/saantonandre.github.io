/*
CLASS LIST

class Meta

class MapObject

class Entity

class Vfx

class FlyVfx

class Asteroid

class Puncher

class Bullet

class Gunner

class Mouse

class Star



*/
class Meta {
  constructor() {
    this.fps = 0;
    this.loopType = 0;
    this.ratio = 2;
    this.deltaTime = 1;
    this.targetFrames = 60;
    this.tilesize = 16;
    this.tilesWidth = 22;
    this.tilesHeight = 14;
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
// Generate the map
// Generate the levels / Populate the rooms
class MapObject {
  constructor() {
    this.tiles = [];
  }
  compute() {}
  render() {}
}

class Sounds {
  constructor() {
    this.playbackRate = 1;
    this.volume = 1;

    Audio.prototype.baseVolume = 1;
    Audio.prototype.isMusic = false;
    Audio.prototype.changeVolume = function () {
      let aud = this;
      if (aud.isMusic) {
        aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
      } else {
        aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
      }
    };
    Audio.prototype.playy = function () {
      let aud = this;
      aud.playbackRate = sounds.playbackRate;
      if (aud.isMusic) {
        aud.volume = aud.baseVolume * meta.volume * meta.musicVolume;
      } else {
        aud.volume = aud.baseVolume * meta.volume * meta.sfxsVolume;
      }
      if (aud.paused) {
        if (!aud.loop) {
          aud.currentTime = 0;
        }
        let promise = aud.play();
        if (promise !== undefined) {
          promise.catch(function (e) {});
        }
      } else {
        if (aud.loop) {
          return;
        }
        aud.pause();
        aud.currentTime = 0;
        let promise = aud.play();
        if (promise !== undefined) {
          promise.catch(function (e) {
            console.log(e);
          });
        }
      }
    };

    // Audio files goes here like: this.soundName = id("soundName");
  }
  changeGlobalVolume(targetVolume) {}
  changeGlobalPlaybackRate(playbackRate) {
    this.playbackRate = playbackRate;
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
  render() {}
}

class Vfx extends Entity {
  constructor(x, y, which) {
    super(x, y);
    this.which = which || 0;
    //compute/render even if out of screen
    this.important = false;
    /*
      VFXs:
      0 : hit 

      */
    this.type = "vfx";
    this.actionX = [
      [13, 13, 13, 13],
      [15, 15, 15, 15],
    ];
    this.actionY = [
      [10, 12, 14, 16],
      [10, 12, 14, 16],
    ];
    this.initialize();
  }
  reset(x, y, which) {
    this.removed = false;
    this.x = x;
    this.y = y;
    this.which = which || 0;
    this.action = 0;
    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;
    this.initialize();
  }
  initialize() {
    switch (this.which) {
      case 0: // Hit
        this.w = 2;
        this.h = 2;
        this.x -= this.w / 2 + (Math.random() - 0.5);
        this.y -= this.h / 2 + (Math.random() - 0.5);
        break;
      case 1: // Bullet Hit
        this.w = 2;
        this.h = 2;
        this.x -= this.w / 2 + (Math.random() - 0.5);
        this.y -= this.h / 2 + (Math.random() - 0.5);
        break;
    }
  }
  compute() {}
  onAnimationEnded() {
    switch (this.which) {
      default:
        this.removed =true;
    }
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.which].length) {
      this.frame = 0;
      this.onAnimationEnded();
      if (this.removed) {
        return;
      }
    }
    c.drawImage(
      this.sheet,
      this.actionX[this.which][this.frame] * meta.tilesize,
      this.actionY[this.which][this.frame] * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      this.x * meta.tilesize * meta.ratio,
      this.y * meta.tilesize * meta.ratio,
      this.w * meta.tilesize * meta.ratio,
      this.h * meta.tilesize * meta.ratio
    );
  }
}

// The flying stuff
class FlyVfx {
  constructor(x, y, which) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    //compute/render even if out of screen
    this.important = false;
    this.strikeable = false;
    this.rotation = 0;
    this.rotSpeed = Math.random() * 10;
    this.xVel = Math.random() * 0.2 - 0.15;
    this.yVel = -Math.random() * 0.3 - 0.1;
    this.sheet = id("sheet");
    this.which = which;
    this.type = "flyVfx";
    this.gForce = 0.01;

    this.xPos = 18; // X Position on the spritesheet
  }
  reset(x, y, which) {
    this.removed = false;
    this.x = x; 
    this.y = y;
    this.which = which;
    this.rotation = 0;
    this.rotSpeed = Math.random() * 10;
    this.xVel = Math.random() * 0.2 - 0.15;
    this.yVel = -Math.random() * 0.3 - 0.1;
  }
  compute() {
    this.yVel += this.gForce * meta.deltaTime;
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    this.rotation += this.rotSpeed * meta.deltaTime;
    if (this.y > meta.tilesHeight) {
      this.removed = true;
    }
  }
  render() {
    c.save();
    c.translate(
      (this.x + this.w / 2) * meta.tilesize * meta.ratio,
      (this.y + this.h / 2) * meta.tilesize * meta.ratio
    );
    //
    c.rotate((this.rotation * Math.PI) / 180);
    c.drawImage(
      this.sheet,
      this.xPos * meta.tilesize,
      this.which * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      ((-this.w / 2) * meta.tilesize * meta.ratio) | 0,
      ((-this.h / 2) * meta.tilesize * meta.ratio) | 0,
      (this.w * meta.tilesize * meta.ratio) | 0,
      (this.h * meta.tilesize * meta.ratio) | 0
    );
    c.restore();
  }
}

class Asteroid extends Entity {
  constructor(x, y) {
    super(x, y);
    this.yVel = 0.1;
    this.xVel = 0;
    this.w = ((Math.random() * 2) | 0) + 1;
    this.h = this.w;

    if (this.w == 2) {
      this.action = 1;
    }

    this.type = "asteroid";
    this.rotation = 0;
    this.accel = 0.005;
    this.speed = 0.1;
    this.rotSpeed = Math.random() * 10;

    /* ACTIONS:
    0 - Small
    1 - Big
    */
    this.actionX = [
      [8, 8],
      [9, 9, 9],
    ];
    this.actionY = [
      [0, 1],
      [0, 2, 4],
    ];
    this.left = false;
  }
  reset(x, y) {
    this.removed = false;

    this.x = x;
    this.y = y;
    this.yVel = 0.1;
    this.xVel = 0;
    this.w = ((Math.random() * 2) | 0) + 1;
    this.h = this.w;
    if (this.w == 2) {
      this.action = 1;
    }else {
      this.action = 0;
    }
    this.rotation = 0;
    this.accel = 0.005;
    this.speed = 0.1;
    this.rotSpeed = Math.random() * 10;

    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;

  }
  onHit() {
    let size = 0;
    size += this.frame;
    size += (Math.random() * 3) | 0;
    size += this.w - 1;

    reloadEntity("flyVfx", this.x + this.w / 2, this.y + this.h / 2, size);
    reloadEntity("flyVfx", this.x + this.w / 2, this.y + this.h / 2, size + 1);

    this.frame++;
    if (this.frame >= this.actionX[this.action].length) {
      this.removed = true;
    }
    this.rotSpeed *= -1;
    this.rotSpeed /= 2;
    this.yVel = -0.2;
  }
  compute() {
    if (this.yVel < this.speed) {
      this.yVel += this.accel * meta.deltaTime;
    } else {
      this.yVel = this.speed;
    }

    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    this.rotation += this.rotSpeed * meta.deltaTime;
    if (this.y > meta.tilesHeight) {
      this.removed = true;
    }
  }
  render() {
    c.save();
    c.translate(
      (this.x + this.w / 2) * meta.tilesize * meta.ratio,
      (this.y + this.h / 2) * meta.tilesize * meta.ratio
    );
    //
    c.rotate((this.rotation * Math.PI) / 180);
    c.drawImage(
      this.sheet,
      this.actionX[this.action][this.frame] * meta.tilesize,
      this.actionY[this.action][this.frame] * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      ((-this.w / 2) * meta.tilesize * meta.ratio) | 0,
      ((-this.h / 2) * meta.tilesize * meta.ratio) | 0,
      (this.w * meta.tilesize * meta.ratio) | 0,
      (this.h * meta.tilesize * meta.ratio) | 0
    );
    c.restore();
  }
}
function switchChar() {
  let x = player.x;
  let y = player.y;
  let left = player.left;
  if (player.char == "gunner") {
    player = puncher;
    player.x = x;
    player.y = y;
    player.left = left;
  } else {
    player = gunner;
    player.x = x;
    player.y = y;
    player.left = left;
  }
}
class Puncher extends Entity {
  constructor(which) {
    super(0, 0);
    this.which = which;
    this.w = 2;
    this.h = 2;
    this.x = meta.tilesWidth / 2;
    this.y = meta.tilesHeight - this.h;
    this.char = "puncher";
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 0.15;

    this.col = {
      L: 0,
      R: 0,
      T: 0,
      B: 0,
    };
    /* ACTIONS:
    0 - IDLE
    1 - IDLE L
    2 - WALK
    3 - WALK L
    4 - ATTACK
    5 - ATTACK L
    6 - DASH
    7 - DASH L
    */
    this.actionX = [
      [0],
      [2],
      [0, 2, 4],
      [4, 2, 0],
      [0, 2, 4],
      [4, 2, 0],
      [4, 6],
      [4, 6],
    ];
    this.actionY = [
      [8],
      [8],
      [0, 0, 0],
      [2, 2, 2],
      [4, 4, 4],
      [6, 6, 6],
      [8, 8],
      [10, 10],
    ];
    this.left = false;
    this.attacking = false;
    this.dashing = false;
  }
  attack() {
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].removed) {
        continue;
      }
      if (collided(this, entities[i])) {
        entities[i].onHit();
        entities[i].y = this.y - entities[i].h;
        reloadEntity("vfx", this.x + this.w / 2, this.y, 0);
      }
    }
  }
  computeInput() {
    if (this.attacking) {
      this.attack();
      this.xVel = 0;
      return;
    } else if (controls.e) {
      controls.e = false;
      this.attacking = true;
      this.action = 4;
      this.frame = 0;
      this.frameCounter = 0;
      this.attack();
      return;
    }
    if (controls.left && !controls.right) {
      this.left = true;
      this.xVel = -this.speed;
      this.action = 2;
    }
    if (controls.right && !controls.left) {
      this.left = false;
      this.xVel = this.speed;
      this.action = 2;
    }
    if (
      (!controls.right && !controls.left) ||
      (controls.right && controls.left)
    ) {
      this.xVel = 0;
      this.action = 0;
    }
    if (controls.spacebar) {
      this.action = 6;
      this.dashing = true;
      this.xVel = -this.speed * 3 * (this.left * 2 - 1);
      return;
    }
    if (controls.t) {
      switchChar();
      controls.t = false;
    }
  }
  compute() {
    this.computeInput();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
  }
  onAnimationEnded() {
    switch (this.action) {
      case 4:
        //attacking
        this.attacking = false;
        this.action = 0;
        break;
    }
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
      this.onAnimationEnded();
    }
    c.drawImage(
      this.sheet,
      this.actionX[this.action + this.left][this.frame] * meta.tilesize,
      this.actionY[this.action + this.left][this.frame] * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      this.x * meta.tilesize * meta.ratio,
      this.y * meta.tilesize * meta.ratio,
      this.w * meta.tilesize * meta.ratio,
      this.h * meta.tilesize * meta.ratio
    );
  }
}
class Bullet extends Entity {
  constructor(x, y, left, which) {
    super(x, y);
    this.x -= this.w / 2;
    this.y -= this.h / 2;
    this.left = left;
    this.which = which ? which : 0;

    this.speed = 0.3;
    this.xVel = this.left ? -this.speed : this.speed;
    this.yVel = -this.speed;
    this.action = 0;
    this.actionX = [
      [11, 11, 11],
      [12, 12, 12],
      [11, 11, 11],
      [12, 12, 12],
    ];
    this.actionY = [
      [10, 11, 12],
      [10, 11, 12],
      [13, 14, 15],
      [13, 14, 15],
    ];
    this.type = "bullet";
    switch (which) {
      case 0:
        this.action = 0;
        this.xVel = this.left ? -this.speed : this.speed;
        this.yVel = -this.speed;
        break;
      case 1:
        this.action = 2;
        this.speed *= 1.5;
        this.xVel = this.left ? -this.speed : this.speed;
        this.yVel = 0;
        break;
    }
  }
  reset(x, y, left, which) {
    this.removed = false;

    this.action = 0;
    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;

    this.x = x - this.w / 2;
    this.y = y - this.h / 2;
    this.left = left;
    this.which = which ? which : 0;

    this.speed = 0.3;
    this.xVel = this.left ? -this.speed : this.speed;
    this.yVel = -this.speed;

    switch (which) {
      case 0:
        this.action = 0;
        this.xVel = this.left ? -this.speed : this.speed;
        this.yVel = -this.speed;
        break;
      case 1:
        this.action = 2;
        this.speed *= 1.5;
        this.xVel = this.left ? -this.speed : this.speed;
        this.yVel = 0;
        break;
    }
  }
  checkCollisions() {
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].removed || entities[i].type == "bullet") {
        continue;
      }
      if (collided(this, entities[i])) {
        this.removed = true;
        entities[i].onHit();
        reloadEntity("vfx", this.x + this.w / 2, this.y, 1);
        if (this.which == 0) {
          entities[i].yVel = -0.08;
        } else {
          entities[i].yVel = 0;
        }
      }
    }
  }
  compute() {
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    if (this.x < 0 || this.x > meta.tilesWidth) {
      this.removed = true;
    }
    this.checkCollisions();
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
      this.actionX[this.action + this.left][this.frame] * meta.tilesize,
      this.actionY[this.action + this.left][this.frame] * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      this.x * meta.tilesize * meta.ratio,
      this.y * meta.tilesize * meta.ratio,
      this.w * meta.tilesize * meta.ratio,
      this.h * meta.tilesize * meta.ratio
    );
  }
}

class Gunner extends Entity {
  constructor(which) {
    super(0, 0);
    this.which = which;
    this.w = 2;
    this.h = 2;
    this.x = meta.tilesWidth / 2;
    this.y = meta.tilesHeight - this.h;
    this.xVel = 0;
    this.yVel = 0;
    this.speed = 0.15;
    this.char = "gunner";

    this.col = {
      L: 0,
      R: 0,
      T: 0,
      B: 0,
    };
    /* ACTIONS:
    0 - IDLE
    1 - IDLE L
    2 - WALK
    3 - WALK L
    4 - ATTACK
    5 - ATTACK L
    6 - LOW ATTACK
    7 - LOW ATTACK L
    */
    this.actionX = [
      [0],
      [4],
      [0, 2, 4],
      [4, 2, 0],
      [0, 2, 4],
      [4, 2, 0],
      [0, 2, 4],
      [4, 2, 0],
    ];
    this.actionY = [
      [16],
      [18],
      [12, 12, 12],
      [14, 14, 14],
      [16, 16, 16],
      [18, 18, 18],
      [20, 20, 20],
      [22, 22, 22],
    ];
    this.left = false;
    this.attacking = false;
    //this.dashing = false;
  }
  attack() {
    let which = this.attacking == "e" ? 0 : 1;
    reloadEntity(
      "bullet",
      this.x + this.w / 2,
      this.y + this.h / 2,
      this.left,
      which
    );
  }
  computeInput() {
    if (this.attacking) {
      this.xVel = 0;
      return;
    } else if (controls.e) {
      this.attacking = "e";
      this.action = 4;
      this.frame = 0;
      this.frameCounter = 0;
      this.attack();
      return;
    } else if (controls.q) {
      this.attacking = "q";
      this.action = 6;
      this.frame = 0;
      this.frameCounter = 0;
      this.attack();
      return;
    }
    if (controls.left && !controls.right) {
      this.left = true;
      this.xVel = -this.speed;
      this.action = 2;
    }
    if (controls.right && !controls.left) {
      this.left = false;
      this.xVel = this.speed;
      this.action = 2;
    }
    if (
      (!controls.right && !controls.left) ||
      (controls.right && controls.left)
    ) {
      this.xVel = 0;
      this.action = 0;
    }
    if (controls.spacebar) {
    }
    if (controls.t) {
      switchChar();
      controls.t = false;
    }
  }
  compute() {
    this.computeInput();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
  }
  onAnimationEnded() {
    switch (this.action) {
      case 4:
      case 6:
        //attacking
        this.attacking = false;
        this.action = 0;
        break;
    }
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
      this.onAnimationEnded();
    }
    c.drawImage(
      this.sheet,
      this.actionX[this.action + this.left][this.frame] * meta.tilesize,
      this.actionY[this.action + this.left][this.frame] * meta.tilesize,
      this.w * meta.tilesize,
      this.h * meta.tilesize,
      this.x * meta.tilesize * meta.ratio,
      this.y * meta.tilesize * meta.ratio,
      this.w * meta.tilesize * meta.ratio,
      this.h * meta.tilesize * meta.ratio
    );
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

class Star {
  constructor() {
    this.r = (Math.random() * 3) | 0;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.width = this.r;
    this.height = this.r;
    this.xVel = Math.random() / 10;
    this.yVel = Math.random() / 10;
  }
  compute() {
    this.x += this.xVel;
    this.y += this.xVel;
    if (this.x > canvas.width) {
      this.x = 0;
    }
    if (this.y > canvas.height) {
      this.y = 0;
    }
  }
  render() {
    c.fillStyle = "#8b93af";
    c.fillRect(
      this.x * meta.ratio,
      this.y * meta.ratio,
      this.width * meta.ratio,
      this.height * meta.ratio
    );
    c.stroke();
    c.fill();
  }
}
