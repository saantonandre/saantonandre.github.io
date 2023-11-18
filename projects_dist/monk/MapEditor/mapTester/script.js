// Whole-script strict mode syntax
'use strict';
/*jshint esversion: 6 */
/*jslint bitwise: true */
// Returns the element "arg"
function id(arg) {
    return document.getElementById(arg);
}
window.onload = function () {
    initializeMap();
}

/*
Tile chunk object:
@x the horizontal position of the chunk
@y the vertical position of the chunk
@w the width of the chunk
@h the height of the chunk
@type the tile image position on the SPRITESHEET
*/

// The tiles location in the SPRITESHEET
const tiles = [
    [0, 10], [1, 10], [2, 10], // Earth top 0 - 1 - 2
    [0, 11], [1, 11], [2, 11], // Earth middle 3 - 4 - 5
    [0, 12], [1, 12], [2, 12], // Earth bottom 6 - 7 - 8
    [3, 10], // Earth single 9
    [3, 11], [4, 11], [5, 11], // Earth 1-height 10 - 11 - 12

    //Enemies
    [8, 0], // 13 - Flying thingy
    [17, 7], // 14 - Buff thingy
    [24, 2], // 15 - Mage thingy

]


// Initializing the canvas element
var canvas = id("canvas");

canvas.width = 720;
canvas.height = 480;
/*
canvas.width = 800;
canvas.height = 300;
*/




var c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;

// The spritesheet containing every tile/animation
const SPRITESHEET = id("spritesheet");

// Misc global variables
const GLOBAL = {
    FPS: 30,
    tileSize: 16,
    ratio: 2,
    terminalVel: 1,
    fpsCounter: 0
}


class Star {
    constructor() {
        this.r = (Math.random() * 3 | 0),
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: this.r,
                height: this.r,
                xVel: Math.random() / 10,
                yVel: Math.random() / 10
            });
    }
}

var stars = [];
for (let i = 0; i < 300; i++) {
    new Star();
}

function renderStars() {

    for (let i = 0; i < stars.length; i++) {
        c.fill();
        c.fillStyle = '#ffffff';
        c.fillRect(
            stars[i].x | 0 * GLOBAL.ratio,
            stars[i].y | 0 * GLOBAL.ratio,
            stars[i].width * GLOBAL.ratio,
            stars[i].height * GLOBAL.ratio);
        c.stroke();
        if (stars[i].x > canvas.width) {
            stars[i].x = 0;
        }
        if (stars[i].y > canvas.height) {
            stars[i].y = 0;
        }
        stars[i].x += stars[i].xVel;
        stars[i].y += stars[i].xVel;
    }
}



// Returns an array of integers from 0 to @max depending on @num
function distribute(num, arr, max) {
    let newArr = [];
    while (arr.length > newArr.length) {
        if (num > max) {
            newArr.push(max);
            num -= max;
        } else if (num != 0) {
            newArr.push(num);
            num = 0;
        } else {
            if (arr.length > newArr.length) {
                newArr.push(num);
            }
        }
    }
    return newArr;
}


// The game interface
class Interface {
    constructor() {
        this.shake = 0;
        this.healthMaxValue = 2;
        this.health = [2, 2, 2];
        this.heartsX = [2, 1, 0];
        this.heartsY = [8, 8, 8];
        this.healthX = (canvas.width / 16) / 2 / GLOBAL.ratio - (this.health.length / 2) | 0;
        this.healthY = 1;
        this.shakeAmountX;
        this.shakeAmountY;

    }
    render() {
        if (this.shake > 0) {
            this.shakeAmountX = Math.random() * this.shake * 2 - this.shake;
            this.shakeAmountY = Math.random() * this.shake * 2 - this.shake;
            this.shake--;
        } else {
            this.shakeAmountX = 0;
            this.shakeAmountY = 0;
        }
        this.health = distribute(player.healthAmount, this.health, this.healthMaxValue);

        // Draws the health hearts
        for (let i = 0; i < this.health.length; i++) {
            c.drawImage(
                SPRITESHEET,
                this.heartsX[this.health[i]] * GLOBAL.tileSize | 0,
                this.heartsY[this.health[i]] * GLOBAL.tileSize | 0,
                GLOBAL.tileSize,
                GLOBAL.tileSize,
                this.shakeAmountX + (this.healthX + i) * GLOBAL.tileSize * GLOBAL.ratio | 0,
                this.shakeAmountY + this.healthY * GLOBAL.tileSize * GLOBAL.ratio | 0,
                1 * GLOBAL.tileSize * GLOBAL.ratio | 0,
                1 * GLOBAL.tileSize * GLOBAL.ratio | 0
            )
        }

    }
}
var playerInterface = new Interface();

