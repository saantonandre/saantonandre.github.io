/*
CLASS LIST

class Meta

class Map

class Player

class Destructible

class Bomb

class Explosion

class Interface

class Portal

class Vfx

class 


// todo:

class Spike

class 

class 




*/

class Meta {
    constructor() {
        this.fps = 60;
        this.loopType = 0;
        this.ratio = 2;
        this.tilesize = 16;
        this.deltaTime = 1;
        this.targetFrames = 50;
        this.tilesWidth = 32;
        this.tilesHeight = 20;
        this.terminalVel = 0.5;

        // Delta Time Computing
        this.perfectFrameTime = 1000 / this.targetFrames;
        this.lastTimestamp = Date.now();
        this.timestamp = Date.now();
    }
    updateDeltaTime() {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime = (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

        // Forces the max slowness as half the fps target
        if (this.deltaTime > 2) {
            this.deltaTime = 2;
        }
    }

}
class Interface {
    constructor() {
        this.levelDisplayer = {
            maxLevel: 0,
            currentLevel: 0,
            fontSize: 20,
            x: 1,
            y: 0.4,
            render: function () {
                c.textAlign = "left";
                c.font = this.fontSize * meta.ratio + "px" + " 'VT323'";
                c.fillStyle = "black";
                c.fillText(
                    map.currentLevel + 1 + "/" + map.levels.length,
                    this.x * meta.tilesize * meta.ratio,
                    this.y * meta.tilesize * meta.ratio + this.fontSize,
                )
            }
        }
    }
    render() {
        this.levelDisplayer.render();
    }

}
class MainMenu {
    constructor() {
        this.bg = id("title");
        this.sheet = id("sheet-menu");
        this.hasLoad = (canStorage && window.localStorage["saveCode"]);
        this.active = false;
        this.newGame = {
            action: 0,
            actionY: [0, 1],
            x: 10,
            y: 12,
            w: 5,
            h: 1
        }
        this.continue = {
            action: 1,
            actionY: [2, 3, 4],
            x: 17,
            y: 12,
            w: 5,
            h: 1
        }
        if (!this.hasLoad) {
            this.continue.action = 0;
        }
        window.addEventListener("click", function () {
            if (meta.loopType !== 2) {
                return;
            }
            if (pointSquareCol(cursor.mapPos, mainMenu.newGame)) {
                captureStopMotion();
                meta.loopType = 1;
                loadLevel();
            }
            if (mainMenu.hasLoad && pointSquareCol(cursor.mapPos, mainMenu.continue)) {
                captureStopMotion();
                meta.loopType = 1;
                loadGame();
                console.log(map.currentLevel)
                loadLevel();
            }
        })
    }
    compute() {
        if (pointSquareCol(cursor.mapPos, this.newGame)) {
            this.newGame.action = 1;
        } else {
            this.newGame.action = 0;
        }

        if (this.hasLoad && pointSquareCol(cursor.mapPos, this.continue)) {
            this.continue.action = 2;
        } else if (this.hasLoad) {
            this.continue.action = 1;
        }
    }
    //draws the menu Image and the options
    render() {
        c.drawImage(
            this.bg,
            0,
            0,
            canvas.width,
            canvas.height)


        c.drawImage(
            this.sheet,
            0,
            this.newGame.actionY[this.newGame.action] * meta.tilesize,
            this.newGame.w * meta.tilesize,
            this.newGame.h * meta.tilesize,
            this.newGame.x * meta.tilesize * meta.ratio,
            this.newGame.y * meta.tilesize * meta.ratio,
            this.newGame.w * meta.tilesize * meta.ratio,
            this.newGame.h * meta.tilesize * meta.ratio
        )

        c.drawImage(
            this.sheet,
            0,
            this.continue.actionY[this.continue.action] * meta.tilesize,
            this.continue.w * meta.tilesize,
            this.continue.h * meta.tilesize,
            this.continue.x * meta.tilesize * meta.ratio,
            this.continue.y * meta.tilesize * meta.ratio,
            this.continue.w * meta.tilesize * meta.ratio,
            this.continue.h * meta.tilesize * meta.ratio
        )
    }
}
class Entity {
    constructor(x, y) {
        this.initialX = x;
        this.initialY = y;
        this.resetBasicVariables(this.initialX, this.initialY);
    }
    resetBasicVariables(xx, yy) {
        this.x = xx;
        this.y = yy;
        this.w = 1;
        this.h = 1;
        this.strikeable = true;
        this.removed = false;
        this.sheet = id("sheet");
        this.hp = 1;
        this.recoilAttacker = false;
        this.type = "something";
        this.solid = false;
        //compute/render even if out of screen
        this.important = false;


        // Rendering Variables 
        this.frame = 0;
        this.frameCounter = 0;
        this.baseSlowness = 6;
        this.slowness = this.baseSlowness;

        this.action = 0;
        this.xVel = 0;
        this.yVel = 0;

        //collisions found
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }
    }
    onCollision() {}
    onHit() {}
    onPlayerCollision() {}
}


