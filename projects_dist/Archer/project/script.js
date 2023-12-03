"strict"
/* 
TODO:
- implement mapX and mapY
- screenshake on enemy kill
- enemy AI starts in certain range

*/


/**** GLOBAL VARIABLES ****/

// PreProcessed mouse data
var mousePP = {
    x: 0,
    y: 0
};

// used to display FPS
var fps = 0;


const DEBUG = false;
const CANVAS = id("canvas");
const TILESIZE = 32;
var gamePaused = false



// Object arrays
var visualFxs = [];
var TilesData = [];
var playerArrows = [];
var monsters = [];




// Setting up the CANVAS
var c = CANVAS.getContext("2d");
CANVAS.width = 736; // 23
CANVAS.height = 480; // 15
CANVAS.style.left = (window.innerWidth - CANVAS.width) / 2 + "px";
CANVAS.style.top = (window.innerHeight - CANVAS.height) / 2 + "px";
c.imageSmoothingEnabled = false;

// Temporary variable used to check collisions
var generatedSquare = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
};

function id(arg) {
    return document.getElementById(arg);
}

var fpsDiv = id("FPS");
setInterval(function () {
    fpsDiv.innerHTML = "FPS: " + fps;
    fpsDiv.innerHTML += "<br>DTR: " + DTR.toPrecision(3);
    fps = 0;
}, 1000)

var Mouse = {
    x: 0,
    y: 0,
}


// Object containing data about the screen shakes
var screenShake = {
    x: 0,
    y: 0,
    counter: 0,
    set: function () {
        this.x = (Math.random() * 8) - 4 | 0;
        this.y = (Math.random() * 8) - 4 | 0;
    }
}


//Creates arrows Object
class Projectile {
    constructor() {
        this.x = 0;
        this.y = 0;

        //Speed of the projectile
        this.yVel = 0;
        this.xVel = 0;

        //Relative x and y positions
        this.xRel = 0;
        this.yRel = 0;

        this.active = true;
        this.free = true;
        this.friendly = true;
        this.lengthX = 0;
        this.lengthY = 0;
        this.damage = 1;
        this.color = 0;
        this.colors = ["#8b5851", "#ff8db5"];
        this.points = {
            x: 0,
            y: 0
        };
    }
    draw() {
        if (Math.abs(this.xVel * 3) > Math.abs(this.lengthX)) {
            this.lengthX = this.xVel * 3;
            this.lengthY = this.yVel * 3;
        }
        this.points.x = this.x + this.lengthX;
        this.points.y = this.y + this.lengthY;
        c.moveTo(this.x + map.x, this.y + map.y);
        c.lineTo(this.x + this.lengthX + map.x, this.y + this.lengthY + map.y);
    }
    compute() {
        this.x += this.xVel / DTR;
        this.y += this.yVel / DTR;
        // If the arrows if flying check if it collided with something, check also collisions with monsters
        if (getTileData(this.x, this.y).solid) {
            //visual effect
            visualFxs.push(new Explosion(this.x + this.xVel, this.y + this.yVel, this.color));
            if (this.color == 2) {
                screenShake.counter = 5;
            }

            this.xVel = 0;
            this.yVel = 0;
            this.lengthX /= 2;
            this.lengthY /= 2;
            this.free = false;
        } else {
            for (let j = monsters.length - 1; j >= 0; j--) {
                let m = monsters[j];
                if (!m.dead && m.collidable) {
                    if (pointSquareCol(this, m) || pointSquareCol(this.points, m)) {

                        // Remove this arrow rom the arrows array
                        this.active = false;

                        // The monster takes this arrow's velocities
                        m.xVelExt = this.xVel / 2;
                        m.yVelExt = this.yVel / 2;

                        // Visual effect
                        visualFxs.push(new Explosion(this.x, this.y, this.color));
                        if (this.color == 2) {
                            screenShake.counter = 5;
                        }


                        // Attaches to the monster
                        this.xVel = 0;
                        this.yVel = 0;
                        this.xRel = this.x - m.x;
                        this.yRel = this.y - m.y;
                        m.arrows.push(this);
                        m.hp -= this.damage;
                        m.justDamaged = 15;
                    }

                }
            }
        }
    }
}
var enemyProjectiles = []
class EnemyProjectile {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w;
        this.h;
        //Speed of the projectile
        this.yVel = 0;
        this.xVel = 0;
        this.free = true;
        this.friendly = false;
        this.sheet = id("sheet");
        this.actionX = [5];
        this.actionY = [24];
        this.type = 0;
        this.damage = 5;
    }
    compute() {
        this.x += this.xVel / DTR;
        this.y += this.yVel / DTR;
        // If the projectile if flying check if it collided with something, check also collisions with monsters
        if (getTileData(this.x, this.y).solid) {
            enemyProjectiles.splice(enemyProjectiles.indexOf(this), 1);

            //visual effect
            visualFxs.push(new Explosion(this.x + this.xVel, this.y + this.yVel, 1));
            this.xVel = 0;
            this.yVel = 0;
            this.lengthX /= 2;
            this.lengthY /= 2;
            this.free = false;

        } else {
            if (pointSquareCol(this, player)) {
                /// PROVISIONAL MEASURE ///

                // Remove this arrow rom the arrows array
                enemyProjectiles.splice(enemyProjectiles.indexOf(this), 1);

                // The monster takes this arrow's velocities
                player.xVelExt += this.xVel / 2;
                player.yVelExt += this.yVel / 2;
                player.hp -= this.damage;
                // Visual effect
                visualFxs.push(new Explosion(this.x, this.y, 1));
                screenShake.counter = 5;
            }
        }

    }
    draw() {
        c.drawImage(
            this.sheet,
            this.actionX[this.type] * TILESIZE,
            this.actionY[this.type] * TILESIZE,
            TILESIZE,
            TILESIZE,
            this.x - TILESIZE / 2 + map.x,
            this.y - TILESIZE / 2 + map.y,
            TILESIZE,
            TILESIZE)
    }

}

class Explosion {
    constructor(x, y, type) {
        this.sheet = id("sheet");
        this.x = x - 16;
        this.y = y - 16;
        this.w = 32;
        this.h = 32;

        this.frameCounter = 0;
        this.currentFrame = 0;
        this.action = type - 1;
        this.actionX = [[448, 448, 448, 448, 448, 448], [448, 448, 448, 448, 448, 448]];
        this.actionY = [[0, 32, 64, 96, 128, 160], [192, 224, 256, 288, 320, 352]];
        this.slowness = 4;
        this.ended = false;
    }
    draw() {
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.currentFrame],
            this.actionY[this.action][this.currentFrame],
            TILESIZE,
            TILESIZE,
            this.x + map.x,
            this.y + map.y,
            this.w,
            this.h
        )

        this.frameCounter++;
        if (this.frameCounter > this.slowness * DTR) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame > this.actionX[this.action].length - 1) {
                this.ended = true;
            }
        }

    }
}

// Has variable and function for every entity