// Player object: contains every player related variables

class Player {
    constructor() {
        this.healthAmount = 6;
        this.x = 0;
        this.y = 0;
        this.w = 2;
        this.h = 2;
        this.charging = false; // Tells if the player is charging the attack
        this.chargingAmount = 0;
        this.accel = 0.2; // Player speed accelleration
        this.maxSpeed = 0.3; // Maximum reachable speed
        this.left = false; // Direction faced by player
        this.xVel = 0;
        this.yVel = 0;
        this.iFrame = 0; // The number gets to 5, odd numbers will result in the Player not beign visible 
        this.iFrameMax = 30; // The number gets to 5, odd numbers will result in the Player not beign visible 
        this.attacked = false;

        this.xVelExt = 0; // horizontal velocity from external forces
        this.yVelExt = 0; // horizontal velocity from external forces
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.slowness = 3; // Numbers of frames to skip (animation)
        this.action = 0;
        this.actionX = [
            [0, 0, 0, 0], // 0 = IDLE
            [2, 2, 2, 2], // 1 = IDLE (left)
            [4, 4, 4, 4], // 2 = WALK 
            [6, 6, 6, 6], // 3 = WALK (left)
            [8], // 4 = JUMP
            [8], // 5 = JUMP (left)
            [-2], // 6 = NOTHING
            [6, 6, 6, 6, 6], // 7 = CHARGING
            [8, 8, 8, 8, 8]]; // 8 = CHARGING (left)
        //6 8 
        this.actionY = [
            [0, 2, 4, 6],
            [0, 2, 4, 6],
            [0, 2, 4, 6],
            [0, 2, 4, 6],
            [4],
            [6],
            [-2],
            [8, 10, 12, 14, 16],
            [8, 10, 12, 14, 16]];


        // Fist-related variables
        this.f_currentFrame = 0;
        this.f_frameCounter = 0;
        this.f_slowness = 1;
        this.f_action = 0;
        this.fistX = [
            [10, 10, 10, 10], // 0 = LEFT (fist)
            [10, 10, 10, 10], // 1 = RIGHT (fist)
            [12, 13, 14, 15], // 2 = TOP (fist)
            [12, 13, 14, 15]]; // 3 = BOTTOM (fist)
        this.fistY = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 0, 0, 0],
            [2, 2, 2, 2]];

        this.gForce = 0.035; // Gravity force acting on player every frame
        this.jumpSpeed = 0.12;
        this.jumping = false;
        this.friction = 0.80;
        this.attacking = 0;

        // player's hitbox
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
        // Collisions amounts for each side of the hitbox
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }

        // Collisions booleans
        this.colBool = {
            L: false,
            R: false,
            T: false,
            B: false
        }

        // fist's hitbox
        this.atkBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    }
    // States the fist hitbox based on the player's input
    fist(which) {
        if (which !== (this.f_action + 1)) {
            this.f_currentFrame = 0;
            this.f_frameCounter = 0;
        }
        switch (which) {
            case 1: //left
                this.f_action = 0;
                this.atkBox.w = this.w;
                this.atkBox.x = this.x - this.atkBox.w;
                this.atkBox.h = this.w / 2;
                this.atkBox.y = this.y + this.h / 2 - this.atkBox.h / 2;
                break;
            case 2: //right
                this.f_action = 1;
                this.atkBox.w = this.w;
                this.atkBox.x = this.x + this.w;
                this.atkBox.h = this.w / 2;
                this.atkBox.y = this.y + this.h / 2 - this.atkBox.h / 2;
                break;
            case 3: //up
                this.f_action = 2;
                this.atkBox.w = this.w / 2;
                this.atkBox.x = this.x + this.w / 2 - this.atkBox.w / 2;
                this.atkBox.h = this.w;
                this.atkBox.y = this.y - this.atkBox.h;
                break;
            case 4: //down
                this.f_action = 3;
                this.atkBox.w = this.w / 2;
                this.atkBox.x = this.x + this.w / 2 - this.atkBox.w / 2;
                this.atkBox.h = this.w;
                this.atkBox.y = this.y + this.h;
                break;
        }
        // Fist/tiles collisions
        let i = 0,
            collisionFound = false;

        while (!collisionFound && i < map.tiles.length) {
            if (collided(this.atkBox, map.tiles[i])) {
                switch (which) {
                    case 1: //Left punch
                        this.xVelExt += this.jumpSpeed * (this.chargingAmount / 3);
                        collisionFound = true;
                        break;
                    case 2: //Right punch
                        this.xVelExt -= this.jumpSpeed * (this.chargingAmount / 3);
                        collisionFound = true;
                        break;
                    case 3:
                        this.yVel += this.jumpSpeed / 2;
                        collisionFound = true;
                        break;
                    case 4:
                        if (this.colBool.B) {
                            this.yVel -= this.jumpSpeed * (this.chargingAmount / 3);
                        }
                        collisionFound = true;
                        break;
                }
            }
            i++;
        }

        // Fist/enemies collisions
        for (let i = 0; i < map.enemies.length; i++) {
            if (map.enemies[i].type !== "tea" && !map.enemies[i].dead) {
                if (collided(this.atkBox, map.enemies[i])) {
                    map.enemies[i].dead = true;

                    let x = this.x + this.w / 2;
                    let y = this.y + this.h / 2;
                    let deltaX = map.enemies[i].x - (this.x + this.w / 2);
                    let deltaY = map.enemies[i].y - (this.y + this.h / 2);
                    let rotation = Math.atan2(deltaY, deltaX);
                    map.enemies[i].xVel = Math.cos(rotation) * map.enemies[i].speed;
                    map.enemies[i].yVel = Math.sin(rotation) * map.enemies[i].speed;
                }
            }
        }
        this.chargingAmount = 0;
    }
    // Computes the player's new position based on each of his variables
    compute() {
        if (this.yVel < GLOBAL.terminalVel) {
            if (!this.colBool.B) {
                this.yVel += this.gForce;
            }
        } else {
            this.yVel = GLOBAL.terminalVel;
        }
        if (controls.left) {
            if (this.xVel > -this.maxSpeed) {
                this.colBool.B ? this.xVel -= this.accel : this.xVel -= this.accel / 2;
            }
        }
        if (controls.right) {
            if (this.xVel < this.maxSpeed) {
                this.colBool.B ? this.xVel += this.accel : this.xVel += this.accel / 2;
            }
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }
        if (this.colBool.B) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction * 0.5;
            } else {
                this.xVel = 0;
            }
            this.jumping = false;
            if (this.yVel > 0) {
                this.yVel = 0;
            }
        } else {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
            } else {
                this.xVel = 0;
            }
        }
        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel;
        this.y += this.yVel;
        if (controls.left2 ||
            controls.right2 ||
            controls.up2 ||
            controls.down2) {
            this.charging = true;
            if (controls.left2) {
                this.left = true;
            } else if (controls.right2) {

                this.left = false;
            }
        } else {
            this.charging = false;
        }
        if (this.charging && this.chargingAmount < 20) {
            this.chargingAmount++;
        }


        if (controls.leftRel) {
            this.attacking = 4;
            this.f_currentFrame = 0;
            this.f_frameCounter = 0;
            this.fist(1);
        } else if (controls.rightRel) {
            this.attacking = 4;
            this.f_currentFrame = 0;
            this.f_frameCounter = 0;
            this.fist(2);
        } else if (controls.upRel) {
            this.attacking = 4;
            this.f_currentFrame = 0;
            this.f_frameCounter = 0;
            this.fist(3);
        } else if (controls.downRel) {
            this.attacking = 4;
            this.f_currentFrame = 0;
            this.f_frameCounter = 0;
            this.fist(4);
        }
        this.xVelExt *= 0.8;
        this.yVelExt *= 0.8;
        if (this.xVelExt < 0.01 && this.xVelExt > -0.01) {
            this.xVelExt = 0;
        }
        if (this.yVelExt < 0.01 && this.yVelExt > -0.01) {
            this.yVelExt = 0;
        }
        this.x += this.xVelExt;
        this.y += this.yVelExt;
        this.hitbox.x = this.x + this.w / 4;
        this.hitbox.w = this.w / 2;
        this.hitbox.h = this.h;
        this.hitbox.y = this.y;

    }
    // Draws the player onscreen and decides which action he's performing
    render() {
        if (!this.charging) {
            if (this.xVel > 0) {
                this.left = false;
            } else if (this.xVel < 0) {
                this.left = true;
            } else {
                this.left ? this.action = 1 : this.action = 0;
            }
            if (!this.colBool.B) {
                if (this.left) {
                    this.action = 5;
                } else {
                    this.action = 4;
                }
            } else if (this.xVel !== 0) {
                if (!this.left) {
                    player.action = 2;
                    player.left = false;
                } else if (this.left) {
                    player.action = 3;
                    player.left = true;
                }
            }
        }
        this.frameCounter++;
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }
        if (this.currentFrame >= this.actionX[this.action].length) {
            this.currentFrame = 0;
            if (this.charging) {
                this.currentFrame = this.actionX[this.action].length - 2;
            }
        }
        if (this.attacked) {
            this.currentFrame = 0;
            if (this.iFrame++ % 4) {
                this.action = 6;
            }
        }
        if (this.charging) {
            this.left ? this.action = 8 : this.action = 7;
        }

        if (this.iFrame > this.iFrameMax) {
            this.attacked = false;
            this.iFrame = 0;
        }
        c.drawImage(
            SPRITESHEET,
            this.actionX[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            this.actionY[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            GLOBAL.tileSize * 2,
            GLOBAL.tileSize * 2,
            map.x + this.x * GLOBAL.tileSize * GLOBAL.ratio | 0,
            map.y + this.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tileSize * GLOBAL.ratio | 0

        )
        if (this.attacking) {
            this.f_frameCounter++;
            if (this.f_frameCounter > this.f_slowness) {
                this.f_currentFrame++;
                this.f_frameCounter = 0;
            }
            if (this.f_currentFrame >= this.fistX[this.f_action].length) {
                this.f_currentFrame = 3;
            }
            c.drawImage(
                SPRITESHEET,
                this.fistX[this.f_action][this.f_currentFrame] * GLOBAL.tileSize | 0,
                this.fistY[this.f_action][this.f_currentFrame] * GLOBAL.tileSize | 0,
                GLOBAL.tileSize * this.atkBox.w,
                GLOBAL.tileSize * this.atkBox.h,
                map.x + this.atkBox.x * GLOBAL.tileSize * GLOBAL.ratio | 0,
                map.y + this.atkBox.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
                this.atkBox.w * GLOBAL.tileSize * GLOBAL.ratio | 0,
                this.atkBox.h * GLOBAL.tileSize * GLOBAL.ratio | 0

            )
            this.attacking--;
        }
    }
}
var player = new Player();
setInterval(countFps, 1000);