class Spike extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = false;
        this.hitbox = {
            x: this.x + 0.24,
            y: this.y + 0.24,
            w: this.w - 0.48,
            h: this.h - 0.48
        }
        this.actionX = 2;
        this.actionY = 14;
    }
    compute() {
        if (player.removed) {
            return;
        }
        if (collided(this, player)) {
            player.die();
        }
    }
    render() {
        /*
        c.fillStyle = "red";
        c.fillRect(
            (this.hitbox.x + map.x) * meta.tilesize * meta.ratio,
            (this.hitbox.y + map.y) * meta.tilesize * meta.ratio,
            this.hitbox.w * meta.tilesize * meta.ratio,
            this.hitbox.h * meta.tilesize * meta.ratio)
        //*/
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}
class HeavySpike extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = true;
        this.gForce = 0.01;
        this.actionX = 3;
        this.actionY = 14;
    }
    compute() {
        map.checkCollisions(this, false, true);
        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = 0;
        }
        if (this.yVel > meta.terminalVel) {
            this.yVel = meta.terminalVel;
        }

        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;
        if (player.removed) {
            return;
        }
        if (collided(this, player)) {
            player.die();
        }
    }
    render() {
        /*
        c.fillStyle = "purple";
        c.fillRect(
            (this.x + map.x) * meta.tilesize * meta.ratio,
            (this.y + map.y) * meta.tilesize * meta.ratio,
            this.w * meta.tilesize * meta.ratio,
            this.h * meta.tilesize * meta.ratio)
            //*/

        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}

class Portal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.sheet = id("sheet");
        this.actionX = 9;
        this.actionY = 1;
    }
    compute() {
        if (collided(this, player)) {
            map.currentLevel++;
            loadLevel();
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX * meta.tilesize,
            this.actionY * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
    }
}
class Destructible extends Entity {
    constructor(x, y, w, h) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sheet = id("sheet");
        this.solid = true;
        this.destructible = true;
        this.horizontal = (this.w > this.h) ? true : false;
        if (this.horizontal) {
            this.actionX = [12, 13, 14];
            this.actionY = [12, 12, 12];
        } else {
            this.actionX = [11, 11, 11];
            this.actionY = [12, 13, 14];
        }
    }
    explode() {
        if (this.horizontal) {
            for (let i = 0; i < this.w; i++) {
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 5, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 6, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 7, true));
                map.vfxs.push(new Vfx(i + this.x + 1 / 2, this.y + 1 / 2, 8, true));
            }
        } else {
            for (let i = 0; i < this.h; i++) {
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 5, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 6, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 7, true));
                map.vfxs.push(new Vfx(this.x + 1 / 2, i + this.y + 1 / 2, 8, true));
            }
        }
        this.removed = true;
    }
    compute() {

    }
    render() {
        let tile = 0;
        if (this.horizontal) {
            for (let i = 0; i < this.w; i++) {
                if (i == 0) {
                    tile = 0;
                } else if (i == this.w - 1) {
                    tile = 2;
                } else {
                    tile = 1;
                }
                c.drawImage(
                    this.sheet,
                    this.actionX[tile] * meta.tilesize,
                    this.actionY[tile] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x + i + map.x) * meta.tilesize * meta.ratio | 0,
                    (this.y + map.y) * meta.tilesize * meta.ratio | 0,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                )
            }
        } else {
            for (let i = 0; i < this.h; i++) {
                if (i == 0) {
                    tile = 0;
                } else if (i == this.h - 1) {
                    tile = 2;
                } else {
                    tile = 1;
                }
                c.drawImage(
                    this.sheet,
                    this.actionX[tile] * meta.tilesize,
                    this.actionY[tile] * meta.tilesize,
                    1 * meta.tilesize,
                    1 * meta.tilesize,
                    (this.x + map.x) * meta.tilesize * meta.ratio | 0,
                    (this.y + i + map.y) * meta.tilesize * meta.ratio | 0,
                    1 * meta.tilesize * meta.ratio,
                    1 * meta.tilesize * meta.ratio,
                )
            }
        }
    }
}

