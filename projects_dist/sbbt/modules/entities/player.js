import { counter } from '../game.js'
import { soundManager } from '../soundManager/soundManager.js';
let sounds = soundManager.sounds;
import { Entity } from './entity.js';
export class Player extends Entity {
    constructor(x, y, mouse, controls) {
        super(x, y);
        this.type = "player";
        // Initializes event listeners
        this.w = 3;
        this.h = 5;
        let left = 1;
        this.animation = 'idle';
        this.setAnimation('idle', [0], [0])
        this.setAnimation('idle', [3], [0], left);
        this.setAnimation('charge', [6, 6], [0, 5])
        this.setAnimation('charge', [9, 9], [0, 5], left)
        this.setAnimation('punch', [12], [0])
        this.setAnimation('punch', [15], [0], left)
        this.mouse = mouse;
        this.controls = controls;
        this.charging = false;
        this.punchDuration = 0;

        this.arm = new Arm(this);

        this.hitbox = {
            x: 0,
            y: 0,
            w: 2,
            h: 2
        }
    }
    updateHitbox() {
        this.hitbox.x = this.x + (this.w - this.hitbox.w) / 2;
        this.hitbox.y = this.y + (this.h - this.hitbox.h) / 2;
    }
    onCollision(entity) {
        if (entity.type !== 'brick') {
            return false;
        }
        entity.xVel = 0;
    }
    // Responds to inputs
    handleControls(deltaTime) {
        if (this.punchDuration > 0) {
            this.punchDuration -= deltaTime;
            if (this.punchDuration <= 0) {
                // Finished the animation
                this.loadAnimation('idle');
            }
            return;
        }
        if (this.mouse.x < this.cX) {
            this.left = 1;
        } else {
            this.left = 0;
        }
        if (this.charging) {
            if (!this.controls.lClickDown) {
                this.charging = false;
                this.punchDuration = 30;
                this.loadAnimation('punch');
                this.arm.computeRotation(this.mouse);
                sounds['sword-attack'].play(0.2);
            }
        } else {
            if (this.controls.lClickDown) {
                this.charging = true;
                this.loadAnimation('charge');
            }
        }
    }
    compute(deltaTime, environment) {
        this.updateHitbox();
        this.updateSprite(deltaTime);
        this.checkCollisions(this, environment, deltaTime);
        this.handleControls(deltaTime);
        this.updatePosition(deltaTime);
        if (this.punchDuration > 0) {
            this.arm.compute(deltaTime, environment, this.mouse);
        }
    }
    render(context, tilesize, ratio) {
        // context.fillStyle = "black";
        this.renderSprite(context, tilesize, ratio)
        if (this.punchDuration > 0) {
            this.arm.render(context, tilesize, ratio);
        }
    }
}
class Arm extends Entity {
    constructor(source) {
        super();
        this.type = 'arm';
        this.rot = 0;
        // The rotation center
        // 41,27 or 8,27

        this.w = 2;
        this.h = 1;

        // Offset from the source (when facing right)
        this.offsetR = {
            x: 41 / 16,
            y: 27 / 16 - this.h / 2
        }
        // Offset from the source (when facing left)
        this.offsetL = {
            x: 8 / 16 - this.w,
            y: 27 / 16 - this.h / 2
        }

        this.offset = this.offsetL;
        this.source = source;
        this.x = source.x;
        this.y = source.y;

        let left = 1;
        this.setAnimation('idle', [0], [13]);
        this.setAnimation('idle', [2], [13], left);

        // Pivot/joint relative to itself
        this.pivotR = { x: 0, y: this.h / 2 };
        this.pivotL = { x: this.w, y: this.h / 2 };
        this.pivot = this.pivotL;

        this.fist = new Fist(this);

    }
    computeRotation(mouse) {
        // Take the arm pivot and find the radians towards the mouse
        if (this.source.left) {
            this.left = 1;
            this.pivot = this.pivotL;
            this.offset = this.offsetL;
        } else {
            this.left = 0;
            this.pivot = this.pivotR;
            this.offset = this.offsetR;
        }
        this.x = this.source.x + this.offset.x;
        this.y = this.source.y + this.offset.y;
        this.rot = this.physics.getAngle(this.pivot.x + this.x, this.pivot.y + this.y, mouse.x, mouse.y);
        this.fist.update()
        if (this.left) {
            this.rot += Math.PI;
        }
    }
    compute(deltaTime, environment, mouse) {
        this.updateSprite(deltaTime);
        this.updatePosition(deltaTime);
        this.fist.compute(deltaTime, environment);
    }
    render(context, tilesize, ratio) {
        this.renderSprite(context, tilesize, ratio, { x: 0, y: 0 }, this.rot, this.pivot)
    }
}
class Fist extends Entity {
    constructor(source) {
        super();
        this.source = source;
        this.type = 'fist';
        this.w = 0.5;
        this.h = 0.5;
    }
    update() {
        let src = this.source;
        let xTarget = Math.cos(src.rot);
        let yTarget = Math.sin(src.rot);
        this.x = src.x + src.pivot.x + src.w * xTarget - this.w / 2;
        this.y = src.y + src.pivot.y + src.w * yTarget - this.h / 2;
    }
    onCollision(entity) {
        if (entity.type !== 'brick') {
            return false;
        }
        sounds.playRandom(['click-2', 'click-3']);
        this.source.source.punchDuration = 1;
        entity.type = 'brokenBrick';
        let rot = this.source.rot;
        if (this.source.left) {
            rot += Math.PI;
        }
        counter.brickCount++;
        entity.explode(Math.cos(rot) / 3, Math.sin(rot) / 3);
    }
    compute(deltaTime, environment) {
        // Check for collisions
        this.checkCollisions(this, environment, deltaTime)
    }
}