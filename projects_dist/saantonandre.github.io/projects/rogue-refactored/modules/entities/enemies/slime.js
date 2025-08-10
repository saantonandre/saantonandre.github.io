import { Enemy } from "./enemy.js";
import { distance, getRotation, collided } from "./../../physics.js";
import { meta } from "../../meta.js";
import { map } from "./.././../map/mapObject.js"

import { player } from "./../player/player.js"
export class Slime extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.state = "idle";
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

    }
    computeState() {
        if (this.xVel > 0) {
            this.left = false;
        } else if (this.xVel < 0) {
            this.left = true;
        }
        let rotation, xTarget, yTarget;
        switch (this.state) {
            case "idle":
                this.action = 2;
                this.xVel = 0;
                this.yVel = 0;
                if (distance(this, player) < this.aggroRange) {
                    this.state = "chase";
                }
                break;
            case "flee":
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
                    this.state = "idle";
                }
                break;
            case "chase":
                rotation = getRotation(this, player);
                xTarget = Math.cos(rotation);
                yTarget = Math.sin(rotation);

                this.xVel = xTarget * this.speed;
                this.yVel = yTarget * this.speed;
                this.action = 2;
                if (distance(this, player) < this.attackRange) {
                    this.state = "windup";
                }
                break;
            case "windup":
                this.action = 6;
                this.xVel = 0;
                this.yVel = 0;
                this.windupFrames -= meta.deltaTime;
                if (this.windupFrames <= 0) {
                    this.state = "attack";
                    this.windupFrames = 30;
                    this.attackFrames = 30;
                    this.targetRot = getRotation(this, player);
                }
                break;
            case "damaged":
                this.action = 4;
                this.xVel = 0;
                this.yVel = 0;
                this.windupFrames = 30;
                if (this.dmgFrames > 0) {
                    this.dmgFrames -= meta.deltaTime;
                } else {
                    this.state = "idle";
                }
                break;
            case "attack":
                this.action = 8;
                rotation = this.targetRot;
                xTarget = Math.cos(rotation);
                yTarget = Math.sin(rotation);

                this.xVel = xTarget * this.speed * this.dashSpeed;
                this.yVel = yTarget * this.speed * this.dashSpeed;
                if (this.attackFrames > 0) {
                    this.attackFrames -= meta.deltaTime;
                } else {
                    this.state = "idle";
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
        if (this.state == "attack" && collided(this, player)) {
            player.onHit(this);

            this.fleeing = 120;
            this.state = "flee";
        }
        map.checkCollisions(this);
        this.hpBar.compute();
        this.displayName.compute();
    }
}