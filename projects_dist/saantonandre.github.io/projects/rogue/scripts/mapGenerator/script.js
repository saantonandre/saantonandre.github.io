/*
1. Have a grid-like system
2. inhabit a room in the center
3. Pick a random inhabited room (Parent)
4. Pick a neighbor of Parent(←,↑,→,↓):
is it free? 
-y: (*) new Child, n: do nothing
5. rooms amount reached? 
-y: end, n: back to 3

(*)Child and Parent will have a connection
*/

/**
 * Need a class which just creates the map and returns it
 * based on parameters
 */
function id(arg) {
  return document.getElementById(arg);
}
var canvas = id("canvas");
var mapGen = new MapGenerator();
var canvas = id("canvas");
var c = canvas.getContext("2d");

id("btn").onclick = generate;
function generate() {
  mapGen.generate();
  mapGen.render();
}
window.onload = generate;
