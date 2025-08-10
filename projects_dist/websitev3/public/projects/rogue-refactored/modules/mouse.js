import { canvas } from "./drawingContext.js";
import { meta } from "./meta.js";
import { map } from "./map/mapObject.js"
class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
        // Counting the map.x / map.y offset
        this.map = {
            x: 0,
            y: 0
        };

        // Bounding the functions to the Mouse (to avoid losing the "this")
        this.update = this.update.bind(this);
        this.onClick = this.onClick.bind(this);
        document.addEventListener('mousemove', this.update);
        document.addEventListener('mousedown', this.onClick);
    }
    update(event) {
        this.x = (event.clientX - canvas.offsetLeft) / meta.ratio / meta.tileSize;
        this.y = (event.clientY - canvas.offsetTop) / meta.ratio / meta.tileSize;
        this.map.x = this.x - map.x;
        this.map.y = this.y - map.y;
    }
    onClick() {
        /*
      for (let entity of map.entities) {
        if (pointSquareCol(this.map, entity)) {
          console.log(this.map, entity);
        }
      }
      //*/
    }
}
export const mouse = new Mouse();