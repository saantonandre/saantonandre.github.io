function id(arg) {
  return document.getElementById(arg);
}
var canvas = id("canvas");
var c = canvas.getContext("2d");
function init() {
  canvas.width = 900;
  canvas.height = 900;
}
init();
var mineSweeper = new MineSweeper();
var twenty48 = new Twenty48();
var tetris = new Tetris();
var mode = 0;
id("mineSweeper").onclick=function(){
  mode = 0;
  id("title").innerHTML="Mine Sweeper";
};
id("2048").onclick=function(){
  mode = 1;
  id("title").innerHTML="2048";
};
id("tetris").onclick=function(){
  mode = 2;
  id("title").innerHTML="Tetris";
};
function loop() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  switch (mode) {
    case 0:
      mineSweeper.render();
      break;
    case 1:
      twenty48.render();
      break;
    case 2:
      tetris.render();
      break;
  }
  requestAnimationFrame(loop);
}
loop();
