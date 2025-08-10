import { Neuro } from "game/entities/Neuro";
import Player from "modules/actors/player";
import Camera from "modules/camera";
import GameCanvas from "modules/canvas";
import debug from "modules/debug";
import Entity from "modules/entity";
import Meta from "modules/meta";

const canvas = new GameCanvas();
const meta = new Meta();
const camera = new Camera();
const player = new Neuro(
  canvas.width / 2 / meta.tilesize / meta.ratio,
  canvas.height / 2 / meta.tilesize / meta.ratio,
  canvas,
  meta,
  camera
);
export const initializeGame = () => {
  loop();
};
const entities: Entity[] = [player];
const loop = () => {
  meta.compute();
  canvas.clear();
  for (const e of entities) {
    e.compute(meta.deltaTime, entities);
  }
  for (const e of entities) {
    e.render(canvas.context, meta.tilesize, meta.ratio, camera);
  }
  debug.render(canvas.context, meta.tilesize, meta.ratio, camera);
  requestAnimationFrame(loop);
};

export default initializeGame;
