export class Mouse {
    constructor(canvas, meta, camera = { x: 0, y: 0 }) {
        this.x = -100;
        this.y = -100;
        this.canvas = canvas;
        this.meta = meta;
        this.camera = camera;
        /** Defines if the mouse is hovering the ui */
        this.absolute = {
            x: 0,
            y: 0,
            hoverUI: false,
            dragging: false,
            slot: {}
        }
        this.leftButton = false;
        this.middleButton = false;
        this.rightButton = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        document.addEventListener("mousemove", this.updatePos)
        document.addEventListener("mousedown", this.buttonDown)
        document.addEventListener("mouseup", this.buttonUp)
        this.canvas.addEventListener("touchstart", this.touchDown);
        this.canvas.addEventListener("touchmove", this.updateTouchPos);
        this.canvas.addEventListener("touchend", this.touchUp);
    }
    touchDown = (evt) => {
        evt.preventDefault();
        this.leftButton = true;
    }
    touchUp = (evt) => {
        evt.preventDefault();
        this.leftButton = false;

    }
    updateTouchPos = (evt = { changedTouches: [{ pageX: this.lastMouseX, pageY: this.lastMouseY }] }) => {
        evt.preventDefault();
        let touch = evt.changedTouches[0];
        this.lastMouseX = touch.pageX;
        this.lastMouseY = touch.pageY;
        this.x = -this.camera.x + (touch.pageX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.y = -this.camera.y + (touch.pageY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;

        this.absolute.x = (touch.pageX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.absolute.y = (touch.pageY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;
    }
    buttonDown = (evt) => {
        switch (evt.button) {
            case 0:
                this.leftButton = true;
                break;
            case 1:
                this.middleButton = true;
                break;
            case 2:
                this.rightButton = true;
                break;
        }
    }
    buttonUp = (evt) => {
        switch (evt.button) {
            case 0:
                this.leftButton = false;
                break;
            case 1:
                this.middleButton = false;
                break;
            case 2:
                this.rightButton = false;
                break;
        }
    }
    updatePos = (evt = { clientX: this.lastMouseX, clientY: this.lastMouseY }) => {
        this.lastMouseX = evt.clientX;
        this.lastMouseY = evt.clientY;
        this.x = -this.camera.x + (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.y = -this.camera.y + (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;

        this.absolute.x = (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.absolute.y = (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;
    }
}