/*
  CLASS LIST:

  class Meta

  class MapObject

  class Entity

  class Portal

  class Block

  class Enemy

  class Slime

  class Player

  class Sword

  class Mouse


  TODO:
  -Create a file with all the info about items
  -Create a file with level templates
 */
const SHEET = id("sheet");
class Meta {
  constructor() {
    this.fps = 0; // Current frames per second
    this.loopType = 0; // Current game loop (eg: Game, Menu, Transition)
    this.baseRatio = 2;
    this.ratio = this.baseRatio; // Width and height of each pixel
    this.deltaTime = 1; // The ratio at which the game is getting computed (changes every frame)
    this.targetFrames = 60; // The game speed/expected frames per second
    this.tileSize = 16; // Size of each single cell
    this.baseTilesWidth = 25;
    this.baseTilesHeight = 19;
    this.tilesWidth = this.baseTilesWidth; // Number of tiles displayed on screen (width)
    this.tilesHeight = this.baseTilesHeight; // Number of tiles displayed on screen (height)

    this.font = "Consolas, monaco, monospace";
    // Delta Time Computing
    this.perfectFrameTime = 1000 / this.targetFrames;
    this.lastTimestamp = Date.now();
    this.timestamp = Date.now();
    //this.bulletTime = false;
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
class MapObject {
  constructor() {
    this.w = 11;
    this.h = 11;
    this.rooms = 6;

    this.levelW = 23;
    this.levelH = 17;
    this.levelX = (meta.tilesWidth - this.levelW) / 2;
    this.levelY = (meta.tilesHeight - this.levelH) / 2;

    this.x = 0;
    this.y = 0;
    this.map = [];
    this.entities = [];

    this.start = [0, 0];

    this.currentFloor = 1;
    this.currentLevel = [0, 0];

    this.mapGen = new MapGenerator();
    this.levelGen = new LevelGenerator();
    this.cameraFocus = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };
    this.lockedAngles = true;
    this.zoom = false;
    this.initialize();
  }
  computeCamera() {
    /*
    if (this.cameraFocus) {
        this.x = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2);
        this.y = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2);
    }
    //*/
    // Compute the ratio
    if (this.zoom) {
      if (meta.ratio < meta.baseRatio * 2) {
        meta.ratio += (0.005 + (meta.baseRatio * 2 - meta.ratio) / 22) * meta.deltaTime;
      }

      if (meta.ratio > meta.baseRatio * 2) {
        meta.ratio = meta.baseRatio * 2;
      }

      meta.tilesWidth = meta.baseTilesWidth * (meta.baseRatio / meta.ratio);
      meta.tilesHeight = meta.baseTilesHeight * (meta.baseRatio / meta.ratio);
      //this.levelX = (meta.tilesWidth - this.levelW) / 2;
      //this.levelY = (meta.tilesHeight - this.levelH) / 2;

    } else {
      if (meta.ratio != meta.baseRatio) {
        meta.ratio = meta.baseRatio;
        meta.tilesWidth = meta.baseTilesWidth;
        meta.tilesHeight = meta.baseTilesHeight;
        //this.levelX = (meta.tilesWidth - this.levelW) / 2;
        //this.levelY = (meta.tilesHeight - this.levelH) / 2;
      }
    }
    // Updates meta pos

    if (this.cameraFocus) {
      let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - (meta.tilesWidth) / 2)
      let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - (meta.tilesHeight) / 2)
      this.x += (xx - this.x) / 15 * meta.deltaTime;
      this.y += (yy - this.y) / 15 * meta.deltaTime;
    }
    if (this.lockedAngles) {
      // left boundary

      if (-this.x < -this.levelX) {
        this.x = this.levelX;
      }
      // top boundary
      // +0.5 to counterweight the top UI 
      if (-this.y < -this.levelY + 0.5) {
        this.y = this.levelY + 0.5;
      }

      // Right boundary
      if (-this.x > this.levelX + this.levelW - meta.tilesWidth) {
        this.x = -(this.levelX + this.levelW - meta.tilesWidth);
      }
      // Down boundary
      if (-this.y > this.levelY + this.levelH - meta.tilesHeight) {
        this.y = -(this.levelY + this.levelH - meta.tilesHeight);
      }
    }
  }
  // Generate the map
  initialize() {
    this.map = this.mapGen.generate(this.w, this.h, this.rooms);
    // Iterate the rooms inside the map
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        if (!this.map[i][j]) {
          continue;
        }
        // Initializes the portals array
        this.map[i][j].portals = [];
        // Parses the bidimensional array into level entities
        this.map[i][j].entities = this.parseRoom(
          this.levelGen.generate(this.levelW, this.levelH, this.map[i][j].links, this.map[i][j].type)
        );
        // Creates a list of portals for the level
        for (let k = 0; k < this.map[i][j].entities.length; k++) {
          if (this.map[i][j].entities[k].type == "portal") {
            this.map[i][j].portals.push(this.map[i][j].entities[k]);
          }
        }

        if (this.map[i][j].type === 1) {
          this.currentLevel = [i, j];
          this.map[this.currentLevel[0]][this.currentLevel[1]].revealed = true;
          this.entities = this.map[this.currentLevel[0]][this.currentLevel[1]].entities;
          // Inserts the player
          this.entities.push(player);
        }
      }
    }
  }
  // Translates the level to game entities
  parseRoom(room) {
    let entities = [];
    let entity;
    for (let x = 0; x < room.length; x++) {
      for (let y = 0; y < room[x].length; y++) {
        switch (room[x][y].type) {
          case 0:
            break;
          case 1:
            entity = new Block(x, y);
            entity.tile = room[x][y].tile;
            entities.push(entity);
            break;
          case 2:
            entity = new Portal(x, y, room[x][y].dir, room[x][y].id);
            entities.push(entity);
            break;
          case 3:
            entity = new Block(x, y);
            entity.tile = room[x][y].tile;
            entities.push(entity);
            break;
          case 10:
            entity = new Slime(x, y);
            entities.push(entity);
            break;
        }
      }
    }
    // Merges toghether the entities with the same ID, like Portals
    return this.mergeSameIdEntities(entities);
  }
  mergeSameIdEntities(entities) {
    let mergedEntities = [];
    for (let i = 0; i < entities.length; i++) {
      if (!(entities[i].id >= 0)) {
        continue;
      }
      mergedEntities.push(entities.splice(i, 1)[0])
      i--;
    }
    for (let i = 0; i < mergedEntities.length; i++) {
      for (let j = 0; j < mergedEntities.length; j++) {
        if (i == j) {
          continue;
        }
        if (mergedEntities[i].id == mergedEntities[j].id) {
          // removes the same entity, but adds the size to the original
          if (mergedEntities[j].x < mergedEntities[i].x) {
            mergedEntities[i].x = mergedEntities[j].x;
            mergedEntities[i].w += mergedEntities[j].w;
          }
          if (mergedEntities[j].y < mergedEntities[i].y) {
            mergedEntities[i].y = mergedEntities[j].y;
            mergedEntities[i].h += mergedEntities[j].h;
          }
          if (mergedEntities[j].x > mergedEntities[i].x) {
            mergedEntities[i].w += mergedEntities[j].w;
          }
          if (mergedEntities[j].y > mergedEntities[i].y) {
            mergedEntities[i].h += mergedEntities[j].h;
          }
          mergedEntities.splice(j, 1);
          j--;
        }
      }
    }
    return entities.concat(mergedEntities);
  }
  render() {
    for (let i = 0; i < this.levelW; i++) {
      for (let j = 0; j < this.levelH; j++) {
        //renders the floor
        c.drawImage(
          SHEET,
          1 * meta.tileSize,
          1 * meta.tileSize,
          meta.tileSize,
          meta.tileSize,
          ((i + this.x) * meta.tileSize * meta.ratio) | 0,
          ((j + this.y) * meta.tileSize * meta.ratio) | 0,
          meta.tileSize * meta.ratio,
          meta.tileSize * meta.ratio
        );
      }
    }
  }
  /**
   * @param dir Direction of the map movement, expressed in [ changeX, changeY ]
   */
  changeLevel(dir) {
    //clears the vfxs
    vfxsManager.removeAll();
    // Remove the player from previous level
    this.entities.splice(this.entities.indexOf(player), 1)



    // changes the current level
    this.currentLevel = [
      this.currentLevel[0] + dir[0],
      this.currentLevel[1] + dir[1],
    ];

    for (let portal of this.map[this.currentLevel[0]][this.currentLevel[1]].portals) {
      /* If the portal matches the opposite of the entered portal, 
      teleport the player here. 
      Example: if portal taken goes to "left" (-1, 0)
      then take the one that goes to "right" (1 , 0)
      */
      if (portal.dir[0] == dir[0] * -1 && portal.dir[1] == dir[1] * -1) {
        console.log(portal.dir)
        // Move the player to the target portal but out of it to avoid teleporting back
        player.x = -player.w / 2 + portal.x + portal.w / 2 - (player.w * portal.dir[0]);
        player.y = -player.h / 2 + portal.y + portal.h / 2 - (player.h * portal.dir[1]);
      }
    }
    // Replaces the entities with the changed level entities
    this.entities = this.map[this.currentLevel[0]][this.currentLevel[1]].entities;

    // Pushes the removed player into the next room
    this.entities.push(player);

    // Reveals the level, since the player just entered it
    this.map[this.currentLevel[0]][this.currentLevel[1]].revealed = true;
  }
  renderMinimap() {
    let size = 15;
    let room;
    c.save();
    c.translate(canvas.width - this.w * size, canvas.height - this.h * size);
    c.globalAlpha = 0.2;
    c.fillStyle = "#a3a7c2";
    c.fillRect(0, 0, this.w * size, this.h * size);
    c.globalAlpha = 1;
    for (let i = 0; i < this.w; i++) {
      for (let j = 0; j < this.h; j++) {
        room = this.map[i][j];
        if (room == 0) {
          continue;
        }
        if (!room.revealed) {
          continue;
        }
        // Draws rooms
        switch (this.map[i][j].type) {
          case 0:
            c.fillStyle = "#14182e";
            break;
          case 1:
            c.fillStyle = "#686f99";
            break;
          case 2:
            c.fillStyle = "#f0b541";
            break;
          case 3:
            c.fillStyle = "#ad2f45";
            break;
        }
        c.fillRect(
          i * size + size / 10,
          j * size + size / 10,
          size - size / 5,
          size - size / 5
        );
        // Draws links
        for (let link of room.links) {
          c.fillStyle = "#f5ffe8";
          c.fillRect(
            (i + link[0] / 2) * size + size / 2 - size / 10,
            (j + link[1] / 2) * size + size / 2 - size / 10,
            size / 5,
            size / 5
          );
        }

        if (this.currentLevel[0] === i && this.currentLevel[1] === j) {
          c.globalAlpha = 0.8;
          c.fillStyle = "#ffee83";
          c.fillRect(
            i * size + size / 3,
            j * size + size / 3,
            size - size / 1.5,
            size - size / 1.5
          );
        }
      }
    }
    c.globalAlpha = 1;
    c.restore();
  }
  checkCollisions(obj, returnColliders, simpleCol) {
    let col = "none";
    obj.col.L = 0;
    obj.col.R = 0;
    obj.col.T = 0;
    obj.col.B = 0;
    let collidersChunk = [];
    for (let entity of this.entities) {
      //isOutOfScreen(entity) || entity.notSolid
      if (entity.notSolid) {
        continue;
      }
      if (entity.removed) {
        continue;
      }
      if (obj === entity) {
        continue;
      }
      if (collided(obj, entity)) {
        //adds item to colliders array
        if (simpleCol) {
          col = colCheck(obj, entity);
        } else {
          collidersChunk.push(entity);
        }
      }
    }

    if (collidersChunk.length > 1) {
      collidersChunk = assembleChunk(collidersChunk, obj);
    }
    for (let i = 0; i < collidersChunk.length; i++) {
      col = colCheck(obj, collidersChunk[i]);
    }

    if (obj.col.R - obj.col.L !== 0) {
      obj.x -= obj.col.R - obj.col.L;
    }
    if (obj.col.B - obj.col.T !== 0) {
      obj.y -= obj.col.B - obj.col.T;
    }
    if (returnColliders) {
      return collidersChunk;
    }
  }
  sortEntities() {
    this.entities.sort(function (a, b) {
      if(b.type=="bg"){
        return 0;
      }
      return (a.y + a.h) - (b.y + b.h);
    })
  }
}

