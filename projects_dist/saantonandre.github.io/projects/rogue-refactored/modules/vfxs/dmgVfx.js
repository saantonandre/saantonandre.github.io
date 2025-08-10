import { meta } from "../meta.js";
import { c } from "./../drawingContext.js";
import { map } from "./../map/mapObject.js";
import { SHEET } from "./../assets.js"
export class DmgVfx {
    constructor(entity, which) {
        let args = ["DmgVfx", entity, which];
        this.initialize(args);
    }
    initialize(args) {
        //args[0] is the type
        let entity = args[1];
        let which = args[2] || (Math.random() * 2) | 0;
        this.x = entity.x + entity.w / 2 + Math.random() * 0.5 - 0.25;
        this.y = entity.y + entity.h / 2 + Math.random() * 0.5 - 0.25;
        this.type = "DmgVfx";

        this.removed = false;
        this.solid = false;

        this.action = which;
        this.actionX = [
            [17, 17, 17, 17],
            [18, 18, 18, 18],
        ];
        this.actionY = [
            [0, 1, 2, 3],
            [0, 1, 2, 3],
        ];

        this.w = 1;
        this.h = 1;
        this.x -= this.w / 2;
        this.y -= this.h / 2;
        this.frame = 0;
        this.frameCounter = 0;
        this.slowness = 6;
    }
    compute() {}
    onActionEnded() {
        switch (this.action) {
            default:
                this.removed = true;
        }
    }
    render() {
        this.frameCounter += meta.deltaTime;
        if (this.frameCounter >= this.slowness) {
            this.frame++;
            this.frameCounter = 0;
        }
        if (this.frame >= this.actionX[this.action].length) {
            this.frame = 0;
            this.onActionEnded();
            if (this.removed) {
                return;
            }
        }
        c.drawImage(
            SHEET,
            this.actionX[this.action][this.frame] * meta.tileSize,
            this.actionY[this.action][this.frame] * meta.tileSize,
            this.w * meta.tileSize,
            this.h * meta.tileSize,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio,
            this.w * meta.tileSize * meta.ratio,
            this.h * meta.tileSize * meta.ratio
        );
    }
}