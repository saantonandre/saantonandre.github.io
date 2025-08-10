import { Entity } from "../entity.js";

import { tiles } from "./tiles.js";

import { meta } from "../../meta.js";
import { map } from "./../../map/mapObject.js"
import { c } from "./../../drawingContext.js"

export class Block extends Entity {
    // A normal, collidable block
    constructor(x, y) {
        super(x, y);
        this.type = "bg";
        this.immovable = false;
        this.tile = 0;
    }
    compute() {}
    render() {
        // Basic rendering cannon apply (updateSprite(),renderSprite())
        c.drawImage(
            this.sheet,
            tiles[this.tile][0] * meta.tileSize,
            tiles[this.tile][1] * meta.tileSize,
            meta.tileSize,
            meta.tileSize,
            ((this.x + map.x) * meta.tileSize * meta.ratio) | 0,
            ((this.y + map.y) * meta.tileSize * meta.ratio) | 0,
            this.w * meta.tileSize * meta.ratio,
            this.h * meta.tileSize * meta.ratio
        );
    }
}