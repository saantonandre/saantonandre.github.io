function id(arg) {
    return document.getElementById(arg);
}

/********************** Initialize the canvas **********************/
var canvas = id("canvas");
var c = canvas.getContext("2d");
var ratio = 1;
var deltaTime = 0;
canvas.width = 450 * ratio;
canvas.height = 350 * ratio;
c.imageSmoothingEnabled = false;
c.fillRect(0, 0, canvas.width, canvas.height);


/********************** Render Hands **********************/
class Paw {
    constructor(which) {
        this.w = 48;
        this.h = 32;
        this.which = which;
        this.x = this.which ? 450 / 6 * 4 + this.w / 2 : 450 / 4 + this.w / 2;
        this.y = 350 / 4 * 3;
        this.sprite = [id("paw"), id("pawPress")];
        this.baseX = this.x;
        this.baseY = 550 * ratio;
        this.centerX = this.x + this.w / 2;
        this.centerY = this.y + this.h / 2;
        this.initialX = this.x;
        this.initialY = this.y;
        this.grabbing = 0;
        this.attached = false;
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

        this.hitbox.x = this.centerX - 5;
        this.hitbox.y = this.centerY - 5;
        this.hitbox.w = 10;
        this.hitbox.h = 10;

        // Trigger the grab
        if (pressed && !this.grabbing && pointSquareCol(mouse, this.hitbox)) {
            this.grabbing = 1;
            pawsCollisions(this.which);

        } else if (this.grabbing && !pressed) {
            this.grabbing = 0;
            pawsCollisions(this.which + 2);
        }
    }
    draw() {
        // Draws the hand
        c.lineWidth = 26 * ratio;
        c.lineCap = "round"
        c.beginPath();
        c.moveTo(this.baseX * ratio, this.baseY * ratio);
        c.lineTo(this.centerX * ratio, (this.centerY + this.h / 2) * ratio);
        c.stroke();
        c.closePath();

        // Draws the paw
        c.drawImage(
            this.sprite[this.grabbing],
            this.x * ratio,
            this.y * ratio,
            this.w * ratio,
            this.h * ratio
        )
        /*
        c.fillRect(
            this.hitbox.x*ratio,
            this.hitbox.y*ratio,
            this.hitbox.w*ratio,
            this.hitbox.h*ratio,
        )
        */
    }
}
var paw1 = new Paw(0);
var paw2 = new Paw(1);

/********************** Cookies **********************/
class Gingerbread {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 48;
        this.h = 64;
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
            this.x * ratio,
            this.y * ratio,
            this.w * ratio,
            this.h * ratio
        )
    }
}
/********************** Glue **********************/
class Glue {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 32;
        this.h = 80;
        this.pressed = 0;
        this.sprite = id("glue");
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
        if (this.leftPaw.attached && this.rightPaw.attached) {
            this.pressed = 1;
        } else {
            this.pressed = 0;
        }
        if (this.leftPaw.attached) {
            this.x = paw1.centerX + this.leftPaw.offsetX;
            this.y = paw1.centerY + this.leftPaw.offsetY;
        } else if (this.rightPaw.attached) {
            this.x = paw2.centerX + this.rightPaw.offsetX;
            this.y = paw2.centerY + this.rightPaw.offsetY;
        }
        if (this.pressed) {
            let x1 = this.x + this.w / 2-2;
            let y1 = this.y-2;
            let w1 = 4;
            let h1 = 4;
            let blob = {
                x1,
                y1,
                w1,
                h1
            }
            goo.push(blob)
        }
    }
    draw() {
        c.drawImage(
            this.sprite,
            0,
            this.h * this.pressed,
            this.w,
            this.h,
            this.x * ratio,
            this.y * ratio,
            this.w * ratio,
            this.h * ratio
        )
    }
}

var glue = new Glue(250, 250);

/********************** Goo coming from the glue **********************/
var goo = [];
function renderGoo() {
    for (let i = 0; i < goo.length; i++) {
        c.fillStyle = "yellow";
        c.fillRect(
            goo[i].x1 * ratio,
            goo[i].y1 * ratio,
            goo[i].w1 * ratio,
            goo[i].h1 * ratio,
        )
    }
}

var gingerbreads = [];
gingerbreads.push(new Gingerbread(50, 50));
console.log(gingerbreads)
/********************** Main loop of the game **********************/
function loop() {
    fpsCounter++;
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "lightgray";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.drawImage(id("bozza"), 0, 0, canvas.width, canvas.height)
    c.fillStyle = "black";

    renderGoo()
    
    // Render gingerbreads
    for (let i = 0; i < gingerbreads.length; i++) {
        gingerbreads[i].compute();
        gingerbreads[i].draw();
    }
    // Render Glue
    glue.compute();
    glue.draw();

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
    mouse.x = e.offsetX / ratio;
    mouse.y = e.offsetY / ratio;
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
                    return true;
                }
            }

        }
    }
    return false;
}

// Collisions between paws and gingerbreads
function pawsCollisions(action) {
    switch (action) {
        case 0: //left press
            for (let i = 0; i < gingerbreads.length; i++) {
                if (!paw1.attached && pointSquareCol({
                        x: paw1.centerX,
                        y: paw1.centerY
                    }, gingerbreads[i])) {
                    paw1.attached = true;
                    gingerbreads[i].leftPaw.attached = true;
                    gingerbreads[i].leftPaw.offsetX = gingerbreads[i].x - paw1.centerX;
                    gingerbreads[i].leftPaw.offsetY = gingerbreads[i].y - paw1.centerY;
                    break;
                }
            }

            if (!paw1.attached && pointSquareCol({
                    x: paw1.centerX,
                    y: paw1.centerY
                }, glue)) {
                paw1.attached = true;
                glue.leftPaw.attached = true;
                glue.leftPaw.offsetX = glue.x - paw1.centerX;
                glue.leftPaw.offsetY = glue.y - paw1.centerY;
                break;
            }
            break;
        case 1: //right press
            for (let i = 0; i < gingerbreads.length; i++) {
                if (!paw2.attached && pointSquareCol({
                        x: paw2.centerX,
                        y: paw2.centerY
                    }, gingerbreads[i])) {
                    paw2.attached = true;
                    gingerbreads[i].rightPaw.attached = true;
                    gingerbreads[i].rightPaw.offsetX = gingerbreads[i].x - paw2.centerX;
                    gingerbreads[i].rightPaw.offsetY = gingerbreads[i].y - paw2.centerY;
                    break;
                }
            }
            if (!paw2.attached && pointSquareCol({
                    x: paw2.centerX,
                    y: paw2.centerY
                }, glue)) {
                paw2.attached = true;
                glue.rightPaw.attached = true;
                glue.rightPaw.offsetX = glue.x - paw2.centerX;
                glue.rightPaw.offsetY = glue.y - paw2.centerY;
                break;
            }
            break;
        case 2: //left release
            for (let i = 0; i < gingerbreads.length; i++) {
                gingerbreads[i].leftPaw.attached = false;
            }
            glue.leftPaw.attached = false;
            paw1.attached = false;
            break;
        case 3: //right release
            for (let i = 0; i < gingerbreads.length; i++) {
                gingerbreads[i].rightPaw.attached = false;
            }
            glue.rightPaw.attached = false;
            paw2.attached = false;
            break;
    }
}
/********************** Call the Main Loop **********************/
loop();
