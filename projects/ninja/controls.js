var debug = {
    on: true,
    log: function (arg) {
        if (this.on) {
            console.log(arg);
        }
    }
}
// Controls class
class Controls {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        
        this.upArrow = false;
        this.downArrow = false;
        this.leftArrow = false;
        this.rightArrow = false;
        
        this.lClickDown = false;
        this.rClickDown = false;
        this.test = "test";
        this.currentPos = 0;
        this.initListeners(this);
    }
    // Event Listeners (to change controls' values)
    initListeners(x) {
        document.oncontextmenu = function () {
            return false;
        }
        document.addEventListener("mousedown", function (evt) {
            switch (evt.which) {
                case 1:
                    debug.log("Left MouseDown");
                    x.lClickDown = true;
                    break;
                case 3:
                    debug.log("Right MouseDown");
                    x.rClickDown = true;
                    break;
            }

        })
        document.addEventListener("mouseup", function (evt) {
            switch (evt.which) {
                case 1:
                    debug.log("Left MouseUp");
                    x.lClickDown = true;
                    break;
                case 3:
                    debug.log("Right MouseUp");
                    x.rClickDown = true;
                    break;
            }

        })
        document.addEventListener("keydown", function (evt) {
            evt.preventDefault();
            switch (evt.keyCode) {
                case 87: //up
                case 32:
                    debug.log("Up key");
                    x.up = true;
                    break;
                case 83: //down
                    debug.log("Down key");
                    x.down = true;
                    break;
                case 65: //left
                    debug.log("Left key");
                    x.left = true;
                    break;
                case 68: //right
                    debug.log("Right key");
                    x.right = true;
                    break;
                case 37: //left
                    debug.log("Left key");
                    x.leftArrow = true;
                    break;
                case 38: //up
                    debug.log("Up key");
                    x.upArrow = true;
                    break;
                case 39: //right
                    debug.log("Right key");
                    x.rightArrow = true;
                    break;
                case 40: //down
                    debug.log("Down key");
                    x.downArrow = true;
                    break;
            }
        })
        document.addEventListener("keyup", function (evt) {
            evt.preventDefault();
            switch (evt.keyCode) {
                case 87: //up
                case 32:
                    x.up = false;
                    break;
                case 83: //down
                    x.down = false;
                    break;
                case 65: //left
                    x.left = false;
                    break;
                case 68: //right
                    x.right = false;
                    break;
                case 37: //left
                    x.leftArrow = false;
                    break;
                case 38: //up
                    x.upArrow = false;
                    break;
                case 39: //right
                    x.rightArrow = false;
                    break;
                case 40: //down
                    x.downArrow = false;
                    break;
            }
        })
    }
}
var controls = new Controls();