// Texts
class DmgText {
  constructor(entity, text) {
    let args = ["DmgText", entity, text];
    this.initialize(args);
  }
  initialize(args) {
    //args[0] is the type
    this.type = args[0];
    let entity = args[1];
    let text = args[2];
    this.x = entity.x + entity.w / 2 + Math.random() * 0.5 - 0.25;
    this.y = entity.y + entity.h / 3 + Math.random() * 0.5 - 0.25;
    this.text = text;
    this.size = 14;
    this.color = "#f5ffe8";
    if (entity.type == "player") {
      this.color = "#ad2f45";
    }
    this.color2 = "#14182e";
    this.removed = false;
    this.solid = false;
    this.yVel = -0.015;
    this.sizeChange = 0.99;
    this.lifeSpan = 40; //duration (in frames) of the text appearence
  }
  compute() {
    this.size *= Math.pow(this.sizeChange, meta.deltaTime);
    this.y += this.yVel * meta.deltaTime;
    this.lifeSpan -= meta.deltaTime;
    if (this.lifeSpan <= 0) {
      this.removed = true;
    }
  }
  render() {
    //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineWidth = this.size / 10;
    c.font = "bold " + Math.round(this.size * meta.ratio) + "px" + meta.font;
    c.fillStyle = this.color;
    c.fillText(
      this.text,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio
    );
    c.strokeStyle = this.color2;
    c.strokeText(
      this.text,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio
    );
  }
}