class Collidable {
    constructor() {

    }
    checkCollisions() {
        let col;
        this.col.T = 0;
        this.col.B = 0;
        this.col.L = 0;
        this.col.R = 0;


        if (getTileData(this.x, this.y).unpassable) {
            generatedSquare = {
                x: (this.x / TILESIZE | 0) * TILESIZE,
                y: (this.y / TILESIZE | 0) * TILESIZE,
                w: TILESIZE,
                h: TILESIZE
            }
            col = colCheck(this, generatedSquare);
            this.x += (this.col.L - this.col.R) / 5 / DTR;
            this.y += (this.col.T - this.col.B) / 5 / DTR;
        }
        if (getTileData(this.x + this.w, this.y).unpassable) {
            generatedSquare = {
                x: ((this.x + this.w) / TILESIZE | 0) * TILESIZE,
                y: (this.y / TILESIZE | 0) * TILESIZE,
                w: TILESIZE,
                h: TILESIZE
            }
            col = colCheck(this, generatedSquare);
            this.x += (this.col.L - this.col.R) / 5 / DTR;
            this.y += (this.col.T - this.col.B) / 5 / DTR;
        }
        if (getTileData(this.x, this.y + this.h).unpassable) {
            generatedSquare = {
                x: (this.x / TILESIZE | 0) * TILESIZE,
                y: ((this.y + this.h) / TILESIZE | 0) * TILESIZE,
                w: TILESIZE,
                h: TILESIZE
            }
            col = colCheck(this, generatedSquare);
            this.x += (this.col.L - this.col.R) / 5 / DTR;
            this.y += (this.col.T - this.col.B) / 5 / DTR;
        }
        if (getTileData(this.x + this.w, this.y + this.h).unpassable) {
            generatedSquare = {
                x: ((this.x + this.w) / TILESIZE | 0) * TILESIZE,
                y: ((this.y + this.h) / TILESIZE | 0) * TILESIZE,
                w: TILESIZE,
                h: TILESIZE
            }
            col = colCheck(this, generatedSquare);
            this.x += (this.col.L - this.col.R) / 5 / DTR;
            this.y += (this.col.T - this.col.B) / 5 / DTR;
        }
        if (this.col.B) {
            if (this.yVelExt > 0) {
                this.yVelExt *= -0.5;
            }
        }
        if (this.col.T) {
            if (this.yVelExt < 0) {
                this.yVelExt *= -0.5;
            }
        }
        if (this.col.R) {
            if (this.xVelExt > 0) {
                this.xVelExt *= -0.5;
            }
        }
        if (this.col.L) {
            if (this.xVelExt < 0) {
                this.xVelExt *= -0.5;
            }
        }

    }
}


class Player extends Collidable {
    constructor(x, y) {
        super(Collidable);
        this.x = x;
        this.y = y;
        this.w = TILESIZE;
        this.h = TILESIZE;
        this.speed = 3;
        this.yVel = 0;
        this.xVel = 0;
        this.yVelExt = 0;
        this.xVelExt = 0;
        this.L = false;
        this.R = false;
        this.T = false;
        this.B = false;
        this.arrowSpeed = 10;
        this.centerX = 0;
        this.centerY = 0;
        this.col = {
            T: 0,
            B: 0,
            L: 0,
            R: 0
        }
        this.actionX = [0, 32, 64];
        this.actionY = [0, 0, 0];
        this.action = 0;
        this.frameCounter = 0;
        this.slowness = 6;
        this.radians = 0;
        this.sword = false;
        this.precision = 20;
        this.noArrows = 0;
        this.attacked = 0;
        this.arrowsArr = [1, 1, 1, 1, 1];
        this.arrowCD = 60; // expressed in frames
        this.arrowCounter = 0; //counts to @arrowCD
        this.arrowsCount = 4; //number of arrows the player holds
        //Stats
        this.hp = 100;
        this.maxHp = 100;
        this.mp = 100;
        this.maxMp = 100;
        this.critChance = 0.25;
        // Bow variables
        this.bow = {
            active: false,
            radians: 0,
            actionX: [192, 240, 288, 336, 384],
            actionY: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            frameCounter: 0,
            action: 0,
            slowness: 4,
            w: 48,
            h: 48
        }
    }

    computeQuiver() {
        let full = true;
        let i;
        for (i = 0; i < this.arrowsArr.length; i++) {
            if (this.arrowsArr[i] === 0) {
                full = false;
                break;
            }
        }
        this.arrowsCount = i;

        if (!full) {
            this.arrowCounter++;
            if (this.arrowCounter > this.arrowCD * DTR) {
                for (i = 0; i < this.arrowsArr.length; i++) {
                    if (this.arrowsArr[i] === 0) {
                        if (Math.random() < this.critChance) {
                            this.arrowsArr[i] = 2;
                        } else {
                            this.arrowsArr[i] = 1;
                        }
                        this.arrowCounter = 0;
                        break;
                    }
                }
            }
        } else {
            this.arrowCounter = 0;
        }
    }
    compute() {
        this.computeQuiver();

        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;
        this.checkCollisions();

        if (Math.abs(this.xVelExt) > 0.01) {
            this.xVelExt -= this.xVelExt * 0.10 / DTR;
        } else {
            this.xVelExt = 0;
        }
        if (Math.abs(this.yVelExt) > 0.01) {
            this.yVelExt -= this.yVelExt * 0.10 / DTR;
        } else {
            this.yVelExt = 0;
        }

        if (this.L && this.T || this.L && this.B || this.R && this.T || this.R && this.B) {
            this.speed = 2;
        } else {
            this.speed = 3;
        }
        this.radians = Math.atan2(Mouse.y - this.y - (this.h / 2), Mouse.x - (this.w / 2) - this.x) + Math.PI / 2;
        if (this.L) {
            this.xVel = -this.speed;
        } else if (!this.R) {
            this.xVel = 0;
        }

        if (this.R) {
            this.xVel = this.speed;
        } else if (!this.L) {
            this.xVel = 0;
        }

        if (this.T) {
            this.yVel = -this.speed;
        } else if (!this.B) {
            this.yVel = 0;
        }

        if (this.B) {
            this.yVel = this.speed;
        } else if (!this.T) {
            this.yVel = 0;
        }
        this.x += (this.xVel + this.xVelExt) / DTR;
        this.y += (this.yVel + this.yVelExt) / DTR;
    }

