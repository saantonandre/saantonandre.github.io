import { Game } from "./Game.js";
//@ts-check

const canvas = (() => {
  const pre = document.createElement("pre");
  document.body.appendChild(pre);
  return pre;
})();

const game = new Game(canvas);

async function loop() {
  await game.compute();
  game.render();
  requestAnimationFrame(loop);
}
game.render();
loop();