class StatusText {
  constructor(entity, text) {
    let args = ["StatusText", entity, text];
    this.initialize(args);
  }
  initialize(args) {
    //args[0] is the type
    this.type = args[0];
    let entity = args[1];
    let text = args[2];
    this.x = entity.x + entity.w / 2 + Math.random();
    this.y = entity.y + entity.h / 6;
    this.text = text;
    this.size = 12;
    this.color = "#63ab3f";
    this.color2 = "#14182e";
    this.removed = false;
    this.solid = false;
    this.yVel = -0.015;
    this.sizeChange = 0.99;
    this.lifeSpan = 60; //duration (in frames) of the text appearence
  }
  compute() {
    this.size *= Math.pow(this.sizeChange, meta.deltaTime);
    this.y += this.yVel * meta.deltaTime;
    this.lifeSpan -= meta.deltaTime;
    if (this.lifeSpan <= 0) {
      this.removed = true;
    }
  }
  render() {
    //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineWidth = this.size / 10;
    c.font = "bold " + Math.round(this.size * meta.ratio) + "px " + meta.font;
    c.fillStyle = this.color;
    c.fillText(
      this.text,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio
    );
    c.strokeStyle = this.color2;
    c.strokeText(
      this.text,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio
    );
  }
}

// Sparkling
class SparklingVfx {
  constructor(entity, which) {
    let args = ["SparklingVfx", entity, which];
    this.initialize(args);
  }
  initialize(args) {
    //args[0] is the type
    let entity = args[1];
    let which = args[2];
    this.x = entity.x + entity.w / 2 + Math.random() * 1.5 - 0.75;
    this.y = entity.y + entity.h / 2 + Math.random() * 1.5 - 0.75;
    this.type = "SparklingVfx";

    this.removed = false;
    this.solid = false;

    this.action = which;
    this.actionX = [
      [14, 14, 14, 14],
    ];
    this.actionY = [
      [15, 16, 17, 18],
    ];

    this.w = 1;
    this.h = 1;
    this.x -= this.w / 2;
    this.y -= this.h / 2;
    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;

    this.verticalSpeed = -0.03;
  }
  compute() {
    // Goes up
    this.y += this.verticalSpeed * meta.deltaTime;
  }
  onActionEnded() {
    switch (this.action) {
      default:
        this.removed = true;
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
      this.onActionEnded();
      if (this.removed) {
        return;
      }
    }
    c.drawImage(
      SHEET,
      this.actionX[this.action][this.frame] * meta.tileSize,
      this.actionY[this.action][this.frame] * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
  }
}
// Damage Vfxs
class DmgVfx {
  constructor(entity, which) {
    let args = ["DmgVfx", entity, which];
    this.initialize(args);
  }
  initialize(args) {
    //args[0] is the type
    let entity = args[1];
    let which = args[2] || (Math.random() * 2) | 0;
    this.x = entity.x + entity.w / 2 + Math.random() * 0.5 - 0.25;
    this.y = entity.y + entity.h / 2 + Math.random() * 0.5 - 0.25;
    this.type = "DmgVfx";

    this.removed = false;
    this.solid = false;

    this.action = which;
    this.actionX = [
      [17, 17, 17, 17],
      [18, 18, 18, 18],
    ];
    this.actionY = [
      [0, 1, 2, 3],
      [0, 1, 2, 3],
    ];

    this.w = 1;
    this.h = 1;
    this.x -= this.w / 2;
    this.y -= this.h / 2;
    this.frame = 0;
    this.frameCounter = 0;
    this.slowness = 6;
  }
  compute() {}
  onActionEnded() {
    switch (this.action) {
      default:
        this.removed = true;
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
      this.onActionEnded();
      if (this.removed) {
        return;
      }
    }
    c.drawImage(
      SHEET,
      this.actionX[this.action][this.frame] * meta.tileSize,
      this.actionY[this.action][this.frame] * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
  }
}
class VfxsManager {
  constructor() {
    this.vfxs = [];
    this.maxVfxCount = 20;
    this.maxTxtCount = 20;
    this.maxSparkleCount = 20;

    // Sparkling entitities
    this.sparkleHolders = [];
    this.initialize();
  }
  // Creates / Recycles Vfxs
  create() {
    let args = arguments;
    for (let vfx of this.vfxs) {
      if (vfx.removed && vfx.type == args[0]) {
        vfx.initialize(args);
        // Return if the vfx was created
        return;
      }
    }
    // OtherWise craft it
    switch (args[0]) {
      case "DmgVfx":
        this.vfxs.push(new DmgVfx(0, 0));
        break;
      case "DmgText":
        this.vfxs.push(new DmgText(0, 0));
        break;
      case "StatusText":
        this.vfxs.push(new StatusText(0, 0));
        break;
      case "SparklingVfx":
        this.vfxs.push(new SparklingVfx(0, 0));
        break;
      default:
        return new Error("Tried to create a vfx, but couldn't");
    }
    this.vfxs[this.vfxs.length - 1].initialize(args);
  }
  // Creates a sparkling effect around the selected entity
  sparkleEntity(entity, duration, intensity) {
    let sparkleEntity = {
      entity: entity,
      duration: duration,
      intensity: intensity,
      removed: false
    }
    this.sparkleHolders.push(sparkleEntity);
  }
  computeSparkleEntities() {

    for (let sparkleHolder of this.sparkleHolders) {
      if (sparkleHolder.duration <= 0) {
        sparkleHolder.removed = true;
        continue;
      }
      for (let j = 0; j < sparkleHolder.intensity; j++) {
        vfxsManager.create("SparklingVfx", sparkleHolder.entity, 0)
      }
      sparkleHolder.duration -= meta.deltaTime;

    }
    // Removes the finished Vfxs
    for (let i = this.sparkleHolders.length - 1; i >= 0; i--) {
      if (this.sparkleHolders[i].removed) {
        this.sparkleHolders.splice(i, 1);
      }
    }
  }
  removeAll() {
    for (let vfx of this.vfxs) {
      vfx.removed = true;
    }
  }
  initialize() {
    this.vfxs = [];
    let newVfx;
    for (let i = 0; i < this.maxTxtCount; i++) {
      newVfx = new DmgText(0, 0);
      newVfx.removed = true;
      this.vfxs.push(newVfx);
    }
    for (let i = 0; i < this.maxVfxCount; i++) {
      newVfx = new DmgVfx(0, 0);
      newVfx.removed = true;
      this.vfxs.push(newVfx);
    }
    for (let i = 0; i < this.maxSparkleCount; i++) {
      newVfx = new SparklingVfx(0, 0);
      newVfx.removed = true;
      this.vfxs.push(newVfx);
    }
    for (let i = 0; i < this.maxStatTextCount; i++) {
      newVfx = new StatusText(0, 0);
      newVfx.removed = true;
      this.vfxs.push(newVfx);
    }
  }
  compute() {
    for (let vfx of this.vfxs) {
      if (vfx.removed) {
        continue;
      }
      vfx.compute();
    }
    // Computes the sparkling Vfx
    this.computeSparkleEntities();
  }
  render() {
    for (let vfx of this.vfxs) {
      if (vfx.removed) {
        continue;
      }
      vfx.render();
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
    this.shadow = false;
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
  onActionEnded() {
    // What happens after the animation ended
  }
  updateSprite() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.action].length) {
      this.frame = 0;
      this.onActionEnded();
    }
  }
  renderSprite() {
    if (this.removed) {
      // If the entity is removed, don't bother rendering
      return;
    }
    c.drawImage(
      SHEET, // source of the sprite
      this.actionX[this.action + this.left][this.frame] * meta.tileSize, // x pos of the sprite
      this.actionY[this.action + this.left][this.frame] * meta.tileSize, // y pos of the sprite
      this.w * meta.tileSize, // width of the sprite
      this.h * meta.tileSize, // height of the sprite
      (this.x + map.x) * meta.tileSize * meta.ratio, // x of the entity
      (this.y + map.y) * meta.tileSize * meta.ratio, // y of the entity
      this.w * meta.tileSize * meta.ratio, // width of the entity
      this.h * meta.tileSize * meta.ratio // height of the entity
    );
  }

