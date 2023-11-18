/*
  CLASS LIST:

  class Meta

  class Mouse

  class Player

  class GameMap
 */

/*
  TODO: 
  -Background - DONE
  -GameMap Tester - DONE
  -Screen Shake - DONE
  -Minimap - DONE
  
  -Tasks?
  --Using the baking kitten code?
*/
//const SHEET = id("sheet");
class Meta {
  constructor() {
    this.fps = 0;
    this.loopType = 0;
    this.baseRatio = 3; // Base pixel ratio multiplier
    this.ratio = 1;
    this.deltaTime = 1;
    this.targetFrames = 60;
    this.tileSize = 16;
    this.baseTilesWidth = 18;
    this.baseTilesHeight = 14;
    this.tilesWidth = this.baseTilesWidth;
    this.tilesHeight = this.baseTilesHeight;
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

class GameMap {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.follow = {
      x: 0,
      y: 0
    }
    this.currentLevel = 0;
    this.levels = [];
    this.spawnPoint = {
      x: 0,
      y: 0
    }
    // Preprocessed current level map
    this.map = [];
    this.lockedAngles = true;
    this.tiles = [];
    this.entities = [];
    this.vfxs = [];
    this.levelImage = false;
    this.currentLevel = 0;
    this.cameraFocus = false;
    this.levelImage = 0;

    this.levelX = 0;
    this.levelY = 0;
    this.levelWidth = 0;
    this.levelHeight = 0;
  }
  computeCamera() {
    /*
    if (this.cameraFocus) {
        this.x = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2);
        this.y = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2);
    }
    //*/

    // Compute the ratio

    let ratioSub = ((Math.abs(this.cameraFocus.xVel) + Math.abs(this.cameraFocus.yVel)) * meta.baseRatio * 3) > meta.baseRatio ?
      meta.baseRatio : (Math.abs(this.cameraFocus.xVel) + Math.abs(this.cameraFocus.yVel)) * meta.baseRatio * 3;
    // meta.ratio = meta.baseRatio - ratioSub;
    //    meta.ratio += (-meta.baseRatio + ratioSub + this.x) / 12 * meta.deltaTime;
    meta.ratio += ((meta.baseRatio - ratioSub) - meta.ratio) / 24 * meta.deltaTime;
    if (meta.ratio < meta.baseRatio / 2) {
      meta.ratio = meta.baseRatio / 2;
    }
    meta.tilesWidth = meta.baseTilesWidth / (meta.ratio / meta.baseRatio);
    meta.tilesHeight = meta.baseTilesHeight / (meta.ratio / meta.baseRatio);

    // Updates meta pos

    if (this.cameraFocus) {
      let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2)
      let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2)
      this.x += (xx - this.x) / 12 * meta.deltaTime;
      this.y += (yy - this.y) / 12 * meta.deltaTime;
    }
    if (this.lockedAngles) {
      if (-this.x + meta.tilesWidth > this.levelWidth) {
        this.x = -(this.levelWidth - meta.tilesWidth);
      }
      if (-this.x < this.levelX) {
        this.x = -this.levelX;
      }
      if (-this.y + meta.tilesHeight > this.levelHeight) {
        this.y = -(this.levelHeight - meta.tilesHeight);
      }
      if (-this.y < this.levelY) {
        this.y = -this.levelY;
      }
    }
  }
  checkCollisions(obj, returnColliders, simpleCol) {
    let t = this.tiles;
    let col = "none";
    obj.grounded = false;
    obj.col.L = 0;
    obj.col.R = 0;
    obj.col.T = 0;
    obj.col.B = 0;
    let collidersChunk = [];
    for (let i = 0; i < t.length; i++) {
      if (isOutOfScreen(t[i]) || t[i].notSolid) {
        continue;
      }
      if (obj === t[i]) {
        continue;
      }
      if (collided(obj, t[i])) {
        //adds item to colliders array
        if (simpleCol) {
          col = colCheck(obj, t[i]);
          switch (col) {
            case "b":
              if (obj.yVel >= 0) {
                obj.grounded = true;
                obj.yVel = 0;
              }
              break;
          }

        } else {
          collidersChunk.push(t[i]);
        }
      }
    }
    let e = this.entities;
    for (let i = 0; i < e.length; i++) {
      if (e[i].removed || !e[i].solid) {
        continue;
      }
      if (obj === e[i]) {
        continue;
      }
      if (collided(obj, e[i])) {
        //adds item to colliders array
        if (simpleCol) {
          col = colCheck(obj, e[i]);
          /*
          switch (col) {
            case "b":
              if (obj.yVel >= 0) {
                obj.grounded = true;
                obj.yVel = 0;
              }
              break;
          }
          //*/

        } else {
          collidersChunk.push(e[i]);
        }
      }
    }


    if (collidersChunk.length > 1) {
      collidersChunk = assembleChunk(collidersChunk, obj);
    }
    for (let i = 0; i < collidersChunk.length; i++) {
      col = colCheck(obj, collidersChunk[i]);
      /*
      switch (col) {
        case "b":
          if (obj.yVel >= 0) {
            obj.grounded = true;
            obj.yVel = 0;
          }
          break;
      }
      //*/

      //*
      c.lineWidth = 3;
      c.strokeStyle = "red";
      c.beginPath();
      c.rect(
        (collidersChunk[i].x + map.x) * meta.tileSize * meta.ratio | 0,
        (collidersChunk[i].y + map.y) * meta.tileSize * meta.ratio | 0,
        collidersChunk[i].w * meta.tileSize * meta.ratio | 0,
        collidersChunk[i].h * meta.tileSize * meta.ratio | 0
      );
      c.closePath()
      c.stroke();
      c.lineWidth = 1;
      //*/
    }


    if (obj.col.R - obj.col.L !== 0) {
      if (obj.col.R - obj.col.L > 0) {
        obj.x += 0.012;
      } else {
        obj.x -= 0.012;
      }
      obj.x -= obj.col.R - obj.col.L;
    }
    if (obj.col.B - obj.col.T !== 0) {
      obj.y -= obj.col.B - obj.col.T - 0.01;
    }
    if (returnColliders) {
      return collidersChunk;
    }
  }
  renderTiles() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].removed || isOutOfScreen(this.tiles[i])) {
        continue;
      }
      renderEntity(this.tiles[i])
    }
    //render the level image
    if (this.levelImage) {
      c.drawImage(
        this.levelImage,
        (-this.x * meta.tileSize) | 0,
        (-this.y * meta.tileSize) | 0,
        (meta.tilesWidth * meta.tileSize),
        (meta.tilesHeight * meta.tileSize),
        0,
        0,
        (meta.tilesWidth * meta.tileSize * meta.ratio),
        (meta.tilesHeight * meta.tileSize * meta.ratio)
      )
    }
  }
  computeEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].removed) {
        continue;
      }
      this.entities[i].compute();
    }
  }
  renderEntities() {
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].removed || isOutOfScreen(this.entities[i])) {
        continue;
      }
      this.entities[i].render()
    }
  }
  computeVfxs() {
    for (let i = 0; i < this.vfxs.length; i++) {
      if (this.vfxs[i].removed) {
        continue;
      }
      this.vfxs[i].compute();
    }
  }
  renderVfxs() {
    for (let i = 0; i < this.vfxs.length; i++) {
      if (this.vfxs[i].removed || isOutOfScreen(this.vfxs[i])) {
        continue;
      }
      this.vfxs[i].render();
    }
  }
}
// Particle mini-class
class TaskArea {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tempCollider = {
      x: 0,
      y: 0
    }
  }
  compute() {
    // Update player's collider (center point)
    this.tempCollider.x = player.x + player.w / 2;
    this.tempCollider.y = player.y + player.h / 2;
    if (pointSquareCol(this.tempCollider, this)) {
      this.color = "lightgreen";
    } else {
      this.color = "darkgreen";
    }
  }
  render() {
    /*
    c.strokeStyle = this.color;
    c.beginPath();
    c.rect(
      (this.x + map.x) * meta.tileSize * meta.ratio | 0,
      (this.y + map.y) * meta.tileSize * meta.ratio | 0,
      this.w * meta.tileSize * meta.ratio | 0,
      this.h * meta.tileSize * meta.ratio | 0
    );
    c.closePath()
    c.stroke();
    */
    c.globalAlpha = 0.3;
    c.fillStyle = this.color;
    c.fillRect(
      (this.x + map.x) * meta.tileSize * meta.ratio | 0,
      (this.y + map.y) * meta.tileSize * meta.ratio | 0,
      this.w * meta.tileSize * meta.ratio | 0,
      this.h * meta.tileSize * meta.ratio | 0
    );
    c.globalAlpha = 1;
  }
}
class Particle {
  constructor() {
    this.init();
  }
  init() {
    this.x = 0;
    this.y = 0;
    this.xVel = 0;
    this.yVel = 0;
    this.size = 1;
    this.opacity = 1;
    this.removed = false;
  }
}
// drainpipe1, drainpipe2
class Drainpipe {
  constructor(rot, distance, source) {
    this.source = source;
    this.particles = [];
    this.active = false;
    this.x = source.x;
    this.y = source.y;
    this.originRot = rot;
    this.originDist = distance;
    this.spawnCD = 1;
    this.spawnCounter = 0;
    this.sizeGrowth = 0.15;
    this.opacityDecrease = 0.01;
    this.speedMulti = 20;
    this.randomRange = 2;


  }
  // Returns a removed particle, or false if there aren't
  recycleParticle() {
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].removed) {
        // Returns the address to this removed particle
        this.particles[i].init();
        return this.particles[i];
      }
    }
    // If it didnt return anything, create a new Particle and return it
    this.particles.push(new Particle());
    return this.particles[this.particles.length - 1];
  }
  compute() {
    let tempSquare = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      col: {
        L: 0,
        R: 0,
        T: 0,
        B: 0
      }
    }
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].removed) {
        continue;
      }
      for (let j = 0; j < map.tiles.length; j++) {
        tempSquare.x = this.particles[i].x - this.particles[i].size / meta.tileSize / 2;
        tempSquare.y = this.particles[i].y - this.particles[i].size / meta.tileSize / 2;
        tempSquare.w = this.particles[i].size / meta.tileSize;
        tempSquare.h = this.particles[i].size / meta.tileSize;
        if (collided(tempSquare, map.tiles[j])) {
          map.checkCollisions(tempSquare, false, true)
          //this.particles[i].xVel = 0;
          //this.particles[i].yVel = 0;
          if (tempSquare.col.T || tempSquare.col.B) {
            this.particles[i].xVel > 0 ? this.particles[i].xVel += this.particles[i].yVel * 0.3 :
              this.particles[i].xVel -= this.particles[i].yVel * 0.3;
            this.particles[i].yVel *= -0.02;
            this.particles[i].y += tempSquare.col.T - tempSquare.col.B;
          }
          if (tempSquare.col.L || tempSquare.col.R) {

            this.particles[i].yVel > 0 ? this.particles[i].yVel += this.particles[i].xVel * 0.3 :
              this.particles[i].yVel -= this.particles[i].xVel * 0.3;
            this.particles[i].xVel *= -0.02;
            this.particles[i].x += tempSquare.col.L - tempSquare.col.R;
          }
          tempSquare.col.L = 0;
          tempSquare.col.R = 0;
          tempSquare.col.T = 0;
          tempSquare.col.B = 0;

        }
      }
      this.particles[i].x += this.particles[i].xVel * meta.deltaTime;
      this.particles[i].y += this.particles[i].yVel * meta.deltaTime;
      this.particles[i].size += this.sizeGrowth * meta.deltaTime;
      this.particles[i].opacity -= this.opacityDecrease * meta.deltaTime;
      if (this.particles[i].opacity <= 0) {
        this.particles[i].removed = true;
      }
    }
    if (!this.active) {
      return;
    }
    this.spawnCounter += meta.deltaTime;
    if (this.spawnCounter >= this.spawnCD) {
      this.spawnCounter = 0;
      // Adjusts the position
      this.x = this.source.x + this.source.w / 2 + (this.originDist * Math.cos(this.originRot + this.source.rot));
      this.y = this.source.y + this.source.h / 2 + (this.originDist * Math.sin(this.originRot + this.source.rot));

      // Creates a new particle
      let particle = this.recycleParticle();
      particle.x = this.x;
      particle.y = this.y;

      let randomMargin = (Math.random() * this.randomRange - this.randomRange / 2) / Math.PI;
      particle.xVel = -Math.cos(this.source.rot + randomMargin) * this.source.speed * this.speedMulti;
      particle.yVel = -Math.sin(this.source.rot + randomMargin) * this.source.speed * this.speedMulti;

    }
  }
  render() {
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].removed) {
        continue;
      }
      if (this.particles[i].opacity < 0.66) {
        c.fillStyle = "#dfe0e8";
      } else if (this.particles[i].opacity < 0.33) {
        c.fillStyle = "#a3a7c2";
      } else {
        c.fillStyle = "#f5ffe8";
      }
      c.globalAlpha = this.particles[i].opacity;
      c.fillRect(
        ((this.particles[i].x + map.x) * meta.tileSize - this.particles[i].size / 2) * meta.ratio,
        ((this.particles[i].y + map.y) * meta.tileSize - this.particles[i].size / 2) * meta.ratio,
        this.particles[i].size * meta.ratio,
        this.particles[i].size * meta.ratio,
      )
      c.globalAlpha = 1;
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

  }
}
class Block extends Entity {
  constructor(x, y, w, h) {
    super(x, y);
    this.w = w;
    this.h = h;
  }
  compute() {

  }
  render() {
    //*V1
    c.fillStyle = "f5ffe8";
    c.fillRect(
      (this.x + map.x) * meta.ratio * meta.tileSize,
      (this.y + map.y) * meta.ratio * meta.tileSize,
      this.w * meta.ratio * meta.tileSize,
      this.h * meta.ratio * meta.tileSize
    );
    c.strokeStyle = "#14182e";
    c.beginPath();
    c.rect(
      (this.x + map.x) * meta.ratio * meta.tileSize,
      (this.y + map.y) * meta.ratio * meta.tileSize,
      this.w * meta.ratio * meta.tileSize,
      this.h * meta.ratio * meta.tileSize
    );
    c.closePath();
    c.stroke();
    //*/
    /*V2
    c.save();
    c.translate((player.x + player.w / 2 + map.x) * meta.tileSize * meta.ratio, (player.y + player.h / 2 + map.y) * meta.tileSize * meta.ratio)
    c.rotate(-player.rot - Math.PI / 2)
    c.beginPath();
    c.rect(
      (this.x - player.x - player.w / 2) * meta.ratio * meta.tileSize,
      (this.y - player.y - player.h / 2) * meta.ratio * meta.tileSize,
      this.w * meta.ratio * meta.tileSize,
      this.h * meta.ratio * meta.tileSize
    );
    c.stroke();
    c.closePath();
    c.restore();
    //*/
  }
}

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.initialX = x;
    this.initialY = y;
    this.x = this.initialX;
    this.y = this.initialY;
    this.w = 2;
    this.h = 2;

    //this.gForce = 0.003;
    this.speed = 0.002;
    this.rotSpeed = 0.002;
    this.initialRot = -Math.PI / 2;
    this.rot = this.initialRot;
    this.xVel = 0;
    this.yVel = 0;
    this.rotVel = 0;
    this.slowness = 4;

    this.friction = 0.997;

    this.particlesInterval = 2;
    this.particlesCD = this.particlesInterval;

    this.actionX = [
      [0],
      [0, 0, 0, 0]
    ];
    this.actionY = [
      [0],
      [2, 4, 6, 8]
    ];

    this.damaged = 0;
    this.damagedCounter = 0;

    // Drainpipes
    let angle1 = Math.atan2(
      (22 / meta.tileSize - this.h / 2),
      (6 / meta.tileSize - this.w / 2)
    );
    let angle2 = Math.atan2(
      (22 / meta.tileSize - this.h / 2),
      (25 / meta.tileSize - this.w / 2)
    );
    let distance1 = getDistance(
      0,
      0,
      6 / meta.tileSize - this.w / 2,
      22 / meta.tileSize - this.h / 2
    );
    let distance2 = getDistance(
      0,
      0,
      25 / meta.tileSize - this.w / 2,
      22 / meta.tileSize - this.h / 2
    );

    console.log(distance1)
    this.drainpipe1 = new Drainpipe(angle1 + Math.PI / 2, distance1, this);
    this.drainpipe2 = new Drainpipe(angle2 + Math.PI / 2, distance2, this);

    this.headX = [0, 2];
    this.headY = [10, 10];
    this.headW = 2;
    this.headH = 1;
    this.hitbox = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
    this.ui = new UI(0, 0, this);
  }
  compute() {
    // Computes drainpipes
    this.drainpipe1.compute();
    this.drainpipe2.compute();

    //this.yVel += this.gForce * meta.deltaTime;
    this.checkControls();
    this.checkCollisions();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;

    //
    this.xVel *= Math.pow(this.friction, meta.deltaTime);
    this.yVel *= Math.pow(this.friction, meta.deltaTime);
    this.rotVel *= Math.pow(this.friction, meta.deltaTime);

    // Update damaged status
    if (this.damagedCounter > 0) {
      this.damaged = 1;
      this.damagedCounter -= meta.deltaTime;
    } else {
      this.damaged = 0;
    }

  }
  checkControls() {
    if (controls.left && !controls.right) {
      this.rotVel -= this.rotSpeed * meta.deltaTime;
    }
    if (controls.right && !controls.left) {
      this.rotVel += this.rotSpeed * meta.deltaTime;
    }
    this.rot += this.rotVel * meta.deltaTime;
    if (controls.up) {
      this.action = 1;
      let horSpeed = Math.cos(this.rot) * this.speed * meta.deltaTime
      let verSpeed = Math.sin(this.rot) * this.speed * meta.deltaTime
      /**
      if ((horSpeed > 0 && this.xVel < 0) || (horSpeed < 0 && this.xVel > 0)) {
        horSpeed *= 1.5;
      }
      if ((verSpeed > 0 && this.yVel < 0) || (verSpeed < 0 && this.yVel > 0)) {
        verSpeed *= 1.5;
      }
       */
      this.xVel += horSpeed;
      this.yVel += verSpeed;
      // Activate drainpipes
      this.drainpipe1.active = true;
      this.drainpipe2.active = true;
    } else {
      this.action = 0;
      // Deactivate drainpipes
      this.drainpipe1.active = false;
      this.drainpipe2.active = false;
    }
  }
  checkCollisions() {
    this.updateHitbox();
    /*
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].notSolid) {
        continue;
      }
      if (collided(this, entities[i])) {
        //colCheck(this, entities[i]);
        this.rot = this.initialRot;
        this.x = this.initialX;
        this.y = this.initialY;
        this.xVel = 0;
        this.yVel = 0;
        this.rotVel = 0;
      }
    }
    */
    if (map.checkCollisions(this, false)) {
      //colCheck(this, entities[i]);
      this.rot = this.initialRot;
      this.x = this.initialX;
      this.y = this.initialY;
      this.xVel = 0;
      this.yVel = 0;
      this.rotVel = 0;
    }
    this.computeCollisions();
  }
  updateHitbox() {
    this.hitbox.x = this.x + 0.4;
    this.hitbox.w = this.w - 0.8;
    this.hitbox.y = this.y + 0.1;
    this.hitbox.h = this.h - 0.4;

  }
  computeCollisions() {
    if (this.col.T || this.col.B) {
      // Collision Fxs
      this.damagedCounter = 15;
      screenShake.duration += (Math.abs(this.xVel) + Math.abs(this.yVel)) * 30;

      this.yVel *= -0.9;
      //this.yVel *= -0.5;
      this.y += this.col.T - this.col.B;
    }
    if (this.col.L || this.col.R) {
      // Collision Fxs
      this.damagedCounter = 15;
      screenShake.duration += (Math.abs(this.xVel) + Math.abs(this.yVel)) * 30;

      this.xVel *= -0.9;
      //this.xVel *= -0.5;
      this.x += this.col.L - this.col.R;
    }
    this.col.L = 0;
    this.col.R = 0;
    this.col.T = 0;
    this.col.B = 0;
  }
  render() {
    // Renders drainpipes
    this.drainpipe1.render();
    this.drainpipe2.render();

    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
    }

    //*V1
    c.save();
    c.translate((this.x + this.w / 2 + map.x) * meta.ratio * meta.tileSize,
      (this.y + this.h / 2 + map.y) * meta.ratio * meta.tileSize);
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
    c.drawImage(
      this.sheet,
      this.headX[this.damaged] * meta.tileSize,
      this.headY[this.damaged] * meta.tileSize,
      this.headW * meta.tileSize,
      this.headH * meta.tileSize,
      -this.w / 2 * meta.ratio * meta.tileSize,
      -this.h / 2 * meta.ratio * meta.tileSize,
      this.headW * meta.ratio * meta.tileSize,
      this.headH * meta.ratio * meta.tileSize
    )
    c.restore();
    //*/

    /* V2
      c.drawImage(
        this.sheet,
        this.actionX[this.action][this.frame] * meta.tileSize,
        this.actionY[this.action][this.frame] * meta.tileSize,
        this.w * meta.tileSize,
        this.h * meta.tileSize,
        (this.x + map.x) * meta.ratio * meta.tileSize,
        (this.y + map.y) * meta.ratio * meta.tileSize,
        this.w * meta.ratio * meta.tileSize,
        this.h * meta.ratio * meta.tileSize
      )
    //*/
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
// Moving stars Constructor
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.speed = Math.random() * 0.1 + 0.05;
    this.xVel = this.speed;
    this.yVel = this.speed;
  }
  checkBounds() {
    if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.x + this.w > canvas.width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = canvas.height;
    } else if (this.y + this.h > canvas.height) {
      this.y = 0;
    }
  }
  compute() {
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    this.checkBounds();
  }
  render() {
    c.fillStyle = "#f5ffe8";
    c.fillRect(
      this.x,
      this.y,
      this.w * meta.baseRatio,
      this.h * meta.baseRatio)
  }
}

class SpaceBackground {
  constructor() {
    this.starsAmount = 100;
    this.stars = [];
    this.initialize();
  }
  initialize() {
    for (let i = 0; i < this.starsAmount; i++) {
      this.stars.push(new Star(Math.random() * canvas.width / meta.ratio, Math.random() * canvas.height / meta.ratio))
    }
  }
  compute() {
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].compute();
    }
  }
  render() {
    //renders the #1b1f21 bg
    c.fillStyle = "#1b1f21"
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].render();
    }
  }
}