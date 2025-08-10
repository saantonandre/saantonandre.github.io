// TODO
// add slowmo
// add screenshake
// add transition
window.onload = function () {
    initialize();
}
//prepares the game to launch
function initialize() {
    setInterval(fpsCounter, 1000);
    resizeCanvas();
    if (!mapTester) {
        meta.loopType = 2;
        importLevelsArray(levels);
    } else {
        meta.loopType = 0;
    }
    loop();
}
window.addEventListener('resize', resizeCanvas);
// Saves the game progress on local storage
function saveGame() {
    if (mapTester) {
        return false;
    }
    if (canStorage) {
        let saveCode = {
            currentLevel: map.currentLevel,
        }
        localStorage.setItem('saveCode', JSON.stringify(saveCode))
    } else {
        console.log("Unable to save on your current browser");
    }
}

// Loads the game progress from local storage
function loadGame() {
    if (mapTester) {
        return false;
    }
    if (canStorage && window.localStorage["saveCode"]) {
        let saveCode = JSON.parse(localStorage.getItem("saveCode"));
        map.currentLevel = saveCode.currentLevel;
    } else {
        alert("Nothing to load");
    }
}

// Loads the current map from the JSON array, initializing the level
function loadLevel() {
    /*
    captureStopMotion();
    meta.loopType = 1; //transition
    //*/
    player.xVel = 0;
    player.yVel = 0;
    player.currentBomb = 0;
    safeEval(map.levels[map.currentLevel])
    initializeMap();
    map.cameraFocus = player;
    map.x = -(map.cameraFocus.x + map.cameraFocus.w / 2 - meta.tilesWidth / 2)
    map.y = -(map.cameraFocus.y + map.cameraFocus.h / 2 - meta.tilesHeight / 2)
    saveGame();
}
// Canvas variables
var canvas = id("canvas");
var c = canvas.getContext("2d");

// The meta object contains data about the game itself
var meta = new Meta();

// The game map renderer/computer
var map = new Map();

// The Bomberman
var player = new Player();

// The UI of the standard game loop
var interface = new Interface();

map.cameraFocus = player;

var controls = new Controls();

var cursor = new Cursor();

var mainMenu = new MainMenu();

var sounds = new Sounds();

// Resizes the canvas based on the affordable space
function resizeCanvas() {
    canvas.width = meta.tilesWidth * meta.tilesize * meta.ratio;
    canvas.height = meta.tilesHeight * meta.tilesize * meta.ratio;
    canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + "px";
    canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + "px";
    c.imageSmoothingEnabled = false;
}

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
            this.duration -= 1 * meta.deltaTime;
            map.x += (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
            map.y += (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
        } else {
            this.duration = 0;
        }
    }
}
// To trigger the slowMo: slowMo.duration = x;
var slowMo = {
    duration: 0,
    compute: function () {
        if (this.duration === 1) {
            meta.perfectFrameTime = 1000 / meta.targetFrames;
            this.duration--;
        } else if (this.duration > 1) {
            meta.perfectFrameTime = 1000 / meta.targetFrames * this.duration;
            this.duration--;
        }
    }
}




// Main loop of the game
function loop() {
    //updates fps
    meta.updateDeltaTime();
    meta.fps++;
    //clears the screen
    c.fillStyle = "darkgray"
    c.fillRect(
        0,
        0,
        canvas.width,
        canvas.height)
    //calls the current loop type
    switch (meta.loopType) {
        case 0:
            gameLoop();
            break;
        case 1:
            transitionLoop();
            break;
        case 2:
            menuLoop();
            break;
    }
    blackScreen.compute();
    cursor.compute();
    cursor.render();
    requestAnimationFrame(loop);
    //updates delta time
}

function gameLoop() {
    //computing
    map.computeCamera();
    map.computeEntities();
    map.computeVfxs();
    screenShake.compute();
    slowMo.compute();
    player.compute();
    //drawing
    map.renderTiles();
    map.renderEntities();
    map.renderVfxs();
    player.render()
    interface.render();

}

function captureStopMotion() {
    let img = new Image();
    img.src = canvas.toDataURL();
    transitionVariables.image = img;
}

var transitionVariables = {
    image: 0,
    factor: 200,
    x: 0,
    opacity: 0,
    speed: 10
}

// Call the captureStopMotion() before this
function transitionLoop() {

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
    transitionVariables.x += meta.deltaTime * transitionVariables.speed;
    transitionVariables.opacity += transitionVariables.speed / 500;
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
        meta.loopType = 0;
        transitionVariables.x = 0;
        transitionVariables.opacity = 0;

        blackScreen.initial = 20;
        blackScreen.current = 20;
    }
}

function menuLoop() {
    c.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    )
    mainMenu.compute();
    mainMenu.render();
}


var blackScreen = {
    initial: 100,
    current: 0,
    compute: function () {
        if (this.current > 0) {
            c.globalAlpha = this.current / this.initial;
            //c.fillStyle = "#1c1618";
            c.fillStyle = "black";
            c.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            )
            c.globalAlpha = 1;
            this.current -= meta.deltaTime;
        }
    }
}


//provisional renderer, draws entities as squares
function renderEntity(e) {
    if (isOutOfScreen(e)) {
        return;
    }
    c.strokeStyle = "black";
    c.beginPath();
    c.rect(
        (e.x + map.x) * meta.tilesize * meta.ratio | 0,
        (e.y + map.y) * meta.tilesize * meta.ratio | 0,
        e.w * meta.tilesize * meta.ratio | 0,
        e.h * meta.tilesize * meta.ratio | 0
    );
    c.closePath()
    c.stroke();
}