    draw() {
        if (this.xVel === 0 && this.yVel === 0) {
            this.action = 0;
        } else {
            this.frameCounter++;
            if (this.frameCounter >= this.slowness * DTR) {
                this.action++;
                this.frameCounter = 0;
                if (this.action >= this.actionX.length) {
                    this.action = 0;
                }
            }
        }
        c.save();
        c.translate(this.x + this.w / 2 + map.x, this.y + this.h / 2 + map.y);
        c.rotate(this.radians);
        c.drawImage(
            id("player"),
            this.actionX[this.action],
            this.actionY[this.action],
            TILESIZE,
            TILESIZE,
            -this.w / 2,
            -this.h / 2,
            this.w,
            this.h);
        c.restore();

        if (this.noArrows) {
            c.drawImage(
                id("sheet"),
                64,
                128,
                16,
                16,
                this.x + 8 + map.x,
                this.y - 16 + map.y,
                16,
                16);
            this.noArrows--;
        }
        if (this.bow.active) {
            this.drawBow();
        }
    }
    drawBow() {
        this.bow.frameCounter++;
        if (this.bow.frameCounter >= this.bow.slowness * DTR) {
            this.bow.action++;
            this.bow.frameCounter = 0;
            if (this.bow.active >= this.bow.actionX.length) {
                this.bow.active = false;
            }
        }
        c.save();
        c.translate(this.x + this.w / 2 + map.x, this.y + this.h / 2 + map.y);
        c.rotate(this.radians);
        c.drawImage(
            id("bow"),
            this.bow.actionX[this.bow.action],
            this.bow.actionY[this.bow.action],
            48,
            48,
            -this.bow.w / 2,
            -this.bow.h,
            this.bow.w,
            this.bow.h);
        c.restore();
    }
    shoot() {
        this.bow.active = true;
        this.bow.frameCounter = 0;
        this.bow.currentFrame = 0;
        this.bow.action = 0;
        let centerX = this.x + this.w / 2;
        let centerY = this.y + this.h / 2;
        let deltaX = Mouse.x - centerX + Math.random() * this.precision - this.precision / 2;
        let deltaY = Mouse.y - centerY + Math.random() * this.precision - this.precision / 2;
        let rotation = Math.atan2(deltaY, deltaX);
        let xtarget = Math.cos(rotation);
        let ytarget = Math.sin(rotation);

        let arrow = new Projectile;
        arrow.xVel = xtarget * this.arrowSpeed;
        arrow.yVel = ytarget * this.arrowSpeed;
        arrow.x = centerX;
        arrow.y = centerY;
        arrow.color = this.arrowsArr[0];
        playerArrows.push(arrow);
        this.arrowsArr.shift();
        this.arrowsArr.push(0);
    }
    attack() {
        if (!sword.active) {
            sword.active = true;
            sword.radiansP = this.radians;
            if (Mouse.x < this.x - 16 || Mouse.x > this.x + this.w + 16 ||
                Mouse.y < this.y - 16 || Mouse.y > this.y + this.h + 16) {
                let centerX = this.x + this.w / 2;
                let centerY = this.y + this.h / 2;
                let cosine = returnCosine(Mouse.x, Mouse.y, centerX, centerY)
                this.xVelExt = cosine.cos * 14;
                this.yVelExt = cosine.sin * 14;
            }

        }
    }
}
var player = new Player(CANVAS.width / 2, CANVAS.height / 4 * 3);


class UserInterface {
    constructor() {
        this.sheet = id("ui-sheet");
        this.x = 20;
        this.y = 5;
        this.lClick = false;
        this.rClick = false;
        this.attacked = 0;
        this.layout = {
            crop: {
                x: 0,
                y: 0,
                w: 324,
                h: 53
            },
            pos: {
                x: 0,
                y: 0,
            }
        }
        this.portrait = {
            crop: [{
                x: 0,
                y: 64,
                w: 53,
                h: 53
            }, {
                x: 64,
                y: 64,
                w: 53,
                h: 53
            }, ],
            pos: {
                x: 138,
                y: 0,
            }
        }
        this.hpBar = {
            crop: {
                x: 128,
                y: 64,
                w: 101,
                h: 11
            },
            pos: {
                x: 215,
                y: 10
            }
        }
        this.mpBar = {
            crop: {
                x: 128,
                y: 80,
                w: 101,
                h: 11
            },
            pos: {
                x: 215,
                y: 23
            }
        }
        this.bow = {
            crop: {
                x: 240,
                y: 64,
                w: 60,
                h: 61
            },
            pos: {
                x: 666,
                y: 14
            }
        }
        this.sword = {
            crop: {
                x: 304,
                y: 64,
                w: 60,
                h: 61
            },
            pos: {
                x: 666,
                y: 86
            }
        }
        this.arrow = {
            crop: [{
                x: 128,
                y: 96,
                w: 6,
                h: 21
            }, {
                x: 144,
                y: 96,
                w: 6,
                h: 21
            }, {
                x: 160,
                y: 96,
                w: 6,
                h: 21
            }],
            pos: {
                x: 99,
                y: 12
            }
        }
        this.arrowsArr = [1, 1, 1, 1];
    }
    draw() {


        //sword icon
        if (this.lClick) {
            c.globalAlpha = 0.5;
        }
        c.drawImage(
            this.sheet,
            this.bow.crop.x,
            this.bow.crop.y,
            this.bow.crop.w,
            this.bow.crop.h,
            this.bow.pos.x,
            this.bow.pos.y,
            this.bow.crop.w,
            this.bow.crop.h,
        )
        if (this.lClick) {
            c.globalAlpha = 1;
        }
        //bow icon
        if (this.rClick) {
            c.globalAlpha = 0.5;
        }
        c.drawImage(
            this.sheet,
            this.sword.crop.x,
            this.sword.crop.y,
            this.sword.crop.w,
            this.sword.crop.h,
            this.sword.pos.x,
            this.sword.pos.y,
            this.sword.crop.w,
            this.sword.crop.h,
        )
        if (this.rClick) {
            c.globalAlpha = 1;
        }


        //layout
        c.drawImage(
            this.sheet,
            this.layout.crop.x,
            this.layout.crop.y,
            this.layout.crop.w,
            this.layout.crop.h,
            this.layout.pos.x + this.x,
            this.layout.pos.y + this.y,
            this.layout.crop.w,
            this.layout.crop.h,
        )
        //portrait
        c.drawImage(
            this.sheet,
            this.portrait.crop[player.attacked].x,
            this.portrait.crop[player.attacked].y,
            this.portrait.crop[player.attacked].w,
            this.portrait.crop[player.attacked].h,
            this.portrait.pos.x + this.x,
            this.portrait.pos.y + this.y,
            this.portrait.crop[player.attacked].w,
            this.portrait.crop[player.attacked].h,
        )
        //hpBar
        c.drawImage(
            this.sheet,
            this.hpBar.crop.x,
            this.hpBar.crop.y,
            this.hpBar.crop.w,
            this.hpBar.crop.h,
            this.hpBar.pos.x + this.x,
            this.hpBar.pos.y + this.y,
            this.hpBar.crop.w / player.maxHp * player.hp,
            this.hpBar.crop.h,
        )
        //mpBar
        c.drawImage(
            this.sheet,
            this.mpBar.crop.x,
            this.mpBar.crop.y,
            this.mpBar.crop.w,
            this.mpBar.crop.h,
            this.mpBar.pos.x + this.x,
            this.mpBar.pos.y + this.y,
            this.mpBar.crop.w,
            this.mpBar.crop.h,
        )
        for (let i = 0; i < player.arrowsArr.length; i++) {
            c.drawImage(
                this.sheet,
                this.arrow.crop[player.arrowsArr[i]].x,
                this.arrow.crop[player.arrowsArr[i]].y,
                this.arrow.crop[player.arrowsArr[i]].w,
                this.arrow.crop[player.arrowsArr[i]].h,
                this.arrow.pos.x + this.x - (10 * i),
                this.arrow.pos.y + this.y,
                this.arrow.crop[player.arrowsArr[i]].w,
                this.arrow.crop[player.arrowsArr[i]].h,
            )
        }

        c.font = "14px Arial";
        c.textAlign = "center";
        c.fillStyle = "#2f4447";
        c.fillText(
            player.arrowsCount + "/" + player.arrowsArr.length,
            122 + this.x,
            32 + this.y);

    }
}
var userInterface = new UserInterface();