  renderShadow() {
    // Canon Shadow rendering (PROVISIONAL)
    c.fillStyle = "#14182e";
    c.beginPath();
    c.ellipse(
      (this.x + map.x + this.w / 2) * meta.tileSize * meta.ratio,
      (this.y + this.h + map.y) * meta.tileSize * meta.ratio,
      this.w / 2 * meta.tileSize * meta.ratio,
      this.w / 4 * meta.tileSize * meta.ratio,
      0,
      0,
      2 * Math.PI);
    c.fill();
  }
}
class Portal extends Entity {
  // A portal which takes you to another room
  constructor(x, y, dir, id) {
    super(x, y);
    this.dir = dir;
    this.id = id;
    this.notSolid = false;
    this.type = "portal";

    this.spriteW = 3;
    this.spriteH = 1;
    this.hitbox = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    };

    this.action = 0;
    /*
    0 : closed,
    1 : opening,
    2 : open,
    3 : closing
    */
    this.actionX = [
      [15],
      [15, 15, 15, 15, 15, 15, 15, 15, 15],
      [15],
      [15, 15, 15, 15, 15, 15, 15, 15, 15]
    ]
    this.actionY = [
      [19],
      [19, 20, 21, 22, 23, 24, 25, 26, 27],
      [27],
      [27, 26, 25, 24, 23, 22, 21, 20, 19]
    ]

    this.rot = 0;
    if (this.dir[0]) {
      if (this.dir[0] == 1) {
        // portal to the right
        this.rot = 90;
      } else {
        // portal to the left
        this.rot = -90;
      }
    } else {
      if (this.dir[1] == 1) {
        // portal to the bottom
        this.rot = 180;
      } else {
        // portal to the top
        this.rot = 0;
      }
    }
  }
  computeAction() {
    let enemiesAlive = false;
    for (let entity of map.entities) {
      if (entity.removed) {
        continue;
      }
      if (entity.type == "enemy") {
        enemiesAlive = true;
        break;
      }
    }

    if (this.action == 0 && !enemiesAlive) {
      this.action = 1;
    }
    if (this.action == 2 && enemiesAlive) {
      this.action = 3;
    }
  }
  compute() {
    this.hitbox.x = this.x;
    this.hitbox.y = this.y;
    this.hitbox.w = this.w;
    this.hitbox.h = this.h;
    if (this.notSolid && collided(this, player)) {
      // Move player to the linked level
      map.changeLevel(this.dir);
    }
    this.computeAction();
  }
  onActionEnded() {
    switch (this.action) {
      case 1:
        this.action = 2;
        this.notSolid = true;
        break;
      case 3:
        this.action = 0;
        this.notSolid = false;
        break;
    }
  }
  render() {
    this.updateSprite();
    if (this.removed) {
      // If the entity is removed, don't bother rendering
      return;
    }
    c.save();
    c.translate(
      (this.x + this.w / 2 + map.x) * meta.tileSize * meta.ratio,
      (this.y + this.h / 2 + map.y) * meta.tileSize * meta.ratio
    );
    c.rotate((this.rot * Math.PI) / 180);
    c.drawImage(
      SHEET, // source of the sprite
      this.actionX[this.action][this.frame] * meta.tileSize, // x pos of the sprite
      this.actionY[this.action][this.frame] * meta.tileSize, // y pos of the sprite
      this.spriteW * meta.tileSize, // width of the sprite
      this.spriteH * meta.tileSize, // height of the sprite
      (-this.spriteW / 2) * meta.tileSize * meta.ratio, // x of the entity
      (-this.spriteH / 2) * meta.tileSize * meta.ratio, // y of the entity
      this.spriteW * meta.tileSize * meta.ratio, // width of the entity
      this.spriteH * meta.tileSize * meta.ratio // height of the entity
    );
    c.restore();
  }
}

