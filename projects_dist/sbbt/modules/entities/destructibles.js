import { Entity } from './entity.js';
import { soundManager } from '../soundManager/soundManager.js'

export class Brick extends Entity {
    constructor(x, y, entitiesArr) {
        super(x, y);
        this.type = "brick";
        this.w = 2;
        this.h = 1;
        this.rot = Math.random() * 2 - 1;
        this.speed = 0.1;
        this.rotSpeed = Math.random() * 0.1 - 0.05;
        this.setAnimation('idle', [(Math.random() * 3 | 0) * this.w], [14])
        this.entitiesArr = entitiesArr;
    }
    computeMovement(deltaTime) {
        this.rot += this.rotSpeed * deltaTime;
        this.applyGravity(deltaTime);

    }
    onCollision(entity) {}
    compute(deltaTime, environment = []) {
        // this.updateSprite(deltaTime)
        this.checkCollisions(this, environment, deltaTime);
        this.computeMovement(deltaTime);
        this.updatePosition(deltaTime);
    }
    render(context, tilesize, ratio) {
        context.fillStyle = 'black';
        this.renderSprite(context, tilesize, ratio, { x: 0, y: 0 }, this.rot)
    }
    explode(xVel, yVel) {
        this.removed = true;
        let particles = [];
        // Amount of big Particles
        let bigAmount = Math.random() * 3 | 0 + 3;
        // Amount of small Particles
        let smallAmount = Math.random() * 5 | 0 + 1;
        for (let i = 0; i < bigAmount; i++) {
            let rx = Math.random() * 0.3 - 0.15;
            let ry = Math.random() * 0.3 - 0.15;
            let p = new BrickParticle(this.x + rx, this.y + ry, false)
            p.xVel = Math.random() * (xVel / 2) + xVel / 2;
            p.yVel = Math.random() * (yVel / 2) + yVel / 2;
            particles.push(p);
        }
        for (let i = 0; i < smallAmount; i++) {
            let rx = Math.random() * 0.3 - 0.15;
            let ry = Math.random() * 0.3 - 0.15;
            let p = new BrickParticle(this.x + rx, this.y + ry, true)
            p.xVel = Math.random() * (xVel / 2) + xVel / 2;
            p.yVel = Math.random() * (yVel / 2) + yVel / 2;
            particles.push(p);
        }
        particles.forEach(p => {
            this.entitiesArr.push(p);
        });
    }
}
export class Hands extends Entity {
    constructor(x, y, fromLeft) {
        super(x, y);
        this.w = 2;
        this.h = 2;
        this.solid = false;
        this.speed = 0.2;
        this.fromLeft = fromLeft;
        this.xVel = fromLeft ? this.speed : -this.speed;
        this.yVel = -0.01;
        this.left = fromLeft ? 1 : 0;
        this.dir = this.xVel;
        this.setAnimation('idle', [0], [11])
        this.setAnimation('idle', [2], [11], 1)
        soundManager.sounds['oh'].play(0.5);
    }
    compute(deltaTime) {
        let screenWidth = 25;
        // this.updateSprite(deltaTime)
        this.updateSprite(deltaTime)
        this.updatePosition(deltaTime);
        if (this.fromLeft && this.x > 0) {
            this.x = 0;
            this.xVel = -this.xVel / 2;
        }
        if (!this.fromLeft && this.x + this.w < screenWidth) {
            this.x = screenWidth - this.w;
            this.xVel = -this.xVel / 2;
        }
        if (this.dir !== this.xVel && (this.x > screenWidth) || this.x + this.w < 0) {
            this.removed = true;
        }
    }
    render(context, tilesize, ratio) {
        this.renderSprite(context, tilesize, ratio)
    }
}
class BrickParticle extends Entity {
    constructor(x, y, small = false) {
        super(x, y);
        this.w = 1;
        this.h = 1;
        this.rotSpeed = Math.random() * 0.5 - 0.25;
        this.solid = false;
        this.type = 'particle';
        if (small) {
            let w = 0.2;
            let h = 0.2;
            this.hitbox = {
                x: this.x + (this.w - w) / 2,
                y: this.y + (this.h - h) / 2,
                w: w,
                h: h
            }
            this.setAnimation('idle', [Math.random() * 5 | 0], [16])
        } else {
            this.setAnimation('idle', [Math.random() * 4 | 0], [15])
        }
    }
    computeMovement(deltaTime) {
        this.rot += this.rotSpeed * deltaTime;
        this.applyGravity(deltaTime);

    }
    onCollision(entity) {}
    compute(deltaTime, environment = []) {
        // this.updateSprite(deltaTime)
        this.checkCollisions(this, environment, deltaTime);
        this.computeMovement(deltaTime);
        this.updatePosition(deltaTime);
    }
    render(context, tilesize, ratio) {
        this.renderSprite(context, tilesize, ratio, { x: 0, y: 0 }, this.rot)
    }
}