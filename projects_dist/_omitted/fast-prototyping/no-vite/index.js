import { Entity } from "./Entity.js";
import { World } from "./main.js";
import { Controls } from "./Controls.js";
const canvas = document.getElementById("game-canvas");

const player = new Entity();
player.update = (world) => {
  if (Controls.has("d")) {
    player.xVel += player.speed;
  }
  if (Controls.has("a")) {
    player.xVel += -player.speed;
  }
  player.defaultUpdate(world);
};
const world = new World(canvas);
world.entities.push(player);
world.loop();