function countFps() {
    id("fps").innerHTML = "FPS: " + GLOBAL.fpsCounter;
    GLOBAL.fpsCounter = 0;
}

function displayDebug() {
    id("px").innerHTML = "x: " + player.x;
    id("py").innerHTML = "y: " + player.y;
    id("pg").innerHTML = "<br>Collisions ";
    id("pg").innerHTML += "<br>L: " + player.colBool.L;
    id("pg").innerHTML += "<br>R: " + player.colBool.R;
    id("pg").innerHTML += "<br>T: " + player.colBool.T;
    id("pg").innerHTML += "<br>B: " + player.colBool.B;
}
// Checks the collision between the player and the Map/enemy objects
function checkCollisions() {
    let m = map.tiles;
    let n = map.enemies;
    let col = "none";
    player.col.L = 0;
    player.col.R = 0;
    player.col.T = 0;
    player.col.B = 0;
    player.colBool.L = false;
    player.colBool.R = false;
    player.colBool.T = false;
    player.colBool.B = false;

    for (let i = 0; i < m.length; i++) {
        if (collided(player, m[i])) {
            col = colCheck(player, m[i]);
            switch (col) {
                // If collided with bottom side the player is grounded
                case "l":
                    if (player.yVel < 0) {
                        if (player.col.L > player.xVel) {
                            player.colBool.L = true;
                            player.xVel = 0;
                        }
                    }

                    break;
                case "r":
                    if (player.xVel > 0) {
                        if (player.col.R < player.xVel) {
                            player.colBool.R = true;
                            player.xVel = 0;
                        }
                    }
                    break;
                case "t":
                    if (player.yVel < 0) {
                        player.yVel = 0;
                    }
                    player.colBool.T = true;

                    break;
                case "b":
                    if (player.yVel > 0) {
                        player.yVel = 0;
                    }
                    player.colBool.B = true;
                    break;
            }
        }
    }
    // Adjust the player position based on the detected collisions
    if (player.colBool.B) {
        player.col.B -= 0.015625;
    }
    if (player.colBool.L) {
        player.col.L -= 0.015625;
    }
    if (player.colBool.R) {
        player.col.R -= 0.015625;
    }
    player.x -= player.col.R - player.col.L;
    player.y -= player.col.B - player.col.T;
}
/*
MONSTER ACTIONS
0 = IDLE
1 = DEATH

*/