function drawLaser() {
    let x1 = player.x + player.w / 2,
        y1 = player.y + player.h / 2;

    let x2 = x1,
        y2 = y1;
    let collisionFound = false;
    let counter = 0;

    let cosine = returnCosine(x1, y1, Mouse.x, Mouse.y);
    let segments = []
    let temp = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,

    }
    let colItem = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
    let step = 4;
    let point = {
        x: 0,
        y: 0
    };
    while (!collisionFound && counter < (CANVAS.width * 2 / step)) {

        x2 -= cosine.cos * step;
        y2 -= cosine.sin * step;
        if (getTileData(x2, y2).solid) {
            temp = getTileData(x2, y2).hitbox;
            colItem.x = temp.x;
            colItem.y = temp.y;
            colItem.w = temp.w;
            colItem.h = temp.h;
            colItem.x += x2 - (x2 % TILESIZE);
            colItem.y += y2 - (y2 % TILESIZE);
            collisionFound = true;
        }
        point.x = x2;
        point.y = y2;
        for (let i = 0; i < monsters.length; i++) {
            if (!monsters[i].dead && pointSquareCol(point, monsters[i])) {
                colItem.x = monsters[i].x;
                colItem.y = monsters[i].y;
                colItem.w = monsters[i].w;
                colItem.h = monsters[i].h;
                collisionFound = true;
                break;
            }

        }
        counter++;
    }
    segments = getRectSides(colItem);
    let points = [];
    let temp2 = {},
        temp3;
    for (let i = 0; i < segments.length; i++) {
        temp2 = intersect(x1, y1, x2, y2, segments[i].x1, segments[i].y1, segments[i].x2, segments[i].y2);
        if (temp2) {
            points.push(temp2);
        }
    }

    let d = Math.hypot((x1 - x2), (y1 - y2)),
        x3 = x2,
        y3 = x2;
    for (let i = 0; i < points.length; i++) {
        temp3 = Math.hypot((x1 - x2), (y1 - y2))

        if (temp3 < d) {
            d = temp3;
            x3 = points[i].x;
            y3 = points[i].y;
        }
    }




    c.strokeStyle = "#ff0000";
    c.beginPath();
    c.moveTo(x1 + map.x, y1 + map.y);
    c.lineTo(x2 + map.x, y2 + map.y);
    c.stroke();
    c.strokeStyle = "black";
}

function isObstructed(obj1, obj2) {

    let x1 = obj1.x + obj1.w / 2,
        y1 = obj1.y + obj1.h / 2;

    let xTarget = obj2.x + obj2.w / 2;
    let yTarget = obj2.y + obj2.h / 2;
    let distance = Math.hypot(x1 - xTarget, y1 - yTarget);

    let x2 = x1,
        y2 = y1;
    let collisionFound = false;
    let counter = 0;

    let cosine = returnCosine(x1, y1, xTarget, yTarget);
    let segments = []
    let temp = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,

    }
    let colItem = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
    let step = 3;
    let point = {
        x: 0,
        y: 0
    };
    while (!collisionFound && counter < (distance / step)) {
        x2 -= cosine.cos * step;
        y2 -= cosine.sin * step;
        if (getTileData(x2, y2).solid) {
            temp = getTileData(x2, y2).hitbox;
            colItem.x = temp.x;
            colItem.y = temp.y;
            colItem.w = temp.w;
            colItem.h = temp.h;
            colItem.x += x2 - (x2 % TILESIZE);
            colItem.y += y2 - (y2 % TILESIZE);
            return true;
        }
        point.x = x2;
        point.y = y2;
        if (pointSquareCol(point, obj2)) {
            return false;
        }
        counter++;
    }
}

function getRectSides(rect) {
    let sides = [];

    sides.push({
        x1: rect.x,
        y1: rect.y,
        x2: rect.x + rect.w,
        y2: rect.y
    })
    sides.push({
        x1: rect.x + rect.w,
        y1: rect.y,
        x2: rect.x + rect.w,
        y2: rect.y + rect.h
    })
    sides.push({
        x1: rect.x + rect.w,
        y1: rect.y + rect.h,
        x2: rect.x,
        y2: rect.y + rect.h
    })
    sides.push({
        x1: rect.x,
        y1: rect.y + rect.h,
        x2: rect.x,
        y2: rect.y
    })


    return sides;
}



function init() {
    let unrefinedTilesData;
    let temp = {};

    fetch("./Archer.json").then(function (response) {
        return response.json();
    }).then(function (data) {
        unrefinedTilesData = data.tiles;


        for (let i = 0; i < unrefinedTilesData.length; i++) {
            temp = {
                id: 0,
                solid: false,
                hole: false,
                unpassable: false,
                hitbox: {
                    x: 0,
                    y: 0,
                    w: TILESIZE,
                    h: TILESIZE
                }
            };
            temp.id = unrefinedTilesData[i].id
            if (unrefinedTilesData[i].hasOwnProperty("properties")) {

                for (let j = 0; j < unrefinedTilesData[i].properties.length; j++) {
                    if (unrefinedTilesData[i].properties[j]) {
                        switch (unrefinedTilesData[i].properties[j].name) {
                            case "hole":
                                temp.hole = true;
                                temp.unpassable = true;
                                break;
                            case "solid":
                                temp.solid = true;
                                temp.unpassable = true;
                                break;
                        }
                    }
                }

            }
            TilesData.push(temp);
        }

        loop();

    })


}
init();

var HP_BAR = id("hp-bar");

