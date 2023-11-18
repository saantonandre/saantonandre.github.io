function id(arg) {
    return document.getElementById(arg);
}

/********************** Initialize the canvas **********************/
var canvas = id("canvas");
var c = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 700;
c.imageSmoothingEnabled = false;
c.fillRect(0, 0, canvas.width, canvas.height);

var ratio = 1;
var deltaTime = 0;

/********************** Render Hands **********************/
class Paw {
    constructor(which) {
        this.w = 48 * 2;
        this.h = 32 * 2;
        this.which = which;
        this.x = this.which ? canvas.width / 6 * 4 + this.w / 2 : canvas.width / 4 + this.w / 2;
        this.y = canvas.height / 4 * 3;
        this.sprite = [id("paw"), id("pawPress")];
        this.baseX = this.x;
        this.baseY = canvas.height * 1.2 + this.h / 2;
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;
        this.initialX = this.x;
        this.initialY = this.y;
        this.grabbing = 0;
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    }
    compute() {
        let pressed = this.which ? mouse.rightPressed : mouse.leftPressed;
        if (pressed) {
            if (this.centerX < mouse.x) {
                this.x += (mouse.x - this.centerX) / 4;
            } else if (this.centerX > mouse.x) {
                this.x -= (this.centerX - mouse.x) / 4;
            }
            if (this.centerY < mouse.y) {
                this.y += (mouse.y - this.centerY) / 4;
            } else if (this.centerY > mouse.y) {
                this.y -= (this.centerY - mouse.y) / 4;
            }
        } else {
            if (this.centerX < this.initialX) {
                this.x += (this.initialX - this.centerX) / 8;
            } else if (this.centerX > this.initialX) {
                this.x -= (this.centerX - this.initialX) / 8;
            }
            if (this.centerY < this.initialY) {
                this.y += (this.initialY - this.centerY) / 8;
            } else if (this.centerY > this.initialY) {
                this.y -= (this.centerY - this.initialY) / 8;
            }
        }
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;

        this.hitbox.x = this.centerX - 20;
        this.hitbox.y = this.centerY - 20;
        this.hitbox.w = 40;
        this.hitbox.h = 40;

        // Trigger the grab
        if (pressed && !this.grabbing && pointSquareCol(mouse, this.hitbox)) {
            this.grabbing = 1;
            pawsCookiesCol(this.which);

        } else if (this.grabbing && !pressed) {
            this.grabbing = 0;
            pawsCookiesCol(this.which + 2);
        }
    }
    draw() {
        // Draws the hand
        c.lineWidth = 26 * 2;
        c.lineCap = "round"
        c.beginPath();
        c.moveTo(this.baseX, this.baseY);
        c.lineTo(this.centerX, this.centerY + this.h / 2);
        c.stroke();
        c.closePath();

        // Draws the paw
        c.drawImage(
            this.sprite[this.grabbing],
            this.x,
            this.y,
            this.w,
            this.h
        )
    }
}
var paw1 = new Paw(0);
var paw2 = new Paw(1);

/********************** Cookies **********************/
class Gingerbread {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 48 * 2;
        this.h = 64 * 2;
        this.sprite = id("gingerbread");
        // Attachment to paws
        this.leftPaw = {
            attached: false,
            offsetX: 0,
            offsetY: 0
        };
        this.rightPaw = {
            attached: false,
            offsetX: 0,
            offsetY: 0
        };
    }
    compute() {
        if (this.leftPaw.attached) {
            this.x = paw1.centerX + this.leftPaw.offsetX;
            this.y = paw1.centerY + this.leftPaw.offsetY;
        } else if (this.rightPaw.attached) {
            this.x = paw2.centerX + this.rightPaw.offsetX;
            this.y = paw2.centerY + this.rightPaw.offsetY;
        }
    }
    draw() {
        c.drawImage(
            this.sprite,
            this.x,
            this.y,
            this.w,
            this.h
        )
    }
}

var gingerbreads = [];
gingerbreads.push(new Gingerbread(300, 50));
console.log(gingerbreads)
/********************** Main loop of the game **********************/
function loop() {
    fpsCounter++;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(id("bozza"),0,0,canas.width,canvas.height)
    c.fillStyle = "lightgray";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "black";

    // Render gingerbreads
    for (let i = 0; i < gingerbreads.length; i++) {
        gingerbreads[i].compute();
        gingerbreads[i].draw();
    }
    // Render Paws
    paw1.compute();
    paw1.draw();
    paw2.compute();
    paw2.draw();

    requestAnimationFrame(loop);
    //c.fillRect(mouse.x - 10, mouse.y - 10, 20, 20)
}

/********************** Keep Count of the FPS **********************/
var fpsCounter = 0;
var fpsSpan = id("fps-span");

function refreshFpsCounter() {
    fpsSpan.innerHTML = fpsCounter;
    fpsCounter = 0;
}
setInterval(refreshFpsCounter, 1000);

/********************** Keep track of the mouse **********************/

var mouse = {
    x: 50,
    y: 50,
    leftPressed: 0,
    rightPressed: 0
}
// Refresh mouse position
canvas.onmousemove = function (e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
}
canvas.onmousedown = function (e) {
    switch (e.which) {
        case 1:
            mouse.leftPressed = 1;
            break;
        case 2:
            break;
        case 3:
            mouse.rightPressed = 1;
            break;
    }
}
canvas.onmouseup = function (e) {
    switch (e.which) {
        case 1:
            mouse.leftPressed = 0;
            break;
        case 2:
            break;
        case 3:
            mouse.rightPressed = 0;
            break;
    }
}

// Prevent ContextMenu
canvas.oncontextmenu = function (e) {
    e.preventDefault()
}

/********************** Collisions **********************/
function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x > square.x) {
        if (point.x < square.x + square.w) {
            if (point.y > square.y) {
                if (point.y < square.y + square.h) {
                    console.log("col detected")
                    return true;
                }
            }

        }
    }
    return false;
}

// Collisions between paws and gingerbreads
function pawsCookiesCol(action) {
    switch (action) {
        case 0: //left press
            for (let i = 0; i < gingerbreads.length; i++) {
                if (pointSquareCol({
                        x: paw1.centerX,
                        y: paw1.centerY
                    }, gingerbreads[i])) {
                    gingerbreads[i].leftPaw.attached = true;
                    gingerbreads[i].leftPaw.offsetX = gingerbreads[i].x - paw1.centerX;
                    gingerbreads[i].leftPaw.offsetY = gingerbreads[i].y - paw1.centerY;
                    break;
                }
            }
            break;
        case 1: //right press
            for (let i = 0; i < gingerbreads.length; i++) {
                if (pointSquareCol({
                        x: paw2.centerX,
                        y: paw2.centerY
                    }, gingerbreads[i])) {
                    gingerbreads[i].rightPaw.attached = true;
                    gingerbreads[i].rightPaw.offsetX = gingerbreads[i].x - paw2.centerX;
                    gingerbreads[i].rightPaw.offsetY = gingerbreads[i].y - paw2.centerY;
                    break;
                }
            }
            break;
        case 2: //left release
            for (let i = 0; i < gingerbreads.length; i++) {
                    gingerbreads[i].leftPaw.attached = false;
            }
            break;
        case 3: //right release
            for (let i = 0; i < gingerbreads.length; i++) {
                    gingerbreads[i].rightPaw.attached = false;
            }
            break;
    }
}
/********************** Call the Main Loop **********************/
loop();