//Monster's actions
class Monster {
    constructor(x, y) {
        this.type = "monster";
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.1;

        // Amount of frames to skip before running a player detection check
        this.frames = 10;

        this.attacking = false;

        // The monster's detection range 
        this.range = 3;

        this.dead = false;
        this.deathAnimation = false;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.slowness = 3;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 1,
            h: 1
        };
        this.action = 0;
        this.actionX = [
            [8, 8, 8, 8], // 0 = IDLE
            [9, 9, 9, 9], // 1 = DEATH
            [20]]; // 2 = NOTHING
        this.actionY = [
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [20]];
        //The hitbox for the monster detection range, will be reinitialized every frame
        this.atkBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
    }
    // Checks the new monster position and checks if the player is nearby
    compute() {
        this.frames--;
        if (this.frames <= 0) {
            this.frames = 10;

            if (!this.attacking) {
                this.atkBox.x = this.x - this.range;
                this.atkBox.y = this.y - this.range;
                this.atkBox.w = this.w + this.range * 2;
                this.atkBox.h = this.h + this.range * 2;



                if (collided(this.atkBox, player)) {

                    this.attacking = true;
                    let x = this.x + this.w / 2;
                    let y = this.y + this.h / 2;
                    let deltaX = x - (player.x + player.w / 2);
                    let deltaY = y - (player.y + player.h / 2);
                    let rotation = Math.atan2(deltaY, deltaX);
                    this.xVel = -Math.cos(rotation) * this.speed;
                    this.yVel = -Math.sin(rotation) * this.speed;
                }
            } else {

                if (!this.dead && collided(this, player)) {
                    if (player.healthAmount > 0 && player.iFrame == 0) {
                        player.healthAmount--;
                        playerInterface.shake = 4;
                        player.attacked = true;
                    }
                }
            }
        }
        this.x += this.xVel;
        this.y += this.yVel;
        this.hitbox.x = this.x + this.w / 2;
        this.hitbox.y = this.y;

    }
    render() {
        if (this.dead && !this.deathAnimation) {
            this.action = 1;
            this.frameCounter = 0;
            this.currentFrame = 0;
            this.deathAnimation = true;
        }
        this.frameCounter++;
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }

        if (this.currentFrame >= this.actionX[this.action].length) {
            this.currentFrame = 0;
            if (this.deathAnimation) {
                this.action = 2;
            }
        }


        c.drawImage(
            SPRITESHEET,
            this.actionX[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            this.actionY[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            GLOBAL.tileSize,
            GLOBAL.tileSize,
            map.x + this.x * GLOBAL.tileSize * GLOBAL.ratio | 0,
            map.y + this.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tileSize * GLOBAL.ratio | 0

        )
    }
}

