// Whole-script strict mode syntax
'use strict';
/*jshint esversion: 6 */
/*jslint bitwise: true */

var canvas = id("canvas");
var c = canvas.getContext("2d");
var GLOBAL = {
    FPS: 60,
    tilesize: 16,
    baseRatio: 2,
    ratio: 2,
    terminalVel: 0.7,
    baseTargetFrames: 48,
    excessFps: false
}

var metaVariables = {
    loopType: 0
}

// Characters
var officer = {};
var esther = {};


var testMode = false;

window.onload = function () {
    initialize();
}

function initialize() {
    if (window.opener) {
        testMode = true;
        if (window.opener.mapObject) {
            debug.log(window.opener.mapObject);
            safeEval(window.opener.mapObject);
            initializeMap()
        } else {
            safeEval(window.opener.map);
            initializeMap()
        }
    } else {
        load(true);
        //entities.push(new Boss_1(-30, -3));
    }
    //starts the game loop
    gameLoop();
}
if (window.mobileAndTabletCheck()) {
    GLOBAL.baseRatio = 1;
    GLOBAL.ratio = 1;
    id("arrowCont").style.display = "inline-block";
}
//resizes the canvas
canvas.width = GLOBAL.ratio * GLOBAL.tilesize * 30;
canvas.height = GLOBAL.ratio * GLOBAL.tilesize * 18;
//centers the canvas
canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
canvas.style.top = (window.innerHeight - canvas.height) / 4 + "px";
//canvas.width = 2 * GLOBAL.tilesize * 30;
//canvas.height = 2 * GLOBAL.tilesize * 18;
c.imageSmoothingEnabled = false;


var player = new Player(1, 9);
var map = new Map();
map.cameraFocus = player;
var sword = new Sword();
var entities = [];
var animatedTiles = [];
var vfxs = [];


var loadCall = 0;

function unload() {
    // Updates the spawn point
    stages[currentPoint.stage][currentPoint.level].spawnPoint.x = player.x;
    stages[currentPoint.stage][currentPoint.level].spawnPoint.y = player.y;
    // Updates the entities of the unloaded level
    stages[currentPoint.stage][currentPoint.level].entities = entities;
}

function captureStopMotion() {
    let img = new Image();
    img.src = canvas.toDataURL();
    transitionVariables.image = img;
}

function load(instantCall) {
    captureStopMotion();
    if (loadCall || instantCall) {
        safeEval(stages[currentPoint.stage][currentPoint.level]);
        initializeMap();
        loadCall = 0;
    } else {
        loadCall = 1;
    }
}
/* Example animated Tile 
animatedTiles.push(new AnimatedTile(9,9,1,[25,25,25,25],[13,14,15,16]));
*/

//entities.push(new Esther(-1, 9));
function test(what) {
    let dialogue = {
        speaker: 0,
        emotion: 1,
        text: "fanculo la vita tristezza infinita",
        cameraFocus: what
    };
    let dialogue2 = {
        speaker: 3,
        emotion: 2,
        text: "huehuehue",
        cameraFocus: what
    };
    dialogueEngine.loadDialogueQueue([dialogue, dialogue2]);
}
//entities.push(new Interaction(1, 9,test,true));
var dialogueEngine = new DialogueEngine();




// Delta time (the greater it gets, the more imprecise is the computing)
var dT = 1;


// To trigger the screenshakes: screenShake.duration = x;
var screenShake = {
    duration: 0,
    frames: 0,
    compute: function () {
        if (this.frames < this.duration * dT) {
            this.frames++;
            map.x += (Math.random() * 10 - 5) / GLOBAL.ratio / GLOBAL.tilesize;
            map.y += (Math.random() * 10 - 5) / GLOBAL.ratio / GLOBAL.tilesize;
        } else {
            this.duration = 0;
            this.frames = 0;
        }
    }
}


// Delta Time Computing
var perfectFrameTime = 1000 / GLOBAL.baseTargetFrames;
var lastTimestamp = Date.now();
var timestamp = Date.now();

