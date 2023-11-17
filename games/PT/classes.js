/*
CLASS LIST:

class Interaction

class EventBox

class Bat

class Entity

class Map

class Player

class Aliquam

class PlayerInterface

class Sword

class Skeleton

class TrashMan

class Bombling

class Bomberman

class Bomb  

class BubbleExplosion

class Bubble

class Explosion

class Vfx

class Arrow

class HpDisplay

class Camera

class Boss_1

class VendingMachine

class MainMenu

class SaveIcon

class Sounds

class Portal

class InteractiveSword

TODO:
    implement hp visuals

*/
document.oncontextmenu = function (e) {
    let x = (e.clientX / GLOBAL.tilesize / GLOBAL.ratio - map.x) | 0;
    let y = (e.clientY / GLOBAL.tilesize / GLOBAL.ratio - map.y) | 0;
    //vfxs.push(new Camera(x, y))
    //entities.push(new TrashMan(x, y))
    return false;
}

class AnimatedTile {
    constructor(x, y, size, actionX, actionY, slowness) {
        this.x = x;
        this.y = y;
        this.w = size;
        this.h = size;
        this.sheet = id("sheet");
        // Rendering Variables 
        this.frame = 0;
        this.frameCounter = 0;
        this.baseSlowness = slowness ? slowness : 6;
        this.slowness = this.baseSlowness;
        this.actionX = actionX;
        this.actionY = actionY;
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX.length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.frame] * GLOBAL.tilesize,
            this.actionY[this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
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
        this.recoilAttacker = true;
        this.type = "something";
        this.solid = true;
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
        this.hpDisplay = new HpDisplay(this);

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

class Esther extends Entity {
    constructor(x, y, left) {
        super(x, y);
        esther = this;
        this.strikeable = false;
        this.xVel = 0;
        this.yVel = 0;

        this.solid = false;

        this.type = "esther"

        this.sheet = id("sheet");
        this.left = 0;
        if (left) {
            this.left = 1;
        }

        this.attacking = 0;
        this.attackDelay = 30;
        this.aggro = false;
        /*Actions:
        0 = idle 
        */

        this.actionX = [[15], [16]];
        this.actionY = [[15], [15]];

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.iFrames = 0;

        // Hit Points
        this.hp = 3;

        // Gravitational Pull
        // The higher the friction the more it slides.( Yes it is the countrary )
        this.friction = 0.90;
        this.gForce = 0.02;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        // This is the accelleration per frame
        this.speed = 0.05;
        this.maxSpeed = 0.05;

        // Simulates the controls of the Ai.
        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

    }
    computeAction() {}
    attack() {}
    onHit(source) {}
    explode() {}
    movement() {}
    compute() {
        player.x < this.x ? this.left = true : this.left = false;
        if (this.aggro) {
            this.attack();
        } else {
            this.movement();
        }
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
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
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        checkCollisions(this);
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
        this.hpDisplay.compute();
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            this.w * GLOBAL.tilesize * GLOBAL.ratio,
            this.h * GLOBAL.tilesize * GLOBAL.ratio
        )
        //drawLaser(this,this.left);
    }
}
class Jaymee extends Entity {
    constructor(x, y, left) {
        super(x, y);

        this.xVel = 0;
        this.yVel = 0;

        this.strikeable = false;

        this.type = "jaymee"

        this.sheet = id("sheet");
        this.left = 0;
        if (left) {
            this.left = 1;
        }
        this.h = 2;
        this.solid = false;
        this.attacking = 0;
        this.attackDelay = 30;
        this.aggro = false;
        /*Actions:
        0 = idle 
        */

        this.actionX = [[17], [18]];
        this.actionY = [[14], [14]];

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.iFrames = 0;

        // Hit Points
        this.hp = 3;

        // Gravitational Pull
        // The higher the friction the more it slides.( Yes it is the countrary )
        this.friction = 0.90;
        this.gForce = 0.02;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        // This is the accelleration per frame
        this.speed = 0.05;
        this.maxSpeed = 0.05;
        officer = this;
        this.events = [];

        // Simulates the controls of the Ai.
        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

    }
    computeAction() {}
    attack() {}
    onHit(source) {}
    explode() {}
    movement() {}
    compute() {
        for (let i = 0; i < this.events.length; i++) {
            this.events[i]();
        }
        player.x < this.x ? this.left = true : this.left = false;
        if (this.aggro) {
            this.attack();
        } else {
            this.movement();
        }
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
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
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        checkCollisions(this);
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
        this.hpDisplay.compute();
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            ((this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio),
            ((this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio),
            (this.w * GLOBAL.tilesize * GLOBAL.ratio),
            (this.h * GLOBAL.tilesize * GLOBAL.ratio)
        )
        //drawLaser(this,this.left);
    }
}
class TrashMan extends Entity {
    constructor(x, y) {
        super(x, y);
        this.actionX = [[10, 11], [10, 11], [10, 10, 10], [11, 11, 11], ];
        this.actionY = [[14, 14], [14, 14], [16, 18, 20], [16, 18, 20], ];
        this.h = 2;
        this.up = false;
        this.strikeable = false;
        this.baseSlowness = 10;
        this.slowness = 10;
        this.hitbox = {
            x: this.x,
            y: this.y + 1,
            h: 1,
            w: 1
        }
        this.triggerHitbox = {
            x: this.x + 0.2,
            y: this.y + 0.8,
            h: 0.5,
            w: 0.6
        }

    }
    compute() {
        if (!this.up && collided(this.triggerHitbox, player)) {
            sounds.trashJump.playy();
            player.yVel = -0.6;
            player.xVel *= 2;
            this.up = true;
            this.frameCounter = 0;
            this.frame = 0;
            this.action = 2;
            this.baseSlowness = 30;
        } else {
            this.baseSlowness = 10;
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
            if (this.up) {
                this.up = false;
                this.action = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}

class Camera extends Entity {
    constructor(x, y) {
        super(x, y);
        this.sheet = id("sheet");
        this.strikeable = false;
        this.actionX = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.actionY = [[18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 20]];
        this.solid = false;
        this.action = 0;
        this.hitbox = {
            x: x + 0.1,
            y: y + 0.25,
            w: 0.8,
            h: 0.5
        }
        this.slowness = 5;
        this.baseSlowness = 5;
    }
    compute() {
        if (!player.onSkate) {
            return;
        }
        if (collided(this, player)) {
            sounds.cameraShutter.playy();
            player.misc.pics++;
            if (player.misc.pics > 10) {
                eventsVariables.tookPhotos = true;
            }
            flash = 4;
            slowMoFrames = 30;
            this.removed = true;
        }
    }
    render() {
        if (!player.onSkate) {
            return;
        }
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class SaveIcon {
    constructor(x, y) {
        this.sheet = id("sheet");
        this.actionX = [[1, 1]];
        this.actionY = [[20, 19]];
        this.x = 28;
        this.y = 16;
        this.w = 1;
        this.h = 1;
        this.h = 1;
        this.active = 0;
        this.action = 0;
        this.slowness = 20;
        this.frameCounter = 0;
        this.frame = 0;
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / dT) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
            this.active--;
        }
        if (!this.active) {
            return;
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            this.x * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.y * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}

class PlayerInterface {
    constructor() {
        this.offsetX = 0;
        this.offsetY = 0;
        this.sheet = id("sheet");
        this.actionX = [[1], [1]];
        this.actionY = [[2], [3]];
        this.w = 1;
        this.h = 1;
        this.action = 0;
        this.frame = 0;
        this.frameCounter = 0;
        this.slowness = 4;
        this.baseSlowness = 4;
    }
    compute() {}
    render() {
        for (let i = 0; i < player.maxHp; i++) {
            if (player.hp > i) {
                c.drawImage(
                    this.sheet,
                    this.actionX[0][0] * GLOBAL.tilesize,
                    this.actionY[0][0] * GLOBAL.tilesize,
                    this.w * GLOBAL.tilesize,
                    this.h * GLOBAL.tilesize,
                    (this.offsetX + this.w * i) * GLOBAL.tilesize * GLOBAL.ratio,
                    (this.offsetY) * GLOBAL.tilesize * GLOBAL.ratio,
                    this.w * GLOBAL.tilesize * GLOBAL.ratio,
                    this.h * GLOBAL.tilesize * GLOBAL.ratio
                )
            } else {
                c.drawImage(
                    this.sheet,
                    this.actionX[1][0] * GLOBAL.tilesize,
                    this.actionY[1][0] * GLOBAL.tilesize,
                    this.w * GLOBAL.tilesize,
                    this.h * GLOBAL.tilesize,
                    (this.offsetX + this.w * i) * GLOBAL.tilesize * GLOBAL.ratio,
                    (this.offsetY) * GLOBAL.tilesize * GLOBAL.ratio,
                    this.w * GLOBAL.tilesize * GLOBAL.ratio,
                    this.h * GLOBAL.tilesize * GLOBAL.ratio
                )
            }
        }

    }
}

class HpDisplay {
    constructor(entity) {
        this.entity = entity;
        this.strikeable = false;
        this.sheet = id("sheet");
        this.hearts = [0, 0, 0];
        this.x = 0;
        this.y = 0;
        this.heartsX = [0, 8, 0, 8];
        this.heartsY = [96, 96, 104, 104];
        this.w = 7;
        this.h = 7;
        if (this.entity.hp > 9) {
            this.entity.hp = 9;
        }
    }
    compute() {
        this.hearts = [0, 0, 0];
        let temp = 0;
        for (let i = 1; i <= this.entity.hp; i++) {
            temp = i % 3;
            switch (temp) {
                case 1:
                    this.hearts[0]++;
                    break;
                case 2:
                    this.hearts[1]++;
                    break;
                case 0:
                    this.hearts[2]++;
                    break;
            }
        }
        if (!this.hearts[2]) {
            this.hearts.splice(2, 1);
        }
        if (!this.hearts[1]) {
            this.hearts.splice(1, 1);
        }
        if (!this.hearts[0]) {
            this.hearts.splice(1, 1);
        }
    }
    render() {
        let centerX = (this.entity.x + this.entity.w / 2 + map.x) * GLOBAL.tilesize * GLOBAL.ratio + ((this.w / 2 - Math.abs(this.hearts.length - 3) * this.w / 2) * GLOBAL.ratio) | 0;
        this.hearts.reverse();
        for (let i = 0; i < this.hearts.length; i++) {
            c.drawImage(
                this.sheet,
                this.heartsX[this.hearts[i]],
                this.heartsY[this.hearts[i]],
                this.w,
                this.h,
                centerX - (this.w * i * GLOBAL.ratio),
                (this.entity.y - 0.5 + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
                this.w * GLOBAL.ratio | 0,
                this.h * GLOBAL.ratio | 0
            )
        }
    }
}
class Portal extends Entity {
    constructor(x, y) {
        super(x, y);
        this.w = 3;
        this.h = 3;
        this.solid = false;
        this.removed = false;
        this.strikeable = false;
        this.action = 0;
        this.actionX = [[53, 53, 53, 53, 53, 53, 53, 53]];
        this.actionY = [[0, 3, 6, 9, 12, 15, 18, 21]];
        this.slowness = 3;
        this.sheet = id("sheet");
        this.important = true;

        this.frameCounter = 0;
        this.frame = 0;

    }
    compute() {
        if (collided(this, player)) {
            this.removed = true;
            alert("that's all for now, the rest is still in development, thanks for playing :)")
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / dT) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            this.x * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.y * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.resetVariables();
    }
    resetVariables(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this.speed = 0.05;
        this.maxSpeed = 0.2;
        this.friction = 0.9;
        this.jumpSpeed = 0.3;
        this.gForce = 0.02;
        this.type = "player";
        this.maxHp = 3;
        this.dead = false;
        this.hp = 3;
        this.saving = false;
        this.misc = {
            pics: 0,
        }
        this.displayInterface = true;
        this.left = 1;
        //Skate variables
        this.onSkate = false;
        this.armed = false;
        this.holdingJump = 0;
        this.iFrames = 0;
        this.interface = new PlayerInterface();
        this.riding = {
            xVel: 0,
            yVel: 0
        };

        this.sheet = id("sheet");

        /*Actions:
        0 = normal
        1 = normal(left)
        2 = walking
        3 = walking (left)
        4 = jumping 
        5 = jumping (left)
        6 = onSkate normal
        7 = onSkate normal (left)
        8 = onSkate holding jump 
        9 = onSkate holding jump (left)
        10 = onSkate holding treshold 
        11 = onSkate holding treshold (left)
        12 = onSkate trick 
        13 = onSkate trick (left)
        14 = eating 
        15 = eating (left)
        */


        this.actionX = [[32], [33], [30, 30, 30, 30, 30, 30, 30, 30], [31, 31, 31, 31, 31, 31, 31, 31], [6], [7], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1, 1], [1, 1, 1], [0], [0], [3, 3, 3, 3, 3, 3, 3], [3, 3, 3, 3, 3, 3, 3]];
        this.actionY = [[11], [11], [11, 12, 13, 14, 15, 16, 17, 18], [11, 12, 13, 14, 15, 16, 17, 18], [18], [18], [4, 5], [4, 5], [6, 7], [6, 7], [8, 6, 7], [8, 6, 7], [7], [7], [18, 19, 20, 21, 20, 21, 20], [18, 19, 20, 21, 20, 21, 20]];

        this.grounded = false;
        this.jumping = false;
        this.lastDir = 0;
        this.baseSlowness = 3;
        this.slowness = 3;

        // Frames where you are allowed to jump when not grounded
        this.coyoteFrames = 8 * dT;
        this.canJump = this.coyoteFrames;
        this.uncontrollable = false;

        this.falseControls = {
            up: false,
            down: false,
            left: false,
            right: false,
            e: false,
            lClickDown: false,
            rClickDown: false,
            test: "test",
            currentPos: 0,
            lastDir: 0
        }
        this.hitbox = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        }
    }
    explode() {
        if (this.dead) {
            return;
        }
        sounds.walking.pause();
        sounds.death.playy();
        this.dead = true;
        slowMoFrames = 60;
        let x = new Vfx(this.x, this.y, 9)
        vfxs.push(x);
        map.cameraFocus = x;
        if (this.onSkate || (this.armed && sword.currentSword == 0)) {
            vfxs.push(new Vfx(this.x, this.y, 15));
            vfxs.push(new Vfx(this.x, this.y, 16));
        } else if (this.armed && sword.currentSword == 1) {
            vfxs.push(new Vfx(this.x, this.y, 7));
            vfxs.push(new Vfx(this.x, this.y, 8));
        }
        // what happens on death
        setTimeout(function () {
            stages[currentPoint.stage][currentPoint.level] = new GameBlueprint().stages[currentPoint.stage][currentPoint.level];
            backToCheckPoint();
            resetEvents();
            loadCall = 1;
            player.resetBasicVariables();
            player.resetVariables();
            map.cameraFocus = player;
        }, 1500)

    }
    onHit() {
        if (this.iFrames > 0) {
            return;
        }
        this.hp--;
        if (this.hp < 1) {
            this.explode();
            return;
        }
        this.yVel = -this.maxSpeed * 3;
        this.xVel = -this.maxSpeed;
        this.iFrames = 60;
        sounds.voices[0][Math.random() * 6 | 0].playy()
        sounds.gotHit.playy();
    }
    checkState() {
        if (this.onSkate) {
            this.speed = 0.025;
            this.maxSpeed = 0.2;
            this.friction = 0.98;
            this.jumpSpeed = 0.3;
            this.gForce = 0.03;
        } else if (!this.onSkate) {
            this.speed = 0.02;
            this.maxSpeed = 0.1;
            this.friction = 0.99;
            this.jumpSpeed = 0.26;
            this.gForce = 0.02;
            if (this.armed && sword.currentSword == 1) {
                this.jumpSpeed = 0.3;
                this.maxSpeed = 0.125;
            }
        }

    }
    compute() {
        if (currentPoint.level < 3) {
            this.displayInterface = false;
        } else {
            this.displayInterface = true;
        }
        if (isOutOfScreen(this)) {
            return;
        }
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
        if (this.saving) {
            this.uncontrollable = true;
        }
        if (this.uncontrollable) {
            this.controls = this.falseControls;
        } else {
            this.controls = controls;
        }
        this.checkState();
        this.coyoteFrames = 8 * dT;
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
        }
        if (this.controls.left) {
            this.left = 1;
            this.grounded ? this.xVel -= this.speed : this.xVel -= this.speed / 2;
            if (this.xVel < -this.maxSpeed) {
                this.xVel = -this.maxSpeed;
            }
        }
        if (this.controls.right) {
            this.left = 0;
            this.grounded ? this.xVel += this.speed : this.xVel += this.speed / 2;
            if (this.xVel > this.maxSpeed) {
                this.xVel = this.maxSpeed;
            }
        }

        // Applies additional friction if player haves no imputs
        if (!(this.controls.right || this.controls.left) || (this.controls.right && this.controls.left)) {
            if (this.grounded && !this.onSkate) {
                this.xVel = 0;
            }
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }
        if (this.grounded) {
            this.canJump = this.coyoteFrames;
            if (Math.abs(this.xVel) > 0.001) {
                this.xVel *= this.friction;
            } else {
                this.xVel = 0;
            }
            this.jumping = false;
            if (this.yVel > 0) {
                this.yVel = 0;
            }
        } else {
            if (this.canJump > 0) {
                this.canJump--;
            }
            if (Math.abs(this.xVel) > 0.001) {
                this.xVel *= this.friction * 0.97;
            } else {
                this.xVel = 0;
            }
        }

        // What to do if the UP button is pressed
        if (this.onSkate) {
            if (this.controls.up && !this.jumping && !this.col.T && this.canJump > 0) {
                this.holdingJump += 1 * dT;
            } else if (!this.controls.up && !this.jumping && !this.col.T && this.canJump > 0 && this.holdingJump > 0) {
                if (this.holdingJump > 15) {
                    sounds.skateJump2.playy();
                    this.jumping = true;
                    this.yVel = -this.jumpSpeed * 1.4;
                } else {
                    sounds.skateJump1.playy();
                    this.jumping = true;
                    this.yVel = -this.jumpSpeed;
                }
                this.holdingJump = 0;
            }
        } else {
            if (this.controls.up && !this.jumping && !this.col.T && this.canJump > 0) {
                sounds.jump.playy();
                this.jumping = true;
                this.yVel = -this.jumpSpeed;
            }
        }
        this.y += (this.yVel + this.riding.yVel) * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += (this.xVel + this.riding.xVel) * dT;
        this.computeAction();
        this.hitbox.x = this.x + this.w / 4;
        this.hitbox.y = this.y + 0.2;
        this.hitbox.w = this.w / 2;
        this.hitbox.h = this.h - 0.3;

        checkCollisions(this);

        if (this.grounded && Math.abs(this.xVel) > this.maxSpeed / 4) {
            if (this.onSkate) {
                sounds.skateGrounded.volume = Math.abs(this.xVel) / this.maxSpeed;
                sounds.skateGrounded.playy();
            } else {
                sounds.walking.playy();
            }
        } else {
            sounds.skateGrounded.pause();
            sounds.walking.pause();
        }
    }
    /*Actions:
    0 = normal
    1 = normal(left)
    2 = walking
    3 = walking (left)
    4 = jumping 
    5 = jumping (left)
    6 = onSkate normal
    7 = onSkate normal (left)
    8 = onSkate holding jump 
    9 = onSkate holding jump (left)
    10 = onSkate holding treshold 
    11 = onSkate holding treshold (left)
    12 = onSkate trick 
    13 = onSkate trick (left)
    */


    computeAction() {
        if (Math.abs(this.xVel) > 0.01) {
            this.action = 2;
        } else {
            this.action = 0;
        }
        if (!this.grounded) {
            this.action = 4;
        }
        if (this.onSkate) {
            this.action = 6;
            if (this.holdingJump) {
                this.action = 8;
                if (this.holdingJump > 15) {
                    if (this.holdingJump < 15 + dT) {
                        this.frame = 0;
                        this.frameCounter = 0;
                    }
                    this.action = 10;
                }
            } else if (this.xVel == 0 && !this.uncontrollable) {
                this.frame = 0;
                this.frameCounter = 0;
            }
            if (flash > 0) {
                this.action = 12;
            }
        }

        if (this.saving) {
            this.action = 14;
            this.baseSlowness = 10;
            if (this.frame == this.actionX[this.action].length - 1 && this.frameCounter > this.baseSlowness * dT - 1 * dT) {
                this.saving = false;
                this.uncontrollable = false;
                this.baseSlowness = 4;
            }
        }
    }
    render() {
        if (isOutOfScreen(this)) {
            return;
        }
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        if (this.displayInterface) {
            this.interface.render();
        }
    }
}
class Sword extends Entity {
    constructor() {
        super();
        this.x = player.x;
        this.y = player.y;
        this.sheet = id("sheet");
        this.actionX = [];
        this.actionY = [];
        this.currentSword = 0;
        this.swords = {
            skate: {
                actionX: [[26], [26, 26, 26, 26, 26]],
                actionY: [[18], [19, 20, 21, 22, 23]]
            },
            basic: {
                actionX: [[27], [27, 27, 27, 27, 27]],
                actionY: [[18], [19, 20, 21, 22, 23]]
            },
            overlord: {
                actionX: [[28], [28, 28, 28, 28, 28]],
                actionY: [[18], [19, 20, 21, 22, 23]]
            }
        }
        this.switchSword();
        this.baseSlowness = 4;
        this.lastDir = controls.lastDir;
        this.rotation = 90 * controls.lastDir * Math.PI / 180;
        this.targetRotation = 90 * controls.lastDir * Math.PI / 180;
        this.iFrames = 0;
        this.hitbox = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
        };
        this.broadHitbox = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
        };
    }
    switchSword() {
        switch (this.currentSword) {
            case 0:
                this.actionX = this.swords.skate.actionX;
                this.actionY = this.swords.skate.actionY;
                break;
            case 1:
                this.actionX = this.swords.basic.actionX;
                this.actionY = this.swords.basic.actionY;
                break;
            case 2:
                this.actionX = this.swords.overlord.actionX;
                this.actionY = this.swords.overlord.actionY;
                break;
        }
    }
    checkEnemiesCollisions() {
        for (let i = 0; i < entities.length; i++) {
            if (entities[i].removed) {
                continue;
            }
            if (!entities[i].strikeable) {
                continue;
            }
            if (collided(this.broadHitbox, entities[i])) {
                let p1 = {
                    x: this.hitbox.x1,
                    y: this.hitbox.y1
                };
                let p2 = {
                    x: this.hitbox.x2,
                    y: this.hitbox.y2
                };
                if (pointSquareCol(p1, entities[i]) || pointSquareCol(p2, entities[i]) || lineSquareCol(this.hitbox, entities[i])) {
                    if (entities[i].iFrames <= 0) {
                        sounds.hit.playy();
                    }
                    entities[i].onHit(player);
                    this.action = 1;
                    this.frame = 0;
                    this.frameCounter = 0;
                    if (entities[i].recoilAttacker) {
                        switch (this.lastDir) {
                            case 0:
                            case 2:
                                if (player.grounded) {
                                    player.xVel = -(entities[i].x - player.x) / 12;
                                } else {
                                    player.xVel = -(entities[i].x - player.x) / 12;
                                }
                                break;
                            case 1:
                            case 3:
                                player.yVel = -(entities[i].y - player.y) / 6;
                                break;
                        }
                    }
                    player.grounded = false;
                }
            }
        }
    }
    compute() {
        this.x = player.x;
        this.y = player.y;
        this.broadHitbox.x = player.x - player.w;
        this.broadHitbox.y = player.y - player.h;
        this.broadHitbox.w = player.w + player.w * 2;
        this.broadHitbox.h = player.y + player.h * 2;

        switch (controls.lastDir) {
            case 0:
                this.x -= 1;
                break;
            case 1:
                this.y -= 1;
                break;
            case 2:
                this.x += 1;
                break;
            case 3:
                this.y += 1;
                break;
        }


        // Slowly rotates the sword
        this.targetRotation = 90 * controls.lastDir * Math.PI / 180;
        if (this.targetRotation == 0 && this.rotation > 3.15) {
            this.targetRotation = 6.28
        }
        if (this.rotation > 6.25 && this.targetRotation <= 3.15) {
            this.rotation = 0;
        }
        if (this.rotation <= 1.57 && this.targetRotation >= 4.71) {
            this.rotation = 6.24;
        }
        this.rotation += (this.targetRotation - this.rotation) / 3 * dT;

        // Updates the hitbox (based on rotation)

        this.hitbox.x1 = (player.x + player.w / 2 - Math.cos(this.rotation) * 0.7);
        this.hitbox.y1 = (player.y + player.h / 2 - Math.sin(this.rotation) * 0.7);
        this.hitbox.x2 = this.hitbox.x1 - Math.cos(this.rotation) * 0.8;
        this.hitbox.y2 = this.hitbox.y1 - Math.sin(this.rotation) * 0.8;


        this.checkEnemiesCollisions();

    }
    render() {
        this.slowness = this.baseSlowness / dT;
        if (this.lastDir != controls.lastDir) {
            this.lastDir = controls.lastDir;
            this.action = 1;
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.action == 1) {
            this.frameCounter++;
            if (this.frameCounter >= this.slowness) {
                this.frameCounter = 0;
                this.frame++;
                if (this.frame >= this.actionX[this.action].length) {
                    this.action = 0;
                    this.frame = 0;
                    this.frameCounter = 0;
                }
            }
        }
        c.save();
        c.translate(
            (player.x + player.w / 2 + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (player.y + player.h / 2 + map.y) * GLOBAL.tilesize * GLOBAL.ratio
        );
        c.rotate(this.rotation);
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (-this.w / 2 - 1) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (-this.h / 2) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        c.restore();

        /* Draws the sword hitbox
        c.strokeStyle = "#ff0000";
        c.beginPath();
        c.moveTo(this.hitbox.x1 * GLOBAL.tilesize * GLOBAL.ratio, this.hitbox.y1 * GLOBAL.tilesize * GLOBAL.ratio);
        c.lineTo(this.hitbox.x2 * GLOBAL.tilesize * GLOBAL.ratio, this.hitbox.y2 * GLOBAL.tilesize * GLOBAL.ratio);
        c.stroke();
        c.stroke();
        c.strokeStyle = "black";
        */
    }
}
class Bomberman extends Entity {
    constructor(x, y) {
        super(x, y);
        this.w = 2;
        this.h = 2;
        this.speed = 0.05;
        this.maxSpeed = 0.3;
        this.xVel = 0;
        this.yVel = 0;
        this.hp = 6;
        this.sheet = id("sheet");
        this.left = 1;
        this.throws = 0;
        /*
            Actions:
            0-IDLE
            1-IDLE(L)
            
            2-JUMP
            3-JUMP(L)
            
            4-THROW
            5-THROW(L)
        
        */
        this.actionX = [[12, 12, 12, 12], [14, 14, 14, 14], [16], [18], [16], [18]];
        this.actionY = [[0, 2, 4, 6], [0, 2, 4, 6], [0], [0], [2], [2]];
        this.dir = this.left * 2 - 1;

        this.baseSlowness = 6;

        this.gForce = 0.02;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        this.launching = 0;
        this.attackDelay = 100;
        this.friction = 0.90;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    }
    computeAction() {
        if (!this.grounded) {
            this.action = 2;
        } else {
            this.action = 0;
        }
        if (this.launching) {
            this.action = 4;
        }
    }
    onHit(source) {
        if (this.iFrames > 0) {
            return;
        }
        this.yVel = -0.1;
        this.attackDelay = 60;
        //this.xVel = (this.x - source.x) / 20;
        this.hp--;
        this.iFrames = 10;
        if (this.hp == 0) {
            this.explode();
        }
    }
    explode() {
        this.removed = true;
        vfxs.push(new Vfx(this.x, this.y, 10));
        vfxs.push(new Vfx(this.x, this.y, 10));
        vfxs.push(new Vfx(this.x, this.y, 11));
        vfxs.push(new Vfx(this.x, this.y, 12));
        vfxs.push(new Vfx(this.x, this.y, 13));
        vfxs.push(new Vfx(this.x, this.y, 13));
        vfxs.push(new Vfx(this.x, this.y, 14));
        //slowMoFrames = 60;
    }
    attack() {
        if (this.attackDelay) {
            this.attackDelay--;
        } else {
            this.launching = 8;
            this.attackDelay = 30;
        }
        if (this.launching) {
            if (this.launching == 5) {
                let xVel = (player.x + player.w / 2 - (this.x + (!this.left) * this.w)) / 30;
                let yVel = -Math.abs(xVel) / 2;
                let x = this.x + (!this.left) * this.w;
                entities.push(new Bomb(x, this.y, xVel, yVel));
                this.throws++;
            }
            this.launching--;
        }
        if (this.throws > 3) {
            this.attackDelay = 120;
            this.throws = 0;
        }
    }
    compute() {
        this.attack();
        if (this.left && player.x > this.x + this.w) {
            this.left = 0;
        } else if (!this.left && this.x > player.x + player.w) {
            this.left = 1;
        }
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
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
        if (controls.up && !this.jumping && !this.col.T && this.grounded) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        if (this.yVel < 0 && this.col.T) {
            this.yVel = 0;
        }
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        checkCollisions(this);
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
        this.hpDisplay.compute();
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        this.hpDisplay.render();
        //drawLaser(this,this.left);
    }
}
class Skeleton extends Entity {
    constructor(x, y, left) {
        super(x, y);

        this.xVel = 0;
        this.yVel = 0;


        this.sheet = id("sheet");
        this.left = 0;
        if (left) {
            this.left = 1;
        }

        this.attacking = 0;
        this.attackDelay = 30;
        this.aggro = false;
        /*Actions:
        0 = idle 
        1 = idle (left)
        2 = walk 
        3 = walk (left)
        4 = attack 
        5 = attack (left)
        */

        this.actionX = [[2], [3], [2, 2, 2, 2], [3, 3, 3, 3], [2, 2, 2, 2, 2], [3, 3, 3, 3, 3]];
        this.actionY = [[0], [0], [0, 1, 2, 3], [0, 1, 2, 3], [4, 5, 6, 7, 8], [4, 5, 6, 7, 8]];

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.iFrames = 0;

        // Hit Points
        this.hp = 3;

        // Gravitational Pull
        // The higher the friction the more it slides.( Yes it is the countrary )
        this.friction = 0.90;
        this.gForce = 0.02;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        // This is the accelleration per frame
        this.speed = 0.05;
        this.maxSpeed = 0.05;


        // Simulates the controls of the Ai.
        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.hitboxPoints = [
            {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 0
            }
        ]
    }
    computeAction() {
        if (this.controls.left || this.controls.right) {
            this.action = 2;
        } else if (this.attacking) {
            this.action = 4;
        } else {
            this.action = 0;
        }
    }
    attack() {
        if (this.attackDelay) {
            this.attackDelay--;
        } else {
            this.attacking = 22;
            this.attackDelay = 40;
        }
        if (this.attacking) {
            if (this.attacking == 22) {
                vfxs.push(new Arrow(this.x, this.y, this.left));
            }
            this.attacking--;
        }
    }
    onHit(source) {
        if (this.iFrames > 0) {
            return;
        }
        this.yVel = -0.1;
        this.left = !source.left;
        this.attackDelay = 60;
        this.xVel = (this.x - source.x) / 5;
        this.hp--;
        this.iFrames = 10;
        if (this.hp == 0) {
            this.explode();
        }
    }
    explode() {
        vfxs.push(new Vfx(this.x, this.y, 0));
        vfxs.push(new Vfx(this.x, this.y, 1));
        vfxs.push(new Vfx(this.x, this.y, 2));
        vfxs.push(new Vfx(this.x, this.y, 3));
        //slowMoFrames=30;
        this.removed = true;
    }
    movement() {
        if (this.left) {
            this.hitboxPoints[0].x = this.x - 0.5;
            this.hitboxPoints[0].y = this.y + this.h / 2;

            this.hitboxPoints[1].x = this.x - 0.5;
            this.hitboxPoints[1].y = this.y + this.h + 0.5;
        } else {
            this.hitboxPoints[0].x = this.x + this.w + 0.5;
            this.hitboxPoints[0].y = this.y + this.h / 2;
            this.hitboxPoints[1].x = this.x + this.w + 0.5;
            this.hitboxPoints[1].y = this.y + this.h + 0.5;
        }
        c.fillRect((this.hitboxPoints[0].x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.hitboxPoints[0].y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            2,
            2)
        c.fillRect((this.hitboxPoints[1].x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.hitboxPoints[1].y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            2,
            2)
        let midCol = false;
        let bottomCol = false;
        for (let i = 0; i < map.tiles.length; i++) {
            if (pointSquareCol(this.hitboxPoints[0], map.tiles[i])) {
                midCol = true;
            }
            if (pointSquareCol(this.hitboxPoints[1], map.tiles[i])) {
                bottomCol = true;
            }
        }
        if (midCol || !bottomCol) {
            if (this.left) {
                this.left = 0;
            } else {
                this.left = 1;
            }
        }

        if (this.left) {
            this.controls.left = true;
            this.controls.right = false;
        } else {
            this.controls.right = true;
            this.controls.left = false;
        }
    }
    compute() {
        if (drawLaser(this, this.left, true) == "player") {
            this.aggro = true;
            this.controls.left = false;
            this.controls.right = false;
        } else {
            this.aggro = false;
        }
        if (this.aggro) {
            this.attack();
        } else {
            this.movement();
        }
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
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
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        checkCollisions(this);
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
        this.hpDisplay.compute();
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        //drawLaser(this,this.left);
        this.hpDisplay.render();
    }
}

class Bombling extends Entity {
    constructor(x, y, left) {
        super(x, y)
        this.speed = 0.05;
        this.maxSpeed = 0.3;
        this.xVel = 0;
        this.yVel = 0;

        this.sheet = id("sheet");
        this.left = left;
        this.actionX = [[9], [10], [9, 9, 9], [10, 10, 10]];
        this.actionY = [[0], [0], [1, 2, 3], [1, 2, 3]];
        this.dir = this.left * 2 - 1;

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.gForce = 0.02;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        this.friction = 0.90;
        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        this.dirHitbox = {
            x: this.x + this.w / 2 + this.dir,
            y: this.y + this.h / 2,
        }
    }
    computeAction() {}
    onHit() {
        this.explode();
    }
    explode() {
        vfxs.push(new Vfx(this.x, this.y, 5));
        vfxs.push(new Vfx(this.x, this.y, 6));
        vfxs.push(new Explosion(this.x, this.y));
        this.removed = true;
    }
    compute() {
        if (this.action < 2 && drawLaser(this, this.left) == "player") {
            this.action = 2;
            if (this.dir > 0) {
                //left
                this.controls.left = true;
            } else {
                //right
                this.controls.right = true;
            }
            this.controls
        }
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
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
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        checkCollisions(this);
        this.dirHitbox.x = this.x + this.w / 2 - this.dir;
        this.dirHitbox.y = this.y + this.h / 2;
        for (let i = 0; i < map.tiles.length; i++) {
            if (pointSquareCol(this.dirHitbox, map.tiles[i])) {
                this.explode();
            }
        }
        if (collided(this, player)) {
            this.explode();
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        //drawLaser(this,this.left);
    }
}

class Bomb extends Entity {
    constructor(x, y, xVel, yVel) {
        super(x, y)
        this.speed = 0.05;
        this.maxSpeed = 0.3;
        this.xVel = xVel;
        this.yVel = yVel;

        this.sheet = id("sheet");
        this.left = 0;
        this.action = 0;
        this.actionX = [[7, 7, 7, 7]];
        this.actionY = [[0, 1, 2, 3]];
        this.dir = this.left * 2 - 1;
        this.recoilAttacker = false;
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.gForce = 0.01;
        this.jumpSpeed = 0.37;
        this.grounded = false;
        this.jumping = false;
        this.friction = 0.99;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.dirHitbox = {
            x: this.x + this.w / 2 + this.dir,
            y: this.y + this.h / 2,
        }
    }
    computeAction() {}
    explode() {
        vfxs.push(new Explosion(this.x, this.y));
        this.removed = true;
    }
    compute() {
        if (this.yVel < GLOBAL.terminalVel / 1.5 * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel / 1.5 * dT;
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
        if (this.grounded) {
            if (Math.abs(this.xVel) > 0.01) {
                this.xVel *= this.friction;
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
        if (this.controls.up && !this.jumping && !this.col.T) {
            this.jumping = true;
            this.yVel -= this.jumpSpeed;
        }
        this.y += this.yVel * dT;

        if (this.col.R && this.xVel > 0 ||
            this.col.L && this.xVel < 0) {
            this.xVel = 0;
        }
        this.x += this.xVel * dT;
        this.computeAction();
        if (collided(this, player)) {
            this.explode();
        }
        for (let i = 0; i < map.tiles.length; i++) {
            if (collided(this, map.tiles[i])) {
                this.explode();
            }
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        //drawLaser(this,this.left);
    }
}
class Arrow extends Entity {
    constructor(x, y, left) {
        super(x, y)
        this.sheet = id("sheet");
        this.strikeable = false;
        this.dir = (left * 2 - 1) * -1;
        this.xVel = 0.2 * this.dir;
        this.yVel = 0;
        this.left = left;

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.actionX = [[2], [3]];
        this.actionY = [[9], [9]];


        this.hitbox = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
        }
    }
    compute() {
        this.x += this.xVel * dT;
        this.hitbox.x1 = this.x + this.w / 5;
        this.hitbox.y1 = this.y + this.h / 2;
        this.hitbox.x2 = this.x + this.w / 5 * 4;
        this.hitbox.y2 = this.y + this.h / 2;
        if (lineSquareCol(this.hitbox, player)) {
            this.removed = true;
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
// The flying stuff
class Vfx {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        //compute/render even if out of screen
        this.important = false;
        this.strikeable = false;
        this.rotation = 0;
        this.rotSpeed = Math.random() * 10;
        this.xVel = Math.random() * 0.3 - 0.15;
        this.yVel = -Math.random() * 0.6 + 0.1;
        this.sheet = id("vfx-sheet");
        this.type = type;
        this.gForce = 0.02;
    }
    compute() {
        if (this.yVel < GLOBAL.terminalVel * dT) {
            this.yVel += this.gForce * dT;
        } else {
            this.yVel = GLOBAL.terminalVel * dT;
        }
        if (isOutOfScreen(this)) {
            this.removed = true;
        }
        this.x += this.xVel * dT;
        this.y += this.yVel * dT;
        this.rotation += this.rotSpeed * dT;
    }
    render() {
        c.save();
        c.translate(
            (this.x + this.w / 2 + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.y + this.h / 2 + map.y) * GLOBAL.tilesize * GLOBAL.ratio
        );
        // 
        c.rotate(this.rotation * Math.PI / 180);
        c.drawImage(
            this.sheet,
            0,
            this.type * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (-this.w / 2) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (-this.h / 2) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        c.restore();
    }
}
class DestructibleRock extends Entity {
    constructor(x, y) {
        super(x, y)
        this.sheet = id("sheet");
        this.recoilAttacker = true;
        this.solid = true;
        this.strikeable = true;
        this.hp = 2;
        this.iFrames = 0;
        this.actionX = [[10], [10], [10]];
        this.actionY = [[55], [54], [53]];
        this.hitbox = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        }
    }
    onHit() {
        if (this.iFrames > 0) {
            return;
        }
        this.iFrames = 20;
        vfxs.push(new Vfx(this.x, this.y, 17));
        vfxs.push(new Vfx(this.x, this.y, 18));
        this.hp--;
        if (this.hp < 0) {
            this.explode();
        }
    }
    explode() {
        vfxs.push(new Vfx(this.x, this.y, 17));
        vfxs.push(new Vfx(this.x, this.y, 18));
        this.removed = true;
    }
    compute() {
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.hp][this.frame] * GLOBAL.tilesize,
            this.actionY[this.hp][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class Skateboard extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = false;
        this.strikeable = false;
        this.h = 1;
        this.w = 1;
        this.action = 0;
        this.actionX = [25, 25];
        this.actionY = [17, 18];
        this.cooldown = 0;
        this.event = function () {
            player.armed = true;
            sword.currentSword = 0;
            this.removed = true;
        }
        this.interac = new Interaction(this.x, this.y - 0.5, this.event, true);

    }
    compute() {
        if (collided(this, player)) {
            this.action = 1;
        } else {
            this.action = 0;
        }
        if (this.interac.removed) {
            this.removed = true;
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX[this.action] * GLOBAL.tilesize,
            this.actionY[this.action] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class Bubble extends Entity {
    constructor(x, y) {
        super(x, y)
        this.sheet = id("sheet");
        this.recoilAttacker = false;

        this.actionX = [[0, 0, 0, 0, 0, 0, 0, 0]];
        this.actionY = [[10, 11, 12, 13, 14, 15, 16, 17]];
        this.hitbox = {
            x: this.x + 0.1,
            y: this.y + 0.1,
            w: this.w - 0.2,
            h: this.h - 0.2
        }
    }
    onHit() {
        this.explode();
    }
    explode() {
        vfxs.push(new BubbleExplosion(this.x, this.y));
        player.yVel = -0.4;
        this.removed = true;
    }
    compute() {}
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class BubbleExplosion extends Entity {
    constructor(x, y) {
        super(x, y)
        this.sheet = id("sheet");
        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        this.actionX = [[1, 1, 1, 1]];
        this.actionY = [[10, 11, 12, 13]];
    }
    compute() {
        return false;
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class Explosion extends Entity {
    constructor(x, y) {
        super();
        this.x = x - 1;
        this.y = y - 2;
        this.w = 3;
        this.h = 3;
        this.sheet = id("explosion");

        this.baseSlowness = 4;
        this.slowness = this.baseSlowness;

        //this.actionX = [[0,0,0,0,0,0,0,0,0]];
        //this.actionY = [[0,3,6,9,12,15,18,21,24]];
        this.actionX = [[0, 0, 0, 0, 0, 0, 0, 0]];
        this.actionY = [[3, 6, 9, 12, 15, 18, 21, 24]];
        this.hitbox = {
            x: this.x - 0.2,
            y: this.y - 0.2,
            w: this.w + 0.4,
            h: this.h + 0.4,
        }
    }
    compute() {
        if (this.frame < 4 && collided(this, player)) {
            //what happens if player is hit
        }
    }
    render() {
        this.slowness = this.baseSlowness / dT;
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
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        //drawLaser(this,this.left);
    }
}

class Map {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.spawnPoint = {
            x: 0,
            y: 0
        };
        this.tilesWidth = canvas.width / GLOBAL.tilesize / GLOBAL.ratio;
        this.tilesHeight = canvas.height / GLOBAL.tilesize / GLOBAL.ratio;
        this.levelImage = 0;
        this.background = 0;
        //inherited from map tester
        this.tiles = [{
            x: -40,
            y: 10,
            w: 70,
            h: 1
        }];
        this.map = {};
        this.backgroundSpeed = 2;
        this.cameraFocus = "none";


    }
    renderTiles() {
        if (this.background) {
            c.drawImage(
                this.background,
                0,
                0,
                this.tilesWidth * GLOBAL.tilesize,
                this.tilesHeight * GLOBAL.tilesize,
                ((this.x / this.backgroundSpeed) % this.tilesWidth * GLOBAL.tilesize * GLOBAL.ratio),
                0,
                this.tilesWidth * GLOBAL.tilesize * GLOBAL.ratio,
                this.tilesHeight * GLOBAL.tilesize * GLOBAL.ratio
            )
            c.drawImage(
                this.background,
                0,
                0,
                this.tilesWidth * GLOBAL.tilesize,
                this.tilesHeight * GLOBAL.tilesize,
                ((this.x / this.backgroundSpeed) % this.tilesWidth + this.tilesWidth) * GLOBAL.tilesize * GLOBAL.ratio,
                0,
                this.tilesWidth * GLOBAL.tilesize * GLOBAL.ratio,
                this.tilesHeight * GLOBAL.tilesize * GLOBAL.ratio
            )
        }
        //render the level image
        if (this.levelImage) {
            c.drawImage(
                this.levelImage,
                (-map.x * GLOBAL.tilesize),
                (-map.y * GLOBAL.tilesize),
                (this.tilesWidth * GLOBAL.tilesize),
                (this.tilesHeight * GLOBAL.tilesize),
                0,
                0,
                (this.tilesWidth * GLOBAL.tilesize * GLOBAL.ratio),
                (this.tilesHeight * GLOBAL.tilesize * GLOBAL.ratio)
            )
        }
        if (testMode) {
            for (let i = 0; i < this.tiles.length; i++) {
                renderEntity(this.tiles[i]);
            }
        }
    }
    computeCamera() {
        if (isNaN(map.x)) {
            map.x = 0;
        }
        if (isNaN(map.y)) {
            map.y = 0;
        }
        this.tilesWidth = canvas.width / GLOBAL.tilesize / GLOBAL.ratio;
        this.tilesHeight = canvas.height / GLOBAL.tilesize / GLOBAL.ratio;
        if (typeof this.cameraFocus === 'object' && this.cameraFocus !== null) {
            this.x += ((-this.cameraFocus.x + this.tilesWidth / 2) - this.x) / (6 / dT);

        } else {
            this.x = 0;
            this.y = 0;
        }

        if (this.levelImage) {
            if ((-this.x + this.tilesWidth) * GLOBAL.tilesize > this.levelImage.width) {
                this.x = -(this.levelImage.width / GLOBAL.tilesize - this.tilesWidth);
            }
            if (-this.x < 0) {
                this.x = 0;
            }
            if ((-this.y + this.tilesHeight) * GLOBAL.tilesize > this.levelImage.height) {
                this.y = -(this.levelImage.height / GLOBAL.tilesize - this.tilesHeight);
            }
            if (-this.y < 0) {
                this.y = 0;
            }
        }
    }
}

class Aliquam extends Entity {
    constructor(x, y) {
        super(x, y);
        this.x = 0;
        this.y = 0;
        this.w = 19;
        this.h = 18;
        this.xVel = 0;
        this.yVel = 0;
        this.aggro = true;
        this.sheet = id("sheet");
        this.actionX = [0, 0, 0];
        this.actionY = [0, 0, 0];
        this.baseSlowness = 4;
        this.slowness = 6;
        this.mouthOpen = false;
        this.type = "boss";
        this.solid = false;
        this.strikeable = false;
        this.important = true;
        this.attackDelay = 100;
        this.attackCooldown = 200;
        this.moveBack = false;
        this.hp = 3;
        this.maxHp = 3;
        this.jaw = {
            spriteX: [22],
            spriteY: [5],
            w: 80 / 16,
            h: 32 / 16,
            x: -1 / 16,
            y: 34 / 16,
            standardX: -1 / 16,
            standardY: 34 / 16,
        };
        this.bobbleSpeed = 0.01;
        this.head = {
            //x on the sprite
            spriteX: [22],
            //y on the sprite
            spriteY: [0],
            //w both on the sprite and in-game
            w: 144 / 16,
            //h both on the sprite and in-game
            h: 80 / 16,
            //x on the map, updated in main compute()
            x: 0 / 16,
            //y on the map, updated in main compute()
            y: 0 / 16,
            //x of the cosine movement
            x2: 0,
            //y of the cosine movement
            y2: 0,
        };
        this.arm = {
            spriteX: [31],
            spriteY: [0],
            w: 319 / 16,
            h: 84 / 16,
            x: 0,
            //this is the only locked variable, arm wont move up
            y: this.initialY - 84 / 16,
            //min movement capacity
            xMin: 64 / 16,
            //max movement capacity
            xMax: -308 / 16,
            initialX: 0
        };
        this.initialize();
        this.armHitbox = {
            x: 0,
            y: 0,
            w: this.arm.w,
            h: this.arm.h - 2,

        }
        this.headHitbox = {
            x: 0,
            y: 0,
            w: 10,
            h: 3,

        }
    }
    initialize() {
        this.x = map.levelImage.width / GLOBAL.tilesize - this.head.w;
        this.arm.x = map.levelImage.width / GLOBAL.tilesize - this.arm.w / 3;
        this.arm.initialX = map.levelImage.width / GLOBAL.tilesize - this.arm.w / 3;
    }
    renderHp() {
        for (let i = 0; i < this.maxHp; i++) {
            if (this.hp > i) {
                c.drawImage(
                    this.sheet,
                    26 * GLOBAL.tilesize,
                    10 * GLOBAL.tilesize,
                    1 * GLOBAL.tilesize,
                    1 * GLOBAL.tilesize,
                    (27 + 1 * i) * GLOBAL.tilesize * GLOBAL.ratio,
                    (0) * GLOBAL.tilesize * GLOBAL.ratio,
                    1 * GLOBAL.tilesize * GLOBAL.ratio,
                    1 * GLOBAL.tilesize * GLOBAL.ratio
                )
            } else {
                c.drawImage(
                    this.sheet,
                    26 * GLOBAL.tilesize,
                    11 * GLOBAL.tilesize,
                    1 * GLOBAL.tilesize,
                    1 * GLOBAL.tilesize,
                    (27 + 1 * i) * GLOBAL.tilesize * GLOBAL.ratio,
                    (0) * GLOBAL.tilesize * GLOBAL.ratio,
                    1 * GLOBAL.tilesize * GLOBAL.ratio,
                    1 * GLOBAL.tilesize * GLOBAL.ratio
                )
            }
        }
    }
    computeHead() {
        // Move the head relatively to the player y
        let y = this.y + this.head.y + (this.head.h / 2)

        if (y < player.y && y < this.arm.y + 1) {
            this.y += (player.y - y) / 16 * dT;
        } else if (y > player.y + player.h) {
            this.y -= (y - player.y - player.h) / 16 * dT;
        }
        //head bobble movement
        if (this.left) {
            if (this.head.x2 > 0) {
                this.head.x2 -= this.bobbleSpeed * dT;
                if (this.head.x2 <= 0) this.head.x2 = 0;
            } else {
                this.left = false;
            }
        }
        if (!this.left) {
            if (this.head.x2 < Math.PI / 4) {
                this.head.x2 += this.bobbleSpeed * dT;
                if (this.head.x2 >= Math.PI / 4) this.head.x2 = Math.PI / 4;
            } else {
                this.left = true;
            }
        }
        let cos;
        if (this.left) {
            cos = Math.sin((this.head.x2 * 4));
        } else {
            cos = -Math.sin((this.head.x2 * 4));
        }
        this.head.y2 = cos * 0.7;

        this.headHitbox.x = this.x + this.head.x + this.head.x2;
        this.headHitbox.y = this.y + this.head.y + this.head.y2 + 1.4;
    }
    computeJaw() {
        if (dialogueEngine.active) {
            this.attackCooldown = this.attackDelay;
        }
        //move the jaw dipendently/shoot
        this.attackCooldown -= dT;
        if (this.attackCooldown < 0 && this.aggro) {
            this.attackCooldown = this.attackDelay;
            entities.push(new Fireball(this.x + this.jaw.x + this.jaw.w / 2 + this.head.x2, this.y + this.jaw.y + this.head.y2, this))
            this.mouthOpen = true;
            sounds.fireball.playy();
        }
        if (dialogueEngine.active && dialogueEngine.speaker == 5) {
            this.mouthOpen = true;
        }
        if (this.mouthOpen) {
            this.jaw.y = this.jaw.standardY + 0.8;
        } else {
            this.jaw.y += (this.jaw.standardY - this.jaw.y) / 16 * dT;
        }
    }
    computeArm() {
        //move the arm indipendently
        if (this.iFrames > 0) {
            return;
        }
        if (player.y >= this.arm.y + 2.5 && this.aggro && player.iFrames <= 0) {
            if (this.arm.x > map.levelImage.width / GLOBAL.tilesize + this.arm.xMax) {
                this.arm.x += (this.arm.x - map.levelImage.width / GLOBAL.tilesize + this.arm.xMax) / 60 * dT;
                this.mouthOpen = true;
                screenShake.duration = 2;
            }
        } else {
            this.mouthOpen = false;
            if (this.arm.x < map.levelImage.width / GLOBAL.tilesize + this.arm.xMin) {
                this.arm.x -= (this.arm.x - map.levelImage.width / GLOBAL.tilesize + this.arm.xMin) / 60 * dT;
            }
        }

        //updating hitbox pos
        this.armHitbox.x = this.arm.x + 0.3;
        this.armHitbox.y = this.arm.y + 2;
    }
    onHit() {
        if (this.iFrames > 0) {
            return;
        }
        this.hp--;
        sounds.hit.playy();
        this.iFrames = 30;
        this.attackCooldown = 20;
        this.attackDelay *= 0.8;
        this.mouthOpen = true;
        screenShake.duration = 40;
        slowMoFrames = 40;
        if (this.hp <= 0) {
            slowMoFrames = 80;
        }
    }
    checkHitboxCollisions() {
        if (!this.aggro) {
            return;
        }
        if (collided(this.armHitbox, player)) {
            player.onHit();
            player.xVel = -1;
        }
        if (lineSquareCol(sword.hitbox, this.headHitbox)) {
            this.onHit();
            if (this.hp > 0) {
                player.grounded = false;
                player.xVel = -10;
                player.yVel = -2;
                player.y -= 0.5;
            }
        }
    }
    fightEnd() {
        if (this.hp <= 0) {
            // stop fighting and talk to the player
            this.aggro = false;
            eventsVariables.aliquamSpeaks = true;
            if (this.moveBack && !dialogueEngine.active) {
                this.x += 0.1 * dT;
                this.arm.x += 0.1 * dT;
                screenShake.duration++;
                if (isOutOfBounds(this)) {
                    this.removed = true;
                }
            }
        }
    }
    compute() {
        if (this.iFrames > 0) {
            this.iFrames -= 0.5 * dT;
        }
        if (!this.moveBack || dialogueEngine.active) {
            this.computeHead();
            this.computeJaw();
            this.computeArm();
        }
        this.checkHitboxCollisions();
        this.fightEnd();

    }
    render() {

        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        // Render head
        c.drawImage(
            this.sheet,
            this.head.spriteX[this.frame] * GLOBAL.tilesize,
            this.head.spriteY[this.frame] * GLOBAL.tilesize,
            this.head.w * GLOBAL.tilesize,
            this.head.h * GLOBAL.tilesize,
            ((this.x + map.x + this.head.x + this.head.x2) * GLOBAL.tilesize) * GLOBAL.ratio | 0,
            ((this.y + map.y + this.head.y + this.head.y2) * GLOBAL.tilesize) * GLOBAL.ratio | 0,
            (this.head.w) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.head.h) * GLOBAL.tilesize * GLOBAL.ratio | 0
        )

        // Render jaw
        c.drawImage(
            this.sheet,
            this.jaw.spriteX[this.frame] * GLOBAL.tilesize,
            this.jaw.spriteY[this.frame] * GLOBAL.tilesize,
            this.jaw.w * GLOBAL.tilesize,
            this.jaw.h * GLOBAL.tilesize,
            (this.x + map.x + this.jaw.x + this.head.x + this.head.x2) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y + this.jaw.y + this.head.y + this.head.y2) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.jaw.w) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.jaw.h) * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        // Render arm
        c.drawImage(
            this.sheet,
            this.arm.spriteX[this.frame] * GLOBAL.tilesize,
            this.arm.spriteY[this.frame] * GLOBAL.tilesize,
            this.arm.w * GLOBAL.tilesize,
            this.arm.h * GLOBAL.tilesize,
            (map.x + this.arm.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (map.y + this.arm.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.arm.w) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.arm.h) * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        if (this.aggro && !dialogueEngine.active) {
            this.renderHp()
        }
    }
}
class InteractiveSword extends Entity {
    constructor(x, y) {
        super(x, y);
        console.log(this.x)
        this.solid = false;
        this.strikeable = false;
        this.sheet = id("sheet");
        this.action = 0;
        this.actionX = [[0], [0, 0, 0, 0, 0, 0]];
        this.actionY = [[0], [0, 1, 2, 3, 4, 5]];
        this.grounded = false;
        this.rotation = 0;
        this.xVel = -1;
        this.yVel = -0.3;
        this.friction = 0.98;
        this.gForce = 0.02;
        this.important = true;
        this.id = "interactiveSword"
        this.event = function () {
            for (let i = 0; i < entities.length; i++) {
                if (entities[i].id == "interactiveSword") {
                    entities[i].removed = true;
                }
            }
            sword.currentSword = 1;
            sword.switchSword();
            eventsVariables.swordCollected = true;
            dialogueEngine.loadDialogueQueue([{
                speaker: 0,
                emotion: 3,
                text: "(Woah I can really feel it... the MAGIC!)",
            }, {
                speaker: 0,
                emotion: 0,
                text: "I'll have to speak to that dragon now, I think it knows what's happening.",
            }])
        }

    }
    compute() {
        if (this.grounded) {
            return;
        }
        for (let i = 0; i < map.tiles.length; i++) {
            if (collided(this, map.tiles[i])) {
                if (colCheck(this, map.tiles[i]) == "b") {
                    checkCollisions(this);
                    this.grounded = true;
                    this.action = 1;
                    entities.push(new Interaction(this.x, this.y - 0.5, this.event, false))
                }
            }
        }
        this.xVel *= Math.pow(this.friction, dT);
        this.yVel += this.gForce;
        this.x += this.xVel * dT;
        this.y += this.yVel * dT;
        this.rotation += 1 * dT;
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / dT) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action].length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        c.save();
        let x = (this.x + map.x + this.w / 2) * GLOBAL.tilesize * GLOBAL.ratio | 0;
        let y = (this.y + map.y + this.h / 2) * GLOBAL.tilesize * GLOBAL.ratio | 0;
        c.translate(x, y);
        c.rotate(this.rotation / 2);
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            -this.w / 2 * GLOBAL.tilesize * GLOBAL.ratio | 0,
            -this.h / 2 * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        c.restore();
    }
}

//*
canvas.onclick=function(){
    console.log("a")
    entities.push(new Bee(mousePosition.x,mousePosition.y));
}
//*/
class Bee extends Entity {
    constructor(x, y) {
        super(x, y);
        this.removed = false;
        this.solid = false;
        this.action = 0;
        /*
        actions:
        0,1 flying
        2,3 charging
        4,5 attack
        */
        this.actionX = [[14, 14, 14, 14], [15, 15, 15, 15], [14, 14], [15, 15], [16, 16, 16], [17, 17, 17]]
        this.actionY = [[8, 9, 10, 11], [8, 9, 10, 11], [11, 12], [11, 12], [8, 9, 10], [8, 9, 10]]
        this.slowness = 6;
        this.hp = 2;
        this.aggro = false;
        this.left = false;
        this.distance = 6;
        this.speed = 0.05;
        this.attackDelay = 30;
    }
    move() {
        if (this.left) {
            if (this.x > this.initialX) {
                this.xVel = -this.speed
            } else {
                this.x = this.initialX;
                this.left = false;
            }
        }
        if (!this.left) {
            if (this.x < this.initialX + this.distance) {
                this.xVel = this.speed
            } else {
                this.x = this.initialX + this.distance;
                this.left = true;
            }
        }
    }
    attack(){
        
    }
    compute() {
        // move left and right, if you see the player on the diagonal, charge a little and attack it, if you find a collision then go back up
        if (this.iFrames > 0) {
            this.iFrames -= 1 * dT;
        }
            if (collided(this, player)) {
                player.onHit();
            }
        this.move();
        this.attack();
        this.x += this.xVel * dT;
        this.hpDisplay.compute();
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / dT) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action + this.left].length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        this.hpDisplay.render();
    }
}
class Fireball extends Entity {
    constructor(x, y, source) {
        super(x, y)
        this.source = source;
        this.sheet = id("sheet");
        this.strikeable = false;
        this.removed = false;
        this.xVel = 0.1;
        this.yVel = 0;
        this.left = true;
        this.dir = (this.left * 2 - 1) * -1;
        this.w = 2;
        this.action = 0;
        this.h = 2
        this.slowness = 4;
        this.important = true;

        this.actionX = [[3], [20, 20, 20, 20], [3], [20, 20, 20, 20]];
        this.actionY = [[9], [0, 2, 4, 6], [9], [8, 10, 12, 14]];


        this.hitbox = {
            x: 0,
            y: 0,
            w: 21 / GLOBAL.tilesize,
            h: 20 / GLOBAL.tilesize,
        }
    }
    compute() {
        if (this.action == 2) {
            return;
        }
        this.hitbox.x = this.x + 4 / GLOBAL.tilesize;
        this.hitbox.y = this.y + 6 / GLOBAL.tilesize;
        this.x += this.xVel * this.dir * dT;
        if (collided(this, player)) {
            player.onHit();
            this.action = 2;
            this.frame = 0;
            this.frameCounter = 0;
            sounds.fireballExplode.playy();
        }
        if (this.source.iFrames > 0) {
            this.action = 2;
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (isOutOfBounds(this)) {
            this.removed = true;
        }
    }
    render() {
        this.frameCounter++;
        if (this.frameCounter >= this.slowness / dT) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX[this.action + this.left].length) {
                this.frame = 0;
                this.frameCounter = 0;
                if (this.action == 2) {
                    this.removed = true;
                    return;
                }
            }
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action + this.left][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}
class Boss_1 extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.w = 19;
        this.h = 18;
        this.xVel = 0.1;
        this.yVel = Math.cos(this.x);
        this.sheet = id("sheet");
        this.actionX = [0, 0, 0];
        this.actionY = [0, 0, 0];
        this.baseSlowness = 4;
        this.slowness = 6;
        this.type = "boss";
        this.important = true;

        this.body = {
            spriteX: 416,
            spriteY: 432,
            w: 304,
            h: 288,
        };
        this.attach = {
            spriteX: 736,
            spriteY: 432,
            w: 54,
            h: 54,
            x1: 154,
            y1: 127,
            x2: 118,
            y2: 184,
            x3: 190,
            y3: 208,
        };
        this.gun = {
            spriteX: 736,
            spriteY: 576,
            w: 69,
            h: 32,
            x1: 129,
            y1: 195,
            rotation: 0,
            rotCenter: {
                x: 15,
                y: 16
            }
        };
        this.laserGun = {
            spriteX: 736,
            spriteY: 624,
            w: 95,
            h: 33,
            x1: 165,
            y1: 138,
            rotation: 20,
            rotCenter: {
                x: 15,
                y: 16
            }
        };
        this.saw = {
            spriteX: [728, 728, 728],
            spriteY: [672, 720, 768],
            w: 120,
            h: 48,
            x1: 211,
            y1: 211,
            rotation: 0,
            rotCenter: {
                x: 4,
                y: 23
            }
        };
        this.sawHitbox = {
            x: 0,
            y: 0,
            w: 2,
            h: 2
        }
        this.propeller = {
            spriteX: [864, 864, 864],
            spriteY: [544, 592, 640],
            w: 101,
            h: 44,
            x1: -12,
            y1: 110,
            x2: -24,
            y2: 158,
            x3: -10,
            y3: 205,
            rotation: 0
        };
        this.solid = false;

    }
    computeRotation(item) {
        let x = this.x + (item.x1 + item.rotCenter.x) / GLOBAL.tilesize;
        let y = this.y + (item.y1 + item.rotCenter.y) / GLOBAL.tilesize;
        let deltaX = x - (player.x + player.w / 2);
        let deltaY = y - (player.y + player.h / 2);
        item.rotation = Math.atan2(deltaY, deltaX) + Math.PI;
    }
    checkSawCollision() {
        let length = -95 / GLOBAL.tilesize;
        this.sawHitbox.x = this.x + (this.saw.x1 / GLOBAL.tilesize) + (this.saw.rotCenter.x / GLOBAL.tilesize) - Math.cos(this.saw.rotation) * length;
        this.sawHitbox.x -= this.sawHitbox.w / 2;
        this.sawHitbox.y = this.y + (this.saw.y1 / GLOBAL.tilesize) + (this.saw.rotCenter.y / GLOBAL.tilesize) - Math.sin(this.saw.rotation) * length;
        this.sawHitbox.y -= this.sawHitbox.h / 2;

        if (collided(player, this.sawHitbox)) {
            player.explode()
        }
    }
    compute() {
        if (!loadCall && !player.dead) {
            this.computeRotation(this.gun)
            this.computeRotation(this.laserGun)
            this.computeRotation(this.saw)
        }
        if (this.x + this.w < player.x - 8) {
            this.x += this.xVel * dT * 1.7;
        } else {
            this.x += this.xVel * dT;
        }
        this.yVel = Math.cos(this.x / 3) / 30
        this.y += this.yVel * dT;
        if (!isOutOfScreen(this)) {
            screenShake.duration = 6;
        }
        this.checkSawCollision();
    }
    render() {
        /*
        What to render:
        Boss (base)
        Gun
        Laser Gun
        Saw
        */
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
            if (this.frame >= this.actionX.length) {
                this.frame = 0;
                this.frameCounter = 0;
            }
        }
        // Render body
        c.drawImage(
            this.sheet,
            this.body.spriteX,
            this.body.spriteY,
            this.body.w,
            this.body.h,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        // Render attaches
        c.drawImage(
            this.sheet,
            this.attach.spriteX,
            this.attach.spriteY,
            this.attach.w,
            this.attach.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.attach.x1) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.attach.y1) * GLOBAL.ratio | 0,
            (this.attach.w) * GLOBAL.ratio | 0,
            (this.attach.h) * GLOBAL.ratio | 0
        )
        c.drawImage(
            this.sheet,
            this.attach.spriteX,
            this.attach.spriteY,
            this.attach.w,
            this.attach.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.attach.x2) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.attach.y2) * GLOBAL.ratio | 0,
            (this.attach.w) * GLOBAL.ratio | 0,
            (this.attach.h) * GLOBAL.ratio | 0
        )
        c.drawImage(
            this.sheet,
            this.attach.spriteX,
            this.attach.spriteY,
            this.attach.w,
            this.attach.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.attach.x3) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.attach.y3) * GLOBAL.ratio | 0,
            (this.attach.w) * GLOBAL.ratio | 0,
            (this.attach.h) * GLOBAL.ratio | 0
        )
        // Render propellers
        c.drawImage(
            this.sheet,
            this.propeller.spriteX[this.frame],
            this.propeller.spriteY[this.frame],
            this.propeller.w,
            this.propeller.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.propeller.x1) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.propeller.y1) * GLOBAL.ratio | 0,
            (this.propeller.w) * GLOBAL.ratio | 0,
            (this.propeller.h) * GLOBAL.ratio | 0
        )
        c.drawImage(
            this.sheet,
            this.propeller.spriteX[this.frame],
            this.propeller.spriteY[this.frame],
            this.propeller.w,
            this.propeller.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.propeller.x2) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.propeller.y2) * GLOBAL.ratio | 0,
            (this.propeller.w) * GLOBAL.ratio | 0,
            (this.propeller.h) * GLOBAL.ratio | 0
        )
        c.drawImage(
            this.sheet,
            this.propeller.spriteX[this.frame],
            this.propeller.spriteY[this.frame],
            this.propeller.w,
            this.propeller.h,
            ((this.x + map.x) * GLOBAL.tilesize + this.propeller.x3) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.propeller.y3) * GLOBAL.ratio | 0,
            (this.propeller.w) * GLOBAL.ratio | 0,
            (this.propeller.h) * GLOBAL.ratio | 0
        )
        // Render laserGun
        c.save();
        c.translate(
            ((this.x + map.x) * GLOBAL.tilesize + this.laserGun.x1 + this.laserGun.rotCenter.x) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.laserGun.y1 + this.laserGun.rotCenter.y) * GLOBAL.ratio | 0
        );
        c.rotate(this.laserGun.rotation);
        c.drawImage(
            this.sheet,
            this.laserGun.spriteX,
            this.laserGun.spriteY,
            this.laserGun.w,
            this.laserGun.h,
            -this.laserGun.rotCenter.x * GLOBAL.ratio,
            -this.laserGun.rotCenter.y * GLOBAL.ratio,
            (this.laserGun.w) * GLOBAL.ratio | 0,
            (this.laserGun.h) * GLOBAL.ratio | 0
        )
        c.restore()




        // Render gun
        c.save();
        c.translate(
            ((this.x + map.x) * GLOBAL.tilesize + this.gun.x1 + this.gun.rotCenter.x) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.gun.y1 + this.gun.rotCenter.y) * GLOBAL.ratio | 0
        );
        c.rotate(this.gun.rotation);
        c.drawImage(
            this.sheet,
            this.gun.spriteX,
            this.gun.spriteY,
            this.gun.w,
            this.gun.h,
            -this.gun.rotCenter.x * GLOBAL.ratio,
            -this.gun.rotCenter.y * GLOBAL.ratio,
            (this.gun.w) * GLOBAL.ratio | 0,
            (this.gun.h) * GLOBAL.ratio | 0
        )
        c.restore()


        // Render saw
        c.save();
        c.translate(
            ((this.x + map.x) * GLOBAL.tilesize + this.saw.x1 + this.saw.rotCenter.x) * GLOBAL.ratio | 0,
            ((this.y + map.y) * GLOBAL.tilesize + this.saw.y1 + this.saw.rotCenter.y) * GLOBAL.ratio | 0
        );
        c.rotate(this.saw.rotation);
        c.drawImage(
            this.sheet,
            this.saw.spriteX[this.frame],
            this.saw.spriteY[this.frame],
            this.saw.w,
            this.saw.h,
            -this.saw.rotCenter.x * GLOBAL.ratio,
            -this.saw.rotCenter.y * GLOBAL.ratio,
            (this.saw.w) * GLOBAL.ratio | 0,
            (this.saw.h) * GLOBAL.ratio | 0
        )
        c.restore()

        /*
        c.fillStyle = "red";
        c.fillRect(
            this.sawHitbox.x * GLOBAL.ratio * GLOBAL.tilesize,
            this.sawHitbox.y * GLOBAL.ratio * GLOBAL.tilesize,
            this.sawHitbox.w * GLOBAL.ratio * GLOBAL.tilesize,
            this.sawHitbox.h * GLOBAL.ratio * GLOBAL.tilesize,
        )
        */
    }
}