// Test monster
class TeaMonster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.1;

        // Amount of frames to skip before running a player detection check
        this.frames = 10;

        this.attacking = false;

        // The monster's detection range 
        this.range = 3;

        this.dead = false;
        this.deathAnimation = false;
        this.currentFrame = 0;
        this.frameCounter = 0;

        this.type = "tea";
        this.dead = false;
        this.slowness = 3;
        this.atkCounter = 0;
        this.downCounter = 0;
        this.down = 0;
        this.w = 3;
        this.h = 3;
        this.action = 0;
        this.hitbox = {
            x: this.x + this.w / 3,
            y: this.y,
            w: this.w,
            h: this.h,
        };
        this.atkBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        this.actionX = [[16, 16, 16, 16], [19, 19, 19, 19], [19, 19], [18, 18]];
        this.actionY = [[0, 3, 6, 9], [0, 3, 6, 9], [6, 9], [12, 15]];
    }
    compute() {
        this.hitbox.x = this.x - this.down;
        this.hitbox.y = this.y + this.down;
        this.hitbox.w = this.w + this.down;
        this.hitbox.h = this.h - this.down;
        if (this.down && this.downCounter === 1) {
            if (collided(this, player)) {
                if (player.iFrame == 0) {
                    player.attacked = true;
                    player.xVelExt = -2;
                    player.healthAmount -= 2;
                    if (player.healthAmount < 0) {
                        player.healthAmount = 0;
                    }
                }
            }
        }
    }

    render() {
        this.dead = false;
        this.frameCounter++;
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }

        if (this.currentFrame >= this.actionX[this.action].length) {
            this.currentFrame = 0;
            if (this.action == 1) {
                this.action = 2;
            }
            if (this.action == 2 && this.atkCounter++ == 2) {
                this.action = 3;
            }
            if (this.action == 3) {
                this.down = 1;
                this.downCounter++;
                if (this.downCounter == 3) {
                    this.down = 0;
                    this.action = 0;
                    this.downCounter = 0;
                    this.atkCounter = 0;
                }
            }
        }
        if (player.x > this.x - this.range && this.action < 1) {
            this.action = 1;
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            SPRITESHEET,
            this.actionX[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            this.actionY[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            (this.w + this.down) * GLOBAL.tileSize,
            this.h * GLOBAL.tileSize,
            map.x + (this.x - this.down) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            map.y + this.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            (this.w + this.down) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tileSize * GLOBAL.ratio | 0

        )
    }
}