class Map {
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
        //preprocessed current level map
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

        if (this.cameraFocus) {
            let xx = -(this.cameraFocus.x + this.cameraFocus.w / 2 - meta.tilesWidth / 2)
            let yy = -(this.cameraFocus.y + this.cameraFocus.h / 2 - meta.tilesHeight / 2)
            this.x += (xx - this.x) / 6;
            this.y += (yy - this.y) / 6;
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
                    switch (col) {
                        case "b":
                            if (obj.yVel >= 0) {
                                obj.grounded = true;
                                obj.yVel = 0;
                            }
                            break;
                    }

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
            switch (col) {
                case "b":
                    if (obj.yVel >= 0) {
                        obj.grounded = true;
                        obj.yVel = 0;
                    }
                    break;
            }
            //*
            c.lineWidth = 3;
            c.strokeStyle = "red";
            c.beginPath();
            c.rect(
                (collidersChunk[i].x + map.x) * meta.tilesize * meta.ratio | 0,
                (collidersChunk[i].y + map.y) * meta.tilesize * meta.ratio | 0,
                collidersChunk[i].w * meta.tilesize * meta.ratio | 0,
                collidersChunk[i].h * meta.tilesize * meta.ratio | 0
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
                (-this.x * meta.tilesize) | 0,
                (-this.y * meta.tilesize) | 0,
                (meta.tilesWidth * meta.tilesize),
                (meta.tilesHeight * meta.tilesize),
                0,
                0,
                (meta.tilesWidth * meta.tilesize * meta.ratio),
                (meta.tilesHeight * meta.tilesize * meta.ratio)
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
class Sounds {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;

        Audio.prototype.baseVolume = 1;
        Audio.prototype.playy = function () {
            let aud = this;
            aud.playbackRate = this.playbackRate;
            aud.volume = aud.baseVolume * GLOBAL.volume;
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
                    promise.catch(function (e) {});
                }
            }
        };
        /*
        Speaker:
        0 - Player
        1 - Esther 
        2 - Officer
        3 - GhostGirl
        4 - Overlord
        5 - Aliquam
        */
        this.cameraShutter = new Audio("sounds/camera-shutter.mp3");
        this.door = new Audio("sounds/door.mp3");

        this.jump = new Audio("sounds/jump.mp3");
        this.walking = new Audio("sounds/walking.mp3");
        this.walking.loop = true;
        this.jump.baseVolume = 0.6;
        this.skateGrounded = new Audio("sounds/skate-grounded.mp3");
        this.skateGrounded.loop = true;

        this.hit = new Audio("sounds/hit.mp3")
        this.skateJump1 = new Audio("sounds/skate-jump1.mp3");
        this.skateJump2 = new Audio("sounds/skate-jump2.mp3");
        this.trashJump = new Audio("sounds/trash-jump.mp3");

        this.fireball = new Audio("sounds/fireball.mp3");
        this.fireball.baseVolume = 0.7;
        this.fireballExplode = new Audio("sounds/fireball-explode.mp3");

        this.earthquake = new Audio("sounds/earthquake.mp3");
        this.earthquake.loop = true;
        this.earthquake.baseVolume = 0.6;
        this.earthquake1 = new Audio("sounds/earthquake1.mp3");
        this.input = new Audio("sounds/input.mp3");
        this.input.baseVolume = 0.7;

        this.death = new Audio("sounds/death.mp3");
        this.gotHit = new Audio("sounds/got-hit.mp3");

    }
}
class Cursor {
    constructor() {
        this.sheet = id("sheet");
        this.mapPos = {
            x: 0,
            y: 0
        }
        this.w = 1;
        this.h = 1;
        this.action = 0;
        this.actionX = [0, 0];
        this.actionY = [0, 1];
        document.onmousemove = function (e) {
            cursor.mapPos.x = (e.clientX - canvas.offsetLeft) / (meta.tilesize * meta.ratio);
            cursor.mapPos.y = (e.clientY - canvas.offsetTop) / (meta.tilesize * meta.ratio);
        }
    }
    compute() {
        this.action = player.currentBomb;
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX[this.action] * meta.tilesize,
            this.actionY[this.action] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.mapPos.x - this.w / 2) * meta.ratio * meta.tilesize,
            (this.mapPos.y - this.h / 2) * meta.ratio * meta.tilesize,
            this.w * meta.ratio * meta.tilesize,
            this.h * meta.ratio * meta.tilesize
        )
    }
}
class Player extends Entity {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.w = 2;
        this.h = 2;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.03;
        this.airSpeed = 0.015;
        this.maxSpeed = 0.15;
        this.jumpSpeed = -0.24;
        this.gForce = 0.0154;
        this.currentBomb = 0;
        this.grounded = true;
        this.removed = false;
        this.left = 0;
        this.type = "player";
        this.sheet = this.currentBomb ? id("sheet") : id("sheet-alt");
        this.armX = [5, 6];
        this.armY = [4, 4];
        this.armRot = 0;
        this.attacking = 0;
        this.jumpCooldown = 0;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }
        id("canvas").addEventListener("click", function () {
            if (meta.loopType !== 0) {
                return;
            }
            player.attack();
        })
        this.action = 0;
        this.actionX = [[1, 1, 1, 1], [3, 3, 3, 3], [5], [7], [5], [7], [1, 3, 5, 7], [1, 3, 5, 7]];
        this.actionY = [[0, 2, 4, 6], [0, 2, 4, 6], [0], [0], [2], [2], [8, 8, 8, 8], [10, 10, 10, 10]];
        this.slowness = 6;
    }
    die() {
        if(this.removed){
            return;
        }
        slowMo.duration = 30;
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 0));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 0));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 1));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 2));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 3));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 3));
        map.vfxs.push(new Vfx(this.x + this.w / 2, this.y + this.h / 2, 4));
        this.x = map.spawnPoint.x;
        this.y = map.spawnPoint.y;
        this.removed = true;
        map.cameraFocus = false;
        setTimeout(function () {
            loadLevel();
            player.removed = false;
            map.cameraFocus = player;
            player.currentBomb = 0;
            player.sheet = player.currentBomb ? id("sheet") : id("sheet-alt");
            player.xVel = 0;
            player.yVel = 0;
            player.left = 0;
            player.hitbox = {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            };

        }, 1000)
    }
    attack() {
        if (this.removed) {
            return;
        }
        let x = cursor.mapPos.x - 2 - map.x;
        let y = cursor.mapPos.y - 2 - map.y;
        let x2 = this.x + this.w / 2;
        let y2 = this.y + this.h / 2;
        let deltaX = x - this.x + this.w / 2;
        let deltaY = y - this.y + this.h / 2;
        let rotation = Math.atan2(deltaY, deltaX);
        let a = x - x2;
        let b = y - y2;
        /*
        let distance = Math.sqrt(a * a + b * b);
        if (distance > 10) {
            distance = 10;
        }
        //*/
        let distance = 6;
        let xTarget = Math.cos(rotation) / 20 * distance;
        let yTarget = Math.sin(rotation) / 20 * distance;
        this.armRot = rotation + Math.PI / 4;
        this.attacking = 10;
        map.entities.push(new Bomb(this.x + this.w / 2 - 0.5 + Math.cos(rotation) * 0.7, this.y + this.h / 2 - 0.5 + Math.sin(rotation) * 0.7, xTarget + this.xVel / 2, yTarget + this.yVel / 2, this.currentBomb));
        this.currentBomb ? this.currentBomb = 0 : this.currentBomb = 1;
        this.sheet = this.currentBomb ? id("sheet") : id("sheet-alt");
    }
    computeAction() {
        if (this.xVel > 0) {
            this.left = 0;
        } else if (this.xVel < 0) {
            this.left = 1;
        }
        if (this.grounded) {
            this.action = 0;
            if (Math.abs(this.xVel) > 0) {
                this.action = 6;
            }
        } else {
            this.action = 2;
        }
        if (this.attacking > 0) {
            this.attacking -= meta.deltaTime;
            this.action = 4;
        }

    }
    onExplosion(source) {
        switch (source.col) {
            case "l":
                this.xVel = -this.jumpSpeed * 1.5;
                this.yVel = this.jumpSpeed * 1.5;
                break;
            case "r":
                this.xVel = this.jumpSpeed * 1.5;
                this.yVel = this.jumpSpeed * 1.5;
                break;
            case "t":
                this.yVel = -this.jumpSpeed;
                break;
            case "b":
                this.yVel = this.jumpSpeed * 2;
                break;
        }
        this.grounded = false
    }
    handleControls() {
        if (controls.left && !this.col.L) {
            if (this.grounded && this.xVel > 0) {
                this.xVel = 0;
            }
            if (this.xVel > -this.maxSpeed) {
                this.xVel += this.grounded ? -this.speed : -this.airSpeed;
            }
        }
        if (controls.right && !this.col.R) {
            if (this.grounded && this.xVel < 0) {
                this.xVel = 0;
            }
            if (this.xVel < this.maxSpeed) {
                this.xVel += this.grounded ? this.speed : this.airSpeed;
            }
        }
        if (!controls.right && !controls.left && this.grounded) {
            this.xVel = 0;
        }

    }
    handleCollisions() {
        map.checkCollisions(this);
        if (this.col.T && this.yVel < 0) {
            this.yVel = 0;
        }
        if (this.col.R && this.xVel > 0) {
            this.xVel = 0;
        }
        if (this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
    }
    compute() {
        if (this.removed) {
            return;
        }
        this.handleCollisions();
        this.handleControls();
        if (!this.grounded) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = 0;
        }
        if (this.yVel > meta.terminalVel) {
            this.yVel = meta.terminalVel;
        }
        if (this.grounded && Math.abs(this.xVel) > this.maxSpeed) {
            this.xVel -= 0.001;
        }


        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;
        this.hitbox.x = this.x + 0.3;
        this.hitbox.y = this.y + 0.2;
        this.hitbox.w = this.w - 0.6;
        this.hitbox.h = this.h - 0.15;
        this.computeAction();
        if(isOutOfBounds(this)){
            this.die();
        }
    }
    render() {
        if (this.removed) {
            return;
        }
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        /*
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        */
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * meta.tilesize,
            this.actionY[this.action + this.left][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            ((this.x + map.x) * meta.tilesize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tilesize * meta.ratio) | 0,
            (this.w * meta.tilesize * meta.ratio) | 0,
            (this.h * meta.tilesize * meta.ratio) | 0
        )
        if (this.action == 4) {
            c.save();
            c.translate((this.x + map.x + this.w / 2) * meta.tilesize * meta.ratio | 0, (this.y + map.y + this.h / 2) * meta.tilesize * meta.ratio | 0);
            c.rotate(this.armRot);
            c.drawImage(
                this.sheet,
                this.armX[this.left] * meta.tilesize,
                this.armY[this.left] * meta.tilesize,
                1 * meta.tilesize,
                1 * meta.tilesize,
                0 * meta.tilesize * meta.ratio,
                -1 * meta.tilesize * meta.ratio,
                1 * meta.tilesize * meta.ratio | 0,
                1 * meta.tilesize * meta.ratio | 0
            )
            c.restore();
        }
    }
}