function renderHpBars() {
    for (let i = 0; i < monsters.length; i++) {
        if (monsters[i].dead) {
            continue;
        }
        let hpRatio = monsters[i].hp / monsters[i].maxHp;
        let barW = Math.round(TILESIZE * hpRatio);
        c.drawImage(
            HP_BAR,
            0,
            4,
            barW,
            4,
            (monsters[i].x + monsters[i].w / 2 - 16 + map.x) | 0,
            (monsters[i].y - 8 + map.y) | 0,
            barW | 0,
            4 | 0
        );
        c.drawImage(
            HP_BAR,
            0,
            0,
            TILESIZE,
            4,
            (monsters[i].x + monsters[i].w / 2 - 16 + map.x) | 0,
            (monsters[i].y - 8 + map.y) | 0,
            TILESIZE | 0,
            4 | 0
        );
    }
}
class Map {
    constructor() {
        this.width = 23;
        this.height = 15;
        this.x = 0;
        this.y = 0;
        this.tiles = maps.m1;
        this.sheet = id("sheet");
        this.grass = id("grass");
    }
    draw() {

        for (let i = 0; i < this.tiles.length; i++) {
            if (i == 1) {
                c.drawImage(
                    this.grass,
                    0 + this.x,
                    0 + this.y,
                    CANVAS.width,
                    CANVAS.height
                )
            }
            for (let j = 0; j < this.tiles[i].length; j++) {
                if (this.tiles[i][j] === 0) {
                    continue;
                }
                c.drawImage(
                    this.sheet,
                    (this.tiles[i][j] - 1) % 15 * TILESIZE,
                    ((this.tiles[i][j] - 1) / 15 | 0) * TILESIZE,
                    TILESIZE,
                    TILESIZE,
                    (j % this.width) * TILESIZE + map.x,
                    (j / this.width | 0) * TILESIZE + map.y,
                    TILESIZE,
                    TILESIZE
                )

            }
        }


    }
}
var map = new Map();


class Sword {
    constructor() {
        this.x = player.x;
        this.y = player.y;
        this.w = 16;
        this.h = 48;
        this.r = 50;
        this.radians = 2;
        this.radiansP = 0;
        this.actionX = [0];
        this.actionY = [0];
        this.vfxX = [0, 0, 0, 0];
        this.vfxY = [0, 128, 256, 384];
        this.currentFrame = 0;

        this.frameCounter = 0;
        this.action = 0;
        this.slowness = 3;
        this.active = false;
        this.sheet = id("sword-vfx");
        this.swordImg = id("sword");
    }
    compute() {
        this.x = player.x + player.w / 2;
        this.y = player.y + player.h / 2;
        let mx, my, mr;
        for (let i = 0; i < monsters.length; i++) {
            if (monsters[i].dead || !monsters[i].collidable) {
                continue;
            }
            mx = monsters[i].hitbox.x + monsters[i].hitbox.w / 2;
            my = monsters[i].hitbox.y + monsters[i].hitbox.h / 2;
            mr = (monsters[i].w + monsters[i].h) / 2 * 0.5;
            if (circleCollision(this.x, this.y, this.r, mx, my, mr)) {

                let centerX = this.x + this.w / 2;
                let centerY = this.y + this.h / 2;
                let deltaX = monsters[i].x - centerX;
                let deltaY = monsters[i].y - centerY;
                let rotation = Math.atan2(deltaY, deltaX);
                let xtarget = Math.cos(rotation);
                let ytarget = Math.sin(rotation);

                monsters[i].xVelExt = xtarget * 10;
                monsters[i].yVelExt = ytarget * 10;
                monsters[i].hp -= 0.25;
                monsters[i].justDamaged = 15;
            }

        }
    }
    draw() {
        this.frameCounter++;
        if (this.frameCounter > this.slowness * DTR) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.vfxX.length) {

                this.currentFrame = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.vfxX[this.currentFrame],
            this.vfxY[this.currentFrame],
            128,
            64,
            this.x - 64 - player.xVelExt * 4 + map.x,
            this.y - 64 - player.yVelExt * 4 + map.y,
            128,
            64);



        c.save();
        c.translate(player.x + player.w / 2 + map.x, player.y + player.h / 2 + map.y);
        c.rotate(this.radiansP + this.radians);
        c.drawImage(
            this.swordImg,
            this.actionX[this.action],
            this.actionY[this.action],
            this.w,
            this.h,
            -this.w / 2,
            -this.h / 2 - player.h,
            this.w,
            this.h);
        c.restore();
        this.radians -= 0.5 / DTR;
        if (this.radians <= -9) {
            this.active = false;
            this.radians = 2;
        }


        c.drawImage(
            this.sheet,
            this.vfxX[this.currentFrame],
            this.vfxY[this.currentFrame] + 64,
            128,
            64,
            this.x - 64 - player.xVelExt * 4 + map.x,
            this.y - player.yVelExt * 4 + map.y,
            128,
            64);



    }
}
var sword = new Sword()


function sortMonsters() {
    monsters.sort(function (a, b) {
        if (a.dead && !b.dead) {
            return -1;
        } else if (!a.dead && b.dead) {
            return 1;
        } else {
            return a.y + 15 - b.y;
        }
    })
}

function adjustCollidingMonsters() {
    for (let j = 0; j < monsters.length; j++) {
        if (monsters[j].dead) {
            continue;
        }
        monsters[j].col.T = 0;
        monsters[j].col.B = 0;
        monsters[j].col.L = 0;
        monsters[j].col.R = 0;
        for (let i = 0; i < monsters.length; i++) {
            if (monsters[i].dead) {
                continue;
            }
            if (collided(monsters[j], monsters[i])) {
                let col = colCheck(monsters[j], monsters[i]);
                switch (col) {
                    case "l":
                        if (this.xVel < 0) {
                            this.xVel = 0;
                        }
                        break;
                    case "r":
                        if (this.xVel > 0) {
                            this.xVel = 0;
                        }

                        break;
                    case "b":
                        if (this.yVel > 0) {
                            this.yVel = 0;
                        }
                        break;
                    case "t":
                        if (this.yVel < 0) {
                            this.yVel = 0;
                        }
                        break;
                }
                monsters[j].xVel += (monsters[j].col.L - monsters[j].col.R) / 5;
                monsters[j].yVel += (monsters[j].col.T - monsters[j].col.B) / 5;

            }
        }
    }
}