class MageAttack {
    constructor(x, y) {
        this.x = x;
        this.y = 0;
        this.w = 2;
        this.h = 15;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.type = "attack";
        this.disabled = true;
        this.slowness = 3;
        this.attacking = false;
        this.action = 0;
        this.actionX = [[26, 28, 30, 32, 34, 36, 38, 40, 42, 32, 30, 28, 26]];
        this.actionY = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.distance = 0;
        this.speed = 0.3;
        this.follow = true;
        this.hitbox = {
            x: 0,
            y: -10,
            w: 1.3,
            h: 300
        };
    }
    compute() {
        this.distance = player.x + (player.w / 2) - this.x + this.w / 2 - 2;
        if (this.follow) {
            if (this.distance < 0) {
                this.x += this.distance / 10;
            } else if (this.distance > 0) {
                this.x += this.distance / 10;
            }
        }
        this.hitbox.x = this.x + (this.w - this.hitbox.w) / 2;
        if (this.currentFrame > 5 && this.currentFrame < 9) {
            this.follow = false;
            if (collided(this, player)) {
                if (player.healthAmount > 0 && player.iFrame == 0) {
                    player.healthAmount -= 2;
                    playerInterface.shake = 4;
                    player.attacked = true;
                }
            }
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }

        if (this.currentFrame >= this.actionX[this.action].length) {
            this.currentFrame = 0;
            this.disabled = true;
        }

        c.drawImage(
            SPRITESHEET,
            this.actionX[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            this.actionY[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            (this.w) * GLOBAL.tileSize,
            this.h * GLOBAL.tileSize,
            map.x + (this.x) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            (this.w) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tileSize * GLOBAL.ratio | 0

        )
    }
}
class MageMonster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;
        this.speed = 0.1;

        // Amount of frames to skip before running a player detection check
        this.frames = 10;

        this.attacking = false;

        // The monster's detection range 
        this.range = 4;

        this.dead = false;
        this.deathAnimation = false;
        this.currentFrame = 0;
        this.frameCounter = 0;

        this.type = "mage";
        this.dead = false;
        this.slowness = 3;
        this.atkCounter = 0;
        this.downCounter = 0;
        this.down = 0;
        this.w = 2;
        this.h = 2;
        this.action = 0;
        this.hitbox = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
        };
        this.atkBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
        this.laser = new MageAttack(0, 0);
        this.actionX = [[22, 22, 22, 22], [24, 24, 24, 24]];
        this.actionY = [[0, 2, 4, 6], [0, 2, 4, 6]];
    }
    compute() {
        this.frames--;
        if (this.frames <= 0) {
            this.frames = 10;

            if (collided(this.atkBox, player)) {
                this.attacking = true;
                if (this.laser.disabled) {
                    this.laser.disabled = false;
                    this.laser.follow = true;
                    this.laser.x = this.x;
                }
            } else {
                this.attacking = false;
            }

            if (!this.attacking) {
                this.atkBox.x = this.x - this.range;
                this.atkBox.y = this.y - this.range;
                this.atkBox.w = this.w + this.range * 2;
                this.atkBox.h = this.h + this.range * 2;

            } else {
                if (!this.dead && collided(this, player)) {
                    if (player.healthAmount > 0 && player.iFrame == 0) {
                        player.healthAmount--;
                        playerInterface.shake = 4;
                        player.attacked = true;
                    }
                }
            }
        }

    }

    render() {
        if (!this.laser.disabled) {
            this.laser.compute();
            this.laser.render();
        }
        this.dead = false;
        if (this.attacking) {
            this.action = 1;
        } else {
            this.action = 0;
        }
        this.frameCounter++;
        if (this.frameCounter > this.slowness) {
            this.currentFrame++;
            this.frameCounter = 0;
        }

        if (this.currentFrame >= this.actionX[this.action].length) {
            this.currentFrame = 0;
        }
        c.drawImage(
            SPRITESHEET,
            this.actionX[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            this.actionY[this.action][this.currentFrame] * GLOBAL.tileSize | 0,
            (this.w + this.down) * GLOBAL.tileSize,
            this.h * GLOBAL.tileSize,
            map.x + (this.x - this.down) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            map.y + this.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            (this.w + this.down) * GLOBAL.tileSize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tileSize * GLOBAL.ratio | 0

        )
    }
}

// The map object contains the tiles/enemies arrays 

