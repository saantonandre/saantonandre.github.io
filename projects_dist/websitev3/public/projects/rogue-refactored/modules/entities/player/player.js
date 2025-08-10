import { meta } from "./../../meta.js";
import { map } from "./../../map/mapObject.js";
import { controls } from "./../../controls.js"
import { c } from "./../../drawingContext.js"
import { screenShake } from "./../../vfxs/screenShake.js";
import { vfxsManager } from "./../../vfxs/vfxsManager.js";

import { Entity } from "./../entity.js";

import { ExpManager } from "./expManager.js";

import { Sword } from "./sword.js";

import { collided } from "./../../physics.js";

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
            this.sheet,
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
            this.sheet,
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
export let player = new Player(10.5, 7.5);