function updateDt() {
    dT = (timestamp - lastTimestamp) / perfectFrameTime;
    lastTimestamp = timestamp;
    if (dT > 2) {
        dT = 2;
    }
}
if (debug.on) {
    canvas.onmousedown = function (e) {
        id("mousePos").innerHTML = "";
        id("mousePos").innerHTML += "x: " + (-map.x + (e.clientX - canvas.offsetLeft) / (GLOBAL.tilesize * GLOBAL.ratio)) + "<br>";
        id("mousePos").innerHTML += "y: " + (map.y + (e.clientY - canvas.offsetTop) / (GLOBAL.tilesize * GLOBAL.ratio));
    }
}
// Slows down every entity by acting on the delta time mechanics
function slowMo() {
    if (slowMoFrames === 1) {
        perfectFrameTime = 1000 / GLOBAL.baseTargetFrames;
        slowMoFrames--;
    } else if (slowMoFrames > 1) {
        perfectFrameTime = 1000 / GLOBAL.baseTargetFrames * slowMoFrames;
        slowMoFrames--;
    }
}
var slowMoFrames = 0;

var fps = 0;
var flash = 0;

function flashEffect(arg) {
    if (arg < 3) {
        c.globalAlpha = arg / 10 * 2;
    }
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.globalAlpha = 1;
}

function fpsCounter() {
    id("fps").innerHTML = fps;
    fps = 0;
}
setInterval(fpsCounter, 1000);


function checkCollisions(obj) {
    let m = map.tiles;
    let col = "none";
    obj.grounded = false;
    obj.col.L = 0;
    obj.col.R = 0;
    obj.col.T = 0;
    obj.col.B = 0;

    for (let i = 0; i < m.length; i++) {
        if (isOutOfScreen(m[i]) || !m[i].solid) {
            continue;
        }
        if (collided(obj, m[i])) {
            col = colCheck(obj, m[i]);
            switch (col) {
                case "b":
                    if (obj.yVel >= 0) {
                        obj.grounded = true;
                        obj.yVel = 0;
                    }
                    break;
            }
        }
    }
    if (obj.type == "player") {
        obj.riding = {
            xVel: 0,
            yVel: 0
        };
        let e = entities;
        for (let i = 0; i < e.length; i++) {
            if (isOutOfScreen(e[i]) || e[i].removed || !e[i].solid) {
                continue;
            }
            if (collided(obj, e[i])) {
                col = colCheck(obj, e[i]);
                switch (col) {
                    case "b":
                        obj.grounded = true;
                        obj.yVel = 0;
                        obj.riding = e[i];
                        break;
                }
            }
        }
    }
    obj.x -= obj.col.R - obj.col.L;
    obj.y -= obj.col.B - obj.col.T - 0.01;
}

function renderEntity(e) {
    if (isOutOfScreen(e)) {
        return;
    }
    c.beginPath();
    c.rect(
        (e.x + map.x) * GLOBAL.tilesize * GLOBAL.ratio | 0,
        (e.y + map.y) * GLOBAL.tilesize * GLOBAL.ratio | 0,
        e.w * GLOBAL.tilesize * GLOBAL.ratio | 0,
        e.h * GLOBAL.tilesize * GLOBAL.ratio | 0
    );
    c.closePath()
    c.stroke();
}