class Map {
    constructor() {
        this.tilesWidth = canvas.width / GLOBAL.tileSize / GLOBAL.ratio;
        this.tilesHeight = canvas.height / GLOBAL.tileSize / GLOBAL.ratio;
        this.x = 0;
        this.y = 0;
        this.backgroundSheet = id("spritesheet-bg");
        this.backgroundsX = [0, 0, 0];
        this.backgroundsY = [0, 150, 300];
        this.backgroundSizeW = 450;
        this.backgroundSizeH = 150;
        this.backgroundPosX = [0, 0, 0]
        this.backgroundPosY = [0, 0, 0];
        this.bgTiles = []; // Tiles that are displayed behind the player
        this.fgTiles = []; // Tiles that are displayed in front of the player
        this.map = [{
            x: 10,
            y: 5,
            w: 1,
            h: 1,
            type: 0
        }, {
            x: 6,
            y: 7,
            w: 7,
            h: 1,
            type: 1
        }, {
            x: 13,
            y: 7,
            w: 1,
            h: 1,
            type: 2
        }, {
            x: 14,
            y: 8,
            w: 8,
            h: 1,
            type: 1
        }, {
            x: 22,
            y: 7,
            w: 1,
            h: 1,
            type: 0
        }, {
            x: 23,
            y: 7,
            w: 8,
            h: 1,
            type: 1
        }, {
            x: 31,
            y: 7,
            w: 1,
            h: 1,
            type: 2
        }, {
            x: 5,
            y: 7,
            w: 1,
            h: 1,
            type: 0
        }, {
            x: 5,
            y: 8,
            w: 1,
            h: 3,
            type: 3
        }, {
            x: 5,
            y: 11,
            w: 1,
            h: 1,
            type: 6
        }, {
            x: 6,
            y: 11,
            w: 25,
            h: 1,
            type: 7
        }, {
            x: 31,
            y: 11,
            w: 1,
            h: 1,
            type: 8
        }, {
            x: 31,
            y: 8,
            w: 1,
            h: 3,
            type: 5
        }, {
            x: 22,
            y: 8,
            w: 9,
            h: 1,
            type: 4
        }, {
            x: 6,
            y: 8,
            w: 8,
            h: 1,
            type: 4
        }, {
            x: 6,
            y: 9,
            w: 25,
            h: 2,
            type: 4
        }, {
            x: 19,
            y: 6,
            w: 1,
            h: 1,
            type: 13
        }, {
            x: 23,
            y: 4,
            w: 1,
            h: 1,
            type: 13
        }, {
            x: 28,
            y: 5,
            w: 1,
            h: 1,
            type: 13
        }, {
            x: 29,
            y: 4,
            w: 1,
            h: 1,
            type: 14
        }, {
            x: 19,
            y: 2,
            w: 1,
            h: 1,
            type: 15
        }, ];
        this.spawnPoint = {
            x: 10,
            y: 0
        };
        this.tiles = [];
        this.enemies = [];
        /*
        this.enemies.push(new Monster(12, 4));
        this.enemies.push(new Monster(15, 11));
        this.enemies.push(new Monster(19, 6));
        this.enemies.push(new TeaMonster(8, 6));
        this.enemies.push(new MageMonster(7, 4));
        */
    }
    moveCamera() {
        this.x = -(player.x - 8) * GLOBAL.tileSize * GLOBAL.ratio;
        this.y = -(player.y - 8) * GLOBAL.tileSize * GLOBAL.ratio;
    }
    renderTiles() {
        // Renders collidable tiles
        for (let i = 0; i < this.tiles.length; i++) {
            renderTile(this.tiles[i]);
        }
    }
    renderBgTiles() {
        // Renders background tiles
        for (let i = 0; i < this.bgTiles.length; i++) {
            renderTile(this.bgTiles[i]);
        }
    }
    renderFgTiles() {
        // Renders "frontground" tiles
        for (let i = 0; i < this.fgTiles.length; i++) {
            renderTile(this.tiles[i]);
        }
    }
    renderEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].render();
        }
    }
    renderBackground() {
        this.backgroundPosX[1] += 0.6;
        this.backgroundPosX[2] += 0.3;

        if (this.backgroundPosX[0] > this.backgroundSizeW * GLOBAL.ratio) {
            this.backgroundPosX[0] -= this.backgroundSizeW * GLOBAL.ratio;
        }
        if (this.backgroundPosX[1] > this.backgroundSizeW * GLOBAL.ratio) {
            this.backgroundPosX[1] -= this.backgroundSizeW * GLOBAL.ratio;
        }
        if (this.backgroundPosX[2] > this.backgroundSizeW * GLOBAL.ratio) {
            this.backgroundPosX[2] -= this.backgroundSizeW * GLOBAL.ratio;
        }

        // Draws the second set of clouds
        for (let i = -1; i < 2; i++) {
            c.drawImage(
                this.backgroundSheet,
                this.backgroundsX[2] | 0,
                this.backgroundsY[2] | 0,
                this.backgroundSizeW,
                this.backgroundSizeH,
                this.backgroundSizeW * GLOBAL.ratio * i + this.backgroundPosX[2] + this.x / 8,
                this.backgroundPosY[2],
                this.backgroundSizeW * GLOBAL.ratio,
                this.backgroundSizeH * GLOBAL.ratio
            )

        }
        // Draws the first set of clouds
        for (let i = -1; i < 2; i++) {
            c.drawImage(
                this.backgroundSheet,
                this.backgroundsX[1] | 0,
                this.backgroundsY[1] | 0,
                this.backgroundSizeW,
                this.backgroundSizeH,
                this.backgroundSizeW * GLOBAL.ratio * i + this.backgroundPosX[1] + this.x / 6,
                this.backgroundPosY[1],
                this.backgroundSizeW * GLOBAL.ratio,
                this.backgroundSizeH * GLOBAL.ratio
            )

        }
        // Draws the mountains
        for (let i = -1; i < 2; i++) {
            c.drawImage(
                this.backgroundSheet,
                this.backgroundsX[0] | 0,
                this.backgroundsY[0] | 0,
                this.backgroundSizeW,
                this.backgroundSizeH,
                this.backgroundSizeW * GLOBAL.ratio * i + this.backgroundPosX[0] + this.x / 4,
                this.backgroundPosY[0],
                this.backgroundSizeW * GLOBAL.ratio,
                this.backgroundSizeH * GLOBAL.ratio
            )
        }

        // Covers the bottom sky
        c.fillStyle = "#20394f";
        c.fillRect(
            0,
            this.backgroundsY[0] + this.backgroundSizeH * GLOBAL.ratio,
            canvas.width,
            this.backgroundSizeH * GLOBAL.ratio,
        )

    }
    computeEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].compute();
        }
    }
}
var map = new Map();

