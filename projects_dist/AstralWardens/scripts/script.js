// Whole-script strict mode syntax
"use strict";
/*jshint esversion: 6 */
/*jslint bitwise: true */
function id(arg) {
  return document.getElementById(arg);
}
var canvas = id("canvas");
var c = canvas.getContext("2d");

// Load Objects
var controls = new Controls();

// Load Arrays
var entities = [];
var vfxs = [];
var stars = [];
function populateArrays(){
  let x = 0;
  for (let i = 0; i< 300;i++){
    x = new Asteroid(0,0);
    x.removed=true;
    entities.push(x)
  }
  for (let i = 0; i< 20;i++){
    x = new Bullet(0,0,0);
    x.removed=true;
    entities.push(x)
  }
  for (let i = 0; i< 200;i++){
    x = new FlyVfx(0,0,0,0);
    x.removed=true;
    vfxs.push(x)
  }
  for (let i = 0; i< 50;i++){
    x = new Vfx(0,0,0,0);
    x.removed=true;
    vfxs.push(x)
  }
}
populateArrays();
function reloadEntity(type, arg1, arg2, arg3, arg4) {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].type == type && entities[i].removed) {
      entities[i].reset(arg1,arg2,arg3, arg4)
      return;
    }
  }
  for (let i = 0; i < vfxs.length; i++) {
    if (vfxs[i].type == type && vfxs[i].removed) {
      vfxs[i].reset(arg1,arg2,arg3, arg4)
      return;
    }
  }
  console.log(type+" not found")
}

// Asteroid testing
setInterval(function () {
  reloadEntity("asteroid", Math.random() * meta.tilesWidth, -2)
}, 1500);

var meta = new Meta();
var map = new MapObject();
var gunner = new Gunner();
var puncher = new Puncher();
var player = gunner;

canvas.width = meta.tilesWidth * meta.tilesize * meta.ratio;

canvas.height = meta.tilesHeight * meta.tilesize * meta.ratio;

c.webkitImageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;
c.msImageSmoothingEnabled = false;
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
  // Computing - rendering
  map.compute();
  player.compute();
  computeEntities();
  computeVfxs();


  map.render();
  c.fillStyle = "lightgray";
  c.fillRect(0, 0, canvas.width, canvas.height);
  renderStars();
  player.render();
  renderEntities();
  renderVfxs();

  requestAnimationFrame(loop);
}

///////////// MAIN LOOP /////////////

// Computes each entity if player has submitted a command
function computeEntities() {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].removed) {
      continue;
    }
    entities[i].compute();
  }
}
// Renders each entity
function renderEntities() {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].removed) {
      continue;
    }
    entities[i].render();
  }
}
// Renders VFXs
function computeVfxs() {
  for (let i = 0; i < vfxs.length; i++) {
    if (vfxs[i].removed) {
      continue;
    }
    vfxs[i].compute();
  }
}
// Renders VFXs
function renderVfxs() {
  for (let i = 0; i < vfxs.length; i++) {
    if (vfxs[i].removed) {
      continue;
    }
    vfxs[i].render();
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
      this.amountX = (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
      this.amountY = (Math.random() * 10 - 5) / meta.ratio / meta.tilesize;
      level.x += this.amountX;
      level.y += this.amountY;
    } else {
      this.duration = 0;
      this.amountX = 0;
      this.amountY = 0;
    }
  },
};

//Background Stars

for (let i = 0; i < 300; i++) {
  stars.push(new Star());
}

function renderStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].compute();
    stars[i].render();
  }
}

// Initializes the code once it has finished loading
window.onload = init();
