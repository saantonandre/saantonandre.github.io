import { Sprite } from './sprite.js';
import * as Physics from '../physics/physics.js';
import { checkCollisions } from '../physics/checkCollisions.js';


export class Entity extends Sprite {
    constructor(x = 0, y = 0) {
        super(x, y);
        this.type = "entity";
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;
        this.xVelExt = 0;
        this.yVelExt = 0;
        this.friction = 0.96;
        this.speed = 0.01;
        this.removed = false;
        this.physics = Physics;
        this.solid = true;
        this.gForce = 0.01;
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0
        }
        this.checkCollisions = checkCollisions;
    }
    onCollision(entity) {

    }
    applyGravity(deltaTime = 1) {
        this.yVel += this.gForce * deltaTime;
    }
    updateVelocities(deltaTime = 1) {
        this.xVel *= Math.pow(this.friction, deltaTime);
        this.xVel *= Math.pow(this.friction, deltaTime);
    }
    /** Adds the velocities to the x y positions */
    updatePosition(deltaTime = 1) {
        this.x += this.xVel * deltaTime;
        this.y += this.yVel * deltaTime;
    }
    compute(deltaTime = 1) {
        // this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera = { x: 0, y: 0 }) {
        this.renderSprite(context, tilesize, ratio, camera);
    }
}