class Monster extends Collidable {
    constructor(x, y) {
        super(Collidable);
        this.x = x;
        this.y = y;
        this.w = TILESIZE;
        this.h = TILESIZE;
        this.xVel = 0;
        this.yVel = 0;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.speed = 2;
        this.left = 0;
        this.justDied = false;
        this.justDamaged = 0;
        this.dead = false;
        this.arrows = [];
        this.maxHp = 3;
        this.hp = 3;
        this.frameCounter = 0;
        this.slowness = 4;
        this.currentFrame = 0;
        this.collidable = true;
        this.sheet = id("sheet")
        this.action = 0;
        this.col = {
            T: 0,
            B: 0,
            L: 0,
            R: 0
        }
        this.hitbox = {
            x: 0,
            y: 0,
            w: 19,
            h: 17
        }
        this.actionX = [[3, 3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5], [3, 3, 3, 3], [3]];
        this.actionY = [[6, 7, 8, 9], [6, 7, 8, 9], [6, 7, 8, 9], [9, 8, 7, 6], [9]];
    }
    followPlayer() {
        if (this.action !== 0) {
            let playerDistX = this.x + this.w / 2 - player.x - player.w / 2;
            let playerDistY = this.y + this.h / 2 - player.y - player.h / 2;
            let left = playerDistX > 0 ? -1 : 1;
            let up = playerDistY > 0 ? -1 : 1;
            let ratioXY;
            if (playerDistY !== 0) {
                ratioXY = Math.abs(playerDistX) / (Math.abs(playerDistY) + Math.abs(playerDistX));
            } else {
                ratioXY = 0;
            }

            this.xVel = this.speed * ratioXY * left;
            this.yVel = this.speed * (1 - ratioXY) * up;
            if (this.x + this.w < player.x) {
                this.left = false;
            } else if (player.x + player.w < this.x) {
                this.left = true;
            }

        }
    }
    compute() {
        if (!this.dead) {
            this.followPlayer()
            if (Math.abs(this.xVelExt) > 0.01) {
                this.xVelExt *= 0.90;
            } else {
                this.xVelExt = 0;
            }
            if (Math.abs(this.yVelExt) > 0.01) {
                this.yVelExt *= 0.90;
            } else {
                this.yVelExt = 0;
            }
            if (this.col.T && this.yVel < 0 ||
                this.col.B && this.yVel > 0) {
                this.yVel = 0;
            }
            if (this.col.L && this.xVel < 0 ||
                this.col.R && this.xVel > 0) {
                this.xVel = 0;
            }
            if (this.action !== 0) {
                if (this.left) {
                    this.action = 2;
                } else {
                    this.action = 1;
                }
            }

            this.checkCollisions();


            //error here
            this.x += (this.xVel + this.xVelExt) / DTR;
            this.y += (this.yVel + this.yVelExt) / DTR;

            for (let i = 0; i < this.arrows.length; i++) {
                this.arrows[i].x = this.x + this.arrows[i].xRel;
                this.arrows[i].y = this.y + this.arrows[i].yRel;
            }
            this.hitbox.x = this.x + 6;
            this.hitbox.y = this.y + 4;
            if (this.hp <= 0) {
                this.justDied = true;
            }
            if (this.justDied) {
                this.justDamaged = 0;
                this.dead = true;
                this.action = 3;
                this.frameCounter = 0;
                this.currentFrame = 0;
                this.slowness = 10
            }
        }
    }
    draw() {
        this.frameCounter++;
        if (this.frameCounter > this.slowness * DTR) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.actionX[this.action].length) {
                if (this.action == 0) {
                    this.action = 1 + this.left;
                }
                this.currentFrame = 0;
            }
        }
        if (this.action == 3) {
            if (this.currentFrame == this.actionX[this.action].length - 1) {
                this.frameCounter = 0;
            }
        }
        if (!this.dead)
            for (let i = 0; i < this.arrows.length; i++) {
                this.arrows[i].draw();
            }

        if (this.justDamaged > 0) {
            this.action = 4;
            this.currentFrame = 0;
            this.framecounter = 0;
            this.justDamaged -= 1 / DTR;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.currentFrame] * TILESIZE,
            this.actionY[this.action][this.currentFrame] * TILESIZE,
            this.w,
            this.h,
            this.x + map.x | 0,
            this.y + map.y | 0,
            this.w,
            this.h
        )
    }
}

class Mole extends Collidable {
    constructor(x, y) {
        super(Collidable);
        this.x = (x / TILESIZE | 0) * TILESIZE;
        this.y = (y / TILESIZE | 0) * TILESIZE;
        this.w = TILESIZE;
        this.h = TILESIZE;
        this.xVel = 0;
        this.yVel = 0;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.speed = 2;
        this.left = 0;
        this.justDied = false;
        this.justDamaged = 0;
        this.dead = false;
        this.attacking = false;
        this.arrows = [];
        this.maxHp = 3;
        this.hp = 3;
        this.frameCounter = 0;
        this.slowness = 4;
        this.currentFrame = 0;
        this.sheet = id("sheet")
        this.action = 0;
        this.collidable = true;
        this.path = [];
        this.col = {
            T: 0,
            B: 0,
            L: 0,
            R: 0
        }
        this.hitbox = {
            x: 0,
            y: 0,
            w: 14,
            h: 26
        }
        this.atkBox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
        /*
        
        0 - Idle
        1 - dive
        2 - emerge
        3 - death
        4 - erupt
        
        */
        this.actionX = [[9, 9, 9, 9], [10, 10, 10, 10, 11, 11, 11, 11], [12, 12, 12, 12], [13, 13, 13, 13], [14, 14, 14, 14, 14]];
        this.actionY = [[20, 21, 22, 23], [20, 21, 22, 23, 20, 21, 22, 23], [20, 21, 22, 23], [20, 21, 22, 23], [20, 21, 22, 23, 24]];
        this.counter = 0;
    }
    followPlayer() {
        // collision box that search for the player
        this.atkBox.x = this.x - 5 * TILESIZE;
        this.atkBox.y = this.y - 5 * TILESIZE;
        this.atkBox.w = 11 * TILESIZE;
        this.atkBox.h = 11 * TILESIZE;
        // if player is near
        if (collided(this.atkBox, player)) {

            // if it is attacking and the current frame of the explosion is the last, move
            if (this.attacking) {
                if (this.currentFrame == 0 && this.frameCounter == 0) {
                    this.createGrid()
                    switch (this.path[0]) {
                        case 'l':
                            this.x -= TILESIZE;
                            break;
                        case 'r':
                            this.x += TILESIZE;
                            break;
                        case 't':
                            this.y -= TILESIZE;
                            break;
                        case 'b':
                            this.y += TILESIZE;
                            break;
                    }
                }
                //otherwise if it not attacking go attack mode
            } else if (this.action !== 1) {
                this.action = 1;
                this.currentFrame = 0;
                this.frameCounter = 0;
            }
        } else {
            if (this.attacking && this.action !== 0 && this.action !== 2) {
                this.attacking = false;
                this.collidable = true;
                this.action = 2;
                this.currentFrame = 0;
                this.frameCounter = 0;
            }
        }
    }
    compute() {
        this.followPlayer()
        this.hitbox.x = this.x + (this.w - 14) / 2;
        this.hitbox.y = this.y + (this.h - 26) / 2;

        for (let i = 0; i < this.arrows.length; i++) {
            this.arrows[i].x = this.x + this.arrows[i].xRel;
            this.arrows[i].y = this.y + this.arrows[i].yRel;
        }
        if (this.hp <= 0) {
            this.justDied = true;
        }
        if (this.justDied) {
            this.justDamaged = 0;
            this.dead = true;
            this.action = 3;
            this.frameCounter = 0;
            this.currentFrame = 0;
            this.slowness = 10
        }
    }
    draw() {
        this.frameCounter++;
        if (this.action == 4) {
            this.slowness = 3;
        } else {
            this.slowness = 5;
        }
        if (this.frameCounter > this.slowness * DTR) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.actionX[this.action].length) {
                if (this.dead) {
                    this.currentFrame = this.actionX[this.action].length - 1;
                } else if (this.action == 1) {
                    this.attacking = true;
                    this.collidable = false;
                    this.action = 4;
                    this.currentFrame = 0;
                } else if (this.action == 2) {
                    this.action = 0;
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = 0;
                }
            }
        }


        if (!this.dead) {
            if (this.action == 0) {
                for (let i = 0; i < this.arrows.length; i++) {
                    this.arrows[i].draw();
                }
            }

        }


        if (this.justDamaged > 0) {
            this.action = 3;
            this.currentFrame = 0;
            this.framecounter = 0;
            this.justDamaged -= 1 / DTR;
            if (this.justDamaged <= 0) {
                this.action = 0;
            }
        }

        //draw body
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.currentFrame] * TILESIZE,
            this.actionY[this.action][this.currentFrame] * TILESIZE,
            this.w,
            this.h,
            this.x + map.x | 0,
            this.y + map.y | 0,
            this.w,
            this.h
        )
        /*
        c.rect(
            this.atkBox.x + map.x,
            this.atkBox.y + map.y,
            this.atkBox.w,
            this.atkBox.h)
        c.closePath()
        c.stroke();
        */
    }
    // monsters[0].createGrid()
    createGrid() {
        let gridSize = 11;
        let grid = [];
        let startX = this.x + this.w / 2 - TILESIZE * 5;
        let startY = this.y + this.h / 2 - TILESIZE * 5;
        let tileData;
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                tileData = getTileData(startX + i * TILESIZE, startY + j * TILESIZE);
                if (tileData === false) {
                    grid[i][j] = 'Empty';
                } else {
                    grid[i][j] = 'Obstacle';
                }
            }
        }
        grid[5][5] = 'Start';
        grid[((player.x - this.x) / TILESIZE | 0) + 5][((player.y - this.y) / TILESIZE | 0) + 5] = 'Goal';
        this.path = findShortestPath([5, 5], grid);

    }
}


