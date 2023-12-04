import { spritesheet } from "../resourceManager.js";
export class Sprite {
    constructor(x, y, w = 1, h = 1) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        /** Each entity has this same default spritesheet, but it can get rewritten */
        this.sheet = spritesheet;
        /** The animation currently rendering (defaults to 'idle') */
        this.animation = "idle";
        this.animations = {};

        /** The animation currently rendering (defaults to 'idle') */
        this.display = true;
        this.frame = 0;
        this.left = 0;
        this.frameCounter = 0;
        //this.setAnimation("idle", [0], [0]);


    }
    get cX() { return this.x + this.w / 2 };
    get cY() { return this.y + this.h / 2 };
    /** Returns true if the animation has changed, false otherwise 
     * 
     *  Usage example: this.loadAnimation('attack')
     */
    loadAnimation(label) {
        if (this.animation === label) {
            return false;
        }
        this.frameCounter = 0;
        this.frame = 0;
        this.animation = label;
        return true;
    }
    /** 
     * What happens after the current animation ends (this function gets rewritten by entities classes) 
     * If no action are specified for the current animation, it will just reiterates
     */
    onAnimationEnd() {
        /** 
         *  // Example code inside this function:
         * 
         * switch(this.animation){
         *      case 'death':
         *          this.removed=true;
         *          break;
         *      case 'attack':
         *          this.loadAnimation('idle');
         *          break;
         * }
         * 
         */
    }
    renderHitbox() {}
    /** Renders the base sprite, not animated, as a static icon in a specific location */
    renderItem(x, y, context, tilesize, ratio, w = 1, h = 1) {
        context.drawImage(
            this.sheet, // source of the sprite
            this.animations['idle'].keyframesX[0][0] * tilesize, // x pos of the sprite
            this.animations['idle'].keyframesY[0][0] * tilesize, // y pos of the sprite
            this.animations['idle'].w * tilesize, // width of the sprite
            this.animations['idle'].h * tilesize, // height of the sprite
            x * tilesize * ratio, // x of the entity
            y * tilesize * ratio, // y of the entity
            w * tilesize * ratio, // width of the entity
            h * tilesize * ratio // height of the entity
        );
    }
    /** Progresses the sprite animation */
    updateSprite(deltaTime) {
        this.frameCounter += deltaTime;
        if (this.frameCounter >= this.animations[this.animation].slowness) {
            this.frame++;
            this.frameCounter = 0;
        }
        /** If the current frame exceeded the current animation length */
        if (this.frame >= this.animations[this.animation].keyframesX[this.left].length) {
            this.frame = 0;
            this.frameCounter = 0;
            this.onAnimationEnd();
        }
    }
    /** Adds or overwrites an animation 
     * 
     *  Example usage: this.setAnimation('attack',[0,0,0],[1,2,3])
     *  
     */
    setAnimation(label, keyframesX, keyframesY, left = 0) {
        if (!this.animations[label]) {
            this.animations[label] = new Animation(this);
        }
        if (left) {
            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        } else {
            /** If left-facing animation was not specified use the keyframes for both ways */
            this.animations[label].keyframesX[0] = keyframesX;
            this.animations[label].keyframesY[0] = keyframesY;

            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        }

    }
    renderSprite(context, tilesize, ratio, camera = { x: 0, y: 0 }, rot = false, pivot = { x: this.w / 2, y: this.h / 2 }) {
        if (!this.display) {
            /** Skips rendering */
            return;
        }
        if (this.removed) {
            //console.log('rendering a removed entity!!!')
        }

        if (rot) {
            /** Rotated Rendering */
            context.save();
            context.translate(
                (this.x + this.animations[this.animation].offsetX + pivot.x + camera.x) * tilesize * ratio,
                (this.y + this.animations[this.animation].offsetY + pivot.y + camera.y) * tilesize * ratio
            )
            context.rotate(rot);
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (-pivot.x) * tilesize * ratio, // x of the entity
                (-pivot.y) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
            context.restore();
        } else {
            /** Default Rendering */
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (this.x + this.animations[this.animation].offsetX + camera.x) * tilesize * ratio, // x of the entity
                (this.y + this.animations[this.animation].offsetY + camera.y) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
        }
    }
    debugPoint(point, context, tilesize, ratio, camera = { x: 0, y: 0 }) {
        /** Default Rendering */
        context.fillStyle = 'red';
        let size = 0.1;
        context.fillRect(
            (point.x + camera.x - size / 2) * tilesize * ratio, // x of the entity
            (point.y + camera.y - size / 2) * tilesize * ratio, // y of the entity
            size * tilesize * ratio, // width of the entity
            size * tilesize * ratio // height of the entity
        );
    }
    /** Renders an entity as just a filled square */
    renderSquare(context, tilesize, ratio, camera = { x: 0, y: 0 }, rot = false, pivot = { x: this.w / 2, y: this.h / 2 }) {
        if (!this.display) {
            /** Skips rendering */
            return;
        }
        if (this.removed) {
            //console.log('rendering a removed entity!!!')
        }

        if (rot) {
            /** Rotated Rendering */
            context.save();
            context.translate(
                (this.x + pivot.x + camera.x) * tilesize * ratio,
                (this.y + pivot.y + camera.y) * tilesize * ratio
            )
            context.rotate(rot);
            context.fillRect(
                (-pivot.x) * tilesize * ratio, // x of the entity
                (-pivot.y) * tilesize * ratio, // y of the entity
                this.w * tilesize * ratio, // width of the entity
                this.h * tilesize * ratio // height of the entity
            );
            context.restore();
        } else {
            /** Default Rendering */
            context.fillRect(
                (this.x + camera.x) * tilesize * ratio, // x of the entity
                (this.y + camera.y) * tilesize * ratio, // y of the entity
                this.w * tilesize * ratio, // width of the entity
                this.h * tilesize * ratio // height of the entity
            );
        }
    }

}
class Animation {
    constructor(entity) {
        /** X positions on the spritesheet */
        this.keyframesX = [
            [],
            []
        ];
        /** Y positions on the spritesheet */
        this.keyframesY = [
            [],
            []
        ];
        /** Defines how many game-frames should be skipped before each next animation-frame */
        this.slowness = 6;
        // Size standards to the entity size, but can be changed
        this.w = entity.w;
        this.h = entity.h;
        // Some Animations may need an offset relatively to the entity position
        this.offsetX = (entity.w - this.w) / 2;
        this.offsetY = (entity.h - this.h) / 2;
    }
}