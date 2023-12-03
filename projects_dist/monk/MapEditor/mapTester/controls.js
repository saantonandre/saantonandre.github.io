var debug = {
    on: false,
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
        this.up2 = false;
        this.down2 = false;
        this.left2 = false;
        this.right2 = false;
        this.lClickDown = false;
        this.rClickDown = false;
        this.test = "test";
        this.currentPos = 0;
        this.initListeners(this);
        this.upRel = false;
        this.downRel = false;
        this.leftRel = false;
        this.rightRel = false;
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
                    
                case 38:
                    x.up2 = true;
                    break;
                case 40: //down
                    x.down2 = true;
                    break;
                case 37: //left
                    x.left2 = true;
                    break;
                case 39: //right
                    x.right2 = true;
                    break;
            }
        })
        document.addEventListener("keyup", function (evt) {
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
                    
                case 38:
                    x.up2 = false;
                    x.upRel = true;
                    break;
                case 40: //down
                    x.down2 = false;
                    x.downRel = true;
                    break;
                case 37: //left
                    x.left2 = false;
                    x.leftRel = true;
                    break;
                case 39: //right
                    x.right2 = false;
                    x.rightRel = true;
                    break;
            }
        })
    }
}
var controls = new Controls();
function resetBtnReleases(ctrl){
        ctrl.upRel = false;
        ctrl.downRel = false;
        ctrl.leftRel = false;
        ctrl.rightRel = false;
}