/* EXPERIMENTAL
function renderEntity(e) {
    for (let j = 0; j < e.w; j++) {
        for (let k = 0; k < e.h; k++) {
            let x1 = player.x + player.w / 2;
            let y1 = +35;
            let x2 = e.x + j + 1 / 2;
            let y2 = e.y + k + 1 / 2;
            let deltaX = x2 - x1;
            let deltaY = y2 - y1;
            let rotation = Math.atan2(deltaY, deltaX);
            c.save();
            c.translate(
                (x1 + map.x) * GLOBAL.tilesize * GLOBAL.ratio,
                (y1 + map.y) * GLOBAL.tilesize * GLOBAL.ratio
            );
            // 
            c.rotate((rotation + 1.5707963267948966)/4);

            c.beginPath();
            c.rect(
                (-x1 + e.x + j) * GLOBAL.tilesize * GLOBAL.ratio | 0,
                (-y1 + e.y + k)  * GLOBAL.tilesize * GLOBAL.ratio | 0,
                1 * GLOBAL.tilesize * GLOBAL.ratio | 0,
                1 * GLOBAL.tilesize * GLOBAL.ratio | 0
            );
            c.closePath()
            c.stroke();
            c.restore();
            c.fillRect((x1 + map.x) * GLOBAL.tilesize * GLOBAL.ratio,(y1 + map.y) * GLOBAL.tilesize * GLOBAL.ratio, 2, 2)
        }
    }
}
*/


var blackScreen = {
    initial: 100,
    current: 100
}

/*************************** MAIN LOOP ***************************/
function gameLoop() {
    timestamp = Date.now();
    fps++;
    if (fps > 70) {
        GLOBAL.excessFps = true;
    }
    if (GLOBAL.excessFps) {
        setTimeout(gameLoop, 1000 / 60);
    }

    switch (metaVariables.loopType) {
        case 0:
            standardLoop();
            break;
        case 1:
            transition();
            break;
    }

    if (blackScreen.current > 0) {
        c.globalAlpha = blackScreen.current / blackScreen.initial;
        //c.fillStyle = "#1c1618";
        c.fillStyle = "black";
        c.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        )
        c.globalAlpha = 1;
        blackScreen.current -= dT;
    }
    updateDt();
    if (!GLOBAL.excessFps) {
        requestAnimationFrame(gameLoop);
    }
}
var transitionVariables = {
    image: 0,
    factor: 80,
    x: 0,
    opacity: 0
}

function transition() {
    slowMo();
    c.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    )
    //c.fillStyle = "#1c1618";
    c.fillStyle = "black";
    c.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    )
    for (let i = 0; i < transitionVariables.factor; i++) {
        c.drawImage(
            transitionVariables.image,
            0,
            canvas.height / transitionVariables.factor * i,
            canvas.width,
            canvas.height / transitionVariables.factor,
            transitionVariables.x * (i % 2 * 2 - 1),
            canvas.height / transitionVariables.factor * i,
            canvas.width,
            canvas.height / transitionVariables.factor,
        )
    }
    transitionVariables.x += dT * 10;
    transitionVariables.opacity += 0.02;
    c.globalAlpha = transitionVariables.opacity;
    //c.fillStyle = "#1c1618";
    c.fillStyle = "black";
    c.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    )
    c.globalAlpha = 1;
    if (transitionVariables.opacity >= 1) {
        metaVariables.loopType = 0;
        transitionVariables.x = 0;
        transitionVariables.opacity = 0;

        blackScreen.initial = 60;
        blackScreen.current = 60;
    }
    /**/
}

function standardLoop() {
    slowMo();
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "darkgray";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "black";
    map.computeCamera();
    screenShake.compute();
    map.renderTiles();
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].removed || (entities[i].type != "boss" && isOutOfScreen(entities[i]))) {
            continue;
        }
        entities[i].compute();
        entities[i].render();
    }
    for (let i = 0; i < vfxs.length; i++) {
        if (vfxs[i].removed || isOutOfScreen(vfxs[i])) {
            continue;
        }
        vfxs[i].compute();
        vfxs[i].render();
    }
    for (let i = 0; i < animatedTiles.length; i++) {
        if (isOutOfScreen(animatedTiles[i])) {
            continue;
        }
        animatedTiles[i].render();
    }
    if (!player.dead) {
        player.compute();
        player.render();
        if (!player.onSkate && player.armed) {
            sword.compute();
            sword.render();
        }
    }

    if (flash > 0) {
        flashEffect(flash);
        flash -= 1 * dT;
        //GLOBAL.ratio = GLOBAL.baseRatio * 2;
    } else {
        GLOBAL.ratio = GLOBAL.baseRatio;
    }
    dialogueEngine.compute();
    dialogueEngine.render();
    // If the call has been called, execute it
    if (loadCall) {
        load()
        metaVariables.loopType = 1;
    }
    for (let i = 0; i < levelBoundFunctions[currentPoint.stage][currentPoint.level].length; i++) {
        if (levelBoundFunctions[currentPoint.stage][currentPoint.level][i].removed) {
            continue;
        }
        levelBoundFunctions[currentPoint.stage][currentPoint.level][i].compute();
    }
    //calculating delta time
}
/*************************** MAIN LOOP ***************************/