class Flower extends Collidable {
    constructor(x, y) {
        super(Collidable);
        this.x = x;
        this.y = y;
        this.w = TILESIZE;
        this.h = TILESIZE;
        this.xVel = 0;
        this.yVel = 0;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.speed = 2;
        this.left = 0;
        this.justDied = false;
        this.justDamaged = 0;
        this.dead = false;
        this.arrows = [];
        this.maxHp = 3;
        this.hp = 3;
        this.frameCounter = 0;
        this.slowness = 8;
        this.attacking = false;
        this.currentFrame = 0;
        this.sheet = id("sheet")
        this.precision = 5;
        this.projSpeed = 8;
        this.collidable = true;
        this.col = {
            T: 0,
            B: 0,
            L: 0,
            R: 0
        }
        this.hitbox = {
            x: 0,
            y: 0,
            w: this.w / 3,
            h: this.h - this.h / 5 * 2
        }
        this.action = 0;
        this.actionX = [[5, 5, 5, 5], [5, 5, 5, 5], [8, 8, 8, 8]];
        this.actionY = [[20, 21, 22, 23], [20, 20, 21, 22], [20, 21, 22, 23]];
        this.headX = [[7, 7, 7, 7], [6, 6, 6, 6]];
        this.headY = [[20, 21, 22, 23], [20, 21, 22, 23]];
        this.radians = 0;
        this.justShot = false;
    }
    //shoots a projectile in direction of the player
    shoot() {
        if (!isObstructed(this, player)) {
            this.attacking = true;
            if (this.currentFrame == 2) {
                if (!this.justShot) {
                    let projectile = new EnemyProjectile()
                    let centerX = this.x + this.w / 2;
                    let centerY = this.y + this.h / 2;
                    let deltaX = player.x + player.w / 2 - centerX + Math.random() * this.precision - this.precision / 2;
                    let deltaY = player.y + player.h / 2 - centerY + Math.random() * this.precision - this.precision / 2;
                    let rotation = Math.atan2(deltaY, deltaX);
                    let xtarget = Math.cos(rotation);
                    let ytarget = Math.sin(rotation);

                    projectile.xVel = xtarget * this.projSpeed;
                    projectile.yVel = ytarget * this.projSpeed;
                    projectile.x = centerX;
                    projectile.y = centerY;
                    enemyProjectiles.push(projectile);
                    this.justShot = true;
                }
            } else {
                this.justShot = false;
            }
        } else {
            this.attacking = false;
        }
    }
    compute() {
        this.shoot();
        this.hitbox.x = this.x + this.w / 3;
        this.hitbox.y = this.y + this.h / 5;
        this.radians = Math.atan2(player.y + player.h / 2 - this.y - (this.h / 2), player.x + player.w / 2 - (this.w / 2) - this.x) + Math.PI / 2;

        for (let i = 0; i < this.arrows.length; i++) {
            this.arrows[i].x = this.x + this.arrows[i].xRel;
            this.arrows[i].y = this.y + this.arrows[i].yRel;
        }
        if (this.hp <= 0) {
            this.justDied = true;
        }
        if (this.justDied) {
            this.justDamaged = 0;
            this.dead = true;
            this.action = 2;
            this.frameCounter = 0;
            this.currentFrame = 0;
            this.slowness = 10
        }

    }
    draw() {

        this.frameCounter++;
        if (this.frameCounter > this.slowness * DTR) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.actionX[this.action].length) {
                if (this.dead) {
                    this.currentFrame = this.actionX[this.action].length - 1;
                } else {
                    this.currentFrame = 0;
                }
            }
        }



        if (!this.dead) {
            this.attacking ? this.action = 1 : this.action = 0;
            for (let i = 0; i < this.arrows.length; i++) {
                this.arrows[i].draw();
            }

        }
        if (this.attacking) {
            this.slowness = 4;
        } else {
            this.slowness = 8
        }
        if (this.justDamaged) {
            this.action = 2;
            this.currentFrame = 0;
            this.framecounter = 0;
            this.justDamaged--;
        }




        //draw body
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.currentFrame] * TILESIZE,
            this.actionY[this.action][this.currentFrame] * TILESIZE,
            this.w,
            this.h,
            this.x + map.x | 0,
            this.y + map.y | 0,
            this.w,
            this.h
        )

        //draw head
        if (this.action == 0 || this.action == 1) {
            c.save();
            c.translate(this.x + this.w / 2 + map.x, this.y + this.h / 2 + map.y - 6);
            c.rotate(this.radians);
            c.drawImage(
                this.sheet,
                this.headX[this.action][this.currentFrame] * TILESIZE,
                this.headY[this.action][this.currentFrame] * TILESIZE,
                TILESIZE,
                TILESIZE,
                -this.w / 2,
                -this.h / 2,
                this.w,
                this.h);
            c.restore();
        }
    }
}

function getTileData(x, y) {
    let pos = ((x / TILESIZE) | 0) + ((y / TILESIZE) | 0) * map.width;
    for (let i = 0; i < map.tiles.length; i++) {

        for (let j = 0; j < TilesData.length; j++) {

            if (TilesData[j].id == map.tiles[i][pos] - 1) {
                return TilesData[j];
            }
        }
    }
    return false;
}


