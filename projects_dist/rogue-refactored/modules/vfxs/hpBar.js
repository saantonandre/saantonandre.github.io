import { meta } from "../meta.js";
import { c } from "./../drawingContext.js";
import { map } from "./../map/mapObject.js";
import { SHEET } from "../assets.js"
export class HpBar {
    constructor(source) {
        this.spriteX = [
            [13, 14, 15]
        ];
        this.spriteY = [
            [0, 0, 0]
        ];
        this.source = source;
        this.w = 1;
        this.h = 1;
        this.wRatio = 1;
        this.prevRatio = 1;
    }
    compute() {
        this.x = this.source.x + this.source.w / 2 - this.w / 2;
        this.y = this.source.y - this.h / 2;
        this.wRatio = this.source.hp / this.source.maxHp;
        if (this.prevRatio > this.wRatio) {
            this.prevRatio -= meta.deltaTime / 50;
        }
        if (this.prevRatio < this.wRatio) {
            this.prevRatio = this.wRatio;
        }
    }
    render() {
        // Renders the damaged bar
        c.drawImage(
            SHEET,
            this.spriteX[0][2] * meta.tileSize,
            this.spriteY[0][2] * meta.tileSize,
            this.w * meta.tileSize * this.prevRatio,
            this.h * meta.tileSize,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio,
            this.w * meta.tileSize * meta.ratio * this.prevRatio,
            this.h * meta.tileSize * meta.ratio
        );

        // Renders the bar
        c.drawImage(
            SHEET,
            this.spriteX[0][1] * meta.tileSize,
            this.spriteY[0][1] * meta.tileSize,
            this.w * meta.tileSize * this.wRatio,
            this.h * meta.tileSize,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio,
            this.w * meta.tileSize * meta.ratio * this.wRatio,
            this.h * meta.tileSize * meta.ratio
        );

        // Renders the contour
        c.drawImage(
            SHEET,
            this.spriteX[0][0] * meta.tileSize,
            this.spriteY[0][0] * meta.tileSize,
            this.w * meta.tileSize,
            this.h * meta.tileSize,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio,
            this.w * meta.tileSize * meta.ratio,
            this.h * meta.tileSize * meta.ratio
        );
    }
}