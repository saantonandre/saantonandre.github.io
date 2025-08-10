import { Entity } from "./../entity.js";

import { meta } from "./../../meta.js";
import { map } from "./../../map/mapObject.js";
import { controls } from "./../../controls.js"
import { c } from "./../../drawingContext.js"

import { collided } from "./../../physics.js";


export class Sword extends Entity {
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
                this.sheet,
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