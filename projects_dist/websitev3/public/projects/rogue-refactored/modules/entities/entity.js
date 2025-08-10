import { map } from "./../map/mapObject.js";
import { c } from "./../drawingContext.js";
import { meta } from "./../meta.js"
import { SHEET } from "./../assets.js"
export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xVel = 0;
        this.yVel = 0;
        this.w = 1;
        this.h = 1;
        this.type = "null";
        this.immovable = false;
        this.damaged = false;
        this.state = "idle";
        this.shadow = false;
        this.notSolid = false;
        this.removed = false;
        this.left = 0;

        this.sheet = SHEET;
        this.action = 0;
        this.frame = 0;
        this.frameCounter = 0;
        this.slowness = 6;

        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0,
        };
    }
    compute() {}
    onActionEnded() {
        // What happens after the animation ended
    }
    updateSprite() {
        this.frameCounter += meta.deltaTime;
        if (this.frameCounter >= this.slowness) {
            this.frame++;
            this.frameCounter = 0;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.onActionEnded();
        }
    }
    renderSprite() {
        if (this.removed) {
            // If the entity is removed, don't bother rendering
            return;
        }
        c.drawImage(
            SHEET, // source of the sprite
            this.actionX[this.action + this.left][this.frame] * meta.tileSize, // x pos of the sprite
            this.actionY[this.action + this.left][this.frame] * meta.tileSize, // y pos of the sprite
            this.w * meta.tileSize, // width of the sprite
            this.h * meta.tileSize, // height of the sprite
            (this.x + map.x) * meta.tileSize * meta.ratio, // x of the entity
            (this.y + map.y) * meta.tileSize * meta.ratio, // y of the entity
            this.w * meta.tileSize * meta.ratio, // width of the entity
            this.h * meta.tileSize * meta.ratio // height of the entity
        );
    }

    renderShadow() {
        // Canon Shadow rendering (PROVISIONAL)
        c.fillStyle = "#14182e";
        c.beginPath();
        c.ellipse(
            (this.x + map.x + this.w / 2) * meta.tileSize * meta.ratio,
            (this.y + this.h + map.y) * meta.tileSize * meta.ratio,
            this.w / 2 * meta.tileSize * meta.ratio,
            this.w / 4 * meta.tileSize * meta.ratio,
            0,
            0,
            2 * Math.PI);
        c.fill();
    }
}