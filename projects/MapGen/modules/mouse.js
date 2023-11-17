export class Mouse {
    constructor(canvas, tilesize, camera = { x: 0, y: 0 }) {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.tilesize = tilesize;
        this.camera = camera;
        /** Defines if the mouse is hovering the ui */
        this.absolute = {
            x: 0,
            y: 0,
            hoverUI: false,
            dragging: false,
            slot: {}
        }
        document.addEventListener("mousemove", this.updatePos)
    }
    updatePos = (evt) => {
        this.x = -this.camera.x + (evt.clientX - this.canvas.offsetLeft) / this.tilesize;
        this.y = -this.camera.y + (evt.clientY - this.canvas.offsetTop) / this.tilesize;

        this.absolute.x = (evt.clientX - this.canvas.offsetLeft) / this.tilesize;
        this.absolute.y = (evt.clientY - this.canvas.offsetTop) / this.tilesize;
    }
}