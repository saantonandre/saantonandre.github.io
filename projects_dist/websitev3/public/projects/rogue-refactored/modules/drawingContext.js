/* eslint-disable quotes */
/**
 * Responsible for holding the canvas context, needs to be imported by rendered elements.
 */
import { meta } from "./meta.js";
class DrawingContext {
    /**
     * @param {number} width Width of the canvas (px)
     * @param {number} height Height of the canvas (px)
     */
    constructor(width, height) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.c = this.canvas.getContext("2d");

        this.c.imageSmoothingEnabled = false; // Turns off Anti-Aliasing

        document.body.appendChild(this.canvas); // Adds the canvas element to the DOM

        this.resize = this.resize.bind(this); // Makes the event refer to this object instead of the Window object

        window.onresize = this.resize;
        this.resize();
    }
    resize() {
        this.canvas.style.position = "absolute";
        this.canvas.style.left = (window.innerWidth - this.canvas.width) / 2 + "px";
        this.canvas.style.top = (window.innerHeight - this.canvas.height) / 2 + "px";

    }
}
export const { canvas, c } = new DrawingContext(
    meta.tilesWidth * meta.ratio * meta.tileSize,
    meta.tilesHeight * meta.ratio * meta.tileSize
);