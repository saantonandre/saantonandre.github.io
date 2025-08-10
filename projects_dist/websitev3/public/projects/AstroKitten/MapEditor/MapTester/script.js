var meta = new Meta();
// Canvas setup
var canvas = id("canvas");
if (isMobile) {
    meta.baseRatio = window.innerWidth / (meta.tileSize * meta.baseTilesWidth);
}
canvas.width = meta.baseTilesWidth * meta.tileSize * meta.baseRatio;
canvas.height = meta.baseTilesHeight * meta.tileSize * meta.baseRatio;
var c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;


var controls = new Controls();

var map = new GameMap();

var player = new Player(4, 4);

map.cameraFocus = player;

var spaceBackground;

var entities = [];
var particles = [];
/*
entities.push(new Block(0, 0, 20, 1));
entities.push(new Block(0, 1, 1, 16));
entities.push(new Block(1, 16, 20, 1));
entities.push(new Block(20, 0, 1, 16));
*/


///////////////////// INITIALIZATION /////////////////////
window.onload = function () {
    initialize();
}
//prepares the game to launch
function initialize() {
    setInterval(fpsCounter, 1000);
    importLevelsArray(levels);
    spaceBackground = new SpaceBackground();
    checkIfWindowOpener();
    loop();
    resizeCanvas();
}

function resizeCanvas() {
    canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
    canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
    c.imageSmoothingEnabled = false;
}




function loop() {
    meta.updateDeltaTime();
    meta.fps++;
    if (controls.e) {
        if (meta.loopType == 0) {
            meta.loopType = 1;
        } else {
            {
                meta.loopType = 0;
            }
        }
    }
    switch (meta.loopType) {
        case 0:
            mainLoop();
            break;
        case 1:
            // Pause
            break;
    }
    requestAnimationFrame(loop);
}

function mainLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    spaceBackground.compute();
    spaceBackground.render();
    c.beginPath();
    c.rect(
        0,
        0,
        canvas.width,
        canvas.height
    )
    c.stroke();
    c.closePath();
    screenShake.compute();

    map.computeCamera();
    map.renderTiles();
    map.computeEntities();
    map.renderEntities();
    map.computeVfxs();
    map.renderVfxs();
    player.compute();
    player.render();

    player.ui.compute();
    player.ui.render();
}


// Loads the levels (generated via the map editor) to the map.levels
function importLevelsArray(levelsArray) {
    map.levels = JSON.parse(JSON.stringify(levelsArray));
    safeEval(levelsArray[map.currentLevel]);
    initializeMap()
}

function loadLevel() {
    /*
    captureStopMotion();
    meta.loopType = 1; //transition
    //*/
    player.xVel = 0;
    player.yVel = 0;
    safeEval(map.levels[map.currentLevel])
    initializeMap();
    map.cameraFocus = player;
    map.x = -(map.cameraFocus.x + map.cameraFocus.w / 2 - meta.tilesWidth / 2)
    map.y = -(map.cameraFocus.y + map.cameraFocus.h / 2 - meta.tilesHeight / 2)
    saveGame();
}
// Resizes the canvas based on the affordable space
window.addEventListener('resize', resizeCanvas);

//Called on an interval, updates the fps counter
function fpsCounter() {
    id("fps").innerHTML = meta.fps;
    meta.fps = 0;
}

// To trigger the screenshakes: screenShake.duration = x;
var screenShake = {
    duration: 0,
    compute: function () {
        if (this.duration > 0) {
            this.duration -= meta.deltaTime;
            map.x += (Math.random() * 10 - 5) / meta.ratio / meta.tileSize;
            map.y += (Math.random() * 10 - 5) / meta.ratio / meta.tileSize;
        } else {
            this.duration = 0;
        }
    }
}
//provisional renderer, draws entities as squares
function renderEntity(e) {
    if (isOutOfScreen(e)) {
        return;
    }
    c.fillStyle = "#f5ffe8";
    c.fillRect(
        (e.x + map.x) * meta.tileSize * meta.ratio | 0,
        (e.y + map.y) * meta.tileSize * meta.ratio | 0,
        e.w * meta.tileSize * meta.ratio | 0,
        e.h * meta.tileSize * meta.ratio | 0
    );
    // Bottom shadow
    let shadowHeight = 0.2;
    c.fillStyle = "#a3a7c2";
    c.fillRect(
        (e.x + map.x) * meta.tileSize * meta.ratio | 0,
        (e.y + e.h - shadowHeight + map.y) * meta.tileSize * meta.ratio | 0,
        e.w * meta.tileSize * meta.ratio | 0,
        shadowHeight * meta.tileSize * meta.ratio | 0
    );
    c.strokeStyle = "#14182e";
    c.beginPath();
    c.rect(
        (e.x + map.x) * meta.tileSize * meta.ratio | 0,
        (e.y + map.y) * meta.tileSize * meta.ratio | 0,
        e.w * meta.tileSize * meta.ratio | 0,
        e.h * meta.tileSize * meta.ratio | 0
    );
    c.closePath()
    c.stroke();
}