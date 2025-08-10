// TODO
// add slowmo
// add screenshake
// add transition



window.onload = function () {
    if (SL.aG) {
        return;
    }
    SL.compare();
    if (SL && SL.aG) {
        initialize();
    }
}

//prepares the game to launch
function initialize() {
    checkIfWindowOpener();
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
    meta.gotAllPapers = true;
    for (let i = 0; i < meta.papers.length; i++) {
        if (!meta.papers[i]) {
            meta.gotAllPapers = false;
        }
    }
    if (canStorage) {
        let saveCode = {
            currentLevel: map.currentLevel,
            deathCounter: meta.deathCounter,
            hasGrog: player.hasGrog,
            gaveGrog: meta.gaveGrog,
            papers: meta.papers,
            gotAllPapers: meta.gotAllPapers,
            time: meta.cronometer.time,

            deathRecord: meta.deathRecord,
            timeRecord: meta.timeRecord,
            bombRecord: meta.bombRecord,

            berthaDeathRecord: meta.berthaDeathRecord,
            berthaTimeRecord: meta.berthaTimeRecord,
            berthaBombRecord: meta.berthaBombRecord,

            onBertha: meta.onBertha
        }
        if (saveCode.gotAllPapers && JSON.parse(localStorage.getItem("saveCode")).gotAllPapers==false) {
            map.foreground.push(new GallionBerthaUnlocked());
        }
        localStorage.setItem('saveCode', JSON.stringify(saveCode))
    } else {
        debug.log("Unable to save on your current browser");
    }
}

// Loads the game progress from local storage
function loadGame(newGame) {
    if (mapTester) {
        return false;
    }
    if (canStorage && window.localStorage["saveCode"]) {
        let saveCode = JSON.parse(localStorage.getItem("saveCode"));
        if (newGame) {
            map.currentLevel = 0;
            meta.cronometer.time = 0;
            meta.cronometer.resetTimeStamp();
            player.hasGrog = 0;
            meta.deathCounter = 0;
            meta.bombCounter = 0;
        } else {
            map.currentLevel = saveCode.currentLevel || 0;
            meta.deathCounter = saveCode.deathCounter || 0;
            meta.cronometer.time = saveCode.time || 0;
            meta.onBertha = saveCode.onBertha || 0;
            player.hasGrog = saveCode.hasGrog;
            meta.onBertha = saveCode.onBertha || 0;
            meta.bombCounter = saveCode.bombCounter || 0;
        }
        meta.gaveGrog = saveCode.gaveGrog || 0;
        meta.papers = saveCode.papers || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        meta.gotAllPapers = saveCode.gotAllPapers || false;

        meta.deathRecord = saveCode.deathRecord != undefined ? saveCode.deathRecord : "none";
        meta.timeRecord = saveCode.timeRecord != undefined ? saveCode.timeRecord : "none";
        meta.bombRecord = saveCode.bombRecord != undefined ? saveCode.bombRecord : "none";

        meta.berthaDeathRecord = saveCode.berthaDeathRecord != undefined ? saveCode.berthaDeathRecord : "none";
        meta.berthaTimeRecord = saveCode.berthaTimeRecord != undefined ? saveCode.berthaTimeRecord : "none";
        meta.berthaBombRecord = saveCode.berthaBombRecord != undefined ? saveCode.berthaBombRecord : "none";
    }
}

// Loads the current map from the JSON array, initializing the level
var loadCall = false;
var captureCall = false;

function loadLevel() {
    /*
    captureStopMotion();a
    meta.loopType = 1; //transition
    //*/
    player.xVel = 0;
    player.yVel = 0;
    player.currentBomb = 0;
    player.currentPaper = "none";
    player.actionX = player.currentBomb ? player.actionBlack : player.actionPink;
    dialogueEngine.active = false;
    safeEval(map.levels[map.currentLevel])
    if (!player.removed) {
        map.foreground = [];
    }
    if (SL && SL.aG) {
        initializeMap();
    }
    map.cameraFocus = player;
    map.x = -(map.cameraFocus.x + map.cameraFocus.w / 2 - meta.tilesWidth / 2)
    map.y = -(map.cameraFocus.y + map.cameraFocus.h / 2 - meta.tilesHeight / 2)
    if (player.removed) {
        player.removed = false;
        map.foreground.push(new RespawnExplosion(player.x, player.y))
        sounds.respawn.playy();
    }
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

var sounds = new Sounds();

var dialogueEngine = new DialogueEngine();

var mainMenu = new MainMenu();

var instructions = new Instructions();

var achievements = new Achievements();
//window.addEventListener('click', ()=>{achievements.test()});

// Resizes the canvas based on the affordable space
function resizeCanvas(auto) {
    if (auto) {
        let maxW = window.innerWidth / (meta.tilesWidth * meta.tilesize);
        let maxH = window.innerHeight / (meta.tilesHeight * meta.tilesize);
        meta.ratio = maxH < maxW ? maxH | 0 : maxW | 0;
    }
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
    amountX: 0,
    amountY: 0,
    compute: function () {
        if (this.duration == 0) {
            return;
        }
        if (this.duration > 0) {
            this.duration -= meta.deltaTime;
            this.amountX = (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
            this.amountY = (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
            map.x += this.amountX;
            map.y += this.amountY;
        } else {
            this.duration = 0;
            this.amountX = 0;
            this.amountY = 0;
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

/*
the encode:

a2hex(btoa(btoa(a2hex(btoa("string")))))

the decode:

atob(hex2a(atob(atob(hex2a(this.a[i])))))



a2hex func:

function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}

*/
var SL = {
    a: ["546b644e4d6c7045576d704e656b45785431524e65553571597a4e4f56466b78546d3152656b3955597a464f563055785456524f613030795554303d",
             "546b644e4d6c70455754524e656b30785431524e6555355553544e4f56464a71546d3152656b3555576d704f616c45775456524f613030795554303d",
             "546b64524d5535455554564e656b3077575870616145354552544e4f56464a72546b524e656b3545597a513d",
             "546d70524d55394555586c4f656b30795457704e6555354557544a5a616c6c36546e7072656b35555458684f616b6b79576b525a4d453536617a4a4e616b3136546c525a4d303555566d684f52474d78546d70616155354854544a6152453078546d314e4d6b35455558684e4d6c4636576b453950513d3d"],
    aG: false,
    compare: function () {
        let host = window.location.hostname;
        for (let i = 0; i < this.a.length; i++) {
            if (host.search(atob(hex2a(atob(atob(hex2a(this.a[i])))))) !== -1) {
                this.aG = !this.aG;
            }
        }
    }
}



// Main loop of the game
function loop() {
    //updates fps
    meta.updateDeltaTime();
    meta.fps++;
    //clears the screen
    c.clearRect(0, 0, canvas.width, canvas.height);
    if (map.levelImage) {
        c.fillStyle = "#000000"
    } else {
        c.fillStyle = "darkgray"
    }
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
    if (loadCall) {
        loadLevel();
        loadCall = false;
    }
    blackScreen.compute();
    cursor.compute();
    cursor.render();
    meta.cronometer.compute();
    achievements.render();
    requestAnimationFrame(loop);
    //updates delta time
}

function gameLoop() {
    //computing
    map.computeCamera();
    map.computeEntities();
    map.computeVfxs();
    map.computeForeground();
    screenShake.compute();
    instructions.compute();
    slowMo.compute();
    player.compute();
    //drawing
    map.renderBg();
    map.renderTiles();
    map.renderEntities();
    map.renderVfxs();
    dialogueEngine.compute();
    dialogueEngine.render();
    player.render()
    map.renderFront();
    map.renderForeground();
    if (captureCall) {
        captureCall = false;
        captureStopMotion();
    }
    interface.render();
    instructions.render();
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
    transitionVariables.opacity += meta.deltaTime * transitionVariables.speed / 500;
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
    c.lineWidth = 1;
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
