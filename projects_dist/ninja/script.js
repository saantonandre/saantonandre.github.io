function id(arg) {
    return document.getElementById(arg);
}
var canvas = id("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
const SPRITESHEET = id("spritesheet");
c.imageSmoothingEnabled = false;
const GLOBAL = {
    FPS: 60,
    tilesize: 8,
    ratio: 3,
    terminalVel: 1
}
//Any living subclass must have this parent class
class Being {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 1;
        this.h = 1;
        this.speed = 0.05;
        this.maxSpeed = 0.2;
        this.xVel = 0;
        this.yVel = 0;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.gForce = 0.02;
        this.jumpSpeed = 0.3;
        this.grounded = false;
        this.jumping = false;
        this.friction = 0.3;
        this.airFriction = 0.98;
        this.sheet = SPRITESHEET;
        this.left = false;
        this.charging = false;
        this.attacking = false;
        this.cooldown = false;
        this.slowness = 1;
        this.frame = 0;
        this.still = true;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.airAttack = 0;
        this.action = 0;
        this.actionX = [[]]
        this.actionY = [[]]
        this.rand = 0;
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }
        this.attack = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            currentFrame: 0,
            frameCounter: 0,
            actionY: [4, 5, 6, 7]
        }
    }
}
class Enemy extends Being{
    constructor(x,y){
        super();
        this.x = x;
        this.y = y;
        this.speed=3;
        this.actionX = [[0, 0, 0, 0], [1, 1, 1, 1]];
        this.actionY = [[12, 13, 14, 15], [12, 13, 14, 15]];
        this.actions={
            left:0,
            right:0,
        }
    }
    AI(){
    }
    compute(){
        if(this.actions.left){
            
        }
        if(this.actions.right){
            
        }
    }
    draw(){
        
    }
}
class Player extends Being {
    constructor(x,y) {
        super();
        this.x = x;
        this.y = y;
        this.actionX = [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3]]
        this.actionY = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]]
    }
    compute() {
        if (!this.attacking && !this.airAttack) {
            if (controls.rightArrow) {
                this.attacking = 1;
                this.rand = Math.random() * 2 | 0;
                if (!this.grounded && !this.airAttack) {
                    this.xVel = 0.5;
                    this.airAttack = 1;
                }
            } else if (controls.upArrow) {
                this.attacking = 2;
                this.rand = Math.random() * 2 | 0;
                if (!this.grounded && !this.airAttack) {
                    this.yVel = -0.3;
                    this.airAttack = 1;
                }
            } else if (controls.leftArrow) {
                this.attacking = 3;
                this.rand = Math.random() * 2 | 0;
                if (!this.grounded && !this.airAttack) {
                    this.xVel = -0.5;
                    this.airAttack = 1;
                }
            } else if (controls.downArrow) {
                this.attacking = 4;
                this.rand = Math.random() * 2 | 0;
                if (!this.grounded && !this.airAttack) {
                    this.yVel = 0.3;
                    this.airAttack = 1;
                }
            }
        }
        if (this.attacking) {
            this.atk(this.attacking - 1);
        }


        if (this.yVel < GLOBAL.terminalVel) {
            this.yVel += this.gForce;
        } else {
            this.yVel = GLOBAL.terminalVel;
        }
        if (controls.left) {
            if (this.xVel > -this.maxSpeed) {
                this.grounded ? this.xVel -= this.speed : this.xVel -= this.speed / 2;
            }
        }
        if (controls.right) {
            if (this.xVel < this.maxSpeed) {
                this.grounded ? this.xVel += this.speed : this.xVel += this.speed / 2;
            }
        }
        if (!controls.right && !controls.left) {
            this.xVel *= this.friction;
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }

        // What happens when player is grounded
        if (this.grounded) {
            this.airAttack = 0;
            if (Math.abs(this.xVel) > this.maxSpeed) {
                this.xVel*=0.95;
            }
            if (Math.abs(this.xVel) < 0.01){
                this.xVel = 0;
            }
            this.jumping = false;
            if (this.yVel > 0) {
                this.yVel = 0;
            }
        } else {
            if (Math.abs(this.xVel) > 0.001) {
                this.xVel *= this.airFriction;
            } else {
                this.xVel = 0;
            }
        }

        if (controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel = -this.jumpSpeed;
        }

        if (this.xVelExt > 0.001 || this.xVelExt < -0.001) {
            this.xVelExt *= 0.9;
        } else {
            this.xVelExt = 0;
        }
        if (this.yVelExt > 0.001 || this.yVelExt < -0.001) {
            this.yVelExt *= 0.9;
        } else {
            this.yVelExt = 0;
        }



        this.y += this.yVel + this.yVelExt;
        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel + this.xVelExt;

    }
    atk(dir) {
        switch (dir) {
            case 0:
                this.attack.x = 1;
                this.attack.y = 0;
                break;
            case 1:
                this.attack.x = 0;
                this.attack.y = -1;
                break;
            case 2:
                this.attack.x = -1;
                this.attack.y = 0;
                break;
            case 3:
                this.attack.x = 0;
                this.attack.y = 1;
                break;
        }

        this.attack.frameCounter++
        if (this.attack.frameCounter > this.slowness) {
            this.attack.currentFrame++;
            this.attack.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            (dir + this.rand * 4) * GLOBAL.tilesize,
            this.attack.actionY[this.attack.currentFrame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + this.attack.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + this.attack.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        );

        if (this.attack.currentFrame >= 4) {
            this.attack.currentFrame = 0;
            this.attacking = false;
        }
    }
    render() {
        this.still = false;
        if (this.xVel > 0) {
            this.left = false;
        } else if (this.xVel < 0) {
            this.left = true;
        } else {
            this.still = true;
        }
        if (!this.grounded) {
            this.action = 2;
        } else if (this.still) {
            this.action = 0;
            this.currentFrame = 0;
            this.frameCounter = 0;
        } else {
            this.action = 0;
        }
        this.frameCounter++
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }
        if (this.currentFrame >= this.actionX.length) {
            this.currentFrame = 0;
        }


        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.currentFrame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.currentFrame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            this.x * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.y * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        );
    }
}
var player = new Player(10,8);