// Checks for laser collision
function drawLaser(object, direction, hidden) {

    let dir = !direction * 2 - 1;
    let x1 = object.x + object.w / 2,
        y1 = object.y + object.h / 2;
    let found = "block";
    let x2 = x1,
        y2 = y1;
    let collisionFound = false;
    let counter = 0;

    let cosine = returnCosine(x1, y1, x1 + dir, y1);
    let segments = []
    let temp = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,

    }
    let colItem = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
    let step = 0.4;
    let point = {
        x: 0,
        y: 0
    };
    while (!collisionFound && counter * GLOBAL.ratio < (canvas.width)) {

        x2 -= cosine.cos * step;
        y2 -= cosine.sin * step;
        for (let i = 0; i < map.tiles.length; i++) {
            let pnt = {
                x: x2,
                y: y2
            }
            if (pointSquareCol(pnt, map.tiles[i])) {
                temp = map.tiles[i];
                colItem.x = temp.x;
                colItem.y = temp.y;
                colItem.w = temp.w;
                colItem.h = temp.h;
                colItem.x += x2 - (x2 % (GLOBAL.tilesize * GLOBAL.ratio));
                colItem.y += y2 - (y2 % (GLOBAL.tilesize * GLOBAL.ratio));
                collisionFound = true;
            }
        }
        point.x = x2;
        point.y = y2;

        /* Checks for player*/
        if (pointSquareCol(point, player)) {
            colItem.x = player.x;
            colItem.y = player.y;
            colItem.w = player.w;
            colItem.h = player.h;
            collisionFound = true;
            found = "player";
            break;
        }
        /* Checks for entities
        for (let i = 0; i < entities.length; i++) {
            if (pointSquareCol(point, entities[i])) {
                colItem.x = entities[i].x;
                colItem.y = entities[i].y;
                colItem.w = entities[i].w;
                colItem.h = entities[i].h;
                collisionFound = true;
                break;
            }

        }
        */
        counter++;
    }
    segments = getRectSides(colItem);
    let points = [];
    let temp2 = {},
        temp3;
    for (let i = 0; i < segments.length; i++) {
        temp2 = intersect(x1, y1, x2, y2, segments[i].x1, segments[i].y1, segments[i].x2, segments[i].y2);
        if (temp2) {
            points.push(temp2);
        }
    }

    let d = Math.hypot((x1 - x2), (y1 - y2)),
        x3 = x2,
        y3 = x2;
    for (let i = 0; i < points.length; i++) {
        temp3 = Math.hypot((x1 - x2), (y1 - y2))

        if (temp3 < d) {
            d = temp3;
            x3 = points[i].x;
            y3 = points[i].y;
        }
    }



    if (hidden) {
        return found;
    }

    c.strokeStyle = "#ff0000";
    c.beginPath();
    c.moveTo((x1 + map.x) * GLOBAL.ratio * GLOBAL.tilesize, (y1 + map.y) * GLOBAL.ratio * GLOBAL.tilesize);
    c.lineTo((x2 + map.x) * GLOBAL.ratio * GLOBAL.tilesize, (y2 + map.y) * GLOBAL.ratio * GLOBAL.tilesize);
    c.stroke();
    c.strokeStyle = "black";
    return found;
}