class Interaction extends Entity {
    constructor(x, y, event, repeatable) {
        super(x, y);
        this.strikeable = false;
        this.solid = false;
        this.sheet = id("sheet");
        this.actionX = [[1, 1]];
        this.actionY = [[17, 18]];
        this.baseSlowness = 15;
        this.slowness = 15;
        this.action = 0;
        this.pressed = 1;
        this.removed = false;

        this.type = "interaction"
        this.repeatable = repeatable ? true : false;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 3,
            h: 3

        }
        this.inRange = false;
        this.event = event;
    }
    compute() {
        controls.e ? this.pressed++ : this.pressed = 0;
        if (player.uncontrollable) {
            return;
        }
        this.hitbox.x = this.x + this.w / 2 - this.hitbox.w / 2;
        this.hitbox.y = this.y + this.h / 2 - this.hitbox.h / 2;
        if (collided(this, player)) {
            this.inRange = true
        } else {
            this.inRange = false
        }
        if (this.inRange && this.pressed == 1) {
            this.event(this);
            if (!this.repeatable) {
                this.removed = true;
            }
        }

    }
    render() {
        if (player.uncontrollable) {
            return;
        }
        if (this.inRange) {
            this.slowness = this.baseSlowness / dT;
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
                this.actionX[this.action][this.frame] * GLOBAL.tilesize,
                this.actionY[this.action][this.frame] * GLOBAL.tilesize,
                this.w * GLOBAL.tilesize,
                this.h * GLOBAL.tilesize,
                (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
                (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
                this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
                this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
            )
        }

    }
}
class EventBox extends Entity {
    constructor(x, y, w, h, event, repeatable) {
        super(x, y);
        this.strikeable = false;
        this.solid = false;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        repeatable ? this.repeatable = true : this.repeatable = false;
        this.removed = false;
        this.event = event;
    }
    compute() {
        if (collided(this, player)) {
            this.event();
            if (!this.repeatable) {
                this.removed = true;
            }
        }
    }
    render() {
        /*
        c.fillRect(
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.w) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.h) * GLOBAL.tilesize * GLOBAL.ratio,
        )
        */
    }
}
//entities.push(new Bat(19,12))
class Bat extends Entity {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.actionX = [[8, 8, 8, 8]];
        this.actionY = [[0, 1, 2, 3]];
        this.sheet = id("sheet")
        this.action = 0;
        this.removed = false;
        this.solid = false;
        this.initialX = x;
        this.initialY = y;
        this.left = true;
        this.distance = 6;
        this.speed = 0.03;
        this.iFrames = 0;
        this.hp = 2;
    }
    onHit(source) {
        if (this.iFrames > 0) {
            return;
        }
        this.left = !this.left;
        this.xVel = (this.x - source.x) / 5;
        this.hp--;
        this.iFrames = 20;
        if (this.hp == 0) {
            this.explode();
        }
    }
    explode() {
        vfxs.push(new Vfx(this.x, this.y, 4));
        //slowMoFrames=30;
        this.removed = true;
    }
    move() {
        if (this.left) {
            if (this.x > this.initialX) {
                this.xVel = -this.speed
            } else {
                this.x = this.initialX;
                this.left = false;
            }
        }
        if (!this.left) {
            if (this.x < this.initialX + this.distance) {
                this.xVel = this.speed
            } else {
                this.x = this.initialX + this.distance;
                this.left = true;
            }
        }
    }
    compute() {
        this.iFrames -= 1 * dT;
        if (collided(this, player)) {
            player.onHit();
        }
        this.move();

        this.x += this.xVel * dT;
        this.cos = Math.cos((this.x - this.initialX) * 3);
        this.y = (this.initialY + this.cos);
        this.hpDisplay.compute();
    }
    render() {
        this.slowness = this.baseSlowness / dT;
        this.frameCounter++;
        if (this.frameCounter >= this.slowness) {
            this.frameCounter = 0;
            this.frame++;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.frameCounter = 0;
        }
        if (this.iFrames > 0 && this.iFrames % 2 >= 1) {
            this.sheet = id("sheet-alt");
        } else {
            this.sheet = id("sheet");
        }
        c.drawImage(
            this.sheet,
            this.actionX[this.action][this.frame] * GLOBAL.tilesize,
            this.actionY[this.action][this.frame] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
        //drawLaser(this,this.left);
        this.hpDisplay.render();
    }
}
class VendingMachine extends Entity {
    constructor(x, y) {
        super(x, y);
        this.solid = false;
        this.strikeable = false;
        this.h = 2;
        this.w = 2;
        this.action = 0;
        this.actionX = [5, 5];
        this.actionY = [31, 29];
        this.cooldown = 0;
        this.event = function () {
            player.saving = true;
            player.hp = player.maxHp;
            player.xVel = 0;
            player.yVel = 0;
            player.frameCounter = 0;
            player.frame = 0;
        }
        this.interac = new Interaction(this.x + 0.5, this.y - 0.5, this.event, true);

    }
    compute() {
        if (this.cooldown <= 0 && collided(this, player)) {
            this.action = 1;
        } else {
            this.action = 0;
        }
        if (this.cooldown > 0) {
            this.cooldown -= 1 * dT;
        }
    }
    render() {
        c.drawImage(
            this.sheet,
            this.actionX[this.action] * GLOBAL.tilesize,
            this.actionY[this.action] * GLOBAL.tilesize,
            this.w * GLOBAL.tilesize,
            this.h * GLOBAL.tilesize,
            (this.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
            (this.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio,
            this.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
            this.h * GLOBAL.tilesize * GLOBAL.ratio | 0
        )
    }
}

class MainMenu {
    constructor() {
        this.background = id("menu-background");
        this.continue = [id("menu-continue1"), id("menu-continue2"), ];
        this.newgame = [id("menu-newgame1"), id("menu-newgame2"), ];
        this.state = [0, 0];
        this.optionHitbox1 = {
            x: 176 / GLOBAL.tilesize,
            y: 176 / GLOBAL.tilesize,
            w: this.continue[0].width / GLOBAL.tilesize,
            h: this.continue[0].height / GLOBAL.tilesize,
        }
        this.optionHitbox2 = {
            x: 176 / GLOBAL.tilesize,
            y: 224 / GLOBAL.tilesize,
            w: this.newgame[0].width / GLOBAL.tilesize,
            h: this.newgame[0].height / GLOBAL.tilesize,
        }
        document.onclick = function () {
            if (GLOBAL.loopType !== 2) {
                return;
            }
            if (pointSquareCol(mousePosition, mainMenu.optionHitbox1)) {
                loadCall = 1;

            } else if (pointSquareCol(mousePosition, mainMenu.optionHitbox2)) {
                if (canStorage && window.localStorage["savecode"]) {
                    loadSaveCode();
                    loadCall = 1;
                } else {
                    alert("nothing to load");
                }
            }
        }
    }
    compute() {
        //point square col mouse client / options
        pointSquareCol(mousePosition, this.optionHitbox1) ? this.state[0] = 1 : this.state[0] = 0;
        pointSquareCol(mousePosition, this.optionHitbox2) ? this.state[1] = 1 : this.state[1] = 0;
    }
    render() {
        // Renders background
        c.drawImage(
            this.background,
            0,
            0,
            canvas.width,
            canvas.height)

        // Renders menu options
        c.drawImage(
            this.newgame[this.state[0]],
            this.optionHitbox1.x * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox1.y * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox1.w * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox1.h * GLOBAL.tilesize * GLOBAL.ratio)

        c.drawImage(
            this.continue[this.state[1]],
            this.optionHitbox2.x * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox2.y * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox2.w * GLOBAL.tilesize * GLOBAL.ratio,
            this.optionHitbox2.h * GLOBAL.tilesize * GLOBAL.ratio)
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
        this.voices = [
            [
                new Audio("sounds/voices/beck/0.mp3"),
                new Audio("sounds/voices/beck/1.mp3"),
                new Audio("sounds/voices/beck/2.mp3"),
                new Audio("sounds/voices/beck/3.mp3"),
                new Audio("sounds/voices/beck/4.mp3"),
                new Audio("sounds/voices/beck/5.mp3"),
            ],
            [
                new Audio("sounds/voices/esther/0.mp3"),
                new Audio("sounds/voices/esther/1.mp3"),
                new Audio("sounds/voices/esther/2.mp3"),
                new Audio("sounds/voices/esther/3.mp3"),
                new Audio("sounds/voices/esther/4.mp3"),
                new Audio("sounds/voices/esther/5.mp3"), ],
            [
                new Audio("sounds/voices/jay/0.mp3"),
                new Audio("sounds/voices/jay/1.mp3"),
                new Audio("sounds/voices/jay/2.mp3"),
                new Audio("sounds/voices/jay/3.mp3"),
                new Audio("sounds/voices/jay/4.mp3"),
                new Audio("sounds/voices/jay/5.mp3"), ],
            [],
            [],
            [
                new Audio("sounds/voices/aliquam/0.mp3"),
                new Audio("sounds/voices/aliquam/1.mp3"),
                new Audio("sounds/voices/aliquam/2.mp3"),
                new Audio("sounds/voices/aliquam/3.mp3"),
                new Audio("sounds/voices/aliquam/4.mp3"),
                new Audio("sounds/voices/aliquam/5.mp3"), ],
            [],
        ]
        for (let i = 0; i < this.voices[2].length; i++) {
            this.voices[2][i].baseVolume = 0.5;
        }

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
    compute() {
        slowMoFrames > 0 ? this.playbackRate = 0.5 : this.playbackRate = 1;
    }
}
