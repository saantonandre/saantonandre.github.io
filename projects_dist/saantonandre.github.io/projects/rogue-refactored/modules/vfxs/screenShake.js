import { meta } from "../meta.js";
import { map } from "./../map/mapObject.js";

class ScreenShake {
    constructor() {
        this.duration = 0;
        this.changeX = 0;
        this.changeY = 0;

    }
    compute() {
        if (this.duration > 0) {
            this.resetChanges();
            this.duration -= meta.deltaTime;
            let changeX = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize
            let changeY = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize
            map.x += changeX;
            map.y += changeY;

            this.changeX += changeX;
            this.changeY += changeY;
        } else {
            this.duration = 0;
        }
    }
    resetChanges() {
        //resets the changes
        map.x -= this.changeX;
        map.y -= this.changeY;
        this.changeX = 0;
        this.changeY = 0;
    }
}

export const screenShake = new ScreenShake();