window.onclick = function () {
    if (player.arrowsCount !== 0) {
        player.shoot();
    } else {
        player.noArrows = 10;
    }
}
window.oncontextmenu = function (e) {
    e.preventDefault();
    player.attack();
}

document.addEventListener("mousedown", function (evt) {
    switch (evt.button) {
        case 0: //left btn
            userInterface.lClick = true;
            break;
        case 2: //right btn
            userInterface.rClick = true;
            break;
    }
})
document.addEventListener("mouseup", function (evt) {
    switch (evt.button) {
        case 0: //left btn
            userInterface.lClick = false;
            break;
        case 2: //right btn
            userInterface.rClick = false;
            break;
    }
})


//Displays debug stats
var stats = id("stats");

function drawStats() {
    stats.innerHTML = "player.x = " + player.x;
    stats.innerHTML += "<br>player.y = " + player.y;
    stats.innerHTML += "<br>mouseTile.x = " + (Mouse.x / TILESIZE | 0) * TILESIZE;
    stats.innerHTML += "<br>mouseTile.y = " + (Mouse.y / TILESIZE | 0) * TILESIZE;
    stats.innerHTML += "<br>mouseTile pos = " + (((Mouse.x / TILESIZE) | 0) + ((Mouse.y / TILESIZE) | 0) * map.width);
    stats.innerHTML += "<br>mouseTile id = " + map.tiles[1][((Mouse.x / TILESIZE) | 0) + ((Mouse.y / TILESIZE) | 0) * map.width];
    map.tiles[1][((Mouse.x / TILESIZE) | 0) + ((Mouse.y / TILESIZE) | 0) * map.width];


    if (DEBUG) {
        c.rect((Mouse.x / TILESIZE | 0) * TILESIZE + map.x, (Mouse.y / TILESIZE | 0) * TILESIZE + map.y, TILESIZE, TILESIZE)
        c.stroke()
    }

}





// CONTROLS
window.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
        case 65:
            player.L = true;
            break;
        case 68:
            player.R = true;
            break;
        case 87:
            player.T = true;
            break;
        case 83:
            player.B = true;
            break;
        case 49:
            monsters.push(new Mole(Mouse.x - 16, Mouse.y - 16));
            break;
        case 50:
            console.log(getTileData(Mouse.x, Mouse.y))
            break;
        case 51:
            for (let i = 0; i < 50; i++) {
                player.shoot()
                player.arrowCounter = player.arrowCD * DTR;
                player.computeQuiver()
            }
            break;
        case 32:
            if (!gamePaused) {
                gamePaused = true;
            } else {
                gamePaused = false;
            }
            break;
    }
})
window.addEventListener("keyup", function (evt) {
    switch (evt.keyCode) {
        case 65:
            player.L = false;
            break;
        case 68:
            player.R = false;
            break;
        case 87:
            player.T = false;
            break;
        case 83:
            player.B = false;
            break;
    }
})
/*

    Mouse.x = evt.clientX - CANVAS.offsetLeft - map.x+29;
    Mouse.y = evt.clientY - CANVAS.offsetTop - map.y;

*/
window.addEventListener("mousemove", function (evt) {
    mousePP.x = evt.clientX - CANVAS.offsetLeft;
    mousePP.y = evt.clientY - CANVAS.offsetTop;
})

function moveCamera() {

    map.x = -player.x / 3 + CANVAS.width / 6;
    map.y = -player.y / 3 + CANVAS.height / 6;

    if (screenShake.counter) {
        screenShake.counter--;
        screenShake.set();
        map.x += screenShake.x;
        map.y += screenShake.y;
    }
    map.x = map.x | 0;
    map.y = map.y | 0;
    /*
    if (map.x < -player.x + CANVAS.width / 2 - 25 || map.x > -player.x + CANVAS.width / 2) {
        map.x += (-map.x - player.x + CANVAS.width / 2) / 20;
    }
    if (map.y < -player.y + CANVAS.height / 2 - 25 || map.y > -player.y + CANVAS.height / 2) {
        map.y += (-map.y - player.y + CANVAS.height / 2) / 20;
    }
    */


}
var sampleArrow=new Projectile();
function computeDrawArrows() {
    c.lineWidth = 2;
    c.strokeStyle = sampleArrow.colors[0];
    c.beginPath();
    for (let i = playerArrows.length - 1; i >= 0; i--) {
        // Arrows are either flying or stuck on things, compute only if flying
        if (!playerArrows[i].active || playerArrows[i].color != 1) {
            continue;
        }
        if (playerArrows[i].free) {
            playerArrows[i].compute()
        }
        if (playerArrows[i]!==undefined)
            playerArrows[i].draw()
    }
    c.closePath()
    c.stroke();

    c.strokeStyle = sampleArrow.colors[1];
    c.beginPath();
    for (let i = playerArrows.length - 1; i >= 0; i--) {
        // Arrows are either flying or stuck on things, compute only if flying
        if (!playerArrows[i].active || playerArrows[i].color != 2) {
            continue;
        }
        if (playerArrows[i].free) {
            playerArrows[i].compute()
        }
        if (playerArrows[i]!==undefined)
            playerArrows[i].draw()
    }
    c.closePath()
    c.stroke();
}

function loop() {
    fps++; // To compute the fps counter
    c.clearRect(0, 0, CANVAS.width, CANVAS.height); // Clears the canvas
    moveCamera(); // Camera which follows the player
    map.draw(); // Draws the map
    player.compute(); // Computes the player

    // Computes the enemies's projectiles
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        enemyProjectiles[i].compute()
    }

    // Orders Monsters by their y position
    sortMonsters();

    // Process the in-game mouse position according to map offsets
    Mouse.x = mousePP.x - map.x;
    Mouse.y = mousePP.y - map.y;

    // Computes and draws EVERY monster
    for (let i = 0; i < monsters.length; i++) {
        if (!monsters[i].dead) {
            monsters[i].compute();
        }
        monsters[i].draw();
    }

    //drawLaser();

    // Draws the player
    player.draw();

    // Checks collisions between monsters
    adjustCollidingMonsters();

    // Renders monsters' hp bars
    renderHpBars();

    // Computes the player's projectiles
    computeDrawArrows();
    // Draws the enemies's projectiles
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        enemyProjectiles[i].draw()
    }

    // Draws the player's Sword 
    if (sword.active) {
        sword.compute();
        sword.draw();
    }


    // Draws VisualFxs (shooting VFXs)
    for (let i = visualFxs.length - 1; i >= 0; i--) {
        if (!visualFxs[i].ended) {
            visualFxs[i].draw();
        }
    }

    // Draws Interface
    userInterface.draw();

    // Displays Debug stats
    drawStats();
    // If the game is not paused recalls this function
}
var lastUpdate = Date.now();
var myInterval = setInterval(tick, 1000 / 60);
var DTR = 1; //delta time ratio
function tick() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    DTR = (1000 / 60) / dt;
    if (!gamePaused) {
        loop();
    }
}
