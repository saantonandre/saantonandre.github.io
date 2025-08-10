// Mess: will refactor and iterate over
import { Player } from './entities/player.js';
import { Counter } from './counter.js';

import * as Destructibles from './entities/destructibles.js';
export let counter = new Counter();
export class Game {
    constructor(meta, mouse, controls) {
        this.entities = [];
        this.garbage = [];
        this.spawner;
        this.player;
        this.counter = counter;
        this.initialize(meta, mouse, controls);

    }
    initialize(meta, mouse, controls) {
        this.entities = [];
        this.garbage = [];
        this.player = new Player(meta.tilesWidth / 2 - 1.5, meta.tilesHeight / 2, mouse, controls);
        this.entities.push(this.player);
        this.spawner = new EntitySpawner(this.entities, meta, this.player);
        this.counter.reset();
    }
    compute(meta) {
        this.spawner.compute();
        // Compute/render entities
        this.entities.forEach((entity, i) => {
            // Checks for removal
            if ((entity.xVel > 0 && entity.x > meta.tilesWidth) ||
                (entity.xVel < 0 && entity.x + entity.w < 0) ||
                (entity.yVel > 0 && entity.y > meta.tilesHeight) ||
                (entity.yVel < 0 && entity.y + entity.h < 0 && entity.gForce == 0)) {
                entity.removed = true;
            }
            if (entity.removed) {
                this.garbage.push(i);
                return;
            }
            if (entity.type == 'brick') {
                entity.compute(meta.deltaTime, [this.player]);
            } else {
                entity.compute(meta.deltaTime, this.entities);
            }
        })
        this.removeGarbage();
        this.counter.compute(meta.deltaTime);
    }
    render(context, tilesize, ratio) {
        context.beginPath();
        context.fillStyle = '#aeb5bd';
        context.fillRect(
            0, (this.player.y + this.player.h) * 16 * 2,
            800,
            300
        )
        context.strokeStyle = 'black';
        context.strokeWidth = 2;
        context.moveTo(0, (this.player.y + this.player.h) * 16 * 2)
        context.lineTo(800, (this.player.y + this.player.h) * 16 * 2)
        context.stroke();
        context.closePath();
        this.entities.forEach(entity => {
            if (entity.removed) {
                return;
            }
            entity.render(context, tilesize, ratio);
        })
        this.counter.render(context, tilesize, ratio);
    }
    removeGarbage() {
        this.garbage.reverse().forEach(garbage => {
            this.entities.splice(garbage, 1);
        })
        this.garbage = [];
    }
}



class EntitySpawner {
    constructor(entitiesArr, meta, player) {
        this.timerStart = 50;
        this.timer = this.timerStart;
        this.entities = entitiesArr
        this.speed = 0.2;
        this.meta = meta;
        this.player = player;
    }
    spawn(sequential = false) {
        let rx = (Math.random() * 2 | 0) * (this.meta.tilesWidth + 1) - 1;
        let ry = Math.random() * 10;
        let brick = new Destructibles['Brick'](rx, ry, this.entities);
        brick.xVel = brick.cX < this.player.cX ? this.speed : -this.speed;
        brick.yVel = -this.speed;
        this.entities.push(brick)
        let hands = new Destructibles['Hands'](brick.x, brick.y, brick.xVel > 0)
        this.entities.push(hands)
        if (!sequential && Math.random() * 1.5 | 0) {
            this.spawn(true);
        }
    }
    compute() {
        this.timer -= this.meta.deltaTime;
        if (this.timer <= 0) {
            this.spawn();
            this.timer = this.timerStart;
        }
    }
}