function checkCollisions() {
    let m = map.tiles;
    let col = "none";
    player.grounded = false;
    player.col.L = 0;
    player.col.R = 0;
    player.col.T = 0;
    player.col.B = 0;

    for (let i = 0; i < m.length; i++) {
        if (collided(player, m[i])) {
            col = colCheck(player, m[i]);
            switch (col) {
                case "b":
                    player.grounded = true;
                    break;
            }
        }
    }
    player.x -= player.col.R - player.col.L;
    player.y -= (player.col.B -= 0.01) - player.col.T;
}
class Map {
    constructor() {
        this.tilesWidth = canvas.width / GLOBAL.tilesize / GLOBAL.ratio;
        this.tilesHeight = canvas.height / GLOBAL.tilesize / GLOBAL.ratio;
        this.tiles = [
            {
                x: 3,
                y: 3,
                w: 1,
                h: 1
            }, {
                x: 6,
                y: 6,
                w: 1,
                h: 1
            }, {
                x: 1,
                y: 9,
                w: 30,
                h: 1
            },
            ]
    }
    renderTiles() {
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = 0; j < this.tiles[i].w; j++) {
                for (let k = 0; k < this.tiles[i].h; k++) {
                    c.drawImage(
                        SPRITESHEET,
                        8 * GLOBAL.tilesize,
                        4 * GLOBAL.tilesize,
                        GLOBAL.tilesize,
                        GLOBAL.tilesize,
                        (this.tiles[i].x + j) * GLOBAL.tilesize * GLOBAL.ratio,
                        (this.tiles[i].y + k) * GLOBAL.tilesize * GLOBAL.ratio,
                        GLOBAL.tilesize * GLOBAL.ratio,
                        GLOBAL.tilesize * GLOBAL.ratio,
                    )
                }
            }
        }
    }
}
var map = new Map();

function renderEntity(e) {
    c.beginPath();
    c.rect(
        e.x * GLOBAL.tilesize * GLOBAL.ratio | 0,
        e.y * GLOBAL.tilesize * GLOBAL.ratio | 0,
        e.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
        e.h * GLOBAL.tilesize * GLOBAL.ratio | 0
    );
    c.closePath()
    c.stroke();
}

function gameLoop() {
    setTimeout(gameLoop, 1000 / GLOBAL.FPS)
    c.clearRect(0, 0, canvas.width, canvas.height);
    map.renderTiles();
    player.compute();
    checkCollisions();
    player.render();

}
gameLoop();
