import { meta } from "../meta.js";
import { c } from "./../drawingContext.js";
import { map } from "./../map/mapObject.js";
export class DmgText {
    constructor(entity, text) {
        let args = ["DmgText", entity, text];
        this.initialize(args);
    }
    initialize(args) {
        //args[0] is the type
        this.type = args[0];
        let entity = args[1];
        let text = args[2];
        this.x = entity.x + entity.w / 2 + Math.random() * 0.5 - 0.25;
        this.y = entity.y + entity.h / 3 + Math.random() * 0.5 - 0.25;
        this.text = text;
        this.size = 14;
        this.color = "#f5ffe8";
        if (entity.type == "player") {
            this.color = "#ad2f45";
        }
        this.color2 = "#14182e";
        this.removed = false;
        this.solid = false;
        this.yVel = -0.015;
        this.sizeChange = 0.99;
        this.lifeSpan = 40; //duration (in frames) of the text appearence
    }
    compute() {
        this.size *= Math.pow(this.sizeChange, meta.deltaTime);
        this.y += this.yVel * meta.deltaTime;
        this.lifeSpan -= meta.deltaTime;
        if (this.lifeSpan <= 0) {
            this.removed = true;
        }
    }
    render() {
        //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.lineWidth = this.size / 10;
        c.font = "bold " + Math.round(this.size * meta.ratio) + "px" + meta.font;
        c.fillStyle = this.color;
        c.fillText(
            this.text,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio
        );
        c.strokeStyle = this.color2;
        c.strokeText(
            this.text,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio
        );
    }
}

export class StatusText {
    constructor(entity, text) {
        let args = ["StatusText", entity, text];
        this.initialize(args);
    }
    initialize(args) {
        //args[0] is the type
        this.type = args[0];
        let entity = args[1];
        let text = args[2];
        this.x = entity.x + entity.w / 2 + Math.random();
        this.y = entity.y + entity.h / 6;
        this.text = text;
        this.size = 12;
        this.color = "#63ab3f";
        this.color2 = "#14182e";
        this.removed = false;
        this.solid = false;
        this.yVel = -0.015;
        this.sizeChange = 0.99;
        this.lifeSpan = 60; //duration (in frames) of the text appearence
    }
    compute() {
        this.size *= Math.pow(this.sizeChange, meta.deltaTime);
        this.y += this.yVel * meta.deltaTime;
        this.lifeSpan -= meta.deltaTime;
        if (this.lifeSpan <= 0) {
            this.removed = true;
        }
    }
    render() {
        //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.lineWidth = this.size / 10;
        c.font = "bold " + Math.round(this.size * meta.ratio) + "px " + meta.font;
        c.fillStyle = this.color;
        c.fillText(
            this.text,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio
        );
        c.strokeStyle = this.color2;
        c.strokeText(
            this.text,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio
        );
    }
}