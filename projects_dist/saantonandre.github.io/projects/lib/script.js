function id(arg) {
  return document.getElementById(arg);
}
var canvas = id("canvas");
var c = canvas.getContext("2d");
// Load Objects
var controls = new Controls();
var mouse = new Mouse();
var player = new Player(4, 4);
var meta = new Meta();

// Load Arrays
var entities = [];
//entities.push(new Enemy(1, 2));
var mapGen = new MapGenerator();
var levelGen = new LevelGenerator();
var map = new MapObject();
var vfxsManager = new VfxsManager();
var userInterface = new UserInterface();
canvas.width = 800;
canvas.height = 600;
c.imageSmoothingEnabled = false;

function init() {
  resizeCanvas();
  loop();
  console.log("Initializing");
}

function resizeCanvas() {
  canvas.style.position = "absolute";
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
  map.x = (canvas.width / meta.tileSize / meta.ratio - map.roomsW)/2;
  map.y = (canvas.height / meta.tileSize / meta.ratio - map.roomsH)/2;
  
}
window.onresize = resizeCanvas;

//Called on an interval, updates the fps counter
setInterval(fpsCounter, 1000);
function fpsCounter() {
  id("fps").innerHTML = meta.fps;
  meta.fps = 0;
}

///////////// MAIN LOOP /////////////

function loop() {
  meta.updateDeltaTime();
  meta.fps++;
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  map.render();
  player.compute();
  vfxsManager.compute()
  computeEntities();
  renderEntities();
  player.render();
  vfxsManager.render()
  map.renderMinimap();
  userInterface.render();

  requestAnimationFrame(loop);
}

///////////// MAIN LOOP /////////////

// Computes each entity if player has submitted a command
function computeEntities() {
  let entities = map.map[map.currentLevel[0]][map.currentLevel[1]].entities;
  for (let i = 0; i < entities.length; i++) {
    if(entities[i].removed){
      continue;
    }
    entities[i].compute();
  }
}
// Renders each entity
function renderEntities() {
  let entities = map.map[map.currentLevel[0]][map.currentLevel[1]].entities;
  for (let i = 0; i < entities.length; i++) {
    if(entities[i].removed){
      continue;
    }
    entities[i].render();
  }
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
      this.amountX = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize;
      this.amountY = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize;
      level.x += this.amountX;
      level.y += this.amountY;
    } else {
      this.duration = 0;
      this.amountX = 0;
      this.amountY = 0;
    }
  },
};

// Initializes the code once it has finished loading
window.onload = init();