// Collidable
class Block extends Entity {
  // A normal, collidable block
  constructor(x, y) {
    super(x, y);
    this.type = "bg";
    this.immovable = false;
    this.tile = 0;
  }
  compute() {}
  render() {
    // Basic rendering cannon apply (updateSprite(),renderSprite())
    c.drawImage(
      SHEET,
      tiles[this.tile][0] * meta.tileSize,
      tiles[this.tile][1] * meta.tileSize,
      meta.tileSize,
      meta.tileSize,
      ((this.x + map.x) * meta.tileSize * meta.ratio) | 0,
      ((this.y + map.y) * meta.tileSize * meta.ratio) | 0,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
  }
}

// Basic Enemy class
class Enemy extends Entity {
  constructor(x, y) {
    super(x, y);
    this.type = "enemy";
    this.shadow = true;
    this.maxHp = 10;
    this.atk = 1;
    this.hp = this.maxHp;
    this.dmgFrames = 0;
    this.dead = false;
    this.lv = 1;
    this.expValue = 1;
    this.action = 0;
    this.actionX = [
      [16],
      [16]
    ];
    this.actionY = [
      [0],
      [1]
    ];

    this.hpBar = new HpBar(this);
  }
  onHit(source) {
    this.state = DAMAGED;
    this.damaged = source.attackID;
    this.dmgFrames = 5;
    this.hp -= source.atk;
    // atk text
    vfxsManager.create("DmgText", this, source.atk | 0);
    vfxsManager.create("DmgVfx", this);
    if (this.hp <= 0) {
      this.onDeath(source)
      let recipient = source.owner || source;
      recipient.expManager.update(this);
    }
  }
  onDeath() {
    this.dead = true;
    this.removed = true;
  }
  brain() {}
  computeAction() {}
  onActionEnded() {}
  compute() {
    this.brain();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;

    map.checkCollisions(this);
    this.hpBar.compute();
    this.displayName.compute();
  }
  render() {
    this.updateSprite();
    this.renderSprite();
    this.hpBar.render();
    this.displayName.render();
  }
}
canvas.addEventListener("mousedown", function (e) {
  let x = (e.clientX - canvas.offsetLeft) / meta.ratio / meta.tileSize - map.x;
  let y = (e.clientY - canvas.offsetTop) / meta.ratio / meta.tileSize - map.y;

  switch (e.button) {
    case 3:
      map.entities.push(new Bat(x, y));
      break;
    case 4:
      map.entities.push(new Slime(x, y));
      break;
  }
});

// Action states
const IDLE = "IDLE",
  SEEK = "SEEK",
  WINDUP = "WINDUP",
  CHASE = "CHASE",
  DAMAGED = "DAMAGED",
  ATTACK = "ATTACK",
  FLEE = "FLEE";

class Slime extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.state = IDLE;
    this.attackRange = 3;
    this.windupFrames = 60;
    this.left = (Math.random() * 2) | 0;
    this.baseSpeed = 0.03;
    this.speed = this.baseSpeed;
    this.name = "slime";

    //Stats
    this.atk = 5;
    this.expValue = 2;

    this.action = 0;
    this.aggroRange = 10;
    this.targetRot = 0;
    this.dashSpeed = 4;
    this.fleeing = 0;
    /* 
      0 = idle
      2 = moving
      4 = damaged
      6 = windup
      8 = attack
    */
    this.actionX = [
      [0],
      [1],
      [0, 0, 0],
      [1, 1, 1],
      [0],
      [1],
      [0, 0],
      [1, 1],
      [0],
      [1],
    ];
    this.actionY = [
      [15],
      [15],
      [15, 16, 17],
      [15, 16, 17],
      [18],
      [18],
      [16, 19],
      [16, 19],
      [20],
      [20],
    ];

    this.displayName = new DisplayName(this);
  }
  computeState() {
    if (this.xVel > 0) {
      this.left = false;
    } else if (this.xVel < 0) {
      this.left = true;
    }
    let rotation, xTarget, yTarget;
    switch (this.state) {
      case IDLE:
        this.action = 2;
        this.xVel = 0;
        this.yVel = 0;
        if (distance(this, player) < this.aggroRange) {
          this.state = CHASE;
        }
        break;
      case FLEE:
        rotation = getRotation(this, player);
        xTarget = -Math.cos(rotation);
        yTarget = -Math.sin(rotation);

        this.xVel = xTarget * this.speed;
        this.yVel = yTarget * this.speed;
        this.action = 2;
        this.fleeing -= meta.deltaTime;
        if (
          distance(this, player) > this.attackRange * 2 ||
          this.fleeing <= 0
        ) {
          this.fleeing = 0;
          this.state = IDLE;
        }
        break;
      case CHASE:
        rotation = getRotation(this, player);
        xTarget = Math.cos(rotation);
        yTarget = Math.sin(rotation);

        this.xVel = xTarget * this.speed;
        this.yVel = yTarget * this.speed;
        this.action = 2;
        if (distance(this, player) < this.attackRange) {
          this.state = WINDUP;
        }
        break;
      case WINDUP:
        this.action = 6;
        this.xVel = 0;
        this.yVel = 0;
        this.windupFrames -= meta.deltaTime;
        if (this.windupFrames <= 0) {
          this.state = ATTACK;
          this.windupFrames = 30;
          this.attackFrames = 30;
          this.targetRot = getRotation(this, player);
        }
        break;
      case DAMAGED:
        this.action = 4;
        this.xVel = 0;
        this.yVel = 0;
        this.windupFrames = 30;
        if (this.dmgFrames > 0) {
          this.dmgFrames -= meta.deltaTime;
        } else {
          this.state = IDLE;
        }
        break;
      case ATTACK:
        this.action = 8;
        rotation = this.targetRot;
        xTarget = Math.cos(rotation);
        yTarget = Math.sin(rotation);

        this.xVel = xTarget * this.speed * this.dashSpeed;
        this.yVel = yTarget * this.speed * this.dashSpeed;
        if (this.attackFrames > 0) {
          this.attackFrames -= meta.deltaTime;
        } else {
          this.state = IDLE;
          this.speed = this.baseSpeed;
        }
        break;
    }
  }
  brain() {
    this.computeState();
  }
  compute() {
    this.brain();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    if (this.state == ATTACK && collided(this, player)) {
      player.onHit(this);

      this.fleeing = 120;
      this.state = FLEE;
    }
    map.checkCollisions(this);
    this.hpBar.compute();
    this.displayName.compute();
  }
}