// The flying stuff
class Vfx {
    constructor(x, y, type, slow) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.slow = slow ? true : false;
        //compute/render even if out of screen
        this.important = false;
        this.strikeable = false;
        this.rotation = 0;
        this.rotSpeed = Math.random() * 10;
        this.xVel = Math.random() * 0.3 - 0.15;
        this.yVel = -Math.random() * 0.6 - 0.1;
        if (this.slow) {
            this.xVel = Math.random() * 0.1 - 0.05;
            this.rotSpeed = 0;
        }
        this.sheet = id("sheet-vfx");
        this.type = type;
        this.gForce = 0.02;
    }
    compute() {
        this.yVel += this.gForce * meta.deltaTime;
        if (this.y > map.tilesHeight) {
            this.removed = true;
        }
        this.x += this.xVel * meta.deltaTime;
        this.y += this.yVel * meta.deltaTime;
        this.rotation += this.rotSpeed * meta.deltaTime;
    }
    render() {
        c.save();
        c.translate(
            (this.x + this.w / 2 + map.x) * meta.tilesize * meta.ratio,
            (this.y + this.h / 2 + map.y) * meta.tilesize * meta.ratio
        );
        // 
        c.rotate(this.rotation * Math.PI / 180);
        c.drawImage(
            this.sheet,
            0,
            this.type * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (-this.w / 2) * meta.tilesize * meta.ratio | 0,
            (-this.h / 2) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
        c.restore();
    }
}
class Bomb extends Entity {
    constructor(x, y, xVel, yVel, which) {
        super(x, y)
        this.speed = 0.05;
        this.maxSpeed = 0.3;
        this.xVel = xVel;
        this.yVel = yVel;
        this.which = which;
        this.sheet = which ? id("sheet") : id("sheet-alt");
        this.left = 0;
        this.action = 0;
        this.actionX = [[10, 10, 10, 10]];
        this.actionY = [[0, 1, 2, 3]];
        this.dir = this.left * 2 - 1;
        this.recoilAttacker = false;
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.gForce = 0.011;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        this.type = "bomb";
        this.friction = 0.99;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.hitbox = {
            x: this.x + 0.15,
            y: this.y + 0.15,
            w: 0.7,
            h: 0.7
        }
    }
    computeAction() {}
    explode(collidedObj) {
        this.removed = true;
        let chunk = map.checkCollisions(this, true);
        let col = colCheck(this, chunk[0]);
        this.x -= this.col.R - this.col.L;
        this.y -= this.col.B - this.col.T;
        map.vfxs.push(new Explosion(this.x, this.y, col, this.which));
        if (this.which) {
            screenShake.duration = 10;
            if (collidedObj.destructible) {
                collidedObj.explode();
                screenShake.duration = 30;
            }
        }
    }
    compute() {
        if (this.yVel < meta.terminalVel) {
            this.yVel += this.gForce * meta.deltaTime;
        } else {
            this.yVel = meta.terminalVel;
        }
        if (this.xVel > meta.terminalVel) {
            this.xVel = meta.terminalVel;
        } else if (this.xVel < -meta.terminalVel) {
            this.xVel = -meta.terminalVel;
        }
        if (this.controls.left) {
            if (this.xVel > -this.maxSpeed) {
                this.grounded ? this.xVel -= this.speed : this.xVel -= this.speed / 2;
            }
        }
        if (this.controls.right) {
            if (this.xVel < this.maxSpeed) {
                this.grounded ? this.xVel += this.speed : this.xVel += this.speed / 2;
            }
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }
        if (Math.abs(this.xVel) > 0.01) {
            this.xVel *= Math.pow(this.friction, meta.deltaTime);
        } else {
            this.xVel = 0;
        }
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.y += this.yVel * meta.deltaTime;
        this.x += this.xVel * meta.deltaTime;
        this.hitbox.x = this.x + 0.2;
        this.hitbox.y = this.y + 0.2;

        this.computeAction();

        for (let i = 0; i < map.tiles.length; i++) {
            if (collided(this, map.tiles[i])) {
                this.explode(map.tiles[i]);
                return;
            }
        }
        for (let i = 0; i < map.entities.length; i++) {
            if (map.entities[i].removed || !map.entities[i].solid) {
                continue;
            }
            if (map.entities[i].type == "bomb") {
                continue;
            }
            if (collided(this, map.entities[i])) {
                this.explode(map.entities[i])
                return;
            }
        }
    }
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * meta.tilesize,
            this.actionY[this.action + this.left][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )
        //drawLaser(this,this.left);
    }
}

