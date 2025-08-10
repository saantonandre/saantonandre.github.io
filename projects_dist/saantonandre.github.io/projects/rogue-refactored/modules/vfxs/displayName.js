import { meta } from "../meta.js";
import { c } from "./../drawingContext.js";
import { map } from "./../map/mapObject.js";
export class DisplayName {
    constructor(source) {

        this.source = source;
        this.w = 1;
        this.h = 1;
        this.prevRatio = 1;
        this.text = "LV." + this.source.lv;
        this.text2 = (this.source.name || this.source.type);
        this.color = "#f5ffe8";
        this.color2 = "#ffae70aa";
        this.size = 5;
        this.size2 = 6;
    }
    compute() {
        this.x = this.source.x + this.source.w / 2;
        this.y = this.source.y - this.h / 2;
        this.y2 = this.source.y - this.h / 4.5;
    }
    render() {
        // Renders the text

        //c.font = Math.round(this.size * meta.ratio) + "px" + " 'Press Start 2P'";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.lineWidth = this.size / 10;
        c.font = "bold " + Math.round(this.size * meta.ratio) + "px" + " Consolas, 'Courier New', monospace";
        c.fillStyle = this.color;
        c.fillText(
            this.text,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y + map.y) * meta.tileSize * meta.ratio
        );
        c.font = "bold " + Math.round(this.size2 * meta.ratio) + "px" + " Consolas, 'Courier New', monospace";
        c.fillStyle = this.color2;
        c.fillText(
            this.text2,
            (this.x + map.x) * meta.tileSize * meta.ratio,
            (this.y2 + map.y) * meta.tileSize * meta.ratio
        );
    }
}