class Bat extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.state = IDLE;
    this.attackRange = 3;
    this.windupFrames = 60;
    this.left = (Math.random() * 2) | 0;
    this.baseSpeed = 0.05;
    this.speed = this.baseSpeed;
    this.name = "bat";
    this.atk = 3;
    this.expValue = 3;

    this.action = 0;
    this.aggroRange = 5;
    this.targetRot = 0;
    this.dashSpeed = 4;
    this.fleeing = 0;

    this.movRotation = 0;
    this.rotX = 0;
    this.rotY = 0;
    /* 
      0 = idle
    */
    this.actionX = [
      [2, 2, 2, 2],
      [2, 2, 2, 2],
    ];
    this.actionY = [
      [15, 16, 17, 18],
      [15, 16, 17, 18],
    ];

    this.displayName = new DisplayName(this);
  }
  computeState() {
    let rotation, xTarget, yTarget;
    switch (this.state) {
      case IDLE:
        this.xVel = this.rotX * this.speed;
        this.yVel = this.rotY * this.speed;
        if (distance(this, player) < this.aggroRange) {
          this.state = CHASE;
        }
        break;
      case CHASE:
        rotation = getRotation(this, player);
        xTarget = Math.cos(rotation);
        yTarget = Math.sin(rotation);

        this.xVel = (xTarget + this.rotX) * this.speed;
        this.yVel = (yTarget + this.rotY) * this.speed;
        break;
      case FLEE:
        rotation = getRotation(this, player);
        xTarget = -Math.cos(rotation);
        yTarget = -Math.sin(rotation);

        this.xVel = xTarget * this.speed;
        this.yVel = yTarget * this.speed;
        this.fleeing -= meta.deltaTime;
        if (
          distance(this, player) > this.attackRange * 2 ||
          this.fleeing <= 0
        ) {
          this.fleeing = 0;
          this.state = IDLE;
        }
        break;
      case DAMAGED:
        this.xVel = 0;
        this.yVel = 0;
        if (this.dmgFrames > 0) {
          this.dmgFrames -= meta.deltaTime;
        } else {
          this.state = IDLE;
        }
        break;
    }
  }
  brain() {
    if (this.state !== DAMAGED) {
      this.movRotation += meta.deltaTime / 10;
      this.rotX = Math.cos(this.movRotation);
      this.rotY = Math.sin(this.movRotation);
    }
    // compute state
    this.computeState();
  }
  compute() {
    this.brain();
    this.x += this.xVel * meta.deltaTime;
    this.y += this.yVel * meta.deltaTime;
    if (collided(this, player)) {
      player.onHit(this);

      this.fleeing = 120;
      this.state = FLEE;
    }
    map.checkCollisions(this);
    this.hpBar.compute();
    this.displayName.compute();
  }
}

class DisplayName {
  constructor(source) {

    this.source = source;
    this.w = 1;
    this.h = 1;
    this.prevRatio = 1;
    this.text = "LV." + this.source.lv;
    this.text2 = (this.source.name || this.source.type);
    this.color = "#f5ffe8";
    this.color2 = "#ffae70aa";
    this.size = 5;
    this.size2 = 6;
  }
  compute() {
    this.x = this.source.x + this.source.w / 2;
    this.y = this.source.y - this.h / 2;
    this.y2 = this.source.y - this.h / 4.5;
  }
  render() {
    // Renders the text

    //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineWidth = this.size / 10;
    c.font = "bold " + Math.round(this.size * meta.ratio) + "px" + " Consolas, 'Courier New', monospace";
    c.fillStyle = this.color;
    c.fillText(
      this.text,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio
    );
    c.font = "bold " + Math.round(this.size2 * meta.ratio) + "px" + " Consolas, 'Courier New', monospace";
    c.fillStyle = this.color2;
    c.fillText(
      this.text2,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y2 + map.y) * meta.tileSize * meta.ratio
    );
  }
}
class HpBar {
  constructor(source) {
    this.spriteX = [
      [13, 14, 15]
    ];
    this.spriteY = [
      [0, 0, 0]
    ];
    this.source = source;
    this.w = 1;
    this.h = 1;
    this.wRatio = 1;
    this.prevRatio = 1;
  }
  compute() {
    this.x = this.source.x + this.source.w / 2 - this.w / 2;
    this.y = this.source.y - this.h / 2;
    this.wRatio = this.source.hp / this.source.maxHp;
    if (this.prevRatio > this.wRatio) {
      this.prevRatio -= meta.deltaTime / 50;
    }
    if (this.prevRatio < this.wRatio) {
      this.prevRatio = this.wRatio;
    }
  }
  render() {
    // Renders the damaged bar
    c.drawImage(
      SHEET,
      this.spriteX[0][2] * meta.tileSize,
      this.spriteY[0][2] * meta.tileSize,
      this.w * meta.tileSize * this.prevRatio,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio * this.prevRatio,
      this.h * meta.tileSize * meta.ratio
    );

    // Renders the bar
    c.drawImage(
      SHEET,
      this.spriteX[0][1] * meta.tileSize,
      this.spriteY[0][1] * meta.tileSize,
      this.w * meta.tileSize * this.wRatio,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio * this.wRatio,
      this.h * meta.tileSize * meta.ratio
    );

    // Renders the contour
    c.drawImage(
      SHEET,
      this.spriteX[0][0] * meta.tileSize,
      this.spriteY[0][0] * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
  }
}
class ExpManager {
  constructor(entity) {
    this.owner = entity;
  }
  levelUp() {
    /*
    player.expManager.update({expValue:100})
    */
    this.owner.exp -= this.owner.maxExp;
    this.owner.maxExp = (this.owner.maxExp * 1.1 + 5) | 0;
    this.owner.lv++;

    // Stats increase
    let maxHp = this.owner.maxHp;
    let maxMana = this.owner.maxMana;

    this.owner.maxHp = (this.owner.maxHp * 1.1 + 1) | 0;
    this.owner.maxMana = (this.owner.maxMana + 5) | 0;

    this.owner.hp += this.owner.maxHp - maxHp;
    this.owner.mana += this.owner.maxMana - maxMana;
    this.owner.atk = (this.owner.atk * 1.1 + 1) | 0;

    vfxsManager.sparkleEntity(this.owner, 60, 1);
    vfxsManager.create("StatusText", this.owner, "level UP");
  }
  update(recipient) {
    this.owner.exp += recipient.expValue;
    while (this.owner.exp >= this.owner.maxExp) {
      this.levelUp();
    }
  }
}
class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.expManager = new ExpManager(this);
    this.w = 1;
    this.h = 1;
    this.facing = "r";
    this.baseSpeed = 0.1;
    this.speed = this.baseSpeed;
    this.type = "player";
    this.shadow = true;
    this.equipment = {
      head: "none",
    };
    this.maxHp = 20;
    this.hp = 20;