class Explosion extends Entity {
    constructor(x, y, col, which) {
        super();
        this.x = x - 1;
        this.y = y - 2;
        this.w = 3;
        this.h = 3;
        this.which = which;
        this.sheet = this.which ? id("sheet") : id("sheet-alt");
        this.action = 0;
        this.col = col;
        this.playerCol = false;
        switch (this.col) {
            case "b":
                this.action = 0;
                this.x = x - 1;
                this.y = y - 2;
                break;
            case "l":
                this.action = 1;
                this.x = x;
                this.y = y - 1;
                break;
            case "t":
                this.action = 2;
                this.x = x - 1;
                this.y = y;
                break;
            case "r":
                this.action = 3;
                this.x = x - 2;
                this.y = y - 1;
                break;
        }
        this.hitbox = {
            x: this.x + 0.65,
            y: this.y + 0.65,
            w: this.w - 1.3,
            h: this.h - 1.3,
        }
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        //this.actionX = [[0,0,0,0,0,0,0,0,0]];
        //this.actionY = [[0,3,6,9,12,15,18,21,24]];

        //0- B 
        //1- L 
        //2- U 
        //3- R

        this.actionX = [
            [17, 17, 17, 17, 17, 17, 17, 17],
            [20, 20, 20, 20, 20, 20, 20, 20],
            [23, 23, 23, 23, 23, 23, 23, 23],
            [26, 26, 26, 26, 26, 26, 26, 26],
        ];
        this.actionY = [
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
            [0, 3, 6, 9, 12, 15, 18, 21],
        ];
    }
    compute() {
        if (this.playerCol) {
            return;
        }
        if (this.frame > 0 && this.frame <= 2 && collided(this, player)) {
            if (!this.which) {
                player.onExplosion(this);
            } else {
                player.die();
            }
            this.playerCol = true;
        }
    }
    render() {
        this.slowness = this.baseSlowness / meta.deltaTime;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
                this.removed = true;
                return;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * meta.tilesize,
            this.actionY[this.action][this.frame] * meta.tilesize,
            this.w * meta.tilesize,
            this.h * meta.tilesize,
            (this.x + map.x) * meta.tilesize * meta.ratio | 0,
            (this.y + map.y) * meta.tilesize * meta.ratio | 0,
            this.w * meta.tilesize * meta.ratio | 0,
            this.h * meta.tilesize * meta.ratio | 0
        )

        /*draws the hitbox
        c.fillStyle="red";
        c.fillRect(
        (this.hitbox.x+map.x)* meta.tilesize * meta.ratio,
        (this.hitbox.y+map.y)* meta.tilesize * meta.ratio,
        this.hitbox.w* meta.tilesize * meta.ratio,
        this.hitbox.h* meta.tilesize * meta.ratio)
        //*/
    }
}