// Determines if the game is in testing mode
var mapTester = true;
if (window.opener) {
    if (window.opener.mapObject) {
        debug.log(window.opener.mapObject);
        safeEval(window.opener.mapObject);
        initializeMap()
    } else {
        safeEval(window.opener.map);
        initializeMap()
    }
} else {
    mapTester = false;
}

function safeEval(level) {
    if (typeof level === 'object' && level !== null) {
        map.map = Object.create(level.map);
        map.spawnPoint = Object.create(level.spawnPoint);
        console.log("safe eval");
    }
}
// Renders tiles chunks into single squares of the specified type
function renderTile(e) {
    if (e.stack) {
        c.drawImage(
            SPRITESHEET,
            tiles[e.type][0] * GLOBAL.tileSize | 0,
            tiles[e.type][1] * GLOBAL.tileSize | 0,
            e.w * GLOBAL.tileSize,
            e.h * GLOBAL.tileSize,
            map.x + e.x * GLOBAL.tileSize * GLOBAL.ratio | 0,
            map.y + e.y * GLOBAL.tileSize * GLOBAL.ratio | 0,
            e.w * GLOBAL.tileSize * GLOBAL.ratio | 0,
            e.h * GLOBAL.tileSize * GLOBAL.ratio | 0
        )

    } else {
        for (let i = 0; i < e.w; i++) {
            for (let j = 0; j < e.h; j++) {
                c.drawImage(
                    SPRITESHEET,
                    tiles[e.type][0] * GLOBAL.tileSize | 0,
                    tiles[e.type][1] * GLOBAL.tileSize | 0,
                    GLOBAL.tileSize,
                    GLOBAL.tileSize,
                    map.x + (e.x + i) * GLOBAL.tileSize * GLOBAL.ratio | 0,
                    map.y + (e.y + j) * GLOBAL.tileSize * GLOBAL.ratio | 0,
                    GLOBAL.tileSize * GLOBAL.ratio | 0,
                    GLOBAL.tileSize * GLOBAL.ratio | 0
                )
            }

        }
    }
}

// The game's main loop
function gameLoop() {
    GLOBAL.fpsCounter++;
    setTimeout(gameLoop, 1000 / GLOBAL.FPS)
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#08141e";
    c.fillRect(0, 0, canvas.width, canvas.height);
    renderStars();
    map.renderBackground();
    map.renderTiles();
    map.renderBgTiles();
    player.compute();
    checkCollisions();
    map.computeEnemies();
    map.renderEnemies();
    player.render();
    playerInterface.render();
    map.moveCamera();
    resetBtnReleases(controls);
    displayDebug(); // Shows player's and game's variables

}
gameLoop();



function initializeMap() {
    player.x = map.spawnPoint.x;
    player.y = map.spawnPoint.y;
    map.tiles = map.map;
    var removeList = [];

    for (let i = map.tiles.length - 1; i >= 0; i--) {
        switch (map.tiles[i].type) {
            case 13:
                map.enemies.push(new Monster(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 14:
                map.enemies.push(new TeaMonster(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
            case 15:
                map.enemies.push(new MageMonster(map.tiles[i].x, map.tiles[i].y))
                removeList.push(i);
                break;
        }
    }
    for (let i = 0; i < removeList.length; i++) {
        map.tiles.splice(removeList[i], 1);
    }
}
