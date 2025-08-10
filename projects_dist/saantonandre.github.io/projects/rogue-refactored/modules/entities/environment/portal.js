import { Entity } from "./../entity.js";
import { meta } from "../../meta.js";
import { map } from "./../../map/mapObject.js"
import { c } from "./../../drawingContext.js"
import { player } from "./../player/player.js"
import { collided } from "./../../physics.js";
export class Portal extends Entity {
    // A portal which takes you to another room
    constructor(x, y, dir, id) {
        super(x, y);
        this.dir = dir;
        this.id = id;
        this.notSolid = false;
        this.type = "portal";

        this.spriteW = 3;
        this.spriteH = 1;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };

        this.action = 0;
        /*
        0 : closed,
        1 : opening,
        2 : open,
        3 : closing
        */
        this.actionX = [
            [15],
            [15, 15, 15, 15, 15, 15, 15, 15, 15],
            [15],
            [15, 15, 15, 15, 15, 15, 15, 15, 15]
        ]
        this.actionY = [
            [19],
            [19, 20, 21, 22, 23, 24, 25, 26, 27],
            [27],
            [27, 26, 25, 24, 23, 22, 21, 20, 19]
        ]

        this.rot = 0;
        if (this.dir[0]) {
            if (this.dir[0] == 1) {
                // portal to the right
                this.rot = 90;
            } else {
                // portal to the left
                this.rot = -90;
            }
        } else {
            if (this.dir[1] == 1) {
                // portal to the bottom
                this.rot = 180;
            } else {
                // portal to the top
                this.rot = 0;
            }
        }
    }
    computeAction() {
        let enemiesAlive = false;
        for (let entity of map.entities) {
            if (entity.removed) {
                continue;
            }
            if (entity.type == "enemy") {
                enemiesAlive = true;
                break;
            }
        }

        if (this.action == 0 && !enemiesAlive) {
            this.action = 1;
        }
        if (this.action == 2 && enemiesAlive) {
            this.action = 3;
        }
    }
    compute() {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hitbox.w = this.w;
        this.hitbox.h = this.h;
        if (this.notSolid && collided(this, player)) {
            // Move player to the linked level
            map.changeLevel(this.dir);
        }
        this.computeAction();
    }
    onActionEnded() {
        switch (this.action) {
            case 1:
                this.action = 2;
                this.notSolid = true;
                break;
            case 3:
                this.action = 0;
                this.notSolid = false;
                break;
        }
    }
    render() {
        this.updateSprite();
        if (this.removed) {
            // If the entity is removed, don't bother rendering
            return;
        }
        c.save();
        c.translate(
            (this.x + this.w / 2 + map.x) * meta.tileSize * meta.ratio,
            (this.y + this.h / 2 + map.y) * meta.tileSize * meta.ratio
        );
        c.rotate((this.rot * Math.PI) / 180);
        c.drawImage(
            this.sheet, // source of the sprite
            this.actionX[this.action][this.frame] * meta.tileSize, // x pos of the sprite
            this.actionY[this.action][this.frame] * meta.tileSize, // y pos of the sprite
            this.spriteW * meta.tileSize, // width of the sprite
            this.spriteH * meta.tileSize, // height of the sprite
            (-this.spriteW / 2) * meta.tileSize * meta.ratio, // x of the entity
            (-this.spriteH / 2) * meta.tileSize * meta.ratio, // y of the entity
            this.spriteW * meta.tileSize * meta.ratio, // width of the entity
            this.spriteH * meta.tileSize * meta.ratio // height of the entity
        );
        c.restore();
    }
}