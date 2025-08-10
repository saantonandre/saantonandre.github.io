var meta = new Meta();

// Canvas setup
var canvas = id("canvas");
canvas.width = meta.tilesWidth * meta.tileSize * meta.ratio;
canvas.height = meta.tilesHeight * meta.tileSize * meta.ratio;
var c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;

var controls = new Controls()
var player = new Player(0, 0);
var baolo = new Baolo(0, 0);
// Game loop
function loop() {
    meta.updateDeltaTime();
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.compute();
    player.render();
    baolo.compute();
    baolo.render();
    requestAnimationFrame(loop);
}

// Starts the loop
loop();