function id(arg) {
  return document.getElementById(arg);
}
var canvas = id("canvas");
var c = canvas.getContext("2d");
// Load Objects
var controls = new Controls();
var mouse = new Mouse();
var meta = new Meta();
var player = new Player(10.5,7.5);
var map = new MapObject();
map.cameraFocus = player;
var vfxsManager = new VfxsManager();
var userInterface = new UserInterface(player);
canvas.width = meta.tilesWidth*meta.ratio*meta.tileSize;
canvas.height = meta.tilesHeight*meta.ratio*meta.tileSize;
c.imageSmoothingEnabled = false;

 // Debug tool
var debugToolTip = new DebugToolTip;

//Git Test
function init() {
  resizeCanvas();
  loop();
  console.log("Initializing");
}
// Resizes the canvas when the browser size changes  
function resizeCanvas() {
  canvas.style.position = "absolute";
  canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
  canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
  canvas.width = meta.tilesWidth*meta.ratio*meta.tileSize;
  canvas.height = meta.tilesHeight*meta.ratio*meta.tileSize;
  c.imageSmoothingEnabled = false;

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
  c.fillStyle = "#14182e";
  c.fillRect(0, 0, canvas.width, canvas.height);



  map.computeCamera();
  screenShake.compute();
  computeEntities();
  map.sortEntities();
  map.render();
  renderShadows();
  renderEntities();
  vfxsManager.compute()
  vfxsManager.render()


  map.renderMinimap();
  userInterface.compute();
  userInterface.render();

  // Debugging tool
  debugToolTip.compute();


  requestAnimationFrame(loop);
}

///////////// MAIN LOOP /////////////

// Computes each entity 
function computeEntities() {
  for (let entity of map.entities) {
    if (entity.removed) {
      continue;
    }
    entity.compute();
  }
}
// Renders each entity
function renderEntities() {
  for (let entity of map.entities) {
    if (entity.removed) {
      continue;
    }
    entity.render();
  }
}
// Renders shadows
function renderShadows() {
  c.globalAlpha=0.5;
  for (let entity of map.entities) {
    if (entity.removed || !entity.shadow) {
      continue;
    }
    entity.renderShadow();
  }
  c.globalAlpha=1;
}

//* To trigger the screenshakes: screenShake.duration = x;
var screenShake = {
  duration: 0,
  changeX: 0,
  changeY: 0,
  compute: function () {
    if (this.duration > 0) {
      this.resetChanges();
      this.duration -= meta.deltaTime;
      let changeX = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize
      let changeY = (Math.random() * 10 - 5) / meta.ratio / meta.tileSize
      map.x += changeX;
      map.y += changeY;

      this.changeX += changeX;
      this.changeY += changeY;
    } else {
      this.duration = 0;
    }
  },
  resetChanges() {
    //resets the changes
    map.x -= this.changeX;
    map.y -= this.changeY;
    this.changeX = 0;
    this.changeY = 0;
  }
}

// Initializes the code once it has finished loading
window.onload = init();