    this.maxExp = 8;
    this.exp = 0;

    this.maxMana = 15;
    this.mana = 15;

    this.atk = 1;

    this.lv = 1;

    this.action = 0;
    this.actionX = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
    ];
    this.actionY = [
      [6, 7, 8, 9],
      [6, 7, 8, 9],
    ];

    this.weapon = new Sword(this);
    this.attacking = false;
    this.reloading = false;

    this.dummy = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
  }
  renderEquipment() {
    //this.equipment.head.render();
  }
  dash() {
    controls.spacebar = false;
    let moveX = 0;
    let moveY = 0;
    if (controls.right) {
      moveX += 1;
    }
    if (controls.left) {
      moveX -= 1;
    }
    if (controls.down) {
      moveY += 1;
    }
    if (controls.up) {
      moveY -= 1;
    }
    if (moveX && moveY) {
      moveX /= 2;
      moveY /= 2;
    }
    moveX *= this.speed * 10 * meta.deltaTime;
    moveY *= this.speed * 10 * meta.deltaTime;
    this.dummy.x = this.x + moveX;
    this.dummy.y = this.y + moveY;
    this.dummy.w = this.w;
    this.dummy.h = this.h;
    let col = false;
    let out = false;
    for (let entity of map.entities) {
      if (collided(this.dummy, entity)) {
        col = true;
        break;
      }
    }
    if (
      this.dummy.x > map.levelW - 1 ||
      this.dummy.y > map.levelH - 1 ||
      this.dummy.x < 0 ||
      this.dummy.y < 0
    ) {
      out = true;
    }
    if (!out && !col) {
      this.x = this.dummy.x;
      this.y = this.dummy.y;
    }
  }
  onHit(source) {
    if (this.damaged > 0) {
      return;
    }
    this.damaged = 20; //iFrames
    this.hp -= source.atk;
    screenShake.duration = (source.atk / this.maxHp * 50) | 0;
    if (this.hp <= 0) {
      this.hp = 0;
    }
    vfxsManager.create("DmgText", this, source.atk | 0);
  }
  computeInput() {
    if (this.attacking) {
      this.speed = 0.05;
    } else {
      this.speed = this.baseSpeed;
    }
    if (controls.spacebar) {
      this.dash();
    }
    // Moves
    if (controls.left && !controls.right) {
      this.facing = "l";
      this.xVel = -this.speed;
      this.left = true;
    } else if (this.xVel < 0) {
      this.xVel = 0;
    }
    if (controls.right && !controls.left) {
      this.facing = "r";
      this.xVel = this.speed;
      this.left = false;
    } else if (this.xVel > 0) {
      this.xVel = 0;
    }
    if (controls.up && !controls.down) {
      this.facing = "t";
      this.yVel = -this.speed;
    } else if (this.yVel < 0) {
      this.yVel = 0;
    }
    if (controls.down && !controls.up) {
      this.facing = "b";
      this.yVel = this.speed;
    } else if (this.yVel > 0) {
      this.yVel = 0;
    }
    if (!controls.left && !controls.right && !controls.up && !controls.down) {
      this.xVel = 0;
      this.yVel = 0;
    }
    if (controls.left + controls.right + controls.up + controls.down > 1) {
      this.xVel /= 1.42;
      this.yVel /= 1.42;
    }
  }
  compute() {
    if (this.damaged > 0) {
      this.damaged -= meta.deltaTime;
      return;
    }
    this.computeInput();
    this.x += this.xVel;
    this.y += this.yVel;
    map.checkCollisions(this);
    this.weapon.compute();
  }
  onAnimationEnded() {
    switch (this.action) {
      default:
    }
  }
  render() {
    if (this.damaged > 0 && (this.damaged | 0) % 2) {
      return;
    }
    this.updateSprite();
    // Player Body
    this.renderSprite();
    // Helmet (PROVISIONAL)
    c.drawImage(
      SHEET,
      (3 + this.left) * meta.tileSize,
      6 * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y - this.h / 2) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
    // Armor (PROVISIONAL)
    c.drawImage(
      SHEET,
      (3 + this.left) * meta.tileSize,
      7 * meta.tileSize,
      this.w * meta.tileSize,
      this.h * meta.tileSize,
      (this.x + map.x) * meta.tileSize * meta.ratio,
      (this.y + map.y) * meta.tileSize * meta.ratio,
      this.w * meta.tileSize * meta.ratio,
      this.h * meta.tileSize * meta.ratio
    );
    this.weapon.render();
  }
}
class Sword extends Entity {
  constructor(owner) {
    super(owner.x, owner.y);
    this.actionX = [
      [ //wooden
        [11],
        [11],
        [11],
        [11]
      ],
      [ //normal
        [12],
        [12],
        [12],
        [12]
      ],
      [ //moby
        [13],
        [13],
        [13],
        [13]
      ],
    ];
    this.actionY = [
      [ //wooden
        [2],
        [3],
        [4],
        [5]
      ],
      [ //normal
        [2],
        [3],
        [4],
        [5]
      ],
      [ //moby
        [2],
        [4],
        [6],
        [8]
      ],
    ];
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.swordType = 1;

    this.rot = 0;
    this.dir = "left";
    this.owner = owner;

    this.baseAtk = 1;
    this.atk = 2;
    this.attackSpeed = 1;
    this.attackRange = 2;

    this.attackDuration = 160;
    this.attackCounter = 0;

    this.reloadSpeed = 5;
    //the attackID will change every attack, the purpose is hitting targets only ONCE
    this.attackID = 0;
    this.hitbox = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
  }
  checkCollisions() {
    switch (this.dir) {
      case "up":
      case "down":
        this.hitbox.x = this.x + 0.25;
        this.hitbox.y = this.y;
        this.hitbox.w = 0.5;
        this.hitbox.h = this.h;
        break;
      case "left":
      case "right":
        this.hitbox.x = this.x;
        this.hitbox.y = this.y + 0.25;
        this.hitbox.w = this.w;
        this.hitbox.h = 0.5;
        break;
    }
    for (let entity of map.entities) {
      if (entity.type !== "enemy") {
        continue;
      }
      if (entity.damaged === this.attackID) {
        continue;
      }
      if (entity.removed) {
        continue;
      }
      if (collided(this.hitbox, entity)) {
        entity.onHit(this);
      }
    }
  }
  attack(dir) {
    if (this.owner.attacking || this.owner.reloading) {
      return;
    }
    this.attackID = Math.random();
    this.dir = dir;

    switch (dir) {
      case "up":
        this.rot = 45;
        this.targetY = -this.attackRange;
        this.targetX = 0;
        break;
      case "right":
        this.rot = 135;
        this.targetX = this.attackRange;
        this.targetY = 0;
        break;
      case "down":
        this.rot = 225;
        this.targetY = this.attackRange;
        this.targetX = 0;
        break;
      case "left":
        this.rot = 315;
        this.targetX = -this.attackRange;
        this.targetY = 0;
        break;
    }
    this.owner.attacking = true;
  }
  computeInput() {
    if (controls.upR) {
      this.attack("up");
    }
    if (controls.rightR) {
      this.attack("right");
    }
    if (controls.downR) {
      this.attack("down");
    }
    if (controls.leftR) {
      this.attack("left");
    }
  }
  computeAttack() {
    if (!this.owner.attacking) {
      return;
    }

    this.atk = this.baseAtk + this.owner.atk;

    this.action = 2;
    if (this.attackCounter === this.attackDuration) {
      this.owner.attacking = false;
      this.owner.reloading = true;
      this.action = 0;
    }
    this.attackCounter +=
      (this.attackDuration - this.attackCounter) / 5 +
      this.attackSpeed * meta.deltaTime * 2;
    if (this.attackCounter > this.attackDuration) {
      this.attackCounter = this.attackDuration;
    }
    this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
    this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;
    this.checkCollisions();
  }
  computeReload() {
    if (!this.owner.reloading) {
      return;
    }
    if (this.attackCounter === 0) {
      this.rot = 0;
      this.owner.reloading = false;
    }
    this.attackCounter -=
      ((this.attackCounter - this.attackDuration) * -1) / 5 +
      this.attackSpeed * meta.deltaTime * this.reloadSpeed;
    if (this.attackCounter < 0) {
      this.attackCounter = 0;
    }
    this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
    this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;
    this.checkCollisions();
  }
  compute() {
    this.computeInput();
    this.computeReload();
    this.computeAttack();
    this.x = this.owner.x + this.offsetX;
    this.y = this.owner.y + this.offsetY;
    this.left = this.owner.left;
  }
  render() {
    this.frameCounter += meta.deltaTime;
    if (this.frameCounter >= this.slowness) {
      this.frame++;
      this.frameCounter = 0;
    }
    if (this.frame >= this.actionX[this.swordType][this.action].length) {
      this.frame = 0;
    }
    if (this.rot) {
      c.save();
      c.translate(
        (this.x + this.w / 2 + map.x + (this.owner.w - this.w) / 2) * meta.tileSize * meta.ratio,
        (this.y + this.h / 2 + map.y + (this.owner.h - this.h) / 2) * meta.tileSize * meta.ratio
      );
      //
      c.rotate((this.rot * Math.PI) / 180);
      c.drawImage(
        this.sheet,
        this.actionX[this.swordType][this.action][this.frame] * meta.tileSize,
        this.actionY[this.swordType][this.action][this.frame] * meta.tileSize,
        this.w * meta.tileSize,
        this.h * meta.tileSize,
        ((-this.w / 2) * meta.tileSize * meta.ratio) | 0,
        ((-this.h / 2) * meta.tileSize * meta.ratio) | 0,
        (this.w * meta.tileSize * meta.ratio) | 0,
        (this.h * meta.tileSize * meta.ratio) | 0
      );
      c.restore();
    } else {
      c.drawImage(
        SHEET,
        this.actionX[this.swordType][this.action + this.left][this.frame] * meta.tileSize,
        this.actionY[this.swordType][this.action + this.left][this.frame] * meta.tileSize,
        this.w * meta.tileSize,
        this.h * meta.tileSize,
        (this.x + map.x - this.w / 2 + this.left) * meta.tileSize * meta.ratio,
        (this.y + map.y + (this.owner.h - this.h) / 2) * meta.tileSize * meta.ratio,
        this.w * meta.tileSize * meta.ratio,
        this.h * meta.tileSize * meta.ratio
      );
    }
  }
}
class Mouse {
  constructor() {
    this.x = 0;
    this.y = 0;
    // Counting the map.x / map.y offset
    this.map = {
      x: 0,
      y: 0
    }

    // Bounding the functions to the Mouse (to avoid losing the "this")
    this.update = this.update.bind(this);
    this.onClick = this.onClick.bind(this);
    document.addEventListener("mousemove", this.update);
    document.addEventListener("mousedown", this.onClick);
  }
  update(event) {
    this.x = (event.clientX - canvas.offsetLeft) / meta.ratio / meta.tileSize;
    this.y = (event.clientY - canvas.offsetTop) / meta.ratio / meta.tileSize;
    this.map.x = this.x - map.x;
    this.map.y = this.y - map.y;
  }
  onClick() {
    /*
    for (let entity of map.entities) {
      if (pointSquareCol(this.map, entity)) {
        console.log(this.map, entity);
      }
    }
    //*/
  }
}

// Debug tool
class DebugToolTip {
  constructor() {
    this.window = id("debug-ToolTip");
    this.w = 0;
    this.h = 0;
  }
  compute() {
    if (!controls.rClickDown) {
      if (this.window.style.display != "none") {
        this.window.style.display = "none";
      }
      return;
    }
    if (this.window.style.display == "none") {
      this.window.style.display = "block";
    }
    this.window.innerHTML = "Map Pos:"
    this.window.innerHTML += "<br>x:" + (mouse.map.x | 0);
    this.window.innerHTML += "<br>y:" + (mouse.map.y | 0);
    this.w = this.window.offsetWidth;
    this.h = this.window.offsetHeight;
    this.window.style.left = canvas.offsetLeft + (mouse.x * meta.ratio * meta.tileSize) + 20 + "px";
    this.window.style.top = canvas.offsetTop + (mouse.y * meta.ratio * meta.tileSize) - this.h - 20 + "px";

    c.lineWidth = 2;
    c.beginPath();
    c.rect(
      (mouse.x | 0) * meta.ratio * meta.tileSize - c.lineWidth / 2,
      (mouse.y | 0) * meta.ratio * meta.tileSize - c.lineWidth / 2,
      meta.ratio * meta.tileSize,
      meta.ratio * meta.tileSize
    )
    c.closePath();
    c.strokeStyle = "red";
    c.globalAlpha = 0.6;
    c.stroke();
    c.globalAlpha = 1;
    c.lineWidth = 1